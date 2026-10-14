import { useState } from "react";

/* ─── Data ────────────────────────────────────────────────────────────────── */
const COLLEGES = [
  { id: 1, name: "IIT Bombay",     region: "West",      suitability: 96, talentStrength: 92, hiringYield: 38, skillDominance: "ML / AI",       inPlan: false },
  { id: 2, name: "BITS Pilani",    region: "Rajasthan", suitability: 91, talentStrength: 88, hiringYield: 32, skillDominance: "Full Stack",     inPlan: false },
  { id: 3, name: "NIT Trichy",     region: "South",     suitability: 87, talentStrength: 84, hiringYield: 29, skillDominance: "Systems",        inPlan: false },
  { id: 4, name: "IIT Delhi",      region: "North",     suitability: 94, talentStrength: 90, hiringYield: 36, skillDominance: "Systems / HPC",  inPlan: false },
  { id: 5, name: "VIT Vellore",    region: "South",     suitability: 79, talentStrength: 76, hiringYield: 44, skillDominance: "Web Dev",        inPlan: false },
  { id: 6, name: "SRM University", region: "South",     suitability: 72, talentStrength: 70, hiringYield: 40, skillDominance: "Cloud",          inPlan: false },
  { id: 7, name: "IIT Madras",     region: "South",     suitability: 93, talentStrength: 91, hiringYield: 35, skillDominance: "ML / AI",        inPlan: false },
  { id: 8, name: "IIIT Hyderabad", region: "South",     suitability: 89, talentStrength: 86, hiringYield: 30, skillDominance: "AI / NLP",       inPlan: false },
];

const MONTHS = ["Mar 2026", "Apr 2026", "May 2026"];
const WEEKS  = ["Week 1", "Week 2", "Week 3", "Week 4"];

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const CARD = {
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e2e8f0)",
  borderRadius: "8px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  padding: "20px",
};

const SECTION_TITLE = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--muted-foreground, #64748b)",
  margin: "0 0 14px 0",
};

const ScoreBar = ({ val }) => {
  const color =
    val >= 90 ? "#059669" : val >= 80 ? "#2b4ed6" : val >= 70 ? "#d97706" : "#dc2626";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          flex: 1,
          height: "5px",
          borderRadius: "4px",
          background: "var(--border, #e2e8f0)",
          overflow: "hidden",
        }}
      >
        <div
          style={{ height: "100%", width: `${val}%`, background: color, borderRadius: "4px" }}
        />
      </div>
      <span style={{ fontSize: "12px", fontWeight: 700, color, minWidth: "26px", textAlign: "right" }}>
        {val}
      </span>
    </div>
  );
};

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function CampusHiringPlanner() {
  const [colleges, setColleges] = useState(COLLEGES);
  const [slots, setSlots]       = useState({});
  const [sortKey, setSortKey]   = useState("suitability");

  const planColleges = colleges.filter((c) => c.inPlan);
  const planCount    = planColleges.length;
  const totalYield   = planColleges.reduce((s, c) => s + c.hiringYield, 0);
  const avgSuit      = planCount
    ? Math.round(planColleges.reduce((s, c) => s + c.suitability, 0) / planCount)
    : 0;
  const estCost = planCount * 85000;

  const sorted = [...colleges].sort((a, b) => b[sortKey] - a[sortKey]);

  const togglePlan = (id) =>
    setColleges((prev) => prev.map((c) => (c.id === id ? { ...c, inPlan: !c.inPlan } : c)));

  const setSlot = (key, val) =>
    setSlots((prev) => ({ ...prev, [key]: val }));

  return (
    <div
      style={{
        padding: "28px 32px",
        fontFamily: "Inter, system-ui, sans-serif",
        background: "var(--background, #f8fafc)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground, #0f172a)", marginBottom: "3px" }}>
            Campus Hiring Planner
          </div>
          <div style={{ fontSize: "13px", color: "var(--muted-foreground, #64748b)" }}>
            Strategically select colleges and plan interview drives
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {planCount > 0 && (
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "5px",
                background: "#f0fdf4",
                color: "#15803d",
                border: "1px solid #bbf7d0",
              }}
            >
              {planCount} college{planCount !== 1 ? "s" : ""} in plan
            </span>
          )}
          <button
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              background: "var(--primary, #2b4ed6)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <iconify-icon icon="lucide:download" style={{ fontSize: "13px" }}></iconify-icon>
            Export Plan
          </button>
        </div>
      </div>

      {/* ── College Selection Table ── */}
      <div style={{ ...CARD, padding: 0, overflow: "hidden", marginBottom: "20px" }}>
        {/* Table header bar */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--border, #e2e8f0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ ...SECTION_TITLE, margin: 0 }}>Shortlisted Colleges</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted-foreground, #64748b)", marginRight: "2px" }}>
              Sort:
            </span>
            {[
              { key: "suitability",    label: "Suitability"   },
              { key: "talentStrength", label: "Talent"        },
              { key: "hiringYield",    label: "Yield"         },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setSortKey(s.key)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "5px",
                  border: "1px solid",
                  borderColor: sortKey === s.key ? "var(--primary, #2b4ed6)" : "var(--border, #e2e8f0)",
                  background: sortKey === s.key ? "#eff6ff" : "transparent",
                  color: sortKey === s.key ? "var(--primary, #2b4ed6)" : "var(--muted-foreground, #64748b)",
                  fontSize: "12px",
                  fontWeight: sortKey === s.key ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border, #e2e8f0)",
                  background: "var(--secondary, #f8fafc)",
                }}
              >
                {[
                  "College",
                  "Suitability Score",
                  "Talent Strength Index",
                  "Expected Hiring Yield",
                  "Skill Dominance",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "var(--muted-foreground, #64748b)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: "1px solid var(--border, #e2e8f0)",
                    background: c.inPlan
                      ? "#f0fdf4"
                      : i % 2 === 0
                      ? "transparent"
                      : "var(--secondary, #f8fafc)",
                  }}
                >
                  {/* College */}
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground, #0f172a)" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--muted-foreground, #64748b)" }}>
                      {c.region}
                    </div>
                  </td>

                  {/* Suitability Score */}
                  <td style={{ padding: "12px 14px", minWidth: "160px" }}>
                    <ScoreBar val={c.suitability} />
                  </td>

                  {/* Talent Strength Index */}
                  <td style={{ padding: "12px 14px", minWidth: "160px" }}>
                    <ScoreBar val={c.talentStrength} />
                  </td>

                  {/* Expected Hiring Yield */}
                  <td style={{ padding: "12px 14px", textAlign: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground, #0f172a)" }}>
                      {c.hiringYield}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--muted-foreground, #64748b)" }}>
                      {" "}cand.
                    </span>
                  </td>

                  {/* Skill Dominance */}
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        border: "1px solid #bfdbfe",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {c.skillDominance}
                    </span>
                  </td>

                  {/* Add to Plan */}
                  <td style={{ padding: "12px 14px" }}>
                    <button
                      onClick={() => togglePlan(c.id)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "5px",
                        border: "1px solid",
                        borderColor: c.inPlan ? "#bbf7d0" : "var(--border, #e2e8f0)",
                        background: c.inPlan ? "#f0fdf4" : "transparent",
                        color: c.inPlan ? "#15803d" : "var(--muted-foreground, #64748b)",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.inPlan ? "✓ Added" : "+ Add to Plan"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom row: Calendar + ROI ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 310px",
          gap: "20px",
          alignItems: "start",
        }}
      >

        {/* Interview Slot Calendar */}
        <div style={CARD}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div style={{ ...SECTION_TITLE, margin: 0 }}>Interview Slot Calendar</div>
            <span style={{ fontSize: "11px", color: "var(--muted-foreground, #64748b)" }}>
              Mar – May 2026
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "480px" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "var(--muted-foreground, #64748b)",
                      background: "var(--secondary, #f8fafc)",
                      borderBottom: "1px solid var(--border, #e2e8f0)",
                    }}
                  >
                    Month
                  </th>
                  {WEEKS.map((w) => (
                    <th
                      key={w}
                      style={{
                        padding: "8px 12px",
                        textAlign: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "var(--muted-foreground, #64748b)",
                        background: "var(--secondary, #f8fafc)",
                        borderBottom: "1px solid var(--border, #e2e8f0)",
                      }}
                    >
                      {w}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTHS.map((month, mi) => (
                  <tr key={month} style={{ borderBottom: "1px solid var(--border, #e2e8f0)" }}>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontWeight: 600,
                        color: "var(--foreground, #0f172a)",
                        whiteSpace: "nowrap",
                        background: mi % 2 === 0 ? "transparent" : "var(--secondary, #f8fafc)",
                      }}
                    >
                      {month}
                    </td>
                    {WEEKS.map((week) => {
                      const key = `${month}-${week}`;
                      const val = slots[key] || "";
                      return (
                        <td
                          key={week}
                          style={{ padding: "6px 8px", background: mi % 2 === 0 ? "transparent" : "var(--secondary, #f8fafc)" }}
                        >
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => setSlot(key, e.target.value)}
                            placeholder="—"
                            style={{
                              width: "100%",
                              padding: "5px 8px",
                              borderRadius: "5px",
                              border: val ? "1px solid #bfdbfe" : "1px solid var(--border, #e2e8f0)",
                              background: val ? "#eff6ff" : "transparent",
                              color: val ? "#1d4ed8" : "var(--muted-foreground, #64748b)",
                              fontSize: "12px",
                              fontWeight: val ? 600 : 400,
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "10px", fontSize: "11px", color: "var(--muted-foreground, #64748b)" }}>
            Type a college name into any slot to schedule an interview drive.
          </div>
        </div>

        {/* ROI Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={CARD}>
            <div style={SECTION_TITLE}>ROI Summary</div>

            {planCount === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 0",
                  color: "var(--muted-foreground, #64748b)",
                  fontSize: "13px",
                }}
              >
                <iconify-icon
                  icon="lucide:bar-chart-2"
                  style={{ fontSize: "28px", display: "block", margin: "0 auto 8px" }}
                ></iconify-icon>
                Add colleges to plan<br />to see ROI estimates
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Colleges in Plan",      val: `${planCount}`,        sub: "campuses",          color: "#2b4ed6", bg: "#eff6ff", border: "#bfdbfe", icon: "lucide:building-2"   },
                  { label: "Exp. Hiring Yield",      val: `${totalYield}`,       sub: "candidates",        color: "#059669", bg: "#f0fdf4", border: "#bbf7d0", icon: "lucide:users"        },
                  { label: "Avg. Suitability",       val: `${avgSuit}`,          sub: "/ 100",             color: avgSuit >= 90 ? "#059669" : avgSuit >= 80 ? "#2b4ed6" : "#d97706",
                                                                                                             bg:    avgSuit >= 90 ? "#f0fdf4" : avgSuit >= 80 ? "#eff6ff" : "#fffbeb",
                                                                                                             border:avgSuit >= 90 ? "#bbf7d0" : avgSuit >= 80 ? "#bfdbfe" : "#fde68a",
                                                                                                             icon:  "lucide:target"                                                        },
                  { label: "Est. Drive Cost",        val: `₹${(estCost/100000).toFixed(1)}L`, sub: `₹85K × ${planCount}`,color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff", icon: "lucide:indian-rupee" },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "11px",
                      borderRadius: "6px",
                      background: row.bg,
                      border: `1px solid ${row.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "6px",
                        background: `${row.color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <iconify-icon icon={row.icon} style={{ fontSize: "15px", color: row.color }}></iconify-icon>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--muted-foreground, #64748b)", marginBottom: "1px" }}>
                        {row.label}
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 800, color: row.color, lineHeight: 1.2 }}>
                        {row.val}
                        <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--muted-foreground, #64748b)", marginLeft: "4px" }}>
                          {row.sub}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {planCount > 0 && (
            <div style={CARD}>
              <div style={SECTION_TITLE}>Cost per Hire</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground, #0f172a)", marginBottom: "4px" }}>
                ₹{totalYield > 0 ? Math.round(estCost / totalYield).toLocaleString("en-IN") : "—"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted-foreground, #64748b)" }}>
                per candidate · {totalYield} expected from {planCount} drive{planCount !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

