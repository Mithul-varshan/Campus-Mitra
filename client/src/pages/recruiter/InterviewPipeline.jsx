import { useState } from "react";

/* ─── Column config ──────────────────────────────────────────────────── */
const COLUMNS = [
  { id: "recommended",         label: "Recommended",         accent: "#475569", bg: "#f8fafc", dot: "#94a3b8" },
  { id: "shortlisted",         label: "Shortlisted",         accent: "#1d4ed8", bg: "#eff6ff", dot: "#3b82f6" },
  { id: "interview_scheduled", label: "Interview Scheduled", accent: "#b45309", bg: "#fffbeb", dot: "#f59e0b" },
  { id: "offered",             label: "Offered",             accent: "#065f46", bg: "#f0fdf4", dot: "#10b981" },
  { id: "hired",               label: "Hired",               accent: "#5b21b6", bg: "#faf5ff", dot: "#8b5cf6" },
];

const COL_IDS = COLUMNS.map((c) => c.id);

/* ─── Seed data ───────────────────────────────────────────────────────── */
let _id = 1;
const mk = (name, college, skillScore, interviewRating, notes, col) => ({
  id: _id++,
  name,
  college,
  skillScore,
  interviewRating,
  notes,
  col,
});

const SEED = [
  mk("Rohan Das",      "IIT Kharagpur",   88, null, "",                             "recommended"),
  mk("Kavya Reddy",    "NIT Surathkal",   76, null, "Strong DSA profile",           "recommended"),
  mk("Arjun Mehta",    "IIT Madras",      92, null, "Top AI match",                 "recommended"),
  mk("Aditi Bansal",   "BITS Goa",        81, null, "",                             "shortlisted"),
  mk("Vikram Singh",   "IIT Delhi",       95, null, "Referred by alumni",           "shortlisted"),
  mk("Priya Sharma",   "BITS Pilani",     84, null, "",                             "shortlisted"),
  mk("Meera Iyer",     "NIT Warangal",    78, 4,    "Good communication",           "interview_scheduled"),
  mk("Sneha Gupta",    "VIT Vellore",     69, 3,    "Needs one more round",         "interview_scheduled"),
  mk("Rahul Verma",    "IIT Bombay",      90, 5,    "Exceptional problem solving",  "offered"),
  mk("Shreya Nair",    "IIIT Hyderabad",  87, 4,    "Accepted verbally",            "offered"),
  mk("Aditya Joshi",   "NIT Trichy",      93, 5,    "Joining July 1",               "hired"),
  mk("Tanvi Kapoor",   "DTU Delhi",       80, 4,    "Joining July 15",              "hired"),
];

/* ─── Helpers ─────────────────────────────────────────────────────────── */
function initCols() {
  const map = {};
  COL_IDS.forEach((id) => (map[id] = []));
  SEED.forEach((c) => map[c.col].push(c));
  return map;
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(null);
  const display = hover ?? value ?? 0;
  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(null)}
          onClick={() => onChange?.(s)}
          style={{
            fontSize: "15px",
            cursor: onChange ? "pointer" : "default",
            color: s <= display ? "#f59e0b" : "#d1d5db",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
      {value !== null && value !== undefined && (
        <span style={{ fontSize: "11px", color: "#6b7280", marginLeft: "3px" }}>{value}/5</span>
      )}
    </div>
  );
}

function SkillBar({ value }) {
  const color = value >= 85 ? "#10b981" : value >= 70 ? "#3b82f6" : "#f59e0b";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
        <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: 500 }}>Skill Score</span>
        <span style={{ fontSize: "11px", fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: "4px", borderRadius: "99px", background: "#e5e7eb", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: "99px", transition: "width .3s" }} />
      </div>
    </div>
  );
}

/* ─── Candidate Card ──────────────────────────────────────────────────── */
function CandidateCard({ candidate, colIndex, totalCols, onMove, onRating, onNotes }) {
  const [localNotes, setLocalNotes] = useState(candidate.notes);
  const [editing,    setEditing]    = useState(false);

  const initials = candidate.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const hueMap   = [210, 160, 280, 40, 0, 320, 200, 100];
  const hue      = hueMap[candidate.id % hueMap.length];

  const saveNotes = () => {
    setEditing(false);
    onNotes(candidate.id, localNotes);
  };

  return (
    <div
      style={{
        background: "var(--card, #ffffff)",
        border: "1px solid var(--border, #e5e7eb)",
        borderRadius: "10px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        boxShadow: "0 1px 3px rgba(0,0,0,.06)",
        transition: "box-shadow .2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.10)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.06)")}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
            background: `hsl(${hue},60%,88%)`, color: `hsl(${hue},50%,30%)`,
            fontWeight: 700, fontSize: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground, #111827)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {candidate.name}
          </div>
          <div style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {candidate.college}
          </div>
        </div>
      </div>

      {/* Skill bar */}
      <SkillBar value={candidate.skillScore} />

      {/* Interview Rating */}
      <div>
        <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: 500, marginBottom: "4px" }}>Interview Rating</div>
        <StarRating value={candidate.interviewRating} onChange={(v) => onRating(candidate.id, v)} />
        {candidate.interviewRating === null && (
          <span style={{ fontSize: "10px", color: "#9ca3af", fontStyle: "italic" }}>Not yet rated — click to rate</span>
        )}
      </div>

      {/* Notes */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: 500 }}>Notes</span>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", color: "#9ca3af", display: "flex", alignItems: "center" }}
              title="Edit notes"
            >
              <iconify-icon icon="lucide:pencil" style={{ fontSize: "11px" }}></iconify-icon>
            </button>
          ) : (
            <button
              onClick={saveNotes}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", color: "#10b981", display: "flex", alignItems: "center" }}
              title="Save"
            >
              <iconify-icon icon="lucide:check" style={{ fontSize: "12px" }}></iconify-icon>
            </button>
          )}
        </div>
        {editing ? (
          <textarea
            autoFocus
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            onBlur={saveNotes}
            rows={2}
            placeholder="Add a note…"
            style={{
              width: "100%", boxSizing: "border-box", padding: "6px 8px",
              fontSize: "11px", borderRadius: "6px", resize: "none",
              border: "1px solid #93c5fd", outline: "none",
              color: "var(--foreground, #111827)", background: "#f0f9ff",
              fontFamily: "inherit", lineHeight: 1.5,
            }}
          />
        ) : (
          <div
            onClick={() => setEditing(true)}
            style={{
              fontSize: "11px",
              color: localNotes ? "#374151" : "#d1d5db",
              fontStyle: localNotes ? "normal" : "italic",
              minHeight: "28px", lineHeight: 1.5, cursor: "text",
              padding: "4px 6px", borderRadius: "6px",
              background: "#f9fafb", border: "1px solid transparent",
              transition: "border-color .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            {localNotes || "Add a note…"}
          </div>
        )}
      </div>

      {/* Move buttons */}
      <div style={{ display: "flex", gap: "6px", borderTop: "1px solid var(--border, #e5e7eb)", paddingTop: "8px" }}>
        {colIndex > 0 && (
          <button
            onClick={() => onMove(candidate.id, colIndex - 1)}
            style={{
              flex: 1, padding: "5px 0", borderRadius: "6px",
              border: "1px solid var(--border, #e5e7eb)",
              background: "transparent", color: "#6b7280",
              fontSize: "11px", fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "3px",
            }}
          >
            <iconify-icon icon="lucide:chevron-left" style={{ fontSize: "12px" }}></iconify-icon> Back
          </button>
        )}
        {colIndex < totalCols - 1 && (
          <button
            onClick={() => onMove(candidate.id, colIndex + 1)}
            style={{
              flex: 1, padding: "5px 0", borderRadius: "6px", border: "none",
              background: "#1d4ed8", color: "#fff",
              fontSize: "11px", fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "3px",
            }}
          >
            {COLUMNS[colIndex + 1].label.split(" ")[0]}
            <iconify-icon icon="lucide:chevron-right" style={{ fontSize: "12px" }}></iconify-icon>
          </button>
        )}
        {colIndex === totalCols - 1 && (
          <div style={{ flex: 1, textAlign: "center", fontSize: "11px", color: "#8b5cf6", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
            <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: "13px" }}></iconify-icon> Hired ✓
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */
export default function InterviewPipeline() {
  const [cols,   setCols]   = useState(initCols);
  const [search, setSearch] = useState("");

  const totalCandidates = COL_IDS.reduce((sum, id) => sum + cols[id].length, 0);
  const hiredCount      = cols["hired"].length;

  const handleMove = (cardId, targetColIndex) => {
    const targetColId = COL_IDS[targetColIndex];
    setCols((prev) => {
      const next = {};
      COL_IDS.forEach((id) => (next[id] = [...prev[id]]));
      let card = null;
      COL_IDS.forEach((id) => {
        const idx = next[id].findIndex((c) => c.id === cardId);
        if (idx !== -1) { [card] = next[id].splice(idx, 1); }
      });
      if (card) next[targetColId].push({ ...card, col: targetColId });
      return next;
    });
  };

  const handleRating = (cardId, rating) => {
    setCols((prev) => {
      const next = {};
      COL_IDS.forEach((id) => {
        next[id] = prev[id].map((c) => (c.id === cardId ? { ...c, interviewRating: rating } : c));
      });
      return next;
    });
  };

  const handleNotes = (cardId, notes) => {
    setCols((prev) => {
      const next = {};
      COL_IDS.forEach((id) => {
        next[id] = prev[id].map((c) => (c.id === cardId ? { ...c, notes } : c));
      });
      return next;
    });
  };

  const query = search.toLowerCase();
  const filteredCols = {};
  COL_IDS.forEach((id) => {
    filteredCols[id] = query
      ? cols[id].filter((c) => c.name.toLowerCase().includes(query) || c.college.toLowerCase().includes(query))
      : cols[id];
  });

  return (
    <div style={{ padding: "28px 32px", fontFamily: "Inter, sans-serif", background: "var(--background, #f9fafb)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "22px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--foreground, #111827)", margin: "0 0 4px 0" }}>
            Interview Pipeline
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
            {totalCandidates} candidates across {COL_IDS.length} stages&nbsp;&nbsp;·&nbsp;&nbsp;
            <span style={{ color: "#8b5cf6", fontWeight: 600 }}>{hiredCount} hired</span>
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <iconify-icon
            icon="lucide:search"
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "#9ca3af", pointerEvents: "none" }}
          ></iconify-icon>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates…"
            style={{
              padding: "8px 12px 8px 32px", borderRadius: "8px", fontSize: "13px",
              border: "1px solid var(--border, #e5e7eb)", background: "var(--card, #fff)",
              color: "var(--foreground, #111827)", outline: "none", width: "220px",
            }}
          />
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "22px", overflowX: "auto", paddingBottom: "4px" }}>
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            style={{
              flex: "1 0 120px", minWidth: "120px",
              background: col.bg, border: `1px solid ${col.dot}40`,
              borderRadius: "10px", padding: "12px 14px",
              display: "flex", alignItems: "center", gap: "10px",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: col.dot, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: col.accent, lineHeight: 1 }}>
                {filteredCols[col.id].length}
              </div>
              <div style={{ fontSize: "10px", color: col.accent, fontWeight: 500, marginTop: "2px", whiteSpace: "nowrap" }}>
                {col.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div style={{ display: "flex", gap: "14px", overflowX: "auto", paddingBottom: "16px", alignItems: "flex-start" }}>
        {COLUMNS.map((col, colIndex) => (
          <div key={col.id} style={{ flex: "0 0 252px", minWidth: "252px" }}>

            {/* Column header */}
            <div
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "9px 12px", marginBottom: "10px",
                borderRadius: "8px", background: col.bg,
                border: `1px solid ${col.dot}50`,
              }}
            >
              <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: col.dot }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: col.accent, flex: 1 }}>{col.label}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: col.accent, background: `${col.dot}25`, padding: "1px 7px", borderRadius: "99px" }}>
                {filteredCols[col.id].length}
              </span>
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredCols[col.id].length === 0 ? (
                <div
                  style={{
                    padding: "24px 12px", borderRadius: "10px",
                    border: "1.5px dashed var(--border, #e5e7eb)",
                    textAlign: "center", color: "#c4c9d4", fontSize: "12px",
                  }}
                >
                  No candidates
                </div>
              ) : (
                filteredCols[col.id].map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    colIndex={colIndex}
                    totalCols={COLUMNS.length}
                    onMove={handleMove}
                    onRating={handleRating}
                    onNotes={handleNotes}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


