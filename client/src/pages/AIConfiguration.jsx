import { useState } from "react";
import { Save, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

const s = {
  page: { minHeight: "100vh", background: "var(--background)", padding: "32px" },
  wrap: { maxWidth: 1200, margin: "0 auto" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "var(--foreground)", margin: 0, lineHeight: 1.3 },
  pageSubtitle: { fontSize: 13, color: "var(--muted-foreground)", marginTop: 4 },
  saveBtn: (saving, saved) => ({
    display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 20px",
    background: saved ? "#16a34a" : "var(--primary)", color: "#fff", border: "none",
    borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
    opacity: saving ? 0.7 : 1, transition: "background 0.2s",
  }),
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 },
  kpiCard: { background: "var(--card, var(--background))", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 22px" },
  kpiLabel: { fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" },
  kpiValue: { fontSize: 28, fontWeight: 700, color: "var(--foreground)", lineHeight: 1, marginBottom: 6 },
  kpiMeta: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted-foreground)" },
  kpiUp: { color: "#16a34a", display: "flex", alignItems: "center", gap: 2 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 },
  section: { background: "var(--card, var(--background))", border: "1px solid var(--border)", borderRadius: 10, padding: "24px 26px" },
  sectionFull: { background: "var(--card, var(--background))", border: "1px solid var(--border)", borderRadius: 10, padding: "24px 26px", marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 },
  sectionSub: { fontSize: 12, color: "var(--muted-foreground)", marginBottom: 22 },
  fieldLabel: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 6 },
  fieldHint: { fontSize: 11, color: "var(--muted-foreground)", marginTop: 5 },
  input: { width: "100%", padding: "9px 12px", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 7, fontSize: 13, color: "var(--foreground)", outline: "none", boxSizing: "border-box" },
  select: { width: "100%", padding: "9px 12px", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 7, fontSize: 13, color: "var(--foreground)", outline: "none", boxSizing: "border-box", cursor: "pointer" },
  fieldGroup: { marginBottom: 20 },
  toggleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border)" },
  toggleRowLast: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" },
  toggleLabel: { fontSize: 13, fontWeight: 600, color: "var(--foreground)" },
  toggleHint: { fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 },
  toggleTrack: (on) => ({ width: 38, height: 22, borderRadius: 11, background: on ? "var(--primary)" : "var(--border)", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }),
  toggleThumb: (on) => ({ position: "absolute", top: 3, left: on ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }),
  perfGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 4 },
  perfCell: { padding: "16px 18px", background: "var(--muted)", borderRadius: 8, border: "1px solid var(--border)" },
  perfLabel: { fontSize: 11, color: "var(--muted-foreground)", fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" },
  perfVal: { fontSize: 22, fontWeight: 700, color: "var(--foreground)", marginBottom: 4 },
  perfTrend: { fontSize: 11, display: "flex", alignItems: "center", gap: 4 },
  actionRow: { display: "flex", gap: 10, paddingTop: 18, marginTop: 18, borderTop: "1px solid var(--border)" },
  ghostBtn: { padding: "8px 16px", background: "transparent", border: "1px solid var(--border)", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "var(--foreground)", cursor: "pointer" },
};

function Toggle({ on, onChange }) {
  return (
    <div style={s.toggleTrack(on)} onClick={() => onChange(!on)}>
      <div style={s.toggleThumb(on)} />
    </div>
  );
}

export default function AIConfiguration() {
  const [rec, setRec] = useState({ interestWeight: 45, participationWeight: 35, compatibilityThreshold: 75 });
  const [inactivity, setInactivity] = useState({ inactivityDays: 14, autoEmail: true, pushNotif: true });
  const [report, setReport] = useState({ enabled: true, summaryLength: "medium", tone: "institutional" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 700);
  };

  const kpis = [
    { label: "Total Recommendations", value: "12,847", meta: "Generated this month", trend: "+8.2%" },
    { label: "Success Rate", value: "68.5%", meta: "User engagement rate", trend: "+2.1%" },
    { label: "Active Users", value: "2,140", meta: "Using AI features", trend: "+5.4%" },
    { label: "Generated Summaries", value: "4,521", meta: "Auto-generated reports", trend: "+12%" },
  ];

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.pageTitle}>AI Configuration</h1>
            <p style={s.pageSubtitle}>Configure AI features, recommendation engine, and smart nudges</p>
          </div>
          <button style={s.saveBtn(saving, saved)} onClick={handleSave} disabled={saving}>
            <Save size={14} />
            {saved ? "Saved" : saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        {/* KPI Strip */}
        <div style={s.kpiGrid}>
          {kpis.map((k) => (
            <div key={k.label} style={s.kpiCard}>
              <div style={s.kpiLabel}>{k.label}</div>
              <div style={s.kpiValue}>{k.value}</div>
              <div style={s.kpiMeta}>
                <span style={s.kpiUp}><ArrowUpRight size={11} /> {k.trend}</span>
                <span>· {k.meta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Two-col: Recommendation Engine + Inactivity Nudge */}
        <div style={s.twoCol}>

          {/* Recommendation Engine */}
          <div style={s.section}>
            <div style={s.sectionTitle}>Recommendation Engine</div>
            <div style={s.sectionSub}>Tune weights that drive event and teammate suggestions</div>

            {[
              { key: "interestWeight", label: "Interest-Based Weight", hint: "How much weight to give user interests" },
              { key: "participationWeight", label: "Past Participation Weight", hint: "Weight given to past participation history" },
              { key: "compatibilityThreshold", label: "Teammate Compatibility Threshold", hint: "Minimum score to suggest teammates" },
            ].map(({ key, label, hint }) => (
              <div key={key} style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={s.fieldLabel}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>{rec[key]}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={rec[key]}
                  onChange={(e) => setRec((r) => ({ ...r, [key]: Number(e.target.value) }))}
                  style={{ width: "100%", accentColor: "var(--primary)" }}
                />
                <div style={s.fieldHint}>{hint}</div>
              </div>
            ))}

            <div style={s.actionRow}>
              <button style={s.ghostBtn}>Test Recommendations</button>
            </div>
          </div>

          {/* Inactivity Nudge */}
          <div style={s.section}>
            <div style={s.sectionTitle}>Inactivity Nudge</div>
            <div style={s.sectionSub}>Re-engage users who have gone quiet on the platform</div>

            <div style={s.fieldGroup}>
              <label style={s.fieldLabel}>Inactivity Trigger (Days)</label>
              <input
                type="number" min="1" max="90" value={inactivity.inactivityDays}
                onChange={(e) => setInactivity((i) => ({ ...i, inactivityDays: Number(e.target.value) }))}
                style={s.input}
              />
              <div style={s.fieldHint}>Send nudge after N days of no activity</div>
            </div>

            <div style={s.toggleRow}>
              <div>
                <div style={s.toggleLabel}>Auto Email Nudges</div>
                <div style={s.toggleHint}>Send email reminders to inactive users</div>
              </div>
              <Toggle on={inactivity.autoEmail} onChange={(v) => setInactivity((i) => ({ ...i, autoEmail: v }))} />
            </div>

            <div style={s.toggleRowLast}>
              <div>
                <div style={s.toggleLabel}>Push Notifications</div>
                <div style={s.toggleHint}>Send push notifications for inactivity alerts</div>
              </div>
              <Toggle on={inactivity.pushNotif} onChange={(v) => setInactivity((i) => ({ ...i, pushNotif: v }))} />
            </div>

            <div style={s.actionRow}>
              <button style={s.ghostBtn}>Preview Nudge Message</button>
            </div>
          </div>
        </div>

        {/* Report Auto-Summary */}
        <div style={s.sectionFull}>
          <div style={s.sectionTitle}>Report Auto-Summary</div>
          <div style={s.sectionSub}>Control how AI-generated summaries are produced for reports</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={s.fieldLabel}>Enable AI Summaries</span>
                <Toggle on={report.enabled} onChange={(v) => setReport((r) => ({ ...r, enabled: v }))} />
              </div>
              <div style={s.fieldHint}>Automatically generate summaries when a report is exported</div>
            </div>

            <div>
              <label style={s.fieldLabel}>Summary Length</label>
              <select value={report.summaryLength} onChange={(e) => setReport((r) => ({ ...r, summaryLength: e.target.value }))} style={s.select}>
                <option value="short">Short (50–100 words)</option>
                <option value="medium">Medium (100–250 words)</option>
                <option value="long">Long (250–500 words)</option>
                <option value="detailed">Detailed (500+ words)</option>
              </select>
              <div style={s.fieldHint}>Controls verbosity of the generated summary</div>
            </div>

            <div>
              <label style={s.fieldLabel}>Writing Tone</label>
              <select value={report.tone} onChange={(e) => setReport((r) => ({ ...r, tone: e.target.value }))} style={s.select}>
                <option value="formal">Formal — Academic</option>
                <option value="institutional">Institutional — Official</option>
                <option value="casual">Casual — Friendly</option>
                <option value="technical">Technical — Data-Focused</option>
              </select>
              <div style={s.fieldHint}>Sets the writing style used in summaries</div>
            </div>
          </div>

          <div style={s.actionRow}>
            <button style={s.ghostBtn}>Preview Summary</button>
            <button style={s.ghostBtn}>View Sample Report</button>
            <button style={s.ghostBtn}>Export Settings</button>
          </div>
        </div>

        {/* Performance Insights */}
        <div style={s.sectionFull}>
          <div style={s.sectionTitle}>Performance Insights</div>
          <div style={s.sectionSub}>7-day rolling metrics across all AI subsystems</div>

          <div style={s.perfGrid}>
            {[
              { label: "Recommendation Accuracy", value: "82%", change: "+5%", up: true, sub: "vs last month" },
              { label: "Nudge Effectiveness", value: "64%", change: "+3%", up: true, sub: "re-engagement rate" },
              { label: "Summary Quality", value: "7.8 / 10", change: "+0.5", up: true, sub: "user rating" },
              { label: "System Uptime", value: "99.7%", change: "Excellent", up: true, sub: "7-day average" },
            ].map((p) => (
              <div key={p.label} style={s.perfCell}>
                <div style={s.perfLabel}>{p.label}</div>
                <div style={s.perfVal}>{p.value}</div>
                <div style={s.perfTrend}>
                  <span style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: 3 }}>
                    <TrendingUp size={12} /> {p.change}
                  </span>
                  <span style={{ color: "var(--muted-foreground)" }}>· {p.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
