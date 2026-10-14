import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";

/* ── Static data ───────────────────────────────────────────────────── */

const collegeBarData = [
  { college: "IIT Madras", score: 94 },
  { college: "BITS Pilani", score: 91 },
  { college: "NIT Trichy", score: 87 },
  { college: "IIT Delhi", score: 85 },
  { college: "VIT Vellore", score: 79 },
];

const skillPieData = [
  { name: "Full Stack", value: 32 },
  { name: "AI / ML", value: 28 },
  { name: "DevOps & Cloud", value: 18 },
  { name: "Data Science", value: 14 },
  { name: "UI / UX", value: 8 },
];
const PIE_COLORS = ["#2b4ed6", "#4f6ef7", "#7c9aff", "#b3c5fd", "#dde4ff"];

const trendData6M = [
  { month: "Sep", participants: 820 },
  { month: "Oct", participants: 1040 },
  { month: "Nov", participants: 960 },
  { month: "Dec", participants: 1180 },
  { month: "Jan", participants: 1540 },
  { month: "Feb", participants: 1820 },
];

const trendData1Y = [
  { month: "Mar '25", participants: 540 },
  { month: "Apr",     participants: 680 },
  { month: "May",     participants: 710 },
  { month: "Jun",     participants: 590 },
  { month: "Jul",     participants: 480 },
  { month: "Aug",     participants: 650 },
  { month: "Sep",     participants: 820 },
  { month: "Oct",     participants: 1040 },
  { month: "Nov",     participants: 960 },
  { month: "Dec",     participants: 1180 },
  { month: "Jan '26", participants: 1540 },
  { month: "Feb",     participants: 1820 },
];

const trendDataAll = [
  { month: "Mar '24", participants: 210 },
  { month: "Jun",     participants: 340 },
  { month: "Sep",     participants: 490 },
  { month: "Dec",     participants: 560 },
  { month: "Mar '25", participants: 540 },
  { month: "Jun",     participants: 710 },
  { month: "Sep",     participants: 820 },
  { month: "Dec",     participants: 1180 },
  { month: "Feb '26", participants: 1820 },
];

const TREND_RANGES = { "6M": trendData6M, "1Y": trendData1Y, "All": trendDataAll };

const recentActivityData = [
  { icon: "lucide:user-check", color: "#2b4ed6", bg: "#eef2ff", title: "Arjun Mehta shortlisted", sub: "SDE Intern · IIT Madras", time: "2h ago" },
  { icon: "lucide:calendar-check-2", color: "#16a34a", bg: "#dcfce7", title: "Campus drive confirmed", sub: "BITS Pilani · Mar 12, 2026", time: "5h ago" },
  { icon: "lucide:zap", color: "#d97706", bg: "#fef3c7", title: "18 new auto-matches", sub: "ML Engineer · Full Stack Dev", time: "8h ago" },
  { icon: "lucide:file-plus-2", color: "#7c3aed", bg: "#f5f3ff", title: "Job posting published", sub: "Product Manager Intern", time: "1d ago" },
  { icon: "lucide:badge-check", color: "#0891b2", bg: "#e0f2fe", title: "Offer accepted", sub: "Sneha Gupta · UI/UX Designer", time: "2d ago" },
];

const upcomingDrivesData = [
  { college: "IIT Bombay", date: "Mar 5, 2026", roles: 3, status: "Confirmed" },
  { college: "BITS Pilani", date: "Mar 12, 2026", roles: 2, status: "Pending" },
  { college: "NIT Warangal", date: "Mar 20, 2026", roles: 4, status: "Confirmed" },
];

const topCandidatesData = [
  { initials: "AM", name: "Arjun Mehta", college: "IIT Madras", match: 94 },
  { initials: "VS", name: "Vikram Singh", college: "IIT Delhi", match: 93 },
  { initials: "PS", name: "Priya Sharma", college: "BITS Pilani", match: 91 },
  { initials: "MI", name: "Meera Iyer", college: "NIT Warangal", match: 89 },
];

/* ── Style tokens (mirror student Dashboard) ───────────────────────── */

const card = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "20px",
};

const cardHeaderRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const cardTitle = {
  fontSize: "14px",
  fontWeight: 600,
  margin: 0,
  color: "var(--foreground)",
};

/* ── Custom tooltip ────────────────────────────────────────────────── */

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 12px", fontSize: "12px", color: "var(--foreground)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {label && <div style={{ fontWeight: 600, marginBottom: "4px" }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
};

const PERIOD_OPTIONS = ["This Month", "Last 3 Months", "Last 6 Months", "This Year"];
const COLLEGE_OPTIONS = ["All Colleges", "IIT Campuses", "NIT Campuses", "BITS Campuses", "Deemed Universities"];
const ROLE_OPTIONS = ["All Roles", "SDE Intern", "Data Analyst", "ML Engineer", "Product Manager", "UI / UX Designer"];

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [trendRange, setTrendRange] = useState("6M");
  const [period, setPeriod] = useState("This Month");
  const [college, setCollege] = useState("All Colleges");
  const [role, setRole] = useState("All Roles");
  const [appliedFilters, setAppliedFilters] = useState({ period: "This Month", college: "All Colleges", role: "All Roles" });
  const filterRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [filterOpen]);

  const activeCount = [
    appliedFilters.period !== "This Month",
    appliedFilters.college !== "All Colleges",
    appliedFilters.role !== "All Roles",
  ].filter(Boolean).length;

  const kpis = [
    { label: "Verified Students", value: "48,320", delta: "+2,140 this month", deltaColor: "#16a34a", icon: "lucide:users", iconColor: "#2b4ed6", iconBg: "#eef2ff" },
    { label: "Active Colleges", value: "134", delta: "+6 new onboarded", deltaColor: "#16a34a", icon: "lucide:building-2", iconColor: "#0891b2", iconBg: "#e0f2fe" },
    { label: "Hackathon Wins", value: "9,480", delta: "+380 this semester", deltaColor: "#16a34a", icon: "lucide:trophy", iconColor: "#d97706", iconBg: "#fef3c7" },
    { label: "Avg Coding Rating", value: "7.4 / 10", delta: "↑ 0.3 from last quarter", deltaColor: "#16a34a", icon: "lucide:code-2", iconColor: "#7c3aed", iconBg: "#f5f3ff" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 4px 0", color: "var(--foreground)" }}>
            Recruiter Dashboard
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: 0 }}>
            Overview of campus hiring activity · Feb 2026
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", position: "relative" }} ref={filterRef}>
          <button
            onClick={() => setFilterOpen((o) => !o)}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: filterOpen ? "var(--secondary)" : "var(--card)", border: `1px solid ${filterOpen ? "#2b4ed6" : "var(--border)"}`, borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer", color: filterOpen ? "#2b4ed6" : "var(--foreground)", position: "relative" }}
          >
            <iconify-icon icon="lucide:sliders-horizontal" style={{ fontSize: "14px" }}></iconify-icon>
            Filter
            {activeCount > 0 && (
              <span style={{ position: "absolute", top: "-6px", right: "-6px", width: "16px", height: "16px", borderRadius: "50%", background: "#2b4ed6", color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {activeCount}
              </span>
            )}
          </button>

          {/* Filter dropdown */}
          {filterOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "280px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, padding: "16px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "14px" }}>Filter Dashboard</div>

              {/* Period */}
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>Time Period</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {PERIOD_OPTIONS.map((p) => (
                    <button key={p} onClick={() => setPeriod(p)} style={{ padding: "4px 10px", borderRadius: "4px", border: `1px solid ${period === p ? "#2b4ed6" : "var(--border)"}`, background: period === p ? "#eef2ff" : "transparent", color: period === p ? "#2b4ed6" : "var(--muted-foreground)", fontSize: "12px", fontWeight: period === p ? 600 : 400, cursor: "pointer" }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* College */}
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>College Type</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {COLLEGE_OPTIONS.map((c) => (
                    <button key={c} onClick={() => setCollege(c)} style={{ padding: "4px 10px", borderRadius: "4px", border: `1px solid ${college === c ? "#2b4ed6" : "var(--border)"}`, background: college === c ? "#eef2ff" : "transparent", color: college === c ? "#2b4ed6" : "var(--muted-foreground)", fontSize: "12px", fontWeight: college === c ? 600 : 400, cursor: "pointer" }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>Role</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {ROLE_OPTIONS.map((r) => (
                    <button key={r} onClick={() => setRole(r)} style={{ padding: "4px 10px", borderRadius: "4px", border: `1px solid ${role === r ? "#2b4ed6" : "var(--border)"}`, background: role === r ? "#eef2ff" : "transparent", color: role === r ? "#2b4ed6" : "var(--muted-foreground)", fontSize: "12px", fontWeight: role === r ? 600 : 400, cursor: "pointer" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                <button
                  onClick={() => { setPeriod("This Month"); setCollege("All Colleges"); setRole("All Roles"); setAppliedFilters({ period: "This Month", college: "All Colleges", role: "All Roles" }); setFilterOpen(false); }}
                  style={{ flex: 1, padding: "7px", background: "var(--secondary)", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 500, cursor: "pointer", color: "var(--foreground)" }}
                >
                  Reset
                </button>
                <button
                  onClick={() => { setAppliedFilters({ period, college, role }); setFilterOpen(false); }}
                  style={{ flex: 1, padding: "7px", background: "#2b4ed6", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#fff" }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Active filter chips ─────────────────────────────────────── */}
      {activeCount > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", color: "var(--muted-foreground)", fontWeight: 500 }}>Active filters:</span>
          {appliedFilters.period !== "This Month" && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 8px", background: "#eef2ff", color: "#2b4ed6", border: "1px solid #c7d3fb", borderRadius: "4px", fontSize: "12px", fontWeight: 500 }}>
              {appliedFilters.period}
              <iconify-icon icon="lucide:x" style={{ fontSize: "11px", cursor: "pointer" }} onClick={() => { setAppliedFilters((f) => ({ ...f, period: "This Month" })); setPeriod("This Month"); }}></iconify-icon>
            </span>
          )}
          {appliedFilters.college !== "All Colleges" && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 8px", background: "#eef2ff", color: "#2b4ed6", border: "1px solid #c7d3fb", borderRadius: "4px", fontSize: "12px", fontWeight: 500 }}>
              {appliedFilters.college}
              <iconify-icon icon="lucide:x" style={{ fontSize: "11px", cursor: "pointer" }} onClick={() => { setAppliedFilters((f) => ({ ...f, college: "All Colleges" })); setCollege("All Colleges"); }}></iconify-icon>
            </span>
          )}
          {appliedFilters.role !== "All Roles" && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 8px", background: "#eef2ff", color: "#2b4ed6", border: "1px solid #c7d3fb", borderRadius: "4px", fontSize: "12px", fontWeight: 500 }}>
              {appliedFilters.role}
              <iconify-icon icon="lucide:x" style={{ fontSize: "11px", cursor: "pointer" }} onClick={() => { setAppliedFilters((f) => ({ ...f, role: "All Roles" })); setRole("All Roles"); }}></iconify-icon>
            </span>
          )}
          <button onClick={() => { setPeriod("This Month"); setCollege("All Colleges"); setRole("All Roles"); setAppliedFilters({ period: "This Month", college: "All Colleges", role: "All Roles" }); }} style={{ fontSize: "11px", color: "var(--muted-foreground)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>
            Clear all
          </button>
        </div>
      )}

      {/* ── KPI Row ──────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--muted-foreground)" }}>{kpi.label}</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: kpi.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <iconify-icon icon={kpi.icon} style={{ fontSize: "16px", color: kpi.iconColor }}></iconify-icon>
              </div>
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)", marginBottom: "6px", letterSpacing: "-0.5px" }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: "11px", color: kpi.deltaColor, fontWeight: 500 }}>{kpi.delta}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ───────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "16px", marginBottom: "16px" }}>

        {/* Bar chart */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>Top Colleges by Recruitment Suitability</h3>
            <span style={{ fontSize: "11px", color: "var(--muted-foreground)", fontWeight: 500 }}>Score / 100</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={collegeBarData} barSize={28} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="college" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="score" name="Score" fill="#2b4ed6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>Skill Distribution</h3>
            <span style={{ fontSize: "11px", color: "var(--muted-foreground)", fontWeight: 500 }}>Across candidates</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={skillPieData} cx="50%" cy="44%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                {skillPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: "11px", color: "var(--muted-foreground)", paddingTop: "4px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Line Chart ───────────────────────────────────────────────── */}
      <div style={{ ...card, marginBottom: "16px" }}>
        <div style={cardHeaderRow}>
          <h3 style={cardTitle}>Monthly Student Participation Trend</h3>
          <div style={{ display: "flex", gap: "6px" }}>
            {["6M", "1Y", "All"].map((r) => (
              <button key={r} onClick={() => setTrendRange(r)} style={{ padding: "3px 10px", borderRadius: "4px", border: "1px solid var(--border)", background: trendRange === r ? "#2b4ed6" : "transparent", color: trendRange === r ? "#fff" : "var(--muted-foreground)", fontSize: "11px", fontWeight: 500, cursor: "pointer" }}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={TREND_RANGES[trendRange]} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="participants" name="Participants" stroke="#2b4ed6" strokeWidth={2} dot={{ r: 3, fill: "#2b4ed6", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#2b4ed6" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bottom 3-column Row ──────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>

        {/* Top AI Matches */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>Top AI Matches</h3>
            <button onClick={() => navigate("/recruiter/auto-matched")} style={{ fontSize: "12px", color: "#2b4ed6", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>View all</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {topCandidatesData.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", borderBottom: i < topCandidatesData.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#2b4ed6", flexShrink: 0 }}>
                  {c.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{c.college}</div>
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "2px 7px", borderRadius: "4px", flexShrink: 0 }}>
                  {c.match}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>Recent Activity</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentActivityData.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <iconify-icon icon={a.icon} style={{ fontSize: "13px", color: a.color }}></iconify-icon>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--foreground)", marginBottom: "1px" }}>{a.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{a.sub}</div>
                </div>
                <span style={{ fontSize: "10px", color: "var(--muted-foreground)", whiteSpace: "nowrap", flexShrink: 0 }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Drives */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>Upcoming Drives</h3>
            <button onClick={() => navigate("/recruiter/hiring-planner")} style={{ fontSize: "12px", color: "#2b4ed6", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>Planner</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {upcomingDrivesData.map((d, i) => (
              <div key={i} style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--muted)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>{d.college}</span>
                  <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "4px", background: d.status === "Confirmed" ? "#dcfce7" : "#fef3c7", color: d.status === "Confirmed" ? "#15803d" : "#b45309" }}>
                    {d.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "var(--muted-foreground)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <iconify-icon icon="lucide:calendar" style={{ fontSize: "11px" }}></iconify-icon>{d.date}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <iconify-icon icon="lucide:briefcase" style={{ fontSize: "11px" }}></iconify-icon>{d.roles} role{d.roles > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            ))}
            <button onClick={() => navigate("/recruiter/hiring-planner")} style={{ width: "100%", padding: "8px", background: "var(--secondary)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px", fontWeight: 500, cursor: "pointer", color: "var(--foreground)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }}></iconify-icon>
              Schedule New Drive
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
