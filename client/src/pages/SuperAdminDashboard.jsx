import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventsContext";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { events } = useEvents();

  // Platform-wide metrics
  const metrics = useMemo(() => {
    const totalColleges = 128;
    const totalStudents = 104820;
    const totalFaculty = 8420;
    const totalEvents = events.length + 300; // Including all platform events
    const activeEvents =
      events.filter((e) => e.status !== "closed").length + 45;
    const completedEvents =
      events.filter((e) => e.status === "closed").length + 180;
    const crossCollegeEvents = Math.round(totalEvents * 0.62);
    const certificatesIssued = 45230;
    const totalRevenue = 12450000;
    const subscriptionRevenue = 8900000;

    return {
      totalColleges,
      totalStudents,
      totalFaculty,
      totalEvents,
      activeEvents,
      completedEvents,
      crossCollegeEvents,
      certificatesIssued,
      totalRevenue,
      subscriptionRevenue,
      crossParticipationRate: "62.4%",
      activePlans: 98,
      pendingApprovals: 12,
    };
  }, [events]);

  // Top performing colleges
  const topColleges = useMemo(
    () => [
      {
        name: "IIT Delhi",
        score: 9820,
        students: 8500,
        events: 45,
        trend: "+12%",
      },
      {
        name: "BITS Pilani",
        score: 9042,
        students: 7200,
        events: 38,
        trend: "+8%",
      },
      {
        name: "Anna University",
        score: 8560,
        students: 12000,
        events: 52,
        trend: "+15%",
      },
      {
        name: "VIT Vellore",
        score: 8180,
        students: 9800,
        events: 41,
        trend: "+6%",
      },
      {
        name: "NIT Trichy",
        score: 7920,
        students: 6500,
        events: 35,
        trend: "+10%",
      },
    ],
    [],
  );

  // Platform alerts
  const alerts = useMemo(
    () => [
      {
        id: 1,
        level: "critical",
        title: "Payment Gateway Issue",
        text: "Razorpay webhook failing for 3 colleges",
        time: "2 hours ago",
      },
      {
        id: 2,
        level: "warning",
        title: "Policy Pending",
        text: "42 colleges haven't accepted new privacy policy",
        time: "1 day ago",
      },
      {
        id: 3,
        level: "info",
        title: "New College Request",
        text: "5 new college registration requests pending",
        time: "3 hours ago",
      },
    ],
    [],
  );

  // Recent activities
  const recentActivities = useMemo(
    () => [
      {
        id: 1,
        type: "college",
        text: "New Tech Institute registered",
        time: "2 hours ago",
      },
      {
        id: 2,
        type: "event",
        text: "National AI Hackathon created by IIT Delhi",
        time: "4 hours ago",
      },
      {
        id: 3,
        type: "certificate",
        text: "1,250 certificates issued for Tech Summit",
        time: "6 hours ago",
      },
      {
        id: 4,
        type: "subscription",
        text: "BITS Pilani upgraded to Premium plan",
        time: "1 day ago",
      },
      {
        id: 5,
        type: "alert",
        text: "Flagged event: Unauthorized Workshop at College X",
        time: "1 day ago",
      },
    ],
    [],
  );

  // Quick actions for super admin
  const quickActions = [
    {
      icon: "lucide:building-2",
      label: "Manage Colleges",
      description: "View and manage all registered colleges",
      path: "/colleges",
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      icon: "lucide:users",
      label: "Global Students",
      description: "Platform-wide student directory",
      path: "/global-students",
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      icon: "lucide:calendar",
      label: "Events Monitor",
      description: "Track all cross-college events",
      path: "/events-monitor",
      color: "#b45309",
      bg: "#fef3c7",
    },
    {
      icon: "lucide:credit-card",
      label: "Subscriptions",
      description: "Manage college subscription plans",
      path: "/subscriptions",
      color: "#dc2626",
      bg: "#fef2f2",
    },
    {
      icon: "lucide:settings",
      label: "Platform Settings",
      description: "Global settings & configurations",
      path: "/platform-settings",
      color: "#64748b",
      bg: "#f8fafc",
    },
  ];

  // Stats cards
  const statsCards = [
    {
      icon: "lucide:building-2",
      label: "Total Colleges",
      value: metrics.totalColleges,
      subtitle: `${metrics.activePlans} active subscriptions`,
      color: "#1e3a8a",
      bg: "#eff6ff",
    },
    {
      icon: "lucide:users",
      label: "Total Students",
      value: metrics.totalStudents.toLocaleString(),
      subtitle: `${metrics.totalFaculty.toLocaleString()} faculty`,
      color: "#059669",
      bg: "#ecfdf5",
      trend: "+8.2%",
    },
    {
      icon: "lucide:calendar",
      label: "Total Events",
      value: metrics.totalEvents,
      subtitle: `${metrics.activeEvents} active`,
      color: "#b45309",
      bg: "#fef3c7",
    },
    {
      icon: "lucide:award",
      label: "Certificates Issued",
      value: metrics.certificatesIssued.toLocaleString(),
      subtitle: "Across all colleges",
      color: "#7c3aed",
      bg: "#f3e8ff",
      trend: "+15%",
    },
    {
      icon: "lucide:indian-rupee",
      label: "Total Revenue",
      value: `₹${(metrics.totalRevenue / 100000).toFixed(1)}L`,
      subtitle: "This financial year",
      color: "#16a34a",
      bg: "#dcfce7",
      trend: "+22%",
    },
    {
      icon: "lucide:share-2",
      label: "Cross-College Rate",
      value: metrics.crossParticipationRate,
      subtitle: `${metrics.crossCollegeEvents} inter-college events`,
      color: "#0891b2",
      bg: "#ecfeff",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "college":
        return "lucide:building-2";
      case "event":
        return "lucide:calendar";
      case "certificate":
        return "lucide:award";
      case "subscription":
        return "lucide:credit-card";
      case "alert":
        return "lucide:alert-triangle";
      default:
        return "lucide:activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "college":
        return "#1e3a8a";
      case "event":
        return "#b45309";
      case "certificate":
        return "#7c3aed";
      case "subscription":
        return "#16a34a";
      case "alert":
        return "#dc2626";
      default:
        return "#64748b";
    }
  };

  return (
    <div
      style={{
        padding: "24px 32px",
        maxWidth: "1500px",
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
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <iconify-icon
              icon="lucide:shield-check"
              style={{ fontSize: "28px", color: "#7c3aed" }}
            ></iconify-icon>
            Super Admin Control Center
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Platform-wide overview, analytics, and management
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/reports-exports")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              background: "white",
              color: "#1e293b",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <iconify-icon
              icon="lucide:download"
              style={{ fontSize: "16px" }}
            ></iconify-icon>
            Export Reports
          </button>
          <button
            onClick={() => navigate("/platform-settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <iconify-icon
              icon="lucide:settings"
              style={{ fontSize: "16px" }}
            ></iconify-icon>
            Settings
          </button>
        </div>
      </div>

      {/* Alerts Banner */}
      {/* {alerts.filter((a) => a.level === "critical").length > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            border: "1px solid #fecaca",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <iconify-icon
              icon="lucide:alert-circle"
              style={{ fontSize: "24px", color: "#dc2626" }}
            ></iconify-icon>
            <div>
              <div
                style={{ fontSize: "14px", fontWeight: 600, color: "#991b1b" }}
              >
                {alerts.filter((a) => a.level === "critical").length} Critical
                Alert(s)
              </div>
              <div style={{ fontSize: "13px", color: "#b91c1c" }}>
                {alerts.find((a) => a.level === "critical")?.text}
              </div>
            </div>
          </div>
          <button
            style={{
              padding: "8px 14px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            View All Alerts
          </button>
        </div>
      )} */}

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        {statsCards.map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "18px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <iconify-icon
                  icon={stat.icon}
                  style={{ fontSize: "20px", color: stat.color }}
                ></iconify-icon>
              </div>
              {stat.trend && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#16a34a",
                    background: "#dcfce7",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  <iconify-icon
                    icon="lucide:trending-up"
                    style={{ fontSize: "10px" }}
                  ></iconify-icon>
                  {stat.trend}
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#64748b",
                marginBottom: "4px",
              }}
            >
              {stat.label}
            </div>
            <div
              style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b" }}
            >
              {stat.value}
            </div>
            <div
              style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}
            >
              {stat.subtitle}
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
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
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
                padding: "16px 18px",
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
                  width: "42px",
                  height: "42px",
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
                  style={{ fontSize: "20px", color: action.color }}
                ></iconify-icon>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "2px",
                  }}
                >
                  {action.label}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>
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
          {/* Top Colleges */}
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
                  icon="lucide:trophy"
                  style={{ fontSize: "16px", color: "#f59e0b" }}
                ></iconify-icon>
                Top Performing Colleges
              </h3>
              <Link
                to="/colleges"
                style={{
                  fontSize: "12px",
                  color: "#7c3aed",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                View All →
              </Link>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                      }}
                    >
                      Rank
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                      }}
                    >
                      College
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "10px 12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                      }}
                    >
                      Students
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "10px 12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                      }}
                    >
                      Events
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "10px 12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                      }}
                    >
                      Score
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "10px 12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                      }}
                    >
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topColleges.map((college, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid #f8fafc",
                        cursor: "pointer",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#fafafa")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      <td style={{ padding: "12px" }}>
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background:
                              idx === 0
                                ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                                : idx === 1
                                  ? "linear-gradient(135deg, #e5e7eb, #9ca3af)"
                                  : idx === 2
                                    ? "linear-gradient(135deg, #fdba74, #ea580c)"
                                    : "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: idx < 3 ? "white" : "#64748b",
                            fontWeight: 700,
                            fontSize: "12px",
                          }}
                        >
                          {idx + 1}
                        </div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#1e293b",
                          }}
                        >
                          {college.name}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          fontSize: "13px",
                          color: "#1e293b",
                        }}
                      >
                        {college.students.toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          fontSize: "13px",
                          color: "#1e293b",
                        }}
                      >
                        {college.events}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#7c3aed",
                          }}
                        >
                          {college.score.toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#16a34a",
                            background: "#dcfce7",
                            padding: "3px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {college.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
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
                style={{ fontSize: "16px", color: "#0891b2" }}
              ></iconify-icon>
              Recent Platform Activity
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    background: "#fafafa",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: `${getActivityColor(activity.type)}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <iconify-icon
                      icon={getActivityIcon(activity.type)}
                      style={{
                        fontSize: "16px",
                        color: getActivityColor(activity.type),
                      }}
                    ></iconify-icon>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", color: "#1e293b" }}>
                      {activity.text}
                    </div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Platform Alerts */}
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
                icon="lucide:bell"
                style={{ fontSize: "16px", color: "#dc2626" }}
              ></iconify-icon>
              Platform Alerts
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "8px",
                    background:
                      alert.level === "critical"
                        ? "#fef2f2"
                        : alert.level === "warning"
                          ? "#fefce8"
                          : "#f0f9ff",
                    borderLeft: `3px solid ${
                      alert.level === "critical"
                        ? "#dc2626"
                        : alert.level === "warning"
                          ? "#f59e0b"
                          : "#0ea5e9"
                    }`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1e293b",
                      marginBottom: "2px",
                    }}
                  >
                    {alert.title}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    {alert.text}
                  </div>
                  <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                    {alert.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
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
                justifyContent: "space-between",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <iconify-icon
                  icon="lucide:clock"
                  style={{ fontSize: "16px", color: "#f59e0b" }}
                ></iconify-icon>
                Pending Approvals
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  background: "#fef3c7",
                  color: "#b45309",
                  padding: "3px 8px",
                  borderRadius: "10px",
                }}
              >
                {metrics.pendingApprovals}
              </span>
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {[
                {
                  type: "College Registration",
                  count: 5,
                  icon: "lucide:building-2",
                },
                { type: "Event Approvals", count: 4, icon: "lucide:calendar" },
                {
                  type: "Certificate Requests",
                  count: 3,
                  icon: "lucide:award",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "#fafafa",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <iconify-icon
                      icon={item.icon}
                      style={{ fontSize: "16px", color: "#64748b" }}
                    ></iconify-icon>
                    <span style={{ fontSize: "13px", color: "#1e293b" }}>
                      {item.type}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#b45309",
                    }}
                  >
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Health */}
          <div
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
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
                icon="lucide:heart-pulse"
                style={{ fontSize: "16px" }}
              ></iconify-icon>
              Platform Health
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {[
                { label: "API Uptime", value: "99.9%", status: "healthy" },
                { label: "Database", value: "Optimal", status: "healthy" },
                { label: "Payment Gateway", value: "Issue", status: "warning" },
                { label: "Email Service", value: "Active", status: "healthy" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "13px", opacity: 0.9 }}>
                    {item.label}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>
                      {item.value}
                    </span>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background:
                          item.status === "healthy" ? "#4ade80" : "#fbbf24",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
