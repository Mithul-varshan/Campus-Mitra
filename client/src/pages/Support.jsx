import { useState } from "react";
import {
  LifeBuoy,
  Bug,
  Lightbulb,
  MessageCircle,
  Zap,
  Lock,
  ChevronDown,
  ChevronUp,
  Send,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Filter,
  X,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth, ROLES } from "../context/AuthContext";

// ── Constants ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "bug",        label: "Bug Report",       icon: Bug,            color: "text-red-600 bg-red-50" },
  { value: "feature",    label: "Feature Request",  icon: Lightbulb,      color: "text-yellow-600 bg-yellow-50" },
  { value: "general",    label: "General Query",    icon: MessageCircle,  color: "text-blue-600 bg-blue-50" },
  { value: "performance",label: "Performance Issue",icon: Zap,            color: "text-orange-600 bg-orange-50" },
  { value: "access",     label: "Access Issue",     icon: Lock,           color: "text-purple-600 bg-purple-50" },
];

const PRIORITIES = [
  { value: "low",      label: "Low",      color: "bg-slate-100 text-slate-700" },
  { value: "medium",   label: "Medium",   color: "bg-blue-100 text-blue-700" },
  { value: "high",     label: "High",     color: "bg-orange-100 text-orange-700" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-700" },
];

const STATUSES = [
  { value: "open",        label: "Open",        color: "bg-blue-100 text-blue-700",   icon: AlertCircle },
  { value: "in_progress", label: "In Progress", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  { value: "replied",     label: "Replied",     color: "bg-purple-100 text-purple-700", icon: MessageSquare },
  { value: "resolved",    label: "Resolved",    color: "bg-green-100 text-green-700", icon: CheckCircle },
];

const ROLE_LABELS = {
  [ROLES.STUDENT]:    "Student",
  [ROLES.ADMIN]:      "Admin",
  [ROLES.TEACHER]:    "Teacher",
  [ROLES.SUPER_ADMIN]:"Super Admin",
};

// ── Per-role support config ────────────────────────────────────────────────
const ROLE_CONFIG = {
  [ROLES.STUDENT]: {
    tagline: "Facing trouble on your student dashboard? Report it here and we'll fix it fast.",
    formTitle: "Report an Issue",
    formSubtitle: "Tell us which screen or feature is acting up and we'll get back to you within 24 hours.",
    placeholder: "e.g. Leaderboard score not updating after project submission",
    screenLabel: "Affected Screen",
    screens: ["Dashboard", "My Events", "My Projects", "Portfolio", "Leaderboard", "Find Teammates", "Certificates", "Innovation Score", "Devlogs", "Other"],
    tips: [
      "Specify which screen or page is broken",
      "Describe what you expected vs what actually happened",
      "Mention any error messages you saw",
      "Use Critical only for fully broken or inaccessible screens",
    ],
  },
  [ROLES.TEACHER]: {
    tagline: "Issues with your teacher tools or student data? Report them here.",
    formTitle: "Raise a Support Ticket",
    formSubtitle: "Report issues with your dashboards, student records, or event tools.",
    placeholder: "e.g. Skill graph not loading for 3rd year CSE students",
    screenLabel: "Affected Feature",
    screens: ["Teacher Dashboard", "My Students", "Skill Intelligence", "Teacher Events", "Verified Achievements", "Analytics", "Other"],
    tips: [
      "Mention which class or student group is affected",
      "Specify the exact feature within the screen",
      "Include any error messages or unusual behaviour",
      "Feature suggestions are welcome — describe the use case",
    ],
  },
  [ROLES.ADMIN]: {
    tagline: "Platform acting up? Report bulk import errors, data issues, or anything else here.",
    formTitle: "Report a Platform Issue",
    formSubtitle: "For import errors, management issues, or feature requests for the admin panel.",
    placeholder: "e.g. Excel bulk import fails silently for files with more than 100 rows",
    screenLabel: "Affected Module",
    screens: ["Bulk Import", "Students", "Faculty", "Analytics", "NAAC Reports", "Events Management", "Winners", "Admin Dashboard", "Reports & Exports", "Settings", "Other"],
    tips: [
      "For import errors, mention file type (CSV / Excel) and row count",
      "Paste error details or describe the exact failure point",
      "Note whether data is seeded or imported for student/faculty bugs",
      "Mark platform-wide change requests as Feature Request",
    ],
  },
  [ROLES.SUPER_ADMIN]: {
    tagline: "Submit a ticket for platform-level issues or improvements.",
    formTitle: "Submit a Ticket",
    formSubtitle: "Report anything related to platform infrastructure or super-admin tools.",
    placeholder: "e.g. College onboarding modal missing NAAC tier field",
    screenLabel: "Affected Area",
    screens: ["Colleges", "Global Analytics", "Super Admin Dashboard", "Subscription Plans", "Audit Logs", "AI Configuration", "Platform Settings", "Certificate Authority", "Other"],
    tips: [],
  },
};

function getCategoryMeta(value) {
  return CATEGORIES.find((c) => c.value === value) || CATEGORIES[2];
}
function getPriorityMeta(value) {
  return PRIORITIES.find((p) => p.value === value) || PRIORITIES[0];
}
function getStatusMeta(value) {
  return STATUSES.find((s) => s.value === value) || STATUSES[0];
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Submit Form ─────────────────────────────────────────────────────────────
function TicketForm({ onSubmit, roleConfig }) {
  const defaultScreen = roleConfig?.screens?.[0] || "Other";
  const [form, setForm] = useState({
    title: "",
    category: "bug",
    priority: "medium",
    description: "",
    affectedScreen: defaultScreen,
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    onSubmit(form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ title: "", category: "bug", priority: "medium", description: "", affectedScreen: defaultScreen });
    }, 2500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle size={30} className="text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Ticket Submitted!</h3>
        <p className="text-sm text-slate-500">We'll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder={roleConfig?.placeholder || "Brief description of the issue"}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Affected Screen (role-specific) */}
      {roleConfig?.screens?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {roleConfig.screenLabel || "Affected Screen"}
          </label>
          <select
            value={form.affectedScreen}
            onChange={(e) => set("affectedScreen", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {roleConfig.screens.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORIES.map(({ value, label, icon: Icon, color }) => (
            <button
              key={value}
              type="button"
              onClick={() => set("category", value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                form.category === value
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
        <div className="flex gap-2 flex-wrap">
          {PRIORITIES.map(({ value, label, color }) => (
            <button
              key={value}
              type="button"
              onClick={() => set("priority", value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                form.priority === value
                  ? `${color} border-transparent ring-2 ring-offset-1 ring-current`
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe the issue in detail — steps to reproduce, expected vs actual behaviour, screenshots, etc."
          rows={5}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        <Send size={16} />
        Submit Ticket
      </button>
    </form>
  );
}

// ── Single Ticket Card (user view) ──────────────────────────────────────────
function TicketCard({ ticket, onDelete }) {
  const [open, setOpen] = useState(false);
  const cat = getCategoryMeta(ticket.category);
  const pri = getPriorityMeta(ticket.priority);
  const sta = getStatusMeta(ticket.status);
  const CatIcon = cat.icon;
  const StaIcon = sta.icon;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 transition-colors text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`p-1.5 rounded-md ${cat.color}`}>
          <CatIcon size={14} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 text-sm truncate">{ticket.title}</p>
          <p className="text-xs text-slate-500">{formatDate(ticket.createdAt)}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sta.color} shrink-0`}>
          <StaIcon size={11} />
          {sta.label}
        </span>
        <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${pri.color} shrink-0`}>
          {pri.label}
        </span>
        {open ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100">
          <p className="text-sm text-slate-700 mt-3 whitespace-pre-wrap">{ticket.description}</p>

          {ticket.adminReply && (
            <div className="mt-4 bg-white border border-blue-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                <MessageSquare size={12} /> Admin Reply
              </p>
              <p className="text-sm text-slate-700">{ticket.adminReply}</p>
            </div>
          )}

          <div className="flex justify-end mt-3">
            <button
              onClick={() => onDelete(ticket.id)}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Super Admin Ticket Row ──────────────────────────────────────────────────
function AdminTicketRow({ ticket, onStatusChange, onReply, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState(ticket.adminReply || "");

  const cat = getCategoryMeta(ticket.category);
  const pri = getPriorityMeta(ticket.priority);
  const sta = getStatusMeta(ticket.status);
  const CatIcon = cat.icon;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
      {/* Row header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <span className={`p-1.5 rounded-md shrink-0 ${cat.color}`}>
          <CatIcon size={14} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-slate-900 text-sm truncate">{ticket.title}</p>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pri.color}`}>
              {pri.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            By <span className="font-medium">{ROLE_LABELS[ticket.submittedByRole] || ticket.submittedByRole}</span>
            {ticket.affectedScreen && (
              <span className="ml-1 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                {ticket.affectedScreen}
              </span>
            )}
            {" · "}{formatDate(ticket.createdAt)}
          </p>
        </div>
        {/* Status selector */}
        <select
          value={ticket.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange(ticket.id, e.target.value)}
          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${sta.color}`}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {expanded
          ? <ChevronUp size={16} className="text-slate-400 shrink-0" />
          : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
      </div>

      {/* Expanded detail + reply */}
      {expanded && (
        <div className="px-4 pb-5 bg-slate-50 border-t border-slate-100">
          <p className="text-sm text-slate-700 mt-3 mb-4 whitespace-pre-wrap">{ticket.description}</p>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Reply to this ticket
            </label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              placeholder="Write a response..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => onDelete(ticket.id)}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
              >
                <Trash2 size={13} /> Delete Ticket
              </button>
              <button
                onClick={() => replyText.trim() && onReply(ticket.id, replyText)}
                disabled={!replyText.trim()}
                className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={13} /> Send Reply
              </button>
            </div>
            {ticket.adminReply && (
              <p className="text-xs text-slate-400 mt-2">
                Last reply: "{ticket.adminReply.slice(0, 60)}{ticket.adminReply.length > 60 ? "…" : ""}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function Support() {
  const { tickets, addTicket, updateTicketStatus, replyToTicket, deleteTicket } = useData();
  const { user } = useAuth();

  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;
  const roleConfig = ROLE_CONFIG[user?.role] || ROLE_CONFIG[ROLES.STUDENT];

  // Filters (super admin only)
  const [filterStatus,   setFilterStatus]   = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [search, setSearch] = useState("");

  const myTickets = tickets.filter((t) => t.submittedByRole === user?.role);

  const adminTickets = tickets.filter((t) => {
    const matchStatus   = filterStatus   === "all" || t.status   === filterStatus;
    const matchCat      = filterCategory === "all" || t.category === filterCategory;
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchSearch   = !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCat && matchPriority && matchSearch;
  });

  const handleSubmit = (form) => {
    addTicket({ ...form, submittedByRole: user?.role });
  };

  // Stats for super admin
  const total      = tickets.length;
  const open       = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved   = tickets.filter((t) => t.status === "resolved" || t.status === "replied").length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <LifeBuoy size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Support</h1>
            </div>
            <p className="text-slate-600 ml-12">
              {roleConfig.tagline}
            </p>
          </div>
        </div>

        {isSuperAdmin ? (
          /* ════════════════════════════════════════════════════════════
             SUPER ADMIN VIEW
          ════════════════════════════════════════════════════════════ */
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Tickets", value: total,      color: "bg-blue-600",   sub: "All time" },
                { label: "Open",          value: open,       color: "bg-orange-500", sub: "Needs attention" },
                { label: "In Progress",   value: inProgress, color: "bg-yellow-500", sub: "Being handled" },
                { label: "Resolved",      value: resolved,   color: "bg-green-600",  sub: "Closed / Replied" },
              ].map(({ label, value, color, sub }) => (
                <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <div className={`w-8 h-1.5 rounded-full ${color} mb-3`} />
                  <p className="text-2xl font-extrabold text-slate-900 mb-0.5">{value}</p>
                  <p className="text-sm font-medium text-slate-700">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: all tickets */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">
                      All Tickets
                      {adminTickets.length !== tickets.length && (
                        <span className="ml-2 text-sm font-normal text-slate-400">
                          {adminTickets.length} of {tickets.length}
                        </span>
                      )}
                    </h2>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-40">
                      <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search tickets…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="all">All Statuses</option>
                      {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>

                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>

                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="all">All Priorities</option>
                      {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>

                    {(filterStatus !== "all" || filterCategory !== "all" || filterPriority !== "all" || search) && (
                      <button
                        onClick={() => { setFilterStatus("all"); setFilterCategory("all"); setFilterPriority("all"); setSearch(""); }}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-2 py-1.5 border border-slate-200 rounded-lg"
                      >
                        <X size={12} /> Clear
                      </button>
                    )}
                  </div>

                  {/* Ticket list */}
                  {adminTickets.length === 0 ? (
                    <div className="text-center py-14">
                      <LifeBuoy size={36} className="mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-400 text-sm">
                        {tickets.length === 0 ? "No tickets have been submitted yet." : "No tickets match your filters."}
                      </p>
                    </div>
                  ) : (
                    adminTickets.map((ticket) => (
                      <AdminTicketRow
                        key={ticket.id}
                        ticket={ticket}
                        onStatusChange={updateTicketStatus}
                        onReply={replyToTicket}
                        onDelete={deleteTicket}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Right: submit + stats breakdown */}
              <div className="flex flex-col gap-5">
                {/* Submit own ticket */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                  <h2 className="text-base font-bold text-slate-900 mb-4">{roleConfig.formTitle}</h2>
                  <TicketForm onSubmit={handleSubmit} roleConfig={roleConfig} />
                </div>

                {/* Category breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">By Category</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map(({ value, label, icon: Icon, color }) => {
                      const count = tickets.filter((t) => t.category === value).length;
                      return (
                        <div key={value} className="flex items-center gap-2">
                          <span className={`p-1 rounded ${color}`}><Icon size={12} /></span>
                          <span className="flex-1 text-xs text-slate-600">{label}</span>
                          <span className="text-xs font-bold text-slate-800">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ════════════════════════════════════════════════════════════
             REGULAR USER VIEW
          ════════════════════════════════════════════════════════════ */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submit form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">{roleConfig.formTitle}</h2>
              <p className="text-sm text-slate-500 mb-5">{roleConfig.formSubtitle}</p>
              <TicketForm onSubmit={handleSubmit} roleConfig={roleConfig} />

              {/* Help tips */}
              {roleConfig.tips.length > 0 && (
                <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 mb-2">💡 Tips for a faster response</p>
                  <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                    {roleConfig.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* My tickets */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">My Tickets</h2>
                <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                  {myTickets.length}
                </span>
              </div>

              {myTickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle size={36} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-400 text-sm">You haven't submitted any tickets yet.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-140 overflow-y-auto pr-1">
                  {myTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} onDelete={deleteTicket} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
