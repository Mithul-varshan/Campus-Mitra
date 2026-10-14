import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { exchangeCodeForToken, getGitHubUser, verifyOAuthState } from "../../services/githubOAuth";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGitHub } = useAuth();
  const [status, setStatus] = useState("Processing GitHub login...");
  const [error, setError] = useState("");
  const hasProcessedCallback = useRef(false);

  useEffect(() => {
    if (hasProcessedCallback.current) {
      return;
    }
    hasProcessedCallback.current = true;

    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code) {
          throw new Error("No authorization code received from GitHub");
        }

        // Verify state to prevent CSRF attacks
        if (!verifyOAuthState(state)) {
          throw new Error("Invalid state parameter - possible CSRF attack");
        }

        setStatus("Exchanging code for token...");
        const token = await exchangeCodeForToken(code);

        if (!token) {
          throw new Error("Failed to get access token from GitHub");
        }

        setStatus("Fetching your GitHub profile...");
        const userProfile = await getGitHubUser(token);

        setStatus("Logging you in...");
        // Login with GitHub username and token
        loginWithGitHub(userProfile.username, token);

        // Redirect to dashboard
        setStatus("Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(err?.message || "Failed to complete GitHub login. Please try again.");
        setStatus("");
      }
    };

    handleCallback();
  }, [searchParams, loginWithGitHub, navigate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "48px 32px",
          textAlign: "center",
          maxWidth: "400px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {!error && (
          <>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "16px",
              }}
            >
              <iconify-icon
                icon="mdi:github"
                style={{
                  color: "#333",
                  fontSize: "48px",
                  animation: "spin 2s linear infinite",
                }}
              ></iconify-icon>
            </div>
            <h1 style={{ marginBottom: "8px", fontSize: "24px", color: "#333" }}>
              GitHub Login
            </h1>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              {status}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#667eea",
                  animation: "bounce 1.4s infinite",
                  animationDelay: "0s",
                }}
              ></div>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#667eea",
                  animation: "bounce 1.4s infinite",
                  animationDelay: "0.2s",
                }}
              ></div>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#667eea",
                  animation: "bounce 1.4s infinite",
                  animationDelay: "0.4s",
                }}
              ></div>
            </div>
            <style>
              {`
                @keyframes bounce {
                  0%, 60%, 100% { transform: translateY(0); }
                  30% { transform: translateY(-10px); }
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </>
        )}

        {error && (
          <>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "16px",
                color: "#ef4444",
              }}
            >
              ⚠️
            </div>
            <h1 style={{ marginBottom: "8px", fontSize: "24px", color: "#333" }}>
              Login Failed
            </h1>
            <p style={{ color: "#666", marginBottom: "24px", fontSize: "14px", lineHeight: "1.5" }}>
              {error}
            </p>
            <p style={{ color: "#999", marginBottom: "24px", fontSize: "12px" }}>
              Make sure OAuth server is running on <strong>http://localhost:3001</strong>
              and server/.env has valid GitHub client secret.
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "12px 24px",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#764ba2";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#667eea";
              }}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
