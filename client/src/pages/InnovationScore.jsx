import { useState } from "react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

/* ─── Data ───────────────────────────────────────────────────────────── */
const SCORE = 850;
const MAX = 1000;

const BREAKDOWN = [
  {
    icon: "lucide:code-2",
    label: "Hackathons",
    value: 12,
    color: "#2b4ed6",
    bg: "#eff6ff",
  },
  {
    icon: "lucide:trophy",
    label: "Wins",
    value: 3,
    color: "#d97706",
    bg: "#fffbeb",
  },

  {
    icon: "lucide:users",
    label: "Workshops",
    value: 8,
    color: "#7c3aed",
    bg: "#f3e8ff",
  },
  {
    icon: "lucide:thumbs-up",
    label: "Upvotes",
    value: 156,
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    icon: "lucide:handshake",
    label: "Mentorships",
    value: 2,
    color: "#be185d",
    bg: "#fdf2f8",
  },
];

const LAST_12_MONTHS = (() => {
  const names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();
  const res = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    res.push(names[d.getMonth()]);
  }
  return res;
})();

const POINTS_12 = [420, 450, 480, 500, 530, 580, 620, 650, 700, 730, 800, 850];

const COMPARISON = [
  {
    label: "You",
    value: 850,
    max: 1000,
    color: "#f59e0b",
    textColor: "#d97706",
  },
  {
    label: "Avg",
    value: 550,
    max: 1000,
    color: "#94a3b8",
    textColor: "#64748b",
  },
  {
    label: "Top",
    value: 920,
    max: 1000,
    color: "#2b4ed6",
    textColor: "#1d4ed8",
  },
];

const BADGES = [
  {
    icon: "lucide:code-2",
    label: "Code Ninja",
    color: "#2b4ed6",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    icon: "lucide:zap",
    label: "Fast Ship",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    icon: "lucide:users-round",
    label: "Team Player",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    icon: "lucide:award",
    label: "Hack Winner",
    color: "#7c3aed",
    bg: "#f3e8ff",
    border: "#ddd6fe",
  },
];

const TIPS = [
  {
    icon: "lucide:users-round",
    text: "participate in events",
    pts: "+20 pts",
  },
  {
    icon: "lucide:file-badge",
    text: "Upload a new certificate",
    pts: "+10 pts",
  },
  {
    icon: "lucide:calendar",
    text: "Register for upcoming events",
    pts: "+3 pts",
  },
];

const TIMELINE = [
  {
    date: "Jan 15",
    event: "Won AI Innovation Challenge",
    pts: "+120",
    type: "win",
  },
  {
    date: "Dec 22",
    event: "Completed Advanced React Workshop",
    pts: "+40",
    type: "workshop",
  },

  { date: "Nov 28", event: "Mentored 2 Students", pts: "+40", type: "mentor" },
];

/* ─── Score Ring SVG ─────────────────────────────────────────────────── */
function ScoreRing({ score, max }) {
  const r = 58;
  const circ = 2 * Math.PI * r;
  const pct = score / max;
  const blueEnd = 0.28;

  return (
    <div
      style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}
    >
      <svg width={160} height={160}>
        {/* Track */}
        <circle
          cx={80}
          cy={80}
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={12}
        />
        {/* Blue leading segment */}
        <circle
          cx={80}
          cy={80}
          r={r}
          fill="none"
          stroke="#2b4ed6"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${circ * blueEnd} ${circ}`}
          strokeDashoffset={circ * 0.25}
        />
        {/* Orange main arc */}
        <circle
          cx={80}
          cy={80}
          r={r}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${circ * (pct - blueEnd)} ${circ}`}
          strokeDashoffset={circ * 0.25 - circ * blueEnd}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
          / {max}
        </span>
      </div>
    </div>
  );
}

/* ─── Bar Chart ──────────────────────────────────────────────────────── */
function GrowthChart({ months, points }) {
  const maxP = Math.max(...points);
  const H = 140;
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        height: H + 48,
        paddingTop: 28,
      }}
    >
      {months.map((m, i) => {
        const isLast = i === months.length - 1;
        const barH = Math.round((points[i] / maxP) * H);
        const isHov = hovered === i;

        return (
          <div
            key={m}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              position: "relative",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip */}
            {isHov && (
              <div
                style={{
                  position: "absolute",
                  top: -32,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#0f172a",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 5,
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                {points[i]} pts
              </div>
            )}
            {/* Delta tag above last bar */}
            {isLast && (
              <div
                style={{
                  position: "absolute",
                  top: -22,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#f59e0b",
                }}
              >
                +120
              </div>
            )}
            <div
              style={{
                width: "100%",
                height: barH,
                borderRadius: "5px 5px 0 0",
                background: isLast
                  ? "linear-gradient(180deg,#fbbf24,#f59e0b)"
                  : isHov
                    ? "#cbd5e1"
                    : "#e2e8f0",
                transition: "background 0.15s, height 0.3s",
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
              {m}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Comparison Bar ──────────────────────────────────────────────────── */
function CompBar({ label, value, max, color, textColor }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
          {label}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: textColor }}>
          {value}
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: "#f1f5f9",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(value / max) * 100}%`,
            borderRadius: 999,
            background: color,
            transition: "width 0.7s ease",
          }}
        />
      </div>
    </div>
  );
}

/* ─── ─── ─── Main Page ─── ─── ─── */
export default function InnovationScore() {
  const navigate = useNavigate();
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  // Download report as PDF
  function handleDownloadReport() {
    const doc = new jsPDF();
    let y = 14;
    doc.setFontSize(18);
    doc.text("Innovation Credit Score Report", 14, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`ICS: ${SCORE} / ${MAX}`, 14, y);
    y += 8;
    doc.text("Breakdown:", 14, y);
    y += 7;
    BREAKDOWN.forEach((b) => {
      doc.text(`- ${b.label}: ${b.value}`, 18, y);
      y += 7;
    });
    y += 2;
    doc.text("Badges:", 14, y);
    y += 7;
    BADGES.forEach((b) => {
      doc.text(`- ${b.label}`, 18, y);
      y += 7;
    });
    y += 2;
    doc.text("Recent Activity:", 14, y);
    y += 7;
    TIMELINE.forEach((t) => {
      doc.text(`- ${t.event} (${t.date}): ${t.pts}`, 18, y);
      y += 7;
      if (y > 270) {
        doc.addPage();
        y = 14;
      }
    });
    doc.save("innovation_report.pdf");
  }

  return (
    <div
      style={{
        padding: "22px 1px",
        maxWidth: 1120,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* All Badges Modal */}
      {showBadgesModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(2,6,23,0.55)",
            }}
            onClick={() => setShowBadgesModal(false)}
          />
          <div
            style={{
              position: "relative",
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              width: "min(920px,96%)",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(2,6,23,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
                All Badges
              </h3>
              <button
                onClick={() => setShowBadgesModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 20,
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {BADGES.map((b) => (
                <div
                  key={b.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: b.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <iconify-icon
                      icon={b.icon}
                      style={{ fontSize: 18, color: b.color }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {b.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Activity Modal */}
      {showActivityModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(2,6,23,0.55)",
            }}
            onClick={() => setShowActivityModal(false)}
          />
          <div
            style={{
              position: "relative",
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              width: "min(700px,96%)",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(2,6,23,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
                All Activity
              </h3>
              <button
                onClick={() => setShowActivityModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 20,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {TIMELINE.map((item, i) => {
                const conf = {
                  win: {
                    color: "#d97706",
                    bg: "#fffbeb",
                    icon: "lucide:trophy",
                  },
                  workshop: {
                    color: "#7c3aed",
                    bg: "#f3e8ff",
                    icon: "lucide:users",
                  },
                  mentor: {
                    color: "#16a34a",
                    bg: "#f0fdf4",
                    icon: "lucide:handshake",
                  },
                }[item.type];
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: 12,
                      border: "1px solid #e2e8f0",
                      borderRadius: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 9,
                        background: conf.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <iconify-icon
                        icon={conf.icon}
                        style={{ fontSize: 18, color: conf.color }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {item.event}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}
                      >
                        {item.date}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#16a34a",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        padding: "4px 12px",
                        borderRadius: 999,
                      }}
                    >
                      {item.pts}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 4px",
            }}
          >
            Innovation Credit Score (ICS)
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Track your academic innovation journey and achievements.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 20px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e3fa8")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--primary)")
            }
            onClick={handleDownloadReport}
          >
            <iconify-icon icon="lucide:download" style={{ fontSize: 15 }} />
            Download Report
          </button>

          <div
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => setShowInfoTooltip(true)}
            onMouseLeave={() => setShowInfoTooltip(false)}
          >
            <div
              onClick={() => setShowInfoModal(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "#fff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <iconify-icon
                icon="lucide:alert-triangle"
                style={{ fontSize: 16, color: "#f59e0b" }}
              />
            </div>

            {showInfoTooltip && (
              <div
                onMouseEnter={() => setShowInfoTooltip(true)}
                onMouseLeave={() => setShowInfoTooltip(false)}
                style={{
                  position: "absolute",
                  right: "calc(100% + 12px)",
                  top: 14,
                  background: "#fff",
                  color: "#0f172a",
                  padding: "12px",
                  borderRadius: 10,
                  fontSize: 13,
                  whiteSpace: "normal",
                  border: "1px solid #e2e8f0",
                  zIndex: 9999,
                  boxShadow: "0 16px 40px rgba(2,6,23,0.08)",
                  maxWidth: 320,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                    width: 1000,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 800 }}>
                    How to increase your ICS
                  </div>
                  <button
                    onClick={() => {
                      setShowInfoModal(true);
                      setShowInfoTooltip(false);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Open
                  </button>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {TIPS.map((t) => (
                    <div
                      key={t.text}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px",
                        borderRadius: 8,
                        background: "#f8fafc",
                        border: "1px solid #f1f5f9",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                        }}
                      >
                        <iconify-icon
                          icon={t.icon}
                          style={{
                            fontSize: 14,
                            color: "#64748b",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: 13, color: "#475569" }}>
                          {t.text}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#16a34a",
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          padding: "4px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {t.pts}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    position: "absolute",
                    right: -6,
                    top: "50%",
                    transform: "translateY(-50%) rotate(45deg)",
                    width: 12,
                    height: 12,
                    background: "#fff",
                    borderRight: "1px solid #e2e8f0",
                    borderTop: "1px solid #e2e8f0",
                    boxShadow: "0 6px 14px rgba(2,6,23,0.04)",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Hero Card ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          padding: "28px 32px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <ScoreRing score={SCORE} max={MAX} />

        <div style={{ flex: "1 1 180px" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 5,
            }}
          >
            Excellent Progress! 🚀
          </div>
          <div style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.65 }}>
            You are in the{" "}
            <span style={{ fontWeight: 700, color: "#0f172a" }}>top 5%</span> of
            innovators in your college this semester.
          </div>
          {/* Score progress strip */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                background: "#f1f5f9",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(SCORE / MAX) * 100}%`,
                  borderRadius: 999,
                  background: "linear-gradient(90deg,#2b4ed6,#f59e0b)",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#94a3b8",
                whiteSpace: "nowrap",
              }}
            >
              {SCORE} / {MAX}
            </span>
          </div>
        </div>

        <div
          style={{ width: 1, height: 80, background: "#e2e8f0", flexShrink: 0 }}
          className="divider"
        />

        {/* Rank stats */}
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          {[
            { val: "#4", sub: "College Rank", color: "#0f172a" },
            { val: "#1", sub: "Dept. Rank", color: "#0f172a" },
            { val: "Top 100", sub: "National Rank", color: "#f59e0b" },
          ].map((r) => (
            <div key={r.sub} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: r.color,
                  lineHeight: 1,
                }}
              >
                {r.val}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "#94a3b8",
                  marginTop: 5,
                  fontWeight: 500,
                }}
              >
                {r.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2-col grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* ── Left ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Score Breakdown */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "22px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                Score Breakdown
              </span>
              <iconify-icon
                icon="lucide:info"
                style={{ fontSize: 16, color: "#cbd5e1", cursor: "pointer" }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}
            >
              {BREAKDOWN.map((b) => (
                <div
                  key={b.label}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "14px 16px 12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    cursor: "default",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = b.color;
                    e.currentTarget.style.background = b.bg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: b.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <iconify-icon
                      icon={b.icon}
                      style={{ fontSize: 15, color: b.color }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 900,
                      color: "#0f172a",
                      lineHeight: 1,
                    }}
                  >
                    {b.value}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      color: "#94a3b8",
                      fontWeight: 500,
                    }}
                  >
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Innovation Growth */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "22px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                Innovation Growth
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#64748b",
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  padding: "4px 12px",
                  borderRadius: 6,
                }}
              >
                Last 12 Months
              </span>
            </div>
            <GrowthChart months={LAST_12_MONTHS} points={POINTS_12} />
          </div>

          {/* Recent Activity */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "22px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                Recent Activity
              </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--primary)",
                  cursor: "pointer",
                  padding: 0,
                }}
                onClick={() => setShowActivityModal(true)}
              >
                View All
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {TIMELINE.map((item, i) => {
                const conf = {
                  win: {
                    color: "#d97706",
                    bg: "#fffbeb",
                    icon: "lucide:trophy",
                  },
                  workshop: {
                    color: "#7c3aed",
                    bg: "#f3e8ff",
                    icon: "lucide:users",
                  },
                  mentor: {
                    color: "#16a34a",
                    bg: "#f0fdf4",
                    icon: "lucide:handshake",
                  },
                }[item.type];
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      paddingBottom: i < TIMELINE.length - 1 ? 16 : 0,
                    }}
                  >
                    {/* Timeline dot + line */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          background: conf.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <iconify-icon
                          icon={conf.icon}
                          style={{ fontSize: 15, color: conf.color }}
                        />
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <div
                          style={{
                            width: 1,
                            flex: 1,
                            background: "#e2e8f0",
                            marginTop: 6,
                            minHeight: 16,
                          }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1, paddingTop: 6 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          {item.event}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#16a34a",
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            padding: "2px 9px",
                            borderRadius: 999,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.pts}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 11.5,
                          color: "#94a3b8",
                          marginTop: 2,
                          display: "block",
                        }}
                      >
                        {item.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Dept. Comparison */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "22px 24px",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 20,
              }}
            >
              Dept. Comparison
            </div>
            {COMPARISON.map((c) => (
              <CompBar
                key={c.label}
                label={c.label}
                value={c.value}
                max={c.max}
                color={c.color}
                textColor={c.textColor}
              />
            ))}
            <div
              style={{
                marginTop: 8,
                padding: "10px 14px",
                borderRadius: 8,
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <iconify-icon
                icon="lucide:trending-up"
                style={{ fontSize: 14, color: "#16a34a", flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: "#15803d", lineHeight: 1.5 }}>
                You are <strong>54% better</strong> than the department average.
              </span>
            </div>
          </div>

          {/* Recent Badges */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "22px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                Recent Badges
              </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--primary)",
                  cursor: "pointer",
                  padding: 0,
                }}
                onClick={() => setShowBadgesModal(true)}
              >
                View All
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 10,
              }}
            >
              {BADGES.map((b) => (
                <div
                  key={b.label}
                  style={{
                    background: b.bg,
                    border: `1px solid ${b.border}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "default",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-1px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 2px 8px -2px ${b.border}`,
                      flexShrink: 0,
                    }}
                  >
                    <iconify-icon
                      icon={b.icon}
                      style={{ fontSize: 16, color: b.color }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Boost CTA */}
          <div
            style={{
              background: "linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)",
              border: "1px solid #bfdbfe",
              borderRadius: 14,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "#fff",
                  border: "1px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px -2px #bfdbfe",
                }}
              >
                <iconify-icon
                  icon="lucide:rocket"
                  style={{ fontSize: 17, color: "var(--primary)" }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: "#1e40af",
                    marginBottom: 5,
                  }}
                >
                  Boost your score!
                </div>
                <div
                  style={{ fontSize: 12.5, color: "#3b82f6", lineHeight: 1.65 }}
                >
                  Participate in the upcoming <strong>"AI for Good"</strong>{" "}
                  Hackathon to potentially reach the Top 3 in your department.
                </div>
              </div>
            </div>
            <button
              style={{
                padding: "9px 18px",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              onClick={() => navigate("/events")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1e3fa8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--primary)")
              }
            >
              <iconify-icon icon="lucide:calendar" style={{ fontSize: 13 }} />
              View Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
