// GitHub OAuth configuration
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || "";
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || "http://localhost:5173/auth/callback";
const OAUTH_SERVER_URL = import.meta.env.VITE_OAUTH_SERVER_URL || "http://localhost:3001";

// OAuth scope: repo - for reading public repo data
const GITHUB_SCOPE = "repo,read:user";

/**
 * Generate GitHub OAuth authorization URL
 * User clicks this link to authorize the app
 */
export function getGitHubAuthUrl() {
  if (!GITHUB_CLIENT_ID) {
    console.warn("GitHub OAuth: VITE_GITHUB_CLIENT_ID not configured");
  }

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: GITHUB_SCOPE,
    state: generateRandomState(),
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange OAuth authorization code for access token
 * Calls backend OAuth proxy to avoid CORS and protect client secret.
 */
export async function exchangeCodeForToken(code) {
  try {
    const response = await fetch(`${OAUTH_SERVER_URL}/api/oauth/exchange-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        errorBody?.error_description ||
          errorBody?.message ||
          `OAuth token exchange failed: ${response.status}`,
      );
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`OAuth error: ${data.error_description || data.error}`);
    }

    return data.access_token || null;
  } catch (error) {
    console.error("GitHub OAuth token exchange failed:", error);
    throw error;
  }
}

/**
 * Fetch authenticated GitHub user profile
 */
export async function getGitHubUser(token) {
  try {
    const response = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub user: ${response.status}`);
    }

    const user = await response.json();
    return {
      username: user.login,
      avatarUrl: user.avatar_url,
      email: user.email,
      name: user.name,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      profileUrl: user.html_url,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub user profile:", error);
    throw error;
  }
}

/**
 * Verify OAuth state parameter (CSRF protection)
 */
function generateRandomState() {
  const state = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem("github_oauth_state", state);
  return state;
}

export function verifyOAuthState(state) {
  const saved = sessionStorage.getItem("github_oauth_state");
  const isValid = !!saved && !!state && saved === state;
  if (isValid) {
    sessionStorage.removeItem("github_oauth_state");
  }
  return isValid;
}
