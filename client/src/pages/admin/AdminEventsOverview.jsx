import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvents } from "../../context/EventsContext";

// ALL_EVENTS data is now centralized in EventsContext

const getStatusStyle = (status) => {
  switch (status) {
    case "ongoing":
      return { bg: "rgba(34, 197, 94, 0.1)", color: "#22c55e" };
    case "upcoming":
      return { bg: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" };
    case "completed":
      return { bg: "rgba(107, 114, 128, 0.1)", color: "#6b7280" };
    default:
      return { bg: "rgba(107, 114, 128, 0.1)", color: "#6b7280" };
  }
};

const CATEGORY_COLORS = {
  Hackathon: { bg: "#1e3a8a", text: "#fff" },
  Workshop: { bg: "#0369a1", text: "#fff" },
  Seminar: { bg: "#6d28d9", text: "#fff" },
  Competition: { bg: "#b45309", text: "#fff" },
  Conference: { bg: "#0f766e", text: "#fff" },
  Webinar: { bg: "#065f46", text: "#fff" },
  Bootcamp: { bg: "#9333ea", text: "#fff" },
  Ideathon: { bg: "#be185d", text: "#fff" },
};

export default function AdminEventsOverview() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { events: contextEvents } = useEvents();

  // Format context events for display
  const allEvents = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return contextEvents.map((e) => {
      // Determine status based on dates and original status
      let displayStatus = e.status;
      if (e.status === "closed") {
        displayStatus = "completed";
      } else if (e.status === "pending" || e.status === "upcoming") {
        const startDate = e.startDate;
        const endDate = e.endDate;
        if (today >= startDate && today <= endDate) {
          displayStatus = "ongoing";
        } else if (today < startDate) {
          displayStatus = "upcoming";
        } else if (today > endDate) {
          displayStatus = "completed";
        }
      }

      return {
        id: e.id,
        title: e.title,
        type: e.eventType || "Workshop",
        domain: e.domain || e.skillDomains?.[0] || "General",
        organizer: e.organizer || e.college || "Our College",
        isInternal: e.isInternal ?? false,
        startDate: e.startDate,
        endDate: e.endDate,
        venue: e.venue || "TBD",
        mode:
          e.mode === "online"
            ? "Online"
            : e.mode === "offline"
              ? "Offline"
              : "Hybrid",
        image: e.image,
        description: e.description,
        maxParticipants:
          e.maxParticipants || parseInt(e.expectedParticipants) || 100,
        totalParticipants: e.totalParticipants || 0,
        registeredTeamsFromCollege: e.registeredTeamsFromCollege || [],
        winnersFromCollege: e.winnersFromCollege || [],
        status: displayStatus,
      };
    });
  }, [contextEvents]);

  const [filter, setFilter] = useState("all"); // all, internal, external
  const [statusFilter, setStatusFilter] = useState("all"); // all, ongoing, upcoming, completed
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState([]);
  const [domainFilter, setDomainFilter] = useState([]);
  const [modeFilter, setModeFilter] = useState([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [positionRange, setPositionRange] = useState({ from: "", to: "" });

  // Extract unique values for filter
  const eventTypes = [...new Set(allEvents.map((e) => e.type))];
  const eventDomains = [...new Set(allEvents.map((e) => e.domain))];
  const eventModes = [...new Set(allEvents.map((e) => e.mode))];

  const toggleArrayFilter = (arr, setArr, value) => {
    if (arr.includes(value)) {
      setArr(arr.filter((v) => v !== value));
    } else {
      setArr([...arr, value]);
    }
  };

  const clearAllFilters = () => {
    setFilter("all");
    setStatusFilter("all");
    setSearchTerm("");
    setTypeFilter([]);
    setDomainFilter([]);
    setModeFilter([]);
    setDateRange({ from: "", to: "" });
    setPositionRange({ from: "", to: "" });
  };

  // Helper to extract position number from prize string like "1st Place", "2nd Place"
  const getPositionNumber = (prize) => {
    if (!prize) return null;
    const match = prize.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  const activeFilterCount = [
    filter !== "all" ? 1 : 0,
    statusFilter !== "all" ? 1 : 0,
    typeFilter.length,
    domainFilter.length,
    modeFilter.length,
    dateRange.from || dateRange.to ? 1 : 0,
    positionRange.from || positionRange.to ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Find selected event for detail view
  const selectedEvent = eventId
    ? allEvents.find((e) => e.id === eventId)
    : null;

  const filteredEvents = allEvents.filter((event) => {
    const matchesSource =
      filter === "all" ||
      (filter === "internal" && event.isInternal) ||
      (filter === "external" && !event.isInternal);
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter.length === 0 || typeFilter.includes(event.type);
    const matchesDomain =
      domainFilter.length === 0 || domainFilter.includes(event.domain);
    const matchesMode =
      modeFilter.length === 0 || modeFilter.includes(event.mode);
    const matchesDateRange =
      (!dateRange.from || event.startDate >= dateRange.from) &&
      (!dateRange.to || event.endDate <= dateRange.to);

    // Position range filter - check if any winner from college has position in range
    const matchesPositionRange = (() => {
      if (!positionRange.from && !positionRange.to) return true;
      if (event.winnersFromCollege.length === 0) return false;
      const fromPos = positionRange.from ? parseInt(positionRange.from) : 1;
      const toPos = positionRange.to ? parseInt(positionRange.to) : 100;
      return event.winnersFromCollege.some((winner) => {
        const pos = getPositionNumber(winner.prize);
        return pos !== null && pos >= fromPos && pos <= toPos;
      });
    })();

    return (
      matchesSource &&
      matchesStatus &&
      matchesSearch &&
      matchesType &&
      matchesDomain &&
      matchesMode &&
      matchesDateRange &&
      matchesPositionRange
    );
  });

  // Stats
  const stats = {
    totalEvents: allEvents.length,
    teamsRegistered: allEvents.reduce(
      (acc, e) => acc + (e.registeredTeamsFromCollege?.length || 0),
      0,
    ),
    totalWins: allEvents.reduce(
      (acc, e) => acc + (e.winnersFromCollege?.length || 0),
      0,
    ),
    prizeMoney: allEvents.reduce(
      (acc, e) =>
        acc +
        (e.winnersFromCollege?.reduce(
          (sum, w) => sum + (w.prizeAmount || 0),
          0,
        ) || 0),
      0,
    ),
  };

  const card = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "20px",
  };

  // Detail View Component
  if (selectedEvent) {
    return (
      <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/events-overview")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "var(--muted)",
            border: "none",
            borderRadius: "var(--radius-md)",
            color: "var(--foreground)",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            marginBottom: "24px",
          }}
        >
          <iconify-icon
            icon="lucide:arrow-left"
            style={{ fontSize: "18px" }}
          ></iconify-icon>
          Back to Events
        </button>

        {/* Event Header */}
        <div
          style={{
            ...card,
            padding: 0,
            overflow: "hidden",
            marginBottom: "24px",
          }}
        >
          <div style={{ position: "relative", height: "240px" }}>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                color: "#fff",
              }}
            >
              <div
                style={{ display: "flex", gap: "8px", marginBottom: "12px" }}
              >
                <span
                  style={{
                    background:
                      CATEGORY_COLORS[selectedEvent.type]?.bg || "#334155",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {selectedEvent.type}
                </span>
                <span
                  style={{
                    background: getStatusStyle(selectedEvent.status).bg,
                    color: getStatusStyle(selectedEvent.status).color,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {selectedEvent.status}
                </span>
                <span
                  style={{
                    background: selectedEvent.isInternal
                      ? "rgba(34, 197, 94, 0.2)"
                      : "rgba(139, 92, 246, 0.2)",
                    color: selectedEvent.isInternal ? "#22c55e" : "#8b5cf6",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {selectedEvent.isInternal ? "Internal" : "External"}
                </span>
              </div>
              <h1 style={{ fontSize: "28px", fontWeight: 700, margin: 0 }}>
                {selectedEvent.title}
              </h1>
              <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.9 }}>
                Organized by {selectedEvent.organizer}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "24px",
              display: "flex",
              gap: "32px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <iconify-icon
                icon="lucide:calendar"
                style={{ fontSize: "18px", color: "var(--muted-foreground)" }}
              ></iconify-icon>
              <span style={{ color: "var(--foreground)", fontSize: "14px" }}>
                {new Date(selectedEvent.startDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {selectedEvent.startDate !== selectedEvent.endDate && (
                  <span>
                    {" "}
                    –{" "}
                    {new Date(selectedEvent.endDate).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "long" },
                    )}
                  </span>
                )}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <iconify-icon
                icon="lucide:map-pin"
                style={{ fontSize: "18px", color: "var(--muted-foreground)" }}
              ></iconify-icon>
              <span style={{ color: "var(--foreground)", fontSize: "14px" }}>
                {selectedEvent.venue}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <iconify-icon
                icon="lucide:monitor"
                style={{ fontSize: "18px", color: "var(--muted-foreground)" }}
              ></iconify-icon>
              <span style={{ color: "var(--foreground)", fontSize: "14px" }}>
                {selectedEvent.mode}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <iconify-icon
                icon="lucide:tag"
                style={{ fontSize: "18px", color: "var(--muted-foreground)" }}
              ></iconify-icon>
              <span style={{ color: "var(--foreground)", fontSize: "14px" }}>
                {selectedEvent.domain}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={{ ...card, textAlign: "center" }}>
            <div
              style={{ fontSize: "32px", fontWeight: 700, color: "#3b82f6" }}
            >
              {selectedEvent.registeredTeamsFromCollege.length}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--muted-foreground)",
                marginTop: "4px",
              }}
            >
              Teams from Our College
            </div>
          </div>
          <div style={{ ...card, textAlign: "center" }}>
            <div
              style={{ fontSize: "32px", fontWeight: 700, color: "#22c55e" }}
            >
              {selectedEvent.winnersFromCollege.length}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--muted-foreground)",
                marginTop: "4px",
              }}
            >
              Winning Teams
            </div>
          </div>
          <div style={{ ...card, textAlign: "center" }}>
            <div
              style={{ fontSize: "32px", fontWeight: 700, color: "#f59e0b" }}
            >
              ₹
              {selectedEvent.winnersFromCollege
                .reduce((sum, w) => sum + (w.prizeAmount || 0), 0)
                .toLocaleString()}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--muted-foreground)",
                marginTop: "4px",
              }}
            >
              Prize Money Won
            </div>
          </div>
          <div style={{ ...card, textAlign: "center" }}>
            <div
              style={{ fontSize: "32px", fontWeight: 700, color: "#8b5cf6" }}
            >
              {selectedEvent.registeredTeamsFromCollege.reduce(
                (sum, t) => sum + t.members.length,
                0,
              )}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--muted-foreground)",
                marginTop: "4px",
              }}
            >
              Total Participants
            </div>
          </div>
        </div>

        {/* Winners Section */}
        {selectedEvent.winnersFromCollege.length > 0 && (
          <div style={{ ...card, marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <iconify-icon
                icon="lucide:trophy"
                style={{ fontSize: "24px", color: "#f59e0b" }}
              ></iconify-icon>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                Winners from Our College
              </h2>
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              {selectedEvent.winnersFromCollege.map((winner, idx) => (
                <div
                  key={idx}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: "var(--radius-md)",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      <iconify-icon
                        icon="lucide:award"
                        style={{ fontSize: "24px", color: "#f59e0b" }}
                      ></iconify-icon>
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "var(--foreground)",
                        }}
                      >
                        {winner.teamName}
                      </span>
                      <span
                        style={{
                          background: "#f59e0b",
                          color: "#fff",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {winner.prize}
                      </span>
                    </div>
                    <div
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                    >
                      {winner.members.map((member, mIdx) => (
                        <span
                          key={mIdx}
                          style={{
                            background: "var(--muted)",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "var(--foreground)",
                          }}
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "#22c55e",
                      }}
                    >
                      ₹{winner.prizeAmount?.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      Prize Money
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registered Teams Section */}
        <div style={card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <iconify-icon
              icon="lucide:users"
              style={{ fontSize: "24px", color: "#3b82f6" }}
            ></iconify-icon>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Registered Teams from Our College
            </h2>
          </div>
          {selectedEvent.registeredTeamsFromCollege.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "var(--muted-foreground)",
              }}
            >
              <iconify-icon
                icon="lucide:users-x"
                style={{ fontSize: "48px", opacity: 0.5 }}
              ></iconify-icon>
              <p style={{ marginTop: "12px" }}>
                No teams registered from our college
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {selectedEvent.registeredTeamsFromCollege.map((team) => (
                <div
                  key={team.id}
                  style={{
                    background:
                      team.status === "won"
                        ? "rgba(245, 158, 11, 0.05)"
                        : "var(--muted)",
                    border:
                      team.status === "won"
                        ? "1px solid rgba(245, 158, 11, 0.3)"
                        : "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "var(--foreground)",
                        }}
                      >
                        {team.name}
                      </span>
                      {team.status === "won" && (
                        <span
                          style={{
                            background: "#f59e0b",
                            color: "#fff",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <iconify-icon
                            icon="lucide:trophy"
                            style={{ fontSize: "12px" }}
                          ></iconify-icon>
                          {team.prize}
                        </span>
                      )}
                    </div>
                    <div
                      style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                    >
                      {team.members.map((member, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "var(--card)",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
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
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <iconify-icon
                        icon="lucide:users"
                        style={{ fontSize: "14px" }}
                      ></iconify-icon>
                      {team.members.length} members
                    </span>
                    {team.status === "won" && team.prizeAmount && (
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#22c55e",
                        }}
                      >
                        ₹{team.prizeAmount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // List View (Main Page)
  return (
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--foreground)",
            margin: 0,
          }}
        >
          Events Overview
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--muted-foreground)",
            marginTop: "6px",
          }}
        >
          Track all events and your college's participation
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(99, 102, 241, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <iconify-icon
                icon="lucide:calendar-range"
                style={{ fontSize: "24px", color: "#6366f1" }}
              ></iconify-icon>
            </div>
            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                {stats.totalEvents}
              </div>
              <div
                style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
              >
                Total Events
              </div>
            </div>
          </div>
        </div>
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(59, 130, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <iconify-icon
                icon="lucide:users"
                style={{ fontSize: "24px", color: "#3b82f6" }}
              ></iconify-icon>
            </div>
            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                {stats.teamsRegistered}
              </div>
              <div
                style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
              >
                Teams Registered
              </div>
            </div>
          </div>
        </div>
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(245, 158, 11, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <iconify-icon
                icon="lucide:trophy"
                style={{ fontSize: "24px", color: "#f59e0b" }}
              ></iconify-icon>
            </div>
            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                {stats.totalWins}
              </div>
              <div
                style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
              >
                Total Wins
              </div>
            </div>
          </div>
        </div>
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(34, 197, 94, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <iconify-icon
                icon="lucide:indian-rupee"
                style={{ fontSize: "24px", color: "#22c55e" }}
              ></iconify-icon>
            </div>
            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                ₹{stats.prizeMoney.toLocaleString()}
              </div>
              <div
                style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
              >
                Prize Money Won
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          ...card,
          padding: "0",
          marginBottom: "24px",
          overflow: "hidden",
        }}
      >
        {/* Filter Header */}
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
            borderBottom: showFilters ? "1px solid var(--border)" : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flex: 1,
              minWidth: "200px",
              background: "var(--muted)",
              borderRadius: "var(--radius-md)",
              padding: "0 12px",
            }}
          >
            <iconify-icon
              icon="lucide:search"
              style={{ fontSize: "18px", color: "var(--muted-foreground)" }}
            ></iconify-icon>
            <input
              type="text"
              placeholder="Search events by title, domain, organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 8px",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "var(--foreground)",
              }}
            />
            {searchTerm && (
              <iconify-icon
                icon="lucide:x"
                style={{
                  fontSize: "16px",
                  color: "var(--muted-foreground)",
                  cursor: "pointer",
                }}
                onClick={() => setSearchTerm("")}
              ></iconify-icon>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
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
                padding: "10px 16px",
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
              Clear All
            </button>
          )}

          <div
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginLeft: "auto",
            }}
          >
            Showing{" "}
            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
              {filteredEvents.length}
            </span>{" "}
            of {allEvents.length} events
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div
            style={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              background: "var(--muted)",
            }}
          >
            {/* Row 1: Source, Status, Mode */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
              }}
            >
              {/* Source Filter */}
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
                  Source
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {["all", "internal", "external"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        background:
                          filter === f ? "var(--primary)" : "var(--card)",
                        color: filter === f ? "#fff" : "var(--foreground)",
                        fontSize: "12px",
                        fontWeight: 500,
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {f === "all" ? "All" : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
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
                  Status
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {["all", "ongoing", "upcoming", "completed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "var(--radius-md)",
                        border:
                          statusFilter === s
                            ? "none"
                            : "1px solid var(--border)",
                        background:
                          statusFilter === s
                            ? getStatusStyle(s).bg
                            : "var(--card)",
                        color:
                          statusFilter === s
                            ? getStatusStyle(s).color
                            : "var(--muted-foreground)",
                        fontSize: "12px",
                        fontWeight: 500,
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {s === "all" ? "All" : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Filter */}
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
                  Mode
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {eventModes.map((m) => {
                    const isSelected = modeFilter.includes(m);
                    const modeIcons = {
                      Online: "lucide:monitor",
                      Offline: "lucide:map-pin",
                      Hybrid: "lucide:git-merge",
                    };
                    return (
                      <button
                        key={m}
                        onClick={() =>
                          toggleArrayFilter(modeFilter, setModeFilter, m)
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
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <iconify-icon
                          icon={modeIcons[m] || "lucide:calendar"}
                          style={{ fontSize: "13px" }}
                        ></iconify-icon>
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 2: Event Type, Domain */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              {/* Event Type Filter */}
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
                  Event Type
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {eventTypes.map((t) => {
                    const isSelected = typeFilter.includes(t);
                    const typeColor = CATEGORY_COLORS[t] || {
                      bg: "#334155",
                      text: "#fff",
                    };
                    return (
                      <button
                        key={t}
                        onClick={() =>
                          toggleArrayFilter(typeFilter, setTypeFilter, t)
                        }
                        style={{
                          padding: "6px 12px",
                          borderRadius: "var(--radius-md)",
                          border: isSelected
                            ? "none"
                            : "1px solid var(--border)",
                          background: isSelected ? typeColor.bg : "var(--card)",
                          color: isSelected
                            ? typeColor.text
                            : "var(--foreground)",
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        {t}
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
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {eventDomains.map((d) => {
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
            </div>

            {/* Row 3: Date Range, Position Range */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              {/* Date Range Filter */}
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
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        minWidth: "32px",
                      }}
                    >
                      From
                    </span>
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
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        minWidth: "20px",
                      }}
                    >
                      To
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
                      }}
                    />
                  </div>
                  {(dateRange.from || dateRange.to) && (
                    <button
                      onClick={() => setDateRange({ from: "", to: "" })}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#ef4444",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <iconify-icon
                        icon="lucide:x"
                        style={{ fontSize: "12px" }}
                      ></iconify-icon>
                    </button>
                  )}
                </div>
              </div>

              {/* Position Range Filter */}
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
                  Winner Position
                </div>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  {["Top 3", "Top 5", "Top 10"].map((preset) => {
                    const topN = parseInt(preset.split(" ")[1]);
                    const isSelected =
                      positionRange.from === "1" &&
                      positionRange.to === String(topN);
                    return (
                      <button
                        key={preset}
                        onClick={() => {
                          if (isSelected) {
                            setPositionRange({ from: "", to: "" });
                          } else {
                            setPositionRange({ from: "1", to: String(topN) });
                          }
                        }}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "var(--radius-md)",
                          border: isSelected
                            ? "none"
                            : "1px solid var(--border)",
                          background: isSelected
                            ? "rgba(245, 158, 11, 0.2)"
                            : "var(--card)",
                          color: isSelected ? "#f59e0b" : "var(--foreground)",
                          fontSize: "11px",
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <iconify-icon
                          icon="lucide:trophy"
                          style={{ fontSize: "11px" }}
                        ></iconify-icon>
                        {preset}
                      </button>
                    );
                  })}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                      margin: "0 4px",
                    }}
                  >
                    or
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="From"
                    value={positionRange.from}
                    onChange={(e) =>
                      setPositionRange({
                        ...positionRange,
                        from: e.target.value,
                      })
                    }
                    style={{
                      width: "55px",
                      padding: "6px 8px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      color: "var(--foreground)",
                      fontSize: "12px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    -
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="To"
                    value={positionRange.to}
                    onChange={(e) =>
                      setPositionRange({ ...positionRange, to: e.target.value })
                    }
                    style={{
                      width: "55px",
                      padding: "6px 8px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      color: "var(--foreground)",
                      fontSize: "12px",
                    }}
                  />
                  {(positionRange.from || positionRange.to) && (
                    <button
                      onClick={() => setPositionRange({ from: "", to: "" })}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#ef4444",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <iconify-icon
                        icon="lucide:x"
                        style={{ fontSize: "12px" }}
                      ></iconify-icon>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Tags */}
        {activeFilterCount > 0 && !showFilters && (
          <div
            style={{
              padding: "12px 20px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              alignItems: "center",
              borderTop: "1px solid var(--border)",
              background: "var(--muted)",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                marginRight: "4px",
              }}
            >
              Active filters:
            </span>
            {filter !== "all" && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                Source: {filter}
                <iconify-icon
                  icon="lucide:x"
                  style={{ fontSize: "12px", cursor: "pointer" }}
                  onClick={() => setFilter("all")}
                ></iconify-icon>
              </span>
            )}
            {statusFilter !== "all" && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  background: getStatusStyle(statusFilter).bg,
                  color: getStatusStyle(statusFilter).color,
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                Status: {statusFilter}
                <iconify-icon
                  icon="lucide:x"
                  style={{ fontSize: "12px", cursor: "pointer" }}
                  onClick={() => setStatusFilter("all")}
                ></iconify-icon>
              </span>
            )}
            {typeFilter.map((t) => (
              <span
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  background: CATEGORY_COLORS[t]?.bg || "#334155",
                  color: CATEGORY_COLORS[t]?.text || "#fff",
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                {t}
                <iconify-icon
                  icon="lucide:x"
                  style={{ fontSize: "12px", cursor: "pointer" }}
                  onClick={() =>
                    toggleArrayFilter(typeFilter, setTypeFilter, t)
                  }
                ></iconify-icon>
              </span>
            ))}
            {domainFilter.map((d) => (
              <span
                key={d}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                {d}
                <iconify-icon
                  icon="lucide:x"
                  style={{ fontSize: "12px", cursor: "pointer" }}
                  onClick={() =>
                    toggleArrayFilter(domainFilter, setDomainFilter, d)
                  }
                ></iconify-icon>
              </span>
            ))}
            {modeFilter.map((m) => (
              <span
                key={m}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                {m}
                <iconify-icon
                  icon="lucide:x"
                  style={{ fontSize: "12px", cursor: "pointer" }}
                  onClick={() =>
                    toggleArrayFilter(modeFilter, setModeFilter, m)
                  }
                ></iconify-icon>
              </span>
            ))}
            {(dateRange.from || dateRange.to) && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                Date: {dateRange.from || "..."} to {dateRange.to || "..."}
                <iconify-icon
                  icon="lucide:x"
                  style={{ fontSize: "12px", cursor: "pointer" }}
                  onClick={() => setDateRange({ from: "", to: "" })}
                ></iconify-icon>
              </span>
            )}
            {(positionRange.from || positionRange.to) && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(245, 158, 11, 0.2)",
                  color: "#f59e0b",
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                <iconify-icon
                  icon="lucide:trophy"
                  style={{ fontSize: "12px" }}
                ></iconify-icon>
                Position: {positionRange.from || "1"} -{" "}
                {positionRange.to || "any"}
                <iconify-icon
                  icon="lucide:x"
                  style={{ fontSize: "12px", cursor: "pointer" }}
                  onClick={() => setPositionRange({ from: "", to: "" })}
                ></iconify-icon>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "24px",
        }}
      >
        {filteredEvents.map((event) => {
          const statusStyle = getStatusStyle(event.status);
          const typeColor = CATEGORY_COLORS[event.type] || {
            bg: "#334155",
            text: "#fff",
          };
          const hasWinners = event.winnersFromCollege.length > 0;

          return (
            <div
              key={event.id}
              onClick={() => navigate(`/admin/events-overview/${event.id}`)}
              style={{
                background: "var(--card)",
                border: hasWinners
                  ? "2px solid rgba(245, 158, 11, 0.4)"
                  : "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px -10px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Image */}
              <div style={{ height: "160px", position: "relative" }}>
                <img
                  src={event.image}
                  alt={event.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: typeColor.bg,
                    color: typeColor.text,
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {event.type}
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {event.status}
                </span>
                {hasWinners && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      background: "rgba(245, 158, 11, 0.95)",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <iconify-icon
                      icon="lucide:trophy"
                      style={{ fontSize: "12px" }}
                    ></iconify-icon>
                    Winner
                  </div>
                )}
              </div>

              {/* Body */}
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#f59e0b",
                    fontWeight: 700,
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  {new Date(event.startDate)
                    .toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  {event.title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--muted-foreground)",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <iconify-icon
                    icon="lucide:building-2"
                    style={{ fontSize: "14px" }}
                  ></iconify-icon>
                  {event.organizer}
                </div>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      background: event.isInternal
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(139, 92, 246, 0.1)",
                      color: event.isInternal ? "#22c55e" : "#8b5cf6",
                      fontWeight: 500,
                    }}
                  >
                    {event.isInternal ? "Internal" : "External"}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      background: "var(--muted)",
                      color: "var(--muted-foreground)",
                      fontWeight: 500,
                    }}
                  >
                    {event.domain}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      background: "var(--muted)",
                      color: "var(--muted-foreground)",
                      fontWeight: 500,
                    }}
                  >
                    {event.mode}
                  </span>
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "14px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#3b82f6",
                        }}
                      >
                        {event.registeredTeamsFromCollege.length}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        Our Teams
                      </div>
                    </div>
                    {hasWinners && (
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#f59e0b",
                          }}
                        >
                          {event.winnersFromCollege.length}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          Wins
                        </div>
                      </div>
                    )}
                  </div>
                  <iconify-icon
                    icon="lucide:chevron-right"
                    style={{
                      fontSize: "20px",
                      color: "var(--muted-foreground)",
                    }}
                  ></iconify-icon>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div
          style={{
            ...card,
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <iconify-icon
            icon="lucide:calendar-x"
            style={{
              fontSize: "48px",
              color: "var(--muted-foreground)",
              opacity: 0.5,
            }}
          ></iconify-icon>
          <p
            style={{
              fontSize: "16px",
              color: "var(--muted-foreground)",
              marginTop: "16px",
            }}
          >
            No events found matching your filters
          </p>
        </div>
      )}
    </div>
  );
}
