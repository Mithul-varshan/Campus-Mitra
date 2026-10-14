import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===== SAMPLE DATA ===== */
const SAMPLE_EVENTS = [
  {
    id: "evt-001",
    title: "Hackathon 2026",
    type: "Hackathon",
    domain: "AI/ML",
    image:
      "https://images.unsplash.com/photo-1504384308090-c54be3855463?auto=format&fit=crop&w=800&q=80",
    startDate: "2026-03-15",
    endDate: "2026-03-17",
    registrationDeadline: "2026-03-10",
    venue: "Main Auditorium, Block A",
    mode: "offline",
    maxTeamSize: 4,
    minTeamSize: 2,
    status: "ongoing",
    prizes: [
      { position: "1st", amount: "25000" },
      { position: "2nd", amount: "15000" },
      { position: "3rd", amount: "10000" },
    ],
  },
  {
    id: "evt-002",
    title: "AI Workshop Series",
    type: "Workshop",
    domain: "AI/ML",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    startDate: "2026-03-20",
    endDate: "2026-03-22",
    registrationDeadline: "2026-03-18",
    venue: "Seminar Hall B, Research Block",
    mode: "hybrid",
    maxTeamSize: 1,
    minTeamSize: 1,
    status: "upcoming",
    prizes: [],
  },
  {
    id: "evt-003",
    title: "Web Dev Championship",
    type: "Competition",
    domain: "Web Development",
    image:
      "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80",
    startDate: "2026-02-28",
    endDate: "2026-03-01",
    registrationDeadline: "2026-02-25",
    venue: "Computer Lab 1 & 2",
    mode: "offline",
    maxTeamSize: 2,
    minTeamSize: 1,
    status: "completed",
    prizes: [
      { position: "1st", amount: "15000" },
      { position: "2nd", amount: "10000" },
      { position: "3rd", amount: "5000" },
    ],
  },
];

const SAMPLE_TEAMS = {
  "evt-001": [
    {
      id: "t-001",
      teamName: "Code Warriors",
      members: [
        {
          name: "Arun Kumar",
          department: "CSE",
          year: 3,
          role: "Leader",
          email: "arun@college.edu",
          phone: "9876543001",
        },
        {
          name: "Priya Sharma",
          department: "CSE",
          year: 3,
          role: "Member",
          email: "priya@college.edu",
          phone: "9876543002",
        },
        {
          name: "Vikash J",
          department: "IT",
          year: 3,
          role: "Member",
          email: "vikash@college.edu",
          phone: "9876543003",
        },
      ],
      status: "pending",
      projectTitle: "AI Campus Assistant",
      projectDescription:
        "An AI-powered chatbot to help students navigate campus resources",
      registeredAt: "2026-02-20",
    },
    {
      id: "t-002",
      teamName: "Tech Titans",
      members: [
        {
          name: "Vikram J",
          department: "ECE",
          year: 4,
          role: "Leader",
          email: "vikram@college.edu",
          phone: "9876543004",
        },
        {
          name: "Ananya R",
          department: "IT",
          year: 3,
          role: "Member",
          email: "ananya@college.edu",
          phone: "9876543005",
        },
        {
          name: "Karthik S",
          department: "CSE",
          year: 4,
          role: "Member",
          email: "karthik@college.edu",
          phone: "9876543006",
        },
        {
          name: "Deepa M",
          department: "AIDS",
          year: 3,
          role: "Member",
          email: "deepa@college.edu",
          phone: "9876543007",
        },
      ],
      status: "pending",
      projectTitle: "Smart IoT Dashboard",
      projectDescription:
        "Real-time monitoring dashboard for campus IoT devices",
      registeredAt: "2026-02-22",
    },
    {
      id: "t-003",
      teamName: "Neural Nexus",
      members: [
        {
          name: "Rohit Kumar",
          department: "AIML",
          year: 3,
          role: "Leader",
          email: "rohit@college.edu",
          phone: "9876543008",
        },
        {
          name: "Sneha P",
          department: "CSE",
          year: 3,
          role: "Member",
          email: "sneha@college.edu",
          phone: "9876543009",
        },
      ],
      status: "pending",
      projectTitle: "Sentiment Analysis Tool",
      projectDescription: "Analyze social media sentiment for trending topics",
      registeredAt: "2026-02-18",
    },
    {
      id: "t-004",
      teamName: "Byte Builders",
      members: [
        {
          name: "Ajay M",
          department: "IT",
          year: 4,
          role: "Leader",
          email: "ajay@college.edu",
          phone: "9876543010",
        },
        {
          name: "Kavitha R",
          department: "CSE",
          year: 4,
          role: "Member",
          email: "kavitha@college.edu",
          phone: "9876543011",
        },
        {
          name: "Suresh K",
          department: "ECE",
          year: 3,
          role: "Member",
          email: "suresh@college.edu",
          phone: "9876543012",
        },
      ],
      status: "pending",
      projectTitle: "Blockchain Voting",
      projectDescription: "Secure voting system using blockchain",
      registeredAt: "2026-02-19",
    },
  ],
  "evt-002": [
    {
      id: "t-005",
      teamName: "Solo Participant",
      members: [
        {
          name: "Meera K",
          department: "CSE",
          year: 2,
          role: "Individual",
          email: "meera@college.edu",
          phone: "9876543013",
        },
      ],
      status: "pending",
      projectTitle: null,
      projectDescription: null,
      registeredAt: "2026-02-25",
    },
  ],
  "evt-003": [
    {
      id: "t-006",
      teamName: "Code Crusaders",
      members: [
        {
          name: "Rahul S",
          department: "CSE",
          year: 3,
          role: "Leader",
          email: "rahul@college.edu",
          phone: "9876543014",
        },
        {
          name: "Anika M",
          department: "IT",
          year: 3,
          role: "Member",
          email: "anika@college.edu",
          phone: "9876543015",
        },
      ],
      status: "winner",
      position: "1st",
      projectTitle: "EcoTrack",
      projectDescription: "Sustainability Dashboard for Campus",
      registeredAt: "2026-02-10",
    },
  ],
};

/* ===== STYLES ===== */
const pageContainer = {
  padding: "24px",
  maxWidth: "1400px",
  margin: "0 auto",
};

const kpiCard = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: "20px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
};

const kpiLabel = {
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--muted-foreground)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const kpiValue = {
  fontSize: "28px",
  fontWeight: 600,
  color: "var(--foreground)",
  letterSpacing: "-0.5px",
};

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
};

export default function RegisteredTeamsPage() {
  const navigate = useNavigate();
  const [events] = useState(SAMPLE_EVENTS);
  const [teams, setTeams] = useState(SAMPLE_TEAMS);
  const [selectedEventForTeams, setSelectedEventForTeams] = useState(
    SAMPLE_EVENTS[0]?.id || null,
  );
  const [expandedTeam, setExpandedTeam] = useState(null);

  const getStatusStyle = (status) => {
    const styles = {
      ongoing: { bg: "rgba(34, 197, 94, 0.1)", color: "#16a34a" },
      upcoming: { bg: "rgba(59, 130, 246, 0.1)", color: "#2563eb" },
      completed: { bg: "rgba(107, 114, 128, 0.1)", color: "#6b7280" },
      pending: { bg: "rgba(245, 158, 11, 0.1)", color: "#d97706" },
      winner: { bg: "rgba(234, 179, 8, 0.1)", color: "#ca8a04" },
    };
    return styles[status] || styles.pending;
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => navigate("/admin/my-events")}
          style={{
            padding: "10px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--foreground)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <iconify-icon
            icon="lucide:arrow-left"
            style={{ fontSize: "18px" }}
          ></iconify-icon>
        </button>
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              margin: 0,
              color: "var(--foreground)",
            }}
          >
            Registered Teams
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--muted-foreground)",
              margin: "4px 0 0 0",
            }}
          >
            View and manage teams registered for your events
          </p>
        </div>
      </div>

      {/* Event Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--foreground)",
            marginBottom: "8px",
          }}
        >
          Select Event
        </label>
        <select
          value={selectedEventForTeams || ""}
          onChange={(e) => setSelectedEventForTeams(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--foreground)",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <option value="">Choose an event to view teams</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title} ({e.status})
            </option>
          ))}
        </select>
      </div>

      {selectedEventForTeams &&
        (() => {
          const eventTeams = teams[selectedEventForTeams] || [];
          const event = events.find((e) => e.id === selectedEventForTeams);
          return (
            <>
              {/* Team Statistics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                {[
                  {
                    label: "Total Teams",
                    value: eventTeams.length,
                    icon: "lucide:users-2",
                    color: "#6366f1",
                  },
                  {
                    label: "Total Members",
                    value: eventTeams.reduce(
                      (sum, t) => sum + t.members.length,
                      0,
                    ),
                    icon: "lucide:users",
                    color: "#22c55e",
                  },
                  {
                    label: "Winners",
                    value: eventTeams.filter((t) => t.status === "winner")
                      .length,
                    icon: "lucide:trophy",
                    color: "#f59e0b",
                  },
                  {
                    label: "Avg Team Size",
                    value:
                      eventTeams.length > 0
                        ? (
                            eventTeams.reduce(
                              (sum, t) => sum + t.members.length,
                              0,
                            ) / eventTeams.length
                          ).toFixed(1)
                        : 0,
                    icon: "lucide:bar-chart-2",
                    color: "#8b5cf6",
                  },
                ].map((stat, i) => (
                  <div key={i} style={kpiCard}>
                    <div style={kpiLabel}>
                      {stat.label}
                      <iconify-icon
                        icon={stat.icon}
                        style={{ fontSize: "16px", color: stat.color }}
                      ></iconify-icon>
                    </div>
                    <div style={kpiValue}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Event Details Card */}
              <div style={{ ...card, marginBottom: "20px" }}>
                <div style={cardHeaderRow}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <img
                      src={
                        event?.image ||
                        "https://images.unsplash.com/photo-1504384308090-c54be3855463?auto=format&fit=crop&w=100&q=80"
                      }
                      alt={event?.title}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "var(--radius-md)",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h3 style={{ ...cardTitle, marginBottom: "4px" }}>
                        {event?.title}
                      </h3>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {event?.type} • {event?.domain} • {event?.mode}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: getStatusStyle(event?.status).bg,
                      color: getStatusStyle(event?.status).color,
                      textTransform: "capitalize",
                    }}
                  >
                    {event?.status}
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "16px",
                    marginTop: "16px",
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      background: "var(--muted)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                        marginBottom: "4px",
                      }}
                    >
                      Event Date
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--foreground)",
                      }}
                    >
                      {new Date(event?.startDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      -{" "}
                      {new Date(event?.endDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "12px",
                      background: "var(--muted)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                        marginBottom: "4px",
                      }}
                    >
                      Registration Deadline
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--foreground)",
                      }}
                    >
                      {new Date(event?.registrationDeadline).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "12px",
                      background: "var(--muted)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                        marginBottom: "4px",
                      }}
                    >
                      Venue
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--foreground)",
                      }}
                    >
                      {event?.venue}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "12px",
                      background: "var(--muted)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                        marginBottom: "4px",
                      }}
                    >
                      Team Size
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--foreground)",
                      }}
                    >
                      {event?.minTeamSize} - {event?.maxTeamSize} members
                    </div>
                  </div>
                </div>
                {event?.prizes?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        fontWeight: 500,
                      }}
                    >
                      Prizes:
                    </div>
                    {event.prizes
                      .filter((p) => p.amount)
                      .map((prize, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            background:
                              idx === 0
                                ? "rgba(234, 179, 8, 0.1)"
                                : idx === 1
                                  ? "rgba(148, 163, 184, 0.1)"
                                  : "rgba(205, 127, 50, 0.1)",
                            color:
                              idx === 0
                                ? "#ca8a04"
                                : idx === 1
                                  ? "#64748b"
                                  : "#b45309",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"} ₹
                          {Number(prize.amount).toLocaleString()}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Teams List */}
              {eventTeams.length === 0 ? (
                <div
                  style={{
                    ...card,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "60px",
                    gap: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:users-x"
                    style={{ fontSize: "56px" }}
                  ></iconify-icon>
                  <p style={{ margin: 0, fontSize: "16px" }}>
                    No teams registered for this event
                  </p>
                </div>
              ) : (
                <div style={card}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>Teams for {event?.title}</h3>
                    <button
                      style={{
                        padding: "8px 14px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        color: "var(--foreground)",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <iconify-icon icon="lucide:download"></iconify-icon>{" "}
                      Export
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {eventTeams.map((team) => {
                      const teamStatus = getStatusStyle(team.status);
                      return (
                        <div
                          key={team.id}
                          style={{
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            onClick={() =>
                              setExpandedTeam(
                                expandedTeam === team.id ? null : team.id,
                              )
                            }
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "16px",
                              cursor: "pointer",
                              background: "var(--muted)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                              }}
                            >
                              <div
                                style={{
                                  width: "44px",
                                  height: "44px",
                                  borderRadius: "var(--radius-md)",
                                  background: "var(--primary)",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                  fontSize: "16px",
                                }}
                              >
                                {team.teamName.charAt(0)}
                              </div>
                              <div>
                                <div
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    color: "var(--foreground)",
                                  }}
                                >
                                  {team.teamName}
                                </div>
                                {team.projectTitle && (
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: "var(--primary)",
                                    }}
                                  >
                                    {team.projectTitle}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "13px",
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                {team.members.length} members
                              </span>
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "20px",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  background: teamStatus.bg,
                                  color: teamStatus.color,
                                  textTransform: "capitalize",
                                }}
                              >
                                {team.status}
                              </span>
                              <iconify-icon
                                icon={
                                  expandedTeam === team.id
                                    ? "lucide:chevron-up"
                                    : "lucide:chevron-down"
                                }
                                style={{
                                  color: "var(--muted-foreground)",
                                  fontSize: "18px",
                                }}
                              ></iconify-icon>
                            </div>
                          </div>
                          {expandedTeam === team.id && (
                            <div
                              style={{
                                padding: "16px",
                                borderTop: "1px solid var(--border)",
                              }}
                            >
                              {team.projectDescription && (
                                <div
                                  style={{
                                    marginBottom: "16px",
                                    padding: "12px",
                                    background: "var(--muted)",
                                    borderRadius: "var(--radius-md)",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "var(--muted-foreground)",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    Project Description
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: "var(--foreground)",
                                    }}
                                  >
                                    {team.projectDescription}
                                  </div>
                                </div>
                              )}
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "repeat(auto-fill, minmax(280px, 1fr))",
                                  gap: "12px",
                                  marginBottom: "16px",
                                }}
                              >
                                {team.members.map((member, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      padding: "14px",
                                      background: "var(--background)",
                                      borderRadius: "var(--radius-md)",
                                      border: "1px solid var(--border)",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "10px",
                                        background:
                                          member.role === "Leader"
                                            ? "#f59e0b"
                                            : "var(--primary)",
                                        color: "white",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 600,
                                        fontSize: "14px",
                                      }}
                                    >
                                      {member.name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div
                                        style={{
                                          fontSize: "14px",
                                          fontWeight: 500,
                                          color: "var(--foreground)",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "6px",
                                        }}
                                      >
                                        {member.name}
                                        {member.role === "Leader" && (
                                          <span
                                            style={{
                                              padding: "2px 6px",
                                              background:
                                                "rgba(245, 158, 11, 0.1)",
                                              color: "#d97706",
                                              borderRadius: "4px",
                                              fontSize: "10px",
                                              fontWeight: 600,
                                            }}
                                          >
                                            Leader
                                          </span>
                                        )}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          color: "var(--muted-foreground)",
                                        }}
                                      >
                                        {member.department} • Year {member.year}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "11px",
                                          color: "var(--muted-foreground)",
                                          marginTop: "2px",
                                        }}
                                      >
                                        {member.email}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          );
        })()}

      {!selectedEventForTeams && (
        <div
          style={{
            ...card,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px",
            gap: "12px",
            color: "var(--muted-foreground)",
          }}
        >
          <iconify-icon
            icon="lucide:hand-pointing"
            style={{ fontSize: "56px" }}
          ></iconify-icon>
          <p style={{ margin: 0, fontSize: "16px" }}>
            Select an event to view registered teams
          </p>
        </div>
      )}
    </div>
  );
}
