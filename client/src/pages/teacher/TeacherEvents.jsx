import { useState, useMemo } from "react";
import {
  EVENTS,
  STATUS_META,
  APPROVAL_META,
  TYPE_META,
  TREND_COLORS,
} from "./teacherData";

/* ─── Mock Data (moved to teacherData.js) ─────────────────────────── */
// eslint-disable-next-line no-unused-vars
const __legacyEvents = [
  {
    id: 1,
    title: "HackFest 2025 — AI Track",
    type: "Hosted",
    category: "Hackathon",
    status: "Completed",
    date: "Jan 15–17, 2025",
    venue: "Main Auditorium, Block A",
    organizer: "Dept. of CSE",
    participants: 142,
    maxSeats: 200,
    winners: [
      { rank: 1, name: "Riya Patel", rollNo: "21CS045", prize: "₹25,000" },
      { rank: 2, name: "Arjun Mehta", rollNo: "21CS022", prize: "₹15,000" },
      { rank: 3, name: "Fatima Zahra", rollNo: "22CS014", prize: "₹10,000" },
    ],
    tags: ["AI", "Machine Learning", "Python"],
    approvalStatus: "approved",
    engagementTrend: [12, 28, 45, 60, 80, 110, 142],
    description: "Inter-department AI hackathon focused on real-world problem solving using machine learning.",
    registrationsByDay: [8,15,22,30,38,50,62,75,88,98,110,125,135,142],
  },
  {
    id: 2,
    title: "UI/UX Designathon 2025",
    type: "Hosted",
    category: "Competition",
    status: "Ongoing",
    date: "Feb 20–22, 2026",
    venue: "Lab Complex, Block C",
    organizer: "Design Club",
    participants: 88,
    maxSeats: 120,
    winners: [],
    tags: ["Figma", "Design Thinking", "UI/UX"],
    approvalStatus: "approved",
    engagementTrend: [5, 18, 35, 55, 72, 88],
    description: "A 48-hour design sprint where students tackle real product challenges.",
    registrationsByDay: [5,12,20,30,44,56,68,80,88],
  },
  {
    id: 3,
    title: "Cloud Native Bootcamp",
    type: "Hosted",
    category: "Workshop",
    status: "Upcoming",
    date: "Mar 10, 2026",
    venue: "Seminar Hall 2",
    organizer: "IEEE Student Branch",
    participants: 34,
    maxSeats: 80,
    winners: [],
    tags: ["Docker", "Kubernetes", "AWS"],
    approvalStatus: "pending",
    engagementTrend: [4, 10, 20, 34],
    description: "Hands-on workshop covering containerisation, orchestration and cloud deployment.",
    registrationsByDay: [4,8,14,20,28,34],
  },
  {
    id: 4,
    title: "Smart India Hackathon 2025",
    type: "External",
    category: "Hackathon",
    status: "Completed",
    date: "Sep 20–22, 2025",
    venue: "National Level (Remote)",
    organizer: "Govt. of India / MIC",
    participants: 24,
    maxSeats: 30,
    winners: [
      { rank: 1, name: "Arjun Mehta", rollNo: "21CS022", prize: "₹1,00,000" },
    ],
    tags: ["National", "Problem Solving", "Technology"],
    approvalStatus: "approved",
    engagementTrend: [3, 8, 14, 20, 24],
    description: "India's flagship hackathon for students to solve government problem statements.",
    registrationsByDay: [3,6,10,14,18,22,24],
  },
  {
    id: 5,
    title: "NLP Challenge 2024",
    type: "External",
    category: "Competition",
    status: "Completed",
    date: "Nov 10, 2024",
    venue: "IIT Madras (Online)",
    organizer: "IIT Madras AI Lab",
    participants: 11,
    maxSeats: 20,
    winners: [
      { rank: 3, name: "Fatima Zahra", rollNo: "22CS014", prize: "Certificate + ₹5,000" },
    ],
    tags: ["NLP", "Python", "HuggingFace"],
    approvalStatus: "approved",
    engagementTrend: [2, 5, 8, 11],
    description: "Natural language processing competition open to undergraduate students.",
    registrationsByDay: [2,4,7,9,11],
  },
  {
    id: 6,
    title: "Open Source Sprint — GSSoC",
    type: "External",
    category: "Open Source",
    status: "Upcoming",
    date: "Apr 1 – Jun 30, 2026",
    venue: "Online",
    organizer: "GirlScript Foundation",
    participants: 6,
    maxSeats: 50,
    winners: [],
    tags: ["Open Source", "GitHub", "Community"],
    approvalStatus: "approved",
    engagementTrend: [1, 3, 6],
    description: "Summer open-source program where students contribute to real-world repositories.",
    registrationsByDay: [1,2,4,6],
  },
  {
    id: 7,
    title: "Blockchain Dev Bootcamp",
    type: "Hosted",
    category: "Workshop",
    status: "Upcoming",
    date: "Mar 25, 2026",
    venue: "Seminar Hall 1",
    organizer: "Crypto & Web3 Club",
    participants: 19,
    maxSeats: 60,
    winners: [],
    tags: ["Solidity", "Web3", "Ethereum"],
    approvalStatus: "rejected",
    engagementTrend: [4, 10, 16, 19],
    description: "Introductory bootcamp on smart contract development using Solidity.",
    registrationsByDay: [2,5,10,15,19],
  },
];

/* ─── Constants (moved to teacherData.js) ──────────────────────────── */

/* ─── Micro bar sparkline ───────────────────────────────────────────── */
function Sparkline({ data, color = "#6366f1" }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "28px" }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: "2px",
          background: i === data.length - 1 ? color : `${color}55`,
          height: `${Math.max(4, (v / max) * 28)}px`,
          transition: "height 0.3s",
        }} />
      ))}
    </div>
  );
}

/* ─── Mini heatrow for registration trend ───────────────────────────── */
function RegHeatrow({ data }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "20px" }}>
      {data.map((v, i) => {
        const idx = Math.floor((v / max) * 3);
        return <div key={i} style={{ width: "10px", height: "10px", borderRadius: "2px", background: TREND_COLORS[idx], flexShrink: 0 }} />;
      })}
    </div>
  );
}

/* ─── Approval badge ────────────────────────────────────────────────── */
function ApprovalBadge({ status }) {
  const m = APPROVAL_META[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600,
      padding: "2px 9px", borderRadius: "999px", background: m.bg, color: m.color }}>
      <iconify-icon icon={m.icon} style={{ fontSize: "11px" }} />{m.label}
    </span>
  );
}

/* ─── Event Detail Drawer ───────────────────────────────────────────── */
function EventDrawer({ event, onClose, onApprove, onReject }) {
  const [tab, setTab] = useState("overview");
  const sm = STATUS_META[event.status];
  const tm = TYPE_META[event.type];
  const pct = Math.round((event.participants / event.maxSeats) * 100);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
      {/* overlay */}
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }} />
      {/* drawer */}
      <div style={{ width: "520px", background: "var(--background)", height: "100%", overflowY: "auto",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px", background: tm.bg, color: tm.color,
                display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <iconify-icon icon={tm.icon} style={{ fontSize: "11px" }} />{event.type}
              </span>
              <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 10px", borderRadius: "999px",
                display: "inline-flex", alignItems: "center", gap: "4px", background: sm.bg, color: sm.color }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sm.dot, display: "inline-block" }} />{event.status}
              </span>
              <ApprovalBadge status={event.approvalStatus} />
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "4px" }}>
              <iconify-icon icon="lucide:x" style={{ fontSize: "18px" }} />
            </button>
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: "0 0 6px" }}>{event.title}</h2>
          <div style={{ fontSize: "13px", color: "var(--muted-foreground)", display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <iconify-icon icon="lucide:calendar" style={{ fontSize: "13px" }} />{event.date}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <iconify-icon icon="lucide:map-pin" style={{ fontSize: "13px" }} />{event.venue}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <iconify-icon icon="lucide:user" style={{ fontSize: "13px" }} />{event.organizer}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", padding: "12px 28px 0", borderBottom: "1px solid var(--border)" }}>
          {["overview", "participants", "winners", "analytics"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "6px 14px", border: "none", background: "none", cursor: "pointer", fontSize: "13px",
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "var(--foreground)" : "var(--muted-foreground)",
                borderBottom: tab === t ? "2px solid #6366f1" : "2px solid transparent",
                textTransform: "capitalize", transition: "all 0.15s" }}
            >{t}</button>
          ))}
        </div>

        <div style={{ padding: "20px 28px", flex: 1 }}>
          {/* ── Overview ── */}
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontSize: "14px", color: "var(--foreground)", lineHeight: 1.7, margin: 0 }}>{event.description}</p>

              {/* Participation bar */}
              <div style={{ background: "var(--muted)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>Participation</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#6366f1" }}>{event.participants} / {event.maxSeats}</span>
                </div>
                <div style={{ height: "8px", background: "var(--border)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "#22c55e" : pct >= 50 ? "#6366f1" : "#a5b4fc", borderRadius: "999px", transition: "width 0.5s" }} />
                </div>
                <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "4px" }}>{pct}% capacity filled</div>
              </div>

              {/* Tags */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tags</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {event.tags.map(t => (
                    <span key={t} style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "999px", background: "#eff6ff", color: "#4338ca", fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Approval actions for pending */}
              {event.approvalStatus === "pending" && (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#92400e", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <iconify-icon icon="lucide:alert-circle" style={{ fontSize: "15px" }} />Event pending your approval
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => onApprove(event.id)}
                      style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "none", background: "#16a34a", color: "white", fontWeight: 600, fontSize: "13px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <iconify-icon icon="lucide:check" style={{ fontSize: "14px" }} />Approve
                    </button>
                    <button onClick={() => onReject(event.id)}
                      style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "none", background: "#dc2626", color: "white", fontWeight: 600, fontSize: "13px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <iconify-icon icon="lucide:x" style={{ fontSize: "14px" }} />Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Participants ── */}
          {tab === "participants" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  { label: "Registered", value: event.participants, color: "#6366f1", bg: "#eff6ff" },
                  { label: "Available", value: event.maxSeats - event.participants, color: "#94a3b8", bg: "var(--muted)" },
                  { label: "Fill Rate", value: `${pct}%`, color: pct >= 80 ? "#16a34a" : "#d97706", bg: pct >= 80 ? "#f0fdf4" : "#fffbeb" },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "var(--muted-foreground)", fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--muted)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "10px" }}>Registration Trend</div>
                <RegHeatrow data={event.registrationsByDay} />
                <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "8px" }}>Each cell = 1 day of registrations</div>
              </div>
              <div style={{ background: "var(--muted)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "10px" }}>Engagement Growth</div>
                <Sparkline data={event.engagementTrend} color="#6366f1" />
              </div>
            </div>
          )}

          {/* ── Winners ── */}
          {tab === "winners" && (
            <div>
              {event.winners.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted-foreground)", fontSize: "14px" }}>
                  {event.status === "Completed" ? "No winners recorded yet." : "Winners will be announced after the event."}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {event.winners.map(w => {
                    const rankColors = { 1: ["#fef3c7","#d97706","🥇"], 2: ["#f1f5f9","#64748b","🥈"], 3: ["#fef2f2","#ef4444","🥉"] };
                    const [bg, col, emoji] = rankColors[w.rank] || ["var(--muted)","var(--foreground)","🏅"];
                    return (
                      <div key={w.rank} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px",
                        background: bg, borderRadius: "12px", border: `1px solid ${col}22` }}>
                        <div style={{ fontSize: "24px", flexShrink: 0 }}>{emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{w.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{w.rollNo}</div>
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: col }}>{w.prize}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Analytics ── */}
          {tab === "analytics" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "var(--muted)", borderRadius: "12px", padding: "18px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <iconify-icon icon="lucide:trending-up" style={{ fontSize: "15px", color: "#6366f1" }} />Engagement Trend
                </div>
                <Sparkline data={event.engagementTrend} color="#4f46e5" />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                  <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Start</span>
                  <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Now</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Total Participants", value: event.participants, icon: "lucide:users", color: "#6366f1" },
                  { label: "Capacity", value: event.maxSeats, icon: "lucide:layout-list", color: "#0ea5e9" },
                  { label: "Fill Rate", value: `${pct}%`, icon: "lucide:percent", color: pct >= 80 ? "#16a34a" : "#d97706" },
                  { label: "Winners", value: event.winners.length, icon: "lucide:trophy", color: "#f59e0b" },
                ].map(s => (
                  <div key={s.label} style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", color: "var(--muted-foreground)", fontWeight: 500 }}>{s.label}</span>
                      <iconify-icon icon={s.icon} style={{ fontSize: "15px", color: s.color }} />
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--muted)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "10px", color: "var(--foreground)" }}>Registration Activity</div>
                <RegHeatrow data={event.registrationsByDay} />
                <div style={{ display: "flex", gap: "6px", marginTop: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Low</span>
                  {TREND_COLORS.map((c, i) => <div key={i} style={{ width: "10px", height: "10px", borderRadius: "2px", background: c }} />)}
                  <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>High</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function TeacherEvents() {
  const [events, setEvents]           = useState(EVENTS);
  const [search, setSearch]           = useState("");
  const [typeFilter, setTypeFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [selected, setSelected]       = useState(null);

  const filtered = useMemo(() => events.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.organizer.toLowerCase().includes(q);
    const matchType   = typeFilter === "all"     || e.type === typeFilter;
    const matchStatus = statusFilter === "all"   || e.status === statusFilter;
    const matchApproval = approvalFilter === "all" || e.approvalStatus === approvalFilter;
    return matchSearch && matchType && matchStatus && matchApproval;
  }), [events, search, typeFilter, statusFilter, approvalFilter]);

  const totals = useMemo(() => ({
    total:       events.length,
    hosted:      events.filter(e => e.type === "Hosted").length,
    external:    events.filter(e => e.type === "External").length,
    ongoing:     events.filter(e => e.status === "Ongoing").length,
    upcoming:    events.filter(e => e.status === "Upcoming").length,
    completed:   events.filter(e => e.status === "Completed").length,
    participants: events.reduce((s, e) => s + e.participants, 0),
    pending:     events.filter(e => e.approvalStatus === "pending").length,
  }), [events]);

  function handleApprove(id) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, approvalStatus: "approved" } : e));
    setSelected(prev => prev ? { ...prev, approvalStatus: "approved" } : null);
  }
  function handleReject(id) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, approvalStatus: "rejected" } : e));
    setSelected(prev => prev ? { ...prev, approvalStatus: "rejected" } : null);
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px", color: "var(--foreground)" }}>Events Tracker</h1>
          <p style={{ fontSize: "14px", color: "var(--muted-foreground)", margin: 0 }}>
            Monitor all institution-hosted & external events your students participate in
          </p>
        </div>
        {totals.pending > 0 && (
          <button onClick={() => setApprovalFilter("pending")}
            style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 16px", borderRadius: "10px",
              background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
            <iconify-icon icon="lucide:clock" style={{ fontSize: "15px" }} />
            {totals.pending} Pending Approval
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Total Events",     value: totals.total,        icon: "lucide:calendar",        color: "#6366f1" },
          { label: "Institution Hosted", value: totals.hosted,     icon: "lucide:building-2",      color: "#2563eb" },
          { label: "External Events",  value: totals.external,     icon: "lucide:globe",           color: "#7c3aed" },
          { label: "Total Participants", value: totals.participants, icon: "lucide:users",          color: "#0ea5e9" },
        ].map(c => (
          <div key={c.label} style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: 42, height: 42, borderRadius: "10px", background: `${c.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <iconify-icon icon={c.icon} style={{ fontSize: "20px", color: c.color }} />
            </div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)", lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: 500, marginTop: "3px" }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Status pills row */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { key: "Upcoming",  icon: "lucide:clock",       value: totals.upcoming,  color: "#2563eb",  bg: "#eff6ff" },
          { key: "Ongoing",   icon: "lucide:radio",       value: totals.ongoing,   color: "#16a34a",  bg: "#f0fdf4" },
          { key: "Completed", icon: "lucide:check-circle",value: totals.completed, color: "#64748b",  bg: "#f8fafc" },
        ].map(s => (
          <button key={s.key} onClick={() => setStatusFilter(statusFilter === s.key ? "all" : s.key)}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px",
              background: statusFilter === s.key ? s.bg : "var(--background)",
              border: `1px solid ${statusFilter === s.key ? s.color + "55" : "var(--border)"}`,
              color: statusFilter === s.key ? s.color : "var(--muted-foreground)",
              fontWeight: statusFilter === s.key ? 700 : 500, fontSize: "13px", cursor: "pointer", transition: "all 0.15s" }}>
            <iconify-icon icon={s.icon} style={{ fontSize: "14px" }} />
            {s.key}
            <span style={{ background: statusFilter === s.key ? s.color : "var(--border)", color: statusFilter === s.key ? "white" : "var(--muted-foreground)",
              fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "999px" }}>{s.value}</span>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px", maxWidth: "320px" }}>
          <iconify-icon icon="lucide:search" style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "var(--muted-foreground)" }} />
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", paddingLeft: "32px", paddingRight: "10px", paddingTop: "8px", paddingBottom: "8px",
              fontSize: "13px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--background)",
              color: "var(--foreground)", outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* Type filter */}
        {["all","Hosted","External"].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            style={{ padding: "8px 14px", borderRadius: "9px", border: "1px solid var(--border)", fontSize: "12px", fontWeight: 600,
              cursor: "pointer", transition: "all 0.15s",
              background: typeFilter === t ? (t === "Hosted" ? "#1e1b4b" : t === "External" ? "#4c1d95" : "var(--foreground)") : "var(--background)",
              color: typeFilter === t ? "white" : "var(--foreground)" }}>
            {t === "all" ? "All Types" : t}
          </button>
        ))}

        {/* Approval filter */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
          {["all","approved","pending","rejected"].map(a => {
            const m = a === "all" ? { color: "#64748b", bg: "var(--muted)" } : APPROVAL_META[a];
            return (
              <button key={a} onClick={() => setApprovalFilter(a)}
                style={{ padding: "7px 12px", borderRadius: "8px", border: `1px solid ${approvalFilter === a ? m.color : "var(--border)"}`,
                  fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize",
                  background: approvalFilter === a ? m.bg : "var(--background)",
                  color: approvalFilter === a ? m.color : "var(--muted-foreground)" }}>
                {a === "all" ? "All" : m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {(search || typeFilter !== "all" || statusFilter !== "all" || approvalFilter !== "all") && (
        <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "14px" }}>
          Showing <b style={{ color: "var(--foreground)" }}>{filtered.length}</b> of {events.length} events
        </div>
      )}

      {/* Events Grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: "60px", textAlign: "center", color: "var(--muted-foreground)", background: "var(--muted)", borderRadius: "14px", fontSize: "14px" }}>
          No events match your filters
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
          {filtered.map(ev => {
            const sm  = STATUS_META[ev.status];
            const tm  = TYPE_META[ev.type];
            const am  = APPROVAL_META[ev.approvalStatus];
            const pct = Math.round((ev.participants / ev.maxSeats) * 100);
            return (
              <div key={ev.id} onClick={() => setSelected(ev)}
                style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px",
                  cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px -8px rgba(0,0,0,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Top badges */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 9px", borderRadius: "999px",
                    background: tm.bg, color: tm.color, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <iconify-icon icon={tm.icon} style={{ fontSize: "10px" }} />{ev.type}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 9px", borderRadius: "999px",
                    background: "#f1f5f9", color: "#475569" }}>{ev.category}</span>
                  <span style={{ marginLeft: "auto" }}><ApprovalBadge status={ev.approvalStatus} /></span>
                </div>

                {/* Title */}
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "6px", lineHeight: 1.4 }}>{ev.title}</div>
                <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "14px", display: "flex", gap: "12px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <iconify-icon icon="lucide:calendar" style={{ fontSize: "12px" }} />{ev.date}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <iconify-icon icon="lucide:user" style={{ fontSize: "12px" }} />{ev.organizer}
                  </span>
                </div>

                {/* Participation bar */}
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                    <span>{ev.participants} participants</span>
                    <span>{pct}%</span>
                  </div>
                  <div style={{ height: "5px", background: "var(--muted)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "#22c55e" : "#6366f1", borderRadius: "999px" }} />
                  </div>
                </div>

                {/* Sparkline */}
                <Sparkline data={ev.engagementTrend} color="#6366f1" />

                {/* Bottom row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
                    background: sm.bg, color: sm.color, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sm.dot }} />{ev.status}
                  </span>
                  {ev.winners.length > 0 && (
                    <span style={{ fontSize: "11px", color: "#d97706", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                      <iconify-icon icon="lucide:trophy" style={{ fontSize: "12px" }} />{ev.winners.length} winner{ev.winners.length > 1 ? "s" : ""}
                    </span>
                  )}
                  <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 500, display: "flex", alignItems: "center", gap: "3px" }}>
                    View<iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer */}
      {selected && (
        <EventDrawer
          event={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
