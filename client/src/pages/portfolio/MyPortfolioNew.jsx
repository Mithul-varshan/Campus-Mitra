import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import profilePhoto from "../../assets/profile.jpg";
import {
  exportPortfolioPDF,
  generatePortfolioQR,
} from "../../utils/portfolioPdfExporter";

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

export default function MyPortfolio({ isPublic = false }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const portfolioRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const isPublicMode = isPublic || queryParams.get("public") === "true";
  const st = location.state?.student ?? null;

  const candidateName = st?.name || queryParams.get("student") || user?.name || "Riya Patel";

  const activeProfile = st
    ? {
        name: st.name,
        course: `B.Tech, ${st.dept}`,
        batch: st.year,
        track: st.skills.slice(0, 2).join(" & "),
        innovationScore: st.credits,
        cohortRank: st.rank,
      }
    : {
        ...PROFILE_DATA,
        name: candidateName,
      };

  const publicPortfolioUrl = typeof window !== "undefined"
    ? `${window.location.origin}/portfolio/public?student=${encodeURIComponent(activeProfile.name)}&public=true`
    : "";

  useEffect(() => {
    if (showShareModal && publicPortfolioUrl) {
      generatePortfolioQR(publicPortfolioUrl).then((url) => {
        if (url) setQrCodeDataUrl(url);
      });
    }
  }, [showShareModal, publicPortfolioUrl]);

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(publicPortfolioUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleExportPDF = async () => {
    if (!portfolioRef.current) return;
    try {
      setIsExportingPDF(true);
      await exportPortfolioPDF(portfolioRef.current, activeProfile);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExportingPDF(false);
    }
  };

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
      <div ref={portfolioRef} style={styles.container}>
        {/* Recruiter / Public Verification Header Banner */}
        {isPublicMode && (
          <div
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)",
              color: "#ffffff",
              padding: "16px 22px",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "14px",
              boxShadow: "0 10px 25px -5px rgba(30, 58, 138, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <iconify-icon
                  icon="lucide:shield-check"
                  style={{ fontSize: "24px", color: "#60a5fa" }}
                ></iconify-icon>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "0.2px" }}>
                  Dhanalakshmi Srinivasan University • Verified Portfolio
                </div>
                <div style={{ fontSize: "12px", opacity: 0.85, marginTop: "2px" }}>
                  NAAC Grade 'A' Accredited • Cryptographically Authenticated Student Record
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                style={{
                  background: "#ffffff",
                  color: "#1e3a8a",
                  border: "none",
                  borderRadius: "7px",
                  padding: "8px 14px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: isExportingPDF ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <iconify-icon
                  icon={isExportingPDF ? "lucide:loader-2" : "lucide:download"}
                  style={{
                    fontSize: "14px",
                    animation: isExportingPDF ? "spin 1s linear infinite" : "none",
                  }}
                ></iconify-icon>
                {isExportingPDF ? "Exporting..." : "Download PDF Resume"}
              </button>
              <a
                href={`mailto:contact@dsuniversity.ac.in?subject=Recruitment%20Inquiry%20for%20${encodeURIComponent(activeProfile.name)}`}
                style={{
                  background: "rgba(255, 255, 255, 0.18)",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "7px",
                  padding: "8px 14px",
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <iconify-icon icon="lucide:mail" style={{ fontSize: "14px" }}></iconify-icon>
                Contact Candidate
              </a>
            </div>
          </div>
        )}

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
            <button
              style={styles.btnSecondary}
              onClick={() => setShowShareModal(true)}
              title="Share verified public portfolio link"
            >
              <iconify-icon
                icon="lucide:external-link"
                style={{ fontSize: "14px" }}
              ></iconify-icon>
              Public Portfolio
            </button>
            <button
              style={{
                ...styles.btnPrimary,
                opacity: isExportingPDF ? 0.75 : 1,
                cursor: isExportingPDF ? "wait" : "pointer",
              }}
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              title="Export ATS & Recruiter-ready Portfolio PDF"
            >
              <iconify-icon
                icon={isExportingPDF ? "lucide:loader-2" : "lucide:download"}
                style={{
                  fontSize: "14px",
                  animation: isExportingPDF ? "spin 1s linear infinite" : "none",
                }}
              ></iconify-icon>
              {isExportingPDF ? "Exporting PDF..." : "Export PDF"}
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

        {/* Public Portfolio Share Modal */}
        {showShareModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
            onClick={() => setShowShareModal(false)}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "26px",
                width: "460px",
                maxWidth: "100%",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid #e2e8f0",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 4px",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    Public Portfolio Link
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12.5px",
                      color: "#64748b",
                    }}
                  >
                    Shareable verified link for recruiters, judges & companies
                  </p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    padding: "4px",
                  }}
                >
                  <iconify-icon
                    icon="lucide:x"
                    style={{ fontSize: "20px" }}
                  ></iconify-icon>
                </button>
              </div>

              {/* QR Code Container */}
              <div
                style={{
                  textAlign: "center",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #e2e8f0",
                  marginBottom: "18px",
                }}
              >
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Portfolio QR Code"
                    style={{
                      width: "160px",
                      height: "160px",
                      margin: "0 auto 8px",
                      display: "block",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "160px",
                      height: "160px",
                      margin: "0 auto 8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#e2e8f0",
                      borderRadius: "8px",
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    Generating QR...
                  </div>
                )}
                <div
                  style={{
                    fontSize: "11.5px",
                    color: "#475569",
                    fontWeight: 500,
                  }}
                >
                  Scan with smartphone camera to inspect live candidate portfolio
                </div>
              </div>

              {/* Public URL Box */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Direct Public URL
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    background: "#f1f5f9",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  <input
                    type="text"
                    readOnly
                    value={publicPortfolioUrl}
                    style={{
                      flex: 1,
                      border: "none",
                      background: "transparent",
                      fontSize: "12px",
                      color: "#1e293b",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleCopyLink}
                    style={{
                      background: copiedLink ? "#16a34a" : "var(--primary)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "background 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <iconify-icon
                      icon={copiedLink ? "lucide:check" : "lucide:copy"}
                      style={{ fontSize: "13px" }}
                    ></iconify-icon>
                    {copiedLink ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => {
                    window.open(publicPortfolioUrl, "_blank");
                  }}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    background: "#ffffff",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <iconify-icon
                    icon="lucide:external-link"
                    style={{ fontSize: "14px" }}
                  ></iconify-icon>
                  Open Public View
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    background: "var(--primary)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: isExportingPDF ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <iconify-icon
                    icon={isExportingPDF ? "lucide:loader-2" : "lucide:download"}
                    style={{
                      fontSize: "14px",
                      animation: isExportingPDF ? "spin 1s linear infinite" : "none",
                    }}
                  ></iconify-icon>
                  {isExportingPDF ? "Exporting..." : "Download PDF"}
                </button>
              </div>
            </div>
          </div>
        )}
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
