import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/* ── College dataset ──────────────────────────────────────────────── */
const ALL_COLLEGES = [
  {
    id: 1, initials: "IB", name: "IIT Bombay", location: "Mumbai", state: "Maharashtra",
    suitability: 96, codingRating: 9.1, verifiedWins: 312, students: 12400,
    skillStrength: "AI / ML",
    skills: [{ name: "AI / ML", pct: 92 }, { name: "Backend", pct: 85 }, { name: "Data Science", pct: 78 }, { name: "DevOps", pct: 64 }],
  },
  {
    id: 2, initials: "BP", name: "BITS Pilani", location: "Pilani", state: "Rajasthan",
    suitability: 93, codingRating: 8.8, verifiedWins: 278, students: 8900,
    skillStrength: "Full Stack",
    skills: [{ name: "Full Stack", pct: 90 }, { name: "Algorithms", pct: 86 }, { name: "Embedded", pct: 72 }, { name: "Cloud", pct: 61 }],
  },
  {
    id: 3, initials: "NT", name: "NIT Trichy", location: "Tiruchirappalli", state: "Tamil Nadu",
    suitability: 88, codingRating: 8.4, verifiedWins: 194, students: 7500,
    skillStrength: "DevOps & Cloud",
    skills: [{ name: "Java", pct: 88 }, { name: "Cloud", pct: 82 }, { name: "DevOps", pct: 76 }, { name: "React", pct: 55 }],
  },
  {
    id: 4, initials: "ID", name: "IIT Delhi", location: "New Delhi", state: "Delhi",
    suitability: 95, codingRating: 9.0, verifiedWins: 289, students: 10200,
    skillStrength: "AI / ML",
    skills: [{ name: "AI / ML", pct: 94 }, { name: "Systems", pct: 88 }, { name: "Research", pct: 80 }, { name: "Full Stack", pct: 70 }],
  },
  {
    id: 5, initials: "VV", name: "VIT Vellore", location: "Vellore", state: "Tamil Nadu",
    suitability: 79, codingRating: 7.6, verifiedWins: 143, students: 18000,
    skillStrength: "Full Stack",
    skills: [{ name: "Web Dev", pct: 82 }, { name: "Android", pct: 70 }, { name: "Python", pct: 68 }, { name: "UI/UX", pct: 54 }],
  },
  {
    id: 6, initials: "SR", name: "SRM University", location: "Chennai", state: "Tamil Nadu",
    suitability: 72, codingRating: 7.1, verifiedWins: 98, students: 21000,
    skillStrength: "Full Stack",
    skills: [{ name: "IoT", pct: 74 }, { name: "Blockchain", pct: 62 }, { name: "UI/UX", pct: 58 }, { name: "Java", pct: 50 }],
  },
  {
    id: 7, initials: "NW", name: "NIT Warangal", location: "Warangal", state: "Telangana",
    suitability: 85, codingRating: 8.2, verifiedWins: 167, students: 6800,
    skillStrength: "DevOps & Cloud",
    skills: [{ name: "Cloud", pct: 86 }, { name: "Java", pct: 80 }, { name: "DevOps", pct: 75 }, { name: "ML", pct: 60 }],
  },
  {
    id: 8, initials: "PU", name: "Pune University", location: "Pune", state: "Maharashtra",
    suitability: 68, codingRating: 6.9, verifiedWins: 74, students: 32000,
    skillStrength: "Full Stack",
    skills: [{ name: "Web Dev", pct: 72 }, { name: "Java", pct: 65 }, { name: "Python", pct: 60 }, { name: "Testing", pct: 48 }],
  },
  {
    id: 9, initials: "JA", name: "Jadavpur University", location: "Kolkata", state: "West Bengal",
    suitability: 82, codingRating: 8.0, verifiedWins: 152, students: 8100,
    skillStrength: "AI / ML",
    skills: [{ name: "AI / ML", pct: 84 }, { name: "Research", pct: 78 }, { name: "Systems", pct: 70 }, { name: "Python", pct: 68 }],
  },
];

const STATES = ["All States", "Maharashtra", "Rajasthan", "Tamil Nadu", "Delhi", "Telangana", "West Bengal"];
const SKILL_STRENGTHS = ["All Skills", "AI / ML", "Full Stack", "DevOps & Cloud"];
const SORT_OPTIONS = ["Suitability Score", "Coding Rating", "Verified Wins", "Student Count"];

/* ── Shared style tokens ─────────────────────────────────────────── */
const card = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "20px",
};

/* ── Sub-components ──────────────────────────────────────────────── */

function FilterPanel({ filters, onChange, onReset }) {
  const { state, skillStrength, scoreMin, scoreMax, studentMax } = filters;

  const pill = (active) => ({
    padding: "4px 10px",
    borderRadius: "4px",
    border: `1px solid ${active ? "#2b4ed6" : "var(--border)"}`,
    background: active ? "#eef2ff" : "transparent",
    color: active ? "#2b4ed6" : "var(--muted-foreground)",
    fontSize: "12px",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  const sectionLabel = {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    color: "var(--muted-foreground)",
    marginBottom: "8px",
  };

  return (
    <aside style={{ width: "260px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "0" }}>
      <div style={{ ...card, display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>Filters</span>
          <button onClick={onReset} style={{ fontSize: "11px", color: "#2b4ed6", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>Reset all</button>
        </div>

        {/* Location / State */}
        <div>
          <div style={sectionLabel}>Location</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {STATES.map((s) => (
              <button key={s} onClick={() => onChange("state", s)} style={{ ...pill(state === s), textAlign: "left", width: "100%" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Strength */}
        <div>
          <div style={sectionLabel}>Skill Strength</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {SKILL_STRENGTHS.map((sk) => (
              <button key={sk} onClick={() => onChange("skillStrength", sk)} style={{ ...pill(skillStrength === sk), textAlign: "left", width: "100%" }}>
                {sk}
              </button>
            ))}
          </div>
        </div>

        {/* Suitability Score Range */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={sectionLabel}>Suitability Score</span>
            <span style={{ fontSize: "11px", color: "var(--muted-foreground)", fontWeight: 500 }}>{scoreMin} – {scoreMax}</span>
          </div>
          <input
            type="range" min={0} max={100} value={scoreMin}
            onChange={(e) => onChange("scoreMin", Math.min(Number(e.target.value), scoreMax - 5))}
            style={{ width: "100%", accentColor: "#2b4ed6", marginBottom: "6px" }}
          />
          <input
            type="range" min={0} max={100} value={scoreMax}
            onChange={(e) => onChange("scoreMax", Math.max(Number(e.target.value), scoreMin + 5))}
            style={{ width: "100%", accentColor: "#2b4ed6" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--muted-foreground)", marginTop: "2px" }}>
            <span>Min: {scoreMin}</span><span>Max: {scoreMax}</span>
          </div>
        </div>

        {/* Student Count */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={sectionLabel}>Max Student Count</span>
            <span style={{ fontSize: "11px", color: "var(--muted-foreground)", fontWeight: 500 }}>{studentMax.toLocaleString()}</span>
          </div>
          <input
            type="range" min={1000} max={35000} step={500} value={studentMax}
            onChange={(e) => onChange("studentMax", Number(e.target.value))}
            style={{ width: "100%", accentColor: "#2b4ed6" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--muted-foreground)", marginTop: "2px" }}>
            <span>1 K</span><span>35 K</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ScoreBadge({ score }) {
  const color = score >= 90 ? { bg: "#dcfce7", text: "#15803d" } : score >= 80 ? { bg: "#dbeafe", text: "#1d4ed8" } : score >= 70 ? { bg: "#fef9c3", text: "#854d0e" } : { bg: "#fee2e2", text: "#b91c1c" };
  return (
    <span style={{ padding: "3px 9px", borderRadius: "4px", background: color.bg, color: color.text, fontSize: "12px", fontWeight: 700 }}>
      {score}
    </span>
  );
}

function SkillBar({ name, pct }) {
  return (
    <div style={{ marginBottom: "7px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
        <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{name}</span>
        <span style={{ fontSize: "11px", color: "var(--muted-foreground)", fontWeight: 500 }}>{pct}%</span>
      </div>
      <div style={{ height: "4px", borderRadius: "2px", background: "var(--secondary)" }}>
        <div style={{ height: "100%", borderRadius: "2px", background: "#2b4ed6", width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CollegeCard({ college, saved, onSave, onViewDetails }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "0", boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.08)" : "none", transition: "box-shadow 0.15s ease" }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#2b4ed6", flexShrink: 0 }}>
            {college.initials}
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", marginBottom: "2px" }}>{college.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--muted-foreground)" }}>
              <iconify-icon icon="lucide:map-pin" style={{ fontSize: "11px" }}></iconify-icon>
              {college.location}, {college.state}
            </div>
          </div>
        </div>
        <button onClick={() => onSave(college.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: saved ? "#2b4ed6" : "var(--muted-foreground)" }}>
          <iconify-icon icon={saved ? "lucide:bookmark-check" : "lucide:bookmark"} style={{ fontSize: "16px" }}></iconify-icon>
        </button>
      </div>

      {/* Score + stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        <div style={{ textAlign: "center", padding: "10px 6px", background: "var(--muted)", borderRadius: "6px" }}>
          <div style={{ marginBottom: "4px" }}><ScoreBadge score={college.suitability} /></div>
          <div style={{ fontSize: "10px", color: "var(--muted-foreground)", fontWeight: 500 }}>Suitability</div>
        </div>
        <div style={{ textAlign: "center", padding: "10px 6px", background: "var(--muted)", borderRadius: "6px" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>{college.codingRating}</div>
          <div style={{ fontSize: "10px", color: "var(--muted-foreground)", fontWeight: 500 }}>Coding Rating</div>
        </div>
        <div style={{ textAlign: "center", padding: "10px 6px", background: "var(--muted)", borderRadius: "6px" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>{college.verifiedWins}</div>
          <div style={{ fontSize: "10px", color: "var(--muted-foreground)", fontWeight: 500 }}>Verified Wins</div>
        </div>
      </div>

      {/* Skill bars */}
      <div style={{ marginBottom: "16px" }}>
        {college.skills.map((s) => <SkillBar key={s.name} name={s.name} pct={s.pct} />)}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
        <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
          <iconify-icon icon="lucide:users" style={{ fontSize: "11px", marginRight: "3px" }}></iconify-icon>
          {college.students.toLocaleString()} students
        </span>
        <button onClick={() => onViewDetails(college)} style={{ padding: "6px 14px", background: "#2b4ed6", border: "none", borderRadius: "5px", fontSize: "12px", fontWeight: 600, color: "#fff", cursor: "pointer" }}>
          View Details
        </button>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────── */

const DEFAULT_FILTERS = { state: "All States", skillStrength: "All Skills", scoreMin: 0, scoreMax: 100, studentMax: 35000 };

export default function CollegeExplorer() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Suitability Score");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [saved, setSaved] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const handleFilterChange = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const handleReset = () => { setFilters(DEFAULT_FILTERS); setSearch(""); };
  const toggleSave = (id) => setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const filtered = useMemo(() => {
    let list = ALL_COLLEGES.filter((c) => {
      const q = search.toLowerCase();
      if (q && !c.name.toLowerCase().includes(q) && !c.location.toLowerCase().includes(q) && !c.state.toLowerCase().includes(q)) return false;
      if (filters.state !== "All States" && c.state !== filters.state) return false;
      if (filters.skillStrength !== "All Skills" && c.skillStrength !== filters.skillStrength) return false;
      if (c.suitability < filters.scoreMin || c.suitability > filters.scoreMax) return false;
      if (c.students > filters.studentMax) return false;
      return true;
    });
    const sortMap = { "Suitability Score": "suitability", "Coding Rating": "codingRating", "Verified Wins": "verifiedWins", "Student Count": "students" };
    const key = sortMap[sortBy];
    list = [...list].sort((a, b) => b[key] - a[key]);
    return list;
  }, [search, filters, sortBy]);

  const activeFilterCount = [
    filters.state !== "All States",
    filters.skillStrength !== "All Skills",
    filters.scoreMin > 0 || filters.scoreMax < 100,
    filters.studentMax < 35000,
  ].filter(Boolean).length;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Page header ─────────────────────────────────────────── */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 4px 0", color: "var(--foreground)" }}>College Explorer</h1>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: 0 }}>Browse, filter and shortlist colleges for campus recruitment.</p>
      </div>

      {/* ── Search + sort bar ────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <iconify-icon icon="lucide:search" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "var(--muted-foreground)" }}></iconify-icon>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by college name or location…"
            style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "13px", background: "var(--card)", color: "var(--foreground)", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <span style={{ fontSize: "12px", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: "8px 10px", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px", background: "var(--card)", color: "var(--foreground)", cursor: "pointer", outline: "none" }}
          >
            {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ fontSize: "12px", color: "var(--muted-foreground)", whiteSpace: "nowrap", flexShrink: 0 }}>
          {filtered.length} college{filtered.length !== 1 ? "s" : ""}</div>
      </div>

      {/* ── Body: filter panel + grid ────────────────────────────── */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

        <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Filters:</span>
              {filters.state !== "All States" && <Chip label={filters.state} onRemove={() => handleFilterChange("state", "All States")} />}
              {filters.skillStrength !== "All Skills" && <Chip label={filters.skillStrength} onRemove={() => handleFilterChange("skillStrength", "All Skills")} />}
              {(filters.scoreMin > 0 || filters.scoreMax < 100) && <Chip label={`Score ${filters.scoreMin}–${filters.scoreMax}`} onRemove={() => { handleFilterChange("scoreMin", 0); handleFilterChange("scoreMax", 100); }} />}
              {filters.studentMax < 35000 && <Chip label={`≤${filters.studentMax.toLocaleString()} students`} onRemove={() => handleFilterChange("studentMax", 35000)} />}
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--muted-foreground)" }}>
              <iconify-icon icon="lucide:search-x" style={{ fontSize: "36px", display: "block", margin: "0 auto 12px" }}></iconify-icon>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>No colleges match your filters.</div>
              <button onClick={handleReset} style={{ marginTop: "10px", fontSize: "12px", color: "#2b4ed6", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Reset filters</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {filtered.map((c) => (
                <CollegeCard key={c.id} college={c} saved={saved.includes(c.id)} onSave={toggleSave} onViewDetails={setSelectedCollege} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── College Detail Modal ───────────────────────────────── */}
      {selectedCollege && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedCollege(null); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }}
        >
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", width: "100%", maxWidth: "540px", maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: "var(--secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#2b4ed6", flexShrink: 0 }}>
                  {selectedCollege.initials}
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)" }}>{selectedCollege.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <iconify-icon icon="lucide:map-pin" style={{ fontSize: "11px" }}></iconify-icon>
                    {selectedCollege.location}, {selectedCollege.state}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedCollege(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "2px" }}>
                <iconify-icon icon="lucide:x" style={{ fontSize: "18px" }}></iconify-icon>
              </button>
            </div>

            {/* Scrollable body */}
            <div style={{ overflowY: "auto", flex: 1, padding: "20px 24px" }}>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                {[
                  { label: "Suitability", value: <ScoreBadge score={selectedCollege.suitability} /> },
                  { label: "Coding Rating", value: selectedCollege.codingRating },
                  { label: "Verified Wins", value: selectedCollege.verifiedWins },
                  { label: "Students", value: selectedCollege.students.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: "center", padding: "12px 8px", background: "var(--muted)", borderRadius: "6px" }}>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>{value}</div>
                    <div style={{ fontSize: "10px", color: "var(--muted-foreground)", fontWeight: 500 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Skill strength tag */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Primary Strength</span>
                <span style={{ padding: "3px 10px", borderRadius: "4px", background: "#eef2ff", color: "#2b4ed6", fontSize: "12px", fontWeight: 600 }}>{selectedCollege.skillStrength}</span>
              </div>

              {/* Skill bars */}
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "10px" }}>Skill Breakdown</div>
                {selectedCollege.skills.map((s) => <SkillBar key={s.name} name={s.name} pct={s.pct} />)}
              </div>
            </div>

            {/* Footer actions */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={() => toggleSave(selectedCollege.id)}
                style={{ flex: 1, padding: "9px 0", background: saved.includes(selectedCollege.id) ? "#eef2ff" : "var(--secondary)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: saved.includes(selectedCollege.id) ? "#2b4ed6" : "var(--foreground)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                <iconify-icon icon={saved.includes(selectedCollege.id) ? "lucide:bookmark-check" : "lucide:bookmark"} style={{ fontSize: "13px" }}></iconify-icon>
                {saved.includes(selectedCollege.id) ? "Saved" : "Save"}
              </button>
              <button
                onClick={() => { setSelectedCollege(null); navigate("/recruiter/candidate-discovery"); }}
                style={{ flex: 1, padding: "9px 0", background: "var(--secondary)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "var(--foreground)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                <iconify-icon icon="lucide:users" style={{ fontSize: "13px" }}></iconify-icon>
                View Candidates
              </button>
              <button
                onClick={() => { setSelectedCollege(null); navigate("/recruiter/hiring-planner"); }}
                style={{ flex: 1, padding: "9px 0", background: "#2b4ed6", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                <iconify-icon icon="lucide:calendar-plus" style={{ fontSize: "13px" }}></iconify-icon>
                Schedule Drive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", background: "#eef2ff", color: "#2b4ed6", border: "1px solid #c7d3fb", borderRadius: "4px", fontSize: "11px", fontWeight: 500 }}>
      {label}
      <iconify-icon icon="lucide:x" style={{ fontSize: "11px", cursor: "pointer" }} onClick={onRemove}></iconify-icon>
    </span>
  );
}

// keep old named export for backward compat
export { CollegeExplorer as RecruiterCollegeExplorer };

