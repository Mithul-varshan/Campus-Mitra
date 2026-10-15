import axios from "axios";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";
const CACHE_PREFIX = "campusos_github_cache_v1";
const REPOS_CACHE_TTL_MS = 10 * 60 * 1000;
const DASHBOARD_CACHE_TTL_MS = 5 * 60 * 1000;
const COMMIT_CACHE_TTL_MS = 30 * 60 * 1000;
const ACTIVITY_CACHE_TTL_MS = 5 * 60 * 1000;

const githubHeaders = GITHUB_TOKEN
  ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
  : {};

function cacheKey(key) {
  return `${CACHE_PREFIX}:${key}`;
}

function readCache(key, ttlMs) {
  try {
    const raw = localStorage.getItem(cacheKey(key));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const isExpired = Date.now() - (parsed.timestamp || 0) > ttlMs;
    if (isExpired) {
      localStorage.removeItem(cacheKey(key));
      return null;
    }

    return parsed.data ?? null;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(
      cacheKey(key),
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    );
  } catch {
    // ignore cache write failures
  }
}

export async function getRepoLanguages(username, repoName) {
  const url = `https://api.github.com/repos/${username}/${repoName}/languages`;
  const response = await axios.get(url, { headers: githubHeaders });
  return response.data;
}

export async function getProfileLanguageStats(username, repos) {
  const aggregateLanguages = {};

  for (const repo of repos) {
    try {
      const repoLangs = await getRepoLanguages(username, repo.name);

      for (const [lang, bytes] of Object.entries(repoLangs)) {
        aggregateLanguages[lang] = (aggregateLanguages[lang] || 0) + bytes;
      }
    } catch {
      // Skip language stats for repos that fail due to rate limits or visibility
    }
  }

  return Object.entries(aggregateLanguages)
    .sort(([, a], [, b]) => b - a)
    .map(([name, bytes]) => ({ name, bytes }));
}

export async function getRepoCommitCount(username, repoName) {
  const commitCacheKey = `${username}:commit:${repoName}`;
  const cachedCommitCount = readCache(commitCacheKey, COMMIT_CACHE_TTL_MS);
  if (typeof cachedCommitCount === "number") {
    return cachedCommitCount;
  }

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}/commits?per_page=1`,
      { headers: githubHeaders },
    );

    // GitHub returns Link header with pagination info
    // For total count, check the link header or return response length
    const linkHeader = response.headers.link;
    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        const value = parseInt(lastPageMatch[1], 10);
        writeCache(commitCacheKey, value);
        return value;
      }
    }

    // Fallback: return 0 (pagination wasn't available)
    writeCache(commitCacheKey, 0);
    return 0;
  } catch {
    // Silent fail for private repos or rate limits
    return 0;
  }
}

export async function getGithubReposForLinking(username, githubToken = "") {
  const reposCacheKey = `${username}:repos-for-linking:${githubToken ? "oauth" : "public"}`;
  const cachedRepos = readCache(reposCacheKey, REPOS_CACHE_TTL_MS);
  if (Array.isArray(cachedRepos)) {
    return cachedRepos;
  }

  const headers = githubToken
    ? {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
      }
    : githubHeaders;

  let reposResponse;

  try {
    const endpoint = githubToken
      ? "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member"
      : `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

    reposResponse = await axios.get(endpoint, { headers });
  } catch {
    reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers: githubHeaders },
    );
  }

  const mappedRepos = [...(reposResponse.data || [])]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .map((repo) => ({
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
      archived: Boolean(repo.archived),
      private: Boolean(repo.private),
      fork: Boolean(repo.fork),
      status: repo.archived ? "Archived" : "Active",
      visibility: repo.private ? "Private" : "Public",
    }));

  writeCache(reposCacheKey, mappedRepos);
  return mappedRepos;
}

export async function getGithubDashboardStats(username, options = {}) {
  const { forceRefresh = false, userToken = "" } = options;
  const dashboardCacheKey = `${username}:dashboard-stats`;

  if (!forceRefresh) {
    const cachedDashboardStats = readCache(dashboardCacheKey, DASHBOARD_CACHE_TTL_MS);
    if (cachedDashboardStats && typeof cachedDashboardStats === "object") {
      return { ...cachedDashboardStats, isFromCache: true };
    }
  }

  // 1. Try CampusMithra Server Proxy
  const serverBase = import.meta.env.VITE_OAUTH_SERVER_URL || "http://localhost:3001";
  try {
    const token = userToken || localStorage.getItem("campusos_github_token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(
      `${serverBase}/api/github/stats/${encodeURIComponent(username)}${forceRefresh ? "?refresh=true" : ""}`,
      { headers, timeout: 7000 }
    );
    if (res.data && !res.data.error) {
      writeCache(dashboardCacheKey, res.data);
      return res.data;
    }
  } catch (serverErr) {
    // If rate-limited on server, return cached if available
    if (serverErr.response?.data?.isFromCache) {
      return serverErr.response.data;
    }
  }

  // 2. Direct client fallback to api.github.com
  try {
    const token = userToken || localStorage.getItem("campusos_github_token") || GITHUB_TOKEN;
    const directHeaders = token
      ? { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" }
      : githubHeaders;

    const [profileResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: directHeaders,
        timeout: 6000,
      }),
      axios.get(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
        { headers: directHeaders, timeout: 6000 }
      ),
    ]);

    const profile = profileResponse.data;
    const repos = Array.isArray(reposResponse.data) ? reposResponse.data : [];
    const originalRepos = repos.filter((repo) => !repo.fork);

    const stars = originalRepos.reduce(
      (total, repo) => total + (repo.stargazers_count || 0),
      0,
    );
    const forks = originalRepos.reduce(
      (total, repo) => total + (repo.forks_count || 0),
      0,
    );
    const openIssues = originalRepos.reduce(
      (total, repo) => total + (repo.open_issues_count || 0),
      0,
    );

    const sortedRepos = [...originalRepos]
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
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

    const languageStats = await getProfileLanguageStats(
      username,
      sortedRepos.slice(0, 10),
    );

    const dashboardStats = {
      username: profile.login,
      name: profile.name || "",
      bio: profile.bio || "",
      company: profile.company || "",
      location: profile.location || "",
      blog: profile.blog || "",
      avatarUrl: profile.avatar_url,
      profileUrl: profile.html_url,
      publicRepos: profile.public_repos || repos.length,
      followers: profile.followers || 0,
      following: profile.following || 0,
      stars,
      forks,
      openIssues,
      topLanguages: languageStats.slice(0, 4),
      repos: sortedRepos,
      dataSource: "github-direct",
    };

    writeCache(dashboardCacheKey, dashboardStats);
    return dashboardStats;
  } catch (directErr) {
    const isRateLimited = directErr.response?.status === 403;
    const cached = readCache(dashboardCacheKey, 24 * 60 * 60 * 1000); // accept older cache on failure
    if (cached) {
      return {
        ...cached,
        isFromCache: true,
        warning: isRateLimited
          ? "GitHub API rate limit reached. Displaying saved snapshot."
          : "Could not reach GitHub. Displaying saved snapshot.",
      };
    }
    throw directErr;
  }
}

export async function getGithubRecentActivity(username) {
  const activityCacheKey = `${username}:recent-activity`;
  const cachedActivity = readCache(activityCacheKey, ACTIVITY_CACHE_TTL_MS);
  if (Array.isArray(cachedActivity)) {
    return cachedActivity;
  }

  const eventsResponse = await axios.get(
    `https://api.github.com/users/${username}/events/public?per_page=20`,
    { headers: githubHeaders },
  );

  const mapped = (eventsResponse.data || []).slice(0, 8).map((event) => ({
    id: event.id,
    type: event.type,
    repoName: event.repo?.name || "Unknown repo",
    createdAt: event.created_at,
    action: mapEventTypeToAction(event.type),
  }));

  writeCache(activityCacheKey, mapped);
  return mapped;
}

function mapEventTypeToAction(type) {
  const map = {
    PushEvent: "Pushed commits",
    PullRequestEvent: "Updated pull request",
    IssuesEvent: "Worked on issue",
    WatchEvent: "Starred a repository",
    CreateEvent: "Created branch/tag",
    ForkEvent: "Forked repository",
    ReleaseEvent: "Published release",
  };
  return map[type] || "Updated repository";
}
