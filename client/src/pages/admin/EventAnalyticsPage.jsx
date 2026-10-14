import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { jsPDF } from "jspdf";
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
} from "recharts";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

/* ===== SAMPLE DATA ===== */
const SAMPLE_EVENTS = [
  {
    id: "evt-001",
    title: "Hackathon 2026",
    type: "Hackathon",
    domain: "AI/ML",
    status: "ongoing",
    totalParticipants: 156,
    description:
      "48-hour coding competition to build innovative AI solutions for campus problems. Teams will work on real-world challenges provided by industry partners.",
    startDate: "2026-03-15",
    endDate: "2026-03-17",
    venue: "Main Auditorium, Block A",
    organizer: "Department of CSE",
    prizes: [
      { position: "1st", amount: "25000" },
      { position: "2nd", amount: "15000" },
      { position: "3rd", amount: "10000" },
    ],
    registeredTeams: 45,
    judges: ["Dr. Ramesh Kumar", "Prof. Anita Sharma", "Mr. Vikram Singh"],
  },
  {
    id: "evt-002",
    title: "AI Workshop Series",
    type: "Workshop",
    domain: "AI/ML",
    status: "upcoming",
    totalParticipants: 67,
    description:
      "3-day intensive workshop covering Machine Learning fundamentals, Deep Learning with TensorFlow, and practical applications in computer vision.",
    startDate: "2026-03-20",
    endDate: "2026-03-22",
    venue: "Seminar Hall B, Research Block",
    organizer: "AI Research Lab",
    prizes: [],
    registeredTeams: 67,
    judges: [],
  },
  {
    id: "evt-003",
    title: "Web Dev Championship",
    type: "Competition",
    domain: "Web Development",
    status: "completed",
    totalParticipants: 72,
    description:
      "Annual web development competition where participants build responsive web applications within 24 hours based on given themes.",
    startDate: "2026-02-28",
    endDate: "2026-03-01",
    venue: "Computer Lab 1 & 2",
    organizer: "Web Development Club",
    prizes: [
      { position: "1st", amount: "15000" },
      { position: "2nd", amount: "10000" },
      { position: "3rd", amount: "5000" },
    ],
    registeredTeams: 38,
    judges: ["Dr. Suresh Patel", "Ms. Priya Krishnan"],
    winners: [
      {
        position: "1st",
        teamName: "Code Crusaders",
        projectTitle: "EcoTrack - Sustainability Dashboard",
      },
      {
        position: "2nd",
        teamName: "Pixel Perfect",
        projectTitle: "MindSpace - Mental Health Platform",
      },
      {
        position: "3rd",
        teamName: "Binary Blazers",
        projectTitle: "StudyBuddy - Collaborative Learning",
      },
    ],
  },
  {
    id: "evt-004",
    title: "IoT Innovation Challenge",
    type: "Hackathon",
    domain: "IoT",
    status: "upcoming",
    totalParticipants: 48,
    description:
      "Design and build IoT solutions for smart campus initiatives. Hardware kits will be provided to all participating teams.",
    startDate: "2026-04-05",
    endDate: "2026-04-07",
    venue: "Innovation Lab, Tech Park",
    organizer: "ECE Department & Innovation Cell",
    prizes: [
      { position: "1st", amount: "30000" },
      { position: "2nd", amount: "20000" },
      { position: "3rd", amount: "10000" },
    ],
    registeredTeams: 12,
    judges: ["Dr. Vijay Kumar", "Prof. Meera Rao", "Mr. Anil Tech"],
  },
];

const EVENT_ANALYTICS = {
  "evt-001": {
    registrationTrend: [
      { date: "Feb 15", count: 5 },
      { date: "Feb 18", count: 12 },
      { date: "Feb 20", count: 25 },
      { date: "Feb 22", count: 38 },
      { date: "Feb 25", count: 45 },
    ],
    departmentDistribution: [
      { dept: "CSE", count: 65 },
      { dept: "IT", count: 35 },
      { dept: "ECE", count: 28 },
      { dept: "AIDS", count: 18 },
      { dept: "AIML", count: 10 },
    ],
    yearDistribution: [
      { year: "2nd Year", count: 45 },
      { year: "3rd Year", count: 72 },
      { year: "4th Year", count: 39 },
    ],
    domainDistribution: [
      { domain: "AI/ML", count: 42, percentage: 28 },
      { domain: "Web Development", count: 35, percentage: 23 },
      { domain: "IoT", count: 28, percentage: 19 },
      { domain: "Mobile Apps", count: 25, percentage: 17 },
      { domain: "Blockchain", count: 20, percentage: 13 },
    ],
    geographicData: [
      {
        city: "Chennai",
        state: "Tamil Nadu",
        lat: 13.0827,
        lng: 80.2707,
        teams: 18,
        participants: 62,
      },
      {
        city: "Bangalore",
        state: "Karnataka",
        lat: 12.9716,
        lng: 77.5946,
        teams: 12,
        participants: 41,
      },
      {
        city: "Hyderabad",
        state: "Telangana",
        lat: 17.385,
        lng: 78.4867,
        teams: 8,
        participants: 28,
      },
      {
        city: "Mumbai",
        state: "Maharashtra",
        lat: 19.076,
        lng: 72.8777,
        teams: 5,
        participants: 17,
      },
      {
        city: "Delhi",
        state: "Delhi",
        lat: 28.7041,
        lng: 77.1025,
        teams: 4,
        participants: 14,
      },
      {
        city: "Coimbatore",
        state: "Tamil Nadu",
        lat: 11.0168,
        lng: 76.9558,
        teams: 6,
        participants: 22,
      },
    ],
    collegeDistribution: [
      { college: "Sathyabama Institute", location: "Chennai", teams: 15 },
      { college: "VIT Chennai", location: "Chennai", teams: 8 },
      { college: "SRM University", location: "Chennai", teams: 7 },
      { college: "RVCE", location: "Bangalore", teams: 6 },
      { college: "BITS Pilani", location: "Hyderabad", teams: 5 },
    ],
    approvalStats: { approved: 38, pending: 5, rejected: 2 },
    pageViews: 1245,
    uniqueVisitors: 856,
    avgTimeOnPage: "3m 24s",
    domainWinRates: [
      { domain: "AI/ML", participated: 42, wins: 8, winRate: 19.0 },
      { domain: "Web Development", participated: 35, wins: 5, winRate: 14.3 },
      { domain: "IoT", participated: 28, wins: 4, winRate: 14.3 },
      { domain: "Mobile Apps", participated: 25, wins: 3, winRate: 12.0 },
      { domain: "Blockchain", participated: 20, wins: 2, winRate: 10.0 },
    ],
    engagementMetrics: [
      { day: "Mon", visits: 120, registrations: 8 },
      { day: "Tue", visits: 180, registrations: 12 },
      { day: "Wed", visits: 250, registrations: 18 },
      { day: "Thu", visits: 310, registrations: 22 },
      { day: "Fri", visits: 420, registrations: 35 },
      { day: "Sat", visits: 380, registrations: 28 },
      { day: "Sun", visits: 290, registrations: 15 },
    ],
  },
  "evt-002": {
    registrationTrend: [
      { date: "Feb 20", count: 10 },
      { date: "Feb 22", count: 25 },
      { date: "Feb 24", count: 45 },
      { date: "Feb 26", count: 67 },
    ],
    departmentDistribution: [
      { dept: "CSE", count: 40 },
      { dept: "IT", count: 15 },
      { dept: "ECE", count: 8 },
      { dept: "MECH", count: 4 },
    ],
    yearDistribution: [
      { year: "1st Year", count: 20 },
      { year: "2nd Year", count: 30 },
      { year: "3rd Year", count: 12 },
      { year: "4th Year", count: 5 },
    ],
    domainDistribution: [{ domain: "AI/ML", count: 67, percentage: 100 }],
    geographicData: [
      {
        city: "Chennai",
        state: "Tamil Nadu",
        lat: 13.0827,
        lng: 80.2707,
        teams: 45,
        participants: 45,
      },
      {
        city: "Vellore",
        state: "Tamil Nadu",
        lat: 12.9165,
        lng: 79.1325,
        teams: 12,
        participants: 12,
      },
      {
        city: "Trichy",
        state: "Tamil Nadu",
        lat: 10.7905,
        lng: 78.7047,
        teams: 10,
        participants: 10,
      },
    ],
    collegeDistribution: [
      { college: "Sathyabama Institute", location: "Chennai", teams: 45 },
      { college: "VIT Vellore", location: "Vellore", teams: 12 },
      { college: "NIT Trichy", location: "Trichy", teams: 10 },
    ],
    approvalStats: { approved: 67, pending: 0, rejected: 0 },
    pageViews: 890,
    uniqueVisitors: 654,
    avgTimeOnPage: "2m 45s",
    domainWinRates: [
      { domain: "AI/ML", participated: 67, wins: 12, winRate: 17.9 },
    ],
    engagementMetrics: [
      { day: "Mon", visits: 80, registrations: 10 },
      { day: "Tue", visits: 120, registrations: 15 },
      { day: "Wed", visits: 180, registrations: 22 },
      { day: "Thu", visits: 220, registrations: 12 },
      { day: "Fri", visits: 150, registrations: 8 },
      { day: "Sat", visits: 90, registrations: 0 },
      { day: "Sun", visits: 50, registrations: 0 },
    ],
  },
  "evt-003": {
    registrationTrend: [
      { date: "Feb 10", count: 8 },
      { date: "Feb 15", count: 20 },
      { date: "Feb 20", count: 32 },
      { date: "Feb 25", count: 38 },
    ],
    departmentDistribution: [
      { dept: "CSE", count: 50 },
      { dept: "IT", count: 18 },
      { dept: "AIDS", count: 4 },
    ],
    yearDistribution: [
      { year: "2nd Year", count: 15 },
      { year: "3rd Year", count: 40 },
      { year: "4th Year", count: 17 },
    ],
    domainDistribution: [
      { domain: "Web Development", count: 72, percentage: 100 },
    ],
    geographicData: [
      {
        city: "Chennai",
        state: "Tamil Nadu",
        lat: 13.0827,
        lng: 80.2707,
        teams: 38,
        participants: 72,
      },
    ],
    collegeDistribution: [
      { college: "Sathyabama Institute", location: "Chennai", teams: 38 },
    ],
    approvalStats: { approved: 36, pending: 2, rejected: 0 },
    pageViews: 567,
    uniqueVisitors: 423,
    avgTimeOnPage: "4m 12s",
    domainWinRates: [
      { domain: "Web Development", participated: 72, wins: 15, winRate: 20.8 },
    ],
    engagementMetrics: [
      { day: "Mon", visits: 45, registrations: 5 },
      { day: "Tue", visits: 78, registrations: 8 },
      { day: "Wed", visits: 120, registrations: 12 },
      { day: "Thu", visits: 145, registrations: 7 },
      { day: "Fri", visits: 95, registrations: 6 },
      { day: "Sat", visits: 54, registrations: 0 },
      { day: "Sun", visits: 30, registrations: 0 },
    ],
  },
  "evt-004": {
    registrationTrend: [
      { date: "Feb 15", count: 3 },
      { date: "Feb 20", count: 7 },
      { date: "Feb 25", count: 12 },
    ],
    departmentDistribution: [
      { dept: "ECE", count: 25 },
      { dept: "CSE", count: 15 },
      { dept: "EEE", count: 8 },
    ],
    yearDistribution: [
      { year: "2nd Year", count: 12 },
      { year: "3rd Year", count: 24 },
      { year: "4th Year", count: 12 },
    ],
    domainDistribution: [
      { domain: "IoT", count: 35, percentage: 73 },
      { domain: "Embedded Systems", count: 13, percentage: 27 },
    ],
    geographicData: [
      {
        city: "Chennai",
        state: "Tamil Nadu",
        lat: 13.0827,
        lng: 80.2707,
        teams: 8,
        participants: 32,
      },
      {
        city: "Coimbatore",
        state: "Tamil Nadu",
        lat: 11.0168,
        lng: 76.9558,
        teams: 4,
        participants: 16,
      },
    ],
    collegeDistribution: [
      { college: "Sathyabama Institute", location: "Chennai", teams: 8 },
      { college: "PSG Tech", location: "Coimbatore", teams: 4 },
    ],
    approvalStats: { approved: 10, pending: 2, rejected: 0 },
    pageViews: 345,
    uniqueVisitors: 234,
    avgTimeOnPage: "3m 05s",
    domainWinRates: [
      { domain: "IoT", participated: 35, wins: 6, winRate: 17.1 },
      { domain: "Embedded Systems", participated: 13, wins: 2, winRate: 15.4 },
    ],
    engagementMetrics: [
      { day: "Mon", visits: 30, registrations: 3 },
      { day: "Tue", visits: 55, registrations: 4 },
      { day: "Wed", visits: 85, registrations: 3 },
      { day: "Thu", visits: 72, registrations: 2 },
      { day: "Fri", visits: 58, registrations: 0 },
      { day: "Sat", visits: 35, registrations: 0 },
      { day: "Sun", visits: 20, registrations: 0 },
    ],
  },
};

// Chart colors
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
const customTooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  padding: "14px 18px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  backdropFilter: "blur(10px)",
};

// Custom Tooltip Components
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={customTooltipStyle}>
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
              background: data.payload.fill || data.color,
            }}
          ></div>
          <span
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: "var(--foreground)",
            }}
          >
            {data.name}
          </span>
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: data.payload.fill || data.color,
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
      <div style={customTooltipStyle}>
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

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={customTooltipStyle}>
        <div
          style={{
            fontWeight: 600,
            fontSize: "14px",
            color: "var(--foreground)",
            marginBottom: "10px",
          }}
        >
          📅 {label}
        </div>
        {payload.map((entry, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
            }}
          >
            <span
              style={{ fontSize: "13px", color: "var(--muted-foreground)" }}
            >
              {entry.name}
            </span>
            <span
              style={{ fontSize: "18px", fontWeight: 700, color: entry.color }}
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
      <div style={customTooltipStyle}>
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

const CustomWinRateTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const participated =
      payload.find((p) => p.dataKey === "participated")?.value || 0;
    const wins = payload.find((p) => p.dataKey === "wins")?.value || 0;
    const winRate =
      participated > 0 ? ((wins / participated) * 100).toFixed(1) : 0;
    return (
      <div style={customTooltipStyle}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "15px",
            color: "var(--foreground)",
            marginBottom: "12px",
          }}
        >
          🏆 {label}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <div
            style={{
              padding: "10px",
              background: "rgba(99, 102, 241, 0.1)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "20px", fontWeight: 700, color: "#6366f1" }}
            >
              {participated}
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
              Participated
            </div>
          </div>
          <div
            style={{
              padding: "10px",
              background: "rgba(34, 197, 94, 0.1)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "20px", fontWeight: 700, color: "#22c55e" }}
            >
              {wins}
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
              Wins
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "12px",
            padding: "10px",
            background: "var(--muted)",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "var(--muted-foreground)",
              marginBottom: "4px",
            }}
          >
            Win Rate
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: winRate >= 15 ? "#22c55e" : "#f59e0b",
            }}
          >
            {winRate}%
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/* ===== STYLES ===== */
const pageContainer = {
  padding: "24px",
  maxWidth: "1400px",
  margin: "0 auto",
};

const kpiCard = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: "20px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
};

const kpiLabel = {
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--muted-foreground)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const kpiValue = {
  fontSize: "28px",
  fontWeight: 600,
  color: "var(--foreground)",
  letterSpacing: "-0.5px",
};

const card = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
};

const cardHeaderRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const cardTitle = {
  fontSize: "15px",
  fontWeight: 600,
  margin: 0,
};

export default function EventAnalyticsPage() {
  const navigate = useNavigate();
  const [events] = useState(SAMPLE_EVENTS);
  const [selectedEventForAnalytics, setSelectedEventForAnalytics] = useState(
    SAMPLE_EVENTS[0]?.id || null,
  );
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [yearFilter, setYearFilter] = useState([]);
  const [domainFilter, setDomainFilter] = useState([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [activeTab, setActiveTab] = useState("overview"); // overview, engagement, geographic, winrates

  // Toggle array filter helper
  const toggleArrayFilter = (arr, setArr, value) => {
    if (arr.includes(value)) {
      setArr(arr.filter((v) => v !== value));
    } else {
      setArr([...arr, value]);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setDepartmentFilter([]);
    setYearFilter([]);
    setDomainFilter([]);
    setDateRange({ from: "", to: "" });
  };

  // Active filter count
  const activeFilterCount = [
    departmentFilter.length,
    yearFilter.length,
    domainFilter.length,
    dateRange.from || dateRange.to ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Initialize Mapbox map
  useEffect(() => {
    if (!selectedEventForAnalytics || !mapContainerRef.current) return;

    const analytics = EVENT_ANALYTICS[selectedEventForAnalytics];
    if (!analytics?.geographicData?.length) return;

    // Clean up previous map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    markersRef.current = [];

    // Calculate center from data
    const avgLat =
      analytics.geographicData.reduce((sum, loc) => sum + loc.lat, 0) /
      analytics.geographicData.length;
    const avgLng =
      analytics.geographicData.reduce((sum, loc) => sum + loc.lng, 0) /
      analytics.geographicData.length;

    // Initialize map with satellite view
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [avgLng, avgLat],
      zoom: 5,
      pitch: 45,
      bearing: 0,
    });

    // Add navigation controls
    map.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right",
    );

    // Add fullscreen control
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");

    // Add scale control
    map.addControl(new mapboxgl.ScaleControl(), "bottom-left");

    // Add geolocate control
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right",
    );

    mapRef.current = map;

    // Add markers when map loads
    map.on("load", () => {
      analytics.geographicData.forEach((loc) => {
        const size = Math.min(60, Math.max(30, loc.participants / 2));

        // Create custom marker element
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: 3px solid rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: ${Math.max(12, size / 3)}px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.5);
          transition: transform 0.2s, box-shadow 0.2s;
        `;
        el.innerHTML = loc.teams;

        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.2)";
          el.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.7)";
        });

        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
          el.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.5)";
        });

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          className: "custom-popup",
        }).setHTML(`
          <div style="padding: 12px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #1a1a2e;">${loc.city}</h3>
            <p style="margin: 0 0 12px 0; font-size: 12px; color: #666;">${loc.state}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="padding: 8px; background: #f0f9ff; border-radius: 8px; text-align: center;">
                <div style="font-size: 18px; font-weight: 700; color: #6366f1;">${loc.teams}</div>
                <div style="font-size: 10px; color: #666;">Teams</div>
              </div>
              <div style="padding: 8px; background: #f0fdf4; border-radius: 8px; text-align: center;">
                <div style="font-size: 18px; font-weight: 700; color: #22c55e;">${loc.participants}</div>
                <div style="font-size: 10px; color: #666;">Participants</div>
              </div>
            </div>
          </div>
        `);

        // Create marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([loc.lng, loc.lat])
          .setPopup(popup)
          .addTo(map);

        // Click handler to show details in sidebar
        el.addEventListener("click", () => {
          setSelectedLocation(loc);
          map.flyTo({
            center: [loc.lng, loc.lat],
            zoom: 10,
            pitch: 60,
            duration: 1500,
          });
        });

        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers
      if (analytics.geographicData.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        analytics.geographicData.forEach((loc) =>
          bounds.extend([loc.lng, loc.lat]),
        );
        map.fitBounds(bounds, { padding: 50, maxZoom: 8 });
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [selectedEventForAnalytics]);

  // Download Report Function - PDF Format (Black & White, Data-Focused)
  const downloadReport = () => {
    if (!selectedEventForAnalytics) return;

    const event = events.find((e) => e.id === selectedEventForAnalytics);
    const analytics = EVENT_ANALYTICS[selectedEventForAnalytics];
    if (!event || !analytics) return;

    // Create PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPos = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace = 15) => {
      if (yPos + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Helper function to draw section header (black & white)
    const drawSectionHeader = (title) => {
      checkPageBreak(18);
      doc.setFillColor(0, 0, 0);
      doc.rect(margin, yPos, contentWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin + 3, yPos + 5.5);
      doc.setTextColor(0, 0, 0);
      yPos += 12;
    };

    // Helper function to draw table
    const drawTable = (headers, data, colWidths) => {
      const rowHeight = 7;
      const tableWidth = colWidths.reduce((a, b) => a + b, 0);

      // Header row
      checkPageBreak(rowHeight + 5);
      doc.setFillColor(220, 220, 220);
      doc.rect(margin, yPos, tableWidth, rowHeight, "F");
      doc.setDrawColor(0, 0, 0);
      doc.rect(margin, yPos, tableWidth, rowHeight, "S");

      let xPos = margin;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      headers.forEach((header, i) => {
        doc.text(header, xPos + 2, yPos + 5);
        if (i < headers.length - 1) {
          doc.line(
            xPos + colWidths[i],
            yPos,
            xPos + colWidths[i],
            yPos + rowHeight,
          );
        }
        xPos += colWidths[i];
      });
      yPos += rowHeight;

      // Data rows
      doc.setFont("helvetica", "normal");
      data.forEach((row, rowIndex) => {
        checkPageBreak(rowHeight);
        doc.setFillColor(
          rowIndex % 2 === 0 ? 255 : 245,
          rowIndex % 2 === 0 ? 255 : 245,
          rowIndex % 2 === 0 ? 255 : 245,
        );
        doc.rect(margin, yPos, tableWidth, rowHeight, "F");
        doc.rect(margin, yPos, tableWidth, rowHeight, "S");

        xPos = margin;
        row.forEach((cell, i) => {
          doc.text(String(cell), xPos + 2, yPos + 5);
          if (i < row.length - 1) {
            doc.line(
              xPos + colWidths[i],
              yPos,
              xPos + colWidths[i],
              yPos + rowHeight,
            );
          }
          xPos += colWidths[i];
        });
        yPos += rowHeight;
      });
      yPos += 5;
    };

    // Report Date
    const reportDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // ===== HEADER (Black & White) =====
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, 12, pageWidth - margin, 12);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("EVENT ANALYTICS REPORT", pageWidth / 2, 22, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Date: ${reportDate}`, pageWidth / 2, 30, {
      align: "center",
    });

    doc.line(margin, 35, pageWidth - margin, 35);
    yPos = 42;

    // ===== EVENT INFORMATION TABLE =====
    drawSectionHeader("EVENT INFORMATION");
    drawTable(
      ["Field", "Value"],
      [
        ["Event Title", event.title],
        ["Event Type", event.type],
        ["Domain", event.domain],
        ["Status", event.status.toUpperCase()],
        ["Venue", event.venue || "N/A"],
        ["Organizer", event.organizer || "N/A"],
        ["Start Date", event.startDate || "N/A"],
        ["End Date", event.endDate || "N/A"],
      ],
      [50, contentWidth - 50],
    );

    // ===== KEY METRICS TABLE =====
    drawSectionHeader("KEY METRICS");
    const conversionRate = analytics.uniqueVisitors
      ? ((event.totalParticipants / analytics.uniqueVisitors) * 100).toFixed(1)
      : 0;
    drawTable(
      ["Metric", "Value"],
      [
        ["Total Participants", event.totalParticipants],
        ["Registered Teams", event.registeredTeams || "N/A"],
        ["Page Views", analytics.pageViews?.toLocaleString() || 0],
        ["Unique Visitors", analytics.uniqueVisitors?.toLocaleString() || 0],
        ["Average Session Duration", analytics.avgTimeOnPage || "N/A"],
        ["Conversion Rate", `${conversionRate}%`],
        ["Approved Registrations", analytics.approvalStats?.approved || 0],
        ["Pending Registrations", analytics.approvalStats?.pending || 0],
        ["Rejected Registrations", analytics.approvalStats?.rejected || 0],
      ],
      [70, contentWidth - 70],
    );

    // ===== DEPARTMENT DISTRIBUTION =====
    if (analytics.departmentDistribution?.length > 0) {
      drawSectionHeader("DEPARTMENT-WISE DISTRIBUTION");
      const totalDeptParticipants = analytics.departmentDistribution.reduce(
        (sum, d) => sum + d.count,
        0,
      );
      drawTable(
        ["Sl.No", "Department", "Participants", "Percentage"],
        analytics.departmentDistribution.map((d, i) => [
          i + 1,
          d.dept,
          d.count,
          `${((d.count / totalDeptParticipants) * 100).toFixed(1)}%`,
        ]),
        [15, 50, 50, 45],
      );
    }

    // ===== YEAR DISTRIBUTION =====
    if (analytics.yearDistribution?.length > 0) {
      drawSectionHeader("YEAR-WISE DISTRIBUTION");
      const totalYearParticipants = analytics.yearDistribution.reduce(
        (sum, y) => sum + y.count,
        0,
      );
      drawTable(
        ["Sl.No", "Year", "Participants", "Percentage"],
        analytics.yearDistribution.map((y, i) => [
          i + 1,
          y.year,
          y.count,
          `${((y.count / totalYearParticipants) * 100).toFixed(1)}%`,
        ]),
        [15, 50, 50, 45],
      );
    }

    // ===== DOMAIN DISTRIBUTION =====
    if (analytics.domainDistribution?.length > 0) {
      drawSectionHeader("DOMAIN DISTRIBUTION");
      drawTable(
        ["Sl.No", "Domain", "Count", "Percentage"],
        analytics.domainDistribution.map((d, i) => [
          i + 1,
          d.domain,
          d.count,
          `${d.percentage}%`,
        ]),
        [15, 65, 40, 40],
      );
    }

    // ===== GEOGRAPHIC DISTRIBUTION =====
    if (analytics.geographicData?.length > 0) {
      drawSectionHeader("GEOGRAPHIC DISTRIBUTION");
      const totalGeoParticipants = analytics.geographicData.reduce(
        (sum, loc) => sum + loc.participants,
        0,
      );
      drawTable(
        ["Sl.No", "City", "State", "Teams", "Participants", "%"],
        analytics.geographicData.map((loc, i) => [
          i + 1,
          loc.city,
          loc.state,
          loc.teams,
          loc.participants,
          `${((loc.participants / totalGeoParticipants) * 100).toFixed(1)}%`,
        ]),
        [12, 35, 40, 25, 35, 18],
      );
    }

    // ===== COLLEGE DISTRIBUTION =====
    if (analytics.collegeDistribution?.length > 0) {
      drawSectionHeader("COLLEGE-WISE DISTRIBUTION");
      const totalCollegeTeams = analytics.collegeDistribution.reduce(
        (sum, c) => sum + c.teams,
        0,
      );
      drawTable(
        ["Sl.No", "College Name", "Location", "Teams", "%"],
        analytics.collegeDistribution.map((c, i) => [
          i + 1,
          c.college,
          c.location,
          c.teams,
          `${((c.teams / totalCollegeTeams) * 100).toFixed(1)}%`,
        ]),
        [12, 70, 35, 25, 18],
      );
    }

    // ===== REGISTRATION TREND =====
    if (analytics.registrationTrend?.length > 0) {
      drawSectionHeader("REGISTRATION TREND");
      drawTable(
        ["Date", "Cumulative Registrations", "Growth"],
        analytics.registrationTrend.map((r, i, arr) => {
          const prevCount = i > 0 ? arr[i - 1].count : 0;
          const growth =
            prevCount > 0
              ? (((r.count - prevCount) / prevCount) * 100).toFixed(1)
              : "-";
          return [r.date, r.count, i > 0 ? `+${growth}%` : "-"];
        }),
        [50, 70, 50],
      );
    }

    // ===== PRIZES =====
    if (event.prizes?.length > 0) {
      drawSectionHeader("PRIZE DETAILS");
      const totalPrize = event.prizes.reduce(
        (sum, p) => sum + parseInt(p.amount || 0),
        0,
      );
      drawTable(
        ["Position", "Prize Amount (Rs.)", "Percentage of Pool"],
        event.prizes.map((p) => [
          p.position,
          parseInt(p.amount).toLocaleString(),
          `${((parseInt(p.amount) / totalPrize) * 100).toFixed(1)}%`,
        ]),
        [50, 60, 60],
      );

      // Total row
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        `Total Prize Pool: Rs. ${totalPrize.toLocaleString()}`,
        margin,
        yPos,
      );
      yPos += 8;
    }

    // ===== JUDGES =====
    if (event.judges?.length > 0) {
      drawSectionHeader("JUDGES PANEL");
      drawTable(
        ["Sl.No", "Judge Name"],
        event.judges.map((j, i) => [i + 1, j]),
        [20, contentWidth - 20],
      );
    }

    // ===== WINNERS =====
    if (event.winners?.length > 0) {
      drawSectionHeader("WINNERS");
      drawTable(
        ["Position", "Team Name", "Project Title"],
        event.winners.map((w) => [w.position, w.teamName, w.projectTitle]),
        [30, 50, 80],
      );
    }

    // ===== SUMMARY STATISTICS =====
    checkPageBreak(40);
    drawSectionHeader("SUMMARY");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const summaryData = [
      `Total Participation: ${event.totalParticipants} participants from ${analytics.geographicData?.length || 0} cities`,
      `Department Coverage: ${analytics.departmentDistribution?.length || 0} departments participated`,
      `Top Performing City: ${analytics.geographicData?.[0]?.city || "N/A"} (${analytics.geographicData?.[0]?.participants || 0} participants)`,
      `Top Department: ${analytics.departmentDistribution?.[0]?.dept || "N/A"} (${analytics.departmentDistribution?.[0]?.count || 0} participants)`,
      `Registration Approval Rate: ${analytics.approvalStats ? ((analytics.approvalStats.approved / (analytics.approvalStats.approved + analytics.approvalStats.pending + analytics.approvalStats.rejected)) * 100).toFixed(1) : 0}%`,
    ];

    summaryData.forEach((line) => {
      checkPageBreak(7);
      doc.text(`• ${line}`, margin, yPos);
      yPos += 6;
    });

    // ===== FOOTER =====
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 6, {
        align: "center",
      });
      doc.text("Campus Mitra", margin, pageHeight - 6);
      doc.text(reportDate, pageWidth - margin, pageHeight - 6, {
        align: "right",
      });
    }

    // Save PDF
    doc.save(
      `${event.title.replace(/\s+/g, "_")}_Analytics_Report_${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => navigate("/admin/my-events")}
          style={{
            padding: "10px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--foreground)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <iconify-icon
            icon="lucide:arrow-left"
            style={{ fontSize: "18px" }}
          ></iconify-icon>
        </button>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              margin: 0,
              color: "var(--foreground)",
            }}
          >
            Event Analytics
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--muted-foreground)",
              margin: "4px 0 0 0",
            }}
          >
            Detailed analytics and insights for your events
          </p>
        </div>
        {selectedEventForAnalytics && (
          <button
            onClick={downloadReport}
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "white",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)",
            }}
          >
            <iconify-icon
              icon="lucide:download"
              style={{ fontSize: "16px" }}
            ></iconify-icon>
            Download Report
          </button>
        )}
      </div>

      {/* Event Selector */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "250px", maxWidth: "400px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--foreground)",
                marginBottom: "8px",
              }}
            >
              Select Event
            </label>
            <select
              value={selectedEventForAnalytics || ""}
              onChange={(e) => setSelectedEventForAnalytics(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <option value="">Choose an event to view analytics</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} ({e.status})
                </option>
              ))}
            </select>
          </div>

          {selectedEventForAnalytics && (
            <>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 18px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: showFilters ? "var(--primary)" : "var(--card)",
                  color: showFilters ? "#fff" : "var(--foreground)",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <iconify-icon
                  icon="lucide:sliders-horizontal"
                  style={{ fontSize: "16px" }}
                ></iconify-icon>
                Filters
                {activeFilterCount > 0 && (
                  <span
                    style={{
                      background: showFilters ? "#fff" : "var(--primary)",
                      color: showFilters ? "var(--primary)" : "#fff",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "12px 18px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#ef4444",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <iconify-icon
                    icon="lucide:x"
                    style={{ fontSize: "14px" }}
                  ></iconify-icon>
                  Clear Filters
                </button>
              )}
            </>
          )}
        </div>

        {/* Expandable Filter Panel */}
        {showFilters &&
          selectedEventForAnalytics &&
          (() => {
            const analytics = EVENT_ANALYTICS[selectedEventForAnalytics];
            const departments =
              analytics?.departmentDistribution?.map((d) => d.dept) || [];
            const years = analytics?.yearDistribution?.map((y) => y.year) || [];
            const domains =
              analytics?.domainDistribution?.map((d) => d.domain) || [];

            return (
              <div
                style={{
                  marginTop: "16px",
                  padding: "20px",
                  background: "var(--muted)",
                  borderRadius: "var(--radius-lg)",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "20px",
                }}
              >
                {/* Department Filter */}
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--muted-foreground)",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Department
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {departments.map((d) => {
                      const isSelected = departmentFilter.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() =>
                            toggleArrayFilter(
                              departmentFilter,
                              setDepartmentFilter,
                              d,
                            )
                          }
                          style={{
                            padding: "6px 12px",
                            borderRadius: "var(--radius-md)",
                            border: isSelected
                              ? "none"
                              : "1px solid var(--border)",
                            background: isSelected
                              ? "var(--primary)"
                              : "var(--card)",
                            color: isSelected ? "#fff" : "var(--foreground)",
                            fontSize: "12px",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Year Filter */}
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--muted-foreground)",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Year
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {years.map((y) => {
                      const isSelected = yearFilter.includes(y);
                      return (
                        <button
                          key={y}
                          onClick={() =>
                            toggleArrayFilter(yearFilter, setYearFilter, y)
                          }
                          style={{
                            padding: "6px 12px",
                            borderRadius: "var(--radius-md)",
                            border: isSelected
                              ? "none"
                              : "1px solid var(--border)",
                            background: isSelected ? "#22c55e" : "var(--card)",
                            color: isSelected ? "#fff" : "var(--foreground)",
                            fontSize: "12px",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          {y}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Domain Filter */}
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--muted-foreground)",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Domain
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {domains.map((d) => {
                      const isSelected = domainFilter.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() =>
                            toggleArrayFilter(domainFilter, setDomainFilter, d)
                          }
                          style={{
                            padding: "6px 12px",
                            borderRadius: "var(--radius-md)",
                            border: isSelected
                              ? "none"
                              : "1px solid var(--border)",
                            background: isSelected ? "#8b5cf6" : "var(--card)",
                            color: isSelected ? "#fff" : "var(--foreground)",
                            fontSize: "12px",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--muted-foreground)",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Date Range
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, from: e.target.value })
                      }
                      style={{
                        padding: "6px 10px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        color: "var(--foreground)",
                        fontSize: "12px",
                        flex: 1,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      to
                    </span>
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, to: e.target.value })
                      }
                      style={{
                        padding: "6px 10px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        color: "var(--foreground)",
                        fontSize: "12px",
                        flex: 1,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })()}

        {/* Tab Navigation */}
        {selectedEventForAnalytics && (
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginTop: "20px",
              padding: "4px",
              background: "var(--muted)",
              borderRadius: "var(--radius-lg)",
              width: "fit-content",
            }}
          >
            {[
              {
                id: "overview",
                label: "Overview",
                icon: "lucide:layout-dashboard",
              },
              {
                id: "engagement",
                label: "Engagement",
                icon: "lucide:activity",
              },
              { id: "geographic", label: "Geographic", icon: "lucide:map" },
              { id: "winrates", label: "Win Rates", icon: "lucide:trophy" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background:
                    activeTab === tab.id ? "var(--card)" : "transparent",
                  color:
                    activeTab === tab.id
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                  fontSize: "13px",
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  cursor: "pointer",
                  boxShadow:
                    activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s",
                }}
              >
                <iconify-icon
                  icon={tab.icon}
                  style={{ fontSize: "16px" }}
                ></iconify-icon>
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedEventForAnalytics &&
        (() => {
          const event = events.find((e) => e.id === selectedEventForAnalytics);
          const analytics = EVENT_ANALYTICS[selectedEventForAnalytics] || {
            registrationTrend: [],
            departmentDistribution: [],
            yearDistribution: [],
            domainDistribution: [],
            geographicData: [],
            collegeDistribution: [],
            approvalStats: { approved: 0, pending: 0, rejected: 0 },
            pageViews: 0,
            uniqueVisitors: 0,
            avgTimeOnPage: "0m 0s",
            domainWinRates: [],
            engagementMetrics: [],
          };

          // Filter data based on filters
          const filteredDeptData =
            departmentFilter.length > 0
              ? analytics.departmentDistribution.filter((d) =>
                  departmentFilter.includes(d.dept),
                )
              : analytics.departmentDistribution;

          const filteredYearData =
            yearFilter.length > 0
              ? analytics.yearDistribution.filter((y) =>
                  yearFilter.includes(y.year),
                )
              : analytics.yearDistribution;

          const filteredDomainData =
            domainFilter.length > 0
              ? analytics.domainDistribution.filter((d) =>
                  domainFilter.includes(d.domain),
                )
              : analytics.domainDistribution;

          return (
            <>
              {/* Quick Stats - Always visible */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                {[
                  {
                    label: "Page Views",
                    value: analytics.pageViews.toLocaleString(),
                    icon: "lucide:eye",
                    color: "#6366f1",
                  },
                  {
                    label: "Unique Visitors",
                    value: analytics.uniqueVisitors.toLocaleString(),
                    icon: "lucide:users",
                    color: "#8b5cf6",
                  },
                  {
                    label: "Avg. Time on Page",
                    value: analytics.avgTimeOnPage,
                    icon: "lucide:clock",
                    color: "#22c55e",
                  },
                  {
                    label: "Conversion Rate",
                    value: `${event?.totalParticipants && analytics.uniqueVisitors ? ((event.totalParticipants / analytics.uniqueVisitors) * 100).toFixed(1) : 0}%`,
                    icon: "lucide:trending-up",
                    color: "#f59e0b",
                  },
                  {
                    label: "Locations",
                    value: analytics.geographicData?.length || 0,
                    icon: "lucide:map-pin",
                    color: "#ec4899",
                  },
                ].map((stat, i) => (
                  <div key={i} style={kpiCard}>
                    <div style={kpiLabel}>
                      {stat.label}
                      <iconify-icon
                        icon={stat.icon}
                        style={{ fontSize: "16px", color: stat.color }}
                      ></iconify-icon>
                    </div>
                    <div style={kpiValue}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Geographic Distribution Map - show for geographic tab or overview */}
              {(activeTab === "geographic" || activeTab === "overview") && (
                <div style={{ ...card, marginBottom: "20px" }}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>
                      <iconify-icon
                        icon="lucide:map"
                        style={{ marginRight: "8px", color: "var(--primary)" }}
                      ></iconify-icon>
                      Geographic Distribution of Participants
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {analytics.geographicData?.reduce(
                          (sum, loc) => sum + loc.participants,
                          0,
                        ) || 0}{" "}
                        participants from{" "}
                        {analytics.geographicData?.length || 0} cities
                      </span>
                      <span
                        style={{
                          padding: "4px 10px",
                          background: "rgba(34, 197, 94, 0.1)",
                          color: "#16a34a",
                          fontSize: "11px",
                          fontWeight: 500,
                          borderRadius: "var(--radius-sm)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <iconify-icon
                          icon="lucide:satellite"
                          style={{ fontSize: "12px" }}
                        ></iconify-icon>
                        Satellite View
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: selectedLocation
                        ? "1fr 1fr"
                        : "1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    {/* Dynamic Mapbox Container */}
                    <div
                      ref={mapContainerRef}
                      style={{
                        height: "400px",
                        borderRadius: "var(--radius-md)",
                        background:
                          "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    />

                    {/* Location Details Panel - shown when location is clicked */}
                    {selectedLocation && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                          background: "var(--muted)",
                          borderRadius: "var(--radius-md)",
                          padding: "20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <h3
                              style={{
                                fontSize: "18px",
                                fontWeight: 700,
                                margin: 0,
                                color: "var(--foreground)",
                              }}
                            >
                              {selectedLocation.city}
                            </h3>
                            <p
                              style={{
                                fontSize: "13px",
                                color: "var(--muted-foreground)",
                                margin: "4px 0 0 0",
                              }}
                            >
                              {selectedLocation.state}
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedLocation(null)}
                            style={{
                              padding: "6px",
                              borderRadius: "var(--radius-sm)",
                              border: "none",
                              background: "var(--card)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <iconify-icon
                              icon="lucide:x"
                              style={{
                                fontSize: "14px",
                                color: "var(--muted-foreground)",
                              }}
                            ></iconify-icon>
                          </button>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              padding: "16px",
                              background: "var(--card)",
                              borderRadius: "var(--radius-md)",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "28px",
                                fontWeight: 700,
                                color: "#6366f1",
                              }}
                            >
                              {selectedLocation.teams}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--muted-foreground)",
                              }}
                            >
                              Teams
                            </div>
                          </div>
                          <div
                            style={{
                              padding: "16px",
                              background: "var(--card)",
                              borderRadius: "var(--radius-md)",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "28px",
                                fontWeight: 700,
                                color: "#22c55e",
                              }}
                            >
                              {selectedLocation.participants}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--muted-foreground)",
                              }}
                            >
                              Participants
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            padding: "14px",
                            background: "var(--card)",
                            borderRadius: "var(--radius-md)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--muted-foreground)",
                              marginBottom: "8px",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Coordinates
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <iconify-icon
                              icon="lucide:map-pin"
                              style={{ fontSize: "14px", color: "#ec4899" }}
                            ></iconify-icon>
                            <span
                              style={{
                                fontSize: "13px",
                                fontFamily: "monospace",
                                color: "var(--foreground)",
                              }}
                            >
                              {selectedLocation.lat.toFixed(4)}°N,{" "}
                              {selectedLocation.lng.toFixed(4)}°E
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            padding: "14px",
                            background:
                              "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid rgba(99, 102, 241, 0.2)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--muted-foreground)",
                              marginBottom: "8px",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Participation Rate
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                height: "8px",
                                background: "var(--muted)",
                                borderRadius: "4px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${Math.min(100, (selectedLocation.participants / (analytics.geographicData?.reduce((sum, loc) => sum + loc.participants, 0) || 1)) * 100)}%`,
                                  height: "100%",
                                  background:
                                    "linear-gradient(90deg, #6366f1, #8b5cf6)",
                                  borderRadius: "4px",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#6366f1",
                              }}
                            >
                              {(
                                (selectedLocation.participants /
                                  (analytics.geographicData?.reduce(
                                    (sum, loc) => sum + loc.participants,
                                    0,
                                  ) || 1)) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (mapRef.current) {
                              const bounds = new mapboxgl.LngLatBounds();
                              analytics.geographicData.forEach((loc) =>
                                bounds.extend([loc.lng, loc.lat]),
                              );
                              mapRef.current.fitBounds(bounds, {
                                padding: 50,
                                maxZoom: 8,
                              });
                              setSelectedLocation(null);
                            }
                          }}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border)",
                            background: "var(--card)",
                            color: "var(--foreground)",
                            fontSize: "13px",
                            fontWeight: 500,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <iconify-icon
                            icon="lucide:maximize"
                            style={{ fontSize: "14px" }}
                          ></iconify-icon>
                          View All Locations
                        </button>
                      </div>
                    )}

                    {/* Location List - shown when no location selected */}
                    {!selectedLocation && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          background: "var(--muted)",
                          borderRadius: "var(--radius-md)",
                          padding: "16px",
                          maxHeight: "400px",
                          overflowY: "auto",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--muted-foreground)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Top Locations ({analytics.geographicData?.length || 0}
                          )
                        </div>
                        {analytics.geographicData?.map((loc, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedLocation(loc);
                              if (mapRef.current) {
                                mapRef.current.flyTo({
                                  center: [loc.lng, loc.lat],
                                  zoom: 10,
                                  pitch: 60,
                                  duration: 1500,
                                });
                              }
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "10px 12px",
                              background: "var(--card)",
                              borderRadius: "var(--radius-md)",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "6px",
                                background: `hsl(${idx * 40 + 240}, 70%, 60%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "11px",
                                fontWeight: 700,
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  color: "var(--foreground)",
                                }}
                              >
                                {loc.city}
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                {loc.state}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "var(--primary)",
                                }}
                              >
                                {loc.teams}
                              </div>
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                teams
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* All Locations Grid below map */}
                  <div style={{ marginTop: "20px" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--muted-foreground)",
                        marginBottom: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      All Participating Locations (
                      {analytics.geographicData?.length || 0})
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {analytics.geographicData?.map((loc, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedLocation(loc);
                            if (mapRef.current) {
                              mapRef.current.flyTo({
                                center: [loc.lng, loc.lat],
                                zoom: 10,
                                pitch: 60,
                                duration: 1500,
                              });
                            }
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px",
                            background:
                              selectedLocation?.city === loc.city
                                ? "rgba(99, 102, 241, 0.1)"
                                : "var(--muted)",
                            borderRadius: "var(--radius-md)",
                            cursor: "pointer",
                            border:
                              selectedLocation?.city === loc.city
                                ? "1px solid rgba(99, 102, 241, 0.3)"
                                : "1px solid transparent",
                            transition: "all 0.2s",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              background: `hsl(${idx * 40 + 240}, 70%, 60%)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: 700,
                            }}
                          >
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "var(--foreground)",
                              }}
                            >
                              {loc.city}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--muted-foreground)",
                              }}
                            >
                              {loc.state}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "var(--primary)",
                              }}
                            >
                              {loc.teams}
                            </div>
                            <div
                              style={{
                                fontSize: "10px",
                                color: "var(--muted-foreground)",
                              }}
                            >
                              teams
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                {/* Domain Distribution - Pie Chart */}
                <div style={card}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>
                      <iconify-icon
                        icon="lucide:layers"
                        style={{ marginRight: "8px", color: "#8b5cf6" }}
                      ></iconify-icon>
                      Domain Distribution
                    </h3>
                  </div>
                  <div style={{ height: "260px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={(filteredDomainData || []).map((item, i) => ({
                            ...item,
                            name: item.domain,
                            value: item.count,
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={85}
                          innerRadius={45}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {(filteredDomainData || []).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend
                          layout="vertical"
                          align="right"
                          verticalAlign="middle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Registration Status - Donut Chart */}
                <div style={card}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>
                      <iconify-icon
                        icon="lucide:pie-chart"
                        style={{ marginRight: "8px", color: "#22c55e" }}
                      ></iconify-icon>
                      Registration Status
                    </h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                    }}
                  >
                    <div style={{ width: "180px", height: "180px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Approved",
                                value: analytics.approvalStats.approved,
                                fill: "#22c55e",
                              },
                              {
                                name: "Pending",
                                value: analytics.approvalStats.pending,
                                fill: "#f59e0b",
                              },
                              {
                                name: "Rejected",
                                value: analytics.approvalStats.rejected,
                                fill: "#ef4444",
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            <Cell fill="#22c55e" />
                            <Cell fill="#f59e0b" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip content={<CustomPieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {[
                        {
                          label: "Approved",
                          value: analytics.approvalStats.approved,
                          color: "#22c55e",
                          icon: "lucide:check-circle",
                        },
                        {
                          label: "Pending",
                          value: analytics.approvalStats.pending,
                          color: "#f59e0b",
                          icon: "lucide:clock",
                        },
                        {
                          label: "Rejected",
                          value: analytics.approvalStats.rejected,
                          color: "#ef4444",
                          icon: "lucide:x-circle",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            background: "var(--muted)",
                            borderRadius: "var(--radius-md)",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "3px",
                              background: item.color,
                            }}
                          ></div>
                          <iconify-icon
                            icon={item.icon}
                            style={{ fontSize: "18px", color: item.color }}
                          ></iconify-icon>
                          <span
                            style={{
                              flex: 1,
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "var(--foreground)",
                            }}
                          >
                            {item.label}
                          </span>
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: 700,
                              color: item.color,
                            }}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                {/* Department Distribution - Horizontal Bar Chart */}
                <div style={card}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>
                      <iconify-icon
                        icon="lucide:building"
                        style={{ marginRight: "8px", color: "#6366f1" }}
                      ></iconify-icon>
                      Department Wise Participation
                    </h3>
                  </div>
                  <div style={{ height: "280px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredDeptData.slice(0, 6)}
                        layout="vertical"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          type="number"
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                        />
                        <YAxis
                          dataKey="dept"
                          type="category"
                          width={60}
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                        />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar
                          dataKey="count"
                          radius={[0, 4, 4, 0]}
                          name="Students"
                        >
                          {filteredDeptData.slice(0, 6).map((entry, index) => (
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

                {/* College Distribution */}
                <div style={card}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>
                      <iconify-icon
                        icon="lucide:building-2"
                        style={{ marginRight: "8px", color: "#22c55e" }}
                      ></iconify-icon>
                      Participating Colleges
                    </h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {(analytics.collegeDistribution || [])
                      .slice(0, 5)
                      .map((college, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 12px",
                            background: "var(--muted)",
                            borderRadius: "var(--radius-md)",
                          }}
                        >
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              background: "var(--primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: 700,
                              fontSize: "14px",
                            }}
                          >
                            {college.college.charAt(0)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "var(--foreground)",
                              }}
                            >
                              {college.college}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--muted-foreground)",
                              }}
                            >
                              {college.location}
                            </div>
                          </div>
                          <div
                            style={{
                              padding: "4px 10px",
                              borderRadius: "12px",
                              background: "rgba(34, 197, 94, 0.1)",
                              color: "#22c55e",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {college.teams} teams
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                }}
              >
                {/* Year Distribution - Pie Chart */}
                <div style={card}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>
                      <iconify-icon
                        icon="lucide:graduation-cap"
                        style={{ marginRight: "8px", color: "#f59e0b" }}
                      ></iconify-icon>
                      Year Wise Distribution
                    </h3>
                  </div>
                  <div style={{ height: "250px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={filteredYearData.map((item, i) => ({
                            ...item,
                            name: item.year,
                            value: item.count,
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {filteredYearData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Registration Trend - Area Chart */}
                <div style={card}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>
                      <iconify-icon
                        icon="lucide:trending-up"
                        style={{ marginRight: "8px", color: "#22c55e" }}
                      ></iconify-icon>
                      Registration Trend
                    </h3>
                  </div>
                  <div style={{ height: "250px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.registrationTrend}>
                        <defs>
                          <linearGradient
                            id="colorRegistrations"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#6366f1"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#6366f1"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="date"
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                        />
                        <YAxis
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                        />
                        <Tooltip content={<CustomAreaTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#6366f1"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRegistrations)"
                          name="Registrations"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Win Rates Section - show for winrates tab or always in overview */}
              {(activeTab === "winrates" || activeTab === "overview") &&
                analytics.domainWinRates?.length > 0 && (
                  <div style={{ ...card, marginTop: "20px" }}>
                    <div style={cardHeaderRow}>
                      <h3 style={cardTitle}>
                        <iconify-icon
                          icon="lucide:trophy"
                          style={{ marginRight: "8px", color: "#f59e0b" }}
                        ></iconify-icon>
                        Domain-wise Win Rates
                      </h3>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        Based on{" "}
                        {analytics.domainWinRates.reduce(
                          (sum, d) => sum + d.participated,
                          0,
                        )}{" "}
                        participants
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: "24px",
                      }}
                    >
                      {/* Win Rate Bar Chart */}
                      <div style={{ height: "280px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={analytics.domainWinRates}
                            layout="vertical"
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="var(--border)"
                            />
                            <XAxis
                              type="number"
                              tick={{
                                fontSize: 11,
                                fill: "var(--muted-foreground)",
                              }}
                              domain={[0, "auto"]}
                            />
                            <YAxis
                              dataKey="domain"
                              type="category"
                              width={100}
                              tick={{
                                fontSize: 11,
                                fill: "var(--muted-foreground)",
                              }}
                            />
                            <Tooltip content={<CustomWinRateTooltip />} />
                            <Legend />
                            <Bar
                              dataKey="participated"
                              fill="#6366f1"
                              name="Participated"
                              radius={[0, 4, 4, 0]}
                            />
                            <Bar
                              dataKey="wins"
                              fill="#22c55e"
                              name="Wins"
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Win Rate Stats */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {analytics.domainWinRates.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "16px",
                              background: "var(--muted)",
                              borderRadius: "var(--radius-md)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  color: "var(--foreground)",
                                }}
                              >
                                {item.domain}
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "var(--muted-foreground)",
                                  marginTop: "2px",
                                }}
                              >
                                {item.wins} wins / {item.participated}{" "}
                                participated
                              </div>
                            </div>
                            <div
                              style={{
                                padding: "6px 12px",
                                borderRadius: "20px",
                                background:
                                  item.winRate >= 15
                                    ? "rgba(34, 197, 94, 0.1)"
                                    : "rgba(245, 158, 11, 0.1)",
                                color:
                                  item.winRate >= 15 ? "#22c55e" : "#f59e0b",
                                fontSize: "14px",
                                fontWeight: 600,
                              }}
                            >
                              {item.winRate}%
                            </div>
                          </div>
                        ))}

                        {/* Overall Win Rate */}
                        <div
                          style={{
                            padding: "20px",
                            background:
                              "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid rgba(99, 102, 241, 0.2)",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "var(--muted-foreground)",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              marginBottom: "8px",
                            }}
                          >
                            Overall Win Rate
                          </div>
                          <div
                            style={{
                              fontSize: "32px",
                              fontWeight: 700,
                              color: "#6366f1",
                            }}
                          >
                            {(
                              (analytics.domainWinRates.reduce(
                                (sum, d) => sum + d.wins,
                                0,
                              ) /
                                analytics.domainWinRates.reduce(
                                  (sum, d) => sum + d.participated,
                                  0,
                                )) *
                              100
                            ).toFixed(1)}
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Engagement Tab Content */}
              {activeTab === "engagement" && (
                <div style={{ ...card, marginTop: "20px" }}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>
                      <iconify-icon
                        icon="lucide:activity"
                        style={{ marginRight: "8px", color: "#ec4899" }}
                      ></iconify-icon>
                      Weekly Engagement Metrics
                    </h3>
                  </div>
                  <div style={{ height: "300px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.engagementMetrics || []}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="day"
                          tick={{
                            fontSize: 12,
                            fill: "var(--muted-foreground)",
                          }}
                        />
                        <YAxis
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                        />
                        <Tooltip content={<CustomLineTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="visits"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={{ fill: "#6366f1", strokeWidth: 2 }}
                          name="Page Visits"
                        />
                        <Line
                          type="monotone"
                          dataKey="registrations"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ fill: "#22c55e", strokeWidth: 2 }}
                          name="Registrations"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          );
        })()}

      {!selectedEventForAnalytics && (
        <div
          style={{
            ...card,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px",
            gap: "12px",
            color: "var(--muted-foreground)",
          }}
        >
          <iconify-icon
            icon="lucide:bar-chart-3"
            style={{ fontSize: "56px" }}
          ></iconify-icon>
          <p style={{ margin: 0, fontSize: "16px" }}>
            Select an event to view analytics
          </p>
        </div>
      )}
    </div>
  );
}
