import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
} from "recharts";

import {
  stats,
  departmentWins,
  skillDistribution,
  monthlyGrowth,
  recentActivities,
  PIE_COLORS,
} from "./teacherData";

/* ── Tooltip ────────────────────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        padding: "9px 13px",
        fontSize: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        color: "var(--foreground)",
      }}
    >
      {label && <p style={{ fontWeight: 600, marginBottom: 3 }}>{label}</p>}
      {payload.map((e, i) => (
        <p key={i} style={{ color: e.color ?? "#6366f1", fontWeight: 500 }}>
          {e.name}: {e.value}
        </p>
      ))}
    </div>
  );
};

/* ── KPI Card ───────────────────────────────────────────────────────── */
const StatCard = ({ title, value, growth, growthLabel, positive, icon, colorClass, bgClass }) => (
  <div
    style={{
      background: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      padding: "20px 22px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)")}
    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)")}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
      <div
        className={`${bgClass} rounded-lg`}
        style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
      >
        <iconify-icon icon={icon} className={colorClass} style={{ fontSize: "15px" }} />
      </div>
      <span style={{ fontSize: "13px", color: "var(--muted-foreground)", fontWeight: 500 }}>{title}</span>
    </div>
    <p style={{ fontSize: "30px", fontWeight: 700, color: "var(--foreground)", lineHeight: 1, marginBottom: "8px" }}>
      {value}
    </p>
    <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
      {growth && (
        <span style={{ fontWeight: 600, color: "#6366f1", marginRight: "4px" }}>
          {growth}
        </span>
      )}
      {growthLabel}
    </p>
  </div>
);

/* ── Card Shell ─────────────────────────────────────────────────────── */
const Card = ({ title, action, children }) => (
  <div
    style={{
      background: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      padding: "22px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
      <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{title}</p>
      {action}
    </div>
    {children}
  </div>
);

/* ── Pie center label ───────────────────────────────────────────────── */
const PieCenter = ({ viewBox }) => {
  const { cx, cy } = viewBox ?? {};
  return (
    <>
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: "22px", fontWeight: 700, fill: "#1e293b" }}
      >
        {skillDistribution.length}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: "11px", fill: "#94a3b8" }}
      >
        Categories
      </text>
    </>
  );
};

/* ── Activity badge ─────────────────────────────────────────────────── */
const Badge = ({ action, actionType }) => {
  const win = actionType === "win";
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 600,
        padding: "3px 11px",
        borderRadius: "999px",
        background: win ? "#d1fae5" : "#f1f5f9",
        color: win ? "#059669" : "#64748b",
        border: win ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
        whiteSpace: "nowrap",
      }}
    >
      {action}
    </span>
  );
};

/* ── Initials Avatar ────────────────────────────────────────────────── */
const AVATAR_COLORS = [
  ["#dbeafe", "#3b82f6"],
  ["#fce7f3", "#ec4899"],
  ["#d1fae5", "#059669"],
  ["#fef3c7", "#d97706"],
  ["#ede9fe", "#7c3aed"],
  ["#fee2e2", "#dc2626"],
];
const Avatar = ({ initials, index }) => {
  const [bg, fg] = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div
      style={{
        width: 36, height: 36, borderRadius: "50%",
        background: bg, color: fg, fontWeight: 700,
        fontSize: "12px", display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

/* ── Main Page ─────────────────────────────────────────────────────── */
export default function TeacherDashboard() {
  return (
    <div style={{ padding: "24px 28px", maxWidth: "1400px", margin: "0 auto" }}>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {stats.map((s) => <StatCard key={s.id} {...s} />)}
      </div>

      {/* ── ROW 1: Bar + Pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">

        {/* Bar Chart */}
        <div className="lg:col-span-3">
          <Card
            title="Department vs Wins"
            action={
              <button style={{ border: "none", background: "none", cursor: "pointer", color: "var(--muted-foreground)", fontSize: "20px", lineHeight: 1, padding: "0 4px", letterSpacing: "1px" }}>
                ···
              </button>
            }
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={departmentWins} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
                <Bar dataKey="wins" name="Wins" maxBarSize={44} radius={[5, 5, 0, 0]}>
                  {departmentWins.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#4f46e5" : "#c7d2fe"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Pie Chart — donut with center label */}
        <div className="lg:col-span-2">
          <Card title="Skill Distribution">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={skillDistribution}
                  dataKey="value"
                  nameKey="skill"
                  cx="50%"
                  cy="44%"
                  outerRadius={90}
                  innerRadius={56}
                  paddingAngle={2}
                  labelLine={false}
                >
                  {skillDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                  <PieCenter />
                </Pie>
                <Tooltip
                  formatter={(v, n) => [`${v}%`, n]}
                  contentStyle={{ borderRadius: "10px", border: "1px solid var(--border)", fontSize: "12px", background: "var(--background)" }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* ── ROW 2: Area Chart + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Area Chart */}
        <div className="lg:col-span-3">
          <Card title="Monthly Participation Growth">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyGrowth} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="participation"
                  name="Participation"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={{ r: 4, fill: "#fff", stroke: "#6366f1", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#6366f1" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card
            title="Recent Activity"
            action={
              <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: 600, cursor: "pointer" }}>
                View All
              </span>
            }
          >
            <div>
              {recentActivities.map(({ id, student, initials, event, action, actionType }, i) => (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    padding: "10px 0",
                    borderBottom: i < recentActivities.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <Avatar initials={initials} index={i} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {student}
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--muted-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {event}
                      </p>
                    </div>
                  </div>
                  <Badge action={action} actionType={actionType} />
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}