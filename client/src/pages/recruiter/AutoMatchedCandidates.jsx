import { useState, useMemo } from "react";

/* ─── Job reference ───────────────────────────────────────────────────────── */
const JOB_REF = { title: "SDE Intern – Full Stack", id: "JD-2026-041" };

/* ─── Candidate data ──────────────────────────────────────────────────────── */
const ALL_CANDIDATES = [
  {
    id: 1, name: "Vikram Singh", college: "IIT Delhi", dept: "CSE", year: "4th",
    fitScore: 97, skillScore: 95, growthRate: 14,
    skills: [
      { label: "React / Frontend", pct: 95 },
      { label: "Node.js / Backend", pct: 92 },
      { label: "System Design",    pct: 88 },
      { label: "DevOps / CI-CD",   pct: 82 },
    ],
    achievements: 8, hackathons: 3, codingRating: 2184, internships: 2,
    growth: "up", verified: true,
  },
  {
    id: 2, name: "Arjun Mehta", college: "IIT Madras", dept: "CSE", year: "3rd",
    fitScore: 94, skillScore: 91, growthRate: 11,
    skills: [
      { label: "React / Frontend", pct: 91 },
      { label: "Python",           pct: 88 },
      { label: "MongoDB",          pct: 85 },
      { label: "AWS",              pct: 74 },
    ],
    achievements: 6, hackathons: 2, codingRating: 2051, internships: 1,
    growth: "up", verified: true,
  },
  {
    id: 3, name: "Priya Sharma", college: "BITS Pilani", dept: "CS", year: "4th",
    fitScore: 91, skillScore: 89, growthRate: 9,
    skills: [
      { label: "React / Frontend", pct: 90 },
      { label: "Node.js / Backend", pct: 85 },
      { label: "SQL / Databases",  pct: 87 },
      { label: "System Design",    pct: 80 },
    ],
    achievements: 5, hackathons: 2, codingRating: 1980, internships: 2,
    growth: "up", verified: true,
  },
  {
    id: 4, name: "Karan Gupta", college: "IIT Delhi", dept: "ECE-CS", year: "3rd",
    fitScore: 88, skillScore: 86, growthRate: 7,
    skills: [
      { label: "React / Frontend", pct: 86 },
      { label: "Node.js / Backend", pct: 80 },
      { label: "MongoDB",          pct: 78 },
      { label: "AWS",              pct: 70 },
    ],
    achievements: 4, hackathons: 1, codingRating: 1876, internships: 1,
    growth: "stable", verified: true,
  },
  {
    id: 5, name: "Anjali Reddy", college: "IIIT Hyderabad", dept: "CS", year: "4th",
    fitScore: 85, skillScore: 84, growthRate: 8,
    skills: [
      { label: "React / Frontend", pct: 85 },
      { label: "GraphQL",          pct: 78 },
      { label: "SQL / Databases",  pct: 82 },
      { label: "Docker",           pct: 72 },
    ],
    achievements: 5, hackathons: 2, codingRating: 1910, internships: 1,
    growth: "up", verified: true,
  },
  {
    id: 6, name: "Sneha Iyer", college: "VIT Vellore", dept: "CSE", year: "4th",
    fitScore: 81, skillScore: 80, growthRate: 5,
    skills: [
      { label: "React / Frontend", pct: 82 },
      { label: "Node.js / Backend", pct: 76 },
      { label: "MongoDB",          pct: 74 },
      { label: "AWS",              pct: 65 },
    ],
    achievements: 3, hackathons: 1, codingRating: 1754, internships: 1,
    growth: "stable", verified: false,
  },
  {
    id: 7, name: "Rahul Nair", college: "NIT Trichy", dept: "IT", year: "3rd",
    fitScore: 78, skillScore: 77, growthRate: 6,
    skills: [
      { label: "React / Frontend", pct: 78 },
      { label: "Java / Spring",    pct: 82 },
      { label: "SQL / Databases",  pct: 75 },
      { label: "Docker",           pct: 60 },
    ],
    achievements: 3, hackathons: 0, codingRating: 1688, internships: 1,
    growth: "up", verified: false,
  },
  {
    id: 8, name: "Meera Iyer", college: "NIT Warangal", dept: "CSE", year: "4th",
    fitScore: 74, skillScore: 73, growthRate: 4,
    skills: [
      { label: "React / Frontend", pct: 72 },
      { label: "Python",           pct: 80 },
      { label: "ML / Data",        pct: 85 },
      { label: "Node.js / Backend", pct: 60 },
    ],
    achievements: 4, hackathons: 1, codingRating: 1620, internships: 0,
    growth: "stable", verified: true,
  },
];

/* ─── Derived summary stats ───────────────────────────────────────────────── */
const AVG_FIT = Math.round(ALL_CANDIDATES.reduce((s, c) => s + c.fitScore, 0) / ALL_CANDIDATES.length);
const TOP_COLLEGE_MAP = ALL_CANDIDATES.reduce((m, c) => { m[c.college] = (m[c.college] || 0) + 1; return m; }, {});
const TOP_COLLEGE = Object.entries(TOP_COLLEGE_MAP).sort((a, b) => b[1] - a[1])[0][0];
const HIRING_PROB = 87; // %
const TIME_SAVED  = 14; // hours

/* ─── Sort options ────────────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: "fitScore",    label: "AI Fit Score"   },
  { value: "skillScore",  label: "Skill Score"    },
  { value: "growthRate",  label: "Growth Rate"    },
  { value: "codingRating",label: "Coding Rating"  },
  { value: "hackathons",  label: "Hackathons"     },
];

/* ─── Zone → college map ──────────────────────────────────────────────────── */
const ZONES = {
  North: ["IIT Delhi", "Delhi Technological University", "NIT Kurukshetra"],
  South: ["IIT Madras", "IIIT Hyderabad", "NIT Trichy", "NIT Warangal", "VIT Vellore"],
  West:  ["IIT Bombay", "BITS Pilani", "VJTI Mumbai"],
  East:  ["IIT Kharagpur", "Jadavpur University", "NIT Durgapur"],
};

/* ─── Filter option arrays ────────────────────────────────────────────────── */
const SKILL_OPTIONS    = ["DSA", "React", "Node.js", "Python", "ML/AI", "System Design", "DevOps", "SQL", "Java", "AWS", "MongoDB", "GraphQL"];
const DOMAIN_OPTIONS   = ["Full Stack", "Frontend", "Backend", "Data Science", "DevOps", "Mobile", "Blockchain", "Security"];
const YEAR_OPTIONS     = ["1st", "2nd", "3rd", "4th"];
const EXPERIENCE_OPTS  = ["Beginner", "Intermediate", "Advanced"];

/* ─── AI match scoring ────────────────────────────────────────────────────── */
// Skill labels ↔ requirement keywords mapping
const SKILL_KEYWORD_MAP = {
  "dsa":           ["dsa", "algorithm", "data struct"],
  "react":         ["react", "frontend"],
  "node.js":       ["node", "backend", "express"],
  "python":        ["python"],
  "ml/ai":         ["ml", "machine", "data", "ai"],
  "system design": ["system"],
  "devops":        ["devops", "docker", "ci-cd", "aws"],
  "sql":           ["sql", "database", "db"],
  "java":          ["java", "spring"],
  "aws":           ["aws", "cloud"],
  "mongodb":       ["mongodb", "mongo"],
  "graphql":       ["graphql"],
};

function computeAIMatchScore(candidate, req) {
  let score = 0;

  // 1. Skill overlap — 40 pts
  if (req.skills.length > 0) {
    const cLabels = candidate.skills.map((s) => s.label.toLowerCase());
    const matched = req.skills.filter((sk) => {
      const terms = SKILL_KEYWORD_MAP[sk.toLowerCase()] || [sk.toLowerCase()];
      return cLabels.some((cl) => terms.some((t) => cl.includes(t)));
    });
    score += Math.round((matched.length / req.skills.length) * 40);
  } else {
    score += 40;
  }

  // 2. Skill score vs minimum — 25 pts
  const threshold = Math.max(req.minSkillScore, 1);
  score += Math.round(Math.min(candidate.skillScore / threshold, 1) * 25);

  // 3. Experience level alignment — 10 pts
  const yearMap    = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4 };
  const expRanges  = { Beginner: [1, 2], Intermediate: [2, 3], Advanced: [3, 4] };
  const yearStr    = (candidate.year || "").replace(/\s*yr/i, "").trim();
  const yearNum    = yearMap[yearStr] || 0;
  if (req.experience && req.experience !== "Any") {
    const [lo, hi]  = expRanges[req.experience] || [1, 4];
    score += yearNum >= lo && yearNum <= hi ? 10 : 2;
  } else if (req.years && req.years.length > 0) {
    score += req.years.includes(yearStr + " yr") || req.years.includes(yearStr) ? 10 : 2;
  } else {
    score += 10;
  }

  // 4. Achievements & hackathons — up to 15 pts
  score += Math.min((candidate.hackathons || 0) * 3 + (candidate.achievements || 0), 15);

  // 5. Verified — 10 pts
  if (candidate.verified) score += 10;

  return Math.min(score, 100);
}

/* ─── Token styles ────────────────────────────────────────────────────────── */
const S = {
  page:   { padding: "28px 32px", background: "var(--background, #f8fafc)", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" },
  card:   { background: "var(--card, #fff)", border: "1px solid var(--border, #e2e8f0)", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" },
  label:  { fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted-foreground, #64748b)" },
  chip:   { display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 9px", borderRadius: "4px", fontSize: "11px", fontWeight: 500, background: "var(--secondary, #f8fafc)", color: "var(--foreground, #0f172a)" },
};

const fitBadge = () => ({
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "4px",
  background: "var(--foreground, #0f172a)",
  color: "#fff",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.01em",
  whiteSpace: "nowrap",
  flexShrink: 0,
});

/* ─── Skill bar ───────────────────────────────────────────────────────────── */
function SkillBar({ label, pct }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
      <span style={{ fontSize: "11px", color: "var(--muted-foreground, #64748b)", width: "130px", flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "var(--border, #e2e8f0)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "3px",
            background: pct >= 85 ? "var(--primary, #2b4ed6)" : pct >= 70 ? "#60a5fa" : "#bfdbfe",
          }}
        />
      </div>
      <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--foreground, #0f172a)", width: "30px", textAlign: "right" }}>{pct}</span>
    </div>
  );
}

/* ─── Stat chip ───────────────────────────────────────────────────────────── */
function StatChip({ icon, label, value }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 10px",
        borderRadius: "4px",
        border: "1px solid var(--border, #e2e8f0)",
        background: "var(--secondary, #f8fafc)",
        fontSize: "11px",
        color: "var(--muted-foreground, #64748b)",
      }}
    >
      <iconify-icon icon={icon} style={{ fontSize: "12px", color: "var(--muted-foreground, #64748b)" }}></iconify-icon>
      <span style={{ fontWeight: 400 }}>{label}:</span>
      <span style={{ fontWeight: 600, color: "var(--foreground, #0f172a)" }}>{value}</span>
    </div>
  );
}

/* ─── Candidate row ───────────────────────────────────────────────────────── */
function CandidateRow({ candidate, rank, shortlisted, onShortlist, aiScore }) {
  const isSL  = shortlisted.includes(candidate.id);
  const c     = candidate;
  const showAI = aiScore !== undefined;
  // Colour the AI badge by score tier
  const aiBg  = showAI ? (aiScore >= 80 ? "#166534" : aiScore >= 60 ? "#1d4ed8" : "#92400e") : null;
  const aiFg  = showAI ? "#fff" : null;

  return (
    <div
      style={{
        ...S.card,
        padding: "18px 20px",
        borderLeft: isSL ? "3px solid #2563eb" : "3px solid transparent",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>

        {/* Rank */}
        <div
          style={{
            width: "28px",
            flexShrink: 0,
            fontSize: "12px",
            fontWeight: 600,
            color: rank <= 3 ? "var(--primary, #2b4ed6)" : "var(--muted-foreground, #94a3b8)",
            paddingTop: "2px",
          }}
        >
          #{rank}
        </div>

        {/* Avatar */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "6px",
            background: "var(--primary, #2b4ed6)",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            letterSpacing: "0.05em",
          }}
        >
          {c.name.split(" ").map((n) => n[0]).join("")}
        </div>

        {/* Name + college */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground, #0f172a)" }}>{c.name}</span>
            {c.verified && (
              <span
                style={{
                  display: "inline-flex", alignItems: "center", gap: "3px",
                  fontSize: "10px", fontWeight: 600, color: "#15803d",
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  padding: "1px 6px", borderRadius: "3px",
                }}
              >
                <iconify-icon icon="lucide:shield-check" style={{ fontSize: "10px" }}></iconify-icon>
                Verified
              </span>
            )}
            <span
              style={{
                fontSize: "10px", fontWeight: 500, color: "var(--muted-foreground, #64748b)",
                background: "var(--secondary, #f1f5f9)", padding: "1px 6px", borderRadius: "3px",
              }}
            >
              {c.dept} · {c.year} yr
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted-foreground, #64748b)", marginTop: "2px" }}>{c.college}</div>
        </div>

        {/* Score badge */}
        <div style={{ flexShrink: 0, textAlign: "right" }}>
          {showAI ? (
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-end", gap: "3px" }}>
              <div style={{ ...fitBadge(), background: aiBg, display: "flex", alignItems: "center", gap: "4px" }}>
                <iconify-icon icon="lucide:sparkles" style={{ fontSize: "11px" }}></iconify-icon>
                {aiScore}% AI Match
              </div>
              <div style={{ fontSize: "10px", color: "var(--muted-foreground, #94a3b8)" }}>Fit: {c.fitScore}%</div>
            </div>
          ) : (
            <div style={fitBadge()}>{c.fitScore}% Fit</div>
          )}
          <div style={{ fontSize: "10px", color: "var(--muted-foreground, #94a3b8)", marginTop: "4px", textAlign: "right" }}>
            {c.growth === "up"
              ? <span style={{ color: "#16a34a", fontWeight: 500 }}>↑ Improving +{c.growthRate}%</span>
              : <span style={{ color: "var(--muted-foreground, #94a3b8)" }}>→ Stable</span>
            }
          </div>
        </div>
      </div>

      {/* Skill breakdown */}
      <div style={{ marginTop: "14px", paddingLeft: "42px" }}>
        <div style={{ ...S.label, marginBottom: "8px" }}>Skill Match Breakdown</div>
        {c.skills.map((sk) => (
          <SkillBar key={sk.label} label={sk.label} pct={sk.pct} />
        ))}
      </div>

      {/* Stats row */}
      <div
        style={{
          marginTop: "12px",
          paddingLeft: "42px",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <StatChip icon="lucide:award"        label="Achievements"  value={c.achievements} />
          <StatChip icon="lucide:trophy"       label="Hackathons"    value={c.hackathons} />
          <StatChip icon="lucide:code-2"       label="Coding Rating" value={c.codingRating} />
          <StatChip icon="lucide:briefcase"    label="Internships"   value={c.internships} />
          <StatChip icon="lucide:bar-chart-2"  label="Skill Score"   value={`${c.skillScore}/100`} />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <button
            style={{
              padding: "7px 16px",
              borderRadius: "5px",
              border: "none",
              background: "var(--primary, #2b4ed6)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            View Profile
          </button>
          <button
            onClick={() => onShortlist(c.id)}
            style={{
              padding: "7px 14px",
              borderRadius: "5px",
              border: `1px solid ${isSL ? "var(--primary, #2b4ed6)" : "var(--border, #e2e8f0)"}`,
              background: isSL ? "#eff6ff" : "transparent",
              color: isSL ? "var(--primary, #2b4ed6)" : "var(--muted-foreground, #64748b)",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <iconify-icon
              icon={isSL ? "lucide:bookmark-check" : "lucide:bookmark"}
              style={{ fontSize: "13px" }}
            ></iconify-icon>
            {isSL ? "Shortlisted" : "Shortlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Summary panel ───────────────────────────────────────────────────────── */
function SummaryPanel({ candidates }) {
  const filteredAvg = candidates.length
    ? Math.round(candidates.reduce((s, c) => s + c.fitScore, 0) / candidates.length)
    : 0;

  const rows = [
    { label: "Average Fit Score",          value: `${filteredAvg}%`,     icon: "lucide:target" },
    { label: "Top Represented College",    value: TOP_COLLEGE,            icon: "lucide:building-2" },
    { label: "Hiring Probability",         value: `${HIRING_PROB}%`,     icon: "lucide:trending-up" },
    { label: "Screening Time Saved",       value: `~${TIME_SAVED} hrs`,  icon: "lucide:clock-4" },
  ];

  return (
    <div style={{ width: "256px", flexShrink: 0 }}>
      <div style={{ ...S.card, padding: "18px" }}>
        <div style={{ ...S.label, marginBottom: "14px" }}>Match Summary</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {rows.map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                paddingBottom: "12px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{
                  width: "28px", height: "28px", borderRadius: "5px",
                  background: "var(--secondary, #f1f5f9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <iconify-icon icon={r.icon} style={{ fontSize: "13px", color: "var(--primary, #2b4ed6)" }}></iconify-icon>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--muted-foreground, #64748b)", fontWeight: 400, marginBottom: "2px" }}>
                  {r.label}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground, #0f172a)" }}>{r.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Shortlist cta */}
        <div
          style={{
            marginTop: "6px",
            padding: "12px",
            borderRadius: "6px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--primary, #2b4ed6)", marginBottom: "4px" }}>
            AI Recommendation
          </div>
          <div style={{ fontSize: "11px", color: "var(--muted-foreground, #64748b)", lineHeight: 1.5 }}>
            Top 3 candidates exceed the 90% fit threshold. Consider fast-track screening.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export default function AutoMatchedCandidates() {
  /* ── Requirements state ── */
  const [reqOpen,        setReqOpen]        = useState(true);
  const [reqSkills,      setReqSkills]      = useState([]);
  const [reqDomains,     setReqDomains]     = useState([]);
  const [reqExperience,  setReqExperience]  = useState("Any");
  const [reqMinSkill,    setReqMinSkill]    = useState(60);
  const [reqCgpaMin,     setReqCgpaMin]     = useState("");
  const [reqCgpaMax,     setReqCgpaMax]     = useState("");
  const [reqYears,       setReqYears]       = useState([]);

  /* ── Location state ── */
  const [reqZone,     setReqZone]     = useState("");
  const [reqColleges, setReqColleges] = useState([]);

  /* ── Results state ── */
  const [hasRun,    setHasRun]    = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode,  setViewMode]  = useState("ai"); // "ai" | "all"

  /* ── List controls ── */
  const [sortKey,     setSortKey]     = useState("fitScore");
  const [minFit,      setMinFit]      = useState(60);
  const [shortlisted, setShortlisted] = useState([]);

  const toggle = (id) =>
    setShortlisted((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  /* ── Toggle helper for multi-select arrays ── */
  const toggleItem = (arr, setArr, item) =>
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);

  /* ── College list available under the selected zone ── */
  const availableColleges = useMemo(
    () => reqZone ? (ZONES[reqZone] || []) : Object.values(ZONES).flat().sort(),
    [reqZone],
  );

  /* ── Location-filtered candidate pool ── */
  const locationPool = useMemo(() => {
    // Specific colleges override zone
    if (reqColleges.length > 0)
      return ALL_CANDIDATES.filter((c) => reqColleges.includes(c.college));
    if (reqZone)
      return ALL_CANDIDATES.filter((c) => (ZONES[reqZone] || []).includes(c.college));
    return ALL_CANDIDATES;
  }, [reqZone, reqColleges]);

  /* ── AI-scored results (computed after Run) ── */
  const aiResults = useMemo(() => {
    if (!hasRun) return [];
    const req = { skills: reqSkills, minSkillScore: reqMinSkill, experience: reqExperience, domains: reqDomains, years: reqYears };
    return locationPool
      .map((c) => ({ ...c, aiScore: computeAIMatchScore(c, req) }))
      .sort((a, b) => b.aiScore - a.aiScore);
  }, [hasRun, locationPool, reqSkills, reqMinSkill, reqExperience, reqDomains, reqYears]);

  /* ── Visible candidates ── */
  const visible = useMemo(() => {
    if (!hasRun) {
      return [...locationPool]
        .filter((c) => c.fitScore >= minFit)
        .sort((a, b) => b[sortKey] - a[sortKey]);
    }
    const base = viewMode === "ai" ? aiResults.filter((c) => c.aiScore >= 60) : aiResults;
    return [...base].sort((a, b) => b.aiScore - a.aiScore);
  }, [hasRun, locationPool, minFit, sortKey, aiResults, viewMode]);

  /* ── Run AI match (with simulated loading) ── */
  const handleRunMatch = () => {
    setIsLoading(true);
    setHasRun(false);
    setTimeout(() => { setHasRun(true); setIsLoading(false); }, 1200);
  };

  /* ── Active filter badges (for display) ── */
  const activeBadges = [
    ...(reqZone ? [{ label: `Zone: ${reqZone}`, clear: () => { setReqZone(""); setReqColleges([]); } }] : []),
    ...reqColleges.map((cl) => ({ label: cl, clear: () => setReqColleges((p) => p.filter((x) => x !== cl)) })),
    ...reqSkills.map((sk) => ({ label: sk, clear: () => setReqSkills((p) => p.filter((x) => x !== sk)) })),
    ...(reqExperience !== "Any" ? [{ label: `Exp: ${reqExperience}`, clear: () => setReqExperience("Any") }] : []),
    ...reqYears.map((y) => ({ label: `Year: ${y}`, clear: () => setReqYears((p) => p.filter((x) => x !== y)) })),
    ...(reqMinSkill > 0 ? [{ label: `Skill ≥ ${reqMinSkill}`, clear: () => setReqMinSkill(0) }] : []),
    ...(reqCgpaMin ? [{ label: `CGPA ≥ ${reqCgpaMin}`, clear: () => setReqCgpaMin("") }] : []),
  ];

  const clearAllFilters = () => {
    setReqSkills([]); setReqDomains([]); setReqExperience("Any");
    setReqMinSkill(0); setReqYears([]); setReqCgpaMin(""); setReqCgpaMax("");
    setReqZone(""); setReqColleges([]);
  };

  /* ── Result summary numbers ── */
  const uniqueCollegeCount = hasRun ? new Set(visible.map((c) => c.college)).size : 0;

  const inputSt = { width: "100%", boxSizing: "border-box", padding: "7px 10px", borderRadius: "6px", border: "1px solid var(--border, #e2e8f0)", background: "var(--card, #fff)", fontSize: "12px", color: "var(--foreground, #0f172a)", outline: "none" };
  const selectSt = { ...inputSt, cursor: "pointer" };
  const toggleBtnSt = (active) => ({
    padding: "5px 12px", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: active ? 600 : 400,
    border: `1px solid ${active ? "var(--primary, #2b4ed6)" : "var(--border, #e2e8f0)"}`,
    background: active ? "#eff6ff" : "var(--card, #fff)",
    color: active ? "var(--primary, #2b4ed6)" : "var(--muted-foreground, #64748b)",
  });

  return (
    <div style={S.page}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: "18px" }}>
        <h1 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground, #0f172a)", margin: "0 0 3px 0" }}>
          AI-Matched Candidates
        </h1>
        <div style={{ fontSize: "13px", color: "var(--muted-foreground, #64748b)", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, color: "var(--foreground, #0f172a)" }}>{JOB_REF.title}</span>
          <span>·</span>
          <span>{JOB_REF.id}</span>
          {hasRun && !isLoading && (
            <>
              <span>·</span>
              <span style={{ fontWeight: 600, color: "#15803d", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "1px 8px", borderRadius: "4px", fontSize: "12px" }}>
                <iconify-icon icon="lucide:check-circle" style={{ fontSize: "11px", marginRight: "4px" }}></iconify-icon>
                {visible.length} candidate{visible.length !== 1 ? "s" : ""} matched from {uniqueCollegeCount} college{uniqueCollegeCount !== 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          REQUIREMENTS CARD
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ ...S.card, marginBottom: "16px" }}>

        {/* Collapsible header */}
        <button
          onClick={() => setReqOpen((o) => !o)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 18px", background: "none", border: "none", cursor: "pointer",
            borderBottom: reqOpen ? "1px solid var(--border, #e2e8f0)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <iconify-icon icon="lucide:settings-2" style={{ fontSize: "15px", color: "var(--primary, #2b4ed6)" }}></iconify-icon>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground, #0f172a)" }}>
              Define Candidate Requirements
            </span>
            {activeBadges.length > 0 && (
              <span style={{ padding: "1px 8px", borderRadius: "10px", background: "#eff6ff", color: "var(--primary, #2b4ed6)", fontSize: "11px", fontWeight: 700, border: "1px solid #bfdbfe" }}>
                {activeBadges.length} active
              </span>
            )}
          </div>
          <iconify-icon
            icon={reqOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
            style={{ fontSize: "16px", color: "var(--muted-foreground, #64748b)" }}
          ></iconify-icon>
        </button>

        {reqOpen && (
          <div style={{ padding: "18px" }}>

            {/* ── Skills multi-select ── */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ ...S.label, marginBottom: "8px" }}>Required Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {SKILL_OPTIONS.map((sk) => (
                  <button key={sk} onClick={() => toggleItem(reqSkills, setReqSkills, sk)}
                    style={toggleBtnSt(reqSkills.includes(sk))}>
                    {sk}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Row: skill score / experience / CGPA / year ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>

              {/* Min skill score slider */}
              <div>
                <div style={{ ...S.label, marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
                  <span>Min Skill Score</span>
                  <span style={{ fontWeight: 700, color: "var(--foreground, #0f172a)", textTransform: "none", letterSpacing: 0 }}>{reqMinSkill}</span>
                </div>
                <input type="range" min={0} max={100} step={5} value={reqMinSkill}
                  onChange={(e) => setReqMinSkill(+e.target.value)}
                  style={{ width: "100%", accentColor: "#2b4ed6", cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--muted-foreground, #94a3b8)", marginTop: "2px" }}>
                  <span>0</span><span>100</span>
                </div>
              </div>

              {/* Experience level */}
              <div>
                <div style={{ ...S.label, marginBottom: "6px" }}>Experience Level</div>
                <select value={reqExperience} onChange={(e) => setReqExperience(e.target.value)} style={selectSt}>
                  <option value="Any">Any Level</option>
                  {EXPERIENCE_OPTS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              {/* CGPA range */}
              <div>
                <div style={{ ...S.label, marginBottom: "6px" }}>CGPA Range</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input type="number" min="0" max="10" step="0.1" placeholder="Min"
                    value={reqCgpaMin} onChange={(e) => setReqCgpaMin(e.target.value)}
                    style={{ ...inputSt, width: "calc(50% - 10px)" }} />
                  <span style={{ fontSize: "12px", color: "var(--muted-foreground, #64748b)" }}>–</span>
                  <input type="number" min="0" max="10" step="0.1" placeholder="Max"
                    value={reqCgpaMax} onChange={(e) => setReqCgpaMax(e.target.value)}
                    style={{ ...inputSt, width: "calc(50% - 10px)" }} />
                </div>
              </div>

              {/* Year of study */}
              <div>
                <div style={{ ...S.label, marginBottom: "6px" }}>Year of Study</div>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {YEAR_OPTIONS.map((y) => (
                    <button key={y} onClick={() => toggleItem(reqYears, setReqYears, y)}
                      style={{ ...toggleBtnSt(reqYears.includes(y)), padding: "5px 10px" }}>
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Preferred domains ── */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ ...S.label, marginBottom: "8px" }}>Preferred Domains</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {DOMAIN_OPTIONS.map((d) => {
                  const on = reqDomains.includes(d);
                  return (
                    <button key={d} onClick={() => toggleItem(reqDomains, setReqDomains, d)}
                      style={{
                        padding: "5px 12px", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: on ? 600 : 400,
                        border: `1px solid ${on ? "#0891b2" : "var(--border, #e2e8f0)"}`,
                        background: on ? "#ecfeff" : "var(--card, #fff)",
                        color: on ? "#0369a1" : "var(--muted-foreground, #64748b)",
                      }}>
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Location filters ── */}
            <div style={{ borderTop: "1px solid var(--border, #e2e8f0)", paddingTop: "16px", marginBottom: "14px" }}>
              <div style={{ ...S.label, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <iconify-icon icon="lucide:map-pin" style={{ fontSize: "12px" }}></iconify-icon>
                Location Filters
                <span style={{ fontSize: "10px", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--muted-foreground, #94a3b8)" }}>
                  {reqColleges.length > 0
                    ? "· Specific colleges selected (overrides zone)"
                    : reqZone
                    ? `· Filtering from ${reqZone} zone only`
                    : "· All India (no location filter)"}
                </span>
              </div>
              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>

                {/* Zone dropdown */}
                <div style={{ minWidth: "180px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--muted-foreground, #64748b)", marginBottom: "6px" }}>Zone</div>
                  <select value={reqZone}
                    onChange={(e) => { setReqZone(e.target.value); setReqColleges([]); }}
                    style={selectSt}>
                    <option value="">All India (no zone filter)</option>
                    {Object.keys(ZONES).map((z) => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>

                {/* College multi-select buttons */}
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--muted-foreground, #64748b)", marginBottom: "6px" }}>
                    Colleges&nbsp;
                    <span style={{ fontWeight: 400 }}>
                      {reqZone ? `(${availableColleges.length} in ${reqZone} zone)` : `(all ${availableColleges.length})`}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {availableColleges.map((cl) => {
                      const on = reqColleges.includes(cl);
                      return (
                        <button key={cl} onClick={() => toggleItem(reqColleges, setReqColleges, cl)}
                          style={{
                            padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: on ? 600 : 400,
                            border: `1px solid ${on ? "#7c3aed" : "var(--border, #e2e8f0)"}`,
                            background: on ? "#f5f3ff" : "var(--card, #fff)",
                            color: on ? "#5b21b6" : "var(--muted-foreground, #64748b)",
                          }}>
                          {cl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Active filter badges ── */}
            {activeBadges.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontSize: "11px", color: "var(--muted-foreground, #64748b)", fontWeight: 600 }}>Active filters:</span>
                {activeBadges.map((b, i) => (
                  <span key={i}
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 8px", borderRadius: "4px", background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: "11px", fontWeight: 500, color: "var(--primary, #2b4ed6)" }}>
                    {b.label}
                    <button onClick={b.clear}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary, #2b4ed6)", fontSize: "13px", padding: "0 0 0 2px", lineHeight: 1 }}>
                      ×
                    </button>
                  </span>
                ))}
                <button onClick={clearAllFilters}
                  style={{ fontSize: "11px", color: "var(--muted-foreground, #64748b)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>
                  Clear all
                </button>
              </div>
            )}

            {/* ── Run AI Match button ── */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "var(--muted-foreground, #64748b)" }}>
                {locationPool.length} candidate{locationPool.length !== 1 ? "s" : ""} in pool
              </span>
              <button
                onClick={handleRunMatch}
                disabled={isLoading}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "9px 22px", borderRadius: "6px", border: "none",
                  background: isLoading ? "#94a3b8" : "var(--primary, #2b4ed6)",
                  color: "#fff", fontSize: "13px", fontWeight: 700,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                <iconify-icon
                  icon={isLoading ? "lucide:loader" : "lucide:brain-circuit"}
                  style={{ fontSize: "15px" }}
                ></iconify-icon>
                {isLoading ? "Matching…" : hasRun ? "Re-Run AI Match" : "Run AI Match"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CONTROLS BAR (sort / view toggle / shortlist count)
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>

        {/* Left: view toggle (once AI has run) or pool info */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {hasRun && !isLoading ? (
            <>
              <button onClick={() => setViewMode("ai")}
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "6px 14px", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: viewMode === "ai" ? 700 : 400,
                  border: `1px solid ${viewMode === "ai" ? "var(--primary, #2b4ed6)" : "var(--border, #e2e8f0)"}`,
                  background: viewMode === "ai" ? "#eff6ff" : "var(--card, #fff)",
                  color: viewMode === "ai" ? "var(--primary, #2b4ed6)" : "var(--muted-foreground, #64748b)",
                }}>
                <iconify-icon icon="lucide:sparkles" style={{ fontSize: "12px" }}></iconify-icon>
                AI Recommended
              </button>
              <button onClick={() => setViewMode("all")}
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "6px 14px", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: viewMode === "all" ? 700 : 400,
                  border: `1px solid ${viewMode === "all" ? "var(--primary, #2b4ed6)" : "var(--border, #e2e8f0)"}`,
                  background: viewMode === "all" ? "#eff6ff" : "var(--card, #fff)",
                  color: viewMode === "all" ? "var(--primary, #2b4ed6)" : "var(--muted-foreground, #64748b)",
                }}>
                <iconify-icon icon="lucide:users" style={{ fontSize: "12px" }}></iconify-icon>
                View All Candidates
              </button>
            </>
          ) : (
            <div style={{ fontSize: "13px", color: "var(--muted-foreground, #64748b)" }}>
              {locationPool.length} candidates in pool
              {reqZone && (
                <span style={{ marginLeft: "8px", fontSize: "11px", background: "#eff6ff", color: "var(--primary, #2b4ed6)", padding: "1px 8px", borderRadius: "3px", fontWeight: 600, border: "1px solid #bfdbfe" }}>
                  {reqZone} zone
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: sort + min fit slider + shortlist badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {!hasRun && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 12px", border: "1px solid #e2e8f0", borderRadius: "6px", background: "#fff", fontSize: "12px", color: "#334155" }}>
              <iconify-icon icon="lucide:sliders-horizontal" style={{ fontSize: "13px", color: "#64748b" }}></iconify-icon>
              <span style={{ fontWeight: 500 }}>Min Fit:</span>
              <input type="range" min={50} max={95} step={5} value={minFit}
                onChange={(e) => setMinFit(Number(e.target.value))}
                style={{ width: "72px", accentColor: "#2563eb", cursor: "pointer" }} />
              <span style={{ fontWeight: 600, color: "var(--foreground, #0f172a)", minWidth: "28px" }}>{minFit}%</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "var(--muted-foreground, #64748b)" }}>Sort:</span>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} style={{ ...selectSt, width: "auto", padding: "7px 10px" }}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {shortlisted.length > 0 && (
            <div style={{ padding: "7px 12px", borderRadius: "6px", background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: "12px", fontWeight: 600, color: "var(--primary, #2b4ed6)", display: "flex", alignItems: "center", gap: "5px" }}>
              <iconify-icon icon="lucide:bookmark-check" style={{ fontSize: "13px" }}></iconify-icon>
              {shortlisted.length} shortlisted
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          LOADING SPINNER
      ══════════════════════════════════════════════════════════════ */}
      {isLoading && (
        <div style={{ ...S.card, padding: "52px 24px", textAlign: "center", marginBottom: "18px" }}>
          <style>{`@keyframes ai-spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", border: "3px solid var(--border, #e2e8f0)", borderTop: "3px solid var(--primary, #2b4ed6)", borderRadius: "50%", animation: "ai-spin 0.75s linear infinite" }} />
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground, #0f172a)", marginBottom: "4px" }}>Running AI Match…</div>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground, #64748b)" }}>
                Scoring {locationPool.length} candidates against your requirements
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CANDIDATE LIST + SUMMARY SIDEBAR
      ══════════════════════════════════════════════════════════════ */}
      {!isLoading && (
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

          {/* Candidate cards */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {visible.length === 0 ? (
              <div style={{ ...S.card, padding: "48px 24px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
                <iconify-icon icon="lucide:user-x" style={{ fontSize: "32px", display: "block", margin: "0 auto 12px", color: "#cbd5e1" }}></iconify-icon>
                {hasRun
                  ? "No candidates matched your criteria. Try relaxing the requirements or switching to \"View All Candidates\"."
                  : "No candidates meet the minimum fit score. Try lowering the slider."}
              </div>
            ) : (
              visible.map((c, i) => (
                <CandidateRow
                  key={c.id}
                  candidate={c}
                  rank={i + 1}
                  shortlisted={shortlisted}
                  onShortlist={toggle}
                  aiScore={hasRun ? c.aiScore : undefined}
                />
              ))
            )}
          </div>

          {/* Summary sidebar */}
          <SummaryPanel candidates={visible} />

        </div>
      )}
    </div>
  );
}