import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import profilePhoto from "../../assets/profile.jpg";

// Fixed profile data
const PROFILE_DATA = {
  name: "Student",
  course: "B.Tech, Computer Science",
  batch: "Class of 2025",
  track: "AI & Sustainability",
  innovationScore: 842,
  cohortRank: "Top 2%",
};

// Fixed summary stats
const SUMMARY_STATS = {
  innovationCredits: 124,
  creditsGain: "+18 this term",
  creditsSubtext: "Across 9 events and 3 projects",
  skillsBenchmarked: 27,
  skillsBreakdown: "8 advanced • 12 intermediate • 7 emerging",
  achievements: 11,
  achievementsBreakdown: "3 institutional • 2 national • 6 campus",
  leaderboardRank: "#07",
  leaderboardSubtext: "Out of 1,248 active innovators",
};

// Fixed highlights timeline
const HIGHLIGHTS_TIMELINE = [
  {
    id: 1,
    date: "Oct 2024",
    title: "Winner, AI for Sustainability Hackathon",
    subtitle: "EcoTrack AI • Innovation credits: +40",
    badge: "Institution Level",
    badgeType: "gold",
    dotColor: "var(--primary)",
  },
  {
    id: 2,
    date: "Sep 2024",
    title: "Completed Advanced ML Track",
    subtitle: "Skill benchmark: Advanced • 3 assessments",
    badge: "Skill Badge",
    badgeType: "purple",
    dotColor: "#6d28d9",
  },
  {
    id: 3,
    date: "Aug 2024",
    title: "Speaker at DevFest Campus",
    subtitle: "Talk: Building Responsible AI Products",
    badge: "Community",
    badgeType: "blue",
    dotColor: "#1d4ed8",
  },
];

// Fixed projects data
const PROJECTS_DATA = [
  {
    id: 1,
    title: "EcoTrack AI",
    description:
      "Computer vision system for automated waste segregation across campus dining halls.",
    role: "Tech Lead",
    impact: "18% waste diversion",
    credits: "+32",
    icon: "lucide:leaf",
    iconColor: "var(--primary)",
    iconBg: "var(--secondary)",
  },
  {
    id: 2,
    title: "Smart Campus Scheduler",
    description:
      "Event routing engine to reduce clashes and maximize venue utilization.",
    role: "Architect",
    contributors: "4",
    extra: "Open source",
    icon: "lucide:cloud",
    iconColor: "#0f766e",
    iconBg: "#ecfdf5",
  },
  {
    id: 3,
    title: "Campus Voices Podcast",
    description:
      "Storytelling series featuring student innovators and their journeys.",
    role: "Host",
    extra: "Soft skills",
    icon: "lucide:mic",
    iconColor: "#7c2d12",
    iconBg: "#ffedd5",
  },
];

// Fixed skills data
const SKILLS_DATA = [
  { label: "AI & ML", score: 8.8, level: "Advanced", type: "tech" },
  {
    label: "Full-stack",
    score: 7.6,
    level: "Upper-intermediate",
    type: "tech",
  },
  { label: "Cloud & DevOps", score: 6.4, level: "Intermediate", type: "tech" },
  { label: "Communication", score: 9.0, level: "Advanced", type: "soft" },
  {
    label: "Leadership",
    score: 8.2,
    level: "Upper-intermediate",
    type: "soft",
  },
  {
    label: "Sustainability",
    score: 7.2,
    level: "Domain depth",
    type: "domain",
  },
];

// Fixed activity data
const ACTIVITY_DATA = [
  {
    id: 1,
    time: "3h ago",
    title: "Merged PR to EcoTrack AI",
    detail: "Refactored model inference pipeline",
    badge: "+4 credits",
    badgeBg: "#e0f2fe",
    badgeColor: "#0369a1",
  },
  {
    id: 2,
    time: "Yesterday",
    title: "Spoke at 'Intro to ML' meetup",
    detail: "Soft skills benchmark updated",
    badge: "+3 credits",
    badgeBg: "#dcfce7",
    badgeColor: "#166534",
  },
  {
    id: 3,
    time: "Mon",
    title: "Registered for Cloud Native Lab",
    detail: "Upcoming event, skill tags: Kubernetes",
    badge: "Planned",
    badgeBg: "#eef2ff",
    badgeColor: "#3730a3",
  },
];

// Fixed links data
const LINKS_DATA = [
  {
    icon: "lucide:github",
    label: "GitHub",
    url: "github.com/rajat7421",
    status: "Visible",
    statusType: "open",
  },
  {
    icon: "lucide:linkedin",
    label: "LinkedIn",
    url: "linkedin.com/in/rajat7421",
    status: "Visible",
    statusType: "open",
  },
  {
    icon: "lucide:globe-2",
    label: "Portfolio Site",
    url: "rajat.dev",
    status: "Campus only",
    statusType: "closed",
  },
  {
    icon: "lucide:users",
    label: "Open to teaming",
    url: "AI, Sustainability, Climate tech",
    status: "Open",
    statusType: "open",
  },
];

export default function MyPortfolio() {
  const [activeTab, setActiveTab] = useState("Overview");
  const location = useLocation();
  const navigate = useNavigate();
  const st = location.state?.student ?? null;

  const activeProfile = st
    ? {
        name: st.name,
        course: `B.Tech, ${st.dept}`,
        batch: st.year,
        track: st.skills.slice(0, 2).join(" & "),
        innovationScore: st.credits,
        cohortRank: st.rank,
      }
    : PROFILE_DATA;

  const activeSummary = st
    ? {
        innovationCredits: st.credits,
        creditsGain: `${st.wins} win${st.wins !== 1 ? "s" : ""}`,
        creditsSubtext: `Across ${st.participation} events`,
        skillsBenchmarked: st.skills.length,
        skillsBreakdown: st.skills.slice(0, 3).join(" \u2022 "),
        achievements: st.achievements.length,
        achievementsBreakdown: st.events
          .slice(0, 2)
          .map((e) => e.result)
          .join(" \u2022 "),
        leaderboardRank: st.rank,
        leaderboardSubtext: `GPA: ${st.gpa} | Streak: ${st.streak} days`,
      }
    : SUMMARY_STATS;

  const activeHighlights = st
    ? st.events.map((e, i) => ({
        id: i + 1,
        date: e.date,
        title: `${e.result} \u2014 ${e.name}`,
        subtitle: `${e.type} \u2022 ${e.pts} points earned`,
        badge: e.type,
        badgeType: e.result.includes("Winner")
          ? "gold"
          : e.result.includes("Runner")
            ? "purple"
            : "blue",
        dotColor: e.result.includes("Winner") ? "var(--primary)" : "#6d28d9",
      }))
    : HIGHLIGHTS_TIMELINE;

  const filteredHighlights = useMemo(() => {
    const tab = activeTab;
    if (tab === "Overview") return activeHighlights;
    if (tab === "Hackathons") {
      return activeHighlights.filter(
        (it) =>
          (it.title || "").toLowerCase().includes("hackathon") ||
          (it.badge || "").toLowerCase().includes("hackathon") ||
          (it.subtitle || "").toLowerCase().includes("hackathon"),
      );
    }
    if (tab === "Certifications") {
      return activeHighlights.filter(
        (it) =>
          (it.badge || "").toLowerCase().includes("cert") ||
          (it.title || "").toLowerCase().includes("cert") ||
          (it.subtitle || "").toLowerCase().includes("cert"),
      );
    }
    return activeHighlights;
  }, [activeTab, activeHighlights]);

  const activeProjects = st
    ? st.projects.map((p, i) => ({
        id: i + 1,
        title: p.name,
        description: p.desc,
        role: p.status,
        impact: `Score: ${p.score}`,
        credits: p.tech.slice(0, 2).join(", "),
        icon: "lucide:code-2",
        iconColor: "var(--primary)",
        iconBg: "var(--secondary)",
      }))
    : PROJECTS_DATA;

  const activeSkills = st
    ? st.skills.map((s, i) => ({
        label: s,
        score: parseFloat((8.5 - i * 0.3).toFixed(1)),
        level: i < 2 ? "Advanced" : i < 4 ? "Intermediate" : "Emerging",
        type: "tech",
      }))
    : SKILLS_DATA;

  const activeAvatar = st?.avatar || profilePhoto;

  return (
    <div style={styles.scrollContainer}>
      <div style={styles.container}>
        {st && (
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "13px",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            <iconify-icon
              icon="lucide:arrow-left"
              style={{ fontSize: "14px" }}
            />
            Back to My Students
          </button>
        )}
        {/* Header / Profile Section */}
        <section style={styles.header}>
          <div style={styles.profileMain}>
            <img
              src={activeAvatar}
              alt={activeProfile.name}
              style={styles.avatar}
            />
            <div style={styles.profileMeta}>
              <div style={styles.profileName}>{activeProfile.name}</div>
              <div style={styles.profileSubtitle}>
                {activeProfile.course} • {activeProfile.batch}
              </div>
              <div style={styles.profileSubtitle}>
                Innovation Track: {activeProfile.track}
              </div>
              <div style={styles.profileTags}>
                <span style={styles.profileTagPill}>
                  Innovation Score: {activeProfile.innovationScore} / 1000
                </span>
                <span style={styles.profileTagPill}>
                  {activeProfile.cohortRank} in Cohort
                </span>
                <span style={styles.profileTagPill}>Hackathon Champion</span>
              </div>
            </div>
          </div>
          <div style={styles.portfolioActions}>
            <button style={styles.btnSecondary}>
              <iconify-icon
                icon="lucide:external-link"
                style={{ fontSize: "14px" }}
              ></iconify-icon>
              Public Portfolio
            </button>
            <button style={styles.btnPrimary}>
              <iconify-icon
                icon="lucide:download"
                style={{ fontSize: "14px" }}
              ></iconify-icon>
              Export PDF
            </button>
          </div>
        </section>

        {/* Summary Strip */}
        <section style={styles.summaryStrip}>
          <SummaryCard
            label="Innovation Credits"
            value={activeSummary.innovationCredits}
            chip={activeSummary.creditsGain}
            subtext={activeSummary.creditsSubtext}
          />
          <SummaryCard
            label="Skills Benchmarked"
            value={activeSummary.skillsBenchmarked}
            subtext={activeSummary.skillsBreakdown}
          />
          <SummaryCard
            label="Achievements"
            value={activeSummary.achievements}
            subtext={activeSummary.achievementsBreakdown}
          />
          <SummaryCard
            label="Leaderboard Rank"
            value={activeSummary.leaderboardRank}
            subtext={activeSummary.leaderboardSubtext}
          />
        </section>

        {/* Main Grid */}
        <section style={styles.mainGrid}>
          {/* Left Column */}
          <div style={styles.leftColumn}>
            {/* Highlights & Achievements Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardTitle}>Highlights & Achievements</div>
                  <div style={styles.cardSubtitle}>
                    Key milestones impacting innovation score
                  </div>
                </div>
                <div style={styles.tabsRow}>
                  {["Overview", "Hackathons", "Certifications"].map((tab) => (
                    <div
                      key={tab}
                      style={{
                        ...styles.tabPill,
                        ...(activeTab === tab ? styles.tabPillActive : {}),
                      }}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.timeline}>
                {filteredHighlights.map((item, index) => (
                  <div key={item.id} style={styles.timelineItem}>
                    <div style={styles.timelineDate}>{item.date}</div>
                    <div style={styles.timelineBadgeCol}>
                      <div
                        style={{
                          ...styles.timelineDot,
                          background: item.dotColor,
                        }}
                      ></div>
                      {index < HIGHLIGHTS_TIMELINE.length - 1 && (
                        <div style={styles.timelineLine}></div>
                      )}
                      <div style={styles.timelineTitle}>{item.title}</div>
                      <div style={styles.timelineMeta}>{item.subtitle}</div>
                    </div>
                    <span
                      style={{
                        ...styles.badgePill,
                        ...getBadgeStyle(item.badgeType),
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects & Contributions Card */}
            <div style={{ ...styles.card, marginTop: "16px" }}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardTitle}>Projects & Contributions</div>
                  <div style={styles.cardSubtitle}>
                    Flagship work linked to innovation outcomes
                  </div>
                </div>
                <Link to="/projects" style={styles.cardLink}>
                  View all projects
                </Link>
              </div>
              <div style={styles.projectsList}>
                {activeProjects.map((project) => (
                  <div key={project.id} style={styles.projectRow}>
                    <div
                      style={{
                        ...styles.projectIcon,
                        color: project.iconColor,
                        background: project.iconBg,
                      }}
                    >
                      <iconify-icon
                        icon={project.icon}
                        style={{ fontSize: "16px" }}
                      ></iconify-icon>
                    </div>
                    <div style={styles.projectMain}>
                      <div style={styles.projectTitle}>{project.title}</div>
                      <div style={styles.projectMeta}>
                        {project.description}
                      </div>
                      <div style={styles.projectTagsRow}>
                        <span style={styles.chipNeutral}>
                          Role: {project.role}
                        </span>
                        {project.impact && (
                          <span style={styles.chipNeutral}>
                            Impact: {project.impact}
                          </span>
                        )}
                        {project.contributors && (
                          <span style={styles.chipNeutral}>
                            Contributors: {project.contributors}
                          </span>
                        )}
                        {project.credits && (
                          <span style={styles.chipNeutral}>
                            Credits: {project.credits}
                          </span>
                        )}
                        {project.extra && (
                          <span style={styles.chipNeutral}>
                            {project.extra}
                          </span>
                        )}
                      </div>
                    </div>
                    <iconify-icon
                      icon="lucide:chevron-right"
                      style={{
                        fontSize: "16px",
                        color: "var(--muted-foreground)",
                      }}
                    ></iconify-icon>
                  </div>
                ))}
              </div>

              {/* Spotlight Section */}
              <div style={styles.spotlightSection}>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      marginBottom: "2px",
                    }}
                  >
                    Portfolio Spotlight
                  </div>
                  <div style={styles.spotlightCopy}>
                    EcoTrack AI is currently featured on the Campus marketplace
                    and counts towards NAAC innovation metrics.
                  </div>
                </div>
                <button
                  style={{ ...styles.btnSecondary, whiteSpace: "nowrap" }}
                >
                  View marketplace listing
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={styles.rightColumn}>
            {/* Skill Profile Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardTitle}>Skill Profile</div>
                  <div style={styles.cardSubtitle}>
                    Benchmarked across technical, soft & domain skills
                  </div>
                </div>
              </div>
              <div style={styles.skillsMatrix}>
                {activeSkills.map((skill) => (
                  <div key={skill.label}>
                    <div style={styles.skillRowLabel}>{skill.label}</div>
                    <div style={styles.skillMeterTrack}>
                      <div
                        style={{
                          ...styles.skillMeterFill,
                          width: `${skill.score * 10}%`,
                          background:
                            skill.type === "soft"
                              ? "#10b981"
                              : skill.type === "domain"
                                ? "#f97316"
                                : "var(--primary)",
                        }}
                      ></div>
                    </div>
                    <div style={styles.metricRow}>
                      <span style={styles.metricLabel}>{skill.level}</span>
                      <span style={styles.metricValue}>
                        {skill.score.toFixed(1)} / 10
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Badge Grid */}
              <div style={styles.badgeGrid}>
                <div style={styles.badgeCard}>
                  <div style={styles.badgeIconCircle}>
                    <iconify-icon
                      icon="lucide:shield"
                      style={{ fontSize: "16px", color: "#1d4ed8" }}
                    ></iconify-icon>
                  </div>
                  <div>
                    <div style={styles.badgeTextMain}>NAAC-aligned profile</div>
                    <div style={styles.badgeTextSub}>
                      Contributes to innovation metrics
                    </div>
                  </div>
                </div>
                <div style={styles.badgeCard}>
                  <div style={styles.badgeIconCircle}>
                    <iconify-icon
                      icon="lucide:star"
                      style={{ fontSize: "16px", color: "#a855f7" }}
                    ></iconify-icon>
                  </div>
                  <div>
                    <div style={styles.badgeTextMain}>Innovation Fellow</div>
                    <div style={styles.badgeTextSub}>
                      Institutional distinction
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity & Devlog Card removed per request */}

            {/* Links & Availability Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardTitle}>Links & Availability</div>
                  <div style={styles.cardSubtitle}>
                    Public-facing profile endpoints
                  </div>
                </div>
              </div>
              <div style={styles.linksList}>
                {LINKS_DATA.map((link) => (
                  <div key={link.label} style={styles.linkRow}>
                    <div style={styles.linkMain}>
                      <iconify-icon
                        icon={link.icon}
                        style={{
                          fontSize: "16px",
                          color: "var(--muted-foreground)",
                        }}
                      ></iconify-icon>
                      <div>
                        <div style={styles.linkLabel}>{link.label}</div>
                        <div style={styles.linkUrl}>{link.url}</div>
                      </div>
                    </div>
                    <span
                      style={{
                        ...styles.tagStatus,
                        ...(link.statusType === "open"
                          ? styles.tagStatusOpen
                          : styles.tagStatusClosed),
                      }}
                    >
                      {link.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, chip, subtext }) {
  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryLabel}>{label}</div>
      <div style={styles.summaryValueRow}>
        <div style={styles.summaryValue}>{value}</div>
        {chip && <span style={styles.summaryChip}>{chip}</span>}
      </div>
      <div style={styles.summarySubtext}>{subtext}</div>
    </div>
  );
}

function getBadgeStyle(type) {
  switch (type) {
    case "gold":
      return { background: "#fef3c7", color: "#92400e" };
    case "purple":
      return { background: "#f3e8ff", color: "#6b21a8" };
    case "blue":
      return { background: "#dbeafe", color: "#1d4ed8" };
    default:
      return { background: "var(--secondary)", color: "var(--foreground)" };
  }
}

const styles = {
  scrollContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "32px",
    background: "var(--background)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
  },
  profileMain: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid var(--primary)",
  },
  profileMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  profileName: {
    fontSize: "20px",
    fontWeight: 600,
  },
  profileSubtitle: {
    fontSize: "13px",
    color: "var(--muted-foreground)",
  },
  profileTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "6px",
  },
  profileTagPill: {
    padding: "2px 8px",
    borderRadius: "999px",
    background: "var(--secondary)",
    border: "1px solid var(--border)",
    fontSize: "11px",
    fontWeight: 500,
    color: "var(--muted-foreground)",
    whiteSpace: "nowrap",
  },
  portfolioActions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  btnPrimary: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    background: "var(--primary)",
    color: "white",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  btnSecondary: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--foreground)",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  summaryStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "16px",
  },
  summaryCard: {
    background: "var(--card)",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  summaryLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "var(--muted-foreground)",
  },
  summaryValueRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "6px",
  },
  summaryValue: {
    fontSize: "18px",
    fontWeight: 600,
  },
  summaryChip: {
    fontSize: "11px",
    padding: "2px 6px",
    borderRadius: "999px",
    background: "#ecfdf5",
    color: "#166534",
    fontWeight: 500,
  },
  summarySubtext: {
    fontSize: "11px",
    color: "var(--muted-foreground)",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr",
    gap: "24px",
    alignItems: "flex-start",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    gap: "12px",
    flexWrap: "wrap",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: 600,
  },
  cardSubtitle: {
    fontSize: "12px",
    color: "var(--muted-foreground)",
  },
  cardLink: {
    fontSize: "12px",
    color: "var(--primary)",
    cursor: "pointer",
    fontWeight: 500,
    textDecoration: "none",
  },
  tabsRow: {
    display: "inline-flex",
    borderRadius: "999px",
    background: "var(--secondary)",
    padding: "3px",
    gap: "4px",
  },
  tabPill: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    cursor: "pointer",
    color: "var(--muted-foreground)",
    whiteSpace: "nowrap",
  },
  tabPillActive: {
    background: "var(--card)",
    color: "var(--foreground)",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "4px",
  },
  timelineItem: {
    display: "grid",
    gridTemplateColumns: "80px 1fr auto",
    gap: "12px",
    alignItems: "flex-start",
  },
  timelineDate: {
    fontSize: "11px",
    color: "var(--muted-foreground)",
  },
  timelineBadgeCol: {
    position: "relative",
    paddingLeft: "16px",
  },
  timelineDot: {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    background: "var(--primary)",
    position: "absolute",
    left: 0,
    top: "4px",
  },
  timelineLine: {
    position: "absolute",
    left: "4px",
    top: "16px",
    bottom: "-16px",
    width: "2px",
    background: "var(--secondary)",
  },
  timelineTitle: {
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "2px",
  },
  timelineMeta: {
    fontSize: "12px",
    color: "var(--muted-foreground)",
  },
  badgePill: {
    padding: "3px 8px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  projectsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "4px",
  },
  projectRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  projectIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  projectMain: {
    flex: 1,
  },
  projectTitle: {
    fontSize: "13px",
    fontWeight: 500,
  },
  projectMeta: {
    fontSize: "11px",
    color: "var(--muted-foreground)",
  },
  projectTagsRow: {
    display: "flex",
    gap: "6px",
    marginTop: "4px",
    flexWrap: "wrap",
  },
  chipNeutral: {
    padding: "2px 6px",
    borderRadius: "999px",
    background: "var(--card)",
    border: "1px solid var(--border)",
    fontSize: "11px",
    color: "var(--muted-foreground)",
  },
  spotlightSection: {
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px dashed var(--border)",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  spotlightCopy: {
    fontSize: "12px",
    color: "var(--muted-foreground)",
  },
  skillsMatrix: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "8px",
  },
  skillRowLabel: {
    fontSize: "12px",
    fontWeight: 500,
  },
  skillMeterTrack: {
    marginTop: "6px",
    height: "6px",
    borderRadius: "999px",
    background: "var(--secondary)",
    overflow: "hidden",
  },
  skillMeterFill: {
    height: "100%",
    borderRadius: "999px",
  },
  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    fontSize: "11px",
    marginTop: "4px",
  },
  metricLabel: {
    color: "var(--muted-foreground)",
  },
  metricValue: {
    fontWeight: 600,
  },
  badgeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    marginTop: "14px",
  },
  badgeCard: {
    padding: "10px 12px",
    borderRadius: "6px",
    background: "var(--secondary)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  badgeIconCircle: {
    width: "28px",
    height: "28px",
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--card)",
    border: "1px solid var(--border)",
  },
  badgeTextMain: {
    fontSize: "12px",
    fontWeight: 500,
  },
  badgeTextSub: {
    fontSize: "11px",
    color: "var(--muted-foreground)",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "6px",
  },
  activityRow: {
    display: "grid",
    gridTemplateColumns: "60px 1fr auto",
    gap: "10px",
    alignItems: "center",
    fontSize: "12px",
  },
  activityTime: {
    color: "var(--muted-foreground)",
  },
  activityKind: {
    fontWeight: 500,
  },
  activityDetail: {
    color: "var(--muted-foreground)",
    fontSize: "11px",
  },
  activityScoreChip: {
    fontSize: "11px",
    padding: "3px 6px",
    borderRadius: "999px",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  linksList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "6px",
  },
  linkRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  linkMain: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  linkLabel: {
    fontSize: "12px",
    fontWeight: 500,
  },
  linkUrl: {
    fontSize: "11px",
    color: "var(--muted-foreground)",
  },
  tagStatus: {
    padding: "2px 7px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 500,
  },
  tagStatusOpen: {
    background: "#ecfdf5",
    color: "#166534",
  },
  tagStatusClosed: {
    background: "#f3f4f6",
    color: "#4b5563",
  },
};
