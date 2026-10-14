import { useState } from "react";

const initial = [
  { id: 1, name: "Arjun Mehta", college: "IIT Madras", role: "SDE Intern", skills: ["React", "Node.js", "Python"], score: 94, avatar: "AM", color: "#f97316", note: "Strong portfolio, follow up for March drive" },
  { id: 2, name: "Priya Sharma", college: "BITS Pilani", role: "Data Analyst", skills: ["Data Science", "SQL", "ML"], score: 91, avatar: "PS", color: "#10b981", note: "Excellent communication, good MBA fit too" },
  { id: 3, name: "Vikram Singh", college: "IIT Delhi", role: "SDE Intern", skills: ["DevOps", "Kubernetes", "CI/CD"], score: 93, avatar: "VS", color: "#1e3a8a", note: "Rare DevOps skill at undergrad level" },
  { id: 4, name: "Meera Iyer", college: "NIT Warangal", role: "ML Engineer", skills: ["ML", "TensorFlow", "Python"], score: 89, avatar: "MI", color: "#8b5cf6", note: "Research publications, good for ML team" },
];

export default function SavedCandidates() {
  const [candidates, setCandidates] = useState(initial);
  const remove = (id) => setCandidates((prev) => prev.filter((c) => c.id !== id));

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", background: "var(--background)", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)", margin: "0 0 6px 0" }}>Saved Candidates</h1>
        <p style={{ fontSize: "14px", color: "var(--muted-foreground)", margin: 0 }}>{candidates.length} candidates saved for future roles.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {candidates.map((c) => (
          <div key={c.id} style={{ background: "var(--card, white)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: c.color, color: "white", fontWeight: 700, fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>{c.name}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#f97316" }}>{c.score}% Match</span>
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted-foreground)", marginBottom: "8px" }}>{c.college} · {c.role}</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                {c.skills.map((sk) => <span key={sk} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: "#f1f5f9", color: "#475569" }}>{sk}</span>)}
              </div>
              <div style={{ padding: "8px 12px", background: "#fffbeb", borderRadius: "6px", border: "1px solid #fde68a" }}>
                <span style={{ fontSize: "12px", color: "#92400e" }}><iconify-icon icon="lucide:sticky-note" style={{ fontSize: "12px" }}></iconify-icon> {c.note}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ padding: "8px 16px", borderRadius: "8px", background: "#f97316", color: "white", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>View Profile</button>
              <button style={{ padding: "8px 16px", borderRadius: "8px", background: "transparent", color: "var(--foreground)", border: "1px solid var(--border)", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>Schedule</button>
              <button onClick={() => remove(c.id)} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #fecaca", background: "#fef2f2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <iconify-icon icon="lucide:trash-2" style={{ fontSize: "14px", color: "#dc2626" }}></iconify-icon>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
