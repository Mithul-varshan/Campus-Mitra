import { useState } from "react";

const initial = [
  { id: 1, name: "Arjun Mehta", college: "IIT Madras", role: "SDE Intern", avatar: "AM", color: "#f97316", score: 94, status: "Shortlisted", notes: "Strong full-stack background" },
  { id: 2, name: "Priya Sharma", college: "BITS Pilani", role: "Data Analyst", avatar: "PS", color: "#10b981", score: 91, status: "Shortlisted", notes: "Excellent SQL and Tableau skills" },
  { id: 3, name: "Vikram Singh", college: "IIT Delhi", role: "SDE Intern", avatar: "VS", color: "#1e3a8a", score: 93, status: "Interviewed", notes: "Interview scheduled for Mar 5" },
  { id: 4, name: "Sneha Gupta", college: "IIM Ahmedabad", role: "PM Intern", avatar: "SG", color: "#8b5cf6", score: 86, status: "Offer Extended", notes: "Offer sent, awaiting response" },
  { id: 5, name: "Kiran Reddy", college: "VIT Vellore", role: "SDE Intern", avatar: "KR", color: "#059669", score: 82, status: "Shortlisted", notes: "Good Android projects" },
  { id: 6, name: "Aditi Bansal", college: "BITS Goa", role: "ML Engineer", avatar: "AB", color: "#ec4899", score: 80, status: "Rejected", notes: "Skills not matching current need" },
];

const statusColors = { Shortlisted: { bg: "#eff6ff", text: "#1e40af" }, Interviewed: { bg: "#f5f3ff", text: "#7c3aed" }, "Offer Extended": { bg: "#ecfdf5", text: "#10b981" }, Rejected: { bg: "#fef2f2", text: "#dc2626" } };
const statuses = ["Shortlisted", "Interviewed", "Offer Extended", "Rejected"];

export default function ShortlistedCandidates() {
  const [candidates, setCandidates] = useState(initial);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? candidates : candidates.filter((c) => c.status === filter);

  const changeStatus = (id, newStatus) => setCandidates((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", background: "var(--background)", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)", margin: "0 0 6px 0" }}>Shortlisted Candidates</h1>
        <p style={{ fontSize: "14px", color: "var(--muted-foreground)", margin: 0 }}>Manage your candidate pipeline from shortlist to offer.</p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {statuses.map((s) => {
          const count = candidates.filter((c) => c.status === s).length;
          const c = statusColors[s];
          return (
            <div key={s} onClick={() => setFilter(filter === s ? "All" : s)} style={{ padding: "16px", borderRadius: "10px", background: filter === s ? c.bg : "var(--card, white)", border: `2px solid ${filter === s ? c.text : "var(--border)"}`, cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: 800, color: c.text }}>{count}</div>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: 500 }}>{s}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((c) => (
          <div key={c.id} style={{ background: "var(--card, white)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: c.color, color: "white", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", marginBottom: "2px" }}>{c.name}</div>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "6px" }}>{c.college} · {c.role}</div>
              <div style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>{c.notes}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#f97316" }}>{c.score}%</div>
              <div style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>Match</div>
            </div>
            <select value={c.status} onChange={(e) => changeStatus(c.id, e.target.value)} style={{ padding: "7px 12px", borderRadius: "8px", border: `1px solid ${statusColors[c.status].text}`, background: statusColors[c.status].bg, color: statusColors[c.status].text, fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button style={{ padding: "8px 14px", borderRadius: "8px", background: "#f97316", color: "white", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>View</button>
          </div>
        ))}
      </div>
    </div>
  );
}
