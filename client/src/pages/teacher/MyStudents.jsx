import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  STUDENTS,
  MONTHS,
  DAYS,
  heatColors,
  LOG_STYLE,
  STATUS_COLOR,
  GAP_COLOR,
} from "./teacherData";

/* â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/* â”€â”€â”€ Student Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
// eslint-disable-next-line no-unused-vars
function generateHeatmap(activityPct) {
  const grid = [];
  for (let w = 0; w < 52; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const r = Math.random() * 100;
      week.push(
        r > 100 - activityPct * 0.9
          ? 3
          : r > 100 - activityPct * 1.4
            ? 2
            : r > 100 - activityPct * 2.2
              ? 1
              : 0,
      );
    }
    grid.push(week);
  }
}

/*
/* â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/* â”€â”€â”€ Export CSV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function exportCSV(student) {
  const rows = [
    ["Field", "Value"],
    ["Name", student.name],
    ["Roll No", student.rollNo],
    ["Year", student.year],
    ["Department", student.dept],
    ["GPA", student.gpa],
    ["Status", student.status],
    ["Credits", student.credits],
    ["Rank", student.rank],
    ["Streak (days)", student.streak],
    ["Participation Count", student.participation],
    ["Total Wins", student.wins],
    ["Skills", student.skills.join("; ")],
    ["GitHub Commits", student.githubStats.commits],
    ["GitHub PRs", student.githubStats.prs],
    ["GitHub Stars", student.githubStats.stars],
    ["LeetCode Solved", student.leetcodeStats.solved],
    ["LeetCode Easy", student.leetcodeStats.easy],
    ["LeetCode Medium", student.leetcodeStats.medium],
    ["LeetCode Hard", student.leetcodeStats.hard],
    ["LeetCode Rank", student.leetcodeStats.rank],
    ["Events", student.events.map((e) => e.name).join("; ")],
    ["Skill Gaps", student.skillGaps.map((g) => g.skill).join("; ")],
  ];
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${student.rollNo}_report.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(student) {
  const win = window.open("", "_blank");
  win.document.write(`<html><head><title>${student.name} â€” Report</title>
  <style>
    body{font-family:Inter,sans-serif;padding:32px;color:#1e293b;max-width:800px;margin:0 auto}
    h1{font-size:24px;margin-bottom:4px}h2{font-size:16px;color:#6366f1;margin:24px 0 8px;border-bottom:2px solid #e0e7ff;padding-bottom:4px}
    table{width:100%;border-collapse:collapse;font-size:13px}td{padding:7px 10px;border-bottom:1px solid #f1f5f9}tr:nth-child(even){background:#f8fafc}
    .badge{display:inline-block;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:600;background:#eff6ff;color:#4338ca;margin:2px}
    .gap{padding:8px 12px;border-radius:8px;margin-bottom:8px;font-size:12px}
  </style></head><body>
  <h1>${student.name}</h1>
  <div style="color:#64748b;font-size:13px">${student.rollNo} Â· ${student.year} Â· ${student.dept}</div>
  <h2>Academic Info</h2>
  <table><tr><td><b>GPA</b></td><td>${student.gpa}/10</td><td><b>Status</b></td><td>${student.status}</td></tr>
  <tr><td><b>Credits</b></td><td>${student.credits}</td><td><b>Rank</b></td><td>${student.rank}</td></tr></table>
  <h2>Performance</h2>
  <table><tr><td><b>Participation</b></td><td>${student.participation} events</td><td><b>Wins</b></td><td>${student.wins}</td></tr></table>
  <h2>GitHub Stats</h2>
  <table><tr><td><b>Commits</b></td><td>${student.githubStats.commits}</td><td><b>PRs</b></td><td>${student.githubStats.prs}</td></tr>
  <tr><td><b>Stars</b></td><td>${student.githubStats.stars}</td><td><b>Contributions</b></td><td>${student.githubStats.contributions}</td></tr></table>
  <h2>LeetCode Stats</h2>
  <table><tr><td><b>Total Solved</b></td><td>${student.leetcodeStats.solved}</td><td><b>Rank</b></td><td>${student.leetcodeStats.rank}</td></tr>
  <tr><td><b>Easy</b></td><td>${student.leetcodeStats.easy}</td><td><b>Medium</b></td><td>${student.leetcodeStats.medium}</td></tr>
  <tr><td><b>Hard</b></td><td>${student.leetcodeStats.hard}</td></tr></table>
  <h2>Skills</h2>${student.skills.map((s) => `<span class="badge">${s}</span>`).join("")}
  <h2>Skill Gap Analysis</h2>${student.skillGaps.map((g) => `<div class="gap" style="background:${GAP_COLOR[g.level].bg};border-left:4px solid ${GAP_COLOR[g.level].color}"><b>${g.skill}</b> â€” ${GAP_COLOR[g.level].label}<br/><span style="color:#64748b">${g.suggestion}</span></div>`).join("") || "<p>No skill gaps identified.</p>"}
  </body></html>`);
  win.document.close();
  win.print();
}

/* â”€â”€â”€ Heatmap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function StreakHeatmap({ grid }) {
  const total = grid.flat().reduce((a, b) => a + b, 0);
  return (
    <div style={{ width: "100%" }}>
      {/* Month labels — one per month, evenly distributed */}
      <div
        style={{ display: "flex", marginBottom: "6px", paddingLeft: "30px" }}
      >
        {MONTHS.map((m) => (
          <div
            key={m}
            style={{
              flex: "1",
              fontSize: "11px",
              color: "#94a3b8",
              fontWeight: 500,
            }}
          >
            {m}
          </div>
        ))}
      </div>
      {/* Grid */}
      <div style={{ display: "flex", gap: "3px", width: "100%" }}>
        {/* Day labels */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            paddingTop: "2px",
            flexShrink: 0,
            width: "28px",
          }}
        >
          {DAYS.map((d, i) =>
            i % 2 === 1 ? (
              <div
                key={d}
                style={{
                  height: "12px",
                  fontSize: "10px",
                  color: "#94a3b8",
                  lineHeight: "12px",
                  textAlign: "right",
                  paddingRight: "4px",
                }}
              >
                {d}
              </div>
            ) : (
              <div key={d} style={{ height: "12px" }} />
            ),
          )}
        </div>
        {/* 52 week columns — flex:1 so they fill the container */}
        {grid.map((week, wi) => (
          <div
            key={wi}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              flex: "1",
              minWidth: "7px",
            }}
          >
            {week.map((level, di) => (
              <div
                key={di}
                title={`${DAYS[di]}: ${level === 0 ? "No activity" : `Level ${level}`}`}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: "4px",
                  background: heatColors[level],
                  cursor: "default",
                  transition: "opacity 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "10px",
          paddingLeft: "30px",
        }}
      >
        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
          {total} contributions in the last year
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>Less</span>
          {[0, 1, 2, 3].map((l) => (
            <div
              key={l}
              style={{
                width: "13px",
                height: "13px",
                borderRadius: "3px",
                background: heatColors[l],
              }}
            />
          ))}
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>More</span>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Stat Mini Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function MiniStat({ label, value, icon, iconColor, sub }) {
  return (
    <div
      style={{
        background: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "var(--muted-foreground)",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <iconify-icon
          icon={icon}
          style={{ fontSize: "16px", color: iconColor }}
        />
      </div>
      <div
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "var(--foreground)",
          marginBottom: "2px",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* â”€â”€â”€ Skill Gap Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function SkillGapPanel({ gaps }) {
  if (!gaps || gaps.length === 0)
    return (
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "14px",
          padding: "22px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <iconify-icon
          icon="lucide:check-circle-2"
          style={{ fontSize: "22px", color: "#16a34a" }}
        />
        <div>
          <div style={{ fontWeight: 600, color: "#15803d", fontSize: "14px" }}>
            No Skill Gaps Detected
          </div>
          <div style={{ fontSize: "12px", color: "#166534", marginTop: "2px" }}>
            This student has a strong and balanced skill profile. Keep it up!
          </div>
        </div>
      </div>
    );
  return (
    <div
      style={{
        background: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "22px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            background: "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <iconify-icon
            icon="lucide:sparkles"
            style={{ fontSize: "15px", color: "#d97706" }}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            AI Skill Gap Analysis
          </div>
          <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
            Personalised recommendations based on profile & activity
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {gaps.map((g, i) => {
          const c = GAP_COLOR[g.level];
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                padding: "12px 14px",
                background: c.bg,
                borderRadius: "10px",
                borderLeft: `4px solid ${c.color}`,
              }}
            >
              <iconify-icon
                icon="lucide:alert-circle"
                style={{
                  fontSize: "16px",
                  color: c.color,
                  marginTop: "2px",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    {g.skill}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "1px 8px",
                      borderRadius: "999px",
                      background: "white",
                      color: c.color,
                      border: `1px solid ${c.color}`,
                    }}
                  >
                    {c.label}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "var(--foreground)",
                    lineHeight: 1.6,
                  }}
                >
                  {g.suggestion}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* â”€â”€â”€ GitHub Stats Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function GitHubStatsPanel({ stats }) {
  const items = [
    {
      label: "Commits",
      value: stats.commits,
      icon: "lucide:git-commit",
      color: "#1d4ed8",
      bg: "#dbeafe",
    },
    {
      label: "Pull Requests",
      value: stats.prs,
      icon: "lucide:git-pull-request",
      color: "#7c3aed",
      bg: "#ede9fe",
    },
    {
      label: "Stars Earned",
      value: stats.stars,
      icon: "lucide:star",
      color: "#d97706",
      bg: "#fef3c7",
    },
    {
      label: "Contributions",
      value: stats.contributions,
      icon: "lucide:activity",
      color: "#059669",
      bg: "#d1fae5",
    },
  ];
  return (
    <div
      style={{
        background: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "22px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <iconify-icon
          icon="lucide:github"
          style={{ fontSize: "20px", color: "var(--foreground)" }}
        />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--foreground)",
          }}
        >
          GitHub Activity
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "10px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              background: item.bg,
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <iconify-icon
                icon={item.icon}
                style={{ fontSize: "16px", color: item.color }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: item.color,
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  fontWeight: 500,
                  marginTop: "2px",
                }}
              >
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* â”€â”€â”€ LeetCode Stats Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function LeetCodeStatsPanel({ stats }) {
  const total = stats.easy + stats.medium + stats.hard;
  const pct = (v) => (total > 0 ? Math.round((v / total) * 100) : 0);
  const bars = [
    {
      label: "Easy",
      value: stats.easy,
      color: "#22c55e",
      bg: "#dcfce7",
      pct: pct(stats.easy),
    },
    {
      label: "Medium",
      value: stats.medium,
      color: "#f59e0b",
      bg: "#fef3c7",
      pct: pct(stats.medium),
    },
    {
      label: "Hard",
      value: stats.hard,
      color: "#ef4444",
      bg: "#fee2e2",
      pct: pct(stats.hard),
    },
  ];
  return (
    <div
      style={{
        background: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "22px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <iconify-icon
            icon="lucide:code-2"
            style={{ fontSize: "20px", color: "#f59e0b" }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            LeetCode Stats
          </span>
        </div>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            padding: "2px 10px",
            borderRadius: "999px",
            background: "#eff6ff",
            color: "#4338ca",
          }}
        >
          {stats.rank}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "16px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 800,
              color: "var(--foreground)",
              lineHeight: 1,
            }}
          >
            {stats.solved}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Problems Solved
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {bars.map((b) => (
            <div key={b.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  marginBottom: "3px",
                }}
              >
                <span style={{ fontWeight: 600, color: b.color }}>
                  {b.label}
                </span>
                <span style={{ color: "var(--muted-foreground)" }}>
                  {b.value} ({b.pct}%)
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  background: "var(--muted)",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${b.pct}%`,
                    background: b.color,
                    borderRadius: "999px",
                    transition: "width 0.5s",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Student Detail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function StudentDetail({ student, onBack }) {
  const [activeTab, setActiveTab] = useState("overview");
  const TABS = ["overview", "stats", "projects", "events"];
  const st = STATUS_COLOR[student.status];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      {/* Back + Export */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            color: "var(--muted-foreground)",
            padding: 0,
            fontWeight: 500,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--foreground)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--muted-foreground)")
          }
        >
          <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "16px" }} />
          Back to My Students
        </button>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => exportCSV(student)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--background)",
              color: "#16a34a",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--background)")
            }
          >
            <iconify-icon icon="lucide:table-2" style={{ fontSize: "14px" }} />
            Export Excel/CSV
          </button>
          <button
            onClick={() => exportPDF(student)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--background)",
              color: "#dc2626",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--background)")
            }
          >
            <iconify-icon
              icon="lucide:file-text"
              style={{ fontSize: "14px" }}
            />
            Export PDF
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#eff6ff 0%,#faf5ff 100%)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "20px",
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        <img
          src={student.avatar}
          alt={student.name}
          style={{
            width: 80,
            height: 80,
            borderRadius: 999,
            border: "3px solid #818cf8",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "4px",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                margin: 0,
                color: "var(--foreground)",
              }}
            >
              {student.name}
            </h2>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: "999px",
                background: st.bg,
                color: st.color,
              }}
            >
              {st.label}
            </span>
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginBottom: "8px",
            }}
          >
            {student.rollNo} Â· {student.year} Â· {student.dept}
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--foreground)",
              margin: "0 0 12px",
              lineHeight: 1.6,
            }}
          >
            {student.bio}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {student.skills.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: "12px",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  background: "#eff6ff",
                  color: "#4338ca",
                  fontWeight: 500,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div
            style={{
              fontSize: "12px",
              color: "var(--muted-foreground)",
              marginBottom: "4px",
              fontWeight: 500,
            }}
          >
            GPA
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#4338ca" }}>
            {student.gpa}
          </div>
          <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
            /10.0
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Credits",
            value: student.credits.toLocaleString(),
            icon: "lucide:zap",
            iconColor: "#eab308",
            sub: "Total earned",
          },
          {
            label: "Rank",
            value: student.rank,
            icon: "lucide:award",
            iconColor: "#6366f1",
            sub: "Campus ranking",
          },
          {
            label: "Streak",
            value: `${student.streak}d`,
            icon: "lucide:flame",
            iconColor: "#f97316",
            sub: "Active days",
          },
          {
            label: "Participations",
            value: student.participation,
            icon: "lucide:calendar-check",
            iconColor: "#0ea5e9",
            sub: "Events attended",
          },
          {
            label: "Wins",
            value: student.wins,
            icon: "lucide:trophy",
            iconColor: "#f59e0b",
            sub: "Event victories",
          },
          {
            label: "Projects",
            value: student.projects.length,
            icon: "lucide:folder-kanban",
            iconColor: "#10b981",
            sub: `${student.projects.filter((p) => p.status === "Ongoing").length} ongoing`,
          },
        ].map((s) => (
          <MiniStat key={s.label} {...s} />
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "20px",
          background: "var(--muted)",
          borderRadius: "10px",
          padding: "4px",
          width: "fit-content",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "7px 18px",
              borderRadius: "7px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              textTransform: "capitalize",
              background:
                activeTab === tab ? "var(--background)" : "transparent",
              color:
                activeTab === tab
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
              boxShadow:
                activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* â”€â”€ Tab: Overview â”€â”€ */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "22px",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <iconify-icon
                icon="lucide:activity"
                style={{ color: "var(--primary)" }}
              />
              Activity Heatmap
            </div>
            <StreakHeatmap grid={student.heatmap} />
          </div>
          <SkillGapPanel gaps={student.skillGaps} />
          {student.achievements.length > 0 && (
            <div
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <iconify-icon
                  icon="lucide:medal"
                  style={{ color: "var(--primary)" }}
                />
                Achievements
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {student.achievements.map((ach) => (
                  <div
                    key={ach.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      background: "var(--muted)",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <iconify-icon
                      icon={ach.icon}
                      style={{ fontSize: "18px", color: ach.color }}
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--foreground)",
                      }}
                    >
                      {ach.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* â”€â”€ Tab: Stats â”€â”€ */}
      {activeTab === "stats" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <GitHubStatsPanel stats={student.githubStats} />
          <LeetCodeStatsPanel stats={student.leetcodeStats} />
          <SkillGapPanel gaps={student.skillGaps} />
        </div>
      )}

      {/* â”€â”€ Tab: Projects â”€â”€ */}
      {activeTab === "projects" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {student.projects.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "var(--muted-foreground)",
                background: "var(--muted)",
                borderRadius: "14px",
                fontSize: "14px",
              }}
            >
              No projects yet
            </div>
          ) : (
            student.projects.map((proj, i) => (
              <div
                key={i}
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        marginBottom: "4px",
                      }}
                    >
                      {proj.name}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {proj.desc}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "3px 12px",
                      borderRadius: "999px",
                      flexShrink: 0,
                      marginLeft: "16px",
                      background:
                        proj.status === "Ongoing"
                          ? "#eff6ff"
                          : proj.status === "Completed"
                            ? "#f0fdf4"
                            : "#fffbeb",
                      color:
                        proj.status === "Ongoing"
                          ? "#2563eb"
                          : proj.status === "Completed"
                            ? "#16a34a"
                            : "#d97706",
                    }}
                  >
                    {proj.status}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "12px",
                  }}
                >
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: "var(--muted)",
                          color: "var(--muted-foreground)",
                          fontWeight: 500,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      Score
                    </span>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color:
                          proj.score >= 85
                            ? "#16a34a"
                            : proj.score >= 70
                              ? "#d97706"
                              : "#dc2626",
                      }}
                    >
                      {proj.score}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      /100
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "12px",
                    height: "6px",
                    background: "var(--muted)",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${proj.score}%`,
                      background:
                        proj.score >= 85
                          ? "#22c55e"
                          : proj.score >= 70
                            ? "#f59e0b"
                            : "#ef4444",
                      borderRadius: "999px",
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* â”€â”€ Tab: Events â”€â”€ */}
      {activeTab === "events" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {student.events.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "var(--muted-foreground)",
                background: "var(--muted)",
                borderRadius: "14px",
                fontSize: "14px",
              }}
            >
              No events attended
            </div>
          ) : (
            student.events.map((ev, i) => (
              <div
                key={i}
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <iconify-icon
                    icon="lucide:calendar"
                    style={{ fontSize: "18px", color: "#4338ca" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                    }}
                  >
                    {ev.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                      marginTop: "2px",
                    }}
                  >
                    {ev.type} Â· {ev.date}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                    }}
                  >
                    {ev.result}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6366f1",
                      fontWeight: 500,
                      marginTop: "2px",
                    }}
                  >
                    +{ev.pts} pts
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function MyStudents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const YEARS = ["all", ...Array.from(new Set(STUDENTS.map((s) => s.year)))];

  const filtered = useMemo(() => {
    return STUDENTS.filter((s) => {
      const q = search.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchRoll = s.rollNo.toLowerCase().includes(q);
      const matchSkill =
        skillSearch === "" ||
        s.skills.some((sk) =>
          sk.toLowerCase().includes(skillSearch.toLowerCase()),
        );
      const matchYear = yearFilter === "all" || s.year === yearFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return (matchName || matchRoll) && matchSkill && matchYear && matchStatus;
    });
  }, [search, skillSearch, yearFilter, statusFilter]);

  if (selected)
    return (
      <StudentDetail student={selected} onBack={() => setSelected(null)} />
    );

  const counts = {
    all: STUDENTS.length,
    active: STUDENTS.filter((s) => s.status === "active").length,
    "at-risk": STUDENTS.filter((s) => s.status === "at-risk").length,
    inactive: STUDENTS.filter((s) => s.status === "inactive").length,
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            margin: "0 0 4px",
            color: "var(--foreground)",
          }}
        >
          My Students
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--muted-foreground)",
            margin: 0,
          }}
        >
          {STUDENTS.length} mentees Â· Track progress, skills, GitHub activity &
          LeetCode stats
        </p>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Total Mentees",
            value: STUDENTS.length,
            icon: "lucide:users",
            color: "#6366f1",
          },
          {
            label: "Active",
            value: counts.active,
            icon: "lucide:check-circle",
            color: "#16a34a",
          },
          {
            label: "At Risk",
            value: counts["at-risk"],
            icon: "lucide:alert-triangle",
            color: "#d97706",
          },
          {
            label: "Inactive",
            value: counts.inactive,
            icon: "lucide:moon",
            color: "#94a3b8",
          },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: `${c.color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <iconify-icon
                icon={c.icon}
                style={{ fontSize: "20px", color: c.color }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                {c.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  fontWeight: 500,
                }}
              >
                {c.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Row */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        {/* Name / Reg No */}
        <div
          style={{
            position: "relative",
            flex: "1",
            minWidth: "180px",
            maxWidth: "260px",
          }}
        >
          <iconify-icon
            icon="lucide:search"
            style={{
              position: "absolute",
              left: "11px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "14px",
              color: "var(--muted-foreground)",
            }}
          />
          <input
            type="text"
            placeholder="Name or Reg No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: "32px",
              paddingRight: "10px",
              paddingTop: "8px",
              paddingBottom: "8px",
              fontSize: "13px",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              background: "var(--background)",
              color: "var(--foreground)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Skill */}
        <div
          style={{
            position: "relative",
            flex: "1",
            minWidth: "160px",
            maxWidth: "220px",
          }}
        >
          <iconify-icon
            icon="lucide:code-2"
            style={{
              position: "absolute",
              left: "11px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "14px",
              color: "var(--muted-foreground)",
            }}
          />
          <input
            type="text"
            placeholder="Search by skill..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: "32px",
              paddingRight: "10px",
              paddingTop: "8px",
              paddingBottom: "8px",
              fontSize: "13px",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              background: "var(--background)",
              color: "var(--foreground)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Year filter */}
        <div style={{ position: "relative" }}>
          <iconify-icon
            icon="lucide:calendar"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "14px",
              color: "var(--muted-foreground)",
              pointerEvents: "none",
            }}
          />
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{
              paddingLeft: "30px",
              paddingRight: "10px",
              paddingTop: "8px",
              paddingBottom: "8px",
              fontSize: "13px",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              background: "var(--background)",
              color: "var(--foreground)",
              cursor: "pointer",
              outline: "none",
              appearance: "none",
              minWidth: "140px",
            }}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y === "all" ? "All Years" : y}
              </option>
            ))}
          </select>
        </div>

        {/* Status pills */}
        <div
          style={{
            display: "flex",
            gap: "5px",
            background: "var(--muted)",
            borderRadius: "10px",
            padding: "4px",
            marginLeft: "auto",
          }}
        >
          {["all", "active", "at-risk", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "6px 12px",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 500,
                textTransform: "capitalize",
                background:
                  statusFilter === s ? "var(--background)" : "transparent",
                color:
                  statusFilter === s
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                boxShadow:
                  statusFilter === s ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}
            >
              {s === "all"
                ? `All (${counts.all})`
                : s === "active"
                  ? `Active (${counts.active})`
                  : s === "at-risk"
                    ? `At Risk (${counts["at-risk"]})`
                    : `Inactive (${counts.inactive})`}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(search ||
        skillSearch ||
        yearFilter !== "all" ||
        statusFilter !== "all") && (
        <div
          style={{
            fontSize: "12px",
            color: "var(--muted-foreground)",
            marginBottom: "14px",
          }}
        >
          Showing{" "}
          <b style={{ color: "var(--foreground)" }}>{filtered.length}</b> of{" "}
          {STUDENTS.length} students
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "var(--muted-foreground)",
            background: "var(--muted)",
            borderRadius: "14px",
            fontSize: "14px",
          }}
        >
          No students match your search
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((student) => {
            const sc = STATUS_COLOR[student.status];
            return (
              <div
                key={student.id}
                onClick={() => setSelected(student)}
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "transform 0.18s,box-shadow 0.18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px -8px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <img
                    src={student.avatar}
                    alt={student.name}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 999,
                      border: "2px solid var(--border)",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "2px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "var(--foreground)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {student.name}
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "1px 8px",
                          borderRadius: "999px",
                          background: sc.bg,
                          color: sc.color,
                          flexShrink: 0,
                        }}
                      >
                        {student.status === "at-risk"
                          ? "At Risk"
                          : student.status.charAt(0).toUpperCase() +
                            student.status.slice(1)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {student.rollNo} Â· {student.year}
                    </div>
                  </div>
                </div>

                {/* Stats grid â€” 6 cells */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "7px",
                    marginBottom: "12px",
                  }}
                >
                  {[
                    {
                      label: "Participations",
                      value: student.participation,
                      icon: "lucide:calendar-check",
                      color: "#0ea5e9",
                    },
                    {
                      label: "Wins",
                      value: student.wins,
                      icon: "lucide:trophy",
                      color: "#f59e0b",
                    },
                    {
                      label: "Streak",
                      value: `${student.streak}d`,
                      icon: "lucide:flame",
                      color: "#f97316",
                    },
                    {
                      label: "LC Solved",
                      value: student.leetcodeStats.solved,
                      icon: "lucide:code-2",
                      color: "#d97706",
                    },
                    {
                      label: "GH Commits",
                      value: student.githubStats.commits,
                      icon: "lucide:git-commit",
                      color: "#6366f1",
                    },
                    {
                      label: "GPA",
                      value: student.gpa,
                      icon: "lucide:graduation-cap",
                      color: "#10b981",
                    },
                  ].map((st) => (
                    <div
                      key={st.label}
                      style={{
                        background: "var(--muted)",
                        borderRadius: "8px",
                        padding: "7px 9px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginBottom: "2px",
                        }}
                      >
                        <iconify-icon
                          icon={st.icon}
                          style={{ fontSize: "11px", color: st.color }}
                        />
                        <span
                          style={{
                            fontSize: "9px",
                            color: "var(--muted-foreground)",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {st.label}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "var(--foreground)",
                        }}
                      >
                        {st.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills preview */}
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    flexWrap: "wrap",
                    marginBottom: "12px",
                  }}
                >
                  {student.skills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background: "#eff6ff",
                        color: "#4338ca",
                        fontWeight: 500,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                  {student.skills.length > 3 && (
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background: "var(--muted)",
                        color: "var(--muted-foreground)",
                        fontWeight: 500,
                      }}
                    >
                      +{student.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Skill gap warning if any critical */}
                {student.skillGaps.some((g) => g.level === "low") && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 10px",
                      background: "#fef2f2",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <iconify-icon
                      icon="lucide:alert-circle"
                      style={{
                        fontSize: "13px",
                        color: "#dc2626",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#dc2626",
                        fontWeight: 500,
                      }}
                    >
                      {
                        student.skillGaps.filter((g) => g.level === "low")
                          .length
                      }{" "}
                      critical skill gap
                      {student.skillGaps.filter((g) => g.level === "low")
                        .length > 1
                        ? "s"
                        : ""}{" "}
                      detected
                    </span>
                  </div>
                )}

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/portfolio", { state: { student } });
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "4px",
                    fontSize: "12px",
                    color: "var(--primary)",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  View full profile
                  <iconify-icon
                    icon="lucide:arrow-right"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
