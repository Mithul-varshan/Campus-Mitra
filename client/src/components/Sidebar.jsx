import { NavLink, useNavigate } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";

/* ─── Role-based navigation configs ─────────────────────────────────── */

const studentNav = [
  {
    label: "Main",
    items: [
      {
        path: "/dashboard",
        icon: "lucide:layout-dashboard",
        label: "Dashboard",
      },
      { path: "/events", icon: "lucide:calendar", label: "Events" },
      { path: "/projects", icon: "lucide:folder-kanban", label: "My Projects" },
      { path: "/portfolio", icon: "lucide:briefcase", label: "Portfolio" },
      // { path: "/teams", icon: "lucide:users-round", label: "Teams" },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        path: "/innovation-score",
        icon: "lucide:award",
        label: "Innovation Score",
      },
      { path: "/leaderboard", icon: "lucide:trophy", label: "Leaderboard" },
      { path: "/teammates", icon: "lucide:users", label: "Find Teammates" },
    ],
  },
  {
    label: "Account",
    items: [
      {
        path: "/certificates",
        icon: "lucide:badge-check",
        label: "Certificates",
      },
      { path: "/support", icon: "lucide:life-buoy", label: "Support" },
      { path: "/settings", icon: "lucide:settings", label: "Settings" },
    ],
  },
];

const adminNav = [
  {
    label: "Main",
    items: [
      {
        path: "/dashboard",
        icon: "lucide:layout-dashboard",
        label: "Dashboard",
      },
    ],
  },
  {
    label: "Event Management",
    items: [
      {
        path: "/admin/my-events",
        icon: "lucide:calendar-plus",
        label: "My Events",
      },
      {
        path: "/admin/incoming-events",
        icon: "lucide:calendar-clock",
        label: "Incoming Events",
      },
      {
        path: "/admin/events-overview",
        icon: "lucide:calendar-search",
        label: "Events Overview",
      },
      {
        path: "/admin/event-analytics",
        icon: "lucide:bar-chart-2",
        label: "Event Analytics",
      },
    ],
  },
  {
    label: "Institutional Data",
    items: [
      { path: "/analytics", icon: "lucide:bar-chart-3", label: "Analytics" },
      {
        path: "/reports-exports",
        icon: "lucide:download",
        label: "Reports & Exports",
      },
      { path: "/db-assistant", icon: "lucide:database", label: "DB Assistant" },
      { path: "/winners", icon: "lucide:trophy", label: "Winners" },
    ],
  },
  {
    label: "User Management",
    items: [
      { path: "/students", icon: "lucide:users", label: "Students" },
      { path: "/faculty", icon: "lucide:user-check", label: "Faculty" },
      { path: "/bulk-import", icon: "lucide:upload", label: "Bulk Import" },
      { path: "/mentor-mapping", icon: "lucide:link", label: "Mentor Mapping" },
    ],
  },
  {
    label: "Certificates",
    items: [
      {
        path: "/admin/certificates",
        icon: "lucide:badge-check",
        label: "Certificate Management",
      },
    ],
  },
  {
    label: "System",
    items: [
      { path: "/support", icon: "lucide:life-buoy", label: "Support" },
      { path: "/settings", icon: "lucide:settings", label: "Settings" },
    ],
  },
];

const superAdminNav = [
  {
    label: "Main",
    items: [
      {
        path: "/dashboard",
        icon: "lucide:layout-dashboard",
        label: "Dashboard",
      },
      { path: "/colleges", icon: "lucide:building-2", label: "Colleges" },
      {
        path: "/events-monitor",
        icon: "lucide:monitor",
        label: "Events Monitor",
      },
      {
        path: "/subscriptions",
        icon: "lucide:credit-card",
        label: "Subscription & Plans",
      },
      { path: "/audit-logs", icon: "lucide:clipboard", label: "Audit Logs" },
      { path: "/support", icon: "lucide:life-buoy", label: "Support" },
      {
        path: "/platform-settings",
        icon: "lucide:settings",
        label: "Platform Settings",
      },
    ],
  },
];

const recruiterNav = [
  {
    label: "Overview",
    items: [
      {
        path: "/recruiter/dashboard",
        icon: "lucide:layout-dashboard",
        label: "Recruiter Dashboard",
      },
    ],
  },
  {
    label: "Campus Intelligence",
    items: [
      {
        path: "/recruiter/colleges",
        icon: "lucide:building-2",
        label: "College Explorer",
      },
      {
        path: "/recruiter/college-comparison",
        icon: "lucide:git-compare",
        label: "College Comparison",
      },
      {
        path: "/recruiter/skill-heatmap",
        icon: "lucide:flame",
        label: "Skill Heatmap",
      },
    ],
  },
  {
    label: "Talent Discovery",
    items: [
      {
        path: "/recruiter/candidate-discovery",
        icon: "lucide:search",
        label: "Candidate Discovery",
      },
      {
        path: "/recruiter/candidate-profile",
        icon: "lucide:user-circle",
        label: "Candidate Profile",
      },
    ],
  },
  {
    label: "Hiring",
    items: [
      {
        path: "/recruiter/hiring-planner",
        icon: "lucide:calendar-check-2",
        label: "Campus Hiring Planner",
      },
      {
        path: "/recruiter/auto-matched",
        icon: "lucide:zap",
        label: "Auto-Matched Candidates",
      },
      {
        path: "/recruiter/shortlisted",
        icon: "lucide:list-checks",
        label: "Shortlisted Candidates",
      },
      {
        path: "/recruiter/interview-pipeline",
        icon: "lucide:kanban",
        label: "Interview Pipeline",
      },
    ],
  },
  {
    label: "Insights & Saved",
    items: [
      {
        path: "/recruiter/analytics",
        icon: "lucide:bar-chart-2",
        label: "Recruiter Analytics",
      },
      {
        path: "/recruiter/saved-colleges",
        icon: "lucide:bookmark",
        label: "Saved Colleges",
      },
      {
        path: "/recruiter/saved-candidates",
        icon: "lucide:heart",
        label: "Saved Candidates",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        path: "/recruiter/settings",
        icon: "lucide:settings",
        label: "Settings & Company Profile",
      },
    ],
  },
];

const teacherNav = [
  {
    label: "Main",
    items: [
      {
        path: "/teacher/dashboard",
        icon: "lucide:layout-dashboard",
        label: "Dashboard",
      },
      { path: "/my-students", icon: "lucide:users", label: "My Students" },
      { path: "/teacher/events", icon: "lucide:calendar", label: "Events" },
      {
        path: "/teacher/verified-achievements",
        icon: "lucide:shield-check",
        label: "Verified Achievements",
      },
      {
        path: "/teacher/skill-intelligence",
        icon: "lucide:bar-chart-2",
        label: "Skill Intelligence",
      },
      { path: "/support", icon: "lucide:life-buoy", label: "Support" },
    ],
  },
];

const NAV_BY_ROLE = {
  [ROLES.STUDENT]: studentNav,
  [ROLES.ADMIN]: adminNav,
  [ROLES.SUPER_ADMIN]: superAdminNav,
  [ROLES.TEACHER]: teacherNav,
  [ROLES.RECRUITER]: recruiterNav,
};

const ROLE_LABELS = {
  [ROLES.STUDENT]: "Student",
  [ROLES.ADMIN]: "Admin",
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.TEACHER]: "Teacher",
  [ROLES.RECRUITER]: "Recruiter",
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navSections = NAV_BY_ROLE[user?.role] || studentNav;
  const studentDisplayName =
    user?.role === ROLES.STUDENT && user?.githubUsername?.trim()
      ? user.githubUsername.trim()
      : "CampusMitra User";
  const studentAvatarSeed =
    user?.role === ROLES.STUDENT && user?.githubUsername?.trim()
      ? user.githubUsername.trim()
      : "ananya";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <aside
      style={{
        width: "260px",
        backgroundColor: "var(--background)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: "60px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          borderBottom: "1px solid transparent",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--primary)",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              background: "var(--primary)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <iconify-icon
              icon="lucide:graduation-cap"
              style={{ fontSize: "16px", color: "white" }}
            ></iconify-icon>
          </div>
          CampusMitra
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {navSections.map((section) => (
          <div key={section.label}>
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--muted-foreground)",
                fontWeight: 600,
                padding: "16px 12px 8px",
              }}
            >
              {section.label}
            </div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  color: isActive ? "var(--primary)" : "var(--foreground)",
                  backgroundColor: isActive
                    ? "var(--secondary)"
                    : "transparent",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "all 0.2s",
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains("active-link")) {
                    e.currentTarget.style.backgroundColor = "var(--secondary)";
                    e.currentTarget.style.color = "var(--foreground)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.getAttribute("aria-current")) {
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.color = "var(--foreground)";
                  }
                }}
              >
                <iconify-icon
                  icon={item.icon}
                  style={{ fontSize: "16px" }}
                ></iconify-icon>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <img
            src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(studentAvatarSeed)}&backgroundColor=ffd5dc`}
            alt="Student Avatar"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--foreground)",
              }}
            >
              {studentDisplayName}
            </span>
            <span
              style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
            >
              {ROLE_LABELS[user?.role] || "Student"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "8px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--background)",
            color: "var(--muted-foreground)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fef2f2";
            e.currentTarget.style.color = "#dc2626";
            e.currentTarget.style.borderColor = "#fecaca";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--background)";
            e.currentTarget.style.color = "var(--muted-foreground)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <iconify-icon
            icon="lucide:log-out"
            style={{ fontSize: "14px" }}
          ></iconify-icon>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
