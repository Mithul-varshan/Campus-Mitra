import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvents } from "../../context/EventsContext";

/* ===== CONSTANTS ===== */
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "All Years"];
const DEPARTMENTS = [
  "CSE",
  "ECE",
  "IT",
  "MECH",
  "CIVIL",
  "EEE",
  "AIDS",
  "AIML",
  "All Departments",
];

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

/* ===== STYLES (Matching Dashboard Theme) ===== */
const kpiCard = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: "20px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  position: "relative",
  overflow: "hidden",
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

const kpiSubtext = {
  fontSize: "12px",
  marginTop: "8px",
  color: "var(--muted-foreground)",
  display: "flex",
  alignItems: "center",
  gap: "4px",
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

/* ===== MAIN COMPONENT ===== */
export default function AdminIncomingEvents() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { incomingEvents, registrations, updateIncomingEventStatus } =
    useEvents();

  const [events, setEvents] = useState(incomingEvents);

  // Sync local state with context updates
  useEffect(() => {
    setEvents(incomingEvents);
  }, [incomingEvents]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedEventForApproval, setSelectedEventForApproval] =
    useState(null);
  const [approvalSettings, setApprovalSettings] = useState({
    eligibleYears: [],
    eligibleDepartments: [],
    maxParticipants: 20,
    requiresMentorApproval: true,
  });

  const selectedEvent = eventId ? events.find((e) => e.id === eventId) : null;

  const handleNavigateToEvent = (event) => {
    navigate(`/admin/incoming-events/${event.id}`);
  };

  const handleBack = () => {
    navigate("/admin/incoming-events");
  };

  const handleOpenApprovalModal = (event) => {
    setSelectedEventForApproval(event);
    setApprovalSettings({
      eligibleYears: event.collegeSettings?.eligibleYears || [],
      eligibleDepartments: event.collegeSettings?.eligibleDepartments || [],
      maxParticipants: event.collegeSettings?.maxParticipants || 20,
      requiresMentorApproval:
        event.collegeSettings?.requiresMentorApproval ?? true,
    });
    setShowApprovalModal(true);
  };

  const handleApproveEvent = () => {
    const eventToApprove = selectedEventForApproval || selectedEvent;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventToApprove.id
          ? {
              ...e,
              status: "approved",
              collegeSettings: {
                ...approvalSettings,
                approvedAt: new Date().toISOString().split("T")[0],
              },
            }
          : e,
      ),
    );
    setShowApprovalModal(false);
    setSelectedEventForApproval(null);
  };

  const handleRejectEvent = (eventId, reason = "") => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: "rejected",
              rejectedAt: new Date().toISOString().split("T")[0],
              rejectionReason: reason,
            }
          : e,
      ),
    );
  };

  const handleMultiSelect = (field, value) => {
    setApprovalSettings((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalStats = {
    total: events.length,
    pending: events.filter((e) => e.status === "pending").length,
    approved: events.filter((e) => e.status === "approved").length,
    rejected: events.filter((e) => e.status === "rejected").length,
    totalRegistered: Object.values(registrations).flat().length,
  };

  const getStatusStyle = (status) => {
    const styles = {
      approved: {
        bg: "rgba(34, 197, 94, 0.1)",
        color: "#16a34a",
        border: "1px solid rgba(34, 197, 94, 0.2)",
      },
      pending: {
        bg: "rgba(245, 158, 11, 0.1)",
        color: "#d97706",
        border: "1px solid rgba(245, 158, 11, 0.2)",
      },
      rejected: {
        bg: "rgba(239, 68, 68, 0.1)",
        color: "#dc2626",
        border: "1px solid rgba(239, 68, 68, 0.2)",
      },
    };
    return styles[status] || styles.pending;
  };

  /* ===== EVENT DETAIL VIEW ===== */
  if (selectedEvent) {
    const eventRegistrations = registrations[selectedEvent.id] || [];
    const statusStyle = getStatusStyle(selectedEvent.status);

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        {/* Approval Modal */}
        {showApprovalModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "var(--card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                width: "100%",
                maxWidth: "600px",
                padding: "24px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  margin: "0 0 8px 0",
                }}
              >
                Approve Event
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--muted-foreground)",
                  margin: "0 0 24px 0",
                }}
              >
                Set eligibility criteria and participation limits for students
                from your college.
              </p>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Eligible Years
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {YEARS.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleMultiSelect("eligibleYears", year)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: "1px solid var(--border)",
                        background: approvalSettings.eligibleYears.includes(
                          year,
                        )
                          ? "var(--primary)"
                          : "var(--background)",
                        color: approvalSettings.eligibleYears.includes(year)
                          ? "white"
                          : "var(--foreground)",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Eligible Departments
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() =>
                        handleMultiSelect("eligibleDepartments", dept)
                      }
                      style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: "1px solid var(--border)",
                        background:
                          approvalSettings.eligibleDepartments.includes(dept)
                            ? "var(--primary)"
                            : "var(--background)",
                        color: approvalSettings.eligibleDepartments.includes(
                          dept,
                        )
                          ? "white"
                          : "var(--foreground)",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Maximum Participants from College
                </label>
                <input
                  type="number"
                  value={approvalSettings.maxParticipants}
                  onChange={(e) =>
                    setApprovalSettings((prev) => ({
                      ...prev,
                      maxParticipants: parseInt(e.target.value) || 0,
                    }))
                  }
                  min={1}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={approvalSettings.requiresMentorApproval}
                    onChange={(e) =>
                      setApprovalSettings((prev) => ({
                        ...prev,
                        requiresMentorApproval: e.target.checked,
                      }))
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "var(--primary)",
                    }}
                  />
                  Require Mentor Approval for Registration
                </label>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                    margin: "8px 0 0 28px",
                  }}
                >
                  Students will need their mentor's approval before they can
                  register for this event.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedEventForApproval(null);
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--foreground)",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveEvent}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: "#22c55e",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <iconify-icon icon="lucide:check"></iconify-icon> Approve
                  Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={handleBack}
            style={{
              padding: "10px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              cursor: "pointer",
              display: "flex",
              marginTop: "4px",
            }}
          >
            <iconify-icon
              icon="lucide:arrow-left"
              style={{ fontSize: "18px" }}
            ></iconify-icon>
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <img
                src={selectedEvent.organizerLogo}
                alt=""
                style={{ width: "40px", height: "40px", borderRadius: "10px" }}
              />
              <div>
                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: 600,
                    margin: "0 0 4px 0",
                    color: "var(--foreground)",
                  }}
                >
                  {selectedEvent.title}
                </h1>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--muted-foreground)",
                    margin: 0,
                  }}
                >
                  Organized by {selectedEvent.organizer}
                </p>
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 500,
                  background: statusStyle.bg,
                  color: statusStyle.color,
                  textTransform: "capitalize",
                }}
              >
                {selectedEvent.status}
              </span>
            </div>
          </div>
          {selectedEvent.status === "pending" && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleOpenApprovalModal(selectedEvent)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: "#22c55e",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                <iconify-icon icon="lucide:check"></iconify-icon> Approve
              </button>
              <button
                onClick={() => handleRejectEvent(selectedEvent.id)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #dc2626",
                  background: "transparent",
                  color: "#dc2626",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                <iconify-icon icon="lucide:x"></iconify-icon> Reject
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
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
              label: "External Registrations",
              value: selectedEvent.externalRegistrations.toLocaleString(),
              icon: "lucide:users",
              color: "#6366f1",
            },
            {
              label: "Our Students",
              value: eventRegistrations.length,
              icon: "lucide:school",
              color: "#8b5cf6",
            },
            {
              label: "Max Allowed",
              value: selectedEvent.collegeSettings?.maxParticipants || "—",
              icon: "lucide:user-check",
              color: "#22c55e",
            },
            {
              label: "Registration Fee",
              value:
                selectedEvent.registrationFee > 0
                  ? `₹${selectedEvent.registrationFee}`
                  : "Free",
              icon: "lucide:indian-rupee",
              color: "#f59e0b",
            },
            {
              label: "Days Left",
              value: Math.max(
                0,
                Math.ceil(
                  (new Date(selectedEvent.registrationDeadline) - new Date()) /
                    (1000 * 60 * 60 * 24),
                ),
              ),
              icon: "lucide:calendar",
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

        {/* Event Details & Settings */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div style={card}>
            <div style={cardHeaderRow}>
              <h3 style={cardTitle}>Event Details</h3>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 500,
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                }}
              >
                {selectedEvent.type}
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "var(--muted-foreground)",
                lineHeight: 1.7,
                margin: "0 0 20px 0",
              }}
            >
              {selectedEvent.description}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              {[
                {
                  icon: "lucide:folder",
                  label: "Domain",
                  value: selectedEvent.domain,
                },
                {
                  icon: "lucide:calendar",
                  label: "Event Date",
                  value: `${new Date(selectedEvent.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${new Date(selectedEvent.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
                },
                {
                  icon: "lucide:clock",
                  label: "Registration Deadline",
                  value: new Date(
                    selectedEvent.registrationDeadline,
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                },
                {
                  icon: "lucide:map-pin",
                  label: "Venue",
                  value: selectedEvent.venue,
                },
                {
                  icon: "lucide:monitor",
                  label: "Mode",
                  value:
                    selectedEvent.mode.charAt(0).toUpperCase() +
                    selectedEvent.mode.slice(1),
                },
                {
                  icon: "lucide:users",
                  label: "Team Size",
                  value:
                    selectedEvent.minTeamSize === selectedEvent.maxTeamSize
                      ? `${selectedEvent.minTeamSize} member${selectedEvent.minTeamSize > 1 ? "s" : ""}`
                      : `${selectedEvent.minTeamSize} - ${selectedEvent.maxTeamSize} members`,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px",
                    background: "var(--muted)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <iconify-icon
                    icon={item.icon}
                    style={{
                      fontSize: "18px",
                      color: "var(--primary)",
                      marginTop: "2px",
                    }}
                  ></iconify-icon>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        marginBottom: "2px",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "var(--foreground)",
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prizes */}
            {selectedEvent.prizes?.some((p) => p.amount) && (
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "12px",
                  }}
                >
                  Prizes
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  {selectedEvent.prizes
                    .filter((p) => p.amount)
                    .map((prize, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "12px 16px",
                          background: "var(--muted)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        <span style={{ fontSize: "24px" }}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "var(--foreground)",
                          }}
                        >
                          ₹{Number(prize.amount).toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* College Settings */}
            <div style={card}>
              <div style={cardHeaderRow}>
                <h3 style={cardTitle}>College Settings</h3>
                {selectedEvent.status === "approved" && (
                  <button
                    onClick={() => handleOpenApprovalModal(selectedEvent)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      color: "var(--foreground)",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <iconify-icon icon="lucide:edit-2"></iconify-icon> Edit
                  </button>
                )}
              </div>
              {selectedEvent.status === "approved" &&
              selectedEvent.collegeSettings ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        marginBottom: "8px",
                      }}
                    >
                      Eligible Years
                    </div>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                    >
                      {(selectedEvent.collegeSettings.eligibleYears.length > 0
                        ? selectedEvent.collegeSettings.eligibleYears
                        : ["All Years"]
                      ).map((year, i) => (
                        <span
                          key={i}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            background: "rgba(99, 102, 241, 0.1)",
                            color: "#6366f1",
                            fontWeight: 500,
                          }}
                        >
                          {year}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        marginBottom: "8px",
                      }}
                    >
                      Eligible Departments
                    </div>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                    >
                      {(selectedEvent.collegeSettings.eligibleDepartments
                        .length > 0
                        ? selectedEvent.collegeSettings.eligibleDepartments
                        : ["All Departments"]
                      ).map((dept, i) => (
                        <span
                          key={i}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            background: "rgba(139, 92, 246, 0.1)",
                            color: "#8b5cf6",
                            fontWeight: 500,
                          }}
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "var(--muted)",
                        borderRadius: "var(--radius-md)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "var(--foreground)",
                        }}
                      >
                        {selectedEvent.collegeSettings.maxParticipants}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        Max Allowed
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "var(--muted)",
                        borderRadius: "var(--radius-md)",
                        textAlign: "center",
                      }}
                    >
                      <iconify-icon
                        icon={
                          selectedEvent.collegeSettings.requiresMentorApproval
                            ? "lucide:check-circle"
                            : "lucide:x-circle"
                        }
                        style={{
                          fontSize: "20px",
                          color: selectedEvent.collegeSettings
                            .requiresMentorApproval
                            ? "#22c55e"
                            : "#6b7280",
                        }}
                      ></iconify-icon>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                          marginTop: "4px",
                        }}
                      >
                        Mentor Approval
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedEvent.status === "rejected" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px",
                    gap: "8px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:x-circle"
                    style={{ fontSize: "40px", color: "#dc2626" }}
                  ></iconify-icon>
                  <p
                    style={{ margin: 0, textAlign: "center", fontSize: "14px" }}
                  >
                    Event rejected
                  </p>
                  {selectedEvent.rejectionReason && (
                    <p
                      style={{
                        margin: 0,
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      {selectedEvent.rejectionReason}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px",
                    gap: "8px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:clock"
                    style={{ fontSize: "40px", color: "#f59e0b" }}
                  ></iconify-icon>
                  <p
                    style={{ margin: 0, textAlign: "center", fontSize: "14px" }}
                  >
                    Pending approval
                  </p>
                  <p
                    style={{ margin: 0, textAlign: "center", fontSize: "12px" }}
                  >
                    Approve to set eligibility criteria
                  </p>
                </div>
              )}
            </div>

            {/* Invitation Info */}
            <div style={card}>
              <div style={cardHeaderRow}>
                <h3 style={cardTitle}>Invitation Details</h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    color: "var(--foreground)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:mail"
                    style={{ color: "var(--muted-foreground)" }}
                  ></iconify-icon>
                  <span style={{ color: "var(--muted-foreground)" }}>
                    Invited on
                  </span>
                  {new Date(selectedEvent.invitedAt).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short", year: "numeric" },
                  )}
                </div>
                {selectedEvent.collegeSettings?.approvedAt && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                      color: "var(--foreground)",
                    }}
                  >
                    <iconify-icon
                      icon="lucide:check"
                      style={{ color: "#22c55e" }}
                    ></iconify-icon>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Approved on
                    </span>
                    {new Date(
                      selectedEvent.collegeSettings.approvedAt,
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                )}
                {selectedEvent.rejectedAt && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                      color: "var(--foreground)",
                    }}
                  >
                    <iconify-icon
                      icon="lucide:x"
                      style={{ color: "#dc2626" }}
                    ></iconify-icon>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Rejected on
                    </span>
                    {new Date(selectedEvent.rejectedAt).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Registered Students */}
        {selectedEvent.status === "approved" && (
          <div style={card}>
            <div style={cardHeaderRow}>
              <h3 style={cardTitle}>
                Registered Students
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "var(--muted-foreground)",
                  }}
                >
                  ({eventRegistrations.length}/
                  {selectedEvent.collegeSettings?.maxParticipants || "—"})
                </span>
              </h3>
              <button
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--foreground)",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <iconify-icon icon="lucide:download"></iconify-icon> Export
              </button>
            </div>
            {eventRegistrations.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "48px",
                  gap: "12px",
                  color: "var(--muted-foreground)",
                }}
              >
                <iconify-icon
                  icon="lucide:users-x"
                  style={{ fontSize: "48px" }}
                ></iconify-icon>
                <p style={{ margin: 0 }}>No students registered yet</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--foreground)",
                        }}
                      >
                        Student
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--foreground)",
                        }}
                      >
                        Department
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--foreground)",
                        }}
                      >
                        Year
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--foreground)",
                        }}
                      >
                        Email
                      </th>
                      {selectedEvent.collegeSettings
                        ?.requiresMentorApproval && (
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "left",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--foreground)",
                          }}
                        >
                          Mentor Approval
                        </th>
                      )}
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--foreground)",
                        }}
                      >
                        Registered
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventRegistrations.map((reg) => {
                      const approvalStyle = getStatusStyle(
                        reg.mentorApproval === "not_required"
                          ? "approved"
                          : reg.mentorApproval,
                      );
                      return (
                        <tr
                          key={reg.id}
                          style={{ borderBottom: "1px solid var(--border)" }}
                        >
                          <td
                            style={{
                              padding: "12px",
                              fontSize: "14px",
                              color: "var(--foreground)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "8px",
                                  background: "var(--primary)",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 600,
                                  fontSize: "14px",
                                }}
                              >
                                {reg.studentName.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 500 }}>
                                  {reg.studentName}
                                </div>
                                {reg.teamName && (
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "var(--primary)",
                                    }}
                                  >
                                    {reg.teamName}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              fontSize: "14px",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            {reg.department}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              fontSize: "14px",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            Year {reg.year}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              fontSize: "14px",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            {reg.email}
                          </td>
                          {selectedEvent.collegeSettings
                            ?.requiresMentorApproval && (
                            <td style={{ padding: "12px" }}>
                              <span
                                style={{
                                  padding: "3px 8px",
                                  borderRadius: "20px",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  background: approvalStyle.bg,
                                  color: approvalStyle.color,
                                  textTransform: "capitalize",
                                }}
                              >
                                {reg.mentorApproval === "not_required"
                                  ? "N/A"
                                  : reg.mentorApproval}
                              </span>
                            </td>
                          )}
                          <td
                            style={{
                              padding: "12px",
                              fontSize: "14px",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            {new Date(reg.registeredAt).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short" },
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  /* ===== LIST VIEW ===== */
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
      {/* Approval Modal */}
      {showApprovalModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              width: "100%",
              maxWidth: "600px",
              padding: "24px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--foreground)",
                margin: "0 0 8px 0",
              }}
            >
              Approve Event
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--muted-foreground)",
                margin: "0 0 24px 0",
              }}
            >
              Set eligibility criteria and participation limits for students
              from your college.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  marginBottom: "10px",
                }}
              >
                Eligible Years
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {YEARS.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleMultiSelect("eligibleYears", year)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      border: "1px solid var(--border)",
                      background: approvalSettings.eligibleYears.includes(year)
                        ? "var(--primary)"
                        : "var(--background)",
                      color: approvalSettings.eligibleYears.includes(year)
                        ? "white"
                        : "var(--foreground)",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  marginBottom: "10px",
                }}
              >
                Eligible Departments
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() =>
                      handleMultiSelect("eligibleDepartments", dept)
                    }
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      border: "1px solid var(--border)",
                      background: approvalSettings.eligibleDepartments.includes(
                        dept,
                      )
                        ? "var(--primary)"
                        : "var(--background)",
                      color: approvalSettings.eligibleDepartments.includes(dept)
                        ? "white"
                        : "var(--foreground)",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  marginBottom: "6px",
                }}
              >
                Maximum Participants from College
              </label>
              <input
                type="number"
                value={approvalSettings.maxParticipants}
                onChange={(e) =>
                  setApprovalSettings((prev) => ({
                    ...prev,
                    maxParticipants: parseInt(e.target.value) || 0,
                  }))
                }
                min={1}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "14px",
                  color: "var(--foreground)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={approvalSettings.requiresMentorApproval}
                  onChange={(e) =>
                    setApprovalSettings((prev) => ({
                      ...prev,
                      requiresMentorApproval: e.target.checked,
                    }))
                  }
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "var(--primary)",
                  }}
                />
                Require Mentor Approval for Registration
              </label>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedEventForApproval(null);
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--foreground)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApproveEvent}
                style={{
                  padding: "10px 24px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: "#22c55e",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <iconify-icon icon="lucide:check"></iconify-icon> Approve Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 600,
            margin: "0 0 4px 0",
            color: "var(--foreground)",
          }}
        >
          Incoming Events
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--muted-foreground)",
            margin: 0,
          }}
        >
          Manage event invitations from other colleges and organizations
        </p>
      </div>

      {/* KPI Cards */}
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
            label: "Total Invitations",
            value: totalStats.total,
            icon: "lucide:mail",
            color: "#6366f1",
          },
          {
            label: "Pending",
            value: totalStats.pending,
            icon: "lucide:clock",
            color: "#f59e0b",
          },
          {
            label: "Approved",
            value: totalStats.approved,
            icon: "lucide:check-circle",
            color: "#22c55e",
          },
          {
            label: "Rejected",
            value: totalStats.rejected,
            icon: "lucide:x-circle",
            color: "#ef4444",
          },
          {
            label: "Students Registered",
            value: totalStats.totalRegistered,
            icon: "lucide:users",
            color: "#8b5cf6",
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

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: "360px" }}>
          <iconify-icon
            icon="lucide:search"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted-foreground)",
              fontSize: "16px",
            }}
          ></iconify-icon>
          <input
            type="text"
            placeholder="Search events or organizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 38px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--foreground)",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
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
          const hasPrizes = event.prizes && event.prizes.length > 0;
          const daysLeft = Math.max(
            0,
            Math.ceil(
              (new Date(event.registrationDeadline) - new Date()) /
                (1000 * 60 * 60 * 24),
            ),
          );

          return (
            <div
              key={event.id}
              onClick={() => handleNavigateToEvent(event)}
              style={{
                background: "var(--card)",
                border:
                  event.status === "approved"
                    ? "2px solid rgba(34, 197, 94, 0.4)"
                    : event.status === "rejected"
                      ? "2px solid rgba(239, 68, 68, 0.3)"
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
                    border: statusStyle.border,
                  }}
                >
                  {event.status}
                </span>
                {hasPrizes && (
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
                    ₹{Number(event.prizes[0]?.amount || 0).toLocaleString()}
                  </div>
                )}
                {/* Organizer Logo */}
                <img
                  src={event.organizerLogo}
                  alt=""
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "2px solid white",
                  }}
                />
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
                      textTransform: "capitalize",
                    }}
                  >
                    {event.mode}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      background:
                        event.registrationFee > 0
                          ? "rgba(245, 158, 11, 0.1)"
                          : "rgba(34, 197, 94, 0.1)",
                      color: event.registrationFee > 0 ? "#f59e0b" : "#22c55e",
                      fontWeight: 500,
                    }}
                  >
                    {event.registrationFee > 0
                      ? `₹${event.registrationFee}`
                      : "Free"}
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
                        {event.externalRegistrations.toLocaleString()}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        Registrations
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: daysLeft <= 3 ? "#ef4444" : "#8b5cf6",
                        }}
                      >
                        {daysLeft}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        Days Left
                      </div>
                    </div>
                  </div>
                  {event.status === "pending" ? (
                    <div
                      style={{ display: "flex", gap: "6px" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleOpenApprovalModal(event)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "var(--radius-md)",
                          border: "none",
                          background: "#22c55e",
                          color: "white",
                          fontSize: "11px",
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <iconify-icon icon="lucide:check"></iconify-icon>
                      </button>
                      <button
                        onClick={() => handleRejectEvent(event.id)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid #dc2626",
                          background: "transparent",
                          color: "#dc2626",
                          fontSize: "11px",
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <iconify-icon icon="lucide:x"></iconify-icon>
                      </button>
                    </div>
                  ) : (
                    <iconify-icon
                      icon="lucide:chevron-right"
                      style={{
                        fontSize: "20px",
                        color: "var(--muted-foreground)",
                      }}
                    ></iconify-icon>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px",
            gap: "16px",
            color: "var(--muted-foreground)",
          }}
        >
          <iconify-icon
            icon="lucide:inbox"
            style={{ fontSize: "56px" }}
          ></iconify-icon>
          <p style={{ margin: 0, fontSize: "16px" }}>
            No incoming events found
          </p>
        </div>
      )}
    </div>
  );
}
