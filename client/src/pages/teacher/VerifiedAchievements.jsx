import { useState, useMemo } from "react";
import {
  VERIFIED_WINS,
  VERIFIED_STATS,
  ACADEMIC_YEARS,
} from "./teacherData";

/* ─── Badge helpers ─────────────────────────────────────────────────── */
// Position badge: Gold → yellow, Silver → gray, Bronze → orange
const POSITION_META = {
  Gold:   { bg: "#fef9c3", color: "#b45309", border: "#fcd34d" },
  Silver: { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" },
  Bronze: { bg: "#fff7ed", color: "#c2410c", border: "#fdba74" },
};

// Status badge: verified → green, flagged → red
const STATUS_META = {
  verified: { bg: "#f0fdf4", color: "#16a34a", label: "Auto-Verified" },
  flagged:  { bg: "#fef2f2", color: "#dc2626", label: "Flagged"       },
};

/* ─── CSV export helper ─────────────────────────────────────────────── */
function exportToCSV(data) {
  const headers = [
    "Student Name", "Roll No", "Department",
    "Host College", "Event Name", "Position", "Date", "Status",
  ];
  const rows = data.map((r) => [
    r.studentName, r.rollNo, r.department,
    r.hostCollege, r.eventName, r.position, r.date, r.status,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = "verified_achievements_report.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── KPI card ──────────────────────────────────────────────────────── */
function KPICard({ title, value, subtitle, iconBg, iconColor, icon, subtitleColor }) {
  return (
    <div style={{
      background: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      padding: "20px 22px",
      flex: 1,
      minWidth: "160px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: 500 }}>{title}</span>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <iconify-icon icon={icon} style={{ fontSize: "16px", color: iconColor }} />
        </div>
      </div>
      <div style={{ fontSize: "30px", fontWeight: 700, color: "var(--foreground)", lineHeight: 1.1 }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      {subtitle && (
        <div style={{ fontSize: "12px", color: subtitleColor || "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

/* ─── Sort icon ─────────────────────────────────────────────────────── */
function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) {
    return <iconify-icon icon="lucide:chevrons-up-down" style={{ fontSize: "13px", color: "#94a3b8" }} />;
  }
  return (
    <iconify-icon
      icon={sortDir === "asc" ? "lucide:chevron-up" : "lucide:chevron-down"}
      style={{ fontSize: "13px", color: "#6366f1" }}
    />
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function VerifiedAchievements({
  verifiedWins   = VERIFIED_WINS,   // prop override; falls back to teacherData
  statsSummary   = VERIFIED_STATS,  // prop override
  onFlag,                           // optional callback(id)
}) {
  /* ── local state ── */
  const [rows, setRows]               = useState(() => verifiedWins.map((r) => ({ ...r })));
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment]   = useState("All Departments");
  const [academicYear, setAcademicYear] = useState("2023-2024");
  const [sortField, setSortField]     = useState("date");
  const [sortDir, setSortDir]         = useState("desc");
  const [page, setPage]               = useState(1);
  const PAGE_SIZE = 5;

  /* ── department list — derived dynamically ── */
  const departments = useMemo(() => {
    const unique = [...new Set(verifiedWins.map((r) => r.department))].sort();
    return ["All Departments", ...unique];
  }, [verifiedWins]);

  /* ── sorting helper ── */
  function handleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  /* ── flag a row (does NOT mutate props) ── */
  function handleFlag(id) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "flagged" } : r))
    );
    onFlag && onFlag(id);
  }

  /* ── filtered + sorted data (memoised for perf) ── */
  const processed = useMemo(() => {
    // 1. search filter — name OR event name
    const q = searchQuery.trim().toLowerCase();
    let result = rows.filter((r) => {
      if (q) {
        return (
          r.studentName.toLowerCase().includes(q) ||
          r.eventName.toLowerCase().includes(q)
        );
      }
      return true;
    });

    // 2. department filter
    if (department !== "All Departments") {
      result = result.filter((r) => r.department === department);
    }

    // 3. sort
    result = [...result].sort((a, b) => {
      let va, vb;
      if (sortField === "date") {
        va = new Date(a.date); vb = new Date(b.date);
      } else if (sortField === "studentName") {
        va = a.studentName.toLowerCase(); vb = b.studentName.toLowerCase();
      } else if (sortField === "position") {
        const order = { Gold: 1, Silver: 2, Bronze: 3 };
        va = order[a.position] ?? 9; vb = order[b.position] ?? 9;
      } else {
        va = a[sortField]; vb = b[sortField];
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [rows, searchQuery, department, sortField, sortDir]);

  /* ── pagination ── */
  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const paginated  = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── download uses current filtered (not paginated) data ── */
  function handleDownload() {
    exportToCSV(processed);
  }

  /* ── reset page on filter/search change ── */
  function handleSearch(val) {
    setSearchQuery(val);
    setPage(1);
  }
  function handleDept(val) {
    setDepartment(val);
    setPage(1);
  }

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <div style={{ padding: "28px 28px 40px", minHeight: "100vh", background: "var(--background)" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
            Verified Achievements
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: "4px 0 0" }}>
            Auto-verified student performance records
          </p>
        </div>

        {/* top-right controls */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Academic Year */}
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            style={{
              padding: "7px 12px", borderRadius: "8px", fontSize: "13px",
              border: "1px solid var(--border)", background: "var(--background)",
              color: "var(--foreground)", cursor: "pointer", outline: "none",
            }}
          >
            {ACADEMIC_YEARS.map((y) => (
              <option key={y} value={y}>Academic Year: {y}</option>
            ))}
          </select>

          {/* Departments dropdown */}
          <select
            value={department}
            onChange={(e) => handleDept(e.target.value)}
            style={{
              padding: "7px 12px", borderRadius: "8px", fontSize: "13px",
              border: "1px solid var(--border)", background: "var(--background)",
              color: "var(--foreground)", cursor: "pointer", outline: "none",
            }}
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Download button */}
          <button
            onClick={handleDownload}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "7px 16px", borderRadius: "8px", border: "none",
              background: "#6366f1", color: "#fff",
              fontSize: "13px", fontWeight: 600, cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4f46e5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
          >
            <iconify-icon icon="lucide:download" style={{ fontSize: "14px" }} />
            Download Report
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "24px" }}>
        <KPICard
          title="Total Verified Wins"
          value={statsSummary.totalVerifiedWins}
          subtitle="↑ +12% from last year"
          icon="lucide:trophy"
          iconBg="#eff6ff"
          iconColor="#6366f1"
        />
        <KPICard
          title="Wins This Month"
          value={statsSummary.winsThisMonth}
          subtitle="↑ +4% from last month"
          icon="lucide:medal"
          iconBg="#f0fdf4"
          iconColor="#16a34a"
        />
        <KPICard
          title="External College Wins"
          value={statsSummary.externalCollegeWins}
          subtitle={`→ ${Math.round((statsSummary.externalCollegeWins / statsSummary.totalVerifiedWins) * 100)}% of total wins`}
          icon="lucide:map-pin"
          iconBg="#fef9c3"
          iconColor="#b45309"
          subtitleColor="#64748b"
        />
        <KPICard
          title="Pending Flags"
          value={statsSummary.pendingFlags}
          subtitle="⚑ Requires attention"
          icon="lucide:flag"
          iconBg="#fef2f2"
          iconColor="#dc2626"
          subtitleColor="#dc2626"
        />
      </div>

      {/* ── Search + Filter row ── */}
      <div style={{
        background: "var(--background)", border: "1px solid var(--border)",
        borderRadius: "14px", padding: "16px 20px", marginBottom: "16px",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px",
        flexWrap: "wrap",
      }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px",
          border: "1px solid var(--border)", borderRadius: "8px",
          padding: "8px 14px", flex: 1, maxWidth: "420px", background: "var(--background)" }}>
          <iconify-icon icon="lucide:search" style={{ fontSize: "15px", color: "var(--muted-foreground)", flexShrink: 0 }} />
          <input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by student name, ID or event..."
            style={{
              border: "none", outline: "none", background: "transparent",
              fontSize: "13px", color: "var(--foreground)", width: "100%",
            }}
          />
          {searchQuery && (
            <button onClick={() => handleSearch("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: 0, lineHeight: 1 }}>
              <iconify-icon icon="lucide:x" style={{ fontSize: "13px" }} />
            </button>
          )}
        </div>

        {/* Filter Events button */}
        <button
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", borderRadius: "8px",
            border: "1px solid var(--border)", background: "var(--background)",
            color: "var(--foreground)", fontSize: "13px", fontWeight: 500, cursor: "pointer",
          }}
        >
          <iconify-icon icon="lucide:sliders-horizontal" style={{ fontSize: "14px", color: "#6366f1" }} />
          Filter Events
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{
        background: "var(--background)", border: "1px solid var(--border)",
        borderRadius: "14px", overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
                {/* Student Info */}
                <th
                  onClick={() => handleSort("studentName")}
                  style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600,
                    color: "var(--muted-foreground)", cursor: "pointer", whiteSpace: "nowrap",
                    userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    Student Info
                    <SortIcon field="studentName" sortField={sortField} sortDir={sortDir} />
                  </span>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--muted-foreground)" }}>
                  Department
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--muted-foreground)" }}>
                  Host College
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--muted-foreground)" }}>
                  Event Name
                </th>
                <th
                  onClick={() => handleSort("position")}
                  style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600,
                    color: "var(--muted-foreground)", cursor: "pointer", whiteSpace: "nowrap",
                    userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    Position
                    <SortIcon field="position" sortField={sortField} sortDir={sortDir} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("date")}
                  style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600,
                    color: "var(--muted-foreground)", cursor: "pointer", whiteSpace: "nowrap",
                    userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    Date
                    <SortIcon field="date" sortField={sortField} sortDir={sortDir} />
                  </span>
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--muted-foreground)" }}>
                  Status
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--muted-foreground)" }}>
                  {/* Flag action */}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "40px 16px", textAlign: "center", color: "var(--muted-foreground)" }}>
                    No results found.
                  </td>
                </tr>
              ) : (
                paginated.map((row, idx) => {
                  const pm = POSITION_META[row.position] || POSITION_META.Bronze;
                  const sm = STATUS_META[row.status]    || STATUS_META.verified;
                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: idx < paginated.length - 1 ? "1px solid var(--border)" : "none",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Student Info */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img
                            src={row.avatar}
                            alt={row.studentName}
                            style={{ width: "36px", height: "36px", borderRadius: "50%",
                              border: "1px solid var(--border)", flexShrink: 0 }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3 }}>
                              {row.studentName}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                              {row.rollNo}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td style={{ padding: "14px 16px", color: "var(--foreground)", fontWeight: 500 }}>
                        {row.department}
                      </td>

                      {/* Host College */}
                      <td style={{ padding: "14px 16px", color: "var(--foreground)" }}>
                        {row.hostCollege}
                      </td>

                      {/* Event Name */}
                      <td style={{ padding: "14px 16px", color: "var(--foreground)" }}>
                        {row.eventName}
                      </td>

                      {/* Position badge */}
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "4px",
                          padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 600,
                          background: pm.bg, color: pm.color,
                          border: `1px solid ${pm.border}`,
                        }}>
                          {row.position === "Gold"   && "🥇"}
                          {row.position === "Silver" && "🥈"}
                          {row.position === "Bronze" && "🥉"}
                          {row.position} Place
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "14px 16px", color: "var(--foreground)", whiteSpace: "nowrap" }}>
                        {row.date}
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "4px",
                          padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 600,
                          background: sm.bg, color: sm.color,
                        }}>
                          <iconify-icon
                            icon={row.status === "verified" ? "lucide:check-circle-2" : "lucide:flag"}
                            style={{ fontSize: "11px" }}
                          />
                          {sm.label}
                        </span>
                      </td>

                      {/* Flag action */}
                      <td style={{ padding: "14px 16px" }}>
                        {row.status !== "flagged" && (
                          <button
                            onClick={() => handleFlag(row.id)}
                            title="Flag this entry"
                            style={{
                              display: "inline-flex", alignItems: "center", gap: "4px",
                              padding: "4px 10px", borderRadius: "6px", fontSize: "12px",
                              fontWeight: 500, cursor: "pointer",
                              border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626",
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
                          >
                            <iconify-icon icon="lucide:flag" style={{ fontSize: "11px" }} />
                            Flag
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination footer ── */}
        <div style={{
          borderTop: "1px solid var(--border)", padding: "12px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "8px",
        }}>
          <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
            Showing {processed.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, processed.length)} of {processed.length} entries
          </span>

          {/* Page buttons */}
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {/* Prev */}
            <PageBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <iconify-icon icon="lucide:chevron-left" style={{ fontSize: "14px" }} />
            </PageBtn>

            {/* Page numbers */}
            {buildPageNums(page, totalPages).map((n, i) =>
              n === "…" ? (
                <span key={`ellipsis-${i}`} style={{ padding: "0 4px", color: "var(--muted-foreground)", fontSize: "13px" }}>…</span>
              ) : (
                <PageBtn key={n} active={n === page} onClick={() => setPage(n)}>
                  {n}
                </PageBtn>
              )
            )}

            {/* Next */}
            <PageBtn disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              <iconify-icon icon="lucide:chevron-right" style={{ fontSize: "14px" }} />
            </PageBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page button sub-component ─────────────────────────────────────── */
function PageBtn({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={{
        width: "32px", height: "32px", borderRadius: "6px", border: "1px solid",
        borderColor: active ? "#6366f1" : "var(--border)",
        background: active ? "#6366f1" : "var(--background)",
        color: active ? "#fff" : disabled ? "var(--muted-foreground)" : "var(--foreground)",
        fontSize: "13px", fontWeight: active ? 600 : 400,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Pagination page number builder ────────────────────────────────── */
function buildPageNums(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}
