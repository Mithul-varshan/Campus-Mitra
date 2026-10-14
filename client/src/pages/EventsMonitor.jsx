import { useState } from "react";
import { Flag, Eye, CheckCircle, AlertCircle, Search, Monitor, Users, Clock, Download } from "lucide-react";

/* ══ Data (unchanged) ══════════════════════════════════════════════════════ */

const DOMAIN_COLORS = {
  General:        "bg-slate-100 text-slate-600",
  "AI/ML":        "bg-blue-50 text-blue-700",
  Web:            "bg-green-50 text-green-700",
  IoT:            "bg-purple-50 text-purple-700",
  Blockchain:     "bg-orange-50 text-orange-700",
  Mobile:         "bg-pink-50 text-pink-700",
  Cloud:          "bg-cyan-50 text-cyan-700",
  "Data Science": "bg-yellow-50 text-yellow-700",
};

const STATUS_COLORS = {
  Active:             "bg-green-50 text-green-700 border border-green-200",
  "Pending Approval": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Flagged:            "bg-red-50 text-red-700 border border-red-200",
};

const SAMPLE_EVENTS = [
  { id: 1, name: "Annual Hackathon 2026",       college: "IIT Mumbai",         participants: 342, domain: "General",      status: "Active",           isCrossCollege: true,  flagged: false, date: "2026-02-25" },
  { id: 2, name: "AI/ML Workshop Series",        college: "DTU Delhi",          participants: 128, domain: "AI/ML",        status: "Active",           isCrossCollege: true,  flagged: false, date: "2026-03-01" },
  { id: 3, name: "Web Dev Sprint",               college: "BITS Pilani",        participants:  87, domain: "Web",          status: "Active",           isCrossCollege: false, flagged: false, date: "2026-02-20" },
  { id: 4, name: "IoT Innovation Lab",           college: "NIT Trichy",         participants:  54, domain: "IoT",          status: "Pending Approval", isCrossCollege: true,  flagged: false, date: "2026-03-05" },
  { id: 5, name: "Blockchain Foundation Course", college: "VIT Vellore",        participants: 201, domain: "Blockchain",   status: "Active",           isCrossCollege: true,  flagged: true,  date: "2026-02-18" },
  { id: 6, name: "Mobile App Development",       college: "Manipal University", participants:  95, domain: "Mobile",       status: "Active",           isCrossCollege: false, flagged: false, date: "2026-02-22" },
  { id: 7, name: "Cloud Computing Bootcamp",     college: "JNTU Hyderabad",     participants: 167, domain: "Cloud",        status: "Active",           isCrossCollege: true,  flagged: false, date: "2026-03-10" },
  { id: 8, name: "Data Science Challenge",       college: "Anna University",    participants: 423, domain: "Data Science", status: "Active",           isCrossCollege: true,  flagged: true,  date: "2026-02-15" },
];

/* ══ Sub-components ════════════════════════════════════════════════════════ */

function Badge({ className, children }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${className}`}>
      {children}
    </span>
  );
}

function ActionBtn({ onClick, icon: Icon, label, variant = "default" }) {
  const variants = {
    default: "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200",
    success: "text-green-600 hover:bg-green-50 border-green-200",
    warning: "text-amber-600 hover:bg-amber-50 border-amber-200",
    danger:  "text-red-500 hover:bg-red-50 border-red-200",
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${variants[variant]}`}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}

/* ══ Main Component ════════════════════════════════════════════════════════ */

export default function EventsMonitor() {
  const [events, setEvents]               = useState(SAMPLE_EVENTS);
  const [searchTerm, setSearchTerm]       = useState("");
  const [filterStatus, setFilterStatus]   = useState("All");
  const [filterDomain, setFilterDomain]   = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason]       = useState("");
  const [flagEventId, setFlagEventId]     = useState(null);

  const filtered = events.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.college.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || (filterStatus === "Flagged" ? e.flagged : e.status === filterStatus);
    const matchDomain = filterDomain === "All" || e.domain === filterDomain;
    return matchSearch && matchStatus && matchDomain;
  });

  const handleFlag = (id) => { setFlagEventId(id); setShowFlagModal(true); };

  const submitFlag = () => {
    if (!flagReason.trim()) return;
    setEvents((prev) => prev.map((e) => e.id === flagEventId ? { ...e, flagged: true, status: "Flagged" } : e));
    setShowFlagModal(false);
    setFlagReason("");
  };

  const handleApprove = (id) =>
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, status: "Active", flagged: false } : e));

  const getAnalytics = (id) => {
    const ev = events.find((e) => e.id === id);
    return {
      registrations:  Math.floor(ev.participants * 0.95),
      attendanceRate: Math.floor(Math.random() * 30 + 70),
      avgRating:      (Math.random() * 2 + 3.5).toFixed(1),
      completionRate: Math.floor(Math.random() * 30 + 65),
    };
  };

  const kpis = [
    { label: "Total Events",       value: events.length,                                                sub: `${events.filter((e) => e.status === "Active").length} active`, icon: Monitor, iconBg: "bg-slate-100", iconColor: "text-slate-500" },
    { label: "Total Participants", value: events.reduce((s, e) => s + e.participants, 0).toLocaleString(), sub: "across all events",                                           icon: Users,   iconBg: "bg-slate-100", iconColor: "text-slate-500" },
    { label: "Pending Approval",   value: events.filter((e) => e.status === "Pending Approval").length,  sub: "awaiting review",                                              icon: Clock,   iconBg: "bg-amber-50",  iconColor: "text-amber-500", valueColor: "text-amber-600" },
    { label: "Flagged Events",     value: events.filter((e) => e.flagged).length,                        sub: "require action",                                               icon: Flag,    iconBg: "bg-red-50",    iconColor: "text-red-500",   valueColor: "text-red-600"   },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Monitor size={18} className="text-blue-600" />
              Events Monitor
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Global event monitoring and management across all colleges</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-5">

        {/* ── KPI Strip ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${k.iconBg} ${k.iconColor}`}>
                <k.icon size={20} />
              </div>
              <div className="min-w-0">
                <p className={`text-2xl font-bold leading-none mb-1 ${k.valueColor || "text-slate-900"}`}>{k.value}</p>
                <p className="text-xs font-medium text-slate-500 truncate">{k.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{k.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
                placeholder="Search events or colleges…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Status */}
            <select
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option>Active</option>
              <option>Pending Approval</option>
              <option>Flagged</option>
            </select>
            {/* Domain */}
            <select
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
            >
              <option value="All">All Domains</option>
              {["General","AI/ML","Web","IoT","Blockchain","Mobile","Cloud","Data Science"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            {/* Clear */}
            <button
              className="px-4 py-2 text-sm font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
              onClick={() => { setSearchTerm(""); setFilterStatus("All"); setFilterDomain("All"); }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">All Events</p>
            <span className="text-xs text-slate-400">{filtered.length} of {events.length} shown</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  <th className="px-5 py-3">Event</th>
                  <th className="px-4 py-3">College</th>
                  <th className="px-4 py-3">Participants</th>
                  <th className="px-4 py-3">Domain</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Flag</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center text-slate-400 text-sm">
                      No events match your filters
                    </td>
                  </tr>
                ) : filtered.map((ev) => (
                  <tr key={ev.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    {/* Event name */}
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-800 leading-snug">{ev.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{ev.date}</p>
                    </td>
                    {/* College */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-slate-700">{ev.college}</p>
                      {ev.isCrossCollege && (
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">Cross-College</span>
                      )}
                    </td>
                    {/* Participants */}
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-800">{ev.participants}</span>
                    </td>
                    {/* Domain */}
                    <td className="px-4 py-3.5">
                      <Badge className={DOMAIN_COLORS[ev.domain]}>{ev.domain}</Badge>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <Badge className={STATUS_COLORS[ev.status]}>{ev.status}</Badge>
                    </td>
                    {/* Flag icon */}
                    <td className="px-4 py-3.5">
                      {ev.flagged ? (
                        <Flag size={15} className="text-red-500 fill-red-500" />
                      ) : (
                        <button
                          onClick={() => handleFlag(ev.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors"
                          title="Flag event"
                        >
                          <Flag size={15} />
                        </button>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <ActionBtn
                          icon={Eye}
                          label="View"
                          onClick={() => { setSelectedEvent(ev); setShowAnalytics(true); }}
                        />
                        {ev.status === "Pending Approval" && (
                          <ActionBtn icon={CheckCircle} label="Approve" variant="success" onClick={() => handleApprove(ev.id)} />
                        )}
                        {ev.flagged && (
                          <ActionBtn icon={AlertCircle} label="Unflag" variant="warning" onClick={() => handleApprove(ev.id)} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Analytics Modal ─────────────────────────────────────────────────── */}
      {showAnalytics && selectedEvent && (() => {
        const a = getAnalytics(selectedEvent.id);
        return (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowAnalytics(false)}
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg">
              {/* Modal header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Event Analytics</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{selectedEvent.name}</p>
                </div>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors text-base font-medium"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Registrations", value: a.registrations        },
                    { label: "Attendance Rate",      value: a.attendanceRate + "%" },
                    { label: "Average Rating",       value: a.avgRating + " / 5"   },
                    { label: "Completion Rate",      value: a.completionRate + "%" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "College",       value: selectedEvent.college },
                    { label: "Domain",        value: selectedEvent.domain },
                    { label: "Cross-College", value: selectedEvent.isCrossCollege ? "Yes" : "No" },
                    { label: "Status",        value: selectedEvent.status },
                  ].map((info) => (
                    <div key={info.label} className="bg-slate-50 rounded-xl p-3.5">
                      <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wide">{info.label}</p>
                      <p className="text-sm font-semibold text-slate-800">{info.value}</p>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setShowAnalytics(false)}
                    className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Download size={14} /> Download Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Flag Modal ───────────────────────────────────────────────────────── */}
      {showFlagModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowFlagModal(false)}
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <Flag size={15} className="text-red-500" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Flag Event</h2>
              </div>
              <p className="text-sm text-slate-400 mt-2">Provide a reason for flagging this event. It will be reviewed by the platform team.</p>
            </div>

            <div className="px-6 py-5">
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder="Describe the issue or concern…"
                rows={4}
                className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition placeholder-slate-400"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { setShowFlagModal(false); setFlagReason(""); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFlag}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Flag size={13} /> Flag Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
