import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
        name: "NIT Trichy",
        score: 8210,
        students: 6500,
        events: 31,
        trend: "+5%",
      },
      {
        name: "PSG Tech",
        score: 7890,
        students: 5800,
        events: 28,
        trend: "+3%",
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
        title: "Database Load High",
        text: "Main replica at 88% CPU utilization",
        time: "10 mins ago",
      },
      {
        id: 2,
        level: "warning",
        title: "Certificate Queue",
        text: "1,240 certificates pending batch generation",
        time: "45 mins ago",
      },
      {
        id: 3,
        level: "info",
        title: "New College Signup",
        text: "Sathyabama Institute requested trial onboarding",
        time: "2 hours ago",
      },
    ],
    [],
  );

  // Recent platform activities
  const recentActivities = useMemo(
    () => [
      {
        id: 1,
        type: "college",
        text: "SRM University upgraded to Enterprise Plan",
        time: "15 mins ago",
      },
      {
        id: 2,
        type: "event",
        text: "Inter-College AI Hackathon 2025 published (2,400 expected)",
        time: "1 hour ago",
      },
      {
        id: 3,
        type: "certificate",
        text: "Batch of 450 certificates issued for Web3 Sprint",
        time: "3 hours ago",
      },
      {
        id: 4,
        type: "subscription",
        text: "PSG Tech subscription renewed for 1 year",
        time: "5 hours ago",
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
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 dark:bg-blue-950/50",
      borderHover: "hover:border-blue-500 dark:hover:border-blue-400",
    },
    {
      icon: "lucide:users",
      label: "Global Students",
      description: "Platform-wide student directory",
      path: "/students",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/50",
      borderHover: "hover:border-emerald-500 dark:hover:border-emerald-400",
    },
    {
      icon: "lucide:calendar",
      label: "Events Monitor",
      description: "Track all cross-college events",
      path: "/events-monitor",
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-50 dark:bg-amber-950/50",
      borderHover: "hover:border-amber-500 dark:hover:border-amber-400",
    },
    {
      icon: "lucide:credit-card",
      label: "Subscriptions",
      description: "Manage college subscription plans",
      path: "/subscriptions",
      colorClass: "text-rose-600 dark:text-rose-400",
      bgClass: "bg-rose-50 dark:bg-rose-950/50",
      borderHover: "hover:border-rose-500 dark:hover:border-rose-400",
    },
    {
      icon: "lucide:settings",
      label: "Platform Settings",
      description: "Global settings & configurations",
      path: "/platform-settings",
      colorClass: "text-violet-600 dark:text-violet-400",
      bgClass: "bg-violet-50 dark:bg-violet-950/50",
      borderHover: "hover:border-violet-500 dark:hover:border-violet-400",
    },
  ];

  // Stats cards
  const statsCards = [
    {
      icon: "lucide:building-2",
      label: "Total Colleges",
      value: metrics.totalColleges,
      subtitle: `${metrics.activePlans} active subscriptions`,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      icon: "lucide:users",
      label: "Total Students",
      value: metrics.totalStudents.toLocaleString(),
      subtitle: `${metrics.totalFaculty.toLocaleString()} faculty`,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/50",
      trend: "+8.2%",
    },
    {
      icon: "lucide:calendar",
      label: "Total Events",
      value: metrics.totalEvents,
      subtitle: `${metrics.activeEvents} active`,
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      icon: "lucide:award",
      label: "Certificates Issued",
      value: metrics.certificatesIssued.toLocaleString(),
      subtitle: "Across all colleges",
      colorClass: "text-violet-600 dark:text-violet-400",
      bgClass: "bg-violet-50 dark:bg-violet-950/50",
      trend: "+15%",
    },
    {
      icon: "lucide:indian-rupee",
      label: "Total Revenue",
      value: `₹${(metrics.totalRevenue / 100000).toFixed(1)}L`,
      subtitle: "This financial year",
      colorClass: "text-green-600 dark:text-green-400",
      bgClass: "bg-green-50 dark:bg-green-950/50",
      trend: "+22%",
    },
    {
      icon: "lucide:share-2",
      label: "Cross-College Rate",
      value: metrics.crossParticipationRate,
      subtitle: `${metrics.crossCollegeEvents} inter-college events`,
      colorClass: "text-cyan-600 dark:text-cyan-400",
      bgClass: "bg-cyan-50 dark:bg-cyan-950/50",
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
        return "#059669";
      case "certificate":
        return "#7c3aed";
      case "subscription":
        return "#0891b2";
      case "alert":
        return "#dc2626";
      default:
        return "#64748b";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-7">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-1.5">
              <iconify-icon
                icon="lucide:shield-check"
                style={{ fontSize: "28px" }}
                className="text-violet-600 dark:text-violet-400"
              ></iconify-icon>
              Super Admin Control Center
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Platform-wide overview, analytics, and management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/reports-exports")}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs md:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              <iconify-icon
                icon="lucide:download"
                style={{ fontSize: "16px" }}
              ></iconify-icon>
              Export Reports
            </button>
            <button
              onClick={() => navigate("/platform-settings")}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs md:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <iconify-icon
                icon="lucide:settings"
                style={{ fontSize: "16px" }}
              ></iconify-icon>
              Settings
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {statsCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bgClass} flex items-center justify-center shrink-0`}
                >
                  <iconify-icon
                    icon={stat.icon}
                    style={{ fontSize: "20px" }}
                    className={stat.colorClass}
                  ></iconify-icon>
                </div>
                {stat.trend && (
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mb-0.5 truncate">
                {stat.value}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate mb-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {stat.subtitle}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3.5">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className={`bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 ${action.borderHover} flex items-center gap-3.5 transition-all shadow-sm group text-left cursor-pointer`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${action.bgClass} flex items-center justify-center shrink-0`}
                >
                  <iconify-icon
                    icon={action.icon}
                    style={{ fontSize: "20px" }}
                    className={action.colorClass}
                  ></iconify-icon>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                    {action.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left Column (2 cols wide) */}
          <div className="lg:col-span-2 space-y-5">

            {/* Top Performing Colleges */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                <iconify-icon
                  icon="lucide:award"
                  style={{ fontSize: "16px" }}
                  className="text-amber-600 dark:text-amber-400"
                ></iconify-icon>
                Top Performing Colleges
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
                      <th className="pb-3 w-10">#</th>
                      <th className="pb-3">College</th>
                      <th className="pb-3 text-center">Students</th>
                      <th className="pb-3 text-center">Events</th>
                      <th className="pb-3 text-center">Score</th>
                      <th className="pb-3 text-center">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {topColleges.map((college, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              idx < 3
                                ? "bg-amber-500 text-white"
                                : "text-slate-400 dark:text-slate-500"
                            }`}
                          >
                            {idx + 1}
                          </div>
                        </td>
                        <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                          {college.name}
                        </td>
                        <td className="py-3 text-center text-slate-600 dark:text-slate-300">
                          {college.students.toLocaleString()}
                        </td>
                        <td className="py-3 text-center text-slate-600 dark:text-slate-300">
                          {college.events}
                        </td>
                        <td className="py-3 text-center font-bold text-violet-600 dark:text-violet-400">
                          {college.score.toLocaleString()}
                        </td>
                        <td className="py-3 text-center">
                          <span className="font-semibold text-[11px] text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/60 px-2 py-0.5 rounded">
                            {college.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Platform Activity */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                <iconify-icon
                  icon="lucide:activity"
                  style={{ fontSize: "16px" }}
                  className="text-cyan-600 dark:text-cyan-400"
                ></iconify-icon>
                Recent Platform Activity
              </h3>
              <div className="space-y-2.5">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: `${getActivityColor(activity.type)}15`,
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
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {activity.text}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">

            {/* Platform Alerts */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                <iconify-icon
                  icon="lucide:bell"
                  style={{ fontSize: "16px" }}
                  className="text-rose-600 dark:text-rose-400"
                ></iconify-icon>
                Platform Alerts
              </h3>
              <div className="space-y-2.5">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.level === "critical"
                        ? "bg-rose-50 dark:bg-rose-950/30 border-l-rose-600"
                        : alert.level === "warning"
                          ? "bg-amber-50 dark:bg-amber-950/30 border-l-amber-500"
                          : "bg-blue-50 dark:bg-blue-950/30 border-l-blue-500"
                    }`}
                  >
                    <div className="text-xs md:text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
                      {alert.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      {alert.text}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      {alert.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <iconify-icon
                    icon="lucide:clock"
                    style={{ fontSize: "16px" }}
                    className="text-amber-600 dark:text-amber-400"
                  ></iconify-icon>
                  Pending Approvals
                </h3>
                <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                  {metrics.pendingApprovals}
                </span>
              </div>
              <div className="space-y-2">
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
                    className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <iconify-icon
                        icon={item.icon}
                        style={{ fontSize: "16px" }}
                        className="text-slate-500 dark:text-slate-400"
                      ></iconify-icon>
                      <span className="text-xs md:text-sm text-slate-800 dark:text-slate-200">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Health */}
            <div className="bg-gradient-to-br from-violet-700 to-indigo-900 dark:from-violet-900 dark:to-slate-900 rounded-xl p-5 text-white shadow-sm border border-violet-600/30 dark:border-slate-800">
              <h3 className="text-sm md:text-base font-semibold flex items-center gap-2 mb-4">
                <iconify-icon
                  icon="lucide:heart-pulse"
                  style={{ fontSize: "16px" }}
                ></iconify-icon>
                Platform Health
              </h3>
              <div className="space-y-3">
                {[
                  { label: "API Uptime", value: "99.9%", status: "healthy" },
                  { label: "Database", value: "Optimal", status: "healthy" },
                  { label: "Payment Gateway", value: "Issue", status: "warning" },
                  { label: "Email Service", value: "Active", status: "healthy" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs md:text-sm"
                  >
                    <span className="text-violet-100/90">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.value}</span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.status === "healthy"
                            ? "bg-emerald-400"
                            : "bg-amber-400"
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
