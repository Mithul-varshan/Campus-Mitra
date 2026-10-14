import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Dataset generator — produces 540 candidates ───────────── */
const FIRST_NAMES = [
  "Arjun","Priya","Rahul","Sneha","Kiran","Aditi","Vikram","Meera","Dev","Anjali",
  "Rohan","Nisha","Arun","Divya","Siddharth","Kavya","Nikhil","Pooja","Amit","Shreya",
  "Ravi","Lakshmi","Tarun","Ananya","Vignesh","Kritika","Harish","Swati","Pranav","Ritu",
  "Akash","Simran","Mohit","Deepika","Gaurav","Pallavi","Sumit","Neha","Vishal","Isha",
  "Sachin","Ayesha","Kartik","Bhavna","Dinesh","Sanya","Rajesh","Tanvi","Vivek","Mansi",
];
const LAST_NAMES = [
  "Mehta","Sharma","Nair","Gupta","Reddy","Bansal","Singh","Iyer","Patel","Verma",
  "Kapoor","Pillai","Kumar","Joshi","Mishra","Rao","Shah","Das","Kaur","Chauhan",
];
const COLLEGES_LIST = [
  { name: "IIT Bombay",          tier: "T1", region: "West"    },
  { name: "IIT Delhi",           tier: "T1", region: "North"   },
  { name: "IIT Madras",          tier: "T1", region: "South"   },
  { name: "IIT Kanpur",          tier: "T1", region: "North"   },
  { name: "IIT Kharagpur",       tier: "T1", region: "East"    },
  { name: "BITS Pilani",         tier: "T1", region: "North"   },
  { name: "BITS Hyderabad",      tier: "T1", region: "South"   },
  { name: "BITS Goa",            tier: "T1", region: "West"    },
  { name: "IIIT Hyderabad",      tier: "T1", region: "South"   },
  { name: "NIT Trichy",          tier: "T2", region: "South"   },
  { name: "NIT Warangal",        tier: "T2", region: "South"   },
  { name: "NIT Surathkal",       tier: "T2", region: "South"   },
  { name: "NIT Calicut",         tier: "T2", region: "South"   },
  { name: "NIT Rourkela",        tier: "T2", region: "East"    },
  { name: "IIIT Bangalore",      tier: "T2", region: "South"   },
  { name: "VIT Vellore",         tier: "T2", region: "South"   },
  { name: "SRM University",      tier: "T2", region: "South"   },
  { name: "Manipal Institute",   tier: "T2", region: "South"   },
  { name: "Thapar University",   tier: "T2", region: "North"   },
  { name: "DTU Delhi",           tier: "T2", region: "North"   },
  { name: "COEP Pune",           tier: "T2", region: "West"    },
  { name: "Jadavpur University", tier: "T2", region: "East"    },
  { name: "PES University",      tier: "T2", region: "South"   },
  { name: "MS Ramaiah",          tier: "T2", region: "South"   },
  { name: "Chandigarh Univ.",    tier: "T2", region: "North"   },
  { name: "Amrita University",   tier: "T2", region: "South"   },
  { name: "Anna University",     tier: "T2", region: "South"   },
  { name: "PSG Tech",            tier: "T2", region: "South"   },
  { name: "Amity University",    tier: "T3", region: "North"   },
  { name: "KCE Coimbatore",      tier: "T3", region: "South"   },
];
const DEPTS_LIST = ["CSE","IT","ECE","EEE","Mech","CS + Finance","ECE + CS","CS + Maths","DS","CyberSec","AI/ML","Full Stack"];
const ACHIEVEMENTS_POOL = [
  "SIH 2024 Winner","LeetCode Knight","GSoC 2024","Smart India Hackathon","Kaggle Expert",
  "Microsoft Intern","ACM ICPC Regionalist","AWS Certified","Oracle Intern","Codeforces Specialist",
  "HackMIT Finalist","Open Source Contrib.","Android App 50K+ DL","IoT Hackathon 2nd","IEEE Member",
  "Inter-IIT Gold","Published IEEE Paper","Robotics Club Head","Google Summer of Code","DevOps Certified",
  "ML Research Intern","GATE 99 Percentile","ICPC World Finalist","Bloomberg Intern","CodeChef 4-Star",
  "Freshers Hackathon 1st","Smart City Challenge","Red Hat Certified","Adobe Intern","Web Dev Mentor",
  "State Quiz Winner","Open Source 200+ Stars","Kaggle Top 5%","Meta Intern","Flipkart GRiD Winner",
  "Top Coder Rating 2000+","GitHub 500+ Stars","Research Paper ACM","DL Specialization Coursera",
];

function h(n) { return Math.abs((((n >>> 0) * 2654435761) >>> 0) % 1000); }

const ALL_CANDIDATES = (() => {
  const out = [];
  let id = 1;
  for (let ci = 0; ci < COLLEGES_LIST.length; ci++) {
    for (let ni = 0; ni < FIRST_NAMES.length; ni++) {
      if (out.length >= 540) break;
      const seed  = ci * 100 + ni;
      const lni   = h(seed * 7) % LAST_NAMES.length;
      const deptI = h(seed * 13) % DEPTS_LIST.length;
      const year  = 1 + (h(seed * 3) % 4);
      const col   = COLLEGES_LIST[ci];
      const tierBonus = col.tier === "T1" ? 12 : col.tier === "T2" ? 5 : 0;
      const skillScore  = Math.min(99, 52 + tierBonus + (h(seed * 17) % 36));
      const leetcode    = 1300 + tierBonus * 20 + (h(seed * 11) % 700);
      const hackWins    = h(seed * 5) % 7;
      const hasInternship = h(seed * 19) % 3 !== 0;
      const verified    = col.tier === "T1" || h(seed * 23) % 3 !== 0;
      const achs = [];
      const a1 = h(seed * 29) % ACHIEVEMENTS_POOL.length;
      const a2 = h(seed * 37) % ACHIEVEMENTS_POOL.length;
      const a3 = h(seed * 41) % ACHIEVEMENTS_POOL.length;
      achs.push(ACHIEVEMENTS_POOL[a1]);
      if (a2 !== a1) achs.push(ACHIEVEMENTS_POOL[a2]);
      if (a3 !== a1 && a3 !== a2) achs.push(ACHIEVEMENTS_POOL[a3]);

      out.push({
        id, name: `${FIRST_NAMES[ni]} ${LAST_NAMES[lni]}`,
        college: col.name, tier: col.tier, region: col.region,
        dept: DEPTS_LIST[deptI], year,
        skillScore, leetcode, hackathonWins: hackWins,
        hasInternship, verified,
        achievements: achs.slice(0, 3),
      });
      id++;
    }
    if (out.length >= 540) break;
  }
  return out;
})();

const COLLEGE_OPTIONS = ["All", ...Array.from(new Set(ALL_CANDIDATES.map((c) => c.college))).sort()];
const DEPT_OPTIONS    = ["All", ...Array.from(new Set(ALL_CANDIDATES.map((c) => c.dept))).sort()];
const TIER_OPTIONS    = ["All", "T1", "T2", "T3"];
const REGION_OPTIONS  = ["All", ...Array.from(new Set(ALL_CANDIDATES.map((c) => c.region))).sort()];
const SORT_OPT = [
  { value: "performance", label: "Skill Score (High → Low)" },
  { value: "leetcode",    label: "LeetCode (High → Low)"    },
  { value: "wins",        label: "Hackathon Wins"            },
  { value: "name",        label: "Name (A → Z)"              },
];

const PAGE_SIZE = 24;

function scoreColors(s) {
  if (s >= 90) return { bg: "#dcfce7", fg: "#14532d" };
  if (s >= 80) return { bg: "#dbeafe", fg: "#1e3a8a" };
  if (s >= 70) return { bg: "#fef9c3", fg: "#713f12" };
  return           { bg: "#fee2e2", fg: "#7f1d1d" };
}
const AVATAR_COLORS = ["#2b4ed6","#0891b2","#7c3aed","#059669","#dc2626","#d97706","#db2777","#0284c7","#65a30d","#9333ea","#ea580c","#0d9488"];

/* ─── CandidateCard ─────────────────────────────────────────── */
function CandidateCard({ candidate, globalIdx, shortlisted, onShortlist, onViewProfile }) {
  const sc  = scoreColors(candidate.skillScore);
  const initials = candidate.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const avatarBg = AVATAR_COLORS[globalIdx % AVATAR_COLORS.length];

  return (
    <div style={{ background: "var(--card)", border: `1px solid ${shortlisted ? "#2b4ed6" : "var(--border)"}`, borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 11, position: "relative" }}>
      {shortlisted && (
        <div style={{ position: "absolute", top: 10, right: 10, background: "#eef2ff", color: "#2b4ed6", borderRadius: 4, padding: "2px 7px", fontSize: 10, fontWeight: 700, border: "1px solid #c7d3fb" }}>
          Shortlisted
        </div>
      )}

      {/* Identity row */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingRight: shortlisted ? 72 : 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: avatarBg, color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{candidate.name}</span>
            {candidate.verified && <iconify-icon icon="lucide:badge-check" style={{ fontSize: 14, color: "#2b4ed6", flexShrink: 0 }} />}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {candidate.college} · {candidate.dept} · Yr {candidate.year}
          </div>
        </div>
        <div style={{ ...sc, marginLeft: "auto", padding: "3px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
          {candidate.skillScore}/100
        </div>
      </div>

      {/* Stats chips */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {[
          { icon: "lucide:code-2",    label: `LC ${candidate.leetcode}`          },
          { icon: "lucide:trophy",    label: `${candidate.hackathonWins} Wins`    },
          { icon: "lucide:briefcase", label: candidate.hasInternship ? "Interned" : "No Intern" },
          { icon: "lucide:layers",    label: candidate.tier                        },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 7px", borderRadius: 4, background: "var(--muted)", border: "1px solid var(--border)", fontSize: 10, color: "var(--muted-foreground)" }}>
            <iconify-icon icon={s.icon} style={{ fontSize: 10 }} />{s.label}
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {candidate.achievements.slice(0, 2).map((a) => (
          <div key={a} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--foreground)" }}>
            <iconify-icon icon="lucide:check-circle" style={{ fontSize: 11, color: "#059669", flexShrink: 0 }} />{a}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 7, marginTop: "auto" }}>
        <button
          onClick={() => onViewProfile(candidate)}
          style={{ flex: 2, padding: "7px 0", borderRadius: 6, border: "1px solid #2b4ed6", background: "transparent", color: "#2b4ed6", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
        >
          <iconify-icon icon="lucide:user" style={{ fontSize: 11 }} /> View Profile
        </button>
        <button
          onClick={() => onShortlist(candidate.id)}
          style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: `1px solid ${shortlisted ? "#dc2626" : "var(--border)"}`, background: shortlisted ? "#fee2e2" : "var(--muted)", color: shortlisted ? "#dc2626" : "var(--muted-foreground)", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
        >
          <iconify-icon icon={shortlisted ? "lucide:bookmark-x" : "lucide:bookmark-plus"} style={{ fontSize: 11 }} />
          {shortlisted ? "Remove" : "Shortlist"}
        </button>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function CandidateDiscovery() {
  const navigate = useNavigate();

  // Filters
  const [search,         setSearch]         = useState("");
  const [college,        setCollege]        = useState("All");
  const [dept,           setDept]           = useState("All");
  const [tier,           setTier]           = useState("All");
  const [region,         setRegion]         = useState("All");
  const [year,           setYear]           = useState("All");
  const [minScore,       setMinScore]       = useState(0);
  const [minLeetcode,    setMinLeetcode]    = useState(1300);
  const [minWins,        setMinWins]        = useState(0);
  const [internshipOnly, setInternshipOnly] = useState(false);
  const [verifiedOnly,   setVerifiedOnly]   = useState(false);
  const [sortKey,        setSortKey]        = useState("performance");
  const [page,           setPage]           = useState(1);
  const [shortlisted,    setShortlisted]    = useState(new Set());

  /* ── Filtered + sorted list ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_CANDIDATES.filter((c) =>
      (college === "All"    || c.college === college)        &&
      (dept    === "All"    || c.dept    === dept)           &&
      (tier    === "All"    || c.tier    === tier)           &&
      (region  === "All"    || c.region  === region)         &&
      (year    === "All"    || String(c.year) === year)      &&
      c.skillScore      >= minScore                          &&
      c.leetcode        >= minLeetcode                       &&
      c.hackathonWins   >= minWins                           &&
      (!internshipOnly  || c.hasInternship)                  &&
      (!verifiedOnly    || c.verified)                       &&
      (!q || c.name.toLowerCase().includes(q) || c.college.toLowerCase().includes(q) || c.dept.toLowerCase().includes(q))
    ).sort((a, b) => {
      if (sortKey === "performance") return b.skillScore - a.skillScore;
      if (sortKey === "leetcode")    return b.leetcode   - a.leetcode;
      if (sortKey === "wins")        return b.hackathonWins - a.hackathonWins;
      if (sortKey === "name")        return a.name.localeCompare(b.name);
      return 0;
    });
  }, [search, college, dept, tier, region, year, minScore, minLeetcode, minWins, internshipOnly, verifiedOnly, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const visible    = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetFilters = useCallback(() => {
    setSearch(""); setCollege("All"); setDept("All"); setTier("All"); setRegion("All");
    setYear("All"); setMinScore(0); setMinLeetcode(1300); setMinWins(0);
    setInternshipOnly(false); setVerifiedOnly(false); setPage(1);
  }, []);

  const toggleShortlist = useCallback((id) => {
    setShortlisted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleViewProfile = useCallback((candidate) => {
    navigate("/recruiter/candidate-profile", { state: { candidate } });
  }, [navigate]);

  const goPage = (n) => { setPage(Math.max(1, Math.min(totalPages, n))); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const activeFilterCount = [
    college !== "All", dept !== "All", tier !== "All", region !== "All", year !== "All",
    minScore > 0, minLeetcode > 1300, minWins > 0, internshipOnly, verifiedOnly,
  ].filter(Boolean).length;

  /* Shared filter label style */
  const filterLabel = { fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 };
  const selectStyle = { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12, color: "var(--foreground)", cursor: "pointer", outline: "none" };

  return (
    <div style={{ display: "flex", gap: 0, background: "var(--background)", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <div style={{ width: 224, flexShrink: 0, background: "var(--card)", borderRight: "1px solid var(--border)", padding: "18px 14px", overflowY: "auto", position: "sticky", top: 0, maxHeight: "100vh" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
            Filters {activeFilterCount > 0 && <span style={{ background: "#2b4ed6", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700, marginLeft: 4 }}>{activeFilterCount}</span>}
          </span>
          <button onClick={resetFilters} style={{ fontSize: 11, color: "#2b4ed6", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>Reset all</button>
        </div>

        {/* College */}
        <div style={{ marginBottom: 14 }}>
          <div style={filterLabel}>College</div>
          <select value={college} onChange={(e) => { setCollege(e.target.value); setPage(1); }} style={selectStyle}>
            {COLLEGE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Dept */}
        <div style={{ marginBottom: 14 }}>
          <div style={filterLabel}>Department</div>
          <select value={dept} onChange={(e) => { setDept(e.target.value); setPage(1); }} style={selectStyle}>
            {DEPT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Tier */}
        <div style={{ marginBottom: 14 }}>
          <div style={filterLabel}>College Tier</div>
          <select value={tier} onChange={(e) => { setTier(e.target.value); setPage(1); }} style={selectStyle}>
            {TIER_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Region */}
        <div style={{ marginBottom: 14 }}>
          <div style={filterLabel}>Region</div>
          <select value={region} onChange={(e) => { setRegion(e.target.value); setPage(1); }} style={selectStyle}>
            {REGION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Year */}
        <div style={{ marginBottom: 14 }}>
          <div style={filterLabel}>Year</div>
          <select value={year} onChange={(e) => { setYear(e.target.value); setPage(1); }} style={selectStyle}>
            {["All","1","2","3","4"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Skill Score */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", ...filterLabel, marginBottom: 4 }}>
            <span>Min Skill Score</span><span style={{ color: "var(--foreground)", fontWeight: 700 }}>{minScore}</span>
          </div>
          <input type="range" min={0} max={95} step={5} value={minScore} onChange={(e) => { setMinScore(Number(e.target.value)); setPage(1); }} style={{ width: "100%", accentColor: "#2b4ed6" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--muted-foreground)" }}><span>0</span><span>95</span></div>
        </div>

        {/* LeetCode */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", ...filterLabel, marginBottom: 4 }}>
            <span>Min LeetCode</span><span style={{ color: "var(--foreground)", fontWeight: 700 }}>{minLeetcode}</span>
          </div>
          <input type="range" min={1300} max={2000} step={50} value={minLeetcode} onChange={(e) => { setMinLeetcode(Number(e.target.value)); setPage(1); }} style={{ width: "100%", accentColor: "#2b4ed6" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--muted-foreground)" }}><span>1300</span><span>2000</span></div>
        </div>

        {/* Hackathon Wins */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", ...filterLabel, marginBottom: 4 }}>
            <span>Min Wins</span><span style={{ color: "var(--foreground)", fontWeight: 700 }}>{minWins}</span>
          </div>
          <input type="range" min={0} max={6} step={1} value={minWins} onChange={(e) => { setMinWins(Number(e.target.value)); setPage(1); }} style={{ width: "100%", accentColor: "#2b4ed6" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--muted-foreground)" }}><span>0</span><span>6</span></div>
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Has Internship",  val: internshipOnly, set: setInternshipOnly },
            { label: "Verified Only",   val: verifiedOnly,   set: setVerifiedOnly   },
          ].map(({ label, val, set }) => (
            <label key={label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: "var(--foreground)" }}>
              <input type="checkbox" checked={val} onChange={(e) => { set(e.target.checked); setPage(1); }} style={{ accentColor: "#2b4ed6", width: 13, height: 13 }} />
              {label}
            </label>
          ))}
        </div>

        {/* Shortlist count */}
        {shortlisted.size > 0 && (
          <div style={{ marginTop: 20, padding: "10px 12px", background: "#eef2ff", border: "1px solid #c7d3fb", borderRadius: 7 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2b4ed6", marginBottom: 4 }}>
              <iconify-icon icon="lucide:bookmark-check" style={{ fontSize: 12, marginRight: 4 }} />
              {shortlisted.size} Shortlisted
            </div>
            <button
              onClick={() => navigate("/recruiter/shortlisted")}
              style={{ width: "100%", padding: "5px 0", background: "#2b4ed6", border: "none", borderRadius: 5, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
            >
              View Shortlist
            </button>
          </div>
        )}
      </div>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: "20px 22px", overflowY: "auto", minWidth: 0 }}>

        {/* Header */}
        <div style={{ marginBottom: 14 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", margin: "0 0 3px 0" }}>Candidate Discovery</h1>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: 0 }}>
            {ALL_CANDIDATES.length}+ candidates across {COLLEGES_LIST.length} partnered colleges
          </p>
        </div>

        {/* Search + sort */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <iconify-icon icon="lucide:search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--muted-foreground)" }} />
            <input
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, college, or department…"
              style={{ width: "100%", padding: "8px 30px 8px 30px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12, color: "var(--foreground)", outline: "none", boxSizing: "border-box" }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: 0, display: "flex" }}>
                <iconify-icon icon="lucide:x" style={{ fontSize: 12 }} />
              </button>
            )}
          </div>
          <select value={sortKey} onChange={(e) => { setSortKey(e.target.value); setPage(1); }} style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12, color: "var(--foreground)", cursor: "pointer", outline: "none" }}>
            {SORT_OPT.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Result bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, fontSize: 12, color: "var(--muted-foreground)" }}>
          <span>
            <strong style={{ color: "var(--foreground)" }}>{filtered.length}</strong> candidate{filtered.length !== 1 ? "s" : ""} found
            {filtered.length !== ALL_CANDIDATES.length && <span> · <button onClick={resetFilters} style={{ color: "#2b4ed6", background: "none", border: "none", cursor: "pointer", fontSize: 12, padding: 0, textDecoration: "underline" }}>show all</button></span>}
          </span>
          <span>Page {safePage} of {totalPages}</span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 0", color: "var(--muted-foreground)", fontSize: 13 }}>
            <iconify-icon icon="lucide:users" style={{ fontSize: 36, display: "block", margin: "0 auto 12px" }} />
            No candidates match the current filters.
            <div style={{ marginTop: 10 }}>
              <button onClick={resetFilters} style={{ color: "#2b4ed6", background: "none", border: "none", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>Reset filters</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(268px, 1fr))", gap: 14 }}>
            {visible.map((c, i) => (
              <CandidateCard
                key={c.id}
                candidate={c}
                globalIdx={(safePage - 1) * PAGE_SIZE + i}
                shortlisted={shortlisted.has(c.id)}
                onShortlist={toggleShortlist}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[{ lbl: "«", fn: () => goPage(1) }, { lbl: "‹", fn: () => goPage(safePage - 1) }].map(({ lbl, fn }) => (
                <button key={lbl} onClick={fn} disabled={safePage === 1} style={{ padding: "5px 9px", borderRadius: 5, border: "1px solid var(--border)", background: "transparent", fontSize: 12, cursor: safePage === 1 ? "default" : "pointer", color: safePage === 1 ? "var(--muted-foreground)" : "var(--foreground)", fontWeight: 500 }}>{lbl}</button>
              ))}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 2)
                .reduce((acc, n, idx, arr) => { if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…"); acc.push(n); return acc; }, [])
                .map((n, i) =>
                  n === "…"
                    ? <span key={`e${i}`} style={{ fontSize: 12, color: "var(--muted-foreground)", padding: "0 2px" }}>…</span>
                    : <button key={n} onClick={() => goPage(n)} style={{ padding: "5px 10px", borderRadius: 5, border: "1px solid var(--border)", background: n === safePage ? "#2b4ed6" : "transparent", color: n === safePage ? "#fff" : "var(--foreground)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{n}</button>
                )
              }
              {[{ lbl: "›", fn: () => goPage(safePage + 1) }, { lbl: "»", fn: () => goPage(totalPages) }].map(({ lbl, fn }) => (
                <button key={lbl} onClick={fn} disabled={safePage === totalPages} style={{ padding: "5px 9px", borderRadius: 5, border: "1px solid var(--border)", background: "transparent", fontSize: 12, cursor: safePage === totalPages ? "default" : "pointer", color: safePage === totalPages ? "var(--muted-foreground)" : "var(--foreground)", fontWeight: 500 }}>{lbl}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

