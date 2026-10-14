import { useState } from "react";
import { Search, Plus, X, ExternalLink, ShieldOff, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const S = {
  page: { minHeight: "100vh", background: "var(--background)", padding: "32px" },
  wrap: { maxWidth: 1200, margin: "0 auto" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--foreground)", margin: 0 },
  sub: { fontSize: 13, color: "var(--muted-foreground)", marginTop: 4 },
  addBtn: { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 },
  kpiCard: { background: "var(--card, var(--background))", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px" },
  kpiLabel: { fontSize: 11, color: "var(--muted-foreground)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 },
  kpiVal: { fontSize: 26, fontWeight: 700, color: "var(--foreground)", lineHeight: 1, marginBottom: 4 },
  kpiSub: { fontSize: 11, color: "var(--muted-foreground)" },
  filterBar: { background: "var(--card, var(--background))", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", marginBottom: 18 },
  filterGrid: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 10, alignItems: "center" },
  searchWrap: { position: "relative" },
  searchIcon: { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)", pointerEvents: "none" },
  searchInput: { width: "100%", padding: "9px 10px 9px 32px", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 7, fontSize: 13, color: "var(--foreground)", outline: "none", boxSizing: "border-box" },
  select: { width: "100%", padding: "9px 10px", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 7, fontSize: 13, color: "var(--foreground)", outline: "none", cursor: "pointer" },
  clearBtn: { padding: "9px 14px", background: "transparent", border: "1px solid var(--border)", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", cursor: "pointer" },
  tableCard: { background: "var(--card, var(--background))", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" },
  thead: { background: "var(--muted)", borderBottom: "1px solid var(--border)" },
  th: { padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid var(--border)", cursor: "default" },
  td: { padding: "13px 16px", fontSize: 13, color: "var(--foreground)", verticalAlign: "middle" },
  tdSub: { fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 },
  badge: (bg, fg) => ({ display: "inline-block", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: bg, color: fg }),
  progressWrap: { height: 5, background: "var(--border)", borderRadius: 3, marginTop: 5, width: 80 },
  progressBar: (pct, color) => ({ height: "100%", width: `${pct}%`, background: color, borderRadius: 3 }),
  actionBtn: { background: "transparent", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 11px", fontSize: 12, fontWeight: 600, color: "var(--foreground)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 },
  pagination: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid var(--border)" },
  pgInfo: { fontSize: 12, color: "var(--muted-foreground)" },
  pgBtns: { display: "flex", gap: 6 },
  pgBtn: (active) => ({ padding: "5px 11px", borderRadius: 6, border: "1px solid var(--border)", background: active ? "var(--primary)" : "transparent", color: active ? "#fff" : "var(--foreground)", fontSize: 12, fontWeight: 600, cursor: "pointer" }),
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 },
  modal: { background: "var(--card, var(--background))", border: "1px solid var(--border)", borderRadius: 12, width: "100%", maxWidth: 640, maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  modalInner: { overflowY: "auto", flex: 1, padding: "0 30px 28px" },
  modalHeader: { padding: "24px 30px 0", marginBottom: 0, flexShrink: 0 },
  sectionHead: { fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "20px 0 12px", paddingBottom: 6, borderBottom: "1px solid var(--border)" },
  modalTitle: { fontSize: 16, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 },
  modalSub: { fontSize: 13, color: "var(--muted-foreground)", marginBottom: 22 },
  fieldLabel: { display: "block", fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.03em" },
  fieldInput: { width: "100%", padding: "9px 12px", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 7, fontSize: 13, color: "var(--foreground)", outline: "none", boxSizing: "border-box" },
  fieldSelect: { width: "100%", padding: "9px 12px", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 7, fontSize: 13, color: "var(--foreground)", outline: "none", cursor: "pointer", boxSizing: "border-box" },
  fieldGroup: { marginBottom: 16 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  btnRow: { display: "flex", gap: 10, marginTop: 24 },
  cancelBtn: { flex: 1, padding: "10px 0", background: "transparent", border: "1px solid var(--border)", borderRadius: 7, fontSize: 13, fontWeight: 600, color: "var(--foreground)", cursor: "pointer" },
  confirmBtn: { flex: 1, padding: "10px 0", background: "var(--primary)", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" },
  emptyState: { padding: "52px 0", textAlign: "center", fontSize: 13, color: "var(--muted-foreground)" },
};

const PLAN_BADGE = {
  Free:       { bg: "var(--muted)", fg: "var(--muted-foreground)" },
  Standard:   { bg: "#dbeafe", fg: "#1e40af" },
  Enterprise: { bg: "#f3e8ff", fg: "#6b21a8" },
};
const STATUS_BADGE = {
  Active:    { bg: "#dcfce7", fg: "#166534" },
  Suspended: { bg: "#fee2e2", fg: "#991b1b" },
  Pending:   { bg: "#fef9c3", fg: "#854d0e" },
};
const PARTICIPATION_COLOR = (pct) =>
  pct >= 60 ? "#16a34a" : pct >= 40 ? "#b45309" : "#dc2626";

const BLANK_FORM = {
  // Identification
  name: "", aisheId: "", trackId: "", estYear: "",
  // Type & Affiliation
  instituteType: "Engineering", affiliation: "", autonomous: "No",
  // Location
  address: "", city: "", location: "", pinCode: "",
  // Contact
  phone: "", email: "", website: "",
  // Platform
  adminName: "", adminEmail: "", adminPhone: "", plan: "Standard", students: "",
};

const PAGE_SIZE = 8;

export default function Colleges() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [colleges, setColleges] = useState([
    { id: "c1", name: "IIT Bombay Satellite",  location: "Maharashtra", students: 8400, innovators: 1840, participation: 74, plan: "Enterprise", status: "Active",    joined: "2024-06-10" },
    { id: "c2", name: "New Tech Institute",     location: "Karnataka",   students: 4200, innovators:  842, participation: 68, plan: "Enterprise", status: "Active",    joined: "2024-08-01" },
    { id: "c3", name: "Greenfield College",     location: "Maharashtra", students: 3100, innovators:  402, participation: 54, plan: "Standard",   status: "Active",    joined: "2024-09-15" },
    { id: "c4", name: "Northside University",   location: "Delhi",       students:12500, innovators: 2140, participation: 72, plan: "Enterprise", status: "Suspended", joined: "2024-03-22" },
    { id: "c5", name: "City Polytechnic",       location: "Tamil Nadu",  students: 1800, innovators:  160, participation: 22, plan: "Free",       status: "Active",    joined: "2025-01-05" },
    { id: "c6", name: "VIT Extension Campus",   location: "Andhra Pradesh", students: 6200, innovators: 980, participation: 61, plan: "Enterprise", status: "Active", joined: "2024-07-12" },
    { id: "c7", name: "Sunrise Engineering",    location: "Rajasthan",   students: 2400, innovators:  210, participation: 38, plan: "Standard",   status: "Active",    joined: "2024-11-19" },
    { id: "c8", name: "North East University",  location: "Assam",       students: 3800, innovators:  480, participation: 49, plan: "Standard",   status: "Pending",   joined: "2025-02-01" },
    { id: "c9", name: "Coastal Tech Campus",    location: "Kerala",      students: 2900, innovators:  370, participation: 55, plan: "Standard",   status: "Active",    joined: "2024-10-30" },
    { id: "c10",name: "Deccan Institute",       location: "Telangana",   students: 5100, innovators:  760, participation: 62, plan: "Enterprise", status: "Active",    joined: "2024-05-28" },
  ]);

  const filtered = colleges.filter((c) =>
    (query === "" || c.name.toLowerCase().includes(query.toLowerCase()) || c.location.toLowerCase().includes(query.toLowerCase())) &&
    (stateFilter === "All" || c.location === stateFilter) &&
    (planFilter === "All"  || c.plan === planFilter) &&
    (statusFilter === "All"|| c.status === statusFilter)
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const kpis = [
    { label: "Total Colleges",   value: colleges.length },
    { label: "Active",           value: colleges.filter((c) => c.status === "Active").length,    sub: "currently onboarded" },
    { label: "Suspended",        value: colleges.filter((c) => c.status === "Suspended").length, sub: "access restricted" },
    { label: "Enterprise Plans", value: colleges.filter((c) => c.plan === "Enterprise").length,  sub: "premium tier" },
    { label: "Total Students",   value: colleges.reduce((s, c) => s + c.students, 0).toLocaleString(), sub: "across all colleges" },
  ];

  const handleAdd = () => {
    if (!form.name.trim() || !form.location.trim() || !form.aisheId.trim()) return;
    const newId = "c" + (Date.now());
    setColleges((prev) => [...prev, {
      id: newId,
      name: form.name,
      aisheId: form.aisheId,
      trackId: form.trackId,
      estYear: form.estYear,
      instituteType: form.instituteType,
      affiliation: form.affiliation,
      autonomous: form.autonomous,
      address: form.address,
      city: form.city,
      location: form.location,
      pinCode: form.pinCode,
      phone: form.phone,
      email: form.email,
      website: form.website,
      adminName: form.adminName,
      adminEmail: form.adminEmail,
      adminPhone: form.adminPhone,
      plan: form.plan,
      students: Number(form.students) || 0,
      innovators: 0,
      participation: 0,
      status: "Pending",
      joined: new Date().toISOString().slice(0, 10),
    }]);
    setForm(BLANK_FORM);
    setShowAdd(false);
  };

  const toggleSuspend = (id) => {
    setColleges((prev) => prev.map((c) =>
      c.id === id ? { ...c, status: c.status === "Suspended" ? "Active" : "Suspended" } : c
    ));
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Colleges</h1>
            <p style={S.sub}>Manage partner colleges, subscriptions, and performance across the platform</p>
          </div>
          <button style={S.addBtn} onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Add College
          </button>
        </div>

        {/* KPI Strip */}
        <div style={S.kpiGrid}>
          {kpis.map((k) => (
            <div key={k.label} style={S.kpiCard}>
              <div style={S.kpiLabel}>{k.label}</div>
              <div style={S.kpiVal}>{k.value}</div>
              {k.sub && <div style={S.kpiSub}>{k.sub}</div>}
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div style={S.filterBar}>
          <div style={S.filterGrid}>
            <div style={S.searchWrap}>
              <Search size={14} style={S.searchIcon} />
              <input
                style={S.searchInput} placeholder="Search by name or state…"
                value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
            </div>
            <select style={S.select} value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}>
              <option value="All">All States</option>
              {[...new Set(colleges.map((c) => c.location))].sort().map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <select style={S.select} value={planFilter} onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}>
              <option value="All">All Plans</option>
              <option>Free</option><option>Standard</option><option>Enterprise</option>
            </select>
            <select style={S.select} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="All">All Status</option>
              <option>Active</option><option>Suspended</option><option>Pending</option>
            </select>
            <button style={S.clearBtn} onClick={() => { setQuery(""); setStateFilter("All"); setPlanFilter("All"); setStatusFilter("All"); setPage(1); }}>
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={S.tableCard}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={S.thead}>
              <tr>
                {["College", "Location", "Students", "Innovators", "Participation", "Plan", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9} style={S.emptyState}>No colleges match your filters</td></tr>
              ) : paginated.map((c) => (
                <tr key={c.id} style={S.tr}>
                  <td style={S.td}>
                    <div style={{ fontWeight: 600, color: "var(--foreground)" }}>{c.name}</div>
                    {c.aisheId && <div style={S.tdSub}>AISHE: {c.aisheId}</div>}
                    {c.trackId && <div style={S.tdSub}>TRACK: {c.trackId}</div>}
                  </td>
                  <td style={S.td}>{c.location}</td>
                  <td style={S.td}>{c.students.toLocaleString()}</td>
                  <td style={S.td}>{c.innovators.toLocaleString()}</td>
                  <td style={S.td}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: PARTICIPATION_COLOR(c.participation) }}>
                      {c.participation}%
                    </div>
                    <div style={S.progressWrap}>
                      <div style={S.progressBar(c.participation, PARTICIPATION_COLOR(c.participation))} />
                    </div>
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(PLAN_BADGE[c.plan].bg, PLAN_BADGE[c.plan].fg)}>{c.plan}</span>
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(STATUS_BADGE[c.status].bg, STATUS_BADGE[c.status].fg)}>{c.status}</span>
                  </td>
                  <td style={{ ...S.td, fontSize: 12, color: "var(--muted-foreground)" }}>{c.joined}</td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={S.actionBtn} onClick={() => navigate(`/colleges/${c.id}`)}>
                        <ExternalLink size={12} /> View
                      </button>
                      <button
                        style={{ ...S.actionBtn, color: c.status === "Suspended" ? "#16a34a" : "#dc2626", borderColor: c.status === "Suspended" ? "#16a34a" : "#dc2626" }}
                        onClick={() => toggleSuspend(c.id)}
                      >
                        {c.status === "Suspended" ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
                        {c.status === "Suspended" ? "Restore" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={S.pagination}>
              <span style={S.pgInfo}>
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div style={S.pgBtns}>
                <button style={S.pgBtn(false)} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} style={S.pgBtn(n === page)} onClick={() => setPage(n)}>{n}</button>
                ))}
                <button style={S.pgBtn(false)} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add College Modal */}
        {showAdd && (
          <div style={S.overlay} onClick={(e) => { if (e.target === e.currentTarget) { setShowAdd(false); setForm(BLANK_FORM); } }}>
            <div style={S.modal}>

              {/* Sticky Header */}
              <div style={{ ...S.modalHeader, display: "flex", alignItems: "flex-start", justifyContent: "space-between", paddingBottom: 16, borderBottom: "1px solid var(--border)", marginBottom: 0 }}>
                <div>
                  <div style={S.modalTitle}>Add New College</div>
                  <div style={{ ...S.modalSub, marginBottom: 0 }}>Onboard a new partner institution to the platform</div>
                </div>
                <button onClick={() => { setShowAdd(false); setForm(BLANK_FORM); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", marginTop: 2 }}>
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div style={S.modalInner}>

                {/* Section 1 – Identification */}
                <div style={S.sectionHead}>College Identification</div>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>College Name <span style={{ color: "#dc2626" }}>*</span></label>
                  <input style={S.fieldInput} placeholder="e.g. NIT Trichy" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div style={{ ...S.twoCol, marginBottom: 16 }}>
                  <div>
                    <label style={S.fieldLabel}>AISHE ID <span style={{ color: "#dc2626" }}>*</span></label>
                    <input style={S.fieldInput} placeholder="e.g. C-45312" value={form.aisheId} onChange={(e) => setForm((f) => ({ ...f, aisheId: e.target.value }))} />
                  </div>
                  <div>
                    <label style={S.fieldLabel}>TRACK ID</label>
                    <input style={S.fieldInput} placeholder="e.g. TRK-2024-089" value={form.trackId} onChange={(e) => setForm((f) => ({ ...f, trackId: e.target.value }))} />
                  </div>
                </div>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>Year of Establishment</label>
                  <input style={S.fieldInput} type="number" placeholder="e.g. 1997" value={form.estYear} onChange={(e) => setForm((f) => ({ ...f, estYear: e.target.value }))} />
                </div>

                {/* Section 2 – Type & Affiliation */}
                <div style={S.sectionHead}>Type &amp; Affiliation</div>
                <div style={{ ...S.twoCol, marginBottom: 16 }}>
                  <div>
                    <label style={S.fieldLabel}>Institute Type</label>
                    <select style={S.fieldSelect} value={form.instituteType} onChange={(e) => setForm((f) => ({ ...f, instituteType: e.target.value }))}>
                      {["Engineering","Arts & Science","Medical","Law","Management","Polytechnic","Deemed University","Central University","Other"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={S.fieldLabel}>Autonomous</label>
                    <select style={S.fieldSelect} value={form.autonomous} onChange={(e) => setForm((f) => ({ ...f, autonomous: e.target.value }))}>
                      <option>No</option><option>Yes</option>
                    </select>
                  </div>
                </div>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>Affiliated University / Board</label>
                  <input style={S.fieldInput} placeholder="e.g. Anna University" value={form.affiliation} onChange={(e) => setForm((f) => ({ ...f, affiliation: e.target.value }))} />
                </div>

                {/* Section 3 – Location */}
                <div style={S.sectionHead}>Location</div>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>Street Address</label>
                  <input style={S.fieldInput} placeholder="Building, Street, Area" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
                </div>
                <div style={{ ...S.twoCol, marginBottom: 16 }}>
                  <div>
                    <label style={S.fieldLabel}>City</label>
                    <input style={S.fieldInput} placeholder="e.g. Trichy" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
                  </div>
                  <div>
                    <label style={S.fieldLabel}>State <span style={{ color: "#dc2626" }}>*</span></label>
                    <input style={S.fieldInput} placeholder="e.g. Tamil Nadu" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                  </div>
                </div>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>PIN Code</label>
                  <input style={S.fieldInput} placeholder="e.g. 620015" value={form.pinCode} onChange={(e) => setForm((f) => ({ ...f, pinCode: e.target.value }))} />
                </div>

                {/* Section 4 – Contact */}
                <div style={S.sectionHead}>Contact Information</div>
                <div style={{ ...S.twoCol, marginBottom: 16 }}>
                  <div>
                    <label style={S.fieldLabel}>Phone</label>
                    <input style={S.fieldInput} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label style={S.fieldLabel}>Official Email</label>
                    <input style={S.fieldInput} type="email" placeholder="info@college.edu" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>Website</label>
                  <input style={S.fieldInput} placeholder="https://www.college.edu" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} />
                </div>

                {/* Section 5 – Platform Setup */}
                <div style={S.sectionHead}>Platform Setup</div>
                <div style={{ ...S.twoCol, marginBottom: 16 }}>
                  <div>
                    <label style={S.fieldLabel}>Admin Name</label>
                    <input style={S.fieldInput} placeholder="Admin full name" value={form.adminName} onChange={(e) => setForm((f) => ({ ...f, adminName: e.target.value }))} />
                  </div>
                  <div>
                    <label style={S.fieldLabel}>Admin Email</label>
                    <input style={S.fieldInput} type="email" placeholder="admin@college.edu" value={form.adminEmail} onChange={(e) => setForm((f) => ({ ...f, adminEmail: e.target.value }))} />
                  </div>
                </div>
                <div style={{ ...S.twoCol, marginBottom: 16 }}>
                  <div>
                    <label style={S.fieldLabel}>Admin Phone</label>
                    <input style={S.fieldInput} placeholder="+91 XXXXX XXXXX" value={form.adminPhone} onChange={(e) => setForm((f) => ({ ...f, adminPhone: e.target.value }))} />
                  </div>
                  <div>
                    <label style={S.fieldLabel}>Students (approx)</label>
                    <input style={S.fieldInput} type="number" placeholder="e.g. 4500" value={form.students} onChange={(e) => setForm((f) => ({ ...f, students: e.target.value }))} />
                  </div>
                </div>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>Subscription Plan</label>
                  <select style={S.fieldSelect} value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}>
                    <option>Free</option><option>Standard</option><option>Enterprise</option>
                  </select>
                </div>

                <div style={{ ...S.btnRow, paddingBottom: 4 }}>
                  <button style={S.cancelBtn} onClick={() => { setShowAdd(false); setForm(BLANK_FORM); }}>Cancel</button>
                  <button
                    style={{ ...S.confirmBtn, opacity: (!form.name.trim() || !form.location.trim() || !form.aisheId.trim()) ? 0.5 : 1 }}
                    onClick={handleAdd}
                    disabled={!form.name.trim() || !form.location.trim() || !form.aisheId.trim()}
                  >
                    Add College
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
