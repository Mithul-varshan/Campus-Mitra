import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEvents } from "../../context/EventsContext";

// College info (would come from auth context in production)
const COLLEGE_INFO = {
  name: "DHANALAKSHMI SRINIVASAN UNIVERSITY",
  code: "SSEC-2024",
  naacGrade: "A++",
  departments: ["CSE", "ECE", "IT", "MECH", "CIVIL", "EEE", "AIDS", "AIML"],
  totalStudents: 4500,
  totalFaculty: 250,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { events } = useEvents();
  const [timeRange, setTimeRange] = useState("this_month");

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Filter events by time range
    const activeEvents = events.filter((e) => e.status !== "closed");
    const completedEvents = events.filter((e) => e.status === "closed");
    const upcomingEvents = events.filter((e) => e.status === "upcoming");
    const ongoingEvents = events.filter((e) => e.status === "ongoing");

    // Calculate total participants
    const totalParticipants = events.reduce(
      (sum, e) => sum + (e.totalParticipants || 0),
      0,
    );

    // Calculate total revenue
    const totalRevenue = events.reduce((sum, e) => {
      const fee = e.registrationFee || 0;
      const participants = e.totalParticipants || 0;
      return sum + fee * participants;
    }, 0);

    // Count teams registered
    const totalTeams = events.reduce(
      (sum, e) => sum + (e.registeredTeamsFromCollege?.length || 0),
      0,
    );

    // Count winners
    const totalWinners = events.reduce(
      (sum, e) => sum + (e.winnersFromCollege?.length || 0),
      0,
    );

    // Get recent registrations (last 7 days simulation)
    const recentRegistrations = 24;
    const registrationGrowth = 15;

    return {
      totalEvents: events.length,
      activeEvents: activeEvents.length,
      completedEvents: completedEvents.length,
      upcomingEvents: upcomingEvents.length,
      ongoingEvents: ongoingEvents.length,
      totalParticipants,
      totalRevenue,
      totalTeams,
      totalWinners,
      recentRegistrations,
      registrationGrowth,
    };
  }, [events, timeRange]);

  // Recent events for quick view
  const recentEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [events]);

  // Upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => new Date(e.registrationDeadline) > now)
      .sort(
        (a, b) =>
          new Date(a.registrationDeadline) - new Date(b.registrationDeadline),
      )
      .slice(0, 4)
      .map((e) => ({
        id: e.id,
        title: e.title,
        deadline: e.registrationDeadline,
        daysLeft: Math.ceil(
          (new Date(e.registrationDeadline) - now) / (1000 * 60 * 60 * 24),
        ),
        type: e.eventType,
      }));
  }, [events]);

  // Quick actions for admin
  const quickActions = [
    {
      icon: "lucide:plus-circle",
      label: "Create Event",
      description: "Host a new hackathon, workshop, or seminar",
      path: "/admin/create-event",
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      icon: "lucide:calendar-check",
      label: "My Events",
      description: "Manage your hosted events",
      path: "/admin/my-events",
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      icon: "lucide:trophy",
      label: "Declare Winners",
      description: "Announce winners for completed events",
      path: "/admin/declare-winners",
      color: "#b45309",
      bg: "#fef3c7",
    },
    {
      icon: "lucide:users",
      label: "Registered Teams",
      description: "View and manage team registrations",
      path: "/admin/registered-teams",
      color: "#7c3aed",
      bg: "#f3e8ff",
    },
    {
      icon: "lucide:bar-chart-3",
      label: "Event Analytics",
      description: "Insights and performance metrics",
      path: "/admin/event-analytics",
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      icon: "lucide:bell",
      label: "Incoming Events",
      description: "External events from partner colleges",
      path: "/admin/incoming-events",
      color: "#dc2626",
      bg: "#fef2f2",
    },
  ];

  // Stats cards data
  const statsCards = [
    {
      icon: "lucide:calendar",
      label: "Total Events",
      value: metrics.totalEvents,
      subtitle: `${metrics.activeEvents} active`,
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      icon: "lucide:users",
      label: "Participants",
      value: metrics.totalParticipants.toLocaleString(),
      subtitle: `+${metrics.recentRegistrations} this week`,
      color: "#059669",
      bg: "#ecfdf5",
      trend: `+${metrics.registrationGrowth}%`,
    },
    {
      icon: "lucide:trophy",
      label: "Winners",
      value: metrics.totalWinners,
      subtitle: "From completed events",
      color: "#b45309",
      bg: "#fef3c7",
    },
    {
      icon: "lucide:indian-rupee",
      label: "Revenue Generated",
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      subtitle: "From registration fees",
      color: "#7c3aed",
      bg: "#f3e8ff",
    },
  ];

  // Event type distribution
  const eventTypeDistribution = useMemo(() => {
    const distribution = {};
    events.forEach((e) => {
      const type = e.eventType || "Other";
      distribution[type] = (distribution[type] || 0) + 1;
    });
    return Object.entries(distribution)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [events]);

  return (
    <div
      style={{
        padding: "24px 32px",
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              margin: "0 0 8px 0",
              color: "#1e293b",
            }}
          >
            Admin Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Welcome back! Here's an overview of {COLLEGE_INFO.name}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 14px",
              background: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <iconify-icon
              icon="lucide:building-2"
              style={{ fontSize: "16px", color: "#64748b" }}
            ></iconify-icon>
            <span
              style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}
            >
              {COLLEGE_INFO.name}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                background: "#dcfce7",
                color: "#15803d",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              {COLLEGE_INFO.naacGrade}
            </span>
          </div>
          <button
            onClick={() => navigate("/admin/create-event")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              background: "#1e3a8a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <iconify-icon
              icon="lucide:plus"
              style={{ fontSize: "16px" }}
            ></iconify-icon>
            Create Event
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {statsCards.map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <iconify-icon
                icon={stat.icon}
                style={{ fontSize: "22px", color: stat.color }}
              ></iconify-icon>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: 500,
                  marginBottom: "4px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: "2px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {stat.trend && (
                  <span
                    style={{
                      color: "#16a34a",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    <iconify-icon
                      icon="lucide:trending-up"
                      style={{ fontSize: "12px" }}
                    ></iconify-icon>
                    {stat.trend}
                  </span>
                )}
                {stat.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#1e293b",
            margin: "0 0 16px 0",
          }}
        >
          Quick Actions
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px",
          }}
        >
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.path}
              style={{
                textDecoration: "none",
                background: "white",
                borderRadius: "12px",
                padding: "18px 20px",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = action.color;
                e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}15`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: action.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <iconify-icon
                  icon={action.icon}
                  style={{ fontSize: "22px", color: action.color }}
                ></iconify-icon>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "2px",
                  }}
                >
                  {action.label}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  {action.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Recent Events */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "20px",
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
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#1e293b",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <iconify-icon
                  icon="lucide:calendar"
                  style={{ fontSize: "16px", color: "#1e3a8a" }}
                ></iconify-icon>
                Recent Events
              </h3>
              <Link
                to="/admin/my-events"
                style={{
                  fontSize: "12px",
                  color: "#1e3a8a",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                View All →
              </Link>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 14px",
                    background: "#f8fafc",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/admin/my-events`)}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1e293b",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {event.title}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{event.eventType}</span>
                      <span>•</span>
                      <span>
                        {new Date(event.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background:
                        event.status === "closed"
                          ? "#f1f5f9"
                          : event.status === "ongoing"
                            ? "#dcfce7"
                            : "#fef3c7",
                      color:
                        event.status === "closed"
                          ? "#64748b"
                          : event.status === "ongoing"
                            ? "#15803d"
                            : "#b45309",
                      textTransform: "capitalize",
                    }}
                  >
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Type Distribution */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#1e293b",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <iconify-icon
                icon="lucide:pie-chart"
                style={{ fontSize: "16px", color: "#7c3aed" }}
              ></iconify-icon>
              Events by Type
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {eventTypeDistribution.map((item, idx) => {
                const percentage = Math.round(
                  (item.count / events.length) * 100,
                );
                const colors = [
                  "#1e3a8a",
                  "#059669",
                  "#b45309",
                  "#7c3aed",
                  "#0891b2",
                ];
                return (
                  <div key={idx}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#1e293b" }}>
                        {item.type}
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${percentage}%`,
                          background: colors[idx % colors.length],
                          borderRadius: "4px",
                          transition: "width 0.3s ease",
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Event Status Overview */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#1e293b",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <iconify-icon
                icon="lucide:activity"
                style={{ fontSize: "16px", color: "#059669" }}
              ></iconify-icon>
              Event Status
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  background: "#ecfdf5",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#16a34a",
                    }}
                  ></div>
                  <span style={{ fontSize: "13px", color: "#1e293b" }}>
                    Ongoing
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#16a34a",
                  }}
                >
                  {metrics.ongoingEvents}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  background: "#fef3c7",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#f59e0b",
                    }}
                  ></div>
                  <span style={{ fontSize: "13px", color: "#1e293b" }}>
                    Upcoming
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#b45309",
                  }}
                >
                  {metrics.upcomingEvents}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#64748b",
                    }}
                  ></div>
                  <span style={{ fontSize: "13px", color: "#1e293b" }}>
                    Completed
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#64748b",
                  }}
                >
                  {metrics.completedEvents}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#1e293b",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <iconify-icon
                icon="lucide:clock"
                style={{ fontSize: "16px", color: "#dc2626" }}
              ></iconify-icon>
              Upcoming Deadlines
            </h3>
            {upcomingDeadlines.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                No upcoming deadlines
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    style={{
                      padding: "12px 14px",
                      background: "#fafafa",
                      borderRadius: "8px",
                      borderLeft: `3px solid ${
                        deadline.daysLeft <= 3 ? "#ef4444" : "#f59e0b"
                      }`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1e293b",
                        marginBottom: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {deadline.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        {deadline.type}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: deadline.daysLeft <= 3 ? "#ef4444" : "#b45309",
                        }}
                      >
                        {deadline.daysLeft === 0
                          ? "Today"
                          : deadline.daysLeft === 1
                            ? "1 day left"
                            : `${deadline.daysLeft} days left`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* College Stats */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
              borderRadius: "12px",
              padding: "20px",
              color: "white",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <iconify-icon
                icon="lucide:school"
                style={{ fontSize: "16px" }}
              ></iconify-icon>
              College Overview
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: 700 }}>
                  {COLLEGE_INFO.totalStudents.toLocaleString()}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.8 }}>Students</div>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: 700 }}>
                  {COLLEGE_INFO.totalFaculty}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.8 }}>Faculty</div>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: 700 }}>
                  {COLLEGE_INFO.departments.length}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.8 }}>
                  Departments
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: 700 }}>
                  {metrics.totalTeams}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.8 }}>Teams</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
