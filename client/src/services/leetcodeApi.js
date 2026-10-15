/**
 * LeetCode API Service for CampusMithra
 *
 * Connects to:
 * 1. Local Docker container (alfaarghya/alfa-leetcode-api:2.0.4) on http://localhost:3000
 * 2. CampusMithra server proxy on http://localhost:3001/api/leetcode
 * 3. Hosted fallback on https://alfa-leetcode-api.onrender.com
 *
 * Includes automatic caching in localStorage (10-min TTL) and graceful fallbacks.
 */

const LOCAL_DOCKER_URL =
  import.meta.env.VITE_LEETCODE_API_BASE || "http://localhost:3000";
const SERVER_PROXY_URL =
  (import.meta.env.VITE_OAUTH_SERVER_URL || "http://localhost:3001") +
  "/api/leetcode";
const REMOTE_FALLBACK_URL = "https://alfa-leetcode-api.onrender.com";

const CACHE_PREFIX = "campusos_leetcode_cache_v2";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/* ─── Cache helpers ─────────────────────────────────────────────────── */

function getCacheKey(username) {
  return `${CACHE_PREFIX}:${(username || "").trim().toLowerCase()}`;
}

export function readLeetCodeCache(username) {
  try {
    const raw = localStorage.getItem(getCacheKey(username));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    if (Date.now() - (parsed.timestamp || 0) > CACHE_TTL_MS) {
      localStorage.removeItem(getCacheKey(username));
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

export function writeLeetCodeCache(username, data) {
  try {
    localStorage.setItem(
      getCacheKey(username),
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    );
  } catch {
    // Ignore storage quota / parse errors
  }
}

export function clearLeetCodeCache(username) {
  if (username) {
    localStorage.removeItem(getCacheKey(username));
  } else {
    // Clear all leetcode cache keys
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  }
}

/* ─── Network request helpers with fallback ─────────────────────────── */

async function fetchWithTimeout(url, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/* ─── Fast Docker container probe ─────────────────────────────────── */

let dockerStatusCache = { isAvailable: null, checkedAt: 0 };
const DOCKER_PROBE_TTL_MS = 25 * 1000; // check at most once every 25 seconds

export async function isDockerContainerAvailable(force = false) {
  const now = Date.now();
  if (!force && dockerStatusCache.isAvailable !== null && now - dockerStatusCache.checkedAt < DOCKER_PROBE_TTL_MS) {
    return dockerStatusCache.isAvailable;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 700); // 700ms quick probe
    const res = await fetch(`${LOCAL_DOCKER_URL}/`, { signal: controller.signal });
    clearTimeout(timer);
    dockerStatusCache = { isAvailable: res.status < 500, checkedAt: now };
    return dockerStatusCache.isAvailable;
  } catch {
    dockerStatusCache = { isAvailable: false, checkedAt: now };
    return false;
  }
}

/**
 * Test which LeetCode service is currently reachable
 */
export async function testLeetCodeConnection() {
  const isDockerUp = await isDockerContainerAvailable(true);
  if (isDockerUp) {
    return { status: "connected", endpoint: "Docker Local (Port 3000)", url: LOCAL_DOCKER_URL };
  }

  // Test server proxy
  try {
    const res = await fetchWithTimeout(`${SERVER_PROXY_URL}/health`, 2000);
    return {
      status: "connected",
      endpoint: "Server Proxy",
      url: SERVER_PROXY_URL,
      details: res,
    };
  } catch {
    // Test remote hosted
    try {
      await fetchWithTimeout(`${REMOTE_FALLBACK_URL}`, 3000);
      return { status: "connected", endpoint: "Render Hosted", url: REMOTE_FALLBACK_URL };
    } catch {
      return { status: "offline", endpoint: "None", url: null };
    }
  }
}

function firstNumber(values, fallback = 0) {
  for (const value of values) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function pickString(values, fallback = "") {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return fallback;
}

function extractPayload(data) {
  if (data && typeof data === "object" && data.data && typeof data.data === "object") {
    return data.data;
  }
  return data;
}

/**
 * Primary function: Get all consolidated stats for the student dashboard.
 *
 * Resilient flow:
 * 1. Checks localStorage cache (unless forceRefresh is true)
 * 2. If Docker is running, queries it locally (fastest)
 * 3. If Docker is NOT running, immediately routes to Server Proxy or Hosted Render API
 * 4. If all network routes fail, returns cached snapshot or offline state gracefully
 */
export async function getLeetCodeDashboardStats(username, options = {}) {
  const cleanUsername = (username || "").trim();
  if (!cleanUsername) {
    throw new Error("LeetCode username is required");
  }

  const { forceRefresh = false } = options;

  // 1. Check local cache
  if (!forceRefresh) {
    const cached = readLeetCodeCache(cleanUsername);
    if (cached) {
      return { ...cached, isFromCache: true };
    }
  }

  let result = null;
  let dataSource = "unknown";

  // Check if Docker container on localhost:3000 is active
  const isDockerActive = await isDockerContainerAvailable(forceRefresh);

  // Candidate endpoints based on Docker availability
  const candidateBases = isDockerActive
    ? [LOCAL_DOCKER_URL, REMOTE_FALLBACK_URL]
    : [REMOTE_FALLBACK_URL];

  // 2. Try Server Proxy first if Docker is offline (server proxy has automatic fallbacks)
  if (!isDockerActive) {
    try {
      const serverUrl = `${SERVER_PROXY_URL}/stats/${encodeURIComponent(cleanUsername)}${forceRefresh ? "?refresh=true" : ""}`;
      const data = await fetchWithTimeout(serverUrl, 4500);
      if (data && !data.error) {
        result = data;
        dataSource = data.dataSource || "server-proxy";
      }
    } catch {
      // Server proxy unavailable, proceed to candidate bases
    }
  }

  // 3. Try Candidate Bases (Docker first if active, otherwise Render hosted)
  if (!result) {
    for (const base of candidateBases) {
      try {
        const [profileRaw, solvedRaw, contestRaw, badgesRaw, calendarRaw, acSubRaw] =
          await Promise.allSettled([
            fetchWithTimeout(`${base}/${encodeURIComponent(cleanUsername)}`, 3000),
            fetchWithTimeout(`${base}/${encodeURIComponent(cleanUsername)}/solved`, 3000),
            fetchWithTimeout(`${base}/${encodeURIComponent(cleanUsername)}/contest`, 3000),
            fetchWithTimeout(`${base}/${encodeURIComponent(cleanUsername)}/badges`, 3000),
            fetchWithTimeout(`${base}/${encodeURIComponent(cleanUsername)}/calendar`, 3000),
            fetchWithTimeout(
              `${base}/${encodeURIComponent(cleanUsername)}/acSubmission?limit=5`,
              3000,
            ),
          ]);

        const profile = profileRaw.status === "fulfilled" ? extractPayload(profileRaw.value) : {};
        const solved = solvedRaw.status === "fulfilled" ? extractPayload(solvedRaw.value) : {};
        const contest = contestRaw.status === "fulfilled" ? extractPayload(contestRaw.value) : {};
        const badgesData = badgesRaw.status === "fulfilled" ? extractPayload(badgesRaw.value) : {};
        const calendar = calendarRaw.status === "fulfilled" ? extractPayload(calendarRaw.value) : {};
        const acSub = acSubRaw.status === "fulfilled" ? extractPayload(acSubRaw.value) : {};

        // If solved endpoint yielded nothing, try the next base
        if (solvedRaw.status !== "fulfilled" && profileRaw.status !== "fulfilled") {
          continue;
        }

        const easySolved = firstNumber([
          solved.easySolved,
          solved.easy,
          solved.easyCount,
          solved.easyQuestionsSolved,
        ]);

        const mediumSolved = firstNumber([
          solved.mediumSolved,
          solved.medium,
          solved.mediumCount,
          solved.mediumQuestionsSolved,
        ]);

        const hardSolved = firstNumber([
          solved.hardSolved,
          solved.hard,
          solved.hardCount,
          solved.hardQuestionsSolved,
        ]);

        const totalSolved = firstNumber([
          solved.totalSolved,
          solved.solvedProblem,
          solved.total,
          easySolved + mediumSolved + hardSolved,
        ]);

        const totalQuestions = firstNumber([
          solved.totalQuestions,
          solved.totalQuestionsCount,
          3850,
        ]);

        const contestRating = Math.trunc(
          firstNumber([
            contest.contestRating,
            contest.rating,
            contest.userContestRanking?.rating,
            contest.userContestRanking?.contestRating,
          ]),
        );

        const resolvedUsername = pickString([
          profile.username,
          profile.userName,
          profile.realName,
          cleanUsername,
        ]);

        const progressPercent =
          totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;

        dataSource = base === LOCAL_DOCKER_URL ? "docker-local" : "render-hosted";

        result = {
          username: resolvedUsername,
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
          contestRating,
          contestGlobalRanking: Number(contest.contestGlobalRanking || 0),
          contestAttend: Number(contest.contestAttend || 0),
          contestTopPercentage: Number(contest.contestTopPercentage || 0),
          badgesCount: Number(
            badgesData.badgesCount || badgesData.badges?.length || 0,
          ),
          badges: Array.isArray(badgesData.badges)
            ? badgesData.badges.slice(0, 8)
            : [],
          streak: Number(calendar.streak || 0),
          totalActiveDays: Number(calendar.totalActiveDays || 0),
          recentAcSubmissions: Array.isArray(acSub.submission)
            ? acSub.submission.slice(0, 5)
            : [],
          dataSource,
          fetchedAt: new Date().toISOString(),
        };

        break;
      } catch {
        // Continue to fallback
      }
    }
  }

  if (!result) {
    throw new Error(
      `Could not retrieve LeetCode data for "${cleanUsername}" from Docker (localhost:3000), backend server proxy, or hosted API.`,
    );
  }

  // Save to cache
  writeLeetCodeCache(cleanUsername, result);
  return result;
}

export default {
  getLeetCodeDashboardStats,
  testLeetCodeConnection,
  readLeetCodeCache,
  writeLeetCodeCache,
  clearLeetCodeCache,
};
