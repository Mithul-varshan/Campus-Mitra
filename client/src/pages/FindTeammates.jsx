import { useState, useEffect, useMemo } from "react";

const TEAMMATES = [
  {
    id: 1,
    name: "Arjun Mehta",
    year: "3rd Year",
    branch: "Computer Science",
    college: "IIT Delhi",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=arjunmehta&backgroundColor=b6e3f4",
    skills: ["Python", "Machine Learning", "React"],
    score: 892,
    wins: 4,
    events: 11,
    available: true,
    seeking: ["Hackathon", "ML Project"],
    bio: "Passionate about AI/ML, built 3 production ML models. Looking for teammates for SIH 2025.",
    matchPct: 94,
    optedIn: true,
    preferredDomains: ["Hackathon", "Innovation Challenge"],
  },
  {
    id: 2,
    name: "Priya Nair",
    year: "2nd Year",
    branch: "Electronics",
    college: "NIT Trichy",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=priyanair&backgroundColor=ffd5dc",
    skills: ["Embedded C", "IoT", "PCB Design"],
    score: 650,
    wins: 2,
    events: 7,
    available: true,
    seeking: ["Robotics", "IoT Hackathon"],
    bio: "Hardware enthusiast, won Smart India Hackathon hardware edition. Expert in ESP32 & Arduino.",
    matchPct: 81,
    optedIn: true,
    preferredDomains: ["Hackathon", "Workshop"],
  },
  {
    id: 3,
    name: "Rohan Joshi",
    year: "4th Year",
    branch: "Information Technology",
    college: "BITS Pilani",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=rohanjoshi&backgroundColor=b6e3f4",
    skills: ["Node.js", "React", "PostgreSQL", "Docker"],
    score: 1120,
    wins: 6,
    events: 18,
    available: false,
    seeking: ["Full Stack", "Open Source"],
    bio: "Full-stack dev with 2 internships. Built 5+ deployed apps. Currently in a team but open to connections.",
    matchPct: 88,
    optedIn: true,
    preferredDomains: ["Project Expo", "Bootcamp"],
  },
  {
    id: 4,
    name: "Sneha Reddy",
    year: "3rd Year",
    branch: "Data Science",
    college: "IIIT Hyderabad",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=snehareddy&backgroundColor=ffd5dc",
    skills: ["Python", "Data Analysis", "Tableau", "SQL"],
    score: 760,
    wins: 3,
    events: 9,
    available: true,
    seeking: ["Data Science", "Analytics"],
    bio: "Love turning raw data into actionable insights. Published 2 research papers on ML fairness.",
    matchPct: 76,
    optedIn: true,
    preferredDomains: ["Coding Contest", "Paper Presentation"],
  },
  {
    id: 5,
    name: "Karan Patel",
    year: "2nd Year",
    branch: "Computer Science",
    college: "VIT Vellore",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=karanpatel&backgroundColor=b6e3f4",
    skills: ["Flutter", "Dart", "Firebase", "UI/UX"],
    score: 480,
    wins: 1,
    events: 5,
    available: true,
    seeking: ["App Dev", "Design Hackathon"],
    bio: "Mobile-first developer. Built an app with 5k+ downloads on Play Store. Designer at heart.",
    matchPct: 69,
    optedIn: true,
    preferredDomains: ["Hackathon", "Workshop", "Design Hackathon"],
  },
  {
    id: 6,
    name: "Ananya Singh",
    year: "3rd Year",
    branch: "Cyber Security",
    college: "IIT Bombay",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=ananyasingh&backgroundColor=ffd5dc",
    skills: ["Ethical Hacking", "Networking", "Python", "CTF"],
    score: 940,
    wins: 5,
    events: 13,
    available: true,
    seeking: ["CTF", "Security Hackathon"],
    bio: "Ranked top 1% on HackTheBox. Regular CTF competitor. Looking for team for Hack This Fall.",
    matchPct: 73,
    optedIn: true,
    preferredDomains: ["Coding Contest", "Hackathon"],
  },
];

/* Open teams that anyone can join (used in My Team tab) */
const SAMPLE_OPEN_TEAMS = [
  {
    id: "TM-101",
    name: "Neural Ninjas",
    event: "SIH 2025",
    inviteCode: "NEURAL101",
    description: "Building an AI-powered disaster response & resource allocation system.",
    maxSize: 6,
    domains: ["Hackathon", "AI/ML"],
    seedMembers: [
      { id: 3, name: "Rohan Joshi", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=rohanjoshi&backgroundColor=b6e3f4", role: "Leader", joinedAt: "Jan 12, 2025" },
      { id: 6, name: "Ananya Singh", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=ananyasingh&backgroundColor=ffd5dc", role: "Member", joinedAt: "Jan 13, 2025" },
    ],
  },
  {
    id: "TM-102",
    name: "Quantum Coders",
    event: "Smart India Hackathon 2025",
    inviteCode: "QCODER102",
    description: "Solving rural connectivity with mesh networking and edge computing.",
    maxSize: 4,
    domains: ["Hackathon", "Innovation Challenge"],
    seedMembers: [
      { id: 4, name: "Sneha Reddy", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=snehareddy&backgroundColor=ffd5dc", role: "Leader", joinedAt: "Jan 20, 2025" },
    ],
  },
];

const SKILL_FILTERS = [
  "All Skills",
  "Python",
  "React",
  "ML/AI",
  "IoT",
  "Flutter",
  "Data Science",
  "Security",
];
const DOMAIN_FILTERS = [
  "All Domains",
  "Hackathon",
  "Technical Symposium",
  "Workshop",
  "Seminar",
  "Coding Contest",
  "Paper Presentation",
  "Project Expo",
  "Industry Talk",
  "Innovation Challenge",
  "Bootcamp",
  "Conference",
  "Webinar",
];

function ScoreBadge({ score }) {
  const tier =
    score >= 1000
      ? { label: "Elite", color: "#7c3aed", bg: "#f3e8ff" }
      : score >= 700
        ? { label: "Pro", color: "#1d4ed8", bg: "#dbeafe" }
        : score >= 400
          ? { label: "Rising", color: "#059669", bg: "#d1fae5" }
          : { label: "Starter", color: "#64748b", bg: "#f1f5f9" };
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 999,
        background: tier.bg,
        color: tier.color,
        letterSpacing: "0.3px",
      }}
    >
      {tier.label}
    </span>
  );
}

function MatchBadge({ pct }) {
  const color = pct >= 90 ? "#059669" : pct >= 75 ? "#2563eb" : "#64748b";
  const bg = pct >= 90 ? "#d1fae5" : pct >= 75 ? "#dbeafe" : "#f1f5f9";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12,
      fontWeight: 700, color, background: bg, padding: "4px 10px", borderRadius: 999 }}>
      <iconify-icon icon="lucide:zap" style={{ fontSize: 12 }} />
      {pct}% Match
    </div>
  );
}

/** Reusable person card */
function PersonCard({
  person, isSelf = false, showMatchBadge = false,
  inviteLabel, inviteIcon, inviteDisabled, inviteActive, onInvite,
  chatEnabled, onChat, actionNode,
}) {
  return (
    <div
      style={{ background: isSelf ? "#f0fdf4" : "#fff",
        border: `1.5px solid ${isSelf ? "#bbf7d0" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)", padding: 22,
        display: "flex", flexDirection: "column", gap: 0,
        transition: "transform 0.2s, box-shadow 0.2s", position: "relative" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px -8px rgba(0,0,0,0.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {isSelf && (
        <div style={{ position: "absolute", top: 12, right: 12, background: "#16a34a", color: "#fff",
          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, letterSpacing: "0.5px" }}>
          YOUR PROFILE
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src={person.avatar} alt={person.name}
            style={{ width: 52, height: 52, borderRadius: 999, objectFit: "cover", border: "2px solid var(--border)" }} />
          {person.available && (
            <span style={{ position: "absolute", bottom: 2, right: 2, width: 11, height: 11,
              borderRadius: 999, background: "#10b981", border: "2px solid #fff" }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>{person.name}</span>
            <ScoreBadge score={person.score} />
          </div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>{person.year} · {person.branch}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>
            <iconify-icon icon="lucide:building-2" style={{ fontSize: 12 }} />
            {person.college}
          </div>
        </div>
        {showMatchBadge && <MatchBadge pct={person.matchPct} />}
      </div>
      <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, margin: "0 0 14px 0",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {person.bio}
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {person.skills.map((skill) => (
          <span key={skill} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 4,
            background: "var(--muted)", color: "#334155", fontWeight: 600 }}>{skill}</span>
        ))}
      </div>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600 }}>LOOKING FOR:</span>
        <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
          {(person.preferredDomains?.length ? person.preferredDomains : person.seeking).map((s) => (
            <span key={s} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 4,
              background: "#eff6ff", color: "#1e40af", fontWeight: 600, border: "1px solid #bfdbfe" }}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
        {[{ icon: "lucide:award", label: "Score", value: person.score },
          { icon: "lucide:trophy", label: "Wins", value: person.wins },
          { icon: "lucide:calendar", label: "Events", value: person.events }].map((stat) => (
          <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <iconify-icon icon={stat.icon} style={{ fontSize: 13, color: "var(--muted-foreground)" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>{stat.value}</span>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{stat.label}</span>
          </div>
        ))}
      </div>
      {actionNode ? actionNode : (
        <div style={{ display: "flex", gap: 10 }}>
          {!isSelf && onInvite && (
            <button disabled={inviteDisabled} onClick={onInvite}
              style={{ flex: 1, padding: "9px 0", borderRadius: "var(--radius-md)",
                background: inviteActive ? "#e8f5e9" : inviteDisabled ? "#f1f5f9" : "var(--primary)",
                color: inviteActive ? "#16a34a" : inviteDisabled ? "var(--muted-foreground)" : "#fff",
                border: inviteActive ? "1px solid #bbf7d0" : "none",
                fontSize: 13, fontWeight: 600, cursor: inviteDisabled ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s" }}>
              <iconify-icon icon={inviteIcon || "lucide:user-plus"} style={{ fontSize: 14 }} />
              {inviteLabel || "Invite"}
            </button>
          )}
          {!isSelf && onChat && (
            <button disabled={!chatEnabled} onClick={chatEnabled ? onChat : undefined}
              style={{ padding: "9px 16px", borderRadius: "var(--radius-md)",
                background: chatEnabled ? "transparent" : "#f1f5f9",
                border: "1px solid var(--border)",
                color: chatEnabled ? "var(--foreground)" : "var(--muted-foreground)",
                fontSize: 13, fontWeight: 600, cursor: chatEnabled ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", gap: 6, transition: "background 0.15s" }}
              onMouseEnter={(e) => chatEnabled && (e.currentTarget.style.background = "var(--muted)")}
              onMouseLeave={(e) => chatEnabled && (e.currentTarget.style.background = "transparent")}>
              <iconify-icon icon="lucide:message-circle" style={{ fontSize: 14 }} />
              Chat
            </button>
          )}
          {isSelf && (
            <div style={{ flex: 1, padding: "9px 0", borderRadius: "var(--radius-md)",
              background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a",
              fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6 }}>
              <iconify-icon icon="lucide:eye" style={{ fontSize: 14 }} />
              Visible to others
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CreateTeamModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", event: "", description: "", maxSize: 6 });
  const valid = form.name.trim() && form.event.trim();
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480,
        boxShadow: "0 24px 48px -8px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground)" }}>Create a Team</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
            <iconify-icon icon="lucide:x" style={{ fontSize: 18 }} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[{ key: "name", label: "Team Name *", ph: "e.g. Neural Ninjas" },
            { key: "event", label: "Event / Hackathon *", ph: "e.g. SIH 2025" }].map(({ key, label, ph }) => (
            <div key={key}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.04em", color: "var(--muted-foreground)", display: "block", marginBottom: 6 }}>{label}</label>
              <input value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={ph}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)",
                  fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.04em", color: "var(--muted-foreground)", display: "block", marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What are you building?" rows={3}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)",
                fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.04em", color: "var(--muted-foreground)", display: "block", marginBottom: 6 }}>Max Team Size</label>
            <select value={form.maxSize} onChange={(e) => setForm((f) => ({ ...f, maxSize: Number(e.target.value) }))}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)",
                fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box" }}>
              {[2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n} members</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 9,
            border: "1px solid var(--border)", background: "var(--muted)",
            cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Cancel</button>
          <button disabled={!valid} onClick={() => onCreate(form)}
            style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none",
              background: valid ? "var(--primary)" : "#e2e8f0",
              cursor: valid ? "pointer" : "not-allowed",
              fontSize: 13, fontWeight: 700, color: valid ? "#fff" : "var(--muted-foreground)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <iconify-icon icon="lucide:shield-plus" style={{ fontSize: 14 }} />
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
}

function JoinTeamModal({ onClose, onJoin, teams }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const tryJoin = () => {
    const found = teams.find((t) => t.inviteCode === code.trim().toUpperCase());
    if (!found) { setError("Invalid code. Try: NEURAL101 or QCODER102"); return; }
    if (found.seedMembers.length >= found.maxSize) { setError("That team is already full."); return; }
    onJoin(found);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 400,
        boxShadow: "0 24px 48px -8px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground)" }}>Join a Team</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
            <iconify-icon icon="lucide:x" style={{ fontSize: 18 }} />
          </button>
        </div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6 }}>
          Enter Team Invite Code
        </label>
        <input value={code} onChange={(e) => { setCode(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && tryJoin()}
          placeholder="e.g. NEURAL101"
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8,
            border: `1px solid ${error ? "#f87171" : "var(--border)"}`,
            fontSize: 14, fontWeight: 600, outline: "none", letterSpacing: "1px",
            boxSizing: "border-box", textTransform: "uppercase" }} />
        {error && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 6, fontWeight: 500 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 9,
            border: "1px solid var(--border)", background: "var(--muted)",
            cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Cancel</button>
          <button onClick={tryJoin}
            style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none",
              background: "var(--primary)", cursor: "pointer",
              fontSize: 13, fontWeight: 700, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <iconify-icon icon="lucide:log-in" style={{ fontSize: 14 }} />
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

// ── localStorage helpers ──────────────────────────────────────────────────────
const LS_KEY = "campusmitra_teammates_v1";
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(`${LS_KEY}_${key}`);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(`${LS_KEY}_${key}`, JSON.stringify(value)); } catch {}
}

export default function FindTeammates() {
  // -- student data & current user ------------------------------------------------
  const currentUserId = 1; // for demo, assume user with id 1 is logged in

  const [teammates, setTeammates] = useState(() => {
    const saved = lsGet("teammates", null);
    // merge saved optedIn/preferredDomains into fresh TEAMMATES data so new fields always exist
    if (saved) {
      return TEAMMATES.map((t) => {
        const s = saved.find((x) => x.id === t.id);
        return s ? { ...t, optedIn: s.optedIn, preferredDomains: s.preferredDomains } : t;
      });
    }
    return TEAMMATES;
  });

  const [currentOptedIn, setCurrentOptedIn] = useState(() =>
    lsGet("optedIn", TEAMMATES.find((t) => t.id === currentUserId)?.optedIn ?? false)
  );

  const [selectedDomains, setSelectedDomains] = useState(() =>
    lsGet("selectedDomains", TEAMMATES.find((t) => t.id === currentUserId)?.preferredDomains ?? [])
  );

  // invitation/request state
  const [outgoingInvites, setOutgoingInvites] = useState(() =>
    new Set(lsGet("outgoingInvites", []))
  );
  const [incomingRequests, setIncomingRequests] = useState(() =>
    new Set(lsGet("incomingRequests", [2, 4]))
  );
  const [connections, setConnections] = useState(() =>
    new Set(lsGet("connections", []))
  );

  // UI state — tabs not persisted (always start fresh)
  const [tab, setTab] = useState("browse");
  const [subTab, setSubTab] = useState("received");
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const [showAIPicks, setShowAIPicks] = useState(false);

  // ── team state ──
  const [myTeam, setMyTeam] = useState(() => lsGet("myTeam", null));
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [openTeams, setOpenTeams] = useState(SAMPLE_OPEN_TEAMS);
  const currentInTeam = myTeam !== null;
  const currentMember = teammates.find((t) => t.id === currentUserId);

  // ── persist to localStorage whenever key state changes ──
  useEffect(() => { lsSet("optedIn", currentOptedIn); }, [currentOptedIn]);
  useEffect(() => { lsSet("selectedDomains", selectedDomains); }, [selectedDomains]);
  useEffect(() => { lsSet("myTeam", myTeam); }, [myTeam]);
  useEffect(() => { lsSet("outgoingInvites", Array.from(outgoingInvites)); }, [outgoingInvites]);
  useEffect(() => { lsSet("incomingRequests", Array.from(incomingRequests)); }, [incomingRequests]);
  useEffect(() => { lsSet("connections", Array.from(connections)); }, [connections]);
  useEffect(() => {
    // only persist the mutable fields (optedIn, preferredDomains) to keep storage small
    lsSet("teammates", teammates.map(({ id, optedIn, preferredDomains }) => ({ id, optedIn, preferredDomains })));
  }, [teammates]);

  // sync currentOptedIn and selectedDomains to teammates list
  useEffect(() => {
    setTeammates((prev) =>
      prev.map((t) =>
        t.id === currentUserId
          ? { ...t, optedIn: currentOptedIn, preferredDomains: selectedDomains }
          : t,
      ),
    );
  }, [currentOptedIn, selectedDomains]);

  // compute AI recommendations when requested
  const aiResults = useMemo(() => {
    if (!showAIPicks) return [];
    const current = teammates.find((t) => t.id === currentUserId);
    if (!current) return [];
    const overlap = (a, b) =>
      a.skills.filter((s) => b.skills.includes(s)).length;
    return teammates
      .filter((t) => t.id !== currentUserId && t.optedIn)
      .map((t) => ({ t, score: overlap(t, current) }))
      .sort((a, b) => b.score - a.score)
      .map((o) => o.t);
  }, [showAIPicks, teammates]);

  // general filtering used in browse tab — always excludes self
  const filtered = useMemo(() => {
    const base = showAIPicks ? aiResults : teammates;
    return base
      .filter((t) => t.id !== currentUserId)   // self excluded — my card handled separately
      .filter((t) => t.optedIn && currentOptedIn)
      .filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.college.toLowerCase().includes(search.toLowerCase()) ||
        t.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchSkill =
        skillFilter === "All Skills" ||
        t.skills.some((s) =>
          s.toLowerCase().includes(skillFilter.toLowerCase()),
        );
      // Check if student's preferred domains overlap with current user's selected domains
      const matchDomain =
        selectedDomains.length === 0 ||
        (t.preferredDomains &&
          t.preferredDomains.some((d) => selectedDomains.includes(d)));
      return matchSearch && matchSkill && matchDomain;
    });
  }, [showAIPicks, aiResults, teammates, search, skillFilter, selectedDomains, currentOptedIn]);

  const handleDomainToggle = (domain) =>
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );

  const handleOptInChange = (val) => {
    if (currentInTeam) return;
    setCurrentOptedIn(val);
    setTeammates((prev) =>
      prev.map((t) => (t.id === currentUserId ? { ...t, optedIn: val, preferredDomains: selectedDomains } : t))
    );
  };

  const handleInvite = (id) =>
    setOutgoingInvites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const acceptRequest = (id) => {
    setConnections((prev) => new Set(prev).add(id));
    setIncomingRequests((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const declineRequest = (id) => {
    setIncomingRequests((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const cancelInvite = (id) =>
    setOutgoingInvites((prev) => { const n = new Set(prev); n.delete(id); return n; });

  const handleCreateTeam = (form) => {
    if (!currentMember) return;
    const code = form.name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) + Math.floor(Math.random() * 900 + 100);
    setMyTeam({
      id: `TM-${Date.now()}`, name: form.name, event: form.event, description: form.description,
      maxSize: Number(form.maxSize),
      members: [{ id: currentUserId, name: currentMember.name, avatar: currentMember.avatar, role: "Leader", joinedAt: new Date().toLocaleDateString("en-IN") }],
      inviteCode: code, role: "Leader",
    });
    setCurrentOptedIn(false);
    setTeammates((prev) => prev.map((t) => (t.id === currentUserId ? { ...t, optedIn: false } : t)));
    setShowCreateTeam(false);
    setTab("myteam");
  };

  const handleJoinOpenTeam = (teamData) => {
    if (!currentMember) return;
    const newMember = { id: currentUserId, name: currentMember.name, avatar: currentMember.avatar, role: "Member", joinedAt: new Date().toLocaleDateString("en-IN") };
    setMyTeam({
      id: teamData.id, name: teamData.name, event: teamData.event,
      description: teamData.description || "", maxSize: teamData.maxSize,
      members: [...teamData.seedMembers, newMember],
      inviteCode: teamData.inviteCode, role: "Member",
    });
    // update open teams capacity so JoinTeamModal shows the correct count
    setOpenTeams((prev) => prev.map((t) => t.id === teamData.id ? { ...t, seedMembers: [...t.seedMembers, newMember] } : t));
    // flip optedIn false so self doesn't appear in others' browse
    setCurrentOptedIn(false);
    setTeammates((prev) => prev.map((t) => (t.id === currentUserId ? { ...t, optedIn: false } : t)));
    setShowJoinTeam(false);
    setTab("myteam");
  };

  const handleLeaveTeam = () => {
    setMyTeam(null);
    // deliberately NOT resetting opt-in — user chooses whether to remain visible
  };

  const copyInviteCode = () => {
    if (myTeam?.inviteCode) {
      navigator.clipboard.writeText(myTeam.inviteCode).catch(() => {});
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const inviteBtnLabel = (id) =>
    outgoingInvites.has(id) ? "Invited" : currentInTeam ? `Invite to ${myTeam.name}` : currentOptedIn ? "Invite to Team" : "Opt in to Invite";
  const inviteBtnIcon = (id) => outgoingInvites.has(id) ? "lucide:check" : "lucide:user-plus";
  const inviteBtnDisabled = () => !currentOptedIn && !currentInTeam;

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: 1160,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0", color: "var(--primary)" }}>
            Find Teammates
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: 0 }}>
            Discover skilled students. Build your dream team for the next big hackathon.
          </p>
        </div>
        {/* View My Team quick-access button — shows whenever user is in a team */}
        {currentInTeam && (
          <button
            onClick={() => setTab("myteam")}
            style={{ display: "flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg,#6366f1,#7c3aed)",
              color: "#fff", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)", transition: "opacity 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <iconify-icon icon="lucide:shield" style={{ fontSize: 15 }} />
            {myTeam.name}
            <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.35)" }} />
            <iconify-icon icon="lucide:arrow-right" style={{ fontSize: 14 }} />
            View My Team
          </button>
        )}
      </div>

      {/* ── Main Tab Bar ── */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--muted)",
        borderRadius: 12, padding: 4, width: "fit-content" }}>
        {[
          { id: "browse",      label: "Browse",      icon: "lucide:search" },
          { id: "invitations", label: "Invitations", icon: "lucide:bell",
            badge: incomingRequests.size > 0 ? incomingRequests.size : null },
          { id: "myteam",      label: "My Team",     icon: "lucide:shield" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ display: "flex", alignItems: "center", gap: 7,
              padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              background: tab === t.id ? "#fff" : "transparent",
              color: tab === t.id ? "var(--foreground)" : "var(--muted-foreground)",
              boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s", position: "relative" }}>
            <iconify-icon icon={t.icon} style={{ fontSize: 15 }} />
            {t.label}
            {t.badge != null && (
              <span style={{ position: "absolute", top: 4, right: 4, minWidth: 16, height: 16,
                borderRadius: 999, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                {t.badge}
              </span>
            )}
            {t.id === "myteam" && currentInTeam && (
              <span style={{ width: 7, height: 7, borderRadius: 999, background: "#10b981",
                position: "absolute", top: 6, right: 6 }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Browse Tab ── */}
      {tab === "browse" && (
        <div>
          {/* Simple opt-in checkbox */}
          <label style={{
            display: "flex", alignItems: "center", gap: 8, cursor: currentInTeam ? "not-allowed" : "pointer",
            fontSize: 13, fontWeight: 500, color: "var(--foreground)", marginBottom: 20,
            opacity: currentInTeam ? 0.5 : 1,
          }}>
            <input
              type="checkbox"
              checked={currentOptedIn}
              disabled={currentInTeam}
              onChange={(e) => handleOptInChange(e.target.checked)}
              style={{ width: 15, height: 15, cursor: currentInTeam ? "not-allowed" : "pointer" }}
            />
            Opt for finding teammates
            {currentInTeam && (
              <span style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 400 }}>
                (you're already in a team)
              </span>
            )}
          </label>

          {/* Domain chips — only when opted in and not in team */}
          {currentOptedIn && !currentInTeam && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--foreground)" }}>
                Select domains you're interested in:
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {DOMAIN_FILTERS.filter((d) => d !== "All Domains").map((domain) => (
                  <button
                    key={domain}
                    onClick={() => handleDomainToggle(domain)}
                    style={{
                      padding: "6px 12px", borderRadius: 999,
                      background: selectedDomains.includes(domain) ? "var(--primary)" : "#fff",
                      border: `1px solid ${selectedDomains.includes(domain) ? "var(--primary)" : "var(--border)"}`,
                      color: selectedDomains.includes(domain) ? "#fff" : "var(--foreground)",
                      fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Not opted in: simple hint */}
          {!currentOptedIn && !currentInTeam && (
            <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 20 }}>
              Check the box above to appear in teammate searches and browse other profiles.
            </p>
          )}
          {/* ── Visible content: opted-in and not already in a team ── */}
          {currentOptedIn && !currentInTeam && (
          <>
          {/* AI Suggestion Banner */}
          <div style={{
            background: "linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)",
            borderRadius: "var(--radius-lg)", padding: "16px 22px", marginBottom: 28,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            border: "1px solid #bfdbfe", gap: 16,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--primary)", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                <iconify-icon icon="lucide:sparkles" style={{ color: "#f59e0b", fontSize: 16 }} />
                AI Team Suggestions
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#334155" }}>
                {(() => {
                  const cur = teammates.find((t) => t.id === currentUserId) || {};
                  const skills = cur.skills ? cur.skills.join(" & ") : "your skills";
                  const count = showAIPicks ? aiResults.length : filtered.length;
                  return (<>Based on your skills in <strong>{skills}</strong>, we found <strong>{count} highly compatible profiles</strong>.</>);
                })()}
              </p>
            </div>
            <button
              onClick={() => setShowAIPicks((v) => !v)}
              style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "9px 18px", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {showAIPicks ? "Show All" : "View AI Picks"}
            </button>
          </div>

          {/* Search + Filters */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "8px 14px", width: 280 }}>
              <iconify-icon icon="lucide:search" style={{ fontSize: 16, color: "var(--muted-foreground)" }} />
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, college, skill..."
                style={{ border: "none", outline: "none", fontSize: 14, color: "var(--foreground)", background: "transparent", width: "100%", fontFamily: "var(--font-family-body)" }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SKILL_FILTERS.map((f) => (
                <button key={f} onClick={() => setSkillFilter(f)}
                  style={{
                    padding: "7px 14px", borderRadius: 999,
                    background: skillFilter === f ? "var(--primary)" : "#fff",
                    border: `1px solid ${skillFilter === f ? "var(--primary)" : "var(--border)"}`,
                    color: skillFilter === f ? "#fff" : "var(--muted-foreground)",
                    fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                  }}
                >{f}</button>
              ))}
            </div>
          </div>

          {/* My profile preview — how others see you */}
          {currentMember && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>
                Your profile (how others see you)
              </div>
              <div style={{ maxWidth: 380 }}>
                <PersonCard
                  person={currentMember} isSelf showMatchBadge={false}
                  inviteDisabled inviteLabel="That's you!" inviteIcon="lucide:smile"
                  chatEnabled={false}
                />
              </div>
            </div>
          )}

          {/* Results count */}
          <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 18 }}>
            Showing <strong style={{ color: "var(--foreground)" }}>{filtered.length}</strong> student profiles
          </div>

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {filtered.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                showMatchBadge={showAIPicks}
                inviteLabel={inviteBtnLabel(person.id)}
                inviteIcon={inviteBtnIcon(person.id)}
                inviteDisabled={inviteBtnDisabled()}
                inviteActive={outgoingInvites.has(person.id)}
                onInvite={() => handleInvite(person.id)}
                chatEnabled={connections.has(person.id)}
                onChat={() => alert(`Chat with ${person.name}`)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 32px", color: "var(--muted-foreground)" }}>
              <iconify-icon icon="lucide:users" style={{ fontSize: 48, marginBottom: 12, display: "block" }} />
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No profiles found</div>
              <div style={{ fontSize: 14 }}>Try clearing your filters to see more people.</div>
            </div>
          )}
          </>
          )}
        </div>
      )}

      {/* ── Invitations Tab ── */}
      {tab === "invitations" && (
        <div>
          {/* Sub-tabs: Received / Sent / Connected */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[
              { id: "received",  label: "Received",  badge: incomingRequests.size || null },
              { id: "sent",      label: "Sent",       badge: outgoingInvites.size || null },
              { id: "connected", label: "Connected",  badge: null },
            ].map((s) => (
              <button key={s.id} onClick={() => setSubTab(s.id)}
                style={{
                  padding: "7px 16px", borderRadius: 999, cursor: "pointer",
                  background: subTab === s.id ? "var(--primary)" : "#fff",
                  border: `1px solid ${subTab === s.id ? "var(--primary)" : "var(--border)"}`,
                  color: subTab === s.id ? "#fff" : "var(--foreground)",
                  fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
                }}>
                {s.label}
                {s.badge != null && (
                  <span style={{
                    minWidth: 18, height: 18, borderRadius: 999,
                    background: subTab === s.id ? "rgba(255,255,255,0.3)" : "#ef4444",
                    color: "#fff", fontSize: 10, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px",
                  }}>{s.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* Received */}
          {subTab === "received" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {incomingRequests.size === 0 ? (
                <div style={{ color: "var(--muted-foreground)", gridColumn: "1 / -1", textAlign: "center", padding: "48px 0" }}>
                  <iconify-icon icon="lucide:inbox" style={{ fontSize: 36, display: "block", marginBottom: 10 }} />
                  No incoming requests.
                </div>
              ) : (
                Array.from(incomingRequests).map((id) => {
                  const person = teammates.find((t) => t.id === id);
                  if (!person) return null;
                  return (
                    <PersonCard key={id} person={person} showMatchBadge
                      inviteDisabled inviteLabel="" inviteIcon=""
                      actionNode={
                        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                          <button onClick={() => acceptRequest(id)}
                            style={{ flex: 1, padding: "9px 0", borderRadius: "var(--radius-md)", background: "#10b981", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <iconify-icon icon="lucide:check" style={{ fontSize: 14 }} /> Accept
                          </button>
                          <button onClick={() => declineRequest(id)}
                            style={{ flex: 1, padding: "9px 0", borderRadius: "var(--radius-md)", background: "#fff", color: "#ef4444", border: "1px solid #fca5a5", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <iconify-icon icon="lucide:x" style={{ fontSize: 14 }} /> Decline
                          </button>
                        </div>
                      }
                    />
                  );
                })
              )}
            </div>
          )}

          {/* Sent */}
          {subTab === "sent" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {outgoingInvites.size === 0 ? (
                <div style={{ color: "var(--muted-foreground)", gridColumn: "1 / -1", textAlign: "center", padding: "48px 0" }}>
                  <iconify-icon icon="lucide:send" style={{ fontSize: 36, display: "block", marginBottom: 10 }} />
                  No invitations sent yet.
                </div>
              ) : (
                Array.from(outgoingInvites).map((id) => {
                  const person = teammates.find((t) => t.id === id);
                  if (!person) return null;
                  return (
                    <PersonCard key={id} person={person} showMatchBadge
                      inviteDisabled inviteLabel="" inviteIcon=""
                      actionNode={
                        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                          <div style={{ flex: 1, padding: "9px 0", borderRadius: "var(--radius-md)", background: "#e8f5e9", color: "#16a34a", border: "1px solid #bbf7d0", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <iconify-icon icon="lucide:clock" style={{ fontSize: 14 }} /> Pending
                          </div>
                          <button onClick={() => cancelInvite(id)}
                            style={{ padding: "9px 16px", borderRadius: "var(--radius-md)", background: "#fff", color: "#ef4444", border: "1px solid #fca5a5", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <iconify-icon icon="lucide:x" style={{ fontSize: 14 }} /> Cancel
                          </button>
                        </div>
                      }
                    />
                  );
                })
              )}
            </div>
          )}

          {/* Connected */}
          {subTab === "connected" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {connections.size === 0 ? (
                <div style={{ color: "var(--muted-foreground)", gridColumn: "1 / -1", textAlign: "center", padding: "48px 0" }}>
                  <iconify-icon icon="lucide:link" style={{ fontSize: 36, display: "block", marginBottom: 10 }} />
                  No connections yet. Accept requests to connect.
                </div>
              ) : (
                Array.from(connections).map((id) => {
                  const person = teammates.find((t) => t.id === id);
                  if (!person) return null;
                  return (
                    <PersonCard key={id} person={person} showMatchBadge={false}
                      inviteDisabled inviteLabel="" inviteIcon=""
                      chatEnabled onChat={() => alert(`Chat with ${person.name}`)}
                      actionNode={
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                          <span style={{ fontSize: 12, color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                            <iconify-icon icon="lucide:check-circle" style={{ fontSize: 14 }} /> Connected
                          </span>
                        </div>
                      }
                    />
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* ── My Team Tab ── */}
      {tab === "myteam" && (
        <div>
          {!currentInTeam ? (
            /* ── Not in a team: CTA + open teams ── */
            <div>
              <div style={{
                textAlign: "center", padding: "40px 32px 32px",
                background: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
                borderRadius: "var(--radius-lg)", marginBottom: 32, border: "1px solid #ddd6fe",
              }}>
                <iconify-icon icon="lucide:users-round" style={{ fontSize: 56, color: "var(--primary)", display: "block", marginBottom: 16 }} />
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px 0", color: "var(--foreground)" }}>
                  You're not in a team yet
                </h2>
                <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: "0 0 28px 0" }}>
                  Create a new team for your next hackathon or join an existing one.
                </p>
                <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setShowCreateTeam(true)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: "var(--radius-md)", background: "var(--primary)", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}>
                    <iconify-icon icon="lucide:plus" style={{ fontSize: 16 }} /> Create Team
                  </button>
                  <button onClick={() => setShowJoinTeam(true)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: "var(--radius-md)", background: "#fff", color: "var(--primary)", border: "2px solid var(--primary)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    <iconify-icon icon="lucide:key-round" style={{ fontSize: 16 }} /> Join with Code
                  </button>
                </div>
              </div>

              {/* Open teams list */}
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: "var(--foreground)" }}>Open Teams Recruiting</div>
                <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "0 0 20px 0" }}>
                  These teams are actively looking for members.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
                  {openTeams.map((team) => (
                    <div key={team.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>{team.name}</div>
                          <div style={{ fontSize: 12, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 6 }}>
                            <iconify-icon icon="lucide:calendar-days" style={{ fontSize: 12 }} /> {team.event}
                          </div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "#dcfce7", color: "#15803d" }}>Open</span>
                      </div>
                      <p style={{ fontSize: 13, color: "#475569", margin: "0 0 14px 0", lineHeight: 1.5 }}>{team.description}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                        {team.domains.map((s) => (
                          <span key={s} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 4, background: "var(--muted)", color: "#334155", fontWeight: 600 }}>{s}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted-foreground)" }}>
                          <iconify-icon icon="lucide:users" style={{ fontSize: 14 }} />
                          <span>{team.seedMembers.length} / {team.maxSize}</span>
                          <div style={{ width: 60, height: 6, borderRadius: 999, background: "var(--muted)", overflow: "hidden" }}>
                            <div style={{ width: `${(team.seedMembers.length / team.maxSize) * 100}%`, height: "100%", background: "var(--primary)", borderRadius: 999 }} />
                          </div>
                        </div>
                        <button onClick={() => handleJoinOpenTeam(team)}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: "var(--radius-md)", background: "var(--primary)", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                          <iconify-icon icon="lucide:log-in" style={{ fontSize: 14 }} /> Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ── In a team: detail panel ── */
            <div>
              {/* Team banner */}
              <div style={{ background: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "1px solid #ddd6fe", borderRadius: "var(--radius-lg)", padding: "24px 28px", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 50, height: 50, borderRadius: 14, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <iconify-icon icon="lucide:shield" style={{ fontSize: 24, color: "#fff" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", marginBottom: 4 }}>{myTeam.name}</div>
                      <div style={{ fontSize: 13, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 5 }}>
                        <iconify-icon icon="lucide:calendar-days" style={{ fontSize: 12 }} /> {myTeam.event}
                      </div>
                      {myTeam.description && (
                        <p style={{ fontSize: 13, color: "#334155", margin: "8px 0 0 0" }}>{myTeam.description}</p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 999, background: "#dcfce7", color: "#15803d" }}>
                      {myTeam.role === "Leader" ? "Leader" : "Member"}
                    </span>
                    <button onClick={handleLeaveTeam}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: "var(--radius-md)", background: "#fff", color: "#ef4444", border: "1px solid #fca5a5", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      <iconify-icon icon="lucide:log-out" style={{ fontSize: 14 }} /> Leave Team
                    </button>
                  </div>
                </div>
              </div>

              {/* Invite code */}
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "18px 22px", marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "var(--foreground)", display: "flex", alignItems: "center", gap: 7 }}>
                  <iconify-icon icon="lucide:key-round" style={{ fontSize: 15, color: "var(--primary)" }} /> Invite Code
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <code style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, letterSpacing: "0.18em", color: "var(--primary)", background: "var(--muted)", padding: "8px 18px", borderRadius: 8 }}>
                    {myTeam.inviteCode}
                  </code>
                  <button onClick={() => copyInviteCode()}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: "var(--radius-md)", background: copiedCode ? "#dcfce7" : "var(--muted)", color: copiedCode ? "#16a34a" : "var(--muted-foreground)", border: "1px solid var(--border)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                    <iconify-icon icon={copiedCode ? "lucide:check" : "lucide:copy"} style={{ fontSize: 14 }} />
                    {copiedCode ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "10px 0 0 0" }}>Share this code with teammates so they can join your team.</p>
              </div>

              {/* Members list */}
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "18px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", display: "flex", alignItems: "center", gap: 7 }}>
                    <iconify-icon icon="lucide:users" style={{ fontSize: 15, color: "var(--primary)" }} />
                    Members ({myTeam.members.length} / {myTeam.maxSize})
                  </div>
                  <div style={{ width: 100, height: 7, borderRadius: 999, background: "var(--muted)", overflow: "hidden" }}>
                    <div style={{ width: `${(myTeam.members.length / myTeam.maxSize) * 100}%`, height: "100%", background: "var(--primary)", borderRadius: 999, transition: "width 0.4s" }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {myTeam.members.map((m, i) => {
                    const p = teammates.find((t) => t.id === m.id);
                    return (
                      <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                          src={p ? p.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`}
                          alt={m.name}
                          style={{ width: 40, height: 40, borderRadius: 999, objectFit: "cover", border: "2px solid var(--border)", flexShrink: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>{m.name}</div>
                          <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{m.role}</div>
                        </div>
                        {i === 0 && (
                          <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 999, background: "linear-gradient(135deg,#6366f1,#7c3aed)", color: "#fff" }}>LEAD</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {myTeam.members.length < myTeam.maxSize && (
                  <div style={{ marginTop: 18, padding: "12px 16px", borderRadius: "var(--radius-md)", background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: 13, color: "#1d4ed8", display: "flex", alignItems: "center", gap: 8 }}>
                    <iconify-icon icon="lucide:info" style={{ fontSize: 15 }} />
                    {myTeam.maxSize - myTeam.members.length} slot{myTeam.maxSize - myTeam.members.length > 1 ? "s" : ""} open — share the invite code or browse profiles to fill your team.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      {showCreateTeam && (
        <CreateTeamModal onClose={() => setShowCreateTeam(false)} onCreate={handleCreateTeam} />
      )}
      {showJoinTeam && (
        <JoinTeamModal onClose={() => setShowJoinTeam(false)} onJoin={handleJoinOpenTeam} teams={openTeams} />
      )}
    </div>
  );
}
