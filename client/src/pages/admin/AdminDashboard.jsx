import { useMemo } from "react";
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

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
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
  }, [events]);

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
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 dark:bg-blue-950/50",
      borderHover: "hover:border-blue-500 dark:hover:border-blue-400",
    },
    {
      icon: "lucide:calendar-check",
      label: "My Events",
      description: "Manage your hosted events",
      path: "/admin/my-events",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/50",
      borderHover: "hover:border-emerald-500 dark:hover:border-emerald-400",
    },
    {
      icon: "lucide:trophy",
      label: "Declare Winners",
      description: "Announce winners for completed events",
      path: "/admin/declare-winners",
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-50 dark:bg-amber-950/50",
      borderHover: "hover:border-amber-500 dark:hover:border-amber-400",
    },
    {
      icon: "lucide:users",
      label: "Registered Teams",
      description: "View and manage team registrations",
      path: "/admin/registered-teams",
      colorClass: "text-violet-600 dark:text-violet-400",
      bgClass: "bg-violet-50 dark:bg-violet-950/50",
      borderHover: "hover:border-violet-500 dark:hover:border-violet-400",
    },
    {
      icon: "lucide:bar-chart-3",
      label: "Event Analytics",
      description: "Insights and performance metrics",
      path: "/admin/event-analytics",
      colorClass: "text-cyan-600 dark:text-cyan-400",
      bgClass: "bg-cyan-50 dark:bg-cyan-950/50",
      borderHover: "hover:border-cyan-500 dark:hover:border-cyan-400",
    },
    {
      icon: "lucide:bell",
      label: "Incoming Events",
      description: "External events from partner colleges",
      path: "/admin/incoming-events",
      colorClass: "text-rose-600 dark:text-rose-400",
      bgClass: "bg-rose-50 dark:bg-rose-950/50",
      borderHover: "hover:border-rose-500 dark:hover:border-rose-400",
    },
  ];

  // Stats cards data
  const statsCards = [
    {
      icon: "lucide:calendar",
      label: "Total Events",
      value: metrics.totalEvents,
      subtitle: `${metrics.activeEvents} active`,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      icon: "lucide:users",
      label: "Participants",
      value: metrics.totalParticipants.toLocaleString(),
      subtitle: `+${metrics.recentRegistrations} this week`,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/50",
      trend: `+${metrics.registrationGrowth}%`,
    },
    {
      icon: "lucide:trophy",
      label: "Winners",
      value: metrics.totalWinners,
      subtitle: "From completed events",
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      icon: "lucide:indian-rupee",
      label: "Revenue Generated",
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      subtitle: "From registration fees",
      colorClass: "text-violet-600 dark:text-violet-400",
      bgClass: "bg-violet-50 dark:bg-violet-950/50",
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-7">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1.5">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back! Here's an overview of {COLLEGE_INFO.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
              <iconify-icon
                icon="lucide:building-2"
                style={{ fontSize: "16px" }}
                className="text-slate-500 dark:text-slate-400"
              ></iconify-icon>
              <span className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200">
                {COLLEGE_INFO.name}
              </span>
              <span className="text-[10px] font-bold bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                {COLLEGE_INFO.naacGrade}
              </span>
            </div>
            <button
              onClick={() => navigate("/admin/create-event")}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs md:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5"
            >
              <div
                className={`w-11 h-11 rounded-xl ${stat.bgClass} flex items-center justify-center shrink-0`}
              >
                <iconify-icon
                  icon={stat.icon}
                  style={{ fontSize: "22px" }}
                  className={stat.colorClass}
                ></iconify-icon>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5 truncate">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  {stat.trend && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                      <iconify-icon
                        icon="lucide:trending-up"
                        style={{ fontSize: "12px" }}
                      ></iconify-icon>
                      {stat.trend}
                    </span>
                  )}
                  <span>{stat.subtitle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3.5">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.path}
                className={`bg-white dark:bg-slate-900 rounded-xl p-4 md:p-5 border border-slate-200 dark:border-slate-800 ${action.borderHover} flex items-center gap-3.5 transition-all shadow-sm group`}
              >
                <div
                  className={`w-11 h-11 rounded-xl ${action.bgClass} flex items-center justify-center shrink-0`}
                >
                  <iconify-icon
                    icon={action.icon}
                    style={{ fontSize: "22px" }}
                    className={action.colorClass}
                  ></iconify-icon>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-0.5">
                    {action.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {action.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left Column (2 cols wide on large screens) */}
          <div className="lg:col-span-2 space-y-5">

            {/* Recent Events */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <iconify-icon
                    icon="lucide:calendar"
                    style={{ fontSize: "16px" }}
                    className="text-blue-600 dark:text-blue-400"
                  ></iconify-icon>
                  Recent Events
                </h3>
                <Link
                  to="/admin/my-events"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/admin/my-events`)}
                    className="flex items-center gap-3.5 p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {event.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
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
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md shrink-0 capitalize ${
                        event.status === "closed"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          : event.status === "ongoing"
                            ? "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300"
                            : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Type Distribution */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                <iconify-icon
                  icon="lucide:pie-chart"
                  style={{ fontSize: "16px" }}
                  className="text-violet-600 dark:text-violet-400"
                ></iconify-icon>
                Events by Type
              </h3>
              <div className="space-y-3">
                {eventTypeDistribution.map((item, idx) => {
                  const percentage = Math.round(
                    (item.count / (events.length || 1)) * 100,
                  );
                  const colors = [
                    "bg-blue-600",
                    "bg-emerald-600",
                    "bg-amber-600",
                    "bg-violet-600",
                    "bg-cyan-600",
                  ];
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {item.type}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (1 col wide on large screens) */}
          <div className="space-y-5">

            {/* Event Status Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                <iconify-icon
                  icon="lucide:activity"
                  style={{ fontSize: "16px" }}
                  className="text-emerald-600 dark:text-emerald-400"
                ></iconify-icon>
                Event Status
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200">
                      Ongoing
                    </span>
                  </div>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {metrics.ongoingEvents}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200">
                      Upcoming
                    </span>
                  </div>
                  <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                    {metrics.upcomingEvents}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                    <span className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200">
                      Completed
                    </span>
                  </div>
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">
                    {metrics.completedEvents}
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                <iconify-icon
                  icon="lucide:clock"
                  style={{ fontSize: "16px" }}
                  className="text-rose-600 dark:text-rose-400"
                ></iconify-icon>
                Upcoming Deadlines
              </h3>
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-5 text-slate-400 dark:text-slate-500 text-xs">
                  No upcoming deadlines
                </div>
              ) : (
                <div className="space-y-2.5">
                  {upcomingDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className={`p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border-l-4 ${
                        deadline.daysLeft <= 3
                          ? "border-l-rose-500"
                          : "border-l-amber-500"
                      }`}
                    >
                      <div className="text-xs md:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate mb-1">
                        {deadline.title}
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {deadline.type}
                        </span>
                        <span
                          className={`text-[11px] font-semibold ${
                            deadline.daysLeft <= 3
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
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
            <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 dark:from-blue-900 dark:via-slate-900 dark:to-indigo-950 rounded-xl p-5 text-white shadow-sm border border-blue-600/30 dark:border-slate-800">
              <h3 className="text-sm md:text-base font-semibold flex items-center gap-2 mb-4">
                <iconify-icon
                  icon="lucide:school"
                  style={{ fontSize: "16px" }}
                ></iconify-icon>
                College Overview
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xs rounded-lg p-3 text-center border border-white/10">
                  <div className="text-lg md:text-xl font-bold">
                    {COLLEGE_INFO.totalStudents.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-blue-100/80">Students</div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xs rounded-lg p-3 text-center border border-white/10">
                  <div className="text-lg md:text-xl font-bold">
                    {COLLEGE_INFO.totalFaculty}
                  </div>
                  <div className="text-[11px] text-blue-100/80">Faculty</div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xs rounded-lg p-3 text-center border border-white/10">
                  <div className="text-lg md:text-xl font-bold">
                    {COLLEGE_INFO.departments.length}
                  </div>
                  <div className="text-[11px] text-blue-100/80">Departments</div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xs rounded-lg p-3 text-center border border-white/10">
                  <div className="text-lg md:text-xl font-bold">
                    {metrics.totalTeams}
                  </div>
                  <div className="text-[11px] text-blue-100/80">Teams</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
