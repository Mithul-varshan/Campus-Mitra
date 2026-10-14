import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEvents } from "../../context/EventsContext";
import { SEED_STUDENTS } from "../../data/seeds";

// Current user profile
const USER_PROFILE = {
  id: "s1",
  name: "Ananya Gupta",
  email: "ananya.gupta@campus.edu",
  department: "Computer Science",
  year: "3rd Year",
  phone: "",
  rollNo: "CS2021001",
};

// Available participants for team events
const AVAILABLE_PARTICIPANTS = SEED_STUDENTS.filter(
  (s) => s.id !== USER_PROFILE.id,
);

// Storage keys
const REGISTRATIONS_KEY = "campusmitra_registrations";
const INVITATIONS_KEY = "campusmitra_invitations";

const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useEvents();

  const event = useMemo(() => {
    return events.find((e) => e.id === id || e.id === parseInt(id));
  }, [events, id]);

  const [formData, setFormData] = useState({
    fullName: USER_PROFILE.name,
    email: USER_PROFILE.email,
    phone: USER_PROFILE.phone,
    rollNo: USER_PROFILE.rollNo,
    department: USER_PROFILE.department,
    year: USER_PROFILE.year,
    teamName: "",
    teammates: [],
    paymentStatus: "pending",
  });

  const [teammateSearch, setTeammateSearch] = useState("");
  const [showTeammateDropdown, setShowTeammateDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Check if event requires payment
  const isFreeEvent = useMemo(() => {
    if (!event) return true;
    const fee = event.registrationFee || event.regFee;
    if (!fee) return true;
    if (typeof fee === "string") {
      return fee.toLowerCase() === "free" || fee === "₹0" || fee === "0";
    }
    return fee === 0;
  }, [event]);

  // Get numeric fee
  const numericFee = useMemo(() => {
    if (!event || isFreeEvent) return 0;
    const fee = event.registrationFee || event.regFee;
    if (typeof fee === "number") return fee;
    return parseInt(fee.replace(/[^0-9]/g, ""), 10) || 0;
  }, [event, isFreeEvent]);

  // Update payment status based on free event
  useEffect(() => {
    if (isFreeEvent) {
      setFormData((prev) => ({ ...prev, paymentStatus: "not_required" }));
    }
  }, [isFreeEvent]);

  const isTeamEvent = event?.maxTeamSize > 1;
  const minTeamSize = event?.minTeamSize || 1;
  const maxTeamSize = event?.maxTeamSize || 1;

  const filteredParticipants = AVAILABLE_PARTICIPANTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(teammateSearch.toLowerCase()) ||
      p.email?.toLowerCase().includes(teammateSearch.toLowerCase()) ||
      p.rollNo?.toLowerCase().includes(teammateSearch.toLowerCase());
    const notAlreadyAdded = !formData.teammates.some((t) => t.id === p.id);
    return matchesSearch && notAlreadyAdded;
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const addTeammate = (participant) => {
    if (formData.teammates.length < maxTeamSize - 1) {
      setFormData((prev) => ({
        ...prev,
        teammates: [...prev.teammates, { ...participant, status: "pending" }],
      }));
    }
    setTeammateSearch("");
    setShowTeammateDropdown(false);
  };

  const removeTeammate = (participantId) => {
    setFormData((prev) => ({
      ...prev,
      teammates: prev.teammates.filter((t) => t.id !== participantId),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.rollNo.trim()) newErrors.rollNo = "Roll number is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";

    if (isTeamEvent) {
      if (!formData.teamName.trim())
        newErrors.teamName = "Team name is required";
      const totalMembers = formData.teammates.length + 1;
      if (totalMembers < minTeamSize) {
        newErrors.teammates = `Minimum ${minTeamSize} team members required (including you)`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = () => {
    if (isFreeEvent) {
      setPaymentComplete(true);
      handleFinalSubmit("not_required");
      return;
    }

    const options = {
      key: "rzp_test_RxiHjMose0no0s",
      amount: numericFee * 100, // Amount in paise
      currency: "INR",
      name: "Campus Mitra",
      description: `Event Registration: ${event.title}`,
      image: "https://yourlogo.com/logo.png",
      handler: function (response) {
        setPaymentComplete(true);
        handleFinalSubmit("paid", response.razorpay_payment_id);
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#1e3a8a",
      },
      modal: {
        ondismiss: function () {
          // User closed without paying
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleFinalSubmit = (paymentStatus, paymentId = null) => {
    const registrations = loadFromStorage(REGISTRATIONS_KEY);
    const invitations = loadFromStorage(INVITATIONS_KEY);

    const hasTeammatesAwaitingApproval =
      isTeamEvent && formData.teammates.length > 0;

    const registration = {
      id: `reg_${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      userId: USER_PROFILE.id,
      userName: USER_PROFILE.name,
      formData: { ...formData, paymentStatus },
      paymentId,
      status: hasTeammatesAwaitingApproval ? "draft" : "confirmed",
      registeredAt: new Date().toISOString(),
      teammates: formData.teammates.map((t) => ({
        ...t,
        status: "pending",
      })),
    };

    // Create invitations for teammates
    const newInvitations = formData.teammates.map((teammate) => ({
      id: `inv_${Date.now()}_${teammate.id}`,
      registrationId: registration.id,
      eventId: event.id,
      eventTitle: event.title,
      fromUserId: USER_PROFILE.id,
      fromUserName: USER_PROFILE.name,
      toUserId: teammate.id,
      toUserName: teammate.name,
      teamName: formData.teamName,
      status: "pending",
      createdAt: new Date().toISOString(),
    }));

    saveToStorage(REGISTRATIONS_KEY, [...registrations, registration]);
    saveToStorage(INVITATIONS_KEY, [...invitations, ...newInvitations]);

    setRegistrationComplete(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    if (isFreeEvent) {
      handleFinalSubmit("not_required");
    } else {
      handlePayment();
    }
  };

  if (!event) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <h2 style={{ color: "#64748b" }}>Event not found</h2>
        <Link to="/events" style={{ color: "#1e3a8a" }}>
          Back to Events
        </Link>
      </div>
    );
  }

  // Check if registration is closed
  const isRegistrationClosed =
    event.status === "closed" || event.registrationClosed === true;

  if (isRegistrationClosed) {
    return (
      <div
        style={{
          padding: "32px",
          maxWidth: "500px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "48px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid #fee2e2",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "#fee2e2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <iconify-icon
              icon="lucide:calendar-x"
              style={{ fontSize: "40px", color: "#dc2626" }}
            ></iconify-icon>
          </div>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "12px",
            }}
          >
            Registration Closed
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "16px",
              marginBottom: "24px",
            }}
          >
            Registration for <strong>{event.title}</strong> is no longer
            available. The deadline has passed or the event is full.
          </p>

          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <Link
              to={`/events/${event.id}`}
              style={{
                padding: "12px 24px",
                background: "#f1f5f9",
                color: "#475569",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              View Event Details
            </Link>
            <Link
              to="/events"
              style={{
                padding: "12px 24px",
                background: "#1e3a8a",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (registrationComplete) {
    return (
      <div
        style={{
          padding: "32px",
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "48px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "#dcfce7",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <iconify-icon
              icon="lucide:check"
              style={{ fontSize: "40px", color: "#16a34a" }}
            ></iconify-icon>
          </div>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "12px",
            }}
          >
            Registration Successful!
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "16px",
              marginBottom: "24px",
            }}
          >
            You have successfully registered for <strong>{event.title}</strong>
          </p>

          {isTeamEvent && formData.teammates.length > 0 && (
            <div
              style={{
                background: "#fef3c7",
                border: "1px solid #fcd34d",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "#92400e",
                }}
              >
                <iconify-icon
                  icon="lucide:clock"
                  style={{ fontSize: "18px" }}
                ></iconify-icon>
                Awaiting Team Approvals
              </div>
              <p style={{ fontSize: "14px", color: "#78350f", margin: 0 }}>
                Your registration is in draft status until all team members
                accept their invitations.
              </p>
            </div>
          )}

          {!isFreeEvent && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontWeight: 600,
                  color: "#166534",
                }}
              >
                <iconify-icon
                  icon="lucide:credit-card"
                  style={{ fontSize: "18px" }}
                ></iconify-icon>
                Payment of ₹{numericFee} completed
              </div>
            </div>
          )}

          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <Link
              to={`/events/${event.id}`}
              style={{
                padding: "12px 24px",
                background: "#f1f5f9",
                color: "#475569",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              View Event
            </Link>
            <Link
              to="/events"
              style={{
                padding: "12px 24px",
                background: "#1e3a8a",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              My Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Link
          to={`/events/${event.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#64748b",
            textDecoration: "none",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          <iconify-icon
            icon="lucide:arrow-left"
            style={{ fontSize: "16px" }}
          ></iconify-icon>
          Back to Event
        </Link>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "8px",
          }}
        >
          Register for Event
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px" }}>{event.title}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "24px",
        }}
      >
        {/* Registration Form */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "24px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: "20px",
              }}
            >
              Personal Information
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {/* Full Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `1px solid ${errors.fullName ? "#ef4444" : "#e2e8f0"}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {errors.fullName && (
                  <span style={{ fontSize: "12px", color: "#ef4444" }}>
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `1px solid ${errors.email ? "#ef4444" : "#e2e8f0"}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {errors.email && (
                  <span style={{ fontSize: "12px", color: "#ef4444" }}>
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `1px solid ${errors.phone ? "#ef4444" : "#e2e8f0"}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {errors.phone && (
                  <span style={{ fontSize: "12px", color: "#ef4444" }}>
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* Roll No */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  Roll Number *
                </label>
                <input
                  type="text"
                  value={formData.rollNo}
                  onChange={(e) => handleInputChange("rollNo", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `1px solid ${errors.rollNo ? "#ef4444" : "#e2e8f0"}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {errors.rollNo && (
                  <span style={{ fontSize: "12px", color: "#ef4444" }}>
                    {errors.rollNo}
                  </span>
                )}
              </div>

              {/* Department */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `1px solid ${errors.department ? "#ef4444" : "#e2e8f0"}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {errors.department && (
                  <span style={{ fontSize: "12px", color: "#ef4444" }}>
                    {errors.department}
                  </span>
                )}
              </div>

              {/* Year */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  Year
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Team Section */}
            {isTeamEvent && (
              <>
                <div
                  style={{
                    height: "1px",
                    background: "#e2e8f0",
                    margin: "24px 0",
                  }}
                />

                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#0f172a",
                    marginBottom: "8px",
                  }}
                >
                  Team Information
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    marginBottom: "20px",
                  }}
                >
                  Team size: {minTeamSize} - {maxTeamSize} members (including
                  you)
                </p>

                {/* Team Name */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#475569",
                      marginBottom: "6px",
                    }}
                  >
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={formData.teamName}
                    onChange={(e) =>
                      handleInputChange("teamName", e.target.value)
                    }
                    placeholder="Enter your team name"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: `1px solid ${errors.teamName ? "#ef4444" : "#e2e8f0"}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.teamName && (
                    <span style={{ fontSize: "12px", color: "#ef4444" }}>
                      {errors.teamName}
                    </span>
                  )}
                </div>

                {/* Add Teammates */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#475569",
                      marginBottom: "6px",
                    }}
                  >
                    Add Team Members
                  </label>

                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "0 12px",
                      }}
                    >
                      <iconify-icon
                        icon="lucide:search"
                        style={{ fontSize: "16px", color: "#94a3b8" }}
                      ></iconify-icon>
                      <input
                        type="text"
                        value={teammateSearch}
                        onChange={(e) => {
                          setTeammateSearch(e.target.value);
                          setShowTeammateDropdown(true);
                        }}
                        onFocus={() => setShowTeammateDropdown(true)}
                        placeholder="Search by name, email, or roll number..."
                        disabled={formData.teammates.length >= maxTeamSize - 1}
                        style={{
                          flex: 1,
                          padding: "10px 12px",
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          background: "transparent",
                        }}
                      />
                    </div>

                    {/* Dropdown */}
                    {showTeammateDropdown && teammateSearch && (
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
                          maxHeight: "250px",
                          overflowY: "auto",
                          zIndex: 100,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      >
                        {filteredParticipants.length > 0 ? (
                          filteredParticipants.slice(0, 10).map((p) => (
                            <div
                              key={p.id}
                              onClick={() => addTeammate(p)}
                              style={{
                                padding: "12px 16px",
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
                                  fontSize: "14px",
                                }}
                              >
                                {p.name.charAt(0)}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 500,
                                    color: "#0f172a",
                                    fontSize: "14px",
                                  }}
                                >
                                  {p.name}
                                </div>
                                <div
                                  style={{ fontSize: "12px", color: "#64748b" }}
                                >
                                  {p.department} • {p.rollNo}
                                </div>
                              </div>
                              {p.siiScore && (
                                <div
                                  style={{
                                    padding: "4px 8px",
                                    background: "#f0fdf4",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "#16a34a",
                                  }}
                                >
                                  SII: {p.siiScore}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              padding: "16px",
                              textAlign: "center",
                              color: "#64748b",
                              fontSize: "14px",
                            }}
                          >
                            No participants found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {errors.teammates && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#ef4444",
                        marginTop: "6px",
                        display: "block",
                      }}
                    >
                      {errors.teammates}
                    </span>
                  )}
                </div>

                {/* Selected Teammates */}
                {formData.teammates.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#475569",
                        marginBottom: "12px",
                      }}
                    >
                      Team Members ({formData.teammates.length + 1}/
                      {maxTeamSize})
                    </label>

                    {/* Current User */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px",
                        background: "#f0fdf4",
                        border: "1px solid #86efac",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "#16a34a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "14px",
                          marginRight: "12px",
                        }}
                      >
                        {USER_PROFILE.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 500,
                            color: "#0f172a",
                            fontSize: "14px",
                          }}
                        >
                          {USER_PROFILE.name} (You)
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          Team Leader
                        </div>
                      </div>
                      <span
                        style={{
                          padding: "4px 10px",
                          background: "#16a34a",
                          color: "white",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 500,
                        }}
                      >
                        Leader
                      </span>
                    </div>

                    {/* Added Teammates */}
                    {formData.teammates.map((teammate) => (
                      <div
                        key={teammate.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "12px",
                          background: "#fef3c7",
                          border: "1px solid #fcd34d",
                          borderRadius: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "#f59e0b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "14px",
                            marginRight: "12px",
                          }}
                        >
                          {teammate.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: 500,
                              color: "#0f172a",
                              fontSize: "14px",
                            }}
                          >
                            {teammate.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            {teammate.department} • Invitation will be sent
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTeammate(teammate.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            color: "#ef4444",
                          }}
                        >
                          <iconify-icon
                            icon="lucide:x"
                            style={{ fontSize: "18px" }}
                          ></iconify-icon>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <iconify-icon
                    icon="lucide:info"
                    style={{
                      fontSize: "16px",
                      color: "#3b82f6",
                      marginTop: "2px",
                    }}
                  ></iconify-icon>
                  <div style={{ fontSize: "13px", color: "#1e40af" }}>
                    Invitations will be sent to your teammates. Your
                    registration will remain in
                    <strong> draft status</strong> until all team members accept
                    their invitations.
                  </div>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Sidebar - Event Summary & Payment */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Event Summary Card */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: "16px",
              }}
            >
              Event Summary
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#0f172a",
                  marginBottom: "4px",
                }}
              >
                {event.title}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                {event.date} • {event.time || event.venue}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                paddingTop: "16px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              {[
                {
                  label: "Format",
                  value: event.format || (isTeamEvent ? "Team" : "Individual"),
                },
                {
                  label: "Team Size",
                  value: isTeamEvent
                    ? `${minTeamSize}-${maxTeamSize} members`
                    : "Individual",
                },
                { label: "Category", value: event.category || event.type },
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
                  <span style={{ fontWeight: 500, color: "#0f172a" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Card */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: "16px",
              }}
            >
              Payment Details
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                paddingBottom: "16px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                Registration Fee
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: isFreeEvent ? "#16a34a" : "#0f172a",
                }}
              >
                {isFreeEvent ? "FREE" : `₹${numericFee}`}
              </span>
            </div>

            {!isFreeEvent && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              >
                <iconify-icon
                  icon="lucide:shield-check"
                  style={{ fontSize: "18px", color: "#16a34a" }}
                ></iconify-icon>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Secure payment powered by Razorpay
                </span>
              </div>
            )}

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "14px",
                background: isSubmitting ? "#94a3b8" : "#1e3a8a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isSubmitting ? (
                <>
                  <iconify-icon
                    icon="lucide:loader-2"
                    style={{
                      fontSize: "18px",
                      animation: "spin 1s linear infinite",
                    }}
                  ></iconify-icon>
                  Processing...
                </>
              ) : isFreeEvent ? (
                <>
                  <iconify-icon
                    icon="lucide:check-circle"
                    style={{ fontSize: "18px" }}
                  ></iconify-icon>
                  Complete Registration
                </>
              ) : (
                <>
                  <iconify-icon
                    icon="lucide:credit-card"
                    style={{ fontSize: "18px" }}
                  ></iconify-icon>
                  Pay ₹{numericFee} & Register
                </>
              )}
            </button>

            <p
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                textAlign: "center",
                marginTop: "12px",
              }}
            >
              By registering, you agree to the event terms and conditions
            </p>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showTeammateDropdown && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
          }}
          onClick={() => setShowTeammateDropdown(false)}
        />
      )}
    </div>
  );
}
