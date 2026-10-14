import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  heatmapData,
  PRIORITY_META,
  recommendations,
  RISK_META,
  SKILL_COLUMNS,
  SKILL_LABELS,
  summaryInsights,
  weakSkillData,
  yearlyComparisonData,
} from "./teacherData";

/* ─── Heatmap cell colour based on 0-100 score ─── */
function heatCell(value) {
  if (value >= 81) return { bg: "#4f46e5", text: "#fff" };
  if (value >= 66) return { bg: "#a5b4fc", text: "#1e1b4b" };
  if (value >= 51) return { bg: "#fde68a", text: "#92400e" };
  return { bg: "#fca5a5", text: "#7f1d1d" };
}

/* ─── Small KPI card ─── */
function InsightCard({ icon, label, value, sub, accent }) {
  return (
    <div
      className="rounded-xl border p-4 flex items-center gap-4"
      style={{ background: "var(--background)", borderColor: "var(--border)" }}
    >
      <span
        className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xl"
        style={{ background: accent + "22", color: accent }}
      >
        <iconify-icon icon={icon} width="22" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: "var(--muted-foreground)" }}>
          {label}
        </p>
        <p className="text-lg font-bold leading-tight" style={{ color: "var(--foreground)" }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Section wrapper ─── */
function Section({ title, subtitle, children, action }) {
  return (
    <div
      className="rounded-xl border"
      style={{ background: "var(--background)", borderColor: "var(--border)" }}
    >
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ─── Custom tooltip for Recharts ─── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border shadow-lg px-3 py-2 text-xs"
      style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
    >
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main page
────────────────────────────────────────────── */
export default function SkillIntelligence() {
  const [activeFilter, setActiveFilter] = useState("All");

  /* unique departments from weakSkillData for filter */
  const deptOptions = useMemo(
    () => ["All", ...Array.from(new Set(weakSkillData.map((r) => r.department)))],
    []
  );

  const filteredWeak = useMemo(
    () =>
      activeFilter === "All"
        ? weakSkillData
        : weakSkillData.filter((r) => r.department === activeFilter),
    [activeFilter]
  );

  /* summary KPI cards derived from summaryInsights */
  const kpiCards = [
    {
      icon: "lucide:trending-up",
      label: "Strongest Skill",
      value: summaryInsights.strongestSkill,
      sub: "Highest avg across departments",
      accent: "#22c55e",
    },
    {
      icon: "lucide:trending-down",
      label: "Weakest Skill",
      value: summaryInsights.weakestSkill,
      sub: "Needs focused intervention",
      accent: "#ef4444",
    },
    {
      icon: "lucide:building-2",
      label: "Most Improved Dept",
      value: summaryInsights.mostImprovedDepartment,
      sub: "Highest growth YoY",
      accent: "#6366f1",
    },
    {
      icon: "lucide:activity",
      label: "Engagement Score",
      value: `${summaryInsights.engagementScore}%`,
      sub: "Average platform engagement",
      accent: "#f59e0b",
    },
  ];

  return (
    <div className="p-5 md:p-7 space-y-6" style={{ color: "var(--foreground)" }}>
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Skill Intelligence Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Department-wise skill performance, trends and AI recommendations
          </p>
        </div>
        <span
          className="text-xs font-medium px-3 py-1.5 rounded-full border"
          style={{
            background: "#eff6ff",
            color: "#3b82f6",
            borderColor: "#bfdbfe",
          }}
        >
          <iconify-icon icon="lucide:refresh-cw" className="mr-1" width="13" />
          Updated: Feb 2026
        </span>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((c) => (
          <InsightCard key={c.label} {...c} />
        ))}
      </div>

      {/* ── Heatmap + Yearly Comparison (side by side on xl) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Skill Heatmap */}
        <Section
          title="Skill Performance Heatmap"
          subtitle="Score (0–100) per department and skill area"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th
                    className="text-left py-2 pr-4 font-semibold text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    DEPARTMENT
                  </th>
                  {SKILL_COLUMNS.map((sk) => (
                    <th
                      key={sk}
                      className="text-center py-2 px-3 font-semibold text-xs"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {SKILL_LABELS[sk]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {heatmapData.map((row) => (
                  <tr key={row.department}>
                    <td
                      className="py-3 pr-4 font-semibold text-sm"
                      style={{ color: "var(--foreground)" }}
                    >
                      {row.department}
                    </td>
                    {SKILL_COLUMNS.map((sk) => {
                      const { bg, text } = heatCell(row[sk]);
                      return (
                        <td key={sk} className="py-3 px-3 text-center">
                          <span
                            className="inline-flex items-center justify-center w-12 h-8 rounded-md text-xs font-bold"
                            style={{ background: bg, color: text }}
                          >
                            {row[sk]}%
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            {[
              { bg: "#4f46e5", text: "#fff",     label: "Excellent (81–100)" },
              { bg: "#a5b4fc", text: "#1e1b4b",  label: "Good (66–80)" },
              { bg: "#fde68a", text: "#92400e",  label: "Average (51–65)" },
              { bg: "#fca5a5", text: "#7f1d1d",  label: "Poor (≤50)" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                <span
                  className="w-4 h-4 rounded"
                  style={{ background: l.bg, border: `1px solid ${l.bg}` }}
                />
                {l.label}
              </span>
            ))}
          </div>
        </Section>

        {/* Yearly Comparison Chart */}
        <Section
          title="Year-over-Year Participation"
          subtitle="Monthly student participation — current vs previous year"
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={yearlyComparisonData}
              margin={{ top: 4, right: 16, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                formatter={(val) =>
                  val === "currentYear" ? "Current Year" : "Previous Year"
                }
              />
              <Line
                type="monotone"
                dataKey="currentYear"
                name="currentYear"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#4f46e5", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="previousYear"
                name="previousYear"
                stroke="#a5b4fc"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ r: 3, fill: "#a5b4fc", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* ── Weak Skill Panel + Recommendations (side by side on xl) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Weak Skills */}
        <Section
          title="Weak Skill Alerts"
          subtitle="Departments with below-threshold skill performance"
          action={
            <div className="flex items-center gap-2">
              {deptOptions.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveFilter(d)}
                  className="text-xs px-2.5 py-1 rounded-full border font-medium transition-colors"
                  style={
                    activeFilter === d
                      ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" }
                      : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }
                  }
                >
                  {d}
                </button>
              ))}
            </div>
          }
        >
          <div className="space-y-3">
            {filteredWeak.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "var(--muted-foreground)" }}>
                No weak skills for this department.
              </p>
            ) : (
              filteredWeak.map((row) => {
                const rm = RISK_META[row.risk];
                return (
                  <div
                    key={`${row.department}-${row.skill}`}
                    className="flex items-center justify-between rounded-lg border px-4 py-3 gap-3"
                    style={{ borderColor: rm.border, background: rm.bg }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                        {row.skill}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        {row.department} · {row.students} students affected
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {/* progress bar */}
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${row.performance}%`,
                              background: rm.color,
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold w-8" style={{ color: rm.color }}>
                          {row.performance}%
                        </span>
                      </div>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: rm.bg, color: rm.color, border: `1px solid ${rm.border}` }}
                      >
                        {row.risk}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Section>

        {/* Recommendations */}
        <Section
          title="AI Recommendations"
          subtitle="Suggested actions based on skill gap analysis"
        >
          <div className="space-y-3">
            {recommendations.map((rec) => {
              const pm = PRIORITY_META[rec.priority];
              return (
                <div
                  key={rec.id}
                  className="flex items-start gap-3 rounded-lg border p-4"
                  style={{ borderColor: "var(--border)", background: "var(--background)" }}
                >
                  <span
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: pm.bg, color: pm.color }}
                  >
                    <iconify-icon icon={rec.icon} width="18" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {rec.title}
                      </p>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: pm.bg, color: pm.color }}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                      {rec.reason}
                    </p>
                    <p className="text-xs mt-1 font-medium" style={{ color: "var(--primary)" }}>
                      <iconify-icon icon="lucide:building-2" width="11" className="mr-1" />
                      {rec.dept}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
}
