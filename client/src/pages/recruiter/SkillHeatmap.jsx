import { useState, useMemo } from "react";

/* ─── Skills (columns — fixed 15) ───────────────────────────── */
const SKILLS = [
  "React", "Node.js", "Python", "Java", "ML/AI",
  "Data Science", "DevOps", "Cloud", "UI/UX", "Android",
  "Blockchain", "Embedded", "Cybersec", "SQL/DB", "DSA",
];

/* ─── College dataset (96 real-sounding colleges) ───────────── */
const COLLEGE_RAW = [
  { name: "IIT Bombay",            city: "Mumbai",             state: "Maharashtra",     region: "West",    dept: "Engineering", tier: "T1" },
  { name: "IIT Delhi",             city: "New Delhi",          state: "Delhi",           region: "North",   dept: "Engineering", tier: "T1" },
  { name: "IIT Madras",            city: "Chennai",            state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T1" },
  { name: "IIT Kanpur",            city: "Kanpur",             state: "Uttar Pradesh",   region: "North",   dept: "Engineering", tier: "T1" },
  { name: "IIT Kharagpur",         city: "Kharagpur",          state: "West Bengal",     region: "East",    dept: "Engineering", tier: "T1" },
  { name: "IIT Roorkee",           city: "Roorkee",            state: "Uttarakhand",     region: "North",   dept: "Engineering", tier: "T1" },
  { name: "IIT Guwahati",          city: "Guwahati",           state: "Assam",           region: "East",    dept: "Engineering", tier: "T1" },
  { name: "IIT Hyderabad",         city: "Hyderabad",          state: "Telangana",       region: "South",   dept: "Engineering", tier: "T1" },
  { name: "IIT Indore",            city: "Indore",             state: "Madhya Pradesh",  region: "Central", dept: "Engineering", tier: "T1" },
  { name: "IIT Gandhinagar",       city: "Gandhinagar",        state: "Gujarat",         region: "West",    dept: "Engineering", tier: "T1" },
  { name: "IIT BHU Varanasi",      city: "Varanasi",           state: "Uttar Pradesh",   region: "North",   dept: "Engineering", tier: "T1" },
  { name: "IIT Jodhpur",           city: "Jodhpur",            state: "Rajasthan",       region: "West",    dept: "Engineering", tier: "T1" },
  { name: "BITS Pilani",           city: "Pilani",             state: "Rajasthan",       region: "North",   dept: "Engineering", tier: "T1" },
  { name: "BITS Hyderabad",        city: "Hyderabad",          state: "Telangana",       region: "South",   dept: "Engineering", tier: "T1" },
  { name: "BITS Goa",              city: "Goa",                state: "Goa",             region: "West",    dept: "Engineering", tier: "T1" },
  { name: "IIIT Hyderabad",        city: "Hyderabad",          state: "Telangana",       region: "South",   dept: "CS/IT",       tier: "T1" },
  { name: "IIST Thiruvananthapuram",city:"Thiruvananthapuram", state: "Kerala",          region: "South",   dept: "Engineering", tier: "T1" },
  { name: "NIT Trichy",            city: "Tiruchirappalli",    state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T2" },
  { name: "NIT Warangal",          city: "Warangal",           state: "Telangana",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "NIT Surathkal",         city: "Mangalore",          state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "NIT Calicut",           city: "Kozhikode",          state: "Kerala",          region: "South",   dept: "Engineering", tier: "T2" },
  { name: "NIT Allahabad",         city: "Allahabad",          state: "Uttar Pradesh",   region: "North",   dept: "Engineering", tier: "T2" },
  { name: "NIT Rourkela",          city: "Rourkela",           state: "Odisha",          region: "East",    dept: "Engineering", tier: "T2" },
  { name: "NIT Jaipur",            city: "Jaipur",             state: "Rajasthan",       region: "West",    dept: "Engineering", tier: "T2" },
  { name: "NIT Surat",             city: "Surat",              state: "Gujarat",         region: "West",    dept: "Engineering", tier: "T2" },
  { name: "NIT Durgapur",          city: "Durgapur",           state: "West Bengal",     region: "East",    dept: "Engineering", tier: "T2" },
  { name: "NIT Patna",             city: "Patna",              state: "Bihar",           region: "East",    dept: "Engineering", tier: "T2" },
  { name: "NIT Kurukshetra",       city: "Kurukshetra",        state: "Haryana",         region: "North",   dept: "Engineering", tier: "T2" },
  { name: "NIT Hamirpur",          city: "Hamirpur",           state: "Himachal Pradesh",region: "North",   dept: "Engineering", tier: "T2" },
  { name: "NIT Srinagar",          city: "Srinagar",           state: "J&K",             region: "North",   dept: "Engineering", tier: "T2" },
  { name: "VNIT Nagpur",           city: "Nagpur",             state: "Maharashtra",     region: "West",    dept: "Engineering", tier: "T2" },
  { name: "MANIT Bhopal",          city: "Bhopal",             state: "Madhya Pradesh",  region: "Central", dept: "Engineering", tier: "T2" },
  { name: "IIIT Bangalore",        city: "Bengaluru",          state: "Karnataka",       region: "South",   dept: "CS/IT",       tier: "T2" },
  { name: "IIIT Delhi",            city: "New Delhi",          state: "Delhi",           region: "North",   dept: "CS/IT",       tier: "T2" },
  { name: "IIIT Allahabad",        city: "Allahabad",          state: "Uttar Pradesh",   region: "North",   dept: "CS/IT",       tier: "T2" },
  { name: "IIIT Pune",             city: "Pune",               state: "Maharashtra",     region: "West",    dept: "CS/IT",       tier: "T2" },
  { name: "VIT Vellore",           city: "Vellore",            state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T2" },
  { name: "VIT Chennai",           city: "Chennai",            state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T2" },
  { name: "SRM University",        city: "Chennai",            state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T2" },
  { name: "Manipal Institute",     city: "Manipal",            state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "Thapar University",     city: "Patiala",            state: "Punjab",          region: "North",   dept: "Engineering", tier: "T2" },
  { name: "PES University",        city: "Bengaluru",          state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "RV College",            city: "Bengaluru",          state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "DTU Delhi",             city: "New Delhi",          state: "Delhi",           region: "North",   dept: "Engineering", tier: "T2" },
  { name: "NSIT Delhi",            city: "New Delhi",          state: "Delhi",           region: "North",   dept: "Engineering", tier: "T2" },
  { name: "COEP Pune",             city: "Pune",               state: "Maharashtra",     region: "West",    dept: "Engineering", tier: "T2" },
  { name: "VJTI Mumbai",           city: "Mumbai",             state: "Maharashtra",     region: "West",    dept: "Engineering", tier: "T2" },
  { name: "ICT Mumbai",            city: "Mumbai",             state: "Maharashtra",     region: "West",    dept: "Engineering", tier: "T2" },
  { name: "LNM IIT Jaipur",        city: "Jaipur",             state: "Rajasthan",       region: "West",    dept: "Engineering", tier: "T2" },
  { name: "Nirma University",      city: "Ahmedabad",          state: "Gujarat",         region: "West",    dept: "Engineering", tier: "T2" },
  { name: "Jadavpur University",   city: "Kolkata",            state: "West Bengal",     region: "East",    dept: "Engineering", tier: "T2" },
  { name: "Bengal Engineering",    city: "Howrah",             state: "West Bengal",     region: "East",    dept: "Engineering", tier: "T2" },
  { name: "Anna University",       city: "Chennai",            state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T2" },
  { name: "PSG Tech",              city: "Coimbatore",         state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T2" },
  { name: "Amrita University",     city: "Coimbatore",         state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T2" },
  { name: "SASTRA University",     city: "Thanjavur",          state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T2" },
  { name: "BMS College",           city: "Bengaluru",          state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "MS Ramaiah",            city: "Bengaluru",          state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "JSS STU Mysuru",        city: "Mysuru",             state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "MIT Manipal",           city: "Manipal",            state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "Osmania University",    city: "Hyderabad",          state: "Telangana",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "JNTUH Hyderabad",       city: "Hyderabad",          state: "Telangana",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "CBIT Hyderabad",        city: "Hyderabad",          state: "Telangana",       region: "South",   dept: "Engineering", tier: "T2" },
  { name: "College of Engg. TVM",  city:"Thiruvananthapuram",  state: "Kerala",          region: "South",   dept: "Engineering", tier: "T2" },
  { name: "GEC Thrissur",          city: "Thrissur",           state: "Kerala",          region: "South",   dept: "Engineering", tier: "T2" },
  { name: "TKM College",           city: "Kollam",             state: "Kerala",          region: "South",   dept: "Engineering", tier: "T2" },
  { name: "Sri Venkateswara Univ", city: "Tirupati",           state: "Andhra Pradesh",  region: "South",   dept: "Engineering", tier: "T2" },
  { name: "Andhra University",     city: "Visakhapatnam",      state: "Andhra Pradesh",  region: "South",   dept: "Engineering", tier: "T2" },
  { name: "HBTU Kanpur",           city: "Kanpur",             state: "Uttar Pradesh",   region: "North",   dept: "Engineering", tier: "T2" },
  { name: "Chandigarh University", city: "Mohali",             state: "Punjab",          region: "North",   dept: "Engineering", tier: "T2" },
  { name: "UIET Chandigarh",       city: "Chandigarh",         state: "Chandigarh",      region: "North",   dept: "Engineering", tier: "T2" },
  { name: "SGSITS Indore",         city: "Indore",             state: "Madhya Pradesh",  region: "Central", dept: "Engineering", tier: "T2" },
  { name: "SVNIT Surat",           city: "Surat",              state: "Gujarat",         region: "West",    dept: "Engineering", tier: "T2" },
  { name: "Symbiosis Pune",        city: "Pune",               state: "Maharashtra",     region: "West",    dept: "Management",  tier: "T2" },
  { name: "NMIMS Mumbai",          city: "Mumbai",             state: "Maharashtra",     region: "West",    dept: "Management",  tier: "T2" },
  { name: "Amity University",      city: "Noida",              state: "Uttar Pradesh",   region: "North",   dept: "Engineering", tier: "T3" },
  { name: "KCE Coimbatore",        city: "Coimbatore",         state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T3" },
  { name: "Kongu Engg. College",   city: "Erode",              state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T3" },
  { name: "Karunya University",    city: "Coimbatore",         state: "Tamil Nadu",      region: "South",   dept: "Engineering", tier: "T3" },
  { name: "KLE Tech",              city: "Hubballi",           state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T3" },
  { name: "MVIT Bengaluru",        city: "Bengaluru",          state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T3" },
  { name: "Dayananda Sagar",       city: "Bengaluru",          state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T3" },
  { name: "KIT Tiptur",            city: "Tiptur",             state: "Karnataka",       region: "South",   dept: "Engineering", tier: "T3" },
  { name: "VNR VJIET",             city: "Hyderabad",          state: "Telangana",       region: "South",   dept: "CS/IT",       tier: "T3" },
  { name: "Cochin Engg. College",  city: "Kochi",              state: "Kerala",          region: "South",   dept: "Engineering", tier: "T3" },
  { name: "RCOEM Nagpur",          city: "Nagpur",             state: "Maharashtra",     region: "West",    dept: "Engineering", tier: "T3" },
  { name: "Pune Univ. COE",        city: "Pune",               state: "Maharashtra",     region: "West",    dept: "Engineering", tier: "T3" },
  { name: "LNCTS Bhopal",          city: "Bhopal",             state: "Madhya Pradesh",  region: "Central", dept: "Engineering", tier: "T3" },
  { name: "GIT Bhilai",            city: "Bhilai",             state: "Chhattisgarh",    region: "Central", dept: "Engineering", tier: "T3" },
  { name: "DDU Nadiad",            city: "Nadiad",             state: "Gujarat",         region: "West",    dept: "Engineering", tier: "T3" },
  { name: "GEC Rajkot",            city: "Rajkot",             state: "Gujarat",         region: "West",    dept: "Engineering", tier: "T3" },
  { name: "JECRC Jaipur",          city: "Jaipur",             state: "Rajasthan",       region: "West",    dept: "Engineering", tier: "T3" },
  { name: "Poornima College",      city: "Jaipur",             state: "Rajasthan",       region: "West",    dept: "Engineering", tier: "T3" },
  { name: "MIET Jammu",            city: "Jammu",              state: "J&K",             region: "North",   dept: "Engineering", tier: "T3" },
  { name: "KNIT Sultanpur",        city: "Sultanpur",          state: "Uttar Pradesh",   region: "North",   dept: "Engineering", tier: "T3" },
  { name: "KIET Group",            city: "Ghaziabad",          state: "Uttar Pradesh",   region: "North",   dept: "Engineering", tier: "T3" },
  { name: "GLA University",        city: "Mathura",            state: "Uttar Pradesh",   region: "North",   dept: "Engineering", tier: "T3" },
  { name: "PTU Jalandhar",         city: "Jalandhar",          state: "Punjab",          region: "North",   dept: "Engineering", tier: "T3" },
  { name: "YMCA Faridabad",        city: "Faridabad",          state: "Haryana",         region: "North",   dept: "Engineering", tier: "T3" },
  { name: "DCRUST Murthal",        city: "Murthal",            state: "Haryana",         region: "North",   dept: "Engineering", tier: "T3" },
];

function genScore(ci, si) {
  const h = (ci * 31 + si * 17 + (ci ^ si) * 7 + ci * si) % 100;
  const base = 30 + (h % 58);
  const bonus = COLLEGE_RAW[ci % COLLEGE_RAW.length]?.tier === "T1" ? 20
              : COLLEGE_RAW[ci % COLLEGE_RAW.length]?.tier === "T2" ? 9 : 0;
  return Math.min(99, base + bonus);
}

const COLLEGES = COLLEGE_RAW.map((c, ci) => ({
  ...c, id: ci,
  scores: SKILLS.map((_, si) => genScore(ci, si)),
  avg: Math.round(SKILLS.reduce((s, _, si) => s + genScore(ci, si), 0) / SKILLS.length),
}));

const REGIONS   = ["All", ...Array.from(new Set(COLLEGE_RAW.map((c) => c.region))).sort()];
const DEPTS     = ["All", ...Array.from(new Set(COLLEGE_RAW.map((c) => c.dept))).sort()];
const TIERS     = ["All", "T1", "T2", "T3"];
const PAGE_SIZE = 25;

/* ─── Color scale (4 bands) ─────────────────────────────────── */
function cellColors(v) {
  if (v >= 80) return { bg: "#dcfce7", fg: "#14532d" };
  if (v >= 65) return { bg: "#dbeafe", fg: "#1e3a8a" };
  if (v >= 50) return { bg: "#fef9c3", fg: "#713f12" };
  return           { bg: "#fee2e2", fg: "#7f1d1d" };
}
const LEGEND = [
  { label: "≥ 80  High", bg: "#dcfce7", fg: "#14532d" },
  { label: "65–79 Good", bg: "#dbeafe", fg: "#1e3a8a" },
  { label: "50–64 Mid",  bg: "#fef9c3", fg: "#713f12" },
  { label: "< 50  Low",  bg: "#fee2e2", fg: "#7f1d1d" },
];

/* ─── Platform averages per skill ───────────────────────────── */
const SKILL_AVGS = SKILLS.map((_, si) =>
  Math.round(COLLEGES.reduce((s, c) => s + c.scores[si], 0) / COLLEGES.length)
);

/* ─── CSV export ────────────────────────────────────────────── */
function exportCSV(colleges) {
  const header = ["College", "City", "State", "Region", "Dept", "Tier", "Avg", ...SKILLS].join(",");
  const rows   = colleges.map((c) =>
    [`"${c.name}"`, c.city, c.state, c.region, c.dept, c.tier, c.avg, ...c.scores].join(",")
  );
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "skill-heatmap.csv"; a.click();
  URL.revokeObjectURL(url);
}

/* ─── Component ─────────────────────────────────────────────── */
export default function SkillHeatmap() {
  const [search,      setSearch]      = useState("");
  const [region,      setRegion]      = useState("All");
  const [dept,        setDept]        = useState("All");
  const [tier,        setTier]        = useState("All");
  const [minAvg,      setMinAvg]      = useState(0);
  const [sortSkill,   setSortSkill]   = useState(null);  // null → sort by Avg
  const [sortDir,     setSortDir]     = useState("desc");
  const [page,        setPage]        = useState(1);
  const [highlight,   setHighlight]   = useState(null);  // highlighted skill index
  const [showFilters, setShowFilters] = useState(false);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return COLLEGES.filter((c) =>
      (!q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)) &&
      (region === "All" || c.region === region) &&
      (dept   === "All" || c.dept   === dept)   &&
      (tier   === "All" || c.tier   === tier)   &&
      c.avg >= minAvg
    );
  }, [search, region, dept, tier, minAvg]);

  /* ── Sorted list ── */
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortSkill !== null) {
      arr.sort((a, b) => sortDir === "desc"
        ? b.scores[sortSkill] - a.scores[sortSkill]
        : a.scores[sortSkill] - b.scores[sortSkill]);
    } else {
      arr.sort((a, b) => sortDir === "desc" ? b.avg - a.avg : a.avg - b.avg);
    }
    return arr;
  }, [filtered, sortSkill, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const visible    = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSort = (idx) => {
    if (sortSkill === idx) { setSortDir((d) => d === "desc" ? "asc" : "desc"); }
    else { setSortSkill(idx); setSortDir("desc"); }
    setPage(1);
  };
  const toggleAvgSort = () => {
    if (sortSkill === null) { setSortDir((d) => d === "desc" ? "asc" : "desc"); }
    else { setSortSkill(null); setSortDir("desc"); }
    setPage(1);
  };

  const activeFilters = [
    region !== "All" && region,
    dept   !== "All" && dept,
    tier   !== "All" && tier,
    minAvg > 0 && `Avg ≥ ${minAvg}`,
  ].filter(Boolean);

  const resetAll = () => {
    setRegion("All"); setDept("All"); setTier("All");
    setMinAvg(0); setSearch(""); setPage(1);
    setSortSkill(null); setSortDir("desc");
  };

  /* ── Style helpers ── */
  const pill = (active) => ({
    padding: "4px 11px", borderRadius: 20, fontSize: 11, fontWeight: 500,
    cursor: "pointer", border: `1px solid ${active ? "#2b4ed6" : "var(--border)"}`,
    background: active ? "#2b4ed6" : "transparent",
    color: active ? "#fff" : "var(--muted-foreground)",
  });
  const thSkill = (si) => {
    const isActive = sortSkill === si;
    const isHL     = highlight === si;
    return {
      padding: "9px 5px", fontSize: 10, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.04em", whiteSpace: "nowrap", borderBottom: "2px solid var(--border)",
      borderLeft: "1px solid var(--border)", cursor: "pointer", userSelect: "none",
      textAlign: "center", minWidth: 58,
      color:      isActive ? "#2b4ed6" : isHL ? "#6d28d9" : "var(--muted-foreground)",
      background: isActive ? "#eef2ff" : isHL  ? "#f5f3ff" : "var(--muted)",
      opacity:    highlight !== null && !isHL && !isActive ? 0.45 : 1,
      outline:    isHL ? "2px solid #2b4ed6" : "none", outlineOffset: -2,
    };
  };

  return (
    <div style={{ padding: "24px", background: "var(--background)", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Header ────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", margin: "0 0 3px 0" }}>Skill Heatmap</h1>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: 0 }}>
            {COLLEGES.length} colleges · {SKILLS.length} skills · click any column header to sort
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowFilters((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, border: "1px solid var(--border)", background: showFilters ? "#eef2ff" : "var(--card)", fontSize: 12, fontWeight: 500, cursor: "pointer", color: showFilters ? "#2b4ed6" : "var(--foreground)" }}
          >
            <iconify-icon icon="lucide:sliders-horizontal" style={{ fontSize: 13 }} />
            Filters {activeFilters.length > 0 && (
              <span style={{ background: "#2b4ed6", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{activeFilters.length}</span>
            )}
          </button>
          <button
            onClick={() => exportCSV(sorted)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12, fontWeight: 500, cursor: "pointer", color: "var(--foreground)" }}
          >
            <iconify-icon icon="lucide:download" style={{ fontSize: 13 }} />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Search ────────────────────────────────────────────── */}
      <div style={{ position: "relative", maxWidth: 420, marginBottom: 12 }}>
        <iconify-icon icon="lucide:search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--muted-foreground)" }} />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by college, city, or state…"
          style={{ width: "100%", padding: "8px 32px 8px 32px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, background: "var(--card)", color: "var(--foreground)", outline: "none", boxSizing: "border-box" }}
        />
        {search && (
          <button onClick={() => { setSearch(""); setPage(1); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: 0, display: "flex" }}>
            <iconify-icon icon="lucide:x" style={{ fontSize: 13 }} />
          </button>
        )}
      </div>

      {/* ── Collapsible Filters ───────────────────────────────── */}
      {showFilters && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 20px", marginBottom: 14, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Region</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {REGIONS.map((r) => <button key={r} onClick={() => { setRegion(r); setPage(1); }} style={pill(region === r)}>{r}</button>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Department</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {DEPTS.map((d) => <button key={d} onClick={() => { setDept(d); setPage(1); }} style={pill(dept === d)}>{d}</button>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Tier</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {TIERS.map((t) => <button key={t} onClick={() => { setTier(t); setPage(1); }} style={pill(tier === t)}>{t}</button>)}
              </div>
            </div>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Min Avg Score: <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{minAvg}</span>
              </div>
              <input type="range" min={0} max={90} step={5} value={minAvg}
                onChange={(e) => { setMinAvg(Number(e.target.value)); setPage(1); }}
                style={{ width: "100%", accentColor: "#2b4ed6" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muted-foreground)", marginTop: 2 }}>
                <span>0</span><span>90</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={resetAll} style={{ fontSize: 12, color: "#2b4ed6", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Reset all filters</button>
          </div>
        </div>
      )}

      {/* ── Active chips ──────────────────────────────────────── */}
      {activeFilters.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Filters:</span>
          {activeFilters.map((f) => (
            <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", background: "#eef2ff", color: "#2b4ed6", border: "1px solid #c7d3fb", borderRadius: 4, fontSize: 11, fontWeight: 500 }}>{f}</span>
          ))}
          <button onClick={resetAll} style={{ fontSize: 11, color: "#2b4ed6", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>Clear all</button>
        </div>
      )}

      {/* ── Legend + result count ─────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600 }}>Scale:</span>
          {LEGEND.map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: l.bg }} />
              <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{l.label}</span>
            </div>
          ))}
        </div>
        <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
          <strong style={{ color: "var(--foreground)" }}>{sorted.length}</strong> college{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Skill highlight pills ─────────────────────────────── */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "var(--muted-foreground)", flexShrink: 0 }}>Highlight skill:</span>
        <button onClick={() => setHighlight(null)} style={{ ...pill(highlight === null), fontSize: 10 }}>None</button>
        {SKILLS.map((sk, si) => (
          <button key={sk} onClick={() => setHighlight(highlight === si ? null : si)} style={{ ...pill(highlight === si), fontSize: 10 }}>
            {sk}
          </button>
        ))}
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "52px 0", color: "var(--muted-foreground)", fontSize: 13 }}>
          <iconify-icon icon="lucide:search-x" style={{ fontSize: 32, display: "block", margin: "0 auto 10px" }} />
          No colleges match your filters.{" "}
          <button onClick={resetAll} style={{ color: "#2b4ed6", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: 13 }}>Reset</button>
        </div>
      ) : (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: `${210 + SKILLS.length * 60}px` }}>
            <thead>
              {/* Platform average row */}
              <tr style={{ background: "#eef2ff" }}>
                <td style={{ padding: "5px 14px", fontSize: 10, fontWeight: 700, color: "#2b4ed6", textTransform: "uppercase", letterSpacing: "0.04em", position: "sticky", left: 0, zIndex: 3, background: "#eef2ff", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", minWidth: 210 }}>
                  Platform avg (all {COLLEGES.length} colleges)
                </td>
                <td style={{ padding: "5px 5px", textAlign: "center", borderLeft: "2px solid var(--border)", borderBottom: "1px solid var(--border)", minWidth: 52 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 20, borderRadius: 4, background: cellColors(Math.round(SKILL_AVGS.reduce((a,v)=>a+v,0)/SKILL_AVGS.length)).bg, color: cellColors(Math.round(SKILL_AVGS.reduce((a,v)=>a+v,0)/SKILL_AVGS.length)).fg, fontSize: 10, fontWeight: 700 }}>
                    {Math.round(SKILL_AVGS.reduce((a, v) => a + v, 0) / SKILL_AVGS.length)}
                  </div>
                </td>
                {SKILLS.map((_, si) => {
                  const cls = cellColors(SKILL_AVGS[si]);
                  const isHL = highlight === si;
                  return (
                    <td key={si} style={{ padding: "4px 4px", textAlign: "center", borderLeft: "1px solid var(--border)", borderBottom: "1px solid var(--border)", opacity: highlight !== null && !isHL ? 0.3 : 1 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 20, borderRadius: 4, background: cls.bg, color: cls.fg, fontSize: 10, fontWeight: 700, border: isHL ? "2px solid #2b4ed6" : "none" }}>
                        {SKILL_AVGS[si]}
                      </div>
                    </td>
                  );
                })}
              </tr>
              {/* Column headers */}
              <tr style={{ background: "var(--muted)" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid var(--border)", position: "sticky", left: 0, zIndex: 3, background: "var(--muted)", whiteSpace: "nowrap", minWidth: 210 }}>
                  College
                </th>
                <th
                  onClick={toggleAvgSort}
                  style={{ padding: "10px 5px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "2px solid var(--border)", borderLeft: "2px solid var(--border)", cursor: "pointer", userSelect: "none", textAlign: "center", minWidth: 52, color: sortSkill === null ? "#2b4ed6" : "var(--muted-foreground)", background: sortSkill === null ? "#eef2ff" : "var(--muted)" }}
                >
                  Avg {sortSkill === null ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </th>
                {SKILLS.map((sk, si) => (
                  <th key={si} onClick={() => toggleSort(si)} style={thSkill(si)}>
                    {sk} {sortSkill === si ? (sortDir === "desc" ? "↓" : "↑") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((c, rowIdx) => (
                <tr
                  key={c.id}
                  style={{ borderBottom: "1px solid var(--border)", background: rowIdx % 2 === 0 ? "var(--card)" : "var(--muted, rgba(0,0,0,0.012))" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f0f4ff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = rowIdx % 2 === 0 ? "var(--card)" : "var(--muted, rgba(0,0,0,0.012))"; }}
                >
                  <td style={{ padding: "8px 14px", position: "sticky", left: 0, zIndex: 1, background: "inherit", borderRight: "2px solid var(--border)", minWidth: 210 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }} title={c.name}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 2, display: "flex", gap: 5, alignItems: "center" }}>
                      <span>{c.city}, {c.state}</span>
                      <span style={{ padding: "1px 5px", borderRadius: 3, fontSize: 9, fontWeight: 700,
                        background: c.tier === "T1" ? "#dcfce7" : c.tier === "T2" ? "#dbeafe" : "var(--muted)",
                        color:      c.tier === "T1" ? "#15803d" : c.tier === "T2" ? "#1e40af" : "var(--muted-foreground)" }}>
                        {c.tier}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "6px 4px", textAlign: "center", borderLeft: "2px solid var(--border)" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 22, borderRadius: 4, background: cellColors(c.avg).bg, color: cellColors(c.avg).fg, fontSize: 11, fontWeight: 700 }}>{c.avg}</div>
                  </td>
                  {c.scores.map((v, si) => {
                    const cls = cellColors(v);
                    const isHL = highlight === si;
                    return (
                      <td key={si} style={{ padding: "5px 3px", textAlign: "center", borderLeft: "1px solid var(--border)", opacity: highlight !== null && !isHL ? 0.18 : 1 }} title={`${c.name} · ${SKILLS[si]}: ${v}`}>
                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 22, borderRadius: 4, background: cls.bg, color: cls.fg, fontSize: 11, fontWeight: 700, border: isHL ? "2px solid #2b4ed6" : "1px solid transparent" }}>
                          {v}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: "1px solid var(--border)", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
              Rows {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length}
            </span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[
                { lbl: "«", fn: () => setPage(1),                   dis: safePage === 1 },
                { lbl: "‹", fn: () => setPage((p) => Math.max(1, p - 1)), dis: safePage === 1 },
              ].map(({ lbl, fn, dis }) => (
                <button key={lbl} onClick={fn} disabled={dis} style={{ padding: "5px 9px", borderRadius: 5, border: "1px solid var(--border)", background: "transparent", fontSize: 12, cursor: dis ? "default" : "pointer", color: dis ? "var(--muted-foreground)" : "var(--foreground)", fontWeight: 500 }}>{lbl}</button>
              ))}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 2)
                .reduce((acc, n, idx, arr) => { if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…"); acc.push(n); return acc; }, [])
                .map((n, i) =>
                  n === "…"
                    ? <span key={`e${i}`} style={{ fontSize: 12, color: "var(--muted-foreground)", padding: "0 2px" }}>…</span>
                    : <button key={n} onClick={() => setPage(n)} style={{ padding: "5px 10px", borderRadius: 5, border: "1px solid var(--border)", background: n === safePage ? "#2b4ed6" : "transparent", color: n === safePage ? "#fff" : "var(--foreground)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{n}</button>
                )
              }
              {[
                { lbl: "›", fn: () => setPage((p) => Math.min(totalPages, p + 1)), dis: safePage === totalPages },
                { lbl: "»", fn: () => setPage(totalPages),                          dis: safePage === totalPages },
              ].map(({ lbl, fn, dis }) => (
                <button key={lbl} onClick={fn} disabled={dis} style={{ padding: "5px 9px", borderRadius: 5, border: "1px solid var(--border)", background: "transparent", fontSize: 12, cursor: dis ? "default" : "pointer", color: dis ? "var(--muted-foreground)" : "var(--foreground)", fontWeight: 500 }}>{lbl}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
