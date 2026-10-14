import { useState, useRef, useEffect, useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from "recharts";

/* ─── Data ─────────────────────────────────────────────────── */
const COLLEGE_POOL = [
  {
    id: 1, name: "IIT Bombay", location: "Mumbai", type: "IIT",
    suitability: 96, codingRating: 88, hackathonWinRate: 74, internshipRate: 91, participation: 85,
    skills: { "AI/ML": 92, "Backend": 85, "Data Sci": 79, "Cloud": 70, "Web Dev": 60 },
  },
  {
    id: 2, name: "BITS Pilani", location: "Rajasthan", type: "Deemed",
    suitability: 93, codingRating: 84, hackathonWinRate: 69, internshipRate: 88, participation: 80,
    skills: { "AI/ML": 78, "Backend": 90, "Data Sci": 72, "Cloud": 67, "Web Dev": 74 },
  },
  {
    id: 3, name: "NIT Trichy", location: "Tamil Nadu", type: "NIT",
    suitability: 88, codingRating: 79, hackathonWinRate: 61, internshipRate: 83, participation: 76,
    skills: { "AI/ML": 65, "Backend": 80, "Data Sci": 68, "Cloud": 75, "Web Dev": 70 },
  },
  {
    id: 4, name: "VIT Vellore", location: "Tamil Nadu", type: "Private",
    suitability: 78, codingRating: 70, hackathonWinRate: 52, internshipRate: 76, participation: 88,
    skills: { "AI/ML": 60, "Backend": 68, "Data Sci": 55, "Cloud": 58, "Web Dev": 82 },
  },
  {
    id: 5, name: "IIT Delhi", location: "Delhi", type: "IIT",
    suitability: 95, codingRating: 90, hackathonWinRate: 78, internshipRate: 93, participation: 82,
    skills: { "AI/ML": 94, "Backend": 87, "Data Sci": 83, "Cloud": 74, "Web Dev": 62 },
  },
  {
    id: 6, name: "IIIT Hyderabad", location: "Hyderabad", type: "IIIT",
    suitability: 91, codingRating: 86, hackathonWinRate: 70, internshipRate: 86, participation: 78,
    skills: { "AI/ML": 88, "Backend": 82, "Data Sci": 76, "Cloud": 65, "Web Dev": 68 },
  },
];

const METRICS = [
  { key: "suitability",      label: "Recruitment Suitability", unit: "/100", icon: "lucide:target",      radar: "Suitability" },
  { key: "codingRating",     label: "Avg Coding Rating",       unit: "/100", icon: "lucide:code-2",      radar: "Coding" },
  { key: "hackathonWinRate", label: "Hackathon Win Rate",      unit: "%",    icon: "lucide:trophy",       radar: "Hackathon" },
  { key: "internshipRate",   label: "Internship Rate",         unit: "%",    icon: "lucide:briefcase",    radar: "Internship" },
  { key: "participation",    label: "Participation %",         unit: "%",    icon: "lucide:users",        radar: "Participation" },
];

const COL_COLORS = [
  "#2b4ed6", "#0891b2", "#7c3aed", "#059669", "#dc2626",
  "#d97706", "#db2777", "#0284c7", "#65a30d", "#9333ea",
  "#ea580c", "#0d9488", "#b45309", "#4338ca", "#be185d",
];
const SKILL_KEYS = ["AI/ML", "Backend", "Data Sci", "Cloud", "Web Dev"];

/* ─── Helpers ───────────────────────────────────────────────── */
function ScoreBar({ value, color }) {
  return (
    <div style={{ height: 4, borderRadius: 4, background: "var(--border)", marginTop: 6, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 4, transition: "width 0.4s ease" }} />
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--card, white)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, marginTop: 2 }}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
}

/* ─── CollegeSelector (searchable dropdown — safe for 500+ colleges) ── */
const MAX_RESULTS = 50;

function CollegeSelector({ selectedIds, onToggle }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COLLEGE_POOL.slice(0, MAX_RESULTS);
    return COLLEGE_POOL.filter(
      (c) => c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)
    ).slice(0, MAX_RESULTS);
  }, [query]);

  const selectedColleges = selectedIds.map((id) => COLLEGE_POOL.find((c) => c.id === id)).filter(Boolean);
  const canAdd = selectedIds.length < 15;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        background: "var(--card, white)", border: "1px solid var(--border)",
        borderRadius: 8, padding: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Select Colleges
            <span style={{ fontWeight: 400, textTransform: "none", marginLeft: 8 }}>({selectedIds.length}/15 selected)</span>
          </div>
          {!canAdd && (
            <span style={{ fontSize: 11, color: "#f59e0b", background: "#fef9c3", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>
              Maximum 15 selected
            </span>
          )}
        </div>

        {/* Selected chips */}
        {selectedColleges.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {selectedColleges.map((c, ci) => (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 10px", borderRadius: 6,
                border: `1.5px solid ${COL_COLORS[ci]}`,
                background: `${COL_COLORS[ci]}10`,
                fontSize: 13, fontWeight: 500, color: COL_COLORS[ci],
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: "50%", background: COL_COLORS[ci],
                  color: "white", fontSize: 10, fontWeight: 700, flexShrink: 0,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>{ci + 1}</span>
                {c.name}
                <span style={{ fontSize: 11, opacity: 0.7 }}>{c.type}</span>
                <button
                  onClick={() => onToggle(c.id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: COL_COLORS[ci], padding: 0, lineHeight: 1,
                    fontSize: 14, fontWeight: 700, marginLeft: 2,
                  }}
                >×</button>
              </div>
            ))}
          </div>
        )}

        {/* Search input + dropdown */}
        <div ref={ref} style={{ position: "relative", maxWidth: 380 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            border: "1px solid var(--border)", borderRadius: 6,
            padding: "8px 12px", background: "var(--card, white)",
          }}>
            <iconify-icon icon="lucide:search" style={{ fontSize: 14, color: "var(--muted-foreground)", flexShrink: 0 }} />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder={canAdd ? "Search college by name, location, or type…" : "Remove a college to add another"}
              disabled={!canAdd && selectedIds.length === 15}
              style={{
                flex: 1, border: "none", outline: "none", fontSize: 13,
                color: "var(--foreground)", background: "transparent",
                cursor: !canAdd ? "not-allowed" : "text",
              }}
            />
            {query && (
              <button onClick={() => { setQuery(""); setOpen(false); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", fontSize: 16, padding: 0, lineHeight: 1 }}
              >×</button>
            )}
          </div>

          {open && canAdd && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
              background: "var(--card, white)", border: "1px solid var(--border)",
              borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              zIndex: 100, maxHeight: 260, overflowY: "auto",
            }}>
              {results.length === 0 ? (
                <div style={{ padding: "16px 14px", fontSize: 13, color: "var(--muted-foreground)", textAlign: "center" }}>
                  No colleges found
                </div>
              ) : (
                results.map((c) => {
                  const alreadySelected = selectedIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      disabled={alreadySelected}
                      onClick={() => { onToggle(c.id); setQuery(""); setOpen(false); }}
                      style={{
                        width: "100%", textAlign: "left", padding: "10px 14px",
                        background: alreadySelected ? "var(--muted, #f8fafc)" : "transparent",
                        border: "none", borderBottom: "1px solid var(--border)",
                        cursor: alreadySelected ? "default" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: alreadySelected ? "var(--muted-foreground)" : "var(--foreground)" }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>
                          {c.type} · {c.location}
                        </div>
                      </div>
                      {alreadySelected
                        ? <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontStyle: "italic" }}>Added</span>
                        : <span style={{ fontSize: 11, color: "var(--muted-foreground)", background: "var(--muted)", padding: "2px 6px", borderRadius: 4 }}>Score: {c.suitability}</span>
                      }
                    </button>
                  );
                })
              )}
              {results.length === MAX_RESULTS && (
                <div style={{ padding: "8px 14px", fontSize: 11, color: "var(--muted-foreground)", textAlign: "center", borderTop: "1px solid var(--border)" }}>
                  Showing first {MAX_RESULTS} results — type to narrow down
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export default function CollegeComparison() {
  const [selectedIds, setSelectedIds] = useState([1, 2]);

  function toggle(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 15 ? [...prev, id] : prev
    );
  }

  const compared = selectedIds.map((id) => COLLEGE_POOL.find((c) => c.id === id)).filter(Boolean);

  const radarData = METRICS.map((m) => {
    const row = { metric: m.radar };
    compared.forEach((c) => { row[c.name] = c[m.key]; });
    return row;
  });

  const barData = SKILL_KEYS.map((sk) => {
    const row = { skill: sk };
    compared.forEach((c) => { row[c.name] = c.skills[sk]; });
    return row;
  });

  const section = {
    background: "var(--card, white)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: 24,
    marginBottom: 20,
  };

  return (
    <div style={{ padding: 24, background: "var(--background)", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--foreground)", margin: "0 0 4px 0" }}>College Comparison</h1>
        <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: 0 }}>
          Select up to 15 colleges for a side-by-side comparison across key recruitment metrics.
        </p>
      </div>

      {/* ── College Selector ── */}
      <CollegeSelector selectedIds={selectedIds} onToggle={toggle} />

      {compared.length > 0 && (
        <>
          {/* ── Comparison Table ── */}
          <div style={{ ...section, padding: 0, overflowX: "auto" }}>
            {/* min-width wrapper ensures columns don't collapse */}
            <div style={{ minWidth: `${200 + compared.length * 140}px` }}>
            {/* Sticky column header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: `200px ${compared.map(() => "minmax(140px, 1fr)").join(" ")}`,
              background: "var(--muted, #f8fafc)",
              borderBottom: "1px solid var(--border)",
              position: "sticky", top: 0, zIndex: 10,
            }}>
              <div style={{ padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Metric
              </div>
              {compared.map((c, ci) => (
                <div key={c.id} style={{ padding: "14px 20px", borderLeft: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: "50%", background: COL_COLORS[ci],
                      color: "white", fontSize: 11, fontWeight: 700, flexShrink: 0,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                    }}>{ci + 1}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{c.type} · {c.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Metric rows */}
            {METRICS.map((m, mi) => {
              const values = compared.map((c) => c[m.key]);
              const best = Math.max(...values);
              return (
                <div
                  key={m.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `200px ${compared.map(() => "minmax(140px, 1fr)").join(" ")}`,
                    borderBottom: mi < METRICS.length - 1 ? "1px solid var(--border)" : "none",
                    background: mi % 2 === 1 ? "var(--muted, #f8fafc)" : "var(--card, white)",
                  }}
                >
                  <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 8 }}>
                    <iconify-icon icon={m.icon} style={{ fontSize: 15, color: "var(--muted-foreground)", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>{m.label}</span>
                  </div>
                  {compared.map((c, ci) => {
                    const v = c[m.key];
                    const isBest = v === best && compared.length > 1;
                    return (
                      <div key={c.id} style={{ padding: "16px 20px", borderLeft: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: isBest ? COL_COLORS[ci] : "var(--foreground)" }}>
                            {v}{m.unit}
                          </span>
                          {isBest && (
                            <span style={{
                              fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4,
                              background: `${COL_COLORS[ci]}14`, color: COL_COLORS[ci], letterSpacing: "0.03em",
                            }}>BEST</span>
                          )}
                        </div>
                        <ScoreBar value={v} color={isBest ? COL_COLORS[ci] : "#94a3b8"} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
            </div>
          </div>

          {/* ── Charts Row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* Radar Chart */}
            <div style={section}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>Performance Radar</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>All 5 metrics normalized to 0–100</div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                  {compared.map((c, ci) => (
                    <Radar
                      key={c.id}
                      name={c.name}
                      dataKey={c.name}
                      stroke={COL_COLORS[ci]}
                      fill={COL_COLORS[ci]}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart — Skill Breakdown */}
            <div style={section}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 4 }}>Skill Breakdown</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>Proficiency scores per skill domain</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} maxBarSize={22} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="skill" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  {compared.map((c, ci) => (
                    <Bar key={c.id} dataKey={c.name} fill={COL_COLORS[ci]} radius={[3, 3, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {compared.length === 0 && (
        <div style={{ ...section, textAlign: "center", padding: 48 }}>
          <iconify-icon icon="lucide:git-compare" style={{ fontSize: 36, color: "var(--muted-foreground)" }} />
          <div style={{ marginTop: 12, fontSize: 14, color: "var(--muted-foreground)" }}>
            Select at least one college above to start comparing.
          </div>
        </div>
      )}
    </div>
  );
}
