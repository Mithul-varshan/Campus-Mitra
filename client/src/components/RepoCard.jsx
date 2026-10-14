import { useState } from "react";

export default function RepoCard({
  repo,
  commitCount = 0,
  isSelected = false,
  onSelectChange,
  showSelectable = false,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckboxClick = (e) => {
    e.preventDefault();
    if (onSelectChange) {
      onSelectChange(!isSelected);
    }
  };

  const isForked = repo.fork ? true : false;

  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        background: isHovered ? "var(--muted)" : "var(--background)",
        transition: "all 0.2s ease",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Forked Badge */}
      {isForked && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            padding: "4px 8px",
            background: "#fbbf24",
            color: "#000",
            fontSize: "10px",
            fontWeight: 700,
            borderRadius: "4px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Forked
        </div>
      )}

      {/* Main Row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        {/* Checkbox (if selectable) */}
        {showSelectable && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxClick}
            style={{
              width: "20px",
              height: "20px",
              cursor: "pointer",
              marginTop: "2px",
              accentColor: "var(--primary)",
            }}
          />
        )}

        {/* Repo Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title & Visibility */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--primary)",
                textDecoration: "none",
                wordBreak: "break-word",
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              {repo.name}
            </a>
            {repo.visibility === "Private" && (
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 6px",
                  background: "var(--border)",
                  borderRadius: "3px",
                  color: "var(--muted-foreground)",
                }}
              >
                Private
              </span>
            )}
            {repo.status === "Archived" && (
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 6px",
                  background: "var(--border)",
                  borderRadius: "3px",
                  color: "var(--muted-foreground)",
                }}
              >
                Archived
              </span>
            )}
          </div>

          {/* Description */}
          {repo.description && (
            <p
              style={{
                fontSize: "13px",
                color: "var(--muted-foreground)",
                margin: "0 0 8px 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {repo.description}
            </p>
          )}

          {/* Stats Row */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Language */}
            {repo.language && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: getLanguageColor(repo.language),
                    display: "inline-block",
                  }}
                ></span>
                {repo.language}
              </div>
            )}

            {/* Stars */}
            {repo.stars > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  color: repo.stars > 0 ? "#fbbf24" : "var(--muted-foreground)",
                  fontWeight: 500,
                }}
              >
                <iconify-icon
                  icon="lucide:star"
                  style={{ fontSize: "14px" }}
                ></iconify-icon>
                {repo.stars}
              </div>
            )}

            {/* Commits */}
            {commitCount > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                }}
              >
                <iconify-icon
                  icon="lucide:git-commit"
                  style={{ fontSize: "14px" }}
                ></iconify-icon>
                {commitCount}
              </div>
            )}

            {/* Forks */}
            {repo.forks > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                }}
              >
                <iconify-icon
                  icon="lucide:git-fork"
                  style={{ fontSize: "14px" }}
                ></iconify-icon>
                {repo.forks}
              </div>
            )}

            {/* Issues */}
            {repo.openIssues > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                }}
              >
                <iconify-icon
                  icon="lucide:alert-circle"
                  style={{ fontSize: "14px" }}
                ></iconify-icon>
                {repo.openIssues}
              </div>
            )}

            {/* Updated Date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "var(--muted-foreground)",
                marginLeft: "auto",
              }}
            >
              <iconify-icon
                icon="lucide:calendar"
                style={{ fontSize: "14px" }}
              ></iconify-icon>
              {new Date(repo.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (show on hover) */}
      {isHovered && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: "8px 12px",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 500,
              background: "var(--primary)",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            View on GitHub
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Get color for programming language indicator
 */
function getLanguageColor(language) {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    "C#": "#239120",
    Go: "#00ADD8",
    Rust: "#ce422b",
    PHP: "#777bb4",
    Ruby: "#cc342d",
    Swift: "#FA7343",
    Kotlin: "#F18E33",
    React: "#61dafb",
    Vue: "#2c3e50",
    HTML: "#e34c26",
    CSS: "#563d7c",
    SQL: "#336791",
    Shell: "#89e051",
  };
  return colors[language] || "#858585";
}
