import { useState, useMemo } from "react";

/* ─── Mock data ──────────────────────────────────────────────────────── */
const RAW_LOGS = [
  {
    id: 1,
    user: "Rithish Kumar",
    role: "super_admin",
    action: "Revoked certificate CERT-2025-004",
    category: "certificate",
    severity: "high",
    ip: "103.21.58.12",
    ts: "2026-02-19T14:32:10",
  },
  {
    id: 2,
    user: "Rithish Kumar",
    role: "super_admin",
    action: "Enabled maintenance mode",
    category: "system",
    severity: "high",
    ip: "103.21.58.12",
    ts: "2026-02-19T13:58:44",
  },
  {
    id: 3,
    user: "Admin — Greenfield",
    role: "admin",
    action: "Bulk-imported 340 students",
    category: "data",
    severity: "medium",
    ip: "49.36.112.8",
    ts: "2026-02-19T12:11:22",
  },
  {
    id: 4,
    user: "Priya M.",
    role: "teacher",
    action: "Approved project 'Smart Traffic System'",
    category: "project",
    severity: "low",
    ip: "182.64.3.201",
    ts: "2026-02-19T11:45:03",
  },
  {
    id: 5,
    user: "Admin — Northside",
    role: "admin",
    action: "Downgraded college plan: Enterprise → Standard",
    category: "billing",
    severity: "high",
    ip: "59.99.241.17",
    ts: "2026-02-19T10:20:55",
  },
  {
    id: 6,
    user: "Rithish Kumar",
    role: "super_admin",
    action: "Updated email SMTP configuration",
    category: "system",
    severity: "medium",
    ip: "103.21.58.12",
    ts: "2026-02-18T23:05:31",
  },
  {
    id: 7,
    user: "Arjun Mehta",
    role: "student",
    action: "Submitted project 'DevOps Pipeline'",
    category: "project",
    severity: "low",
    ip: "122.160.44.91",
    ts: "2026-02-18T22:41:09",
  },
  {
    id: 8,
    user: "Admin — City Poly",
    role: "admin",
    action: "Deleted student account: sara.khan@city.edu",
    category: "user",
    severity: "high",
    ip: "27.57.188.33",
    ts: "2026-02-18T21:17:48",
  },
  {
    id: 9,
    user: "Rithish Kumar",
    role: "super_admin",
    action: "Exported global analytics report (PDF)",
    category: "data",
    severity: "low",
    ip: "103.21.58.12",
    ts: "2026-02-18T19:59:02",
  },
  {
    id: 10,
    user: "Sneha Krishnan",
    role: "student",
    action: "Updated portfolio — added 3 new projects",
    category: "profile",
    severity: "low",
    ip: "157.45.22.79",
    ts: "2026-02-18T18:33:14",
  },
  {
    id: 11,
    user: "Admin — Greenfield",
    role: "admin",
    action: "Created event: 'Spring Hackathon 2026'",
    category: "event",
    severity: "low",
    ip: "49.36.112.8",
    ts: "2026-02-18T17:02:55",
  },
  {
    id: 12,
    user: "Rithish Kumar",
    role: "super_admin",
    action: "Changed AI rate-limit: 500 → 1000 req/min",
    category: "ai",
    severity: "medium",
    ip: "103.21.58.12",
    ts: "2026-02-18T15:44:38",
  },
  {
    id: 13,
    user: "Fatima Zahra",
    role: "student",
    action: "Login from new device (Chrome / Windows)",
    category: "auth",
    severity: "medium",
    ip: "41.223.10.5",
    ts: "2026-02-18T14:20:11",
  },
  {
    id: 14,
    user: "Admin — Hillside",
    role: "admin",
    action: "Issued certificate to Priya Sharma",
    category: "certificate",
    severity: "low",
    ip: "117.55.91.44",
    ts: "2026-02-18T13:08:29",
  },
  {
    id: 15,
    user: "SYSTEM",
    role: "system",
    action: "Automated backup completed — 4.2 GB snapshot",
    category: "system",
    severity: "low",
    ip: "127.0.0.1",
    ts: "2026-02-18T03:00:00",
  },
  {
    id: 16,
    user: "Rithish Kumar",
    role: "super_admin",
    action: "Suspended college: Eastern Tech University",
    category: "billing",
    severity: "high",
    ip: "103.21.58.12",
    ts: "2026-02-17T22:34:57",
  },
  {
    id: 17,
    user: "Admin — Sunrise",
    role: "admin",
    action: "Reset password for user: karan.nair@sunrise",
    category: "auth",
    severity: "medium",
    ip: "115.99.66.7",
    ts: "2026-02-17T20:15:42",
  },
  {
    id: 18,
    user: "Dev Sharma",
    role: "student",
    action: "Failed login attempt (3 retries)",
    category: "auth",
    severity: "high",
    ip: "210.18.44.200",
    ts: "2026-02-17T19:02:08",
  },
  {
    id: 19,
    user: "SYSTEM",
    role: "system",
    action: "Scheduled maintenance reminder sent to all colleges",
    category: "system",
    severity: "low",
    ip: "127.0.0.1",
    ts: "2026-02-17T18:00:00",
  },
  {
    id: 20,
    user: "Rithish Kumar",
    role: "super_admin",
    action: "Rotated digital signature key — RSA-4096",
    category: "security",
    severity: "high",
    ip: "103.21.58.12",
    ts: "2026-02-17T16:48:33",
  },
  {
    id: 21,
    user: "Admin — Pioneer",
    role: "admin",
    action: "Added new admin: ops@pioneer.edu",
    category: "user",
    severity: "high",
    ip: "36.255.211.9",
    ts: "2026-02-17T15:30:20",
  },
  {
    id: 23,
    user: "Admin — Capital",
    role: "admin",
    action: "NAAC report generated for Q4 2025",
    category: "data",
    severity: "low",
    ip: "59.180.34.72",
    ts: "2026-02-17T13:05:11",
  },
  {
    id: 24,
    user: "Rithish Kumar",
    role: "super_admin",
    action: "Updated platform branding — primary colour changed",
    category: "system",
    severity: "low",
    ip: "103.21.58.12",
    ts: "2026-02-16T20:30:00",
  },
  {
    id: 25,
    user: "SYSTEM",
    role: "system",
    action: "SSL certificate auto-renewed (expires 2027-02)",
    category: "security",
    severity: "medium",
    ip: "127.0.0.1",
    ts: "2026-02-16T04:00:00",
  },
];

const ROLES = ["all", "super_admin", "admin", "teacher", "student", "system"];
const CATEGORIES = [
  "all",
  "auth",
  "certificate",
  "billing",
  "data",
  "system",
  "project",
  "event",
  "user",
  "ai",
  "security",
  "profile",
];

const ROLE_STYLE = {
  super_admin: {
    label: "Super Admin",
    bg: "#faf5ff",
    color: "#7c3aed",
    border: "#ddd6fe",
  },
  admin: { label: "Admin", bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  teacher: {
    label: "Teacher",
    bg: "#f0fdf4",
    color: "#16a34a",
    border: "#bbf7d0",
  },
  student: {
    label: "Student",
    bg: "#fff7ed",
    color: "#d97706",
    border: "#fed7aa",
  },
  system: {
    label: "System",
    bg: "#f8fafc",
    color: "#64748b",
    border: "#e2e8f0",
  },
};

const SEVERITY_STYLE = {
  high: {
    bg: "#fef2f2",
    color: "#dc2626",
    border: "#fecaca",
    dot: "#dc2626",
    icon: "lucide:alert-triangle",
  },
  medium: {
    bg: "#fffbeb",
    color: "#d97706",
    border: "#fde68a",
    dot: "#d97706",
    icon: "lucide:alert-circle",
  },
  low: {
    bg: "#f0fdf4",
    color: "#16a34a",
    border: "#bbf7d0",
    dot: "#16a34a",
    icon: "lucide:info",
  },
};

const CAT_ICON = {
  auth: "lucide:key-round",
  certificate: "lucide:badge-check",
  billing: "lucide:credit-card",
  data: "lucide:database",
  system: "lucide:settings",
  project: "lucide:folder-code",
  event: "lucide:calendar",
  user: "lucide:user",
  ai: "lucide:bot",
  security: "lucide:shield",
  profile: "lucide:user-pen",
};

function fmt(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/* ─── Export helpers ────────────────────────────────────────────────── */
function exportCSV(logs) {
  const header = "ID,User,Role,Category,Severity,Action,IP Address,Timestamp";
  const rows = logs.map((l) =>
    [
      l.id,
      `"${l.user}"`,
      l.role,
      l.category,
      l.severity,
      `"${l.action}"`,
      l.ip,
      l.ts,
    ].join(","),
  );
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-logs-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function AuditLogs() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    return RAW_LOGS.filter((l) => {
      if (roleFilter !== "all" && l.role !== roleFilter) return false;
      if (catFilter !== "all" && l.category !== catFilter) return false;
      if (severityFilter !== "all" && l.severity !== severityFilter)
        return false;
      if (
        search &&
        !l.user.toLowerCase().includes(search.toLowerCase()) &&
        !l.action.toLowerCase().includes(search.toLowerCase()) &&
        !l.ip.includes(search)
      )
        return false;
      if (dateFrom && l.ts < dateFrom) return false;
      if (dateTo && l.ts > dateTo + "T23:59:59") return false;
      return true;
    });
  }, [roleFilter, catFilter, severityFilter, search, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const severityCounts = useMemo(
    () => ({
      high: RAW_LOGS.filter((l) => l.severity === "high").length,
      medium: RAW_LOGS.filter((l) => l.severity === "medium").length,
      low: RAW_LOGS.filter((l) => l.severity === "low").length,
    }),
    [],
  );

  const resetPage = () => setPage(1);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "4px",
            }}
          >
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 800,
                margin: 0,
                color: "var(--foreground)",
              }}
            >
              Audit Logs
            </h1>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 10px",
                borderRadius: "999px",
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
                letterSpacing: "0.3px",
              }}
            >
              SECURITY
            </span>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Immutable record of all user and system actions across the platform
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => exportCSV(filtered)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 16px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--muted)",
              cursor: "pointer",
              color: "var(--foreground)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <iconify-icon icon="lucide:download" style={{ fontSize: "15px" }} />{" "}
            Export CSV
          </button>
          <button
            onClick={() => exportCSV(filtered)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 16px",
              borderRadius: "10px",
              border: "none",
              background: "var(--primary)",
              cursor: "pointer",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <iconify-icon
              icon="lucide:file-text"
              style={{ fontSize: "15px" }}
            />{" "}
            Export Report
          </button>
        </div>
      </div>

      {/* ── Severity KPI strip ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "22px",
        }}
      >
        {[
          {
            label: "Total Events",
            value: RAW_LOGS.length,
            icon: "lucide:list",
            color: "#6366f1",
            bg: "#eff6ff",
          },
          {
            label: "High Severity",
            value: severityCounts.high,
            icon: "lucide:alert-triangle",
            color: "#dc2626",
            bg: "#fef2f2",
          },
          {
            label: "Medium Severity",
            value: severityCounts.medium,
            icon: "lucide:alert-circle",
            color: "#d97706",
            bg: "#fffbeb",
          },
          {
            label: "Low / Info",
            value: severityCounts.low,
            icon: "lucide:info",
            color: "#16a34a",
            bg: "#f0fdf4",
          },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "11px",
                background: k.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <iconify-icon
                icon={k.icon}
                style={{ fontSize: "20px", color: k.color }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "var(--foreground)",
                  lineHeight: 1.2,
                }}
              >
                {k.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  fontWeight: 500,
                }}
              >
                {k.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div
        style={{
          background: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "16px 18px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <iconify-icon
            icon="lucide:filter"
            style={{ fontSize: "15px", color: "var(--muted-foreground)" }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Filters
          </span>
          <button
            onClick={() => {
              setRoleFilter("all");
              setCatFilter("all");
              setSeverityFilter("all");
              setSearch("");
              setDateFrom("");
              setDateTo("");
              resetPage();
            }}
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--primary)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Reset all
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
            gap: "10px",
            alignItems: "end",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative" }}>
            <iconify-icon
              icon="lucide:search"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "14px",
                color: "var(--muted-foreground)",
              }}
            />
            <input
              type="text"
              value={search}
              placeholder="Search user, action, IP..."
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                paddingLeft: "32px",
                paddingRight: "12px",
                paddingTop: "8px",
                paddingBottom: "8px",
                fontSize: "13px",
                border: "1px solid var(--border)",
                borderRadius: "9px",
                background: "var(--muted)",
                color: "var(--foreground)",
                outline: "none",
              }}
            />
          </div>

          {/* Role */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              resetPage();
            }}
            style={{
              padding: "8px 10px",
              fontSize: "13px",
              border: "1px solid var(--border)",
              borderRadius: "9px",
              background: "var(--muted)",
              color: "var(--foreground)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r === "all"
                  ? "All Roles"
                  : r
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>

          {/* Category */}
          <select
            value={catFilter}
            onChange={(e) => {
              setCatFilter(e.target.value);
              resetPage();
            }}
            style={{
              padding: "8px 10px",
              fontSize: "13px",
              border: "1px solid var(--border)",
              borderRadius: "9px",
              background: "var(--muted)",
              color: "var(--foreground)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "all"
                  ? "All Categories"
                  : c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              resetPage();
            }}
            style={{
              padding: "8px 10px",
              fontSize: "13px",
              border: "1px solid var(--border)",
              borderRadius: "9px",
              background: "var(--muted)",
              color: "var(--foreground)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">All Severity</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Date from */}
          <div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "var(--muted-foreground)",
                marginBottom: "3px",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              From
            </div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                resetPage();
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "7px 10px",
                fontSize: "12px",
                border: "1px solid var(--border)",
                borderRadius: "9px",
                background: "var(--muted)",
                color: "var(--foreground)",
                outline: "none",
              }}
            />
          </div>

          {/* Date to */}
          <div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "var(--muted-foreground)",
                marginBottom: "3px",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              To
            </div>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                resetPage();
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "7px 10px",
                fontSize: "12px",
                border: "1px solid var(--border)",
                borderRadius: "9px",
                background: "var(--muted)",
                color: "var(--foreground)",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Active filter chips */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginTop: "10px",
            flexWrap: "wrap",
          }}
        >
          {filtered.length !== RAW_LOGS.length && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: "999px",
                background: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #bfdbfe",
              }}
            >
              {filtered.length} of {RAW_LOGS.length} entries
            </span>
          )}
          {roleFilter !== "all" && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: "999px",
                background: "var(--muted)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            >
              Role: {roleFilter}
            </span>
          )}
          {catFilter !== "all" && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: "999px",
                background: "var(--muted)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            >
              Category: {catFilter}
            </span>
          )}
          {severityFilter !== "all" && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: "999px",
                background: "var(--muted)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            >
              Severity: {severityFilter}
            </span>
          )}
          {dateFrom && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: "999px",
                background: "var(--muted)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            >
              From: {dateFrom}
            </span>
          )}
          {dateTo && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: "999px",
                background: "var(--muted)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            >
              To: {dateTo}
            </span>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div
        style={{
          background: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "32px 1.6fr 1.1fr 1fr 2.8fr 1.1fr 0.9fr",
            gap: "0",
            padding: "11px 18px",
            background: "var(--muted)",
            borderBottom: "1px solid var(--border)",
            alignItems: "center",
          }}
        >
          {[
            "",
            "User",
            "Role",
            "Category",
            "Action",
            "IP Address",
            "Timestamp",
          ].map((h) => (
            <div
              key={h}
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div style={{ padding: "56px", textAlign: "center" }}>
            <iconify-icon
              icon="lucide:search-x"
              style={{ fontSize: "36px", color: "var(--muted-foreground)" }}
            />
            <div
              style={{
                marginTop: "12px",
                fontSize: "14px",
                color: "var(--muted-foreground)",
              }}
            >
              No logs match your filters
            </div>
          </div>
        ) : (
          paginated.map((log, i) => {
            const rs = ROLE_STYLE[log.role] ?? ROLE_STYLE.system;
            const ss = SEVERITY_STYLE[log.severity];
            const catIcon = CAT_ICON[log.category] ?? "lucide:activity";
            const isExpanded = expandedId === log.id;
            return (
              <div key={log.id}>
                <div
                  onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "32px 1.6fr 1.1fr 1fr 2.8fr 1.1fr 0.9fr",
                    gap: "0",
                    padding: "13px 18px",
                    borderBottom: "1px solid var(--border)",
                    alignItems: "center",
                    cursor: "pointer",
                    background: isExpanded ? "var(--muted)" : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    !isExpanded &&
                    (e.currentTarget.style.background = "var(--muted)")
                  }
                  onMouseLeave={(e) =>
                    !isExpanded &&
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Severity dot */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "9px",
                        height: "9px",
                        borderRadius: "50%",
                        background: ss.dot,
                        boxShadow: `0 0 0 2px ${ss.bg}`,
                      }}
                    />
                  </div>

                  {/* User */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: rs.bg,
                        border: `1px solid ${rs.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <iconify-icon
                        icon={
                          log.role === "system"
                            ? "lucide:server"
                            : "lucide:user"
                        }
                        style={{ fontSize: "14px", color: rs.color }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                      }}
                    >
                      {log.user}
                    </span>
                  </div>

                  {/* Role */}
                  <div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 9px",
                        borderRadius: "999px",
                        background: rs.bg,
                        color: rs.color,
                        border: `1px solid ${rs.border}`,
                      }}
                    >
                      {rs.label}
                    </span>
                  </div>

                  {/* Category */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <iconify-icon
                      icon={catIcon}
                      style={{
                        fontSize: "13px",
                        color: "var(--muted-foreground)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    >
                      {log.category}
                    </span>
                  </div>

                  {/* Action */}
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--foreground)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={log.action}
                  >
                    {log.action}
                  </div>

                  {/* IP */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <iconify-icon
                      icon="lucide:globe"
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        fontFamily: "monospace",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {log.ip}
                    </span>
                  </div>

                  {/* Timestamp */}
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                      lineHeight: 1.4,
                    }}
                  >
                    {fmt(log.ts)}
                  </div>
                </div>

                {/* Expanded detail row */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "14px 18px 16px 64px",
                      background: "var(--muted)",
                      borderBottom: "1px solid var(--border)",
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "14px",
                    }}
                  >
                    {[
                      {
                        label: "Log ID",
                        value: `#${log.id}`,
                        icon: "lucide:hash",
                      },
                      {
                        label: "Severity",
                        icon: ss.icon,
                        valueEl: (
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              padding: "2px 10px",
                              borderRadius: "999px",
                              background: ss.bg,
                              color: ss.color,
                              border: `1px solid ${ss.border}`,
                              textTransform: "capitalize",
                            }}
                          >
                            {log.severity}
                          </span>
                        ),
                      },
                      {
                        label: "IP Address",
                        value: log.ip,
                        icon: "lucide:network",
                      },
                      {
                        label: "Full Timestamp",
                        value: log.ts,
                        icon: "lucide:clock",
                      },
                      { label: "User", value: log.user, icon: "lucide:user" },
                      {
                        label: "Role",
                        value: log.role.replace("_", " "),
                        icon: "lucide:shield",
                      },
                      { label: "Category", value: log.category, icon: catIcon },
                      {
                        label: "Action (full)",
                        value: log.action,
                        icon: "lucide:activity",
                      },
                    ].map((d) => (
                      <div key={d.label}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            marginBottom: "3px",
                          }}
                        >
                          <iconify-icon
                            icon={d.icon}
                            style={{
                              fontSize: "12px",
                              color: "var(--muted-foreground)",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              color: "var(--muted-foreground)",
                              textTransform: "uppercase",
                              letterSpacing: "0.4px",
                            }}
                          >
                            {d.label}
                          </span>
                        </div>
                        {d.valueEl ?? (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--foreground)",
                              fontWeight: 600,
                            }}
                          >
                            {d.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "14px",
        }}
      >
        <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
          Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
          {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}{" "}
          entries
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "7px 14px",
              borderRadius: "9px",
              border: "1px solid var(--border)",
              background: "var(--muted)",
              cursor: page === 1 ? "not-allowed" : "pointer",
              color:
                page === 1 ? "var(--muted-foreground)" : "var(--foreground)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "9px",
                border: `1px solid ${page === p ? "var(--primary)" : "var(--border)"}`,
                background: page === p ? "var(--primary)" : "var(--muted)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                color: page === p ? "white" : "var(--foreground)",
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: "7px 14px",
              borderRadius: "9px",
              border: "1px solid var(--border)",
              background: "var(--muted)",
              cursor: page === totalPages ? "not-allowed" : "pointer",
              color:
                page === totalPages
                  ? "var(--muted-foreground)"
                  : "var(--foreground)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
