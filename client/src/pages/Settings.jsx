import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, updateLeetcodeUsername, updateGithubUsername } = useAuth();
  const [leetcodeUsername, setLeetcodeUsername] = useState(
    user?.leetcodeUsername || "",
  );
  const [githubUsername, setGithubUsername] = useState(user?.githubUsername || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLeetcodeUsername(user?.leetcodeUsername || "");
    setGithubUsername(user?.githubUsername || "");
  }, [user?.githubUsername, user?.leetcodeUsername]);

  const handleSave = () => {
    updateLeetcodeUsername(leetcodeUsername);
    updateGithubUsername(githubUsername);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          maxWidth: "560px",
          background: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: "20px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "22px",
            color: "var(--foreground)",
          }}
        >
          Settings
        </h1>
        <p
          style={{
            margin: "8px 0 20px",
            fontSize: "13px",
            color: "var(--muted-foreground)",
          }}
        >
          Set demo usernames to load real LeetCode and GitHub data on your
          dashboard.
        </p>

        <label
          htmlFor="leetcode-username"
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--muted-foreground)",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
          }}
        >
          LeetCode Username
        </label>
        <input
          id="leetcode-username"
          value={leetcodeUsername}
          onChange={(event) => setLeetcodeUsername(event.target.value)}
          placeholder="e.g. alfaarghya"
          style={{
            width: "100%",
            height: "40px",
            padding: "0 12px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            background: "var(--muted)",
            color: "var(--foreground)",
            outline: "none",
            marginBottom: "12px",
          }}
        />

        <label
          htmlFor="github-username"
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--muted-foreground)",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
          }}
        >
          GitHub Username
        </label>
        <input
          id="github-username"
          value={githubUsername}
          onChange={(event) => setGithubUsername(event.target.value)}
          placeholder="e.g. octocat"
          style={{
            width: "100%",
            height: "40px",
            padding: "0 12px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            background: "var(--muted)",
            color: "var(--foreground)",
            outline: "none",
            marginBottom: "12px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
            Dashboard uses these usernames for live LeetCode and GitHub stats.
          </span>
          <button
            type="button"
            onClick={handleSave}
            style={{
              border: "none",
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Save
          </button>
        </div>

        {saved ? (
          <div
            style={{
              marginTop: "10px",
              fontSize: "12px",
              color: "#16a34a",
            }}
          >
            Saved successfully.
          </div>
        ) : null}
      </div>
    </div>
  );
}
