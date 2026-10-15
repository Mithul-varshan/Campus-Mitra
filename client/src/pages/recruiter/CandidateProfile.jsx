import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";

/* ─── Deterministic enrichment helpers ─────────────────────────────────────── */
function hx(n) { return Math.abs((((n >>> 0) * 2654435761) >>> 0) % 1000); }

const COLLEGE_EMAIL_DOMAINS = {
  "IIT Bombay": "iitb.ac.in", "IIT Delhi": "iitd.ac.in", "IIT Madras": "iitm.ac.in",
  "IIT Kanpur": "iitk.ac.in", "IIT Kharagpur": "iitkgp.ac.in",
  "BITS Pilani": "pilani.bits-pilani.ac.in", "BITS Hyderabad": "hyderabad.bits-pilani.ac.in",
  "BITS Goa": "goa.bits-pilani.ac.in", "IIIT Hyderabad": "iiit.ac.in",
  "NIT Trichy": "nitt.edu", "NIT Warangal": "nitw.ac.in",
};
const DEPT_SKILL_MAP = {
  "CSE":          [["DSA",92],["System Design",78],["ML / AI",85],["Web Dev",80],["DevOps",65],["Databases",83]],
  "IT":           [["Web Dev",88],["Databases",80],["Cloud",72],["DevOps",75],["APIs",82],["Security",68]],
  "ECE":          [["Embedded",85],["Signal Proc",78],["VLSI",70],["IoT",80],["Communication",75],["Circuits",82]],
  "EEE":          [["Power Sys",80],["Control Sys",75],["Electronics",85],["Machines",70],["Circuits",78],["DSP",72]],
  "Mech":         [["CAD/CAM",82],["Thermodynamics",78],["Fluid Mech",74],["FEA",76],["Manufacturing",80],["Robotics",70]],
  "CS + Finance": [["DSA",85],["Quant Finance",80],["ML / AI",82],["Statistics",78],["Databases",75],["Web Dev",72]],
  "ECE + CS":     [["DSA",82],["Embedded",78],["ML / AI",80],["Signal Proc",72],["Web Dev",75],["IoT",70]],
  "CS + Maths":   [["DSA",90],["Linear Algebra",82],["ML / AI",85],["Statistics",80],["Algorithms",88],["Discrete Math",80]],
  "DS":           [["ML / AI",90],["Statistics",86],["Data Viz",80],["Databases",78],["Python",88],["Deep Learning",82]],
  "CyberSec":     [["Network Sec",85],["Cryptography",80],["Pen Testing",78],["Forensics",70],["Web Sec",82],["Compliance",72]],
  "AI/ML":        [["Deep Learning",92],["ML / AI",90],["NLP",82],["Computer Vision",85],["MLOps",75],["Statistics",80]],
  "Full Stack":   [["React",88],["Node.js",84],["Databases",80],["APIs",86],["DevOps",72],["UI/UX",76]],
};
const MONTHS_LABELS = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr"];

function enrichCandidate(base) {
  const id = base.id ?? 1;
  const firstName = base.name.split(" ")[0].toLowerCase();
  const domain = COLLEGE_EMAIL_DOMAINS[base.college] ?? "college.edu.in";
  const deptKey = base.dept in DEPT_SKILL_MAP ? base.dept : "CSE";
  const skillRows = DEPT_SKILL_MAP[deptKey];

  const gpaTier = base.tier === "T1" ? 8.4 : base.tier === "T2" ? 7.8 : 7.2;
  const gpa = (gpaTier + (hx(id * 17) % 16) / 10).toFixed(1);

  const rollNo = base.dept.replace(/[^A-Z]/gi,"").slice(0,2).toUpperCase() +
    String(2024 - base.year).slice(2) + "B" + String(id).padStart(3,"0");

  const email     = `${firstName}.${id}@${domain}`;
  const linkedin  = `linkedin.com/in/${firstName}-${(base.name.split(" ")[1] ?? "").toLowerCase()}`;
  const github    = `github.com/${firstName}${id}`;
  const months    = ["Jan","Feb","Mar","Apr","May","Jun"];
  const available = months[hx(id * 3) % months.length] + " " + (2025 + (hx(id * 7) % 2));

  const skillBars = skillRows.map(([skill, base_score], si) => ({
    skill,
    score: Math.min(99, base_score - 4 + hx(id * (si + 1) * 7) % 16 +
      (base.tier === "T1" ? 5 : base.tier === "T2" ? 2 : 0)),
  }));

  const startScore = Math.max(50, base.skillScore - 20);
  const startLeet  = Math.max(1100, base.leetcode - 280);
  const growth = MONTHS_LABELS.slice(0, 8).map((m, mi) => ({
    month: m + "'" + (mi < 5 ? "24" : "25"),
    skillScore: Math.round(startScore + ((base.skillScore - startScore) * mi) / 7 + (hx(id * mi + 3) % 4 - 2)),
    leetcode:   Math.round(startLeet  + ((base.leetcode   - startLeet)   * mi) / 7 + (hx(id * mi + 9) % 30 - 15)),
  }));

  const HACK_EVENTS = [
    "National AI Hackathon 2025","Smart India Hackathon 2024","IIT Bombay Techfest 2024",
    "Flipkart GRiD 5.0","HackMIT 2024","CodeForGood 2024","Unstop Hackathon 2025",
    "Microsoft Imagine Cup 2024","Google Solution Challenge 2025","Inter-IIT Tech Meet 2024",
  ];
  const HACK_PRIZES = ["₹1,00,000","₹50,000","₹25,000","₹10,000","Certificate","Swag Kit","Internship Offer"];
  const hackathons = Array.from({ length: Math.max(1, base.hackathonWins) }, (_, hi) => ({
    event: HACK_EVENTS[(id * (hi + 3)) % HACK_EVENTS.length],
    rank:  hi === 0 ? "1st of " + (120 + hx(id) % 220) + " teams"
                    : (hi + 2) + "nd of " + (80 + hx(id * hi) % 150) + " teams",
    prize: HACK_PRIZES[hx(id * (hi + 1)) % HACK_PRIZES.length],
    verified: hx(id * hi + 5) % 3 !== 0,
  }));

  const ACH_TYPES = ["hackathon","exam","program","research"];
  const ACH_RESULTS = [
    "Winner — {yr} Edition","Top 10 Nationally","AIR {n} · CS","Selected Contributor",
    "Published & Recognized","Regional Finalist","Gold Medal","Top 50 Nationally",
  ];
  const achievements = base.achievements.map((label, ai) => {
    const ri = hx(id * (ai + 1)) % ACH_RESULTS.length;
    const result = ACH_RESULTS[ri]
      .replace("{yr}", 2023 + ai)
      .replace("{n}", 50 + hx(id * (ai + 2)) % 250);
    return { label, result, type: ACH_TYPES[hx(id * (ai + 3)) % ACH_TYPES.length] };
  });

  return {
    ...base,
    deptFull: base.dept + " Engineering",
    yearFull: ["1st","2nd","3rd","4th"][Math.min(3, base.year - 1)] +
      " Year · 20" + (28 - base.year) + "–20" + (32 - base.year),
    gpa, rollNo, email, linkedin, github, available,
    skillBars, growth, hackathons, achievements,
  };
}

/* ─── Fallback ───────────────────────────────────────────────────────────── */
const CANDIDATE_FALLBACK = {
  id: 1, name: "Arjun Mehta", college: "IIT Madras", dept: "CSE",
  deptFull: "Computer Science Engineering", tier: "T1", region: "South",
  yearFull: "3rd Year · 2022–2026", year: 3, gpa: "9.2", rollNo: "CS22B001",
  email: "arjun.mehta@iitm.ac.in", linkedin: "linkedin.com/in/arjun-mehta",
  github: "github.com/arjunmehta", available: "May 2026",
  skillScore: 94, leetcode: 1820, hackathonWins: 4,
  hasInternship: true, verified: true,
  skillBars: [
    { skill: "DSA",           score: 92 }, { skill: "System Design", score: 78 },
    { skill: "ML / AI",       score: 88 }, { skill: "Web Dev",       score: 82 },
    { skill: "DevOps",        score: 67 }, { skill: "Databases",     score: 84 },
  ],
  growth: [
    { month: "Jul'24", skillScore: 74, leetcode: 1420 },
    { month: "Aug'24", skillScore: 77, leetcode: 1480 },
    { month: "Sep'24", skillScore: 80, leetcode: 1550 },
    { month: "Oct'24", skillScore: 82, leetcode: 1590 },
    { month: "Nov'24", skillScore: 88, leetcode: 1640 },
    { month: "Dec'24", skillScore: 90, leetcode: 1700 },
    { month: "Jan'25", skillScore: 92, leetcode: 1760 },
    { month: "Feb'25", skillScore: 94, leetcode: 1820 },
  ],
  hackathons: [
    { event: "National AI Hackathon 2025", rank: "1st of 340 teams",  prize: "₹1,00,000",   verified: true  },
    { event: "Smart India Hackathon 2024", rank: "Top 10 Nationally", prize: "Certificate", verified: true  },
    { event: "IIT Bombay Techfest 2024",   rank: "2nd of 180 teams",  prize: "₹25,000",     verified: true  },
    { event: "Flipkart GRiD 5.0",          rank: "Top 50 Nationally", prize: "Swag Kit",    verified: false },
  ],
  achievements: [
    { label: "National AI Hackathon 2025", result: "Winner — 2025 Edition",   type: "hackathon" },
    { label: "Smart India Hackathon 2024", result: "Top 10 Nationally",        type: "hackathon" },
    { label: "GATE 2025",                  result: "AIR 142 · CS",             type: "exam"      },
    { label: "Google Summer of Code 2024", result: "Selected Contributor",     type: "program"   },
    { label: "Best Paper · ICML 2024",     result: "Published & Recognized",  type: "research"  },
  ],
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const ACH_TYPE_META = {
  hackathon: { dot: "#2b4ed6", label: "Hackathon" },
  exam:      { dot: "#059669", label: "Exam"      },
  program:   { dot: "#7c3aed", label: "Program"   },
  research:  { dot: "#d97706", label: "Research"  },
};

const PIPELINE_STAGES = ["New","Screening","Phone Screen","Interview","Offer","Hired","Rejected"];

const scoreGrade = (s) =>
  s >= 90 ? { label: "Excellent", color: "#059669", bar: "#22c55e" }
  : s >= 80 ? { label: "Strong",  color: "#2b4ed6", bar: "#60a5fa" }
  : s >= 70 ? { label: "Good",    color: "#d97706", bar: "#fbbf24" }
  :           { label: "Fair",    color: "#dc2626", bar: "#f87171" };

function SkillBar({ skill, score }) {
  const grade = scoreGrade(score);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <span style={{ width: 110, flexShrink: 0, fontSize: 12, color: "var(--foreground, #0f172a)", fontWeight: 500 }}>{skill}</span>
      <div style={{ flex: 1, height: 6, background: "var(--border, #e2e8f0)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: grade.bar, borderRadius: 3, transition: "width 0.4s ease" }} />
      </div>
      <span style={{ width: 28, textAlign: "right", fontSize: 11, fontWeight: 600, color: grade.color, flexShrink: 0 }}>{score}</span>
    </div>
  );
}

const GrowthTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--card,#fff)", border: "1px solid var(--border,#e2e8f0)", borderRadius: 5, padding: "8px 12px", fontSize: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 11, color: "var(--muted-foreground,#64748b)", textTransform: "uppercase" }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color, lineHeight: 1.7 }}>
          {p.name} <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function CandidateProfile() {
  const location = useLocation();
  const navigate  = useNavigate();

  const rawCandidate = location.state?.candidate ?? null;
  const c = rawCandidate ? enrichCandidate(rawCandidate) : CANDIDATE_FALLBACK;

  const [shortlisted,    setShortlisted]    = useState(false);
  const [stage,          setStage]          = useState("New");
  const [notes,          setNotes]          = useState("");
  const [activeTab,      setActiveTab]      = useState("overview");
  const [showToast,      setShowToast]      = useState("");

  const toast = (msg) => { setShowToast(msg); setTimeout(() => setShowToast(""), 2500); };
  const sg = scoreGrade(c.skillScore);

  const TABS = [
    { id: "overview", label: "Overview"    },
    { id: "skills",   label: "Skills"      },
    { id: "growth",   label: "Performance" },
  ];

  return (
    <div style={{ background: "var(--background,#f8fafc)", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Toast */}
      {showToast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#0f172a", color: "#fff", padding: "9px 16px", borderRadius: 6, fontSize: 13, fontWeight: 500, zIndex: 9999, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(0,0,0,0.22)" }}>
          <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 14, color: "#4ade80" }}></iconify-icon>
          {showToast}
        </div>
      )}

      {/* ── Top navigation bar ────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid var(--border,#e2e8f0)", background: "var(--card,#fff)", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 48 }}>
        <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground,#64748b)", fontSize: 12, fontWeight: 500, padding: 0 }}>
          <iconify-icon icon="lucide:chevron-left" style={{ fontSize: 15 }}></iconify-icon>
          Candidate Discovery
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => { setShortlisted(s => !s); toast(shortlisted ? "Removed from shortlist" : `${c.name} shortlisted`); }}
            style={{ padding: "5px 12px", borderRadius: 5, border: shortlisted ? "1px solid #2b4ed6" : "1px solid var(--border,#e2e8f0)", background: shortlisted ? "#eef2ff" : "transparent", color: shortlisted ? "#2b4ed6" : "var(--foreground,#0f172a)", fontSize: 12, fontWeight: shortlisted ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
          >
            <iconify-icon icon={shortlisted ? "lucide:bookmark-check" : "lucide:bookmark"} style={{ fontSize: 13 }}></iconify-icon>
            {shortlisted ? "Shortlisted" : "Shortlist"}
          </button>
          <button
            onClick={() => { toast("Opening hiring planner…"); navigate("/recruiter/hiring-planner"); }}
            style={{ padding: "5px 12px", borderRadius: 5, border: "1px solid var(--border,#e2e8f0)", background: "transparent", color: "var(--foreground,#0f172a)", fontSize: 12, fontWeight: 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
          >
            <iconify-icon icon="lucide:calendar-plus" style={{ fontSize: 13 }}></iconify-icon>
            Schedule
          </button>
          <button
            onClick={() => window.print()}
            style={{ padding: "5px 12px", borderRadius: 5, border: "none", background: "#2b4ed6", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
          >
            <iconify-icon icon="lucide:download" style={{ fontSize: 13 }}></iconify-icon>
            Export
          </button>
        </div>
      </div>

      {/* ── Candidate identity banner ─────────────────────────────── */}
      <div style={{ background: "var(--card,#fff)", borderBottom: "1px solid var(--border,#e2e8f0)", padding: "20px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          {/* Avatar */}
          <div style={{ width: 52, height: 52, borderRadius: 8, background: "#2b4ed6", color: "#fff", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, letterSpacing: 1 }}>
            {c.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
              <h1 style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground,#0f172a)", margin: 0 }}>{c.name}</h1>
              {c.verified && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: "#059669", fontWeight: 600, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: "1px 7px" }}>
                  <iconify-icon icon="lucide:shield-check" style={{ fontSize: 11 }}></iconify-icon> Verified
                </span>
              )}
              <span style={{ fontSize: 11, color: "var(--muted-foreground,#64748b)", fontWeight: 400, background: "var(--muted,#f1f5f9)", borderRadius: 4, padding: "1px 7px" }}>{c.tier ?? "T2"}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--muted-foreground,#64748b)", display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span>{c.college}</span>
              <span style={{ color: "var(--border,#e2e8f0)" }}>·</span>
              <span>{c.deptFull ?? c.dept}</span>
              <span style={{ color: "var(--border,#e2e8f0)" }}>·</span>
              <span>{c.yearFull ?? c.year}</span>
            </div>
          </div>

          {/* Skill score — right-aligned */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: sg.color, lineHeight: 1 }}>{c.skillScore}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground,#64748b)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Skill Score</div>
            <div style={{ width: 80, height: 3, background: "var(--border,#e2e8f0)", borderRadius: 2, marginTop: 4, marginLeft: "auto" }}>
              <div style={{ width: `${c.skillScore}%`, height: "100%", background: sg.bar, borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display: "flex", gap: 0, marginTop: 18, borderTop: "1px solid var(--border,#e2e8f0)", paddingTop: 14 }}>
          {[
            { icon: "lucide:code-2",    label: "LeetCode Rating",  val: c.leetcode ?? "—"           },
            { icon: "lucide:trophy",    label: "Hackathon Wins",   val: c.hackathonWins ?? 0         },
            { icon: "lucide:graduation-cap", label: "GPA",         val: (c.gpa ?? "—") + " / 10"    },
            { icon: "lucide:calendar",  label: "Available From",   val: c.available ?? "—"           },
            { icon: "lucide:briefcase", label: "Internship",        val: c.hasInternship ? "Yes" : "No" },
            { icon: "lucide:map-pin",   label: "Region",           val: c.region ?? "—"              },
          ].map((kpi, ki) => (
            <div key={ki} style={{ flex: 1, minWidth: 0, paddingLeft: ki === 0 ? 0 : 16, paddingRight: 16, borderLeft: ki === 0 ? "none" : "1px solid var(--border,#e2e8f0)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                <iconify-icon icon={kpi.icon} style={{ fontSize: 13, color: "var(--muted-foreground,#64748b)", flexShrink: 0 }}></iconify-icon>
                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground,#64748b)", textTransform: "uppercase", letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground,#0f172a)" }}>{kpi.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body: sidebar + tabbed content ───────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", padding: "20px 28px", gap: 20 }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Pipeline stage */}
          <div style={{ background: "var(--card,#fff)", border: "1px solid var(--border,#e2e8f0)", borderRadius: 7, padding: "14px 15px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground,#64748b)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Pipeline Stage</div>
            <select
              value={stage}
              onChange={(e) => { setStage(e.target.value); toast(`Stage updated: ${e.target.value}`); }}
              style={{ width: "100%", padding: "7px 9px", borderRadius: 5, border: "1px solid var(--border,#e2e8f0)", background: "var(--background,#f8fafc)", fontSize: 12, fontWeight: 500, color: "var(--foreground,#0f172a)", cursor: "pointer", outline: "none" }}
            >
              {PIPELINE_STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
            <div style={{ marginTop: 10, display: "flex", gap: 2 }}>
              {PIPELINE_STAGES.slice(0, -1).map((s, si) => {
                const idx = PIPELINE_STAGES.indexOf(stage);
                const active = si <= idx && stage !== "Rejected";
                return <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: active ? "#2b4ed6" : "var(--border,#e2e8f0)" }} />;
              })}
            </div>
          </div>

          {/* Contact */}
          <div style={{ background: "var(--card,#fff)", border: "1px solid var(--border,#e2e8f0)", borderRadius: 7, padding: "14px 15px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground,#64748b)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Contact</div>
            {[
              { icon: "lucide:mail",          label: c.email,    href: `mailto:${c.email}`          },
              { icon: "lucide:linkedin",       label: c.linkedin, href: `https://${c.linkedin}`      },
              { icon: "lucide:github",         label: c.github,   href: `https://${c.github}`        },
            ].map(row => (
              <a key={row.label} href={row.href} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9, textDecoration: "none", color: "inherit" }}
                onMouseOver={e => e.currentTarget.style.opacity = "0.75"}
                onMouseOut={e  => e.currentTarget.style.opacity = "1"}
              >
                <iconify-icon icon={row.icon} style={{ fontSize: 13, color: "var(--muted-foreground,#64748b)", flexShrink: 0 }}></iconify-icon>
                <span style={{ fontSize: 12, color: "#2b4ed6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.label}</span>
              </a>
            ))}
          </div>

          {/* Academic details */}
          <div style={{ background: "var(--card,#fff)", border: "1px solid var(--border,#e2e8f0)", borderRadius: 7, padding: "14px 15px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground,#64748b)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Academic</div>
            {[
              ["Roll No",      c.rollNo  ],
              ["GPA",          (c.gpa ?? "—") + " / 10" ],
              ["Department",   c.deptFull ?? c.dept ],
              ["Year / Batch", c.yearFull ?? c.year ],
              ["Available",    c.available ],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
                <span style={{ fontSize: 11, color: "var(--muted-foreground,#64748b)", flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground,#0f172a)", textAlign: "right" }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Recruiter notes */}
          <div style={{ background: "var(--card,#fff)", border: "1px solid var(--border,#e2e8f0)", borderRadius: 7, padding: "14px 15px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground,#64748b)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Internal Notes</div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add internal notes or feedback about this candidate…"
              style={{ width: "100%", minHeight: 90, resize: "vertical", borderRadius: 5, border: "1px solid var(--border,#e2e8f0)", background: "var(--background,#f8fafc)", fontSize: 12, color: "var(--foreground,#0f172a)", padding: "8px 9px", outline: "none", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }}
            />
            {notes && (
              <button
                onClick={() => { toast("Notes saved"); }}
                style={{ marginTop: 7, width: "100%", padding: "6px 0", borderRadius: 5, border: "none", background: "#2b4ed6", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
              >
                Save Notes
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT: tabs + content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border,#e2e8f0)", marginBottom: 16, gap: 0 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: activeTab === tab.id ? "2px solid #2b4ed6" : "2px solid transparent", marginBottom: -1, fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? "#2b4ed6" : "var(--muted-foreground,#64748b)", cursor: "pointer" }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── TAB: Overview ── */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Achievements */}
              <div style={{ background: "var(--card,#fff)", border: "1px solid var(--border,#e2e8f0)", borderRadius: 7, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground,#0f172a)" }}>Achievements</span>
                  <span style={{ fontSize: 11, color: "var(--muted-foreground,#64748b)" }}>{c.achievements?.length ?? 0} records</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {(c.achievements ?? []).map((a, i) => {
                    const meta = ACH_TYPE_META[a.type] ?? ACH_TYPE_META.program;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: i < c.achievements.length - 1 ? "1px solid var(--border,#e2e8f0)" : "none" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta.dot, flexShrink: 0, marginTop: 4 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground,#0f172a)", marginBottom: 1 }}>{a.label}</div>
                          <div style={{ fontSize: 12, color: "var(--muted-foreground,#64748b)" }}>{a.result}</div>
                        </div>
                        <span style={{ fontSize: 11, color: meta.dot, fontWeight: 500, flexShrink: 0, background: "var(--muted,#f1f5f9)", borderRadius: 4, padding: "2px 7px" }}>{meta.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hackathon table */}
              <div style={{ background: "var(--card,#fff)", border: "1px solid var(--border,#e2e8f0)", borderRadius: 7, overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border,#e2e8f0)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground,#0f172a)" }}>Hackathon Results</span>
                  <span style={{ fontSize: 11, color: "var(--muted-foreground,#64748b)" }}>{c.hackathons?.length ?? 0} events</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "var(--muted,#f8fafc)" }}>
                      {["Event","Rank","Prize","Status"].map(h => (
                        <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground,#64748b)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(c.hackathons ?? []).map((h, i) => (
                      <tr key={i} style={{ borderTop: "1px solid var(--border,#e2e8f0)" }}>
                        <td style={{ padding: "11px 16px", fontWeight: 500, color: "var(--foreground,#0f172a)" }}>{h.event}</td>
                        <td style={{ padding: "11px 16px", color: "var(--foreground,#0f172a)" }}>{h.rank}</td>
                        <td style={{ padding: "11px 16px", color: "var(--muted-foreground,#64748b)" }}>{h.prize}</td>
                        <td style={{ padding: "11px 16px" }}>
                          {h.verified
                            ? <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: "2px 7px", display: "inline-flex", alignItems: "center", gap: 3 }}>
                                <iconify-icon icon="lucide:shield-check" style={{ fontSize: 11 }}></iconify-icon> Verified
                              </span>
                            : <span style={{ fontSize: 11, color: "var(--muted-foreground,#64748b)", background: "var(--muted,#f1f5f9)", borderRadius: 4, padding: "2px 7px" }}>Unverified</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB: Skills ── */}
          {activeTab === "skills" && (
            <div style={{ background: "var(--card,#fff)", border: "1px solid var(--border,#e2e8f0)", borderRadius: 7, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground,#0f172a)" }}>Skill Proficiency</span>
                <span style={{ fontSize: 11, color: sg.color, fontWeight: 600 }}>{sg.label} · {c.skillScore} / 100</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
                {(c.skillBars ?? []).map(({ skill, score }) => (
                  <SkillBar key={skill} skill={skill} score={score} />
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border,#e2e8f0)", display: "flex", gap: 20 }}>
                {["Excellent (90+)","Strong (80–89)","Good (70–79)","Fair (<70)"].map((lbl, li) => {
                  const colors = ["#22c55e","#60a5fa","#fbbf24","#f87171"];
                  return (
                    <div key={li} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--muted-foreground,#64748b)" }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: colors[li] }} />
                      {lbl}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── TAB: Growth ── */}
          {activeTab === "growth" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "var(--card,#fff)", border: "1px solid var(--border,#e2e8f0)", borderRadius: 7, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground,#0f172a)" }}>Skill Score Trend</span>
                  <span style={{ fontSize: 11, color: "var(--muted-foreground,#64748b)" }}>Last 8 months</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={c.growth ?? []} margin={{ top: 4, right: 10, bottom: 4, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border,#e2e8f0)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground,#64748b)" }} tickLine={false} axisLine={false} />
                    <YAxis domain={[55, 100]} tick={{ fontSize: 10, fill: "var(--muted-foreground,#64748b)" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<GrowthTooltip />} />
                    <Line type="monotone" dataKey="skillScore" name="Skill Score" stroke="#2b4ed6" strokeWidth={2} dot={{ r: 3, fill: "#2b4ed6" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: "var(--card,#fff)", border: "1px solid var(--border,#e2e8f0)", borderRadius: 7, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground,#0f172a)" }}>LeetCode Rating Trend</span>
                  <span style={{ fontSize: 11, color: "#0891b2", fontWeight: 600 }}>Current: {c.leetcode}</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={c.growth ?? []} margin={{ top: 4, right: 10, bottom: 4, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border,#e2e8f0)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground,#64748b)" }} tickLine={false} axisLine={false} />
                    <YAxis domain={[1200, 2100]} tick={{ fontSize: 10, fill: "var(--muted-foreground,#64748b)" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<GrowthTooltip />} />
                    <Line type="monotone" dataKey="leetcode" name="LeetCode" stroke="#0891b2" strokeWidth={2} dot={{ r: 3, fill: "#0891b2" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

