import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const LEETCODE_USERNAME_KEY = "campusos_leetcode_username";
const GITHUB_TOKEN_KEY = "campusos_github_token";

const ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  TEACHER: "teacher",
  RECRUITER: "recruiter",
  JUDGE: "judge",
};

// Judge credentials storage key
const JUDGE_CREDENTIALS_KEY = "campusmitra_judge_credentials";
const JUDGE_SCORES_KEY = "campusmitra_judge_scores";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("campusos_user");
    if (!saved) return null;

    let parsed;
    try {
      parsed = JSON.parse(saved);
    } catch {
      localStorage.removeItem("campusos_user");
      return null;
    }
    const fallbackLeetcodeUsername =
      localStorage.getItem(LEETCODE_USERNAME_KEY) || "";
    const fallbackGithubToken = localStorage.getItem(GITHUB_TOKEN_KEY) || "";

    return {
      ...parsed,
      leetcodeUsername:
        parsed?.leetcodeUsername?.trim() || fallbackLeetcodeUsername,
      githubUsername: parsed?.githubUsername?.trim() || "",
      githubToken: parsed?.githubToken || fallbackGithubToken,
    };
  });

  const persistUser = (userData) => {
    setUser(userData);
    localStorage.setItem("campusos_user", JSON.stringify(userData));
  };

  const login = (role) => {
    const savedLeetcodeUsername =
      localStorage.getItem(LEETCODE_USERNAME_KEY) || "";

    const userData = {
      role,
      loggedInAt: Date.now(),
      leetcodeUsername: savedLeetcodeUsername,
      githubUsername: "",
      githubToken: "",
    };
    persistUser(userData);
    localStorage.removeItem(GITHUB_TOKEN_KEY);
  };

  const loginWithGitHub = (githubUsername, githubToken) => {
    const savedLeetcodeUsername =
      localStorage.getItem(LEETCODE_USERNAME_KEY) || "";

    const userData = {
      role: ROLES.STUDENT,
      loggedInAt: Date.now(),
      leetcodeUsername: savedLeetcodeUsername,
      githubUsername: githubUsername.trim(),
      githubToken: githubToken || "",
    };
    persistUser(userData);
    // Also store token in localStorage for API access
    if (githubToken) {
      localStorage.setItem(GITHUB_TOKEN_KEY, githubToken);
    }
  };

  const updateLeetcodeUsername = (leetcodeUsername) => {
    if (!user) return;
    const normalizedUsername = leetcodeUsername.trim();
    const updatedUser = {
      ...user,
      leetcodeUsername: normalizedUsername,
    };
    persistUser(updatedUser);
    localStorage.setItem(LEETCODE_USERNAME_KEY, normalizedUsername);
  };

  const updateGithubUsername = (githubUsername) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      githubUsername: githubUsername.trim(),
    };
    persistUser(updatedUser);
  };

  const updateGitHubToken = (githubToken) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      githubToken: githubToken || "",
    };
    persistUser(updatedUser);
    if (githubToken) {
      localStorage.setItem(GITHUB_TOKEN_KEY, githubToken);
    } else {
      localStorage.removeItem(GITHUB_TOKEN_KEY);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("campusos_user");
    localStorage.removeItem(GITHUB_TOKEN_KEY);
    sessionStorage.removeItem("github_oauth_state");
  };

  // Judge authentication
  const loginAsJudge = (eventId, judgePassword) => {
    // Get stored judge credentials
    const credentials = JSON.parse(
      localStorage.getItem(JUDGE_CREDENTIALS_KEY) || "{}",
    );
    const eventCredentials = credentials[eventId];

    if (!eventCredentials) {
      return { success: false, error: "Invalid event ID" };
    }

    // Find matching judge
    const judgeIndex = eventCredentials.judges.findIndex(
      (j) => j.password === judgePassword,
    );

    if (judgeIndex === -1) {
      return { success: false, error: "Invalid judge credentials" };
    }

    const judgeInfo = eventCredentials.judges[judgeIndex];

    const userData = {
      role: ROLES.JUDGE,
      loggedInAt: Date.now(),
      eventId: eventId,
      eventTitle: eventCredentials.eventTitle,
      judgeIndex: judgeIndex,
      judgeName: judgeInfo.name,
      roundId: eventCredentials.roundId,
      roundName: eventCredentials.roundName,
    };
    persistUser(userData);
    return { success: true, user: userData };
  };

  // Generate judge credentials (called by admin)
  const generateJudgeCredentials = (
    eventId,
    eventTitle,
    roundId,
    roundName,
    judgeCount,
  ) => {
    const credentials = JSON.parse(
      localStorage.getItem(JUDGE_CREDENTIALS_KEY) || "{}",
    );

    const judges = [];
    for (let i = 0; i < judgeCount; i++) {
      judges.push({
        name: `Judge ${i + 1}`,
        password: `judge${i + 1}`,
      });
    }

    credentials[eventId] = {
      eventId,
      eventTitle,
      roundId,
      roundName,
      judges,
      createdAt: Date.now(),
    };

    localStorage.setItem(JUDGE_CREDENTIALS_KEY, JSON.stringify(credentials));
    return credentials[eventId];
  };

  // Get judge credentials for an event (for admin to view)
  const getJudgeCredentials = (eventId) => {
    const credentials = JSON.parse(
      localStorage.getItem(JUDGE_CREDENTIALS_KEY) || "{}",
    );
    return credentials[eventId] || null;
  };

  // Save judge scores
  const saveJudgeScores = (eventId, roundId, teamId, judgeIndex, scores) => {
    const allScores = JSON.parse(
      localStorage.getItem(JUDGE_SCORES_KEY) || "{}",
    );

    if (!allScores[eventId]) allScores[eventId] = {};
    if (!allScores[eventId][roundId]) allScores[eventId][roundId] = {};
    if (!allScores[eventId][roundId][teamId])
      allScores[eventId][roundId][teamId] = {};

    allScores[eventId][roundId][teamId][judgeIndex] = scores;

    localStorage.setItem(JUDGE_SCORES_KEY, JSON.stringify(allScores));
    return allScores;
  };

  // Get all judge scores for an event
  const getJudgeScores = (eventId) => {
    const allScores = JSON.parse(
      localStorage.getItem(JUDGE_SCORES_KEY) || "{}",
    );
    return allScores[eventId] || {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGitHub,
        loginAsJudge,
        logout,
        updateLeetcodeUsername,
        updateGithubUsername,
        updateGitHubToken,
        generateJudgeCredentials,
        getJudgeCredentials,
        saveJudgeScores,
        getJudgeScores,
        ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ROLES };
