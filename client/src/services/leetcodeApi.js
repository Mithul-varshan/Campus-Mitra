const LEETCODE_API_BASE = (
  import.meta.env.VITE_LEETCODE_API_BASE ||
  (import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://alfa-leetcode-api.onrender.com")
).replace(/\/$/, "");

async function getJson(path) {
  const response = await fetch(`${LEETCODE_API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`LeetCode API request failed: ${response.status}`);
  }

  return response.json();
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

export async function getLeetCodeDashboardStats(username) {
  const [profileRaw, solvedRaw, contestRaw] = await Promise.all([
    getJson(`/${encodeURIComponent(username)}/profile`),
    getJson(`/${encodeURIComponent(username)}/solved`),
    getJson(`/${encodeURIComponent(username)}/contest`),
  ]);

  const profile = extractPayload(profileRaw) || {};
  const solved = extractPayload(solvedRaw) || {};
  const contest = extractPayload(contestRaw) || {};

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
    3851,
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
    username,
  ]);

  const progressPercent = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;

  return {
    username: resolvedUsername,
    easySolved,
    mediumSolved,
    hardSolved,
    totalSolved,
    totalQuestions,
    contestRating,
    progressPercent,
  };
}
