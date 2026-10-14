import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Chart Colors
const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
];

// Custom Tooltip Styles
const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  padding: "14px 18px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
};

// Custom Tooltip Components
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={tooltipStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "4px",
              background: data.payload.fill || data.payload.color,
            }}
          ></div>
          <span
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: "var(--foreground)",
            }}
          >
            {data.name || data.payload.area || data.payload.type}
          </span>
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: data.payload.fill || data.payload.color,
          }}
        >
          {data.value}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--muted-foreground)",
            marginTop: "4px",
          }}
        >
          {((data.percent || 0) * 100).toFixed(1)}% of total
        </div>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={tooltipStyle}>
        <div
          style={{
            fontWeight: 600,
            fontSize: "14px",
            color: "var(--foreground)",
            marginBottom: "10px",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "8px",
          }}
        >
          {label}
        </div>
        {payload.map((entry, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "3px",
                background: entry.color,
              }}
            ></div>
            <span
              style={{ fontSize: "13px", color: "var(--muted-foreground)" }}
            >
              {entry.name}:
            </span>
            <span
              style={{ fontSize: "14px", fontWeight: 600, color: entry.color }}
            >
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={tooltipStyle}>
        <div
          style={{
            fontWeight: 600,
            fontSize: "14px",
            color: "var(--foreground)",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>📊</span> {label}
        </div>
        {payload.map((entry, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
              padding: "8px 12px",
              background: `${entry.color}15`,
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: entry.color,
              }}
            ></div>
            <span
              style={{ flex: 1, fontSize: "13px", color: "var(--foreground)" }}
            >
              {entry.name}
            </span>
            <span
              style={{ fontSize: "16px", fontWeight: 700, color: entry.color }}
            >
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomCollegeTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={tooltipStyle}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "15px",
            color: "var(--foreground)",
            marginBottom: "12px",
          }}
        >
          🏫 {label}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {payload.map((entry, index) => (
            <div
              key={index}
              style={{
                padding: "10px",
                background: `${entry.color}15`,
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: entry.color,
                }}
              >
                {entry.value}
              </div>
              <div
                style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
              >
                {entry.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Sample analytics data by time range
const ANALYTICS_DATA_BY_RANGE = {
  week: {
    overview: {
      totalEvents: 2,
      totalParticipants: 94,
      avgTeamSize: 3.0,
      successRate: 95,
      totalColleges: 8,
      activeStudents: 76,
    },
    areaDistribution: [
      { area: "Computer Science", count: 32, color: "#6366f1" },
      { area: "Electronics", count: 16, color: "#8b5cf6" },
      { area: "Mechanical", count: 12, color: "#a855f7" },
      { area: "Civil", count: 8, color: "#d946ef" },
      { area: "Information Technology", count: 14, color: "#ec4899" },
      { area: "AI & Data Science", count: 12, color: "#f43f5e" },
    ],
    domainParticipation: [
      { domain: "Web Development", participants: 26, wins: 1, winRate: 3.8 },
      { domain: "Machine Learning", participants: 24, wins: 1, winRate: 4.2 },
      { domain: "IoT", participants: 12, wins: 1, winRate: 8.3 },
      { domain: "Blockchain", participants: 6, wins: 0, winRate: 0.0 },
      { domain: "Mobile Apps", participants: 14, wins: 1, winRate: 7.1 },
      { domain: "Cybersecurity", participants: 12, wins: 0, winRate: 0.0 },
    ],
    trendTitle: "Daily Participation Trend (Past 7 Days)",
    participationTrend: [
      { period: "Mon", events: 0, participants: 8 },
      { period: "Tue", events: 1, participants: 24 },
      { period: "Wed", events: 0, participants: 12 },
      { period: "Thu", events: 0, participants: 15 },
      { period: "Fri", events: 1, participants: 22 },
      { period: "Sat", events: 0, participants: 9 },
      { period: "Sun", events: 0, participants: 4 },
    ],
    eventTypes: [
      { type: "Hackathon", count: 1, percentage: 50, participants: 58 },
      { type: "Workshop", count: 1, percentage: 50, participants: 36 },
    ],
    yearWiseParticipation: [
      { year: "1st Year", count: 16, percentage: 17 },
      { year: "2nd Year", count: 27, percentage: 29 },
      { year: "3rd Year", count: 33, percentage: 35 },
      { year: "4th Year", count: 18, percentage: 19 },
    ],
    quickInsights: [
      { label: "Completion Rate", value: 92, color: "#22c55e" },
      { label: "Team Formation", value: 88, color: "#3b82f6" },
      { label: "Mentor Approval", value: 96, color: "#8b5cf6" },
      { label: "External Collab", value: 60, color: "#f59e0b" },
    ],
    insightsList: [
      {
        icon: "lucide:trending-up",
        color: "#22c55e",
        text: "Sprint registrations spiked on Tuesday following campus kickoff",
      },
      {
        icon: "lucide:zap",
        color: "#f59e0b",
        text: "Average team formation completed in under 36 hours this week",
      },
      {
        icon: "lucide:star",
        color: "#6366f1",
        text: "AI/ML workshop had a 95% full-session completion rate",
      },
    ],
  },
  month: {
    overview: {
      totalEvents: 4,
      totalParticipants: 356,
      avgTeamSize: 3.4,
      successRate: 91,
      totalColleges: 18,
      activeStudents: 284,
    },
    areaDistribution: [
      { area: "Computer Science", count: 118, color: "#6366f1" },
      { area: "Electronics", count: 62, color: "#8b5cf6" },
      { area: "Mechanical", count: 44, color: "#a855f7" },
      { area: "Civil", count: 32, color: "#d946ef" },
      { area: "Information Technology", count: 58, color: "#ec4899" },
      { area: "AI & Data Science", count: 42, color: "#f43f5e" },
    ],
    domainParticipation: [
      { domain: "Web Development", participants: 96, wins: 3, winRate: 3.1 },
      { domain: "Machine Learning", participants: 82, wins: 4, winRate: 4.8 },
      { domain: "IoT", participants: 48, wins: 2, winRate: 4.1 },
      { domain: "Blockchain", participants: 24, wins: 1, winRate: 4.2 },
      { domain: "Mobile Apps", participants: 56, wins: 2, winRate: 3.6 },
      { domain: "Cybersecurity", participants: 50, wins: 2, winRate: 4.0 },
    ],
    trendTitle: "Weekly Participation Trend (This Month)",
    participationTrend: [
      { period: "Week 1", events: 1, participants: 74 },
      { period: "Week 2", events: 1, participants: 92 },
      { period: "Week 3", events: 1, participants: 118 },
      { period: "Week 4", events: 1, participants: 72 },
    ],
    eventTypes: [
      { type: "Hackathon", count: 2, percentage: 50, participants: 184 },
      { type: "Workshop", count: 1, percentage: 25, participants: 92 },
      { type: "Competition", count: 1, percentage: 25, participants: 80 },
    ],
    yearWiseParticipation: [
      { year: "1st Year", count: 58, percentage: 16 },
      { year: "2nd Year", count: 98, percentage: 28 },
      { year: "3rd Year", count: 132, percentage: 37 },
      { year: "4th Year", count: 68, percentage: 19 },
    ],
    quickInsights: [
      { label: "Completion Rate", value: 84, color: "#22c55e" },
      { label: "Team Formation", value: 74, color: "#3b82f6" },
      { label: "Mentor Approval", value: 94, color: "#8b5cf6" },
      { label: "External Collab", value: 52, color: "#f59e0b" },
    ],
    insightsList: [
      {
        icon: "lucide:trending-up",
        color: "#22c55e",
        text: "Monthly registrations surged by 18% over the previous month",
      },
      {
        icon: "lucide:award",
        color: "#f59e0b",
        text: "Inter-college Hackathon was the largest engagement driver",
      },
      {
        icon: "lucide:star",
        color: "#6366f1",
        text: "Computer Science & AIDS contributed 45% of registered teams",
      },
    ],
  },
  year: {
    overview: {
      totalEvents: 24,
      totalParticipants: 1856,
      avgTeamSize: 3.2,
      successRate: 87,
      totalColleges: 45,
      activeStudents: 1234,
    },
    areaDistribution: [
      { area: "Computer Science", count: 542, color: "#6366f1" },
      { area: "Electronics", count: 328, color: "#8b5cf6" },
      { area: "Mechanical", count: 245, color: "#a855f7" },
      { area: "Civil", count: 189, color: "#d946ef" },
      { area: "Information Technology", count: 312, color: "#ec4899" },
      { area: "AI & Data Science", count: 240, color: "#f43f5e" },
    ],
    domainParticipation: [
      { domain: "Web Development", participants: 425, wins: 12, winRate: 2.8 },
      { domain: "Machine Learning", participants: 380, wins: 15, winRate: 3.9 },
      { domain: "IoT", participants: 290, wins: 8, winRate: 2.8 },
      { domain: "Blockchain", participants: 185, wins: 5, winRate: 2.7 },
      { domain: "Mobile Apps", participants: 310, wins: 10, winRate: 3.2 },
      { domain: "Cybersecurity", participants: 266, wins: 7, winRate: 2.6 },
    ],
    trendTitle: "Monthly Participation Trend (Full Year)",
    participationTrend: [
      { period: "Jan", events: 2, participants: 145 },
      { period: "Feb", events: 3, participants: 198 },
      { period: "Mar", events: 4, participants: 312 },
      { period: "Apr", events: 2, participants: 156 },
      { period: "May", events: 1, participants: 89 },
      { period: "Jun", events: 3, participants: 245 },
      { period: "Jul", events: 2, participants: 167 },
      { period: "Aug", events: 2, participants: 189 },
      { period: "Sep", events: 3, participants: 278 },
      { period: "Oct", events: 4, participants: 356 },
      { period: "Nov", events: 5, participants: 421 },
      { period: "Dec", events: 3, participants: 287 },
    ],
    eventTypes: [
      { type: "Hackathon", count: 8, percentage: 33, participants: 456 },
      { type: "Workshop", count: 6, percentage: 25, participants: 324 },
      { type: "Competition", count: 5, percentage: 21, participants: 289 },
      { type: "Seminar", count: 3, percentage: 13, participants: 178 },
      { type: "Bootcamp", count: 2, percentage: 8, participants: 134 },
    ],
    yearWiseParticipation: [
      { year: "1st Year", count: 312, percentage: 17 },
      { year: "2nd Year", count: 524, percentage: 28 },
      { year: "3rd Year", count: 645, percentage: 35 },
      { year: "4th Year", count: 375, percentage: 20 },
    ],
    quickInsights: [
      { label: "Completion Rate", value: 78, color: "#22c55e" },
      { label: "Team Formation", value: 65, color: "#3b82f6" },
      { label: "Mentor Approval", value: 92, color: "#8b5cf6" },
      { label: "External Collab", value: 45, color: "#f59e0b" },
    ],
    insightsList: [
      {
        icon: "lucide:trending-up",
        color: "#22c55e",
        text: "Hackathon participation increased by 23% this academic year",
      },
      {
        icon: "lucide:alert-circle",
        color: "#f59e0b",
        text: "Workshop attendance showed steady quarterly growth",
      },
      {
        icon: "lucide:star",
        color: "#6366f1",
        text: "ML/AI domain shows highest engagement across all colleges",
      },
    ],
  },
};

// Donut Progress Component (keeping this one for quick insights)
const DonutProgress = ({ percentage, label, color }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ textAlign: "center" }}>
      <svg viewBox="0 0 100 100" style={{ width: "80px", height: "80px" }}>
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="54"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="var(--foreground)"
        >
          {percentage}%
        </text>
      </svg>
      <div
        style={{
          fontSize: "12px",
          color: "var(--muted-foreground)",
          marginTop: "4px",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default function AdminEventAnalytics() {
  const [timeRange, setTimeRange] = useState("year");
  const [selectedCollege, setSelectedCollege] = useState(null);

  const currentData =
    ANALYTICS_DATA_BY_RANGE[timeRange] || ANALYTICS_DATA_BY_RANGE.year;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconWrapper}>
            <Icon icon="lucide:bar-chart-3" style={{ fontSize: "24px" }} />
          </div>
          <div>
            <h1 style={styles.title}>Event Analytics</h1>
            <p style={styles.subtitle}>
              Comprehensive insights on events and participation • Showing{" "}
              <strong style={{ color: "var(--foreground)" }}>
                {timeRange === "week"
                  ? "Past 7 Days"
                  : timeRange === "month"
                    ? "Past 30 Days"
                    : "Full Year"}
              </strong>
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={styles.timeSelector}>
            {["week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  ...styles.timeBtn,
                  ...(timeRange === range ? styles.timeBtnActive : {}),
                }}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div
        style={{ ...styles.statsGrid, gridTemplateColumns: "repeat(6, 1fr)" }}
      >
        {[
          {
            label: "Total Events",
            value: currentData.overview.totalEvents,
            icon: "lucide:calendar",
            color: "#3b82f6",
            bg: "#eff6ff",
          },
          {
            label: "Participants",
            value: currentData.overview.totalParticipants.toLocaleString(),
            icon: "lucide:users",
            color: "#22c55e",
            bg: "#f0fdf4",
          },
          {
            label: "Avg Team Size",
            value: currentData.overview.avgTeamSize,
            icon: "lucide:users-2",
            color: "#f59e0b",
            bg: "#fef3c7",
          },
          {
            label: "Success Rate",
            value: `${currentData.overview.successRate}%`,
            icon: "lucide:trophy",
            color: "#ec4899",
            bg: "#fce7f3",
          },
          {
            label: "Total Colleges",
            value: currentData.overview.totalColleges,
            icon: "lucide:building-2",
            color: "#6366f1",
            bg: "#eef2ff",
          },
          {
            label: "Active Students",
            value: currentData.overview.activeStudents.toLocaleString(),
            icon: "lucide:user-check",
            color: "#14b8a6",
            bg: "#f0fdfa",
          },
        ].map((stat, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: stat.bg }}>
              <Icon
                icon={stat.icon}
                style={{ fontSize: "22px", color: stat.color }}
              />
            </div>
            <div style={styles.statInfo}>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overview Content */}
      <div style={styles.chartsRow}>
        {/* Student Area Distribution - Pie Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            <Icon
              icon="lucide:pie-chart"
              style={{ marginRight: "8px", color: "#6366f1" }}
            />
            Student Area Distribution
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ width: "220px", height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData.areaDistribution.map((item) => ({
                      ...item,
                      name: item.area,
                      value: item.count,
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {currentData.areaDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.legendList}>
              {currentData.areaDistribution.map((item, index) => (
                <div key={index} style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendDot,
                      backgroundColor: item.color,
                    }}
                  ></span>
                  <span style={styles.legendText}>{item.area}</span>
                  <span style={styles.legendValue}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Domain Participation - Bar Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            <Icon
              icon="lucide:layers"
              style={{ marginRight: "8px", color: "#8b5cf6" }}
            />
            Domain Participation
          </h3>
          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentData.domainParticipation}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  dataKey="domain"
                  type="category"
                  width={90}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="participants"
                  name="Participants"
                  radius={[0, 6, 6, 0]}
                >
                  {currentData.domainParticipation.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={styles.chartsRow}>
        {/* Participation Trend - Area Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            <Icon
              icon="lucide:trending-up"
              style={{ marginRight: "8px", color: "#22c55e" }}
            />
            {currentData.trendTitle}
          </h3>
          <div style={{ height: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData.participationTrend}>
                <defs>
                  <linearGradient
                    id="colorParticipants"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="participants"
                  name="Participants"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorParticipants)"
                />
                <Area
                  type="monotone"
                  dataKey="events"
                  name="Events"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEvents)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Type Distribution - Pie Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            <Icon
              icon="lucide:inbox"
              style={{ marginRight: "8px", color: "#f59e0b" }}
            />
            Event Type Distribution
          </h3>
          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData.eventTypes.map((item) => ({
                    ...item,
                    name: item.type,
                    value: item.count,
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {currentData.eventTypes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={styles.chartsRow}>
        {/* Year Wise Participation */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            <Icon
              icon="lucide:graduation-cap"
              style={{ marginRight: "8px", color: "#ec4899" }}
            />
            Year Wise Participation
          </h3>
          <div style={{ height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.yearWiseParticipation}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                  {currentData.yearWiseParticipation.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain Performance */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            <Icon
              icon="lucide:bar-chart-3"
              style={{ marginRight: "8px", color: "#6366f1" }}
            />
            Domain Performance Analysis
          </h3>
          <div style={{ height: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.domainParticipation}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="domain"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend />
                <Bar
                  dataKey="participants"
                  name="Participants"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="wins"
                  name="Wins"
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={styles.chartsRow}>
        {/* Domain Win Rates */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            <Icon
              icon="lucide:trophy"
              style={{ marginRight: "8px", color: "#f59e0b" }}
            />
            Domain Win Rates
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              paddingTop: "10px",
            }}
          >
            {currentData.domainParticipation.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                  }}
                >
                  {item.domain}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "20px",
                    background: "var(--muted)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, item.winRate * 10)}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}, ${CHART_COLORS[(i + 1) % CHART_COLORS.length]})`,
                      borderRadius: "6px",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                    }}
                  >
                    {item.winRate}%
                  </div>
                </div>
                <div
                  style={{
                    width: "50px",
                    textAlign: "right",
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {item.wins} wins
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div style={styles.insightsCard}>
          <h3 style={styles.chartTitle}>
            <Icon
              icon="lucide:lightbulb"
              style={{ marginRight: "8px", color: "#f59e0b" }}
            />
            Quick Insights
          </h3>
          <div style={styles.insightsGrid}>
            {currentData.quickInsights.map((item, i) => (
              <DonutProgress
                key={i}
                percentage={item.value}
                label={item.label}
                color={item.color}
              />
            ))}
          </div>
          <div style={styles.insightsList}>
            {currentData.insightsList.map((item, i) => (
              <div key={i} style={styles.insightItem}>
                <Icon icon={item.icon} style={{ color: item.color }} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    backgroundColor: "var(--background)",
    minHeight: "calc(100vh - 60px)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  iconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--foreground)",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--muted-foreground)",
    margin: "4px 0 0 0",
  },
  timeSelector: {
    display: "flex",
    gap: "8px",
    backgroundColor: "var(--card)",
    padding: "4px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
  },
  timeBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "transparent",
    color: "var(--muted-foreground)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  timeBtnActive: {
    backgroundColor: "#6366f1",
    color: "white",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "24px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    backgroundColor: "var(--card)",
    borderRadius: "14px",
    border: "1px solid var(--border)",
  },
  statIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--foreground)",
  },
  statLabel: {
    fontSize: "13px",
    color: "var(--muted-foreground)",
    marginTop: "2px",
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "24px",
  },
  chartCard: {
    backgroundColor: "var(--card)",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    padding: "24px",
  },
  chartTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--foreground)",
    margin: "0 0 20px 0",
  },
  pieContainer: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },
  legendList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  legendText: {
    fontSize: "12px",
    color: "var(--foreground)",
    flex: 1,
  },
  legendValue: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--foreground)",
  },
  barContainer: {
    padding: "10px 0",
  },
  fullWidthCard: {
    backgroundColor: "var(--card)",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    padding: "24px",
    marginBottom: "24px",
  },
  eventTypeList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  eventTypeItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  eventTypeInfo: {
    minWidth: "120px",
  },
  eventTypeName: {
    fontSize: "13px",
    fontWeight: "500",
    color: "var(--foreground)",
    display: "block",
  },
  eventTypeCount: {
    fontSize: "11px",
    color: "var(--muted-foreground)",
  },
  progressBarOuter: {
    flex: 1,
    height: "8px",
    backgroundColor: "var(--border)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    borderRadius: "4px",
  },
  eventTypePercentage: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--foreground)",
    minWidth: "40px",
    textAlign: "right",
  },
  collegeList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  collegeItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px",
    backgroundColor: "var(--background)",
    borderRadius: "10px",
  },
  collegeRank: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    backgroundColor: "#6366f1",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "600",
  },
  collegeInfo: {
    flex: 1,
  },
  collegeName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "var(--foreground)",
  },
  collegeStats: {
    fontSize: "11px",
    color: "var(--muted-foreground)",
    marginTop: "2px",
  },
  insightsCard: {
    backgroundColor: "var(--card)",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    padding: "24px",
  },
  insightsGrid: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "24px",
  },
  insightsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    borderTop: "1px solid var(--border)",
    paddingTop: "20px",
  },
  insightItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "13px",
    color: "var(--foreground)",
  },
};
