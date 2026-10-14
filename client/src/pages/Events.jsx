import { useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../context/EventsContext";

const CATEGORY_COLORS = {
  Hackathon: { bg: "#1e3a8a", text: "#fff" },
  Workshop: { bg: "#0369a1", text: "#fff" },
  Seminar: { bg: "#6d28d9", text: "#fff" },
  Competition: { bg: "#b45309", text: "#fff" },
  Webinar: { bg: "#065f46", text: "#fff" },
  Bootcamp: { bg: "#9333ea", text: "#fff" },
};

function SeatBar({ seats, total, status }) {
  if (status === "closed") {
    return (
      <div>
        <span
          style={{
            fontSize: 12,
            color: "var(--muted-foreground)",
            fontWeight: 500,
          }}
        >
          Registration Closed
        </span>
        <div
          style={{
            width: 80,
            height: 4,
            background: "var(--muted)",
            borderRadius: 2,
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#94a3b8",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    );
  }
  if (!total) {
    return (
      <div>
        <span style={{ fontSize: 12, color: "#10b981", fontWeight: 500 }}>
          Unlimited
        </span>
        <div
          style={{
            width: 80,
            height: 4,
            background: "var(--muted)",
            borderRadius: 2,
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#10b981",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    );
  }
  const pct = Math.round(((total - seats) / total) * 100);
  const fillColor = pct >= 90 ? "#ef4444" : pct >= 60 ? "#f59e0b" : "#10b981";
  return (
    <div>
      <span
        style={{
          fontSize: 12,
          color: "var(--muted-foreground)",
          fontWeight: 500,
        }}
      >
        {seats} seats left
      </span>
      <div
        style={{
          width: 80,
          height: 4,
          background: "var(--muted)",
          borderRadius: 2,
          marginTop: 4,
        }}
      >
        <div
          style={{
            width: `${100 - pct}%`,
            height: "100%",
            background: fillColor,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

export default function Events() {
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState("all");
  const [activeFilter, setActiveFilter] = useState("All Domains");

  // Format date for display
  const formatDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    if (startDate === endDate) {
      return `${months[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()}`;
    }
    return `${months[start.getMonth()]} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
  };

  // Transform events for display
  const displayEvents = events.map((event) => ({
    ...event,
    category: event.eventType || "Workshop",
    date: formatDate(event.startDate, event.endDate),
    college: event.college || event.organizer,
    tags: event.tags || event.skillDomains || [],
    domain: event.domain || event.skillDomains?.[0] || "General",
    status: event.status === "closed" ? "closed" : "open",
  }));

  const tabs = [
    { key: "all", label: "All Events" },
    { key: "registered", label: "My Registered" },
    { key: "recommended", label: "Recommended", badge: "AI" },
    { key: "completed", label: "Completed" },
  ];

  const filters = [
    "All Domains",
    "Hackathons",
    "Workshops",
    "Seminars",
    "Web Development",
    "AI/ML",
    "Robotics",
  ];

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: 1160,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            margin: "0 0 4px 0",
            color: "var(--primary)",
          }}
        >
          Explore Events
        </h1>
        <p
          style={{ fontSize: 14, color: "var(--muted-foreground)", margin: 0 }}
        >
          Discover hackathons, workshops, and seminars across the network.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 24,
          borderBottom: "1px solid var(--border)",
          marginBottom: 24,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "12px 0",
              fontSize: 14,
              fontWeight: activeTab === t.key ? 600 : 500,
              color:
                activeTab === t.key
                  ? "var(--primary)"
                  : "var(--muted-foreground)",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === t.key
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
              cursor: "pointer",
              marginBottom: -1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "color 0.15s",
            }}
          >
            {t.label}
            {t.badge && (
              <span
                style={{
                  background: "#f59e0b",
                  color: "#fff",
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 8,
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filter Chips */}
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: "7px 16px",
              borderRadius: 999,
              background: activeFilter === f ? "var(--primary)" : "#fff",
              border: `1px solid ${activeFilter === f ? "var(--primary)" : "var(--border)"}`,
              color: activeFilter === f ? "#fff" : "var(--muted-foreground)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* AI Recommendation Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          borderRadius: "var(--radius-lg)",
          padding: "18px 24px",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #bfdbfe",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--primary)",
              fontWeight: 600,
              fontSize: 15,
              marginBottom: 4,
            }}
          >
            <iconify-icon
              icon="lucide:sparkles"
              style={{ color: "#f59e0b", fontSize: 16 }}
            />
            Recommended for you
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#334155" }}>
            Based on your profile, we think you'd excel at these upcoming AI
            &amp; Data Science events.
          </p>
        </div>
        <button
          style={{
            background: "#fff",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            marginLeft: 16,
          }}
        >
          View Recommendations
        </button>
      </div>

      {/* Section Label */}
      <div
        style={{
          fontSize: 17,
          fontWeight: 600,
          marginBottom: 16,
          color: "var(--foreground)",
        }}
      >
        Trending &amp; Upcoming
      </div>

      {/* Events Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24,
        }}
      >
        {displayEvents.map((event) => {
          const cat = CATEGORY_COLORS[event.category] || {
            bg: "#334155",
            text: "#fff",
          };
          return (
            <div
              key={event.id}
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px -10px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Image */}
              <div
                style={{
                  height: 160,
                  position: "relative",
                  background: "#f1f5f9",
                  flexShrink: 0,
                }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: cat.bg,
                    color: cat.text,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 4,
                    letterSpacing: "0.3px",
                  }}
                >
                  {event.category}
                </span>
              </div>

              {/* Body */}
              <div
                style={{
                  padding: 20,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#f59e0b",
                    fontWeight: 700,
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {event.date}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--foreground)",
                    marginBottom: 8,
                    lineHeight: 1.4,
                  }}
                >
                  {event.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    color: "var(--muted-foreground)",
                    marginBottom: 14,
                  }}
                >
                  <iconify-icon
                    icon="lucide:building-2"
                    style={{ fontSize: 14 }}
                  />
                  {event.college}
                </div>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginBottom: 16,
                  }}
                >
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: "var(--muted)",
                        color: "var(--muted-foreground)",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 14,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <SeatBar
                    seats={event.seats}
                    total={event.totalSeats}
                    status={event.status}
                  />
                  <button
                    disabled={event.status === "closed"}
                    style={{
                      background:
                        event.status === "closed"
                          ? "transparent"
                          : "var(--primary)",
                      color:
                        event.status === "closed"
                          ? "var(--muted-foreground)"
                          : "#fff",
                      border:
                        event.status === "closed"
                          ? "1px solid var(--border)"
                          : "none",
                      padding: "8px 16px",
                      borderRadius: "var(--radius-md)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor:
                        event.status === "closed" ? "not-allowed" : "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (event.status !== "closed")
                        e.currentTarget.style.background = "#1e40af";
                    }}
                    onMouseLeave={(e) => {
                      if (event.status !== "closed")
                        e.currentTarget.style.background = "var(--primary)";
                    }}
                  >
                    {event.status === "closed" ? "Closed" : "Register Now"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
