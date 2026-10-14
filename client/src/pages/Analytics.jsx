import { useState } from "react";
import {
  Download,
  Users,
  Trophy,
  Calendar,
  Code2,
  ArrowUpRight,
  Filter,
  TrendingUp,
  Zap,
  BarChart2,
  Award,
  Globe2,
} from "lucide-react";
import { generateEventReportExcel } from "../utils/eventReportExcel";
import { useTheme } from "../context/ThemeContext";

const instituteName = "Dhanalakshmi Srinivasan University";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: IconComponent,
  trend,
  accentColor = "border-blue-500",
  iconBg = "bg-blue-50 dark:bg-blue-950/50",
  iconColor = "text-blue-600 dark:text-blue-400",
}) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col gap-2.5 border-t-4 ${accentColor} transition-colors duration-200`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {label}
        </span>
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {IconComponent && <IconComponent size={16} />}
        </span>
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white leading-none">
        {value}
      </p>
      {trend && (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <ArrowUpRight size={11} />
          {trend}
        </span>
      )}
      {sub && (
        <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
      )}
    </div>
  );
}

// ─── Bar Chart with grid lines + value labels ─────────────────────────────────
function BarChart({
  data,
  height = 160,
  label = "",
  color,
  hoverColor,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const defaultColor = isDark ? "#1e3a8a" : "#bfdbfe";
  const defaultHover = isDark ? "#3b82f6" : "#2563eb";
  const barColor = color || defaultColor;
  const barHover = hoverColor || defaultHover;

  const [hovered, setHovered] = useState(null);
  const max = Math.max(...data.map((d) => d.value));
  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const innerH = height - 28;
  return (
    <div className="relative" style={{ height: height + 8 }}>
      {/* grid lines */}
      {gridLines.map((g) => (
        <div
          key={g}
          className="absolute left-0 right-0 border-t border-dashed border-slate-100 dark:border-slate-800"
          style={{ top: `${(1 - g) * innerH}px` }}
        />
      ))}
      <div className="flex items-end gap-2 relative z-10" style={{ height }}>
        {data.map((d, i) => {
          const barH = Math.max(4, (d.value / max) * innerH);
          return (
            <div
              key={i}
              className="flex flex-col items-center flex-1 cursor-pointer relative group"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* tooltip */}
              {hovered === i && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-20 pointer-events-none">
                  {d.label}: <strong>{d.value}</strong>
                  {label ? ` ${label}` : ""}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800 dark:border-t-slate-700" />
                </div>
              )}
              {/* value label on top of bar */}
              <span
                className={`text-[10px] font-semibold mb-0.5 transition-opacity ${
                  hovered === i
                    ? "opacity-100 text-blue-600 dark:text-blue-400"
                    : "opacity-0 group-hover:opacity-100 text-slate-500 dark:text-slate-400"
                }`}
              >
                {d.value}
              </span>
              <div
                className="w-full rounded-t transition-all duration-200"
                style={{
                  height: barH,
                  background: hovered === i ? barHover : barColor,
                }}
              />
              <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 truncate max-w-full text-center leading-tight">
                {d.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Line Chart ───────────────────────────────────────────────────────────────
function LineChart({ data, unit = "" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hovered, setHovered] = useState(null);
  const vals = data.map((d) => d.value);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const range = max - min || 1;
  const W = 400,
    H = 100,
    padX = 14,
    padY = 10;
  const pts = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * (W - 2 * padX),
    y: H - padY - ((d.value - min) / range) * (H - 2 * padY),
    ...d,
  }));
  const ptsStr = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const areaStr =
    `${pts[0].x},${H - padY} ` +
    ptsStr +
    ` ${pts[pts.length - 1].x},${H - padY}`;
  return (
    <div className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="#3b82f6"
              stopOpacity={isDark ? 0.35 : 0.18}
            />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon fill="url(#lg1)" points={areaStr} />
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={ptsStr}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {pts.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hovered === i ? 5 : 3}
              fill={hovered === i ? "#60a5fa" : isDark ? "#0f172a" : "white"}
              stroke="#3b82f6"
              strokeWidth="2"
              style={{ cursor: "pointer", transition: "r 0.1s" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r="12"
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          </g>
        ))}
      </svg>
      {hovered !== null && pts[hovered] && (
        <div
          className="absolute pointer-events-none bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-xl z-20 whitespace-nowrap"
          style={{
            left: `${(pts[hovered].x / W) * 100}%`,
            top: `${(pts[hovered].y / H) * 100}%`,
            transform: "translate(-50%, -160%)",
          }}
        >
          {pts[hovered].label}: <strong>{pts[hovered].value}</strong>
          {unit}
        </div>
      )}
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ segments, title }) {
  const [hovered, setHovered] = useState(null);
  const total = segments.reduce((s, d) => s + d.value, 0);
  const R = 34,
    C = 2 * Math.PI * R;
  const segsCalc = segments.reduce((acc, seg) => {
    const dash = (seg.value / total) * C;
    return {
      offset: acc.offset + dash,
      items: [...acc.items, { ...seg, dash, offset: acc.offset }],
    };
  }, { offset: 0, items: [] }).items;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segsCalc.map((seg, i) => (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={hovered === i ? 14 : 11}
              strokeDasharray={`${seg.dash} ${C - seg.dash}`}
              strokeDashoffset={-seg.offset}
              style={{
                cursor: "pointer",
                transition: "stroke-width 0.15s, opacity 0.15s",
                opacity: hovered !== null && hovered !== i ? 0.3 : 1,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {hovered !== null ? (
            <>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                {segments[hovered].label}
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {segments[hovered].value}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {Math.round((segments[hovered].value / total) * 100)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {title || "Total"}
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {total}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="w-full space-y-1.5">
        {segsCalc.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 text-xs cursor-pointer px-1 py-0.5 rounded transition-opacity ${
              hovered !== null && hovered !== i ? "opacity-35" : ""
            }`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: s.color }}
            />
            <span className="text-slate-600 dark:text-slate-300 flex-1 truncate">
              {s.label}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {s.value}
            </span>
            <span className="text-slate-400 dark:text-slate-500 w-7 text-right">
              {Math.round((s.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Progress Row ─────────────────────────────────────────────────────────────
function ProgressRow({ label, value, max, sub }) {
  const [hov, setHov] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const pct = Math.round((value / max) * 100);
  return (
    <div
      className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-default"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="w-28 shrink-0">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </p>
        {sub && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500">{sub}</p>
        )}
      </div>
      <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: hov ? "#2563eb" : isDark ? "#3b82f6" : "#93c5fd",
          }}
        />
      </div>
      <span
        className={`text-xs font-bold w-6 text-right transition-colors ${
          hov
            ? "text-blue-600 dark:text-blue-400"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Result Badge ─────────────────────────────────────────────────────────────
function ResultBadge({ result }) {
  const map = {
    "1st Prize":
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    "Winner":
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    "2nd Prize":
      "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
    "3rd Prize":
      "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
    "Finalist":
      "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-800",
    "Conducted":
      "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-800",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
        map[result] ||
        "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
      }`}
    >
      {result}
    </span>
  );
}

// ─── Level Badge ──────────────────────────────────────────────────────────────
function LevelBadge({ level }) {
  const map = {
    "National":
      "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
    "International":
      "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800",
    "College":
      "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
        map[level] || "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
      }`}
    >
      {level}
    </span>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ title, sub }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        {sub && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function Analytics() {
  const [year, setYear] = useState("2024-25");
  const [filterType, setFilterType] = useState("All");
  const [filterCat, setFilterCat] = useState("All");

  const allEvents = [
    { name: "Smart India Hackathon 2024", type: "Hackathon", category: "Tech", dept: "CSE", participants: 42, level: "National", result: "1st Prize", date: "Sep 2024" },
    { name: "Technical Symposium – TechFest", type: "Symposium", category: "Tech", dept: "ECE", participants: 185, level: "College", result: "Conducted", date: "Oct 2024" },
    { name: "BAJA SAE India", type: "Competition", category: "Tech", dept: "MECH", participants: 15, level: "National", result: "3rd Prize", date: "Feb 2025" },
    { name: "Cultural Fest – Kaleidoscope", type: "Cultural", category: "Non-Tech", dept: "All", participants: 320, level: "College", result: "Conducted", date: "Jan 2025" },
    { name: "ACM ICPC Regional", type: "Hackathon", category: "Tech", dept: "CSE/IT", participants: 8, level: "International", result: "Finalist", date: "Dec 2024" },
    { name: "Paper Presentation – INVENIO", type: "Symposium", category: "Tech", dept: "CSE", participants: 36, level: "National", result: "1st Prize", date: "Nov 2024" },
    { name: "Robowar Championship", type: "Competition", category: "Tech", dept: "ECE", participants: 20, level: "National", result: "2nd Prize", date: "Mar 2025" },
    { name: "Sports Meet – SNSRC", type: "Sports", category: "Non-Tech", dept: "All", participants: 430, level: "College", result: "Conducted", date: "Dec 2024" },
    { name: "Debate Competition", type: "Cultural", category: "Non-Tech", dept: "All", participants: 60, level: "College", result: "Conducted", date: "Aug 2024" },
    { name: "AI/ML Hackathon – InnovateSNS", type: "Hackathon", category: "Tech", dept: "CSE", participants: 55, level: "College", result: "Winner", date: "Jul 2024" },
    { name: "Ideathon 2024", type: "Hackathon", category: "Tech", dept: "IT", participants: 30, level: "College", result: "Conducted", date: "Jun 2024" },
    { name: "NSS Blood Donation Camp", type: "Social", category: "Non-Tech", dept: "All", participants: 95, level: "College", result: "Conducted", date: "Apr 2024" },
    { name: "IoT Workshop", type: "Workshop", category: "Tech", dept: "ECE", participants: 80, level: "College", result: "Conducted", date: "May 2024" },
    { name: "Project Expo 2024", type: "Symposium", category: "Tech", dept: "All", participants: 210, level: "College", result: "Conducted", date: "Mar 2025" },
    { name: "Kalaignar Trophy", type: "Sports", category: "Non-Tech", dept: "All", participants: 180, level: "College", result: "Conducted", date: "Feb 2025" },
  ];

  const filtered = allEvents.filter((e) => {
    const tOk = filterType === "All" || e.type === filterType;
    const cOk = filterCat === "All" || e.category === filterCat;
    return tOk && cOk;
  });

  const types = ["All", ...Array.from(new Set(allEvents.map((e) => e.type)))];
  const cats = ["All", "Tech", "Non-Tech"];
  const hackathons = allEvents.filter((e) => e.type === "Hackathon");
  const techCount = allEvents.filter((e) => e.category === "Tech").length;
  const nonTechCount = allEvents.filter((e) => e.category === "Non-Tech").length;
  const prizeWins = allEvents.filter((e) =>
    ["1st Prize", "2nd Prize", "3rd Prize", "Winner", "Finalist"].includes(e.result)
  ).length;
  const totalPart = allEvents.reduce((a, e) => a + e.participants, 0);
  const maxPart = Math.max(...allEvents.map((e) => e.participants));

  // top events by participants
  const topByPart = [...allEvents]
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 5);

  // insights
  const mostActiveMonth = (() => {
    const monthPart = [
      { label: "Apr", value: 95 },
      { label: "Oct", value: 185 },
      { label: "Dec", value: 438 },
      { label: "Jan", value: 320 },
      { label: "Mar", value: 390 },
    ];
    return monthPart.sort((a, b) => b.value - a.value)[0].label;
  })();
  const winRate = Math.round((prizeWins / allEvents.length) * 100);

  const typeBarData = [
    { label: "Hackathons", value: allEvents.filter((e) => e.type === "Hackathon").length },
    { label: "Symposiums", value: allEvents.filter((e) => e.type === "Symposium").length },
    { label: "Competitions", value: allEvents.filter((e) => e.type === "Competition").length },
    { label: "Cultural", value: allEvents.filter((e) => e.type === "Cultural").length },
    { label: "Sports", value: allEvents.filter((e) => e.type === "Sports").length },
    { label: "Workshops", value: allEvents.filter((e) => e.type === "Workshop").length },
    { label: "Social", value: allEvents.filter((e) => e.type === "Social").length },
  ];

  const monthlyBar = [
    { label: "Apr", value: 2 },
    { label: "May", value: 1 },
    { label: "Jun", value: 1 },
    { label: "Jul", value: 1 },
    { label: "Aug", value: 1 },
    { label: "Sep", value: 1 },
    { label: "Oct", value: 1 },
    { label: "Nov", value: 2 },
    { label: "Dec", value: 2 },
    { label: "Jan", value: 1 },
    { label: "Feb", value: 2 },
    { label: "Mar", value: 2 },
  ];

  const monthlyPart = [
    { label: "Apr", value: 95 },
    { label: "May", value: 80 },
    { label: "Jun", value: 30 },
    { label: "Jul", value: 55 },
    { label: "Aug", value: 60 },
    { label: "Sep", value: 42 },
    { label: "Oct", value: 185 },
    { label: "Nov", value: 36 },
    { label: "Dec", value: 438 },
    { label: "Jan", value: 320 },
    { label: "Feb", value: 195 },
    { label: "Mar", value: 390 },
  ];

  const levelDonut = [
    { label: "College", value: allEvents.filter((e) => e.level === "College").length, color: "#93c5fd" },
    { label: "National", value: allEvents.filter((e) => e.level === "National").length, color: "#3b82f6" },
    { label: "International", value: allEvents.filter((e) => e.level === "International").length, color: "#1d4ed8" },
  ];

  const techDonut = [
    { label: "Tech", value: techCount, color: "#6366f1" },
    { label: "Non-Tech", value: nonTechCount, color: "#f59e0b" },
  ];

  const resultDonut = [
    { label: "Prize/Finalist", value: prizeWins, color: "#f59e0b" },
    { label: "Conducted", value: allEvents.length - prizeWins, color: "#86efac" },
  ];

  const deptRows = [
    { label: "CSE", value: allEvents.filter((e) => e.dept.includes("CSE")).length, sub: "Computer Science" },
    { label: "ECE", value: allEvents.filter((e) => e.dept.includes("ECE")).length, sub: "Electronics" },
    { label: "MECH", value: allEvents.filter((e) => e.dept.includes("MECH")).length, sub: "Mechanical" },
    { label: "IT", value: allEvents.filter((e) => e.dept.includes("IT")).length, sub: "Information Tech" },
    { label: "All", value: allEvents.filter((e) => e.dept === "All").length, sub: "All Departments" },
  ];
  const deptMax = Math.max(...deptRows.map((d) => d.value));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* ── Header ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-600 dark:text-blue-400" />
              Event Analytics
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {instituteName} &nbsp;&middot;&nbsp; {year}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            >
              {["2022-23", "2023-24", "2024-25"].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <button
              onClick={() => generateEventReportExcel({ academicYear: year })}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-7">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total Events"
            value={allEvents.length}
            icon={Calendar}
            trend="+12 vs last year"
            accentColor="border-t-blue-500"
            iconBg="bg-blue-50 dark:bg-blue-950/50"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            label="Total Participants"
            value={totalPart.toLocaleString()}
            icon={Users}
            sub="Across all events"
            accentColor="border-t-indigo-500"
            iconBg="bg-indigo-50 dark:bg-indigo-950/50"
            iconColor="text-indigo-600 dark:text-indigo-400"
          />
          <StatCard
            label="Prize Wins"
            value={prizeWins}
            icon={Trophy}
            trend={`${winRate}% win rate`}
            accentColor="border-t-amber-400"
            iconBg="bg-amber-50 dark:bg-amber-950/50"
            iconColor="text-amber-600 dark:text-amber-400"
          />
          <StatCard
            label="Hackathons"
            value={hackathons.length}
            icon={Code2}
            trend="+2 vs last year"
            accentColor="border-t-violet-500"
            iconBg="bg-violet-50 dark:bg-violet-950/50"
            iconColor="text-violet-600 dark:text-violet-400"
          />
        </div>

        {/* ── Insights Strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: TrendingUp,
              color: "text-blue-500 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-950/50",
              label: "Most Active Month",
              val: `${mostActiveMonth} 2024`,
            },
            {
              icon: Globe2,
              color: "text-violet-500 dark:text-violet-400",
              bg: "bg-violet-50 dark:bg-violet-950/50",
              label: "National / Intl",
              val: `${allEvents.filter((e) => e.level !== "College").length} events`,
            },
            {
              icon: Award,
              color: "text-amber-500 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-amber-950/50",
              label: "Win Rate",
              val: `${winRate}%`,
            },
            {
              icon: Zap,
              color: "text-indigo-500 dark:text-indigo-400",
              bg: "bg-indigo-50 dark:bg-indigo-950/50",
              label: "Highest Turnout",
              val: `${maxPart} participants`,
            },
          ].map((ins, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 transition-colors duration-200"
            >
              <div
                className={`w-8 h-8 rounded-lg ${ins.bg} ${ins.color} flex items-center justify-center shrink-0`}
              >
                <ins.icon size={15} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">
                  {ins.label}
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {ins.val}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Row 1 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
            <SectionHeading title="Events by Type" sub="Hover bars for count" />
            <BarChart data={typeBarData} height={160} label="events" />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
            <SectionHeading
              title="Events per Month"
              sub={`Academic year ${year} — hover bars`}
            />
            <BarChart data={monthlyBar} height={160} label="events" />
          </div>
        </div>

        {/* ── Charts Row 2: 3 donuts ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
            <SectionHeading title="Tech vs Non-Tech" sub="Hover to highlight" />
            <DonutChart segments={techDonut} title="Events" />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
            <SectionHeading
              title="Level Distribution"
              sub="Hover to highlight"
            />
            <DonutChart segments={levelDonut} title="Events" />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
            <SectionHeading
              title="Outcome Breakdown"
              sub="Prize wins vs conducted"
            />
            <DonutChart segments={resultDonut} title="Events" />
          </div>
        </div>

        {/* ── Participation trend + Dept participation ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
            <SectionHeading
              title="Monthly Participation Trend"
              sub="Hover dots for exact count"
            />
            <div className="h-32">
              <LineChart data={monthlyPart} unit=" participants" />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-0.5">
              {monthlyPart.map((d) => (
                <span key={d.label}>{d.label}</span>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
            <SectionHeading title="Events by Dept" sub="Hover to highlight" />
            {deptRows.map((d) => (
              <ProgressRow
                key={d.label}
                label={d.label}
                sub={d.sub}
                value={d.value}
                max={deptMax}
              />
            ))}
          </div>
        </div>

        {/* ── Top events by participants + Hackathons ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top by participants */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
            <SectionHeading
              title="Top Events by Participation"
              sub="Highest turnout events"
            />
            <div className="space-y-2.5">
              {topByPart.map((e, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      i === 0
                        ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300"
                        : i === 1
                          ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          : i === 2
                            ? "bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {e.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-1.5 rounded-full bg-blue-400 dark:bg-blue-500"
                          style={{
                            width: `${(e.participants / maxPart) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium w-12 text-right shrink-0">
                        {e.participants} pax
                      </span>
                    </div>
                  </div>
                  <LevelBadge level={e.level} />
                </div>
              ))}
            </div>
          </div>

          {/* Hackathons spotlight */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
            <SectionHeading
              title="Hackathons"
              sub={`${hackathons.length} hackathons · Code & ideation challenges`}
            />
            <div className="space-y-2">
              {hackathons.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Code2 size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {h.name}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {h.dept} &middot; {h.date} &middot; {h.participants}{" "}
                      participants
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <ResultBadge result={h.result} />
                    <LevelBadge level={h.level} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Full Events Table ── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors duration-200">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                All Events &amp; Competitions
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {filtered.length} of {allEvents.length} events shown
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-slate-400 dark:text-slate-500" />
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
              >
                {cats.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
              >
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-slate-400 dark:text-slate-400 uppercase tracking-wide bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-5 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Dept</th>
                  <th className="px-4 py-3 font-medium">Participants</th>
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-10 text-center text-slate-400 dark:text-slate-500 text-sm"
                    >
                      No events match the selected filters.
                    </td>
                  </tr>
                )}
                {filtered.map((e, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 dark:border-slate-800/80 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-slate-100 text-sm leading-snug">
                        {e.name}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                      {e.type}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          e.category === "Tech"
                            ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                            : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        }`}
                      >
                        {e.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500">
                      {e.dept}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-1.5 rounded-full bg-blue-300 dark:bg-blue-500"
                            style={{
                              width: `${(e.participants / maxPart) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {e.participants}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <LevelBadge level={e.level} />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {e.date}
                    </td>
                    <td className="px-4 py-3">
                      <ResultBadge result={e.result} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-indigo-400 inline-block" />
              <strong className="text-slate-700 dark:text-slate-200">{techCount}</strong> Tech
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" />
              <strong className="text-slate-700 dark:text-slate-200">{nonTechCount}</strong> Non-Tech
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-blue-400 inline-block" />
              <strong className="text-slate-700 dark:text-slate-200">
                {allEvents.filter((e) => e.level !== "College").length}
              </strong>{" "}
              National / Intl
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-amber-300 inline-block" />
              <strong className="text-amber-600 dark:text-amber-400">{prizeWins}</strong> Prize Wins
            </span>
            <span className="ml-auto">
              <strong className="text-slate-700 dark:text-slate-200">
                {totalPart.toLocaleString()}
              </strong>{" "}
              total participants
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
