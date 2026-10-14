import { useState } from "react";

/* ─── Data ──────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    title: "Smart Campus Nav",
    domain: "AI & Mapping",
    domainColor: { bg: "#eff6ff", text: "#1d4ed8" },
    status: "Active",
    statusColor: { bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6" },
    description:
      "An AI-powered navigation system for large university campuses using AR and real-time crowd data.",
    completion: 65,
    completionColor: "#2b4ed6",
    milestones: 3,
    badges: [],
    badgeTags: [
      {
        label: "Trending",
        icon: "lucide:trending-up",
        color: "#f59e0b",
        bg: "#fffbeb",
      },
    ],
    teammates: [
      "https://api.dicebear.com/9.x/thumbs/svg?seed=arjun&backgroundColor=b6e3f4",
      "https://api.dicebear.com/9.x/thumbs/svg?seed=priya&backgroundColor=ffd5dc",
      "https://api.dicebear.com/9.x/thumbs/svg?seed=kiran&backgroundColor=c0aede",
    ],
    extraTeam: 0,
    updated: "Updated 2 days ago",
    action: {
      label: "View Details",
      icon: "lucide:arrow-right",
      variant: "link",
    },
  },
  {
    id: 2,
    title: "EcoSense IoT",
    domain: "IoT & Hardware",
    domainColor: { bg: "#fff7ed", text: "#c2410c" },
    status: "Review",
    statusColor: { bg: "#fffbeb", text: "#d97706", dot: "#f59e0b" },
    description:
      "Smart irrigation system measuring soil moisture and weather patterns to optimize water usage.",
    completion: 90,
    completionColor: "#f59e0b",
    milestones: null,
    meta2Label: "Patent Pending",
    meta2Val: 1,
    badges: [],
    badgeTags: [],
    teammates: [
      "https://api.dicebear.com/9.x/thumbs/svg?seed=divya&backgroundColor=ffd5dc",
    ],
    extraTeam: 0,
    updated: "Updated 1 week ago",
    action: {
      label: "View Details",
      icon: "lucide:arrow-right",
      variant: "link",
    },
  },
  {
    id: 3,
    title: "MediChain Ledger",
    domain: "Blockchain",
    domainColor: { bg: "#f0fdf4", text: "#15803d" },
    status: "Won",
    statusColor: {
      bg: "#f0fdf4",
      text: "#16a34a",
      dot: "#22c55e",
      check: true,
    },
    description:
      "Decentralized patient record storage winning 1st place at National Health Hackathon 2024.",
    completion: 100,
    completionColor: "#22c55e",
    milestones: null,
    meta2Label: "Upvotes",
    meta2Val: 250,
    badges: [],
    badgeTags: [],
    teammates: [
      "https://api.dicebear.com/9.x/thumbs/svg?seed=rahul&backgroundColor=b6e3f4",
      "https://api.dicebear.com/9.x/thumbs/svg?seed=sneha&backgroundColor=ffd5dc",
      "https://api.dicebear.com/9.x/thumbs/svg?seed=arjun&backgroundColor=b6e3f4",
      "https://api.dicebear.com/9.x/thumbs/svg?seed=priya&backgroundColor=ffd5dc",
    ],
    extraTeam: 0,
    updated: "Completed Dec 2024",
    action: {
      label: "View Archive",
      icon: "lucide:arrow-right",
      variant: "link",
    },
  },
  {
    id: 4,
    title: "Alumni Connect",
    domain: "Web Development",
    domainColor: { bg: "#eff6ff", text: "#1d4ed8" },
    status: "Active",
    statusColor: { bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6" },
    description:
      "Connecting current students with alumni for mentorship and job opportunities.",
    completion: 25,
    completionColor: "#2b4ed6",
    milestones: null,
    meta2Label: "Reviews",
    meta2Val: 0,
    badges: [],
    badgeTags: [
      {
        label: "+ Find Team",
        icon: "lucide:user-plus",
        color: "#2563eb",
        bg: "#eff6ff",
      },
    ],
    teammates: [
      "https://api.dicebear.com/9.x/thumbs/svg?seed=ananya&backgroundColor=ffd5dc",
    ],
    extraTeam: 1,
    updated: "Updated 5 hours ago",
    action: {
      label: "View Details",
      icon: "lucide:arrow-right",
      variant: "link",
    },
  },
  {
    id: 5,
    title: "Quantum Encryption",
    domain: "Cybersecurity",
    domainColor: { bg: "#faf5ff", text: "#7e22ce" },
    status: "Draft",
    statusColor: { bg: "#f8fafc", text: "#64748b", dot: "#94a3b8" },
    description:
      "Research paper on post-quantum cryptography standards for banking.",
    completion: 10,
    completionColor: "#94a3b8",
    milestones: null,
    meta2Label: "Milestones",
    meta2Val: "--",
    badges: [],
    badgeTags: [
      {
        label: "Idea Stage",
        icon: "lucide:lightbulb",
        color: "#7c3aed",
        bg: "#f3e8ff",
      },
    ],
    teammates: [
      "https://api.dicebear.com/9.x/thumbs/svg?seed=vikram&backgroundColor=b6e3f4",
    ],
    extraTeam: 0,
    updated: "Created yesterday",
    action: {
      label: "Edit Draft",
      icon: "lucide:pencil",
      variant: "link-muted",
    },
  },
];

const STATS = [
  {
    icon: "lucide:zap",
    color: "#2b4ed6",
    bg: "#eff6ff",
    value: "3",
    label: "Active Projects",
  },
  {
    icon: "lucide:check-circle",
    color: "#16a34a",
    bg: "#f0fdf4",
    value: "12",
    label: "Completed",
  },
  {
    icon: "lucide:users",
    color: "#f59e0b",
    bg: "#fffbeb",
    value: "8",
    label: "Teammates",
  },
  {
    icon: "lucide:star",
    color: "#f59e0b",
    bg: "#fffbeb",
    value: "850",
    label: "Points Earned",
  },
];

const TABS = ["All Projects", "Active", "Completed", "Mentored"];

/* ─── Sub-components ────────────────────────────────────────────────── */
function StatusBadge({ status, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 999,
        background: color.bg,
        color: color.text,
      }}
    >
      {color.check ? (
        <iconify-icon icon="lucide:check" style={{ fontSize: 11 }} />
      ) : (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: color.dot,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
      )}
      {status}
    </span>
  );
}

function ProgressBar({ pct, color }) {
  return (
    <div
      style={{
        width: "100%",
        height: 5,
        background: "#e2e8f0",
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 999,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

function TeammateAvatars({ avatars, extra }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {avatars.slice(0, 3).map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          onError={(e) => {
            e.currentTarget.src = `https://api.dicebear.com/9.x/thumbs/svg?seed=${i}&backgroundColor=e2e8f0`;
          }}
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            objectFit: "cover",
            border: "2px solid #fff",
            marginLeft: i === 0 ? 0 : -8,
            zIndex: avatars.length - i,
            position: "relative",
            background: "#f1f5f9",
          }}
        />
      ))}
      {extra > 0 && (
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            background: "#e2e8f0",
            color: "#64748b",
            fontSize: 10,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #fff",
            marginLeft: -8,
            position: "relative",
          }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "22px 22px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 28px -8px rgba(0,0,0,0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Row 1: title + status */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 6,
            }}
          >
            {project.title}
          </div>
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 4,
              background: project.domainColor.bg,
              color: project.domainColor.text,
            }}
          >
            {project.domain}
          </span>
        </div>
        <StatusBadge status={project.status} color={project.statusColor} />
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 13,
          color: "#475569",
          lineHeight: 1.55,
          margin: "10px 0 16px",
          minHeight: 40,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {project.description}
      </p>

      {/* Progress */}
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#64748b",
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          <span>Project Completion</span>
          <span style={{ fontWeight: 700, color: "#0f172a" }}>
            {project.completion}%
          </span>
        </div>
        <ProgressBar pct={project.completion} color={project.completionColor} />
      </div>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 13,
          color: "#64748b",
          marginBottom: 14,
        }}
      >
        {project.milestones != null && (
          <span>
            <strong style={{ color: "#0f172a" }}>{project.milestones}</strong>{" "}
            Milestones
          </span>
        )}
        {project.meta2Label && (
          <span>
            <strong style={{ color: "#0f172a" }}>{project.meta2Val}</strong>{" "}
            {project.meta2Label}
          </span>
        )}
      </div>

      {/* Avatars + badge tags */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <TeammateAvatars
          avatars={project.teammates}
          extra={project.extraTeam}
        />
        {project.badgeTags.map((tag) => (
          <span
            key={tag.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 999,
              background: tag.bg,
              color: tag.color,
            }}
          >
            <iconify-icon icon={tag.icon} style={{ fontSize: 11 }} />
            {tag.label}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{ height: 1, background: "var(--border)", marginBottom: 14 }}
      />

      {/* Footer: updated + action */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: "#94a3b8" }}>
          {project.updated}
        </span>
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 13,
            fontWeight: 600,
            color:
              project.action.variant === "link-muted"
                ? "#64748b"
                : "var(--primary)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {project.action.label}
          <iconify-icon icon={project.action.icon} style={{ fontSize: 13 }} />
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function MyProjects() {
  const [activeTab, setActiveTab] = useState("All Projects");
  const [showModal, setShowModal] = useState(false);

  const filtered = PROJECTS.filter((p) => {
    if (activeTab === "All Projects") return true;
    if (activeTab === "Active") return p.status === "Active";
    if (activeTab === "Completed")
      return p.status === "Won" || p.completion === 100;
    if (activeTab === "Mentored") return false;
    return true;
  });

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: 1160,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* ── Page Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: "0 0 4px",
              color: "#0f172a",
            }}
          >
            My Projects
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Manage your ongoing research, hackathon submissions, and startup
            ideas.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1e3fa8")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--primary)")
          }
        >
          <iconify-icon icon="lucide:plus" style={{ fontSize: 16 }} />
          Start New Project
        </button>
      </div>

      {/* ── Stats ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <iconify-icon
                icon={s.icon}
                style={{ fontSize: 20, color: s.color }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 28,
          borderBottom: "1px solid var(--border)",
          marginBottom: 28,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 0",
              fontSize: 14,
              fontWeight: activeTab === tab ? 600 : 500,
              color: activeTab === tab ? "var(--primary)" : "#64748b",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === tab
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
              marginBottom: -1,
              cursor: "pointer",
              transition: "color 0.15s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Projects Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 22,
        }}
      >
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}

        {/* New Project Card */}
        <div
          onClick={() => setShowModal(true)}
          style={{
            background: "#fff",
            border: "2px dashed #cbd5e1",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            minHeight: 220,
            cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.background = "#f8faff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.background = "#fff";
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <iconify-icon
              icon="lucide:plus"
              style={{ fontSize: 20, color: "var(--primary)" }}
            />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>
            Start New Project
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            Add a hackathon, research or idea
          </div>
        </div>
      </div>

      {/* ── New Project Modal ── */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            backdropFilter: "blur(2px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "36px 32px",
              width: 480,
              maxWidth: "90vw",
              boxShadow: "0 24px 60px -12px rgba(0,0,0,0.25)",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div>
                <div
                  style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}
                >
                  Start New Project
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                  Fill in your project details to get started.
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: 4,
                }}
              >
                <iconify-icon icon="lucide:x" style={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Fields */}
            {[
              {
                label: "Project Title",
                placeholder: "e.g. Smart Campus Nav",
                type: "text",
              },
              {
                label: "Domain / Category",
                placeholder: "e.g. AI & ML, IoT, Blockchain…",
                type: "text",
              },
            ].map((field) => (
              <div key={field.label} style={{ marginBottom: 18 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    fontSize: 14,
                    outline: "none",
                    color: "#0f172a",
                    fontFamily: "var(--font-family-body)",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--primary)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                />
              </div>
            ))}

            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Description
              </label>
              <textarea
                placeholder="Briefly describe your project idea..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 14,
                  outline: "none",
                  resize: "vertical",
                  color: "#0f172a",
                  fontFamily: "var(--font-family-body)",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--primary)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Status
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 14,
                  outline: "none",
                  color: "#0f172a",
                  background: "#fff",
                  fontFamily: "var(--font-family-body)",
                  cursor: "pointer",
                }}
              >
                <option>Draft</option>
                <option>Active</option>
                <option>Review</option>
                <option>Completed</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  background: "#fff",
                  color: "#334155",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  border: "none",
                  borderRadius: 7,
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1e3fa8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--primary)")
                }
              >
                <iconify-icon icon="lucide:plus" style={{ fontSize: 15 }} />
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
