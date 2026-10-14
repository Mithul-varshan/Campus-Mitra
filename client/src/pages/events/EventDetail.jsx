import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEvents } from "../../context/EventsContext";
import { SEED_STUDENTS } from "../../data/seeds";

// User profile (would come from auth context in production)
const USER_PROFILE = {
  id: "s1",
  name: "Ananya Gupta",
  department: "CSE",
  year: "3rd Year",
  siiScore: 892,
  skills: ["Python", "Machine Learning", "React", "Node.js", "Data Science"],
};

// Available participants for team selection (excluding current user)
const AVAILABLE_PARTICIPANTS = SEED_STUDENTS.filter(
  (s) => s.id !== USER_PROFILE.id,
);

// Local storage keys for persistence
const REGISTRATIONS_KEY = "campusmitra_registrations";
const INVITATIONS_KEY = "campusmitra_invitations";

// Load from localStorage
const loadFromStorage = (key, defaultVal = []) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultVal;
  } catch {
    return defaultVal;
  }
};

// Save to localStorage
const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Helper function to format date for display
const formatEventDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options = { month: "short", day: "numeric", year: "numeric" };

  if (startDate === endDate) {
    return start.toLocaleDateString("en-US", options);
  }

  const startStr = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endStr = end.toLocaleDateString("en-US", options);
  return `${startStr} - ${endStr}`;
};

// Helper to calculate days until registration closes
const getDaysUntilDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Closed";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day";
  return `${diffDays} days`;
};

// Helper to format mode display
const formatMode = (mode) => {
  const modeMap = {
    online: "Online",
    offline: "Offline",
    hybrid: "Online / Hybrid",
  };
  return modeMap[mode] || mode;
};

// Helper to build timeline from event data
const buildTimeline = (event) => {
  const timeline = [];

  if (event.registrationDeadline) {
    const date = new Date(event.registrationDeadline);
    timeline.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      event: "Registration Closes",
    });
  }

  if (event.startDate) {
    const start = new Date(event.startDate);
    timeline.push({
      date: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - 9:00 AM`,
      event: `${event.eventType} Begins`,
    });
  }

  if (event.endDate && event.endDate !== event.startDate) {
    const end = new Date(event.endDate);
    timeline.push({
      date: `${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - 5:00 PM`,
      event: "Closing Ceremony",
    });
  }

  return timeline;
};

// Helper to transform prizes
const transformPrizes = (winnerSlots) => {
  if (!winnerSlots || winnerSlots.length === 0) return [];

  return winnerSlots.map((slot, index) => ({
    place: slot.rank,
    amount:
      slot.prizeType === "Cash"
        ? `₹${parseInt(slot.prizeValue).toLocaleString("en-IN")}`
        : slot.prizeValue,
    color: index === 0 ? "#f59e0b" : index === 1 ? "#94a3b8" : "#cd7f32",
  }));
};

// Fallback for events not found
const defaultEvent = {
  id: 0,
  title: "Event Details",
  category: "Event",
  mode: "TBD",
  host: "Unknown",
  dates: "TBD",
  image:
    "https://images.unsplash.com/photo-1504384308090-c54be3855463?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  description: "Event details are not available at the moment.",
  tags: [],
  problemStatements: [],
  timeline: [],
  prizes: [],
  registrationCloses: "N/A",
  format: "N/A",
  eligibility: "N/A",
  regFee: "N/A",
  seatsLeft: "N/A",
  organizer: { name: "N/A", location: "N/A" },
  suggestedTeammates: [],
  aiRecommendation: "",
};

// ===== REGISTRATION FORM MODAL COMPONENT =====
const RegistrationModal = ({
  event,
  onClose,
  onSubmit,
  availableParticipants,
  currentUser,
}) => {
  const [formData, setFormData] = useState({
    fullName: currentUser.name,
    email: `${currentUser.name.toLowerCase().replace(/\s/g, ".")}@campus.edu`,
    phone: "",
    rollNo: "",
    department: currentUser.department,
    year: currentUser.year,
    teamName: "",
    teammates: [],
    paymentStatus: event.registrationFee > 0 ? "pending" : "not_required",
  });

  const [teammateSearch, setTeammateSearch] = useState("");
  const [showTeammateDropdown, setShowTeammateDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  const isTeamEvent = event.maxTeamSize > 1;
  const minTeamSize = event.minTeamSize || 1;
  const maxTeamSize = event.maxTeamSize || 1;

  // Filter available participants based on search
  const filteredParticipants = useMemo(() => {
    if (!teammateSearch.trim()) return availableParticipants.slice(0, 5);
    const searchLower = teammateSearch.toLowerCase();
    return availableParticipants
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.email.toLowerCase().includes(searchLower) ||
          p.rollNo.toLowerCase().includes(searchLower) ||
          p.department.toLowerCase().includes(searchLower),
      )
      .slice(0, 10);
  }, [teammateSearch, availableParticipants]);

  const addTeammate = (participant) => {
    if (formData.teammates.length >= maxTeamSize - 1) return;
    if (formData.teammates.find((t) => t.id === participant.id)) return;

    setFormData((prev) => ({
      ...prev,
      teammates: [...prev.teammates, { ...participant, status: "pending" }],
    }));
    setTeammateSearch("");
    setShowTeammateDropdown(false);
  };

  const removeTeammate = (id) => {
    setFormData((prev) => ({
      ...prev,
      teammates: prev.teammates.filter((t) => t.id !== id),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.rollNo.trim()) newErrors.rollNo = "Roll number is required";

    if (isTeamEvent) {
      if (!formData.teamName.trim())
        newErrors.teamName = "Team name is required";
      const totalTeamSize = formData.teammates.length + 1;
      if (totalTeamSize < minTeamSize) {
        newErrors.teammates = `Minimum ${minTeamSize} team members required (including you)`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const registration = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      eventImage: event.image,
      eventDate: event.startDate,
      eventEndDate: event.endDate,
      eventType: event.eventType,
      registeredBy: currentUser.id,
      registeredByName: currentUser.name,
      ...formData,
      status:
        isTeamEvent && formData.teammates.length > 0
          ? "draft"
          : event.registrationFee > 0 && formData.paymentStatus !== "paid"
            ? "draft"
            : "registered",
      createdAt: new Date().toISOString(),
      isTeamEvent,
      maxTeamSize,
      minTeamSize,
      registrationFee: event.registrationFee,
    };

    onSubmit(registration);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 4px 0",
                fontSize: "20px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Register for Event
            </h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
              {event.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#64748b",
              padding: "4px",
            }}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {/* Event Info Badge */}
          <div
            style={{
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "24px",
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
              }}
            >
              <iconify-icon
                icon="lucide:calendar"
                style={{ color: "#0284c7" }}
              ></iconify-icon>
              <span style={{ color: "#0369a1" }}>{event.startDate}</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
              }}
            >
              <iconify-icon
                icon="lucide:users"
                style={{ color: "#0284c7" }}
              ></iconify-icon>
              <span style={{ color: "#0369a1" }}>
                {isTeamEvent
                  ? `Team: ${minTeamSize}-${maxTeamSize} members`
                  : "Individual"}
              </span>
            </div>
            {event.registrationFee > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                }}
              >
                <iconify-icon
                  icon="lucide:indian-rupee"
                  style={{ color: "#0284c7" }}
                ></iconify-icon>
                <span style={{ color: "#0369a1" }}>
                  ₹{event.registrationFee}
                </span>
              </div>
            )}
          </div>

          {/* Personal Details Section */}
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "16px",
              }}
            >
              Personal Details
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#64748b",
                    marginBottom: "6px",
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: errors.fullName
                      ? "1px solid #ef4444"
                      : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {errors.fullName && (
                  <span style={{ fontSize: "11px", color: "#ef4444" }}>
                    {errors.fullName}
                  </span>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#64748b",
                    marginBottom: "6px",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: errors.email
                      ? "1px solid #ef4444"
                      : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {errors.email && (
                  <span style={{ fontSize: "11px", color: "#ef4444" }}>
                    {errors.email}
                  </span>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#64748b",
                    marginBottom: "6px",
                  }}
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+91 XXXXXXXXXX"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: errors.phone
                      ? "1px solid #ef4444"
                      : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {errors.phone && (
                  <span style={{ fontSize: "11px", color: "#ef4444" }}>
                    {errors.phone}
                  </span>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#64748b",
                    marginBottom: "6px",
                  }}
                >
                  Roll Number *
                </label>
                <input
                  type="text"
                  value={formData.rollNo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, rollNo: e.target.value }))
                  }
                  placeholder="CS2021-045"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: errors.rollNo
                      ? "1px solid #ef4444"
                      : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {errors.rollNo && (
                  <span style={{ fontSize: "11px", color: "#ef4444" }}>
                    {errors.rollNo}
                  </span>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#64748b",
                    marginBottom: "6px",
                  }}
                >
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    background: "#f8fafc",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#64748b",
                    marginBottom: "6px",
                  }}
                >
                  Year
                </label>
                <input
                  type="text"
                  value={formData.year}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    background: "#f8fafc",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Team Details Section (if team event) */}
          {isTeamEvent && (
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "16px",
                }}
              >
                Team Details
              </h3>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#64748b",
                    marginBottom: "6px",
                  }}
                >
                  Team Name *
                </label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      teamName: e.target.value,
                    }))
                  }
                  placeholder="Enter your team name"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: errors.teamName
                      ? "1px solid #ef4444"
                      : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {errors.teamName && (
                  <span style={{ fontSize: "11px", color: "#ef4444" }}>
                    {errors.teamName}
                  </span>
                )}
              </div>

              {/* Add Teammates */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#64748b",
                    marginBottom: "6px",
                  }}
                >
                  Add Team Members ({formData.teammates.length + 1}/
                  {maxTeamSize})
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "relative" }}>
                    <iconify-icon
                      icon="lucide:search"
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#94a3b8",
                        fontSize: "16px",
                      }}
                    ></iconify-icon>
                    <input
                      type="text"
                      value={teammateSearch}
                      onChange={(e) => {
                        setTeammateSearch(e.target.value);
                        setShowTeammateDropdown(true);
                      }}
                      onFocus={() => setShowTeammateDropdown(true)}
                      placeholder="Search by name, email, roll number..."
                      disabled={formData.teammates.length >= maxTeamSize - 1}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 38px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Dropdown */}
                  {showTeammateDropdown &&
                    formData.teammates.length < maxTeamSize - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          background: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          marginTop: "4px",
                          maxHeight: "200px",
                          overflow: "auto",
                          zIndex: 10,
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                        }}
                      >
                        {filteredParticipants.length === 0 ? (
                          <div
                            style={{
                              padding: "12px 16px",
                              color: "#64748b",
                              fontSize: "13px",
                            }}
                          >
                            No participants found
                          </div>
                        ) : (
                          filteredParticipants
                            .filter(
                              (p) =>
                                !formData.teammates.find((t) => t.id === p.id),
                            )
                            .map((participant) => (
                              <div
                                key={participant.id}
                                onClick={() => addTeammate(participant)}
                                style={{
                                  padding: "10px 16px",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #f1f5f9",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.background = "#f8fafc")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.background = "white")
                                }
                              >
                                <div
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    background: "#e0e7ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 600,
                                    color: "#4f46e5",
                                    fontSize: "12px",
                                  }}
                                >
                                  {participant.avatar}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontWeight: 500,
                                      fontSize: "13px",
                                      color: "#0f172a",
                                    }}
                                  >
                                    {participant.name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#64748b",
                                    }}
                                  >
                                    {participant.rollNo} •{" "}
                                    {participant.department} •{" "}
                                    {participant.year}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    background: "#dcfce7",
                                    color: "#15803d",
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                  }}
                                >
                                  SII: {participant.siiScore}
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    )}
                </div>
                {errors.teammates && (
                  <span style={{ fontSize: "11px", color: "#ef4444" }}>
                    {errors.teammates}
                  </span>
                )}
              </div>

              {/* Selected Teammates */}
              {formData.teammates.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#64748b",
                      marginBottom: "8px",
                    }}
                  >
                    Selected Team Members (Invitations will be sent)
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {/* Current User (Leader) */}
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "#dcfce7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 600,
                          color: "#15803d",
                          fontSize: "12px",
                        }}
                      >
                        {currentUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 500,
                            fontSize: "13px",
                            color: "#0f172a",
                          }}
                        >
                          {currentUser.name}{" "}
                          <span style={{ color: "#15803d", fontSize: "11px" }}>
                            (You - Team Leader)
                          </span>
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          {currentUser.department} • {currentUser.year}
                        </div>
                      </div>
                      <iconify-icon
                        icon="lucide:crown"
                        style={{ color: "#f59e0b", fontSize: "18px" }}
                      ></iconify-icon>
                    </div>

                    {/* Teammates */}
                    {formData.teammates.map((teammate) => (
                      <div
                        key={teammate.id}
                        style={{
                          padding: "12px 16px",
                          background: "#fefce8",
                          border: "1px solid #fef08a",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "#fef3c7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                            color: "#b45309",
                            fontSize: "12px",
                          }}
                        >
                          {teammate.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: 500,
                              fontSize: "13px",
                              color: "#0f172a",
                            }}
                          >
                            {teammate.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            {teammate.rollNo} • {teammate.department}
                          </div>
                        </div>
                        <div
                          style={{
                            background: "#fef3c7",
                            color: "#b45309",
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
                            icon="lucide:clock"
                            style={{ fontSize: "10px" }}
                          ></iconify-icon>
                          Pending Invite
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTeammate(teammate.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#ef4444",
                            padding: "4px",
                          }}
                        >
                          <iconify-icon
                            icon="lucide:x"
                            style={{ fontSize: "16px" }}
                          ></iconify-icon>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Section */}
          {event.registrationFee > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "16px",
                }}
              >
                Registration Fee: ₹{event.registrationFee}
              </h3>
              <div style={{ display: "flex", gap: "12px" }}>
                <label
                  style={{
                    flex: 1,
                    padding: "16px",
                    border:
                      formData.paymentStatus === "paid"
                        ? "2px solid #10b981"
                        : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background:
                      formData.paymentStatus === "paid" ? "#f0fdf4" : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="paid"
                    checked={formData.paymentStatus === "paid"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentStatus: e.target.value,
                      }))
                    }
                    style={{ display: "none" }}
                  />
                  <iconify-icon
                    icon={
                      formData.paymentStatus === "paid"
                        ? "lucide:check-circle-2"
                        : "lucide:circle"
                    }
                    style={{
                      fontSize: "20px",
                      color:
                        formData.paymentStatus === "paid"
                          ? "#10b981"
                          : "#94a3b8",
                    }}
                  ></iconify-icon>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "#0f172a",
                      }}
                    >
                      Paid
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      Payment completed
                    </div>
                  </div>
                </label>
                <label
                  style={{
                    flex: 1,
                    padding: "16px",
                    border:
                      formData.paymentStatus === "pending"
                        ? "2px solid #f59e0b"
                        : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background:
                      formData.paymentStatus === "pending"
                        ? "#fffbeb"
                        : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="pending"
                    checked={formData.paymentStatus === "pending"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentStatus: e.target.value,
                      }))
                    }
                    style={{ display: "none" }}
                  />
                  <iconify-icon
                    icon={
                      formData.paymentStatus === "pending"
                        ? "lucide:check-circle-2"
                        : "lucide:circle"
                    }
                    style={{
                      fontSize: "20px",
                      color:
                        formData.paymentStatus === "pending"
                          ? "#f59e0b"
                          : "#94a3b8",
                    }}
                  ></iconify-icon>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "#0f172a",
                      }}
                    >
                      Pay Later
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      Save as draft
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Info Box for Team Events */}
          {isTeamEvent && formData.teammates.length > 0 && (
            <div
              style={{
                background: "#fefce8",
                border: "1px solid #fef08a",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <iconify-icon
                icon="lucide:info"
                style={{ color: "#ca8a04", fontSize: "18px", marginTop: "2px" }}
              ></iconify-icon>
              <div style={{ fontSize: "13px", color: "#854d0e" }}>
                <strong>Note:</strong> Invitations will be sent to your selected
                teammates. Your registration will be saved as{" "}
                <strong>Draft</strong> until all teammates accept. Once everyone
                accepts, your registration will be confirmed automatically.
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 24px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                background: "#1e3a8a",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isTeamEvent && formData.teammates.length > 0 ? (
                <>
                  <iconify-icon
                    icon="lucide:send"
                    style={{ fontSize: "16px" }}
                  ></iconify-icon>
                  Send Invitations & Register
                </>
              ) : (
                <>
                  <iconify-icon
                    icon="lucide:check"
                    style={{ fontSize: "16px" }}
                  ></iconify-icon>
                  Complete Registration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useEvents();

  // Registration modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrations, setRegistrations] = useState(() =>
    loadFromStorage(REGISTRATIONS_KEY, []),
  );
  const [invitations, setInvitations] = useState(() =>
    loadFromStorage(INVITATIONS_KEY, []),
  );

  // Persist registrations to localStorage
  useEffect(() => {
    saveToStorage(REGISTRATIONS_KEY, registrations);
  }, [registrations]);

  useEffect(() => {
    saveToStorage(INVITATIONS_KEY, invitations);
  }, [invitations]);

  // Get the raw context event for registration modal
  const contextEvent = useMemo(() => {
    return events.find((e) => e.id === id);
  }, [events, id]);

  // Check if user is already registered for this event
  const existingRegistration = useMemo(() => {
    return registrations.find((r) => r.eventId === id);
  }, [registrations, id]);

  // Handle registration submission
  const handleRegistrationSubmit = (registration) => {
    setRegistrations((prev) => [...prev, registration]);

    // If team event with teammates, create invitations
    if (registration.isTeamEvent && registration.teammates.length > 0) {
      const newInvitations = registration.teammates.map((teammate) => ({
        id: `inv-${Date.now()}-${teammate.id}`,
        registrationId: registration.id,
        eventId: registration.eventId,
        eventTitle: registration.eventTitle,
        eventImage: registration.eventImage,
        eventDate: registration.eventDate,
        teamName: registration.teamName,
        invitedBy: registration.registeredByName,
        invitedById: registration.registeredBy,
        invitedTo: teammate.id,
        invitedToName: teammate.name,
        teamSize: registration.teammates.length + 1,
        status: "pending",
        createdAt: new Date().toISOString(),
      }));
      setInvitations((prev) => [...prev, ...newInvitations]);
    }

    setShowRegistrationModal(false);
    alert(
      "Registration successful! " +
        (registration.status === "draft"
          ? "Check 'My Registered' tab for draft status."
          : ""),
    );
  };

  // Transform context event to display format
  const event = useMemo(() => {
    if (!contextEvent) return defaultEvent;

    const seats = contextEvent.seats;
    const totalSeats = contextEvent.totalSeats || contextEvent.maxParticipants;
    const seatsDisplay =
      seats === null ? "Unlimited" : `${seats} / ${totalSeats}`;

    const teamSize = contextEvent.maxTeamSize;
    const format =
      teamSize > 1
        ? `Team (${contextEvent.minTeamSize}-${teamSize} members)`
        : "Individual";

    const eligibleYears = contextEvent.eligibleYears || [];
    const eligibility =
      eligibleYears.length > 0 ? eligibleYears.join(", ") : "All Students";

    return {
      id: contextEvent.id,
      title: contextEvent.title,
      category: contextEvent.eventType,
      mode: formatMode(contextEvent.mode),
      host: contextEvent.collegeName || contextEvent.college,
      dates: formatEventDates(contextEvent.startDate, contextEvent.endDate),
      image: contextEvent.image,
      description: contextEvent.description,
      tags: contextEvent.tags || [],
      problemStatements: [], // Can be extended if needed
      timeline: buildTimeline(contextEvent),
      prizes: transformPrizes(contextEvent.winnerSlots),
      registrationCloses: getDaysUntilDeadline(
        contextEvent.registrationDeadline,
      ),
      format,
      eligibility,
      regFee:
        contextEvent.registrationFee === 0
          ? "Free"
          : `₹${contextEvent.registrationFee}`,
      seatsLeft: seatsDisplay,
      status: contextEvent.status || "open", // Add status for registration check
      isRegistrationClosed:
        contextEvent.status === "closed" ||
        contextEvent.registrationClosed === true,
      organizer: {
        name: contextEvent.hostingDepartment
          ? `${contextEvent.hostingDepartment}, ${contextEvent.collegeName || contextEvent.college}`
          : contextEvent.collegeName || contextEvent.college,
        location: contextEvent.venue || "TBD",
      },
      suggestedTeammates: [], // Can be extended with AI matching
      aiRecommendation:
        contextEvent.skillDomains?.length > 0
          ? `This event matches your interest in ${contextEvent.skillDomains.join(" and ")}.`
          : "",
      // Winners data for completed events
      winners: contextEvent.winnersFromCollege || [],
      isCompleted: contextEvent.status === "closed",
      isCompetition: [
        "hackathon",
        "competition",
        "challenge",
        "championship",
      ].some(
        (type) =>
          (contextEvent.eventType || "").toLowerCase().includes(type) ||
          (contextEvent.title || "").toLowerCase().includes(type),
      ),
    };
  }, [contextEvent]);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          color: "#64748b",
        }}
      >
        <Link to="/events" style={{ color: "#1e3a8a", textDecoration: "none" }}>
          Events
        </Link>
        <span>&gt;</span>
        <span style={{ color: "#0f172a" }}>{event.title}</span>
      </div>

      {/* Hero Banner */}
      <div
        style={{
          margin: "0 32px 24px",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          height: "200px",
          background: `linear-gradient(to right, rgba(30,58,138,0.85), rgba(30,58,138,0.6)), url(${event.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "24px 32px",
          color: "white",
        }}
      >
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <span
            style={{
              background: "#1e3a8a",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {event.category}
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 500,
            }}
          >
            {event.mode}
          </span>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 8px 0" }}>
          {event.title}
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "14px",
            opacity: 0.9,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <iconify-icon
              icon="lucide:building-2"
              style={{ fontSize: "14px" }}
            ></iconify-icon>
            Hosted by {event.host}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <iconify-icon
              icon="lucide:calendar"
              style={{ fontSize: "14px" }}
            ></iconify-icon>
            {event.dates}
          </span>
        </div>
      </div>

      {/* Winners Section - Only for completed competitions/hackathons with winners */}
      {event.isCompleted &&
        event.isCompetition &&
        event.winners?.length > 0 && (
          <div
            style={{
              margin: "0 32px 24px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px 32px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <iconify-icon
                  icon="lucide:trophy"
                  style={{ fontSize: "24px", color: "#b45309" }}
                ></iconify-icon>
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  Winners Announced
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#64748b",
                  }}
                >
                  Congratulations to the top performers!
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              {event.winners.slice(0, 3).map((winner, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fafafa",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        idx === 0
                          ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                          : idx === 1
                            ? "linear-gradient(135deg, #e5e7eb, #9ca3af)"
                            : "linear-gradient(135deg, #fdba74, #ea580c)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "18px",
                      boxShadow:
                        idx === 0
                          ? "0 4px 14px rgba(245, 158, 11, 0.35)"
                          : "0 2px 8px rgba(0,0,0,0.1)",
                      flexShrink: 0,
                    }}
                  >
                    {idx === 0 ? (
                      <iconify-icon
                        icon="lucide:crown"
                        style={{ fontSize: "24px" }}
                      ></iconify-icon>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color:
                            idx === 0
                              ? "#b45309"
                              : idx === 1
                                ? "#6b7280"
                                : "#c2410c",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {winner.prize ||
                          `${idx + 1}${idx === 0 ? "st" : idx === 1 ? "nd" : "rd"} Place`}
                      </span>
                      {winner.prizeAmount && (
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#059669",
                            background: "#ecfdf5",
                            padding: "4px 10px",
                            borderRadius: "6px",
                          }}
                        >
                          ₹{winner.prizeAmount.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#1e293b",
                        marginBottom: "6px",
                      }}
                    >
                      {winner.teamName}
                    </div>
                    {winner.projectTitle && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                          marginBottom: "8px",
                        }}
                      >
                        {winner.projectTitle}
                      </div>
                    )}
                    {winner.members && winner.members.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          color: "#94a3b8",
                        }}
                      >
                        <iconify-icon
                          icon="lucide:users"
                          style={{ fontSize: "14px" }}
                        ></iconify-icon>
                        {winner.members.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
          padding: "0 32px 32px",
          alignItems: "start",
        }}
      >
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Event Description */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 600,
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <iconify-icon
                icon="lucide:info"
                style={{ color: "#1e3a8a" }}
              ></iconify-icon>
              Event Description
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#475569",
                lineHeight: 1.7,
                margin: "0 0 16px 0",
                whiteSpace: "pre-line",
              }}
            >
              {event.description}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "12px",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Problem Statements */}
          {event.problemStatements.length > 0 && (
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  margin: "0 0 16px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <iconify-icon
                  icon="lucide:file-text"
                  style={{ color: "#1e3a8a" }}
                ></iconify-icon>
                Problem Statements
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {event.problemStatements.map((ps) => (
                  <div key={ps.id} style={{ display: "flex", gap: "12px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "#1e3a8a",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {ps.id}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          marginBottom: "4px",
                          color: "#0f172a",
                        }}
                      >
                        {ps.title}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                          lineHeight: 1.5,
                        }}
                      >
                        {ps.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {event.timeline.length > 0 && (
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  margin: "0 0 16px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <iconify-icon
                  icon="lucide:clock"
                  style={{ color: "#1e3a8a" }}
                ></iconify-icon>
                Timeline
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {event.timeline.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#1e3a8a",
                        marginTop: "5px",
                        flexShrink: 0,
                      }}
                    ></div>
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#1e3a8a",
                          fontWeight: 600,
                          marginBottom: "2px",
                        }}
                      >
                        {item.date}
                      </div>
                      <div style={{ fontSize: "14px", color: "#0f172a" }}>
                        {item.event}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prizes & Rewards */}
          {event.prizes.length > 0 && (
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  margin: "0 0 16px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <iconify-icon
                  icon="lucide:trophy"
                  style={{ color: "#f59e0b" }}
                ></iconify-icon>
                Prizes & Rewards
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                }}
              >
                {event.prizes.map((prize, i) => {
                  const isHighlight = i === 0 || i === 2; // 1st and 3rd place get coral styling
                  return (
                    <div
                      key={i}
                      style={{
                        background: isHighlight ? "#fff7ed" : "#f8fafc",
                        border: `2px solid ${isHighlight ? "#fb923c" : "#e2e8f0"}`,
                        borderRadius: "12px",
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      <iconify-icon
                        icon="lucide:trophy"
                        style={{
                          fontSize: "28px",
                          color: isHighlight ? "#fb923c" : "#94a3b8",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      ></iconify-icon>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: isHighlight ? "#ea580c" : "#64748b",
                          marginBottom: "4px",
                        }}
                      >
                        {prize.place}
                      </div>
                      <div style={{ fontSize: "12px", color: "#475569" }}>
                        {prize.amount}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Registration Card */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "24px",
            }}
          >
            <div
              style={{
                background: "#fef3c7",
                border: "1px solid #fcd34d",
                borderRadius: "8px",
                padding: "10px 16px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#92400e",
              }}
            >
              <iconify-icon
                icon="lucide:clock"
                style={{ fontSize: "16px" }}
              ></iconify-icon>
              Registration closes in {event.registrationCloses}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {[
                { label: "Format", value: event.format },
                { label: "Eligibility", value: event.eligibility },
                {
                  label: "Reg. Fee",
                  value: event.regFee,
                  valueColor: "#10b981",
                },
                { label: "Seats Left", value: event.seatsLeft },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "#64748b" }}>{row.label}</span>
                  <span
                    style={{
                      fontWeight: 500,
                      color: row.valueColor || "#0f172a",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                !existingRegistration &&
                !event.isRegistrationClosed &&
                navigate(`/events/${id}/register`)
              }
              style={{
                width: "100%",
                background: existingRegistration
                  ? existingRegistration.status === "confirmed"
                    ? "#10b981"
                    : "#f59e0b"
                  : event.isRegistrationClosed
                    ? "#94a3b8"
                    : "#1e3a8a",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor:
                  existingRegistration || event.isRegistrationClosed
                    ? "not-allowed"
                    : "pointer",
                marginBottom: "12px",
                opacity:
                  existingRegistration || event.isRegistrationClosed ? 0.8 : 1,
              }}
            >
              {existingRegistration
                ? existingRegistration.status === "confirmed"
                  ? "✓ Registered"
                  : "⏳ Draft - Awaiting Approvals"
                : event.isRegistrationClosed
                  ? "Registration Closed"
                  : "Register Now"}
            </button>

            <button
              style={{
                width: "100%",
                background: "transparent",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                padding: "10px",
                borderRadius: "8px",
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
                icon="lucide:share-2"
                style={{ fontSize: "16px" }}
              ></iconify-icon>
              Share Event
            </button>
          </div>

          {/* AI Recommendation */}
          {event.aiRecommendation && (
            <div
              style={{
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                border: "1px solid #bfdbfe",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1e40af",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <iconify-icon
                  icon="lucide:sparkles"
                  style={{ color: "#f59e0b" }}
                ></iconify-icon>
                AI Recommendation
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#3b82f6",
                  margin: "0 0 12px 0",
                  lineHeight: 1.5,
                }}
              >
                {event.aiRecommendation}
              </p>
              {event.suggestedTeammates.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "8px",
                    }}
                  >
                    Suggested Teammates (85%+ Match)
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      {event.suggestedTeammates.map((tm, i) => (
                        <img
                          key={i}
                          src={tm.avatar}
                          alt="teammate"
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "2px solid white",
                            marginLeft: i > 0 ? "-8px" : 0,
                          }}
                        />
                      ))}
                    </div>
                    <button
                      style={{
                        background: "white",
                        border: "1px solid #bfdbfe",
                        color: "#1e3a8a",
                        fontSize: "12px",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Invite
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Event Organizer */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "12px",
              }}
            >
              Event Organizer
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#1e3a8a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <iconify-icon
                  icon="lucide:building-2"
                  style={{ fontSize: "20px" }}
                ></iconify-icon>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {event.organizer.name}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  {event.organizer.location}
                </div>
              </div>
            </div>
            <a
              href="#"
              style={{
                fontSize: "13px",
                color: "#1e3a8a",
                textDecoration: "none",
              }}
            >
              View Past Events
            </a>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && contextEvent && (
        <RegistrationModal
          event={contextEvent}
          onClose={() => setShowRegistrationModal(false)}
          onSubmit={handleRegistrationSubmit}
          availableParticipants={AVAILABLE_PARTICIPANTS}
          currentUser={USER_PROFILE}
        />
      )}
    </div>
  );
}
