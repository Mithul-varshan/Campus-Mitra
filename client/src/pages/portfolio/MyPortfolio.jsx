export default function MyPortfolio() {
  const card = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  };

  const cardHeaderRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  };

  const cardTitle = {
    fontSize: "15px",
    fontWeight: 600,
    margin: 0,
    display: "flex",
    alignItems: "center",
  };

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 600,
              margin: "0 0 4px 0",
              color: "var(--foreground)",
            }}
          >
            My Portfolio
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Showcase your achievements, projects, and contributions
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              background: "white",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            <iconify-icon
              icon="lucide:download"
              style={{ fontSize: "16px" }}
            ></iconify-icon>
            Export PDF
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              background: "var(--primary)",
              border: "none",
              color: "white",
            }}
          >
            <iconify-icon
              icon="lucide:share-2"
              style={{ fontSize: "16px" }}
            ></iconify-icon>
            Share Portfolio
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div
        style={{
          ...card,
          marginBottom: "24px",
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          color: "white",
          flexDirection: "row",
          alignItems: "center",
          gap: "24px",
          padding: "24px",
        }}
      >
        <img
          src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FSouth%20Asian%2F2"
          alt="Profile"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: "4px solid rgba(255,255,255,0.3)",
          }}
        />
        <div style={{ flex: 1 }}>
          <h2
            style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px 0" }}
          >
            Priya Sharma
          </h2>
          <p style={{ fontSize: "14px", opacity: 0.9, margin: "0 0 12px 0" }}>
            Computer Science • Batch 2025 • CGPA: 9.2
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <iconify-icon
                icon="lucide:map-pin"
                style={{ fontSize: "14px" }}
              ></iconify-icon>
              <span style={{ fontSize: "13px" }}>Chennai, India</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <iconify-icon
                icon="lucide:mail"
                style={{ fontSize: "14px" }}
              ></iconify-icon>
              <span style={{ fontSize: "13px" }}>priya.sharma@campus.edu</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <iconify-icon
                icon="mdi:github"
                style={{ fontSize: "14px" }}
              ></iconify-icon>
              <span style={{ fontSize: "13px" }}>github.com/priya-dev</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          {[
            { value: "1,240", label: "Innovation Credits", icon: "lucide:zap" },
            { value: "#14", label: "Global Rank", icon: "lucide:trophy" },
            { value: "12", label: "Projects", icon: "lucide:folder-git-2" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                padding: "12px 20px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "12px",
              }}
            >
              <iconify-icon
                icon={stat.icon}
                style={{
                  fontSize: "20px",
                  marginBottom: "4px",
                  display: "block",
                }}
              ></iconify-icon>
              <div style={{ fontSize: "20px", fontWeight: 700 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "11px", opacity: 0.8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Tags */}
      <div style={{ ...card, marginBottom: "24px", padding: "16px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            Skills:
          </span>
          {[
            "React",
            "Node.js",
            "Python",
            "TensorFlow",
            "AWS",
            "Figma",
            "MongoDB",
            "TypeScript",
            "Docker",
          ].map((skill) => (
            <span
              key={skill}
              style={{
                fontSize: "12px",
                padding: "4px 12px",
                borderRadius: "16px",
                background: "#eff6ff",
                color: "#1e40af",
                fontWeight: 500,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Projects Kanban Board */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 600,
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <iconify-icon
              icon="lucide:folder-git-2"
              style={{ color: "var(--primary)" }}
            ></iconify-icon>
            Projects
          </h2>
          <button
            style={{
              fontSize: "13px",
              padding: "6px 12px",
              background: "var(--secondary)",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <iconify-icon
              icon="lucide:plus"
              style={{ fontSize: "14px" }}
            ></iconify-icon>
            Add Project
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          {/* Live Projects Column */}
          <div
            style={{
              minWidth: "320px",
              flex: 1,
              background: "#f0fdf4",
              borderRadius: "12px",
              padding: "16px",
              borderTop: "3px solid #22c55e",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#22c55e",
                    borderRadius: "50%",
                    boxShadow: "0 0 0 3px #bbf7d0",
                  }}
                ></div>
                Live
              </div>
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                2
              </span>
            </div>
            {[
              {
                title: "EcoTrack - Carbon Footprint App",
                tech: ["React", "Node.js"],
                stars: 45,
                url: "ecotrack.app",
              },
              {
                title: "StudyBuddy AI",
                tech: ["Python", "TensorFlow"],
                stars: 32,
                url: "studybuddy.ai",
              },
            ].map((proj) => (
              <div
                key={proj.title}
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "14px",
                  marginBottom: "12px",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  {proj.title}
                </div>
                <div
                  style={{ display: "flex", gap: "6px", marginBottom: "10px" }}
                >
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <iconify-icon
                      icon="lucide:star"
                      style={{ fontSize: "12px", color: "#f59e0b" }}
                    ></iconify-icon>
                    {proj.stars}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <iconify-icon
                      icon="lucide:external-link"
                      style={{ fontSize: "12px" }}
                    ></iconify-icon>
                    {proj.url}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* In Development Column */}
          <div
            style={{
              minWidth: "320px",
              flex: 1,
              background: "#fef3c7",
              borderRadius: "12px",
              padding: "16px",
              borderTop: "3px solid #f59e0b",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#f59e0b",
                    borderRadius: "50%",
                  }}
                ></div>
                In Development
              </div>
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                2
              </span>
            </div>
            {[
              {
                title: "Campus Event Manager",
                tech: ["Vue.js", "Firebase"],
                progress: 75,
              },
              {
                title: "AI Resume Builder",
                tech: ["Next.js", "OpenAI"],
                progress: 40,
              },
            ].map((proj) => (
              <div
                key={proj.title}
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "14px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  {proj.title}
                </div>
                <div
                  style={{ display: "flex", gap: "6px", marginBottom: "10px" }}
                >
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    marginBottom: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  <span>Progress</span>
                  <span>{proj.progress}%</span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "#e2e8f0",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${proj.progress}%`,
                      background: "#f59e0b",
                      borderRadius: "3px",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Completed Column */}
          <div
            style={{
              minWidth: "320px",
              flex: 1,
              background: "#f1f5f9",
              borderRadius: "12px",
              padding: "16px",
              borderTop: "3px solid #64748b",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#64748b",
                    borderRadius: "50%",
                  }}
                ></div>
                Completed
              </div>
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                3
              </span>
            </div>
            {[
              { title: "Weather Dashboard", tech: ["React"], date: "Aug 2024" },
              {
                title: "E-commerce API",
                tech: ["Express", "MongoDB"],
                date: "Jul 2024",
              },
              { title: "Todo App", tech: ["Vue.js"], date: "Jun 2024" },
            ].map((proj) => (
              <div
                key={proj.title}
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "14px",
                  marginBottom: "12px",
                  opacity: 0.85,
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  {proj.title}
                </div>
                <div
                  style={{ display: "flex", gap: "6px", marginBottom: "8px" }}
                >
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <iconify-icon
                    icon="lucide:check-circle"
                    style={{ fontSize: "12px", color: "#22c55e" }}
                  ></iconify-icon>
                  Completed {proj.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements & Contributions Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        {/* Achievements */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>
              <iconify-icon
                icon="lucide:trophy"
                style={{ color: "#f59e0b", marginRight: "8px" }}
              ></iconify-icon>
              Achievements
            </h3>
            <span
              style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
            >
              8 Total
            </span>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              {
                title: "Smart City Hackathon 2024",
                badge: "🥇 1st Place",
                date: "Oct 2024",
                color: "#fef3c7",
                icon: "lucide:trophy",
              },
              {
                title: "AI Innovation Challenge",
                badge: "🥈 2nd Place",
                date: "Sep 2024",
                color: "#e0e7ff",
                icon: "lucide:award",
              },
              {
                title: "Best UI/UX Design Award",
                badge: "🏆 Winner",
                date: "Aug 2024",
                color: "#dcfce7",
                icon: "lucide:star",
              },
              {
                title: "Code Sprint 2024",
                badge: "🎖️ Top 10",
                date: "Jul 2024",
                color: "#fce7f3",
                icon: "lucide:medal",
              },
            ].map((ach) => (
              <div
                key={ach.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  background: ach.color,
                  borderRadius: "8px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "2px",
                    }}
                  >
                    {ach.title}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {ach.date}
                  </div>
                </div>
                <span style={{ fontSize: "12px", fontWeight: 600 }}>
                  {ach.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contributions */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>
              <iconify-icon
                icon="lucide:git-pull-request"
                style={{ color: "#22c55e", marginRight: "8px" }}
              ></iconify-icon>
              GitHub Contributions
            </h3>
            <span
              style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
            >
              2024
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                padding: "12px",
                background: "#f0fdf4",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{ fontSize: "20px", fontWeight: 700, color: "#16a34a" }}
              >
                892
              </div>
              <div style={{ fontSize: "10px", color: "#166534" }}>Commits</div>
            </div>
            <div
              style={{
                padding: "12px",
                background: "#eff6ff",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{ fontSize: "20px", fontWeight: 700, color: "#2563eb" }}
              >
                67
              </div>
              <div style={{ fontSize: "10px", color: "#1e40af" }}>
                PRs Merged
              </div>
            </div>
            <div
              style={{
                padding: "12px",
                background: "#fef3c7",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{ fontSize: "20px", fontWeight: 700, color: "#d97706" }}
              >
                34
              </div>
              <div style={{ fontSize: "10px", color: "#92400e" }}>Issues</div>
            </div>
            <div
              style={{
                padding: "12px",
                background: "#f3e8ff",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{ fontSize: "20px", fontWeight: 700, color: "#7c3aed" }}
              >
                156
              </div>
              <div style={{ fontSize: "10px", color: "#6b21a8" }}>Stars</div>
            </div>
          </div>
          <div
            style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}
          >
            Recent Activity
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              {
                repo: "react-native-starter",
                type: "PR Merged",
                time: "2h ago",
                icon: "lucide:git-merge",
                color: "#8b5cf6",
              },
              {
                repo: "campus-api",
                type: "Commit pushed",
                time: "5h ago",
                icon: "lucide:git-commit",
                color: "#22c55e",
              },
              {
                repo: "design-system",
                type: "Issue closed",
                time: "1d ago",
                icon: "lucide:circle-check",
                color: "#3b82f6",
              },
            ].map((cont) => (
              <div
                key={cont.repo + cont.time}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px",
                  background: "var(--secondary)",
                  borderRadius: "6px",
                }}
              >
                <iconify-icon
                  icon={cont.icon}
                  style={{ fontSize: "16px", color: cont.color }}
                ></iconify-icon>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: 500 }}>
                    {cont.repo}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {cont.type}
                  </div>
                </div>
                <span
                  style={{ fontSize: "10px", color: "var(--muted-foreground)" }}
                >
                  {cont.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificates */}
      <div style={{ ...card, marginBottom: "24px" }}>
        <div style={cardHeaderRow}>
          <h3 style={cardTitle}>
            <iconify-icon
              icon="lucide:award"
              style={{ color: "#0ea5e9", marginRight: "8px" }}
            ></iconify-icon>
            Certificates
          </h3>
          <button
            style={{
              fontSize: "12px",
              padding: "4px 12px",
              background: "var(--secondary)",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            View All
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          {[
            {
              title: "AWS Cloud Practitioner",
              issuer: "Amazon Web Services",
              date: "Oct 2024",
              img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=120&fit=crop",
              color: "#ff9900",
            },
            {
              title: "Meta React Developer",
              issuer: "Meta",
              date: "Sep 2024",
              img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=120&fit=crop",
              color: "#0866ff",
            },
            {
              title: "Python for Machine Learning",
              issuer: "Google",
              date: "Aug 2024",
              img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=120&fit=crop",
              color: "#4285f4",
            },
            {
              title: "UI/UX Design Specialization",
              issuer: "Coursera",
              date: "Jul 2024",
              img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=120&fit=crop",
              color: "#0056d2",
            },
            {
              title: "Data Structures & Algorithms",
              issuer: "LeetCode",
              date: "Jun 2024",
              img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200&h=120&fit=crop",
              color: "#ffa116",
            },
          ].map((cert) => (
            <div
              key={cert.title}
              style={{
                minWidth: "200px",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                overflow: "hidden",
                background: "white",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            >
              <div style={{ height: "80px", position: "relative" }}>
                <img
                  src={cert.img}
                  alt={cert.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "8px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: cert.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <iconify-icon
                    icon="lucide:check"
                    style={{ fontSize: "12px", color: "white" }}
                  ></iconify-icon>
                </div>
              </div>
              <div style={{ padding: "12px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "4px",
                    lineHeight: 1.3,
                  }}
                >
                  {cert.title}
                </div>
                <div
                  style={{ fontSize: "10px", color: "var(--muted-foreground)" }}
                >
                  {cert.issuer} • {cert.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div style={card}>
        <div style={cardHeaderRow}>
          <h3 style={cardTitle}>
            <iconify-icon
              icon="lucide:badge-check"
              style={{ color: "#ec4899", marginRight: "8px" }}
            ></iconify-icon>
            Badges Earned
          </h3>
          <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
            15 Total
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {[
            {
              icon: "lucide:flame",
              label: "30 Day Streak",
              color: "#f97316",
              desc: "Consistent activity",
            },
            {
              icon: "lucide:code-2",
              label: "Code Master",
              color: "#8b5cf6",
              desc: "500+ commits",
            },
            {
              icon: "lucide:users",
              label: "Team Player",
              color: "#3b82f6",
              desc: "10+ collaborations",
            },
            {
              icon: "lucide:rocket",
              label: "Fast Learner",
              color: "#22c55e",
              desc: "5 courses completed",
            },
            {
              icon: "lucide:lightbulb",
              label: "Innovator",
              color: "#eab308",
              desc: "Patent filed",
            },
            {
              icon: "lucide:heart",
              label: "Mentor",
              color: "#ec4899",
              desc: "Helped 20+ students",
            },
            {
              icon: "lucide:star",
              label: "Rising Star",
              color: "#f59e0b",
              desc: "Top 10% rank",
            },
            {
              icon: "lucide:zap",
              label: "Power User",
              color: "#6366f1",
              desc: "1000+ credits",
            },
          ].map((badge) => (
            <div
              key={badge.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background: `${badge.color}10`,
                borderRadius: "10px",
                border: `1px solid ${badge.color}30`,
                minWidth: "180px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: `${badge.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <iconify-icon
                  icon={badge.icon}
                  style={{ fontSize: "20px", color: badge.color }}
                ></iconify-icon>
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600 }}>
                  {badge.label}
                </div>
                <div
                  style={{ fontSize: "10px", color: "var(--muted-foreground)" }}
                >
                  {badge.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
