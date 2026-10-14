import { useState, useMemo } from "react";

/* ─── Mock Data ─────────────────────────────────────────────────────── */
const CERTIFICATES = [
  { id: "CERT-2025-001", student: "Riya Patel", college: "Tech Institute of Advanced Studies", type: "Hackathon Winner", event: "HackFest 2025", issued: "Jan 28, 2025", status: "valid", template: "gold" },
  { id: "CERT-2025-002", student: "Arjun Mehta", college: "Tech Institute of Advanced Studies", type: "Project Excellence", event: "DevOps Pipeline Automation", issued: "Feb 02, 2025", status: "valid", template: "blue" },
  { id: "CERT-2025-003", student: "Sneha Krishnan", college: "Greenfield College", type: "Runner-Up", event: "UI/UX Designathon", issued: "Jan 15, 2025", status: "valid", template: "silver" },
  { id: "CERT-2025-004", student: "Dev Sharma", college: "Northside University", type: "Participation", event: "Capture The Flag", issued: "Dec 10, 2024", status: "revoked", template: "blue", revokedReason: "Fraudulent submission detected" },
  { id: "CERT-2025-005", student: "Fatima Zahra", college: "Greenfield College", type: "Research Publication", event: "IEEE Research Symposium", issued: "Oct 22, 2024", status: "valid", template: "gold" },
  { id: "CERT-2025-006", student: "Karan Nair", college: "City Polytechnic", type: "Workshop Completion", event: "Cloud Native Bootcamp", issued: "Nov 05, 2024", status: "expired", template: "silver" },
  { id: "CERT-2025-007", student: "Priya Sharma", college: "Northside University", type: "Hackathon Winner", event: "Web3 Hackathon", issued: "Dec 20, 2024", status: "valid", template: "gold" },
  { id: "CERT-2025-008", student: "Rahul Verma", college: "Tech Institute of Advanced Studies", type: "Project Excellence", event: "AI Resume Screener", issued: "Jan 05, 2025", status: "valid", template: "blue" },
  { id: "CERT-2025-009", student: "Sara Khan", college: "City Polytechnic", type: "Participation", event: "Smart India Hackathon", issued: "Sep 18, 2024", status: "revoked", template: "blue", revokedReason: "College suspended — certificates invalidated" },
  { id: "CERT-2025-010", student: "Carlos Ruiz", college: "Greenfield College", type: "Workshop Completion", event: "Advanced React Patterns", issued: "Nov 22, 2024", status: "valid", template: "silver" },
  { id: "CERT-2025-011", student: "Li Wei", college: "Northside University", type: "Research Publication", event: "NLP Challenge 2024", issued: "Nov 10, 2024", status: "valid", template: "gold" },
  { id: "CERT-2025-012", student: "Emma Watson", college: "City Polytechnic", type: "Runner-Up", event: "Open Source Sprint", issued: "Aug 30, 2024", status: "expired", template: "silver" },
];

const TEMPLATES = [
  {
    id: "gold",
    name: "Gold — Excellence",
    desc: "For hackathon winners and top performers",
    bg: "linear-gradient(135deg, #fef9c3 0%, #fef3c7 40%, #fffbeb 100%)",
    accent: "#b45309",
    border: "#fcd34d",
    badge: "#f59e0b",
    ribbon: "#d97706",
    usage: 4,
  },
  {
    id: "blue",
    name: "Blue — Achievement",
    desc: "For project excellence and certifications",
    bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 40%, #eff6ff 100%)",
    accent: "#1d4ed8",
    border: "#93c5fd",
    badge: "#3b82f6",
    ribbon: "#2563eb",
    usage: 5,
  },
  {
    id: "silver",
    name: "Silver — Participation",
    desc: "For workshops, runner-ups, and participation",
    bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 40%, #f8fafc 100%)",
    accent: "#475569",
    border: "#cbd5e1",
    badge: "#64748b",
    ribbon: "#94a3b8",
    usage: 3,
  },
];

const SIG_ALGOS = ["RSA-4096 + SHA-256", "ECDSA P-384", "Ed25519"];

/* ─── Stat Card ─────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, iconColor, iconBg, alert }) {
  return (
    <div style={{ background: "var(--background)", border: `1px solid ${alert ? "#fecaca" : "var(--border)"}`, borderRadius: "14px", padding: "20px", display: "flex", gap: "16px", alignItems: "center" }}>
      <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <iconify-icon icon={icon} style={{ fontSize: "22px", color: iconColor }} />
      </div>
      <div>
        <div style={{ fontSize: "24px", fontWeight: 800, color: alert ? "#dc2626" : "var(--foreground)", lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginTop: "2px" }}>{label}</div>
        {sub && <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─── Certificate Preview Card ───────────────────────────────────────── */
function CertPreview({ tpl, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: `2px solid ${selected ? tpl.badge : "var(--border)"}`,
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.18s, box-shadow 0.18s",
        boxShadow: selected ? `0 0 0 3px ${tpl.badge}30` : "none",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px -8px ${tpl.badge}40`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = selected ? `0 0 0 3px ${tpl.badge}30` : "none"; }}
    >
      {/* Mini certificate canvas */}
      <div style={{ background: tpl.bg, padding: "20px 20px 14px", position: "relative", minHeight: "120px" }}>
        {/* Top ribbon */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(90deg, ${tpl.ribbon}, ${tpl.badge})` }} />
        {/* Corner seal */}
        <div style={{ position: "absolute", top: "12px", right: "14px", width: "30px", height: "30px", borderRadius: "50%", background: `conic-gradient(${tpl.badge}, ${tpl.ribbon}, ${tpl.badge})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: tpl.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <iconify-icon icon="lucide:shield-check" style={{ fontSize: "11px", color: tpl.accent }} />
          </div>
        </div>
        <div style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "1.5px", color: tpl.accent, textTransform: "uppercase", marginBottom: "6px" }}>CampusMitra</div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: tpl.accent, marginBottom: "4px" }}>Certificate of Achievement</div>
        <div style={{ width: "40px", height: "2px", background: tpl.badge, borderRadius: "999px", marginBottom: "8px" }} />
        <div style={{ fontSize: "9px", color: tpl.accent, opacity: 0.7, lineHeight: 1.5 }}>
          Presented to <span style={{ fontWeight: 600 }}>Student Name</span><br />
          for outstanding performance in
        </div>
        {/* QR placeholder */}
        <div style={{ position: "absolute", bottom: "10px", right: "14px", width: "28px", height: "28px", border: `1.5px solid ${tpl.border}`, borderRadius: "4px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5px", padding: "3px", background: "white" }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{ background: [0,2,6,8].includes(i) ? tpl.accent : i === 4 ? tpl.badge : "transparent", borderRadius: "1px" }} />
          ))}
        </div>
        {/* Bottom bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${tpl.ribbon}, ${tpl.badge})` }} />
      </div>
      {/* Template info */}
      <div style={{ padding: "12px 14px", background: "var(--background)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>{tpl.name}</div>
            <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>{tpl.desc}</div>
          </div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: tpl.badge, background: `${tpl.badge}18`, padding: "2px 8px", borderRadius: "999px" }}>{tpl.usage} issued</div>
        </div>
        {selected && (
          <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "4px", color: tpl.badge, fontSize: "12px", fontWeight: 600 }}>
            <iconify-icon icon="lucide:check-circle" style={{ fontSize: "14px" }} /> Active template
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── QR Verification Modal ─────────────────────────────────────────── */
function QRModal({ cert, onClose }) {
  const tpl = TEMPLATES.find((t) => t.id === cert.template);
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      onClick={onClose}
    >
      <div
        style={{ background: "var(--background)", borderRadius: "20px", padding: "32px", maxWidth: "480px", width: "100%", boxShadow: "0 32px 64px -12px rgba(0,0,0,0.35)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <iconify-icon icon="lucide:scan-line" style={{ fontSize: "18px", color: "#16a34a" }} />
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>QR Verification Preview</div>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Live verification endpoint</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", fontSize: "20px", display: "flex" }}>
            <iconify-icon icon="lucide:x" />
          </button>
        </div>

        {/* Certificate mini display */}
        <div style={{ background: tpl.bg, border: `1.5px solid ${tpl.border}`, borderRadius: "12px", padding: "18px", marginBottom: "20px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${tpl.ribbon}, ${tpl.badge})`, borderRadius: "12px 12px 0 0" }} />
          <div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "1.5px", color: tpl.accent, textTransform: "uppercase", marginBottom: "4px" }}>CampusMitra — Official Certificate</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: tpl.accent, marginBottom: "2px" }}>{cert.type}</div>
          <div style={{ fontSize: "13px", color: tpl.accent, opacity: 0.8, marginBottom: "10px" }}>Awarded to <strong>{cert.student}</strong></div>
          <div style={{ fontSize: "11px", color: tpl.accent, opacity: 0.6 }}>Event: {cert.event} · Issued: {cert.issued}</div>
        </div>

        {/* QR Code visual */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          {/* Stylized QR */}
          <div style={{ width: "100px", height: "100px", padding: "8px", background: "white", border: "2px solid var(--border)", borderRadius: "10px", flexShrink: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", width: "100%", height: "100%" }}>
              {Array.from({ length: 49 }, (_, i) => {
                const corners = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48];
                const inner = [8,9,10,15,16,17,22,23,24];
                const dark = [...corners, ...inner, 11, 19, 25, 33, 37];
                return <div key={i} style={{ background: dark.includes(i) ? "#0f172a" : "white", borderRadius: "1px" }} />;
              })}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "6px" }}>Verification URL</div>
            <div style={{ fontSize: "11px", fontFamily: "monospace", background: "var(--muted)", padding: "8px 10px", borderRadius: "8px", color: "var(--foreground)", wordBreak: "break-all", border: "1px solid var(--border)" }}>
              https://verify.campusmitra.io/{cert.id}
            </div>
            <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
              <div style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "999px", background: cert.status === "valid" ? "#f0fdf4" : "#fef2f2", color: cert.status === "valid" ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                {cert.status === "valid" ? "✓ Digitally Verified" : "✗ Revoked / Invalid"}
              </div>
            </div>
          </div>
        </div>

        {/* Cert metadata */}
        <div style={{ background: "var(--muted)", borderRadius: "10px", padding: "14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px" }}>
          {[
            { label: "Certificate ID", value: cert.id },
            { label: "Issued By", value: "CampusMitra CA" },
            { label: "Student", value: cert.student },
            { label: "College", value: cert.college.split(" ").slice(0, 3).join(" ") },
            { label: "Issue Date", value: cert.issued },
            { label: "Signature", value: "RSA-4096 · SHA-256" },
          ].map((m) => (
            <div key={m.label}>
              <div style={{ color: "var(--muted-foreground)", fontWeight: 500, marginBottom: "2px" }}>{m.label}</div>
              <div style={{ color: "var(--foreground)", fontWeight: 600 }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <button style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "var(--primary)", border: "none", cursor: "pointer", color: "white", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <iconify-icon icon="lucide:download" style={{ fontSize: "15px" }} /> Download PDF
          </button>
          <button style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "var(--muted)", border: "1px solid var(--border)", cursor: "pointer", color: "var(--foreground)", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <iconify-icon icon="lucide:share-2" style={{ fontSize: "15px" }} /> Share Link
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function CertificateAuthority() {
  const [tab, setTab] = useState("registry");
  const [selectedTemplate, setSelectedTemplate] = useState("gold");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("student");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewCert, setPreviewCert] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [sigAlgo, setSigAlgo] = useState(SIG_ALGOS[0]);
  const [autoExpiry, setAutoExpiry] = useState(true);
  const [expiryMonths, setExpiryMonths] = useState(24);
  const [showSigSaved, setShowSigSaved] = useState(false);

  const stats = {
    total: CERTIFICATES.length,
    valid: CERTIFICATES.filter((c) => c.status === "valid").length,
    revoked: CERTIFICATES.filter((c) => c.status === "revoked").length,
    expired: CERTIFICATES.filter((c) => c.status === "expired").length,
  };

  const filtered = useMemo(() => {
    return CERTIFICATES.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        q === "" ||
        (searchField === "student" && c.student.toLowerCase().includes(q)) ||
        (searchField === "id" && c.id.toLowerCase().includes(q)) ||
        (searchField === "college" && c.college.toLowerCase().includes(q));
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, searchField, statusFilter]);

  const statusStyle = {
    valid: { bg: "#f0fdf4", color: "#16a34a", icon: "lucide:shield-check", label: "Valid" },
    revoked: { bg: "#fef2f2", color: "#dc2626", icon: "lucide:shield-x", label: "Revoked" },
    expired: { bg: "#fefce8", color: "#ca8a04", icon: "lucide:clock", label: "Expired" },
  };

  const handleSaveSig = () => {
    setShowSigSaved(true);
    setTimeout(() => setShowSigSaved(false), 2500);
  };

  const TABS = [
    { id: "registry", label: "Certificate Registry", icon: "lucide:list" },
    { id: "templates", label: "Templates", icon: "lucide:layout-template" },
    { id: "signature", label: "Digital Signature", icon: "lucide:key-round" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 3px", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "10px" }}>
              Certificate Authority
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", padding: "2px 10px", borderRadius: "999px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                CA LIVE
              </span>
            </h1>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: 0 }}>
              Manage certificate issuance, verification, templates and digital signatures
            </p>
          </div>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "10px", background: "var(--primary)", border: "none", cursor: "pointer", color: "white", fontSize: "13px", fontWeight: 600 }}>
          <iconify-icon icon="lucide:plus" style={{ fontSize: "16px" }} /> Issue Certificate
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        <StatCard icon="lucide:badge-check" label="Total Issued" value={stats.total} sub="All time" iconColor="#6366f1" iconBg="#eff6ff" />
        <StatCard icon="lucide:shield-check" label="Valid" value={stats.valid} sub="Currently active" iconColor="#16a34a" iconBg="#f0fdf4" />
        <StatCard icon="lucide:shield-x" label="Revoked" value={stats.revoked} sub="Permanently invalid" iconColor="#dc2626" iconBg="#fef2f2" alert />
        <StatCard icon="lucide:clock" label="Expired" value={stats.expired} sub="Past validity period" iconColor="#d97706" iconBg="#fffbeb" />
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "var(--muted)", borderRadius: "12px", padding: "4px", width: "fit-content" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "8px 18px", borderRadius: "9px", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: 600,
              background: tab === t.id ? "var(--background)" : "transparent",
              color: tab === t.id ? "var(--foreground)" : "var(--muted-foreground)",
              boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}
          >
            <iconify-icon icon={t.icon} style={{ fontSize: "15px" }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════ TAB: REGISTRY ════════════ */}
      {tab === "registry" && (
        <div>
          {/* Search & Filter bar */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "18px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Search field selector */}
            <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", background: "var(--background)" }}>
              {[
                { key: "student", label: "Student" },
                { key: "id", label: "Cert ID" },
                { key: "college", label: "College" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSearchField(f.key)}
                  style={{
                    padding: "8px 14px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600,
                    background: searchField === f.key ? "var(--primary)" : "transparent",
                    color: searchField === f.key ? "white" : "var(--muted-foreground)",
                    transition: "all 0.15s",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div style={{ position: "relative", flex: 1, maxWidth: "360px" }}>
              <iconify-icon icon="lucide:search" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", color: "var(--muted-foreground)" }} />
              <input
                type="text"
                placeholder={`Search by ${searchField === "id" ? "certificate ID" : searchField}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", paddingLeft: "36px", paddingRight: "12px", paddingTop: "9px", paddingBottom: "9px", fontSize: "13px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--background)", color: "var(--foreground)", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Status filter */}
            <div style={{ display: "flex", gap: "6px", background: "var(--muted)", borderRadius: "10px", padding: "4px" }}>
              {["all", "valid", "revoked", "expired"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: "6px 13px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600,
                    background: statusFilter === s ? "var(--background)" : "transparent",
                    color: statusFilter === s ? "var(--foreground)" : "var(--muted-foreground)",
                    textTransform: "capitalize",
                    boxShadow: statusFilter === s ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  {s === "all" ? `All (${stats.total})` : s === "valid" ? `Valid (${stats.valid})` : s === "revoked" ? `Revoked (${stats.revoked})` : `Expired (${stats.expired})`}
                </button>
              ))}
            </div>

            <div style={{ marginLeft: "auto", fontSize: "12px", color: "var(--muted-foreground)", fontWeight: 500 }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.8fr 1.2fr 1fr 1fr 0.8fr auto", gap: "0", padding: "12px 20px", background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
              {["Certificate ID", "Student", "College", "Type", "Issued", "Status", "Actions"].map((h) => (
                <div key={h} style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</div>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: "48px", textAlign: "center", color: "var(--muted-foreground)", fontSize: "14px" }}>No certificates match your search</div>
            ) : (
              filtered.map((cert, i) => {
                const ss = statusStyle[cert.status];
                const tpl = TEMPLATES.find((t) => t.id === cert.template);
                return (
                  <div
                    key={cert.id}
                    style={{
                      display: "grid", gridTemplateColumns: "1.4fr 1.8fr 1.2fr 1fr 1fr 0.8fr auto",
                      gap: "0", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                      alignItems: "center",
                      background: cert.status === "revoked" ? "#fef2f210" : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = cert.status === "revoked" ? "#fef2f210" : "transparent")}
                  >
                    {/* Cert ID */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: tpl.badge, flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", fontFamily: "monospace", fontWeight: 600, color: "var(--primary)" }}>{cert.id}</span>
                    </div>
                    {/* Student */}
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--foreground)" }}>{cert.student}</div>
                    {/* College */}
                    <div style={{ fontSize: "12px", color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={cert.college}>
                      {cert.college.split(" ").slice(0, 3).join(" ")}
                    </div>
                    {/* Type */}
                    <div style={{ fontSize: "12px", color: "var(--foreground)", fontWeight: 500 }}>{cert.type}</div>
                    {/* Issued */}
                    <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{cert.issued}</div>
                    {/* Status */}
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", background: ss.bg, color: ss.color, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <iconify-icon icon={ss.icon} style={{ fontSize: "12px" }} />
                        {ss.label}
                      </span>
                    </div>
                    {/* Actions */}
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => setPreviewCert(cert)}
                        title="View QR Verification"
                        style={{ width: "30px", height: "30px", border: "1px solid var(--border)", borderRadius: "7px", background: "var(--muted)", cursor: "pointer", color: "var(--muted-foreground)", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#818cf8"; e.currentTarget.style.color = "#4338ca"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
                      >
                        <iconify-icon icon="lucide:scan-line" style={{ fontSize: "14px" }} />
                      </button>
                      {cert.status !== "revoked" && (
                        <button
                          onClick={() => setRevokeTarget(cert)}
                          title="Revoke Certificate"
                          style={{ width: "30px", height: "30px", border: "1px solid var(--border)", borderRadius: "7px", background: "var(--muted)", cursor: "pointer", color: "var(--muted-foreground)", display: "flex", alignItems: "center", justifyContent: "center" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fef2f2"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted-foreground)"; e.currentTarget.style.background = "var(--muted)"; }}
                        >
                          <iconify-icon icon="lucide:shield-x" style={{ fontSize: "14px" }} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Revoked list callout */}
          {stats.revoked > 0 && (
            <div style={{ marginTop: "20px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <iconify-icon icon="lucide:alert-triangle" style={{ fontSize: "16px", color: "#dc2626" }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#dc2626" }}>Revoked Certificates ({stats.revoked})</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {CERTIFICATES.filter((c) => c.status === "revoked").map((c) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", padding: "8px 12px", background: "white", borderRadius: "8px", border: "1px solid #fecaca" }}>
                    <iconify-icon icon="lucide:shield-x" style={{ color: "#dc2626", fontSize: "14px", flexShrink: 0 }} />
                    <span style={{ fontFamily: "monospace", fontWeight: 600, color: "#dc2626" }}>{c.id}</span>
                    <span style={{ color: "#374151", fontWeight: 500 }}>{c.student}</span>
                    <span style={{ color: "#6b7280" }}>·</span>
                    <span style={{ color: "#6b7280" }}>{c.college.split(" ").slice(0, 3).join(" ")}</span>
                    {c.revokedReason && (
                      <>
                        <span style={{ color: "#6b7280" }}>·</span>
                        <span style={{ color: "#dc2626", fontStyle: "italic" }}>{c.revokedReason}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════ TAB: TEMPLATES ════════════ */}
      {tab === "templates" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "2px" }}>Certificate Templates</div>
              <div style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Select the active template. New certificates will use the active template.</div>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", background: "var(--muted)", border: "1px solid var(--border)", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>
              <iconify-icon icon="lucide:plus" style={{ fontSize: "15px" }} /> New Template
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
            {TEMPLATES.map((tpl) => (
              <CertPreview
                key={tpl.id}
                tpl={tpl}
                selected={selectedTemplate === tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
              />
            ))}
          </div>

          {/* Full certificate preview */}
          <div style={{ marginTop: "28px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <iconify-icon icon="lucide:eye" style={{ color: "var(--primary)" }} /> Full Certificate Preview
            </div>
            {(() => {
              const tpl = TEMPLATES.find((t) => t.id === selectedTemplate);
              return (
                <div style={{ background: tpl.bg, border: `2px solid ${tpl.border}`, borderRadius: "16px", padding: "40px 48px", position: "relative", maxWidth: "720px" }}>
                  {/* Top ribbon */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: `linear-gradient(90deg, ${tpl.ribbon}, ${tpl.badge})`, borderRadius: "16px 16px 0 0" }} />
                  {/* Corner seals */}
                  {["top-l", "top-r", "bot-l", "bot-r"].map((pos) => (
                    <div key={pos} style={{
                      position: "absolute",
                      top: pos.includes("top") ? "18px" : undefined, bottom: pos.includes("bot") ? "18px" : undefined,
                      left: pos.includes("l") ? "18px" : undefined, right: pos.includes("r") ? "18px" : undefined,
                      width: "40px", height: "40px", borderRadius: "50%",
                      background: `conic-gradient(${tpl.badge}, ${tpl.ribbon}, ${tpl.badge})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: tpl.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <iconify-icon icon="lucide:shield-check" style={{ fontSize: "14px", color: tpl.accent }} />
                      </div>
                    </div>
                  ))}

                  <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "3px", color: tpl.accent, textTransform: "uppercase", opacity: 0.7, marginBottom: "8px" }}>CampusMitra · Official Certificate</div>
                    <div style={{ width: "60px", height: "2px", background: `linear-gradient(90deg, transparent, ${tpl.badge}, transparent)`, margin: "0 auto 16px" }} />
                    <div style={{ fontSize: "28px", fontWeight: 800, color: tpl.accent, letterSpacing: "-0.5px", marginBottom: "4px" }}>Certificate of Achievement</div>
                    <div style={{ fontSize: "13px", color: tpl.accent, opacity: 0.6 }}>This is to certify that</div>
                  </div>

                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: tpl.ribbon, fontStyle: "italic", marginBottom: "4px" }}>Student Full Name</div>
                    <div style={{ width: "180px", height: "1.5px", background: `linear-gradient(90deg, transparent, ${tpl.badge}, transparent)`, margin: "8px auto 12px" }} />
                    <div style={{ fontSize: "13px", color: tpl.accent, opacity: 0.75 }}>
                      has successfully demonstrated excellence in<br />
                      <strong>Event / Achievement Name</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "32px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: "120px", height: "1px", background: tpl.badge, marginBottom: "6px" }} />
                      <div style={{ fontSize: "11px", color: tpl.accent, opacity: 0.7 }}>College Authority</div>
                    </div>
                    {/* QR */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "54px", height: "54px", padding: "5px", background: "white", border: `1.5px solid ${tpl.border}`, borderRadius: "6px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1.5px", width: "100%", height: "100%" }}>
                          {Array.from({ length: 49 }, (_, i) => {
                            const dark = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48,8,9,10,15,16,17,22,23,24,11,19,25,33,37];
                            return <div key={i} style={{ background: dark.includes(i) ? tpl.accent : "white", borderRadius: "0.5px" }} />;
                          })}
                        </div>
                      </div>
                      <div style={{ fontSize: "8px", color: tpl.accent, opacity: 0.6, fontFamily: "monospace" }}>CERT-2025-XXX</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: "120px", height: "1px", background: tpl.badge, marginBottom: "6px" }} />
                      <div style={{ fontSize: "11px", color: tpl.accent, opacity: 0.7 }}>CampusMitra Super Admin</div>
                    </div>
                  </div>

                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "6px", background: `linear-gradient(90deg, ${tpl.ribbon}, ${tpl.badge})`, borderRadius: "0 0 16px 16px" }} />
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ════════════ TAB: DIGITAL SIGNATURE ════════════ */}
      {tab === "signature" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Signature Settings */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "14px", padding: "22px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                <iconify-icon icon="lucide:key-round" style={{ color: "#6366f1" }} />
                Signing Algorithm
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "16px" }}>
                Algorithm used to cryptographically sign each certificate
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {SIG_ALGOS.map((algo) => (
                  <button
                    key={algo}
                    onClick={() => setSigAlgo(algo)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 16px", borderRadius: "10px",
                      border: `1.5px solid ${sigAlgo === algo ? "#818cf8" : "var(--border)"}`,
                      background: sigAlgo === algo ? "#eff6ff" : "var(--muted)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <iconify-icon icon="lucide:lock-keyhole" style={{ fontSize: "16px", color: sigAlgo === algo ? "#4338ca" : "var(--muted-foreground)" }} />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: sigAlgo === algo ? "#4338ca" : "var(--foreground)", fontFamily: "monospace" }}>{algo}</span>
                    </div>
                    {sigAlgo === algo && <iconify-icon icon="lucide:check-circle" style={{ fontSize: "16px", color: "#4338ca" }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Expiry Settings */}
            <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "14px", padding: "22px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                <iconify-icon icon="lucide:calendar-clock" style={{ color: "#f59e0b" }} />
                Certificate Expiry
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "16px" }}>
                Configure automatic expiry for issued certificates
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--foreground)" }}>Enable auto-expiry</span>
                <button
                  onClick={() => setAutoExpiry((v) => !v)}
                  style={{
                    width: "46px", height: "26px", borderRadius: "999px", border: "none", cursor: "pointer",
                    background: autoExpiry ? "var(--primary)" : "var(--border)",
                    position: "relative", transition: "background 0.2s",
                  }}
                >
                  <div style={{
                    position: "absolute", top: "3px", left: autoExpiry ? "22px" : "3px",
                    width: "20px", height: "20px", borderRadius: "50%", background: "white",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s",
                  }} />
                </button>
              </div>
              {autoExpiry && (
                <div>
                  <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "8px" }}>Validity period (months)</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="range" min="3" max="60" value={expiryMonths}
                      onChange={(e) => setExpiryMonths(Number(e.target.value))}
                      style={{ flex: 1, accentColor: "var(--primary)" }}
                    />
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--primary)", minWidth: "56px", textAlign: "right" }}>{expiryMonths} mo</span>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveSig}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "13px", borderRadius: "12px", border: "none", cursor: "pointer",
                background: showSigSaved ? "#16a34a" : "var(--primary)",
                color: "white", fontSize: "14px", fontWeight: 700, transition: "background 0.3s",
              }}
            >
              <iconify-icon icon={showSigSaved ? "lucide:check" : "lucide:save"} style={{ fontSize: "16px" }} />
              {showSigSaved ? "Settings Saved!" : "Save Signature Settings"}
            </button>
          </div>

          {/* CA Info Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* CA Identity */}
            <div style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)", border: "1px solid #4338ca", borderRadius: "14px", padding: "24px", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <iconify-icon icon="lucide:shield-check" style={{ fontSize: "22px", color: "#a5b4fc" }} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700 }}>CampusMitra Root CA</div>
                  <div style={{ fontSize: "11px", opacity: 0.6 }}>Certificate Authority Identity</div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 700, padding: "2px 10px", background: "#16a34a", borderRadius: "999px" }}>TRUSTED</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" }}>
                {[
                  { label: "CA Name", value: "CampusMitra Root CA v2" },
                  { label: "Key Type", value: sigAlgo.split(" ")[0] },
                  { label: "Serial No.", value: "0x1A4F.B29C.D381" },
                  { label: "Valid Until", value: "Dec 31, 2030" },
                  { label: "Issuer", value: "Self-signed Root" },
                  { label: "CRL URL", value: "crl.campusmitra.io" },
                ].map((m) => (
                  <div key={m.label}>
                    <div style={{ opacity: 0.5, marginBottom: "2px", fontWeight: 500 }}>{m.label}</div>
                    <div style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "11px" }}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "18px", padding: "10px 14px", background: "rgba(255,255,255,0.08)", borderRadius: "8px", fontFamily: "monospace", fontSize: "10px", opacity: 0.7, wordBreak: "break-all", lineHeight: 1.6 }}>
                SHA-256 Fingerprint:<br />
                4A:2C:F9:1B:D3:88:7E:0C:A4:51:22:F8:BD:9C:3A:1D<br />
                :E7:44:CF:2B:85:19:6F:A0:3C:D8:72:5E:4B:97:11
              </div>
            </div>

            {/* Verification Stats */}
            <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <iconify-icon icon="lucide:activity" style={{ color: "var(--primary)" }} />
                Verification Activity (30d)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "QR Scans", value: 1842, icon: "lucide:scan-line", color: "#6366f1" },
                  { label: "API Verifications", value: 634, icon: "lucide:code-2", color: "#10b981" },
                  { label: "Manual Lookups", value: 119, icon: "lucide:search", color: "#f59e0b" },
                  { label: "Failed / Invalid", value: 23, icon: "lucide:x-circle", color: "#dc2626" },
                ].map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <iconify-icon icon={s.icon} style={{ fontSize: "16px", color: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "var(--foreground)", flex: 1 }}>{s.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: s.color }}>{s.value.toLocaleString()}</span>
                    {/* Mini bar */}
                    <div style={{ width: "60px", height: "6px", background: "var(--muted)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(s.value / 1842) * 100}%`, background: s.color, borderRadius: "999px" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── QR Preview Modal ── */}
      {previewCert && <QRModal cert={previewCert} onClose={() => setPreviewCert(null)} />}

      {/* ── Revoke Confirm Modal ── */}
      {revokeTarget && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          onClick={() => setRevokeTarget(null)}
        >
          <div
            style={{ background: "var(--background)", borderRadius: "16px", padding: "28px", maxWidth: "420px", width: "100%", boxShadow: "0 24px 56px -12px rgba(0,0,0,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <iconify-icon icon="lucide:shield-x" style={{ fontSize: "22px", color: "#dc2626" }} />
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "2px" }}>Revoke Certificate</div>
                <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>This action is permanent and cannot be undone.</div>
              </div>
            </div>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 14px", marginBottom: "16px", fontSize: "13px", color: "#7f1d1d" }}>
              You are about to revoke <strong>{revokeTarget.id}</strong> issued to <strong>{revokeTarget.student}</strong>. The QR verification link will immediately return invalid.
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setRevokeTarget(null)}
                style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--muted)", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => setRevokeTarget(null)}
                style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "#dc2626", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "white" }}
              >
                Revoke Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
