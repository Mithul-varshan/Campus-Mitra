import { useState } from "react";

/* ─── Skill options ───────────────────────────────────────────────────────── */
const SKILL_OPTIONS = [
  "React", "Node.js", "Python", "Java", "TypeScript", "MongoDB", "PostgreSQL",
  "AWS", "Docker", "Kubernetes", "Machine Learning", "Deep Learning", "NLP",
  "System Design", "REST APIs", "GraphQL", "Redis", "TensorFlow", "Spring Boot",
  "DevOps", "CI/CD", "SQL", "Data Structures", "Algorithms", "Figma",
];

/* ─── Mock AI-matched candidates ─────────────────────────────────────────── */
const MOCK_MATCHES = [
  { id: 1, name: "Arjun Mehta",    college: "IIT Madras",     dept: "CSE",  year: "3rd",  skillScore: 94, fitScore: 97, verified: true  },
  { id: 2, name: "Priya Sharma",   college: "BITS Pilani",    dept: "CS",   year: "4th",  skillScore: 89, fitScore: 93, verified: true  },
  { id: 3, name: "Rahul Nair",     college: "NIT Trichy",     dept: "IT",   year: "3rd",  skillScore: 86, fitScore: 89, verified: true  },
  { id: 4, name: "Sneha Iyer",     college: "VIT Vellore",    dept: "CSE",  year: "4th",  skillScore: 82, fitScore: 85, verified: false },
  { id: 5, name: "Karan Gupta",    college: "IIT Delhi",      dept: "CSE",  year: "3rd",  skillScore: 91, fitScore: 94, verified: true  },
  { id: 6, name: "Anjali Reddy",   college: "IIIT Hyderabad", dept: "CS",   year: "4th",  skillScore: 88, fitScore: 91, verified: true  },
];

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const CARD = {
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e2e8f0)",
  borderRadius: "8px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  padding: "24px",
};

const INPUT_STYLE = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "6px",
  border: "1px solid var(--border, #e2e8f0)",
  background: "var(--background, #f8fafc)",
  fontSize: "13px",
  color: "var(--foreground, #0f172a)",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const LABEL_STYLE = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--muted-foreground, #64748b)",
  marginBottom: "6px",
};

const SECTION_TITLE = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--muted-foreground, #64748b)",
  margin: "0 0 16px 0",
};

const fitColor = (s) =>
  s >= 90 ? { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" }
  : s >= 80 ? { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" }
  : { bg: "#fffbeb", color: "#b45309", border: "#fde68a" };

/* ─── Field wrapper ───────────────────────────────────────────────────────── */
function Field({ label, children, span }) {
  return (
    <div style={{ gridColumn: span ? "1 / -1" : undefined }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
const EMPTY_FORM = {
  title: "", skills: [], minScore: 70, ctcMin: "", ctcMax: "",
  location: "", type: "Internship", eligibility: "", description: "",
};

export default function JobPosting() {
  const [form, setForm]         = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [skillSearch, setSkillSearch] = useState("");

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleSkill = (sk) =>
    set("skills", form.skills.includes(sk)
      ? form.skills.filter((s) => s !== sk)
      : [...form.skills, sk]);

  const filteredSkills = SKILL_OPTIONS.filter(
    (s) => s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || form.skills.length === 0) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setSkillSearch("");
    setSubmitted(false);
  };

  /* matched = all candidates whose skillScore >= form.minScore, sorted by fitScore */
  const matched = MOCK_MATCHES
    .filter((c) => c.skillScore >= form.minScore)
    .sort((a, b) => b.fitScore - a.fitScore);

  return (
    <div
      style={{
        padding: "28px 32px",
        fontFamily: "Inter, system-ui, sans-serif",
        background: "var(--background, #f8fafc)",
        minHeight: "100vh",
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground, #0f172a)", marginBottom: "3px" }}>
          Job Posting
        </div>
        <div style={{ fontSize: "13px", color: "var(--muted-foreground, #64748b)" }}>
          Define the role and let the platform surface the best-matched candidates
        </div>
      </div>

      {/* ── Centered form container ── */}
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {!submitted ? (
          /* ════ FORM ════ */
          <form onSubmit={handleSubmit}>
            <div style={CARD}>
              <div style={{ ...SECTION_TITLE }}>Role Details</div>

              {/* Grid layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "18px",
                }}
              >
                {/* Job Title — full width */}
                <Field label="Job Title" span>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. SDE Intern – Full Stack"
                    style={INPUT_STYLE}
                  />
                </Field>

                {/* Type */}
                <Field label="Type">
                  <select
                    value={form.type}
                    onChange={(e) => set("type", e.target.value)}
                    style={INPUT_STYLE}
                  >
                    <option>Internship</option>
                    <option>Full-time</option>
                    <option>Contract</option>
                  </select>
                </Field>

                {/* Location */}
                <Field label="Location">
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="e.g. Bangalore (Hybrid)"
                    style={INPUT_STYLE}
                  />
                </Field>

                {/* CTC Range */}
                <Field label="CTC / Stipend Min (₹)">
                  <input
                    type="text"
                    value={form.ctcMin}
                    onChange={(e) => set("ctcMin", e.target.value)}
                    placeholder="e.g. 50,000 / month or 12 LPA"
                    style={INPUT_STYLE}
                  />
                </Field>

                <Field label="CTC / Stipend Max (₹)">
                  <input
                    type="text"
                    value={form.ctcMax}
                    onChange={(e) => set("ctcMax", e.target.value)}
                    placeholder="e.g. 80,000 / month or 18 LPA"
                    style={INPUT_STYLE}
                  />
                </Field>

                {/* Min Skill Score */}
                <Field label={`Minimum Skill Score — ${form.minScore}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={form.minScore}
                      onChange={(e) => set("minScore", Number(e.target.value))}
                      style={{ flex: 1, accentColor: "var(--primary, #2b4ed6)", cursor: "pointer" }}
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: "5px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        border: "1px solid #bfdbfe",
                        minWidth: "36px",
                        textAlign: "center",
                      }}
                    >
                      {form.minScore}
                    </span>
                  </div>
                </Field>

                {/* Required Skills — full width */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={LABEL_STYLE}>
                    Required Skills
                    {form.skills.length > 0 && (
                      <span style={{ marginLeft: "8px", fontWeight: 500, textTransform: "none", letterSpacing: 0, color: "#2b4ed6" }}>
                        ({form.skills.length} selected)
                      </span>
                    )}
                  </label>

                  {/* Selected chips */}
                  {form.skills.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                      {form.skills.map((sk) => (
                        <span
                          key={sk}
                          onClick={() => toggleSkill(sk)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 10px",
                            borderRadius: "5px",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {sk}
                          <iconify-icon icon="lucide:x" style={{ fontSize: "11px" }}></iconify-icon>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Search + options */}
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder="Search skills..."
                    style={{ ...INPUT_STYLE, marginBottom: "8px" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      padding: "12px",
                      border: "1px solid var(--border, #e2e8f0)",
                      borderRadius: "6px",
                      background: "var(--secondary, #f8fafc)",
                      maxHeight: "130px",
                      overflowY: "auto",
                    }}
                  >
                    {filteredSkills.map((sk) => {
                      const sel = form.skills.includes(sk);
                      return (
                        <span
                          key={sk}
                          onClick={() => toggleSkill(sk)}
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "5px",
                            border: "1px solid",
                            borderColor: sel ? "#bfdbfe" : "var(--border, #e2e8f0)",
                            background: sel ? "#eff6ff" : "transparent",
                            color: sel ? "#1d4ed8" : "var(--foreground, #0f172a)",
                            fontSize: "12px",
                            fontWeight: sel ? 700 : 400,
                            cursor: "pointer",
                          }}
                        >
                          {sk}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Eligibility — full width */}
                <Field label="Eligibility Criteria" span>
                  <input
                    type="text"
                    value={form.eligibility}
                    onChange={(e) => set("eligibility", e.target.value)}
                    placeholder="e.g. B.Tech CSE / IT, 3rd or 4th year, GPA ≥ 8.0"
                    style={INPUT_STYLE}
                  />
                </Field>

                {/* Description — full width */}
                <Field label="Job Description" span>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Describe the role, responsibilities, and what you are looking for..."
                    style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                  />
                </Field>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "9px 22px",
                    borderRadius: "6px",
                    border: "none",
                    background: "var(--primary, #2b4ed6)",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <iconify-icon icon="lucide:send" style={{ fontSize: "13px" }}></iconify-icon>
                  Post & Find Matches
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "6px",
                    border: "1px solid var(--border, #e2e8f0)",
                    background: "transparent",
                    color: "var(--muted-foreground, #64748b)",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </form>

        ) : (
          /* ════ POST-SUBMIT VIEW ════ */
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Posted job summary */}
            <div style={{ ...CARD, borderLeft: "4px solid var(--primary, #2b4ed6)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground, #0f172a)", marginBottom: "4px" }}>
                    {form.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--muted-foreground, #64748b)", marginBottom: "10px" }}>
                    {form.type}{form.location ? ` · ${form.location}` : ""}{(form.ctcMin || form.ctcMax) ? ` · ₹${form.ctcMin}${form.ctcMax ? ` – ${form.ctcMax}` : ""}` : ""}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {form.skills.map((sk) => (
                      <span
                        key={sk}
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
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "5px",
                      background: "#f0fdf4",
                      color: "#15803d",
                      border: "1px solid #bbf7d0",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    ✓ Posted
                  </span>
                  <button
                    onClick={handleReset}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "5px",
                      border: "1px solid var(--border, #e2e8f0)",
                      background: "transparent",
                      color: "var(--muted-foreground, #64748b)",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Post Another
                  </button>
                </div>
              </div>
              {form.eligibility && (
                <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--muted-foreground, #64748b)" }}>
                  <strong style={{ color: "var(--foreground, #0f172a)" }}>Eligibility:</strong> {form.eligibility}
                </div>
              )}
              {form.description && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--muted-foreground, #64748b)", lineHeight: 1.6 }}>
                  {form.description}
                </div>
              )}
            </div>

            {/* AI Matched Candidates */}
            <div style={CARD}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <div style={{ ...SECTION_TITLE, margin: "0 0 2px 0" }}>AI-Matched Candidates</div>
                  <div style={{ fontSize: "12px", color: "var(--muted-foreground, #64748b)" }}>
                    Ranked by AI Fit Score · Skill Score ≥ {form.minScore} · {matched.length} result{matched.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    border: "1px solid #bfdbfe",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  <iconify-icon icon="lucide:cpu" style={{ fontSize: "13px" }}></iconify-icon>
                  AI Powered
                </span>
              </div>

              {matched.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "var(--muted-foreground, #64748b)",
                    fontSize: "13px",
                  }}
                >
                  <iconify-icon
                    icon="lucide:users-2"
                    style={{ fontSize: "32px", display: "block", margin: "0 auto 10px" }}
                  ></iconify-icon>
                  No candidates meet the minimum skill score of {form.minScore}.<br />
                  Try lowering the threshold.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

                  {/* Table header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 80px 80px 100px 100px",
                      gap: "0 12px",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      background: "var(--secondary, #f8fafc)",
                      border: "1px solid var(--border, #e2e8f0)",
                    }}
                  >
                    {["Candidate", "College", "Dept", "Year", "Skill Score", "AI Fit Score"].map((h) => (
                      <span
                        key={h}
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          color: "var(--muted-foreground, #64748b)",
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Rows */}
                  {matched.map((c, i) => {
                    const fc = fitColor(c.fitScore);
                    return (
                      <div
                        key={c.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 80px 80px 100px 100px",
                          gap: "0 12px",
                          padding: "10px 14px",
                          borderRadius: "6px",
                          border: "1px solid var(--border, #e2e8f0)",
                          alignItems: "center",
                          background: i % 2 === 0 ? "transparent" : "var(--secondary, #f8fafc)",
                        }}
                      >
                        {/* Name */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "5px",
                              background: "#eff6ff",
                              color: "#1d4ed8",
                              fontSize: "11px",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {c.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground, #0f172a)" }}>
                              {c.name}
                            </div>
                            {c.verified && (
                              <div
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                  fontSize: "10px",
                                  color: "#15803d",
                                  fontWeight: 600,
                                }}
                              >
                                <iconify-icon icon="lucide:shield-check" style={{ fontSize: "10px" }}></iconify-icon>
                                Verified
                              </div>
                            )}
                          </div>
                        </div>

                        {/* College */}
                        <span style={{ fontSize: "12px", color: "var(--foreground, #0f172a)" }}>
                          {c.college}
                        </span>

                        {/* Dept */}
                        <span style={{ fontSize: "12px", color: "var(--muted-foreground, #64748b)" }}>
                          {c.dept}
                        </span>

                        {/* Year */}
                        <span style={{ fontSize: "12px", color: "var(--muted-foreground, #64748b)" }}>
                          {c.year} yr
                        </span>

                        {/* Skill Score */}
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "var(--foreground, #0f172a)",
                          }}
                        >
                          {c.skillScore}
                          <span style={{ fontSize: "10px", fontWeight: 400, color: "var(--muted-foreground, #64748b)" }}>
                            /100
                          </span>
                        </span>

                        {/* AI Fit Score */}
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 10px",
                            borderRadius: "5px",
                            background: fc.bg,
                            color: fc.color,
                            border: `1px solid ${fc.border}`,
                            fontSize: "13px",
                            fontWeight: 800,
                          }}
                        >
                          {c.fitScore}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {matched.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <button
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      background: "var(--primary, #2b4ed6)",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <iconify-icon icon="lucide:mail" style={{ fontSize: "13px" }}></iconify-icon>
                    Invite All Matched Candidates
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
