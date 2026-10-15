import axios from "axios";
import env from "../config/env.js";

const LOCAL_LEETCODE_URL = env.LEETCODE_API_URL || "http://localhost:3000";
const REMOTE_LEETCODE_URL = "https://alfa-leetcode-api.onrender.com";

// In-memory cache for LeetCode server responses (5 minutes TTL)
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

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

/**
 * Helper to fetch from local Docker API first, fallback to hosted Render API
 */
async function fetchWithFallback(subpath, timeoutMs = 4000) {
  // Try local Docker container first
  try {
    const res = await axios.get(`${LOCAL_LEETCODE_URL}${subpath}`, {
      timeout: timeoutMs,
    });
    return { data: res.data, source: "docker-local" };
  } catch (localErr) {
    // If local fails, try hosted alfa-leetcode-api
    try {
      const res = await axios.get(`${REMOTE_LEETCODE_URL}${subpath}`, {
        timeout: 8000,
      });
      return { data: res.data, source: "render-hosted" };
    } catch (remoteErr) {
      throw new Error(
        `Failed to reach LeetCode API (local: ${localErr.message}, remote: ${remoteErr.message})`
      );
    }
  }
}

/**
 * Health check: tests connectivity to local docker and remote API
 */
export async function checkLeetCodeHealth(_req, res) {
  let localOk = false;
  let remoteOk = false;

  try {
    const r = await axios.get(`${LOCAL_LEETCODE_URL}`, { timeout: 2000 });
    localOk = r.status < 500;
  } catch {
    localOk = false;
  }

  try {
    const r = await axios.get(`${REMOTE_LEETCODE_URL}`, { timeout: 4000 });
    remoteOk = r.status < 500;
  } catch {
    remoteOk = false;
  }

  return res.json({
    status: localOk || remoteOk ? "ok" : "degraded",
    local: {
      url: LOCAL_LEETCODE_URL,
      available: localOk,
    },
    remote: {
      url: REMOTE_LEETCODE_URL,
      available: remoteOk,
    },
  });
}

/**
 * Consolidated stats endpoint: gathers profile, solved, contest, badges, and recent AC submissions
 * GET /api/leetcode/stats/:username
 */
export async function getConsolidatedStats(req, res) {
  const { username } = req.params;
  const forceRefresh = req.query.refresh === "true";

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const cacheKey = `stats:${username.toLowerCase()}`;
  if (!forceRefresh) {
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }
  }

  try {
    const [profileRes, solvedRes, contestRes, badgesRes, calendarRes, acSubRes] =
      await Promise.allSettled([
        fetchWithFallback(`/${encodeURIComponent(username)}`),
        fetchWithFallback(`/${encodeURIComponent(username)}/solved`),
        fetchWithFallback(`/${encodeURIComponent(username)}/contest`),
        fetchWithFallback(`/${encodeURIComponent(username)}/badges`),
        fetchWithFallback(`/${encodeURIComponent(username)}/calendar`),
        fetchWithFallback(`/${encodeURIComponent(username)}/acSubmission?limit=5`),
      ]);

    const profile = profileRes.status === "fulfilled" ? profileRes.value.data : {};
    const solved = solvedRes.status === "fulfilled" ? solvedRes.value.data : {};
    const contest = contestRes.status === "fulfilled" ? contestRes.value.data : {};
    const badgesData = badgesRes.status === "fulfilled" ? badgesRes.value.data : {};
    const calendar = calendarRes.status === "fulfilled" ? calendarRes.value.data : {};
    const acSub = acSubRes.status === "fulfilled" ? acSubRes.value.data : {};

    const easySolved = Number(solved.easySolved ?? 0);
    const mediumSolved = Number(solved.mediumSolved ?? 0);
    const hardSolved = Number(solved.hardSolved ?? 0);
    const totalSolved =
      Number(solved.solvedProblem ?? solved.totalSolved) ||
      easySolved + mediumSolved + hardSolved;
    const totalQuestions = Number(solved.totalQuestions || 3850);

    const progressPercent =
      totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;

    const payload = {
      username: profile.username || username,
      realName: profile.name || "",
      avatar: profile.avatar || "",
      ranking: Number(profile.ranking || 0),
      reputation: Number(profile.reputation || 0),
      country: profile.country || "",
      school: profile.school || "",
      skillTags: Array.isArray(profile.skillTags) ? profile.skillTags : [],
      easySolved,
      mediumSolved,
      hardSolved,
      totalSolved,
      totalQuestions,
      progressPercent,
      contestRating: Math.trunc(Number(contest.contestRating || 0)),
      contestGlobalRanking: Number(contest.contestGlobalRanking || 0),
      contestAttend: Number(contest.contestAttend || 0),
      contestTopPercentage: Number(contest.contestTopPercentage || 0),
      badgesCount: Number(badgesData.badgesCount || badgesData.badges?.length || 0),
      badges: Array.isArray(badgesData.badges) ? badgesData.badges.slice(0, 8) : [],
      streak: Number(calendar.streak || 0),
      totalActiveDays: Number(calendar.totalActiveDays || 0),
      recentAcSubmissions: Array.isArray(acSub.submission)
        ? acSub.submission.slice(0, 5)
        : [],
      dataSource:
        solvedRes.status === "fulfilled" ? solvedRes.value.source : "fallback",
      fetchedAt: new Date().toISOString(),
    };

    setCached(cacheKey, payload);
    return res.json(payload);
  } catch (err) {
    return res.status(502).json({
      error: "Failed to fetch LeetCode statistics",
      message: err.message,
    });
  }
}

/**
 * Proxy specific sub-paths like /:username/solved, /:username/badges, etc.
 * GET /api/leetcode/proxy/:username/:subpath
 */
export async function proxyLeetcodeRequest(req, res) {
  const { username, subpath } = req.params;
  const queryString = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";

  try {
    const result = await fetchWithFallback(
      `/${encodeURIComponent(username)}/${subpath}${queryString}`
    );
    return res.json(result.data);
  } catch (err) {
    return res.status(502).json({
      error: `Failed to proxy /${username}/${subpath}`,
      message: err.message,
    });
  }
}
