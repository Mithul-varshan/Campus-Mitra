import { useState } from "react";
import {
  Download, BarChart2, Award, Calendar, RefreshCw,
  TrendingUp, Layers, Star, ChevronDown, ChevronRight,
} from "lucide-react";
import { generateNIRFReport, generateNAACReport } from "../utils/reportGenerators";

/* ─── Styles ─────────────────────────────────────────────── */
const S = {
  page:        { minHeight: "100vh", background: "var(--background)", padding: "32px" },
  wrap:        { maxWidth: 1240, margin: "0 auto" },
  header:      { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 },
  title:       { fontSize: 22, fontWeight: 700, color: "var(--foreground)", margin: 0 },
  sub:         { fontSize: 13, color: "var(--muted-foreground)", marginTop: 4 },
  layout:      { display: "block", gap: 20 },
  card:        { background: "var(--card, var(--background))", border: "1px solid var(--border)", borderRadius: 10, padding: "24px 26px" },
  sectionTitle:{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 },
  sectionSub:  { fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 },
  typeGrid:    { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 22 },
  typeCard:    (active) => ({
    padding: "12px 14px", borderRadius: 8,
    border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`,
    background: active ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "var(--muted)",
    cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all .15s",
  }),
  typeIcon:    (active) => ({
    width: 30, height: 30, borderRadius: 6,
    background: active ? "var(--primary)" : "var(--border)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  }),
  typeName:    (active) => ({ fontSize: 12, fontWeight: 700, color: active ? "var(--primary)" : "var(--foreground)" }),
  typeDesc:    { fontSize: 10, color: "var(--muted-foreground)", marginTop: 2, lineHeight: 1.4 },
  divider:     { borderTop: "1px solid var(--border)", margin: "18px 0" },
  fieldLabel:  { display: "block", fontSize: 11, fontWeight: 600, color: "var(--foreground)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" },
  fieldInput:  { width: "100%", padding: "9px 12px", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 7, fontSize: 13, color: "var(--foreground)", outline: "none", boxSizing: "border-box" },
  twoCol:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  generateBtn: (loading) => ({
    width: "100%", padding: "12px 0", background: "var(--primary)", color: "#fff", border: "none",
    borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  }),
};

/* ─── Data ────────────────────────────────────────────────── */
const REPORT_TYPES = [
  { id: "naac",     icon: Award,       label: "NAAC",           desc: "Criterion-wise accreditation" },
  { id: "nirf",     icon: TrendingUp,  label: "NIRF",           desc: "Ranking-oriented data" },
  { id: "nba",      icon: Layers,      label: "NBA",            desc: "Program-level outcomes" },
  { id: "college",  icon: BarChart2,   label: "College KPIs",   desc: "Per-college performance" },
  { id: "platform", icon: RefreshCw,   label: "Platform",       desc: "Usage & growth analytics" },
  { id: "events",   icon: Calendar,    label: "Events",         desc: "Event stats & participation" },
];

/* Format options + hints per framework */
const TYPE_FORMATS = {
  naac:     { formats: ["PDF", "XLSX"],                primary: "PDF",  hints: { PDF: "Final NAAC-ready submission", XLSX: "Internal data preparation (not submitted)" } },
  nirf:     { formats: ["PDF", "XLSX"],                primary: "PDF",  hints: { PDF: "Human-readable NIRF summary report", XLSX: "NIRF data upload sheets (coming soon)" } },
  nba:      { formats: ["PDF", "XLSX"],                primary: "PDF",  hints: { PDF: "Program-wise NBA reports", XLSX: "Evidence compilation & mapping (internal)" } },
  college:  { formats: ["PDF", "CSV", "XLSX", "JSON"], primary: "PDF",  hints: {} },
  platform: { formats: ["PDF", "CSV", "XLSX", "JSON"], primary: "PDF",  hints: {} },
  events:   { formats: ["PDF", "CSV", "XLSX"],         primary: "PDF",  hints: {} },
};

const TYPE_COLOR = {
  naac:     { bg: "#dbeafe", fg: "#1e40af" },
  nirf:     { bg: "#dcfce7", fg: "#166534" },
  nba:      { bg: "#ede9fe", fg: "#5b21b6" },
  college:  { bg: "#fef9c3", fg: "#713f12" },
  platform: { bg: "#f1f5f9", fg: "#475569" },
  events:   { bg: "#ffedd5", fg: "#9a3412" },
};

const SUB_REPORTS = {
  naac: [
    {
      group: "Criterion I & II – Students & Teaching–Learning",
      reports: [
        { id: "n1", name: "Student Participation & Engagement Report", critical: true },
        { id: "n2", name: "Department-wise Student Activity Report" },
        { id: "n3", name: "Student Achievement Verification Summary" },
      ],
    },
    {
      group: "Criterion III – Research, Innovation & Extension",
      reports: [
        { id: "n4", name: "Research, Innovation & Project Participation Report" },
        { id: "n5", name: "Extension, Outreach & Social Impact Activities Report" },
      ],
    },
    {
      group: "Criterion V – Student Support & Progression",
      reports: [
        { id: "n6", name: "Verified Student Portfolio Report" },
        { id: "n7", name: "Awards, Recognitions & Merit Distribution Report" },
      ],
    },
    {
      group: "Criterion VI – Governance & Documentation",
      reports: [
        { id: "n8", name: "Institutional Verification & Approval Audit Report" },
        { id: "n9", name: "Event-wise Participation and Outcome Report" },
      ],
    },
  ],
  nirf: [
    {
      group: "Participation & Outcomes",
      reports: [
        { id: "ni1", name: "Student Participation in Co-curricular & Extra-curricular Activities", critical: true },
        { id: "ni2", name: "Institutional Events & Competitions Summary Report" },
      ],
    },
    {
      group: "Innovation & Projects",
      reports: [
        { id: "ni3", name: "Student Innovation, Projects & Research Activities Report", critical: true },
      ],
    },
    {
      group: "Recognition & Visibility",
      reports: [
        { id: "ni4", name: "Student Awards, Rankings & Competitive Performance Report" },
      ],
    },
    {
      group: "Data Integrity",
      reports: [
        { id: "ni5", name: "Verified Institutional Activity Dataset (Year-wise)" },
      ],
    },
  ],
  nba: [
    {
      group: "Student Outcomes",
      reports: [
        { id: "nb1", name: "Program-wise Student Activity & Achievement Report", critical: true },
        { id: "nb2", name: "Outcome-Based Student Participation Mapping Report" },
      ],
    },
    {
      group: "Projects & Skills",
      reports: [
        { id: "nb3", name: "Capstone, Mini-Project & Hackathon Participation Report" },
        { id: "nb4", name: "Technical & Professional Skill Exposure Report" },
      ],
    },
    {
      group: "Continuous Improvement",
      reports: [
        { id: "nb5", name: "Verified Student Achievement Evidence Report" },
        { id: "nb6", name: "Program Analytics & Participation Trends Report" },
      ],
    },
  ],
};

/* ─── Component ───────────────────────────────────────────── */
export default function ReportsExports() {
  const [selectedType,      setSelectedType]      = useState("naac");
  const [selectedSubReport, setSelectedSubReport] = useState("n1");
  const [format,            setFormat]            = useState("PDF");
  const [dateFrom,          setDateFrom]          = useState("2026-01-01");
  const [dateTo,            setDateTo]            = useState("2026-02-24");
  const [loading,           setLoading]           = useState(false);
  const [subReportOpen,     setSubReportOpen]     = useState(false);

  const activeSubReports = SUB_REPORTS[selectedType] || null;
  const fmtConfig        = TYPE_FORMATS[selectedType];
  const allowedFormats   = fmtConfig.formats;
  const fmtHints         = fmtConfig.hints;

  const handleTypeChange = (id) => {
    setSelectedType(id);
    const subs = SUB_REPORTS[id];
    setSelectedSubReport(subs ? subs[0].reports[0].id : "");
    setFormat(TYPE_FORMATS[id].primary);
    setSubReportOpen(false); // collapse when switching framework
  };

  const getSubReportName = () => {
    if (!activeSubReports) return null;
    for (const group of activeSubReports) {
      const r = group.reports.find((r) => r.id === selectedSubReport);
      if (r) return r.name;
    }
    return null;
  };

  const handleGenerate = () => {
    if (format !== "PDF") {
      alert("XLSX / CSV export coming soon. Please select PDF format.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      try {
        const params = { dateFrom, dateTo, subReportName: getSubReportName() };
        if      (selectedType === "nirf") generateNIRFReport(params);
        else if (selectedType === "naac") generateNAACReport(params);
        else if (selectedType === "nba")  generateNAACReport({ ...params });
        else alert("Report generation for this framework is coming soon.");
      } catch (e) {
        console.error(e);
        alert("PDF generation failed.\nRun: npm install jspdf jspdf-autotable");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* ── Header ── */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Reports & Exports</h1>
            <p style={S.sub}>Generate NAAC, NIRF, and NBA compliance reports. Download as PDF or XLSX.</p>
          </div>
        </div>

        <div style={S.layout}>

          {/* ══ Generator ══ */}
          <div>
            <div style={S.card}>

              {/* Step 1 – Framework */}
              <div style={S.sectionTitle}>1 — Select Framework</div>
              <div style={{ ...S.sectionSub, marginBottom: 14 }}>Choose the accreditation or ranking body</div>

              <div style={S.typeGrid}>
                {REPORT_TYPES.map(({ id, icon: Icon, label, desc }) => {
                  const active = selectedType === id;
                  return (
                    <div key={id} style={S.typeCard(active)} onClick={() => handleTypeChange(id)}>
                      <div style={S.typeIcon(active)}>
                        <Icon size={15} color={active ? "#fff" : "var(--muted-foreground)"} />
                      </div>
                      <div>
                        <div style={S.typeName(active)}>{label}</div>
                        <div style={S.typeDesc}>{desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step 2 – Sub-report flat list (collapsible, closed by default) */}
              {activeSubReports && (
                <>
                  <div style={S.divider} />

                  {/* Toggle header */}
                  <div
                    onClick={() => setSubReportOpen((o) => !o)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: "pointer", padding: "4px 0", marginBottom: 6,
                      borderRadius: 6,
                    }}
                  >
                    <div>
                      <div style={S.sectionTitle}>2 — Select Report</div>
                      <div style={{ ...S.sectionSub, marginBottom: 0, marginTop: 2 }}>
                        {subReportOpen
                          ? "Click a report to select it"
                          : (getSubReportName() || "Click to expand and choose a report")}
                      </div>
                    </div>
                    <div style={{ color: "var(--muted-foreground)", flexShrink: 0, marginLeft: 10 }}>
                      {subReportOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>

                  {subReportOpen && (
                  <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
                    {activeSubReports.map((group, gi) => (
                      <div key={group.group}>
                        {/* Group header */}
                        <div style={{
                          padding: "6px 14px",
                          background: "var(--muted)",
                          borderTop: gi > 0 ? "1px solid var(--border)" : "none",
                          fontSize: 10, fontWeight: 700,
                          color: "var(--muted-foreground)",
                          textTransform: "uppercase", letterSpacing: "0.05em",
                        }}>
                          {group.group}
                        </div>
                        {/* Report rows */}
                        {group.reports.map((rep, ri) => {
                          const sel    = selectedSubReport === rep.id;
                          const isLast = gi === activeSubReports.length - 1 && ri === group.reports.length - 1;
                          return (
                            <div
                              key={rep.id}
                              onClick={() => setSelectedSubReport(rep.id)}
                              style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 14px",
                                borderBottom: isLast ? "none" : "1px solid var(--border)",
                                cursor: "pointer",
                                background: sel ? "color-mix(in srgb, var(--primary) 7%, transparent)" : "var(--card, var(--background))",
                                transition: "background .1s",
                              }}
                            >
                              {/* Radio circle */}
                              <div style={{
                                width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                                border: `2px solid ${sel ? "var(--primary)" : "var(--border)"}`,
                                background: sel ? "var(--primary)" : "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                {sel && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                              </div>
                              <span style={{
                                flex: 1, fontSize: 12, lineHeight: 1.45,
                                fontWeight: sel ? 600 : 400,
                                color: sel ? "var(--primary)" : "var(--foreground)",
                              }}>
                                {rep.name}
                              </span>
                              {rep.critical && (
                                <span style={{
                                  display: "flex", alignItems: "center", gap: 3,
                                  fontSize: 10, fontWeight: 700,
                                  background: "#fef3c7", color: "#92400e",
                                  padding: "2px 7px", borderRadius: 10, flexShrink: 0,
                                }}>
                                  <Star size={9} /> Key
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  )}
                </>
              )}

              {/* Step 3 – Date range */}
              <div style={S.divider} />
              <div style={S.sectionTitle}>{activeSubReports ? "3" : "2"} — Date Range & Format</div>
              <div style={{ ...S.sectionSub, marginTop: 2, marginBottom: 14 }}>Set the reporting period and output format</div>

              <div style={{ ...S.twoCol, marginBottom: 16 }}>
                <div>
                  <label style={S.fieldLabel}>From</label>
                  <input type="date" style={S.fieldInput} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </div>
                <div>
                  <label style={S.fieldLabel}>To</label>
                  <input type="date" style={S.fieldInput} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
              </div>

              {/* Format selector — radio-style with hints */}
              <label style={{ ...S.fieldLabel, marginBottom: 10 }}>Output Format</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
                {allowedFormats.map((f) => {
                  const sel  = format === f;
                  const hint = fmtHints[f];
                  return (
                    <div
                      key={f}
                      onClick={() => setFormat(f)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                        border: `1.5px solid ${sel ? "var(--primary)" : "var(--border)"}`,
                        background: sel ? "color-mix(in srgb, var(--primary) 7%, transparent)" : "var(--muted)",
                        transition: "all .12s",
                      }}
                    >
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${sel ? "var(--primary)" : "var(--border)"}`,
                        background: sel ? "var(--primary)" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {sel && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: sel ? "var(--primary)" : "var(--foreground)" }}>
                          {f}
                        </span>
                        {hint && (
                          <span style={{ fontSize: 11, color: "var(--muted-foreground)", marginLeft: 8 }}>{hint}</span>
                        )}
                      </div>
                      {f === fmtConfig.primary && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: "#dbeafe", color: "#1d4ed8", padding: "1px 7px", borderRadius: 10, flexShrink: 0 }}>
                          Recommended
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <button style={S.generateBtn(loading)} onClick={handleGenerate} disabled={loading}>
                {loading
                  ? <><RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> Generating…</>
                  : <><Download size={15} /> Generate Report</>
                }
              </button>
            </div>
          </div>

        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
