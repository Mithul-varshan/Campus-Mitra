import axios from "axios";
import env from "../config/env.js";

// In-memory cache for GitHub stats (10 minutes TTL)
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key, data) {
  cache.set(key, { timestamp: Date.now(), data });
}

function getAuthHeaders(userToken) {
  const token = userToken || env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  return token
    ? {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "CampusMithra-App",
      }
    : {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "CampusMithra-App",
      };
}

/**
 * GET /api/github/stats/:username
 * Consolidated stats endpoint: profile, repos, stars, forks, top languages
 */
export async function getGitHubStats(req, res) {
  const { username } = req.params;
  const userToken = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const forceRefresh = req.query.refresh === "true";

  if (!username) {
    return res.status(400).json({ error: "GitHub username is required" });
  }

  const cacheKey = `gh_stats:${username.toLowerCase()}`;
  if (!forceRefresh) {
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ ...cached, isFromCache: true });
    }
  }

  try {
    const headers = getAuthHeaders(userToken);

    // Fetch user profile and repositories in parallel
    const [profileRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers,
        timeout: 7000,
      }),
      axios.get(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
        { headers, timeout: 8000 }
      ),
    ]);

    const profile = profileRes.data || {};
    const repos = Array.isArray(reposRes.data) ? reposRes.data : [];
    const originalRepos = repos.filter((r) => !r.fork);

    // Calculate aggregated metrics
    const stars = originalRepos.reduce(
      (sum, r) => sum + (r.stargazers_count || 0),
      0
    );
    const forks = originalRepos.reduce(
      (sum, r) => sum + (r.forks_count || 0),
      0
    );
    const openIssues = originalRepos.reduce(
      (sum, r) => sum + (r.open_issues_count || 0),
      0
    );

    // Aggregate primary languages
    const languageCounts = {};
    for (const r of repos) {
      if (r.language) {
        languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
      }
    }
    const topLanguages = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Prepare top recent repos
    const recentRepos = repos.slice(0, 8).map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description || "No description provided",
      htmlUrl: r.html_url,
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      language: r.language || "Other",
      updatedAt: r.updated_at,
      isPrivate: Boolean(r.private),
    }));

    const payload = {
      username: profile.login || username,
      name: profile.name || "",
      avatarUrl: profile.avatar_url || "",
      profileUrl: profile.html_url || `https://github.com/${username}`,
      bio: profile.bio || "",
      company: profile.company || "",
      location: profile.location || "",
      publicRepos: profile.public_repos || repos.length,
      followers: profile.followers || 0,
      following: profile.following || 0,
      stars,
      forks,
      openIssues,
      topLanguages,
      repos: recentRepos,
      dataSource: "github-live",
      fetchedAt: new Date().toISOString(),
    };

    setCached(cacheKey, payload);
    return res.json(payload);
  } catch (err) {
    const isRateLimit =
      err.response?.status === 403 &&
      err.response?.headers?.["x-ratelimit-remaining"] === "0";

    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({
        ...cached,
        isFromCache: true,
        warning: isRateLimit
          ? "GitHub API rate limit reached. Displaying cached data."
          : "Network issue. Displaying cached data.",
      });
    }

    return res.status(err.response?.status || 500).json({
      error: isRateLimit
        ? "GitHub API rate limit exceeded. Log in with GitHub or add GITHUB_TOKEN to server/.env"
        : "Failed to fetch GitHub profile",
      message: err.message,
    });
  }
}

/**
 * GET /api/github/repos/:username
 * Clean repository list for project linking
 */
export async function getGitHubRepos(req, res) {
  const { username } = req.params;
  const userToken = req.headers.authorization?.replace(/^Bearer\s+/i, "");

  try {
    const headers = getAuthHeaders(userToken);
    const endpoint = userToken
      ? "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member"
      : `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;

    const response = await axios.get(endpoint, { headers, timeout: 8000 });
    const repos = (response.data || []).map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner?.login || username,
      description: repo.description,
      htmlUrl: repo.html_url,
      updatedAt: repo.updated_at,
      language: repo.language,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      openIssues: repo.open_issues_count || 0,
      status: repo.archived ? "Archived" : "Active",
      visibility: repo.private ? "Private" : "Public",
    }));

    return res.json(repos);
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      error: "Failed to fetch GitHub repositories",
      message: err.message,
    });
  }
}
