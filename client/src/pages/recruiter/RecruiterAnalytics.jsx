import { useState } from "react";

/* ─── Data ───────────────────────────────────────────────────────────── */
const KPI = [
  { label: "Screening Time Saved",  value: "312 hrs", sub: "vs manual review",  icon: "lucide:clock",        color: "#1d4ed8" },
  { label: "Conversion Rate",       value: "1.68%",   sub: "applications → hired", icon: "lucide:trending-up", color: "#059669" },
  { label: "College Success Rate",  value: "64%",     sub: "colleges with ≥1 hire", icon: "lucide:building-2",  color: "#7c3aed" },
  { label: "Hiring Accuracy",       value: "91%",     sub: "offers accepted",    icon: "lucide:target",       color: "#b45309" },
  { label: "Avg Skill Gap",         value: "18%",     sub: "required vs assessed", icon: "lucide:bar-chart-2", color: "#dc2626" },
];

const FUNNEL = [
  { stage: "Applications",  count: 1847 },
  { stage: "Screened",      count: 940  },
  { stage: "Shortlisted",   count: 237  },
  { stage: "Interviewed",   count: 94   },
  { stage: "Offers Made",   count: 42   },
  { stage: "Hired",         count: 31   },
];

const MONTHLY = [
  { month: "Sep", apps: 140, hires: 2 },
  { month: "Oct", apps: 180, hires: 4 },
  { month: "Nov", apps: 240, hires: 6 },
  { month: "Dec", apps: 190, hires: 3 },
  { month: "Jan", apps: 320, hires: 8 },
  { month: "Feb", apps: 410, hires: 10 },
];

const COLLEGES = [
  { name: "IIT Bombay",      hires: 8,  applications: 180 },
  { name: "BITS Pilani",     hires: 6,  applications: 140 },
  { name: "IIT Madras",      hires: 5,  applications: 120 },
  { name: "NIT Trichy",      hires: 5,  applications: 110 },
  { name: "VIT Vellore",     hires: 4,  applications: 200 },
  { name: "IIIT Hyderabad",  hires: 3,  applications: 95  },
];

const SKILL_GAPS = [
  { skill: "System Design", required: 80, assessed: 55, gap: 25 },
  { skill: "DevOps / Cloud", required: 75, assessed: 52, gap: 23 },
  { skill: "ML / AI",        required: 70, assessed: 50, gap: 20 },
  { skill: "GraphQL",        required: 60, assessed: 44, gap: 16 },
  { skill: "Microservices",  required: 72, assessed: 60, gap: 12 },
  { skill: "React",          required: 85, assessed: 78, gap: 7  },
];

/* ─── Tiny components ─────────────────────────────────────────────────── */
function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 3px 0" }}>{children}</h2>
      {sub && <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{sub}</p>}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "22px 24px",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Hiring Funnel ───────────────────────────────────────────────────── */
function HiringFunnel() {
  const max = FUNNEL[0].count;
  const stageColors = ["#1d4ed8", "#3b82f6", "#60a5fa", "#f59e0b", "#10b981", "#059669"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {FUNNEL.map((f, i) => {
        const pct = (f.count / max) * 100;
        const rate = i === 0 ? 100 : ((f.count / FUNNEL[i - 1].count) * 100).toFixed(0);
        return (
          <div key={f.stage}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151", width: "110px", flexShrink: 0 }}>{f.stage}</span>
              <div style={{ flex: 1, margin: "0 10px", height: "22px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: stageColors[i],
                  borderRadius: "4px",
                  transition: "width .5s",
                  opacity: 0.85,
                }} />
                <span style={{
                  position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)",
                  fontSize: "11px", fontWeight: 700, color: pct > 20 ? "#fff" : "#374151",
                }}>{f.count.toLocaleString()}</span>
              </div>
              <span style={{ fontSize: "11px", color: "#9ca3af", width: "42px", textAlign: "right", flexShrink: 0 }}>
                {i === 0 ? "100%" : `${rate}%`}
              </span>
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: "8px", padding: "10px 12px", background: "#f9fafb", borderRadius: "8px", display: "flex", gap: "24px" }}>
        <div><span style={{ fontSize: "11px", color: "#6b7280" }}>Overall conversion </span><strong style={{ fontSize: "13px", color: "#059669" }}>1.68%</strong></div>
        <div><span style={{ fontSize: "11px", color: "#6b7280" }}>Drop-off (Screen→Short) </span><strong style={{ fontSize: "13px", color: "#dc2626" }}>74.8%</strong></div>
      </div>
    </div>
  );
}

/* ─── Monthly Line Chart (SVG) ────────────────────────────────────────── */
function MonthlyLineChart() {
  const W = 480, H = 160, PAD = { top: 14, right: 20, bottom: 28, left: 38 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxApps  = Math.max(...MONTHLY.map((m) => m.apps));
  const maxHires = Math.max(...MONTHLY.map((m) => m.hires));
  const n = MONTHLY.length;

  const xPos = (i) => PAD.left + (i / (n - 1)) * innerW;
  const yApps  = (v) => PAD.top + innerH - (v / maxApps)  * innerH;
  const yHires = (v) => PAD.top + innerH - (v / maxHires) * innerH;

  const appsLine  = MONTHLY.map((m, i) => `${xPos(i)},${yApps(m.apps)}`).join(" ");
  const hiresLine = MONTHLY.map((m, i) => `${xPos(i)},${yHires(m.hires)}`).join(" ");

  const yGridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {/* Grid */}
      {yGridLines.map((t) => (
        <line key={t}
          x1={PAD.left} x2={W - PAD.right}
          y1={PAD.top + innerH * (1 - t)} y2={PAD.top + innerH * (1 - t)}
          stroke="#f3f4f6" strokeWidth="1"
        />
      ))}
      {/* Y axis */}
      <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + innerH} stroke="#e5e7eb" strokeWidth="1" />
      {/* X axis */}
      <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + innerH} y2={PAD.top + innerH} stroke="#e5e7eb" strokeWidth="1" />

      {/* Y labels */}
      {[0, Math.round(maxApps * 0.5), maxApps].map((v) => (
        <text key={v} x={PAD.left - 6} y={yApps(v) + 4} fontSize="9" fill="#9ca3af" textAnchor="end">{v}</text>
      ))}

      {/* Applications line */}
      <polyline points={appsLine} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Hires line */}
      <polyline points={hiresLine} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeDasharray="5,3" />

      {/* Dots — Applications */}
      {MONTHLY.map((m, i) => (
        <circle key={`a${i}`} cx={xPos(i)} cy={yApps(m.apps)} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
      ))}
      {/* Dots — Hires */}
      {MONTHLY.map((m, i) => (
        <circle key={`h${i}`} cx={xPos(i)} cy={yHires(m.hires)} r="4" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
      ))}

      {/* X labels */}
      {MONTHLY.map((m, i) => (
        <text key={m.month} x={xPos(i)} y={H - 4} fontSize="10" fill="#6b7280" textAnchor="middle">{m.month}</text>
      ))}
    </svg>
  );
}

/* ─── College Success Bar Chart ───────────────────────────────────────── */
function CollegeChart() {
  const maxRate = 10; // max hires for scale
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {COLLEGES.map((c, i) => {
        const successRate = ((c.hires / c.applications) * 100).toFixed(1);
        const barPct = (c.hires / maxRate) * 100;
        const rankColors = ["#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];
        return (
          <div key={c.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", width: "18px" }}>#{i + 1}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{c.name}</span>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>{c.applications} apps</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: rankColors[i] }}>{c.hires} hired</span>
                <span style={{ fontSize: "10px", color: "#10b981", fontWeight: 600, background: "#f0fdf4", padding: "1px 6px", borderRadius: "99px", border: "1px solid #bbf7d0" }}>{successRate}%</span>
              </div>
            </div>
            <div style={{ height: "8px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${barPct}%`, background: rankColors[i], borderRadius: "4px", transition: "width .4s" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Skill Gap Table ─────────────────────────────────────────────────── */
function SkillGapTable() {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
          {["Skill", "Required", "Assessed", "Gap", "Severity"].map((h) => (
            <th key={h} style={{ padding: "6px 10px 10px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#6b7280", whiteSpace: "nowrap" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SKILL_GAPS.map((s, i) => {
          const severity = s.gap > 20 ? { label: "High",   bg: "#fef2f2", color: "#dc2626", dot: "#dc2626" }
                         : s.gap > 12 ? { label: "Medium", bg: "#fffbeb", color: "#b45309", dot: "#f59e0b" }
                         : { label: "Low",    bg: "#f0fdf4", color: "#059669", dot: "#10b981" };
          return (
            <tr key={s.skill} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ padding: "9px 10px", fontWeight: 600, color: "#111827" }}>{s.skill}</td>
              <td style={{ padding: "9px 10px", color: "#374151" }}>{s.required}%</td>
              <td style={{ padding: "9px 10px", color: "#374151" }}>{s.assessed}%</td>
              <td style={{ padding: "9px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontWeight: 700, color: s.gap > 15 ? "#dc2626" : "#374151" }}>-{s.gap}%</span>
                  <div style={{ flex: 1, height: "5px", background: "#f3f4f6", borderRadius: "99px", minWidth: "60px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.gap * 2.5}%`, background: s.gap > 20 ? "#dc2626" : s.gap > 12 ? "#f59e0b" : "#10b981", borderRadius: "99px" }} />
                  </div>
                </div>
              </td>
              <td style={{ padding: "9px 10px" }}>
                <span style={{ fontSize: "10px", fontWeight: 600, color: severity.color, background: severity.bg, padding: "2px 8px", borderRadius: "99px", border: `1px solid ${severity.dot}40` }}>
                  {severity.label}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ─── ROI Summary ─────────────────────────────────────────────────────── */
function ROISummary() {
  const items = [
    { label: "Cost per Hire (Platform)", value: "₹4,200",     note: "vs ₹18,000 industry avg", positive: true },
    { label: "Time-to-Hire",             value: "11 days",    note: "vs 38 days manual",        positive: true },
    { label: "Offer Acceptance Rate",    value: "91%",         note: "+6% vs last quarter",      positive: true },
    { label: "Candidate Quality Score",  value: "8.4 / 10",   note: "based on manager feedback", positive: true },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
      {items.map((it) => (
        <div key={it.label} style={{ padding: "14px 16px", background: "#f9fafb", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "5px" }}>{it.label}</div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#111827", lineHeight: 1, marginBottom: "4px" }}>{it.value}</div>
          <div style={{ fontSize: "10px", color: it.positive ? "#059669" : "#dc2626", fontWeight: 600 }}>↑ {it.note}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function RecruiterAnalytics() {
  const [period, setPeriod] = useState("Last 6 Months");
  const periods = ["Last 30 Days", "Last 3 Months", "Last 6 Months", "This Year"];

  return (
    <div style={{ padding: "28px 32px", fontFamily: "Inter, sans-serif", background: "var(--background, #f9fafb)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 4px 0" }}>Recruiter Analytics & ROI</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>Executive overview of hiring performance, conversions, and skill gaps.</p>
        </div>
        <div style={{ display: "flex", gap: "6px", background: "#f3f4f6", borderRadius: "8px", padding: "3px" }}>
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: "5px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: period === p ? 600 : 400,
                background: period === p ? "#fff" : "transparent",
                color: period === p ? "#111827" : "#6b7280",
                boxShadow: period === p ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                transition: "all .15s",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {KPI.map((k) => (
          <div key={k.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "18px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${k.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <iconify-icon icon={k.icon} style={{ fontSize: "16px", color: k.color }}></iconify-icon>
              </div>
              <span style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.3 }}>{k.label}</span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "4px" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Row 2: Funnel + Line Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <Card>
          <SectionTitle sub="Stage-by-stage drop-off analysis">Hiring Funnel</SectionTitle>
          <HiringFunnel />
        </Card>
        <Card>
          <SectionTitle sub="Applications vs. hires per month">Monthly Hiring Trend</SectionTitle>
          <MonthlyLineChart />
          <div style={{ display: "flex", gap: "16px", marginTop: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "22px", height: "2.5px", background: "#3b82f6", borderRadius: "2px" }} />
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Applications</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "22px", borderTop: "2.5px dashed #10b981" }} />
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Hires</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 3: College Bar Chart + ROI */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <Card>
          <SectionTitle sub="Hires and success rate by college">College Hiring Performance</SectionTitle>
          <CollegeChart />
        </Card>
        <Card>
          <SectionTitle sub="Platform vs. industry benchmark">ROI Summary</SectionTitle>
          <ROISummary />
        </Card>
      </div>

      {/* Row 4: Skill Gaps (full width) */}
      <Card>
        <SectionTitle sub="Required proficiency vs. actual candidate assessment scores">Skill Gap Analysis</SectionTitle>
        <SkillGapTable />
      </Card>

    </div>
  );
}



