import { useState } from "react";

const initial = [
  { id: 1, name: "IIT Bombay",     location: "Mumbai, Maharashtra",        tier: "Tier 1", students: 12400, placements: "98%",  avgPackage: "₹18.5 LPA", topSkills: ["AI/ML", "Backend Dev", "Data Science"],  note: "Priority for FTE hiring drive in March",      initials: "IB", savedOn: "Feb 18, 2026", activeDrives: 2 },
  { id: 2, name: "BITS Pilani",    location: "Pilani, Rajasthan",          tier: "Tier 1", students: 8900,  placements: "97%",  avgPackage: "₹16.2 LPA", topSkills: ["Full Stack", "Algorithms", "Embedded"],   note: "Strong full-stack talent pool",               initials: "BP", savedOn: "Feb 15, 2026", activeDrives: 1 },
  { id: 3, name: "NIT Trichy",     location: "Tiruchirappalli, Tamil Nadu", tier: "Tier 1", students: 7500,  placements: "95%",  avgPackage: "₹13.8 LPA", topSkills: ["Java", "Cloud", "DevOps"],                note: "Great for backend and DevOps roles",          initials: "NT", savedOn: "Feb 10, 2026", activeDrives: 0 },
  { id: 4, name: "IIM Ahmedabad",  location: "Ahmedabad, Gujarat",         tier: "Tier 1", students: 2400,  placements: "100%", avgPackage: "₹32.0 LPA", topSkills: ["Product Mgmt", "Strategy", "Finance"],    note: "Target for PM internship program",            initials: "IA", savedOn: "Feb 5, 2026",  activeDrives: 1 },
  { id: 5, name: "VIT Vellore",    location: "Vellore, Tamil Nadu",        tier: "Tier 2", students: 24000, placements: "91%",  avgPackage: "₹9.4 LPA",  topSkills: ["Web Dev", "Python", "IoT"],               note: "Large talent pool, good for volume hiring",   initials: "VV", savedOn: "Jan 28, 2026", activeDrives: 3 },
  { id: 6, name: "IIT Delhi",      location: "New Delhi, Delhi",           tier: "Tier 1", students: 10800, placements: "96%",  avgPackage: "₹19.2 LPA", topSkills: ["Systems", "ML Research", "Cloud"],        note: "Top picks for research-heavy roles",          initials: "ID", savedOn: "Jan 22, 2026", activeDrives: 2 },
];

const TIER_COLORS = {
  "Tier 1": { bg: "#eef2ff", color: "#2b4ed6" },
  "Tier 2": { bg: "#dcfce7", color: "#16a34a" },
  "Tier 3": { bg: "#fef3c7", color: "#d97706" },
};

const SORT_OPTIONS = ["Date Saved", "Avg Package", "Placement %", "Students"];

export default function SavedColleges() {
  const [colleges, setColleges] = useState(initial);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Date Saved");
  const [tierFilter, setTierFilter] = useState("All");

  const remove = (id) => setColleges((prev) => prev.filter((c) => c.id !== id));

  const filtered = colleges
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.topSkills.some((s) => s.toLowerCase().includes(q))
      );
    })
    .filter((c) => tierFilter === "All" || c.tier === tierFilter)
    .sort((a, b) => {
      if (sortBy === "Avg Package")
        return (
          parseFloat(b.avgPackage.replace(/[^0-9.]/g, "")) -
          parseFloat(a.avgPackage.replace(/[^0-9.]/g, ""))
        );
      if (sortBy === "Placement %")
        return parseFloat(b.placements) - parseFloat(a.placements);
      if (sortBy === "Students") return b.students - a.students;
      return b.id - a.id;
    });

  return (
    <div
      style={{
        padding: "28px 32px",
        background: "var(--background)",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: "0 0 4px 0",
              letterSpacing: "-0.3px",
            }}
          >
            Saved Colleges
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: 0 }}>
            {colleges.length} colleges saved &mdash; track drives, talent pools &amp; follow-ups
          </p>
        </div>
        <button
          style={{
            padding: "9px 18px",
            borderRadius: "8px",
            background: "#f97316",
            color: "white",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <iconify-icon icon="lucide:plus" style={{ fontSize: "14px" }}></iconify-icon>
          Add College
        </button>
      </div>

      {/* ── Summary Stats Row ── */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            label: "Total Colleges",
            value: colleges.length,
            icon: "lucide:building-2",
            iconColor: "#2b4ed6",
            iconBg: "#eef2ff",
          },
          {
            label: "Active Drives",
            value: colleges.reduce((s, c) => s + c.activeDrives, 0),
            icon: "lucide:calendar-check-2",
            iconColor: "#16a34a",
            iconBg: "#dcfce7",
          },
          {
            label: "Avg Package",
            value: "₹18.2 LPA",
            icon: "lucide:indian-rupee",
            iconColor: "#d97706",
            iconBg: "#fef3c7",
          },
          {
            label: "Total Students",
            value: colleges.reduce((s, c) => s + c.students, 0).toLocaleString(),
            icon: "lucide:users",
            iconColor: "#7c3aed",
            iconBg: "#f5f3ff",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: "1 1 160px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "14px 18px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: stat.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <iconify-icon
                icon={stat.icon}
                style={{ fontSize: "16px", color: stat.iconColor }}
              ></iconify-icon>
            </div>
            <div>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  lineHeight: 1.2,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <iconify-icon
            icon="lucide:search"
            style={{
              position: "absolute",
              left: "11px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "14px",
              color: "var(--muted-foreground)",
              pointerEvents: "none",
            }}
          ></iconify-icon>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search colleges, locations, skills…"
            style={{
              width: "100%",
              padding: "9px 12px 9px 34px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--card)",
              color: "var(--foreground)",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Tier filter */}
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          style={{
            padding: "9px 12px",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "var(--card)",
            color: "var(--foreground)",
            fontSize: "13px",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {["All", "Tier 1", "Tier 2", "Tier 3"].map((t) => (
            <option key={t} value={t}>
              {t === "All" ? "All Tiers" : t}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "12px", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
            Sort by
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "9px 12px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--card)",
              color: "var(--foreground)",
              fontSize: "13px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Results count when filtering ── */}
      {(search || tierFilter !== "All") && (
        <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: "0 0 16px 0" }}>
          Showing {filtered.length} of {colleges.length} colleges
        </p>
      )}

      {/* ── Cards Grid ── */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
          }}
        >
          <iconify-icon
            icon="lucide:search-x"
            style={{ fontSize: "40px", color: "var(--muted-foreground)", display: "block", margin: "0 auto 12px" }}
          ></iconify-icon>
          <p style={{ fontSize: "14px", color: "var(--muted-foreground)", margin: 0 }}>
            No colleges match your search.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((college) => (
            <CollegeCard key={college.id} college={college} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}

function CollegeCard({ college, onRemove }) {
  const [hovered, setHovered] = useState(false);
  const tierStyle = TIER_COLORS[college.tier] || TIER_COLORS["Tier 3"];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "box-shadow 0.18s, transform 0.18s",
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,0.10)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: "4px",
          background: "linear-gradient(90deg, #2b4ed6, #2b4ed655)",
        }}
      />

      {/* Card body */}
      <div style={{ padding: "20px" }}>
        {/* College header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            marginBottom: "16px",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              background: "#eef2ff",
              color: "#2b4ed6",
              fontWeight: 800,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "1.5px solid #2b4ed625",
            }}
          >
            {college.initials}
          </div>

          {/* Name + location */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "3px",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                {college.name}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "20px",
                  background: tierStyle.bg,
                  color: tierStyle.color,
                }}
              >
                {college.tier}
              </span>
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <iconify-icon icon="lucide:map-pin" style={{ fontSize: "11px" }}></iconify-icon>
              {college.location}
            </div>
          </div>

          {/* Active drives badge */}
          {college.activeDrives > 0 && (
            <div
              style={{
                flexShrink: 0,
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 9px",
                borderRadius: "20px",
                background: "#dcfce7",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <iconify-icon icon="lucide:zap" style={{ fontSize: "11px" }}></iconify-icon>
              {college.activeDrives} Drive{college.activeDrives > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
            padding: "14px",
            background: "var(--background)",
            borderRadius: "8px",
            marginBottom: "14px",
          }}
        >
          {[
            { label: "Students", value: college.students.toLocaleString(), icon: "lucide:users" },
            { label: "Placements", value: college.placements, icon: "lucide:trending-up" },
            { label: "Avg Package", value: college.avgPackage, icon: "lucide:indian-rupee" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <iconify-icon
                icon={stat.icon}
                style={{ fontSize: "13px", color: "var(--muted-foreground)", display: "block", margin: "0 auto 3px" }}
              ></iconify-icon>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  lineHeight: 1.2,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "10px", color: "var(--muted-foreground)", marginTop: "1px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Top Skills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
          {college.topSkills.map((sk) => (
            <span
              key={sk}
              style={{
                fontSize: "11px",
                fontWeight: 500,
                padding: "3px 9px",
                borderRadius: "6px",
                background: "var(--background)",
                color: "var(--muted-foreground)",
                border: "1px solid var(--border)",
              }}
            >
              {sk}
            </span>
          ))}
        </div>

        {/* Note — accent left border */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "7px",
            padding: "10px 12px",
            background: "var(--background)",
            borderLeft: "3px solid #2b4ed6",
            borderRadius: "0 6px 6px 0",
            marginBottom: "16px",
          }}
        >
          <iconify-icon
            icon="lucide:file-text"
            style={{ fontSize: "13px", color: "#2b4ed6", flexShrink: 0, marginTop: "1px" }}
          ></iconify-icon>
          <span style={{ fontSize: "12px", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
            {college.note}
          </span>
        </div>

        {/* Footer: saved date + action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              color: "var(--muted-foreground)",
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <iconify-icon icon="lucide:bookmark" style={{ fontSize: "11px" }}></iconify-icon>
            Saved {college.savedOn}
          </span>

          <button
            style={{
              padding: "7px 14px",
              borderRadius: "7px",
              background: "#f97316",
              color: "white",
              border: "none",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <iconify-icon icon="lucide:calendar-plus" style={{ fontSize: "13px" }}></iconify-icon>
            Plan Drive
          </button>

          <button
            style={{
              padding: "7px 12px",
              borderRadius: "7px",
              background: "transparent",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            View
          </button>

          <button
            onClick={() => onRemove(college.id)}
            title="Remove"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "7px",
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <iconify-icon icon="lucide:trash-2" style={{ fontSize: "13px", color: "#dc2626" }}></iconify-icon>
          </button>
        </div>
      </div>
    </div>
  );
}
