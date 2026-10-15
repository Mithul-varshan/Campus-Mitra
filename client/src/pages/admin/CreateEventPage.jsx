import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../context/EventsContext";

/* ===== CONSTANTS ===== */
const EVENT_TYPES = [
  "Hackathon",
  "Technical Symposium",
  "Workshop",
  "Seminar",
  "Coding Contest",
  "Paper Presentation",
  "Project Expo",
  "Industry Talk",
  "Innovation Challenge",
  "Bootcamp",
  "Conference",
  "Webinar",
];

const EVENT_CATEGORIES = [
  {
    value: "naac_criterion_3",
    label: "NAAC Criterion 3 - Research, Innovation & Extension",
  },
  {
    value: "naac_criterion_5",
    label: "NAAC Criterion 5 - Student Participation & Support",
  },
  { value: "nirf_innovation", label: "NIRF Innovation" },
  { value: "technical_skill", label: "Technical Skill Development" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "cultural", label: "Cultural (Optional)" },
];

const EVENT_LEVELS = [
  { value: "intra_college", label: "Intra-College", minInstitutions: 1 },
  { value: "inter_college", label: "Inter-College", minInstitutions: 2 },
  { value: "state", label: "State Level", minInstitutions: 5 },
  { value: "national", label: "National Level", minInstitutions: 10 },
  { value: "international", label: "International", minInstitutions: 15 },
];

const SKILL_DOMAINS = [
  "Data Structures & Algorithms",
  "Artificial Intelligence",
  "Machine Learning",
  "Web Development",
  "Mobile Development",
  "Cloud Computing",
  "Cybersecurity",
  "IoT",
  "Blockchain",
  "Core Engineering",
  "Management",
  "Design Thinking",
  "Soft Skills",
];

const SDG_GOALS = [
  "SDG 1: No Poverty",
  "SDG 2: Zero Hunger",
  "SDG 3: Good Health & Well-Being",
  "SDG 4: Quality Education",
  "SDG 5: Gender Equality",
  "SDG 6: Clean Water & Sanitation",
  "SDG 7: Affordable & Clean Energy",
  "SDG 8: Decent Work & Economic Growth",
  "SDG 9: Industry, Innovation & Infrastructure",
  "SDG 10: Reduced Inequalities",
  "SDG 11: Sustainable Cities",
  "SDG 12: Responsible Consumption",
  "SDG 13: Climate Action",
  "SDG 14: Life Below Water",
  "SDG 15: Life on Land",
  "SDG 16: Peace, Justice & Strong Institutions",
  "SDG 17: Partnerships for the Goals",
];

const PRIZE_TYPES = [
  "Cash",
  "Certificate",
  "Trophy",
  "Internship",
  "Goodies",
  "Scholarship",
  "Other",
];

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

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "All Years"];

/* ===== DUMMY INSTITUTIONAL DATA (Auto-filled from login) ===== */
const INSTITUTION_DATA = {
  collegeName: "Dhanalakshmi Srinivasan University",
  institutionCode: "DSU",
  naacGrade: "A",
  department: "Computer Science & Engineering",
  coordinatorName: "Dr. Priya Sharma",
  officialEmail: "events@dsuniversity.ac.in",
  collegeLogo:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Dhanalakshmi_Srinivasan_University_logo.png/220px-Dhanalakshmi_Srinivasan_University_logo.png",
  isVerified: true,
};

/* ===== STYLES ===== */
const pageContainer = {
  flex: 1,
  overflowY: "auto",
  padding: "24px",
  background: "var(--background)",
};

const card = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: "24px",
  marginBottom: "20px",
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "24px",
  paddingBottom: "16px",
  borderBottom: "1px solid var(--border)",
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: 600,
  color: "var(--foreground)",
  margin: 0,
};

const sectionBadge = {
  fontSize: "10px",
  fontWeight: 600,
  padding: "4px 8px",
  borderRadius: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--foreground)",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border)",
  background: "var(--background)",
  color: "var(--foreground)",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const inputDisabled = {
  ...inputStyle,
  background: "var(--muted)",
  cursor: "not-allowed",
  color: "var(--muted-foreground)",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  fontFamily: "inherit",
  minHeight: "100px",
};

const gridTwoCol = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "16px",
};

const gridThreeCol = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
};

const helpText = {
  fontSize: "11px",
  color: "var(--muted-foreground)",
  marginTop: "4px",
};

const tagStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s",
  border: "1px solid var(--border)",
};

const fileUploadBox = {
  border: "2px dashed var(--border)",
  borderRadius: "var(--radius-md)",
  padding: "24px",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.2s",
  background: "var(--muted)",
};

const alertBox = {
  padding: "16px",
  borderRadius: "var(--radius-md)",
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "20px",
};

/* ===== MAIN COMPONENT ===== */
export default function CreateEventPage() {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const [currentStep, setCurrentStep] = useState(1);
  const [aiValidationResults, setAiValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // File input refs
  const brochureInputRef = useRef(null);
  const approvalLetterInputRef = useRef(null);

  const [formData, setFormData] = useState({
    // Section 1: Institutional (Auto-filled - Read Only)
    collegeName: INSTITUTION_DATA.collegeName,
    institutionCode: INSTITUTION_DATA.institutionCode,
    naacGrade: INSTITUTION_DATA.naacGrade,
    hostingDepartment: INSTITUTION_DATA.department,
    coordinatorName: INSTITUTION_DATA.coordinatorName,
    officialEmail: INSTITUTION_DATA.officialEmail,

    // Section 2: Event Metadata
    title: "",
    eventType: "",
    category: "",
    mode: "offline",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    venue: "",
    platformLink: "",
    brochureFile: null,
    approvalLetterFile: null,

    // Section 3: Participation Structure
    eventLevel: "",
    minParticipatingInstitutions: 1,
    expectedParticipants: "",
    maxTeamSize: 4,
    minTeamSize: 1,
    eligibleYears: [],
    eligibleDepartments: [],
    registrationFee: 0,

    // Section 4: Accreditation Mapping
    skillDomains: [],
    sdgGoals: [],

    // Section 5: Winner Logic
    winnerSlots: [
      { rank: "1st Place", prizeType: "Cash", prizeValue: "", description: "" },
      { rank: "2nd Place", prizeType: "Cash", prizeValue: "", description: "" },
      { rank: "3rd Place", prizeType: "Cash", prizeValue: "", description: "" },
    ],
    specialCategories: [],
    judgingCriteria: [""],
    juryPanelNames: [""],

    // Section 6: Additional Details
    description: "",
    rules: [""],
    contactPhone: "",
  });

  const steps = [
    { id: 1, title: "Institution", icon: "lucide:building-2" },
    { id: 2, title: "Event Details", icon: "lucide:calendar-days" },
    { id: 3, title: "Participation", icon: "lucide:users" },
    { id: 4, title: "Accreditation", icon: "lucide:award" },
    { id: 5, title: "Winners & Judges", icon: "lucide:trophy" },
    { id: 6, title: "Review & Submit", icon: "lucide:check-circle" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only.");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleWinnerSlotChange = (index, field, value) => {
    const newSlots = [...formData.winnerSlots];
    newSlots[index][field] = value;
    setFormData((prev) => ({ ...prev, winnerSlots: newSlots }));
  };

  const addWinnerSlot = () => {
    const nextRank = formData.winnerSlots.length + 1;
    const rankLabel =
      nextRank === 1
        ? "1st Place"
        : nextRank === 2
          ? "2nd Place"
          : nextRank === 3
            ? "3rd Place"
            : `${nextRank}th Place`;
    setFormData((prev) => ({
      ...prev,
      winnerSlots: [
        ...prev.winnerSlots,
        {
          rank: rankLabel,
          prizeType: "Certificate",
          prizeValue: "",
          description: "",
        },
      ],
    }));
  };

  const removeWinnerSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      winnerSlots: prev.winnerSlots.filter((_, i) => i !== index),
    }));
  };

  const addSpecialCategory = () => {
    setFormData((prev) => ({
      ...prev,
      specialCategories: [
        ...prev.specialCategories,
        { name: "", prizeType: "Certificate", prizeValue: "" },
      ],
    }));
  };

  const handleSpecialCategoryChange = (index, field, value) => {
    const newCategories = [...formData.specialCategories];
    newCategories[index][field] = value;
    setFormData((prev) => ({ ...prev, specialCategories: newCategories }));
  };

  const removeSpecialCategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      specialCategories: prev.specialCategories.filter((_, i) => i !== index),
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleEventLevelChange = (e) => {
    const level = EVENT_LEVELS.find((l) => l.value === e.target.value);
    setFormData((prev) => ({
      ...prev,
      eventLevel: e.target.value,
      minParticipatingInstitutions: level?.minInstitutions || 1,
    }));
  };

  // AI Validation
  const runAIValidation = () => {
    setIsValidating(true);
    // Simulate AI validation
    setTimeout(() => {
      const results = {
        titleCheck: {
          passed:
            formData.title.length > 10 &&
            !formData.title.toLowerCase().includes("fest"),
          message: formData.title.toLowerCase().includes("fest")
            ? "Title appears too generic. Consider a more specific name."
            : formData.title.length <= 10
              ? "Title is too short. Add more descriptive details."
              : "Title looks professional and specific.",
        },
        descriptionCheck: {
          passed: formData.description.length > 100,
          message:
            formData.description.length <= 100
              ? "Description is too short. Add more details about the event."
              : "Description is comprehensive.",
        },
        durationCheck: {
          passed: true,
          message: "Event duration appears realistic.",
        },
        prizeCheck: {
          passed: true,
          message: "Prize structure looks appropriate for event level.",
        },
        duplicateCheck: {
          passed: true,
          message: "No duplicate events detected with similar title/date.",
        },
      };
      setAiValidationResults(results);
      setIsValidating(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add event to context
    const newEvent = addEvent(formData);
    console.log("Event Created:", newEvent);
    navigate("/admin/my-events");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Auto-filled
      case 2:
        return (
          formData.title &&
          formData.eventType &&
          formData.category &&
          formData.startDate &&
          formData.endDate
        );
      case 3:
        return formData.eventLevel && formData.expectedParticipants;
      case 4:
        return formData.skillDomains.length > 0;
      case 5:
        return formData.winnerSlots.length > 0 && formData.judgingCriteria[0];
      default:
        return true;
    }
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
              fontWeight: 600,
              margin: 0,
              color: "var(--foreground)",
            }}
          >
            Create New Event
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--muted-foreground)",
              margin: "4px 0 0 0",
            }}
          >
            Complete all sections to publish your event
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {INSTITUTION_DATA.isVerified && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "20px",
                background: "rgba(34, 197, 94, 0.1)",
                color: "#16a34a",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <iconify-icon icon="lucide:shield-check"></iconify-icon>
              NAAC Verified
            </span>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div style={{ ...card, padding: "16px 24px", marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flex: idx < steps.length - 1 ? 1 : "none",
              }}
            >
              <div
                onClick={() =>
                  step.id <= currentStep && setCurrentStep(step.id)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 16px",
                  borderRadius: "var(--radius-md)",
                  background:
                    currentStep === step.id
                      ? "var(--primary)"
                      : currentStep > step.id
                        ? "rgba(34, 197, 94, 0.1)"
                        : "var(--muted)",
                  color:
                    currentStep === step.id
                      ? "white"
                      : currentStep > step.id
                        ? "#16a34a"
                        : "var(--muted-foreground)",
                  cursor: step.id <= currentStep ? "pointer" : "default",
                  transition: "all 0.2s",
                }}
              >
                <iconify-icon
                  icon={currentStep > step.id ? "lucide:check" : step.icon}
                  style={{ fontSize: "16px" }}
                ></iconify-icon>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: "2px",
                    background:
                      currentStep > step.id ? "#16a34a" : "var(--border)",
                    margin: "0 8px",
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ===== STEP 1: INSTITUTIONAL DETAILS ===== */}
        {currentStep === 1 && (
          <div style={card}>
            <div style={sectionHeader}>
              <iconify-icon
                icon="lucide:building-2"
                style={{ fontSize: "24px", color: "var(--primary)" }}
              ></iconify-icon>
              <div>
                <h2 style={sectionTitle}>Basic Institutional Details</h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--muted-foreground)",
                    margin: "4px 0 0 0",
                  }}
                >
                  Auto-filled from your institution profile (Read-only)
                </p>
              </div>
              <span
                style={{
                  ...sectionBadge,
                  background: "rgba(34, 197, 94, 0.1)",
                  color: "#16a34a",
                  marginLeft: "auto",
                }}
              >
                Auto-filled
              </span>
            </div>

            <div
              style={{
                ...alertBox,
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <iconify-icon
                icon="lucide:info"
                style={{ fontSize: "20px", color: "#3b82f6", flexShrink: 0 }}
              ></iconify-icon>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "4px",
                  }}
                >
                  Why can't I edit these fields?
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                    lineHeight: 1.6,
                  }}
                >
                  Institutional details are verified and locked to ensure
                  authenticity and prevent misrepresentation. These details are
                  automatically pulled from your verified institution profile.
                </div>
              </div>
            </div>

            <div style={gridTwoCol}>
              <div>
                <label style={labelStyle}>Host College Name</label>
                <input
                  type="text"
                  value={formData.collegeName}
                  style={inputDisabled}
                  disabled
                />
              </div>
              <div>
                <label style={labelStyle}>Institution Code</label>
                <input
                  type="text"
                  value={formData.institutionCode}
                  style={inputDisabled}
                  disabled
                />
              </div>
              <div>
                <label style={labelStyle}>NAAC Grade</label>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="text"
                    value={formData.naacGrade}
                    style={{ ...inputDisabled, flex: 1 }}
                    disabled
                  />
                  <span
                    style={{
                      padding: "8px 12px",
                      borderRadius: "var(--radius-md)",
                      background:
                        "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {formData.naacGrade}
                  </span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Department Hosting Event</label>
                <input
                  type="text"
                  value={formData.hostingDepartment}
                  style={inputDisabled}
                  disabled
                />
              </div>
              <div>
                <label style={labelStyle}>Event Coordinator Name</label>
                <input
                  type="text"
                  value={formData.coordinatorName}
                  style={inputDisabled}
                  disabled
                />
              </div>
              <div>
                <label style={labelStyle}>Official College Email</label>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="email"
                    value={formData.officialEmail}
                    style={{ ...inputDisabled, flex: 1 }}
                    disabled
                  />
                  <iconify-icon
                    icon="lucide:check-circle"
                    style={{ fontSize: "20px", color: "#16a34a" }}
                  ></iconify-icon>
                </div>
                <p style={helpText}>Domain verified: @dsuniversity.ac.in</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 2: EVENT METADATA ===== */}
        {currentStep === 2 && (
          <div style={card}>
            <div style={sectionHeader}>
              <iconify-icon
                icon="lucide:calendar-days"
                style={{ fontSize: "24px", color: "var(--primary)" }}
              ></iconify-icon>
              <div>
                <h2 style={sectionTitle}>Event Metadata</h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--muted-foreground)",
                    margin: "4px 0 0 0",
                  }}
                >
                  Structured information for audit trace and reporting
                </p>
              </div>
              <span
                style={{
                  ...sectionBadge,
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#dc2626",
                  marginLeft: "auto",
                }}
              >
                Mandatory
              </span>
            </div>

            <div style={gridTwoCol}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., National Level AI Hackathon 2026"
                  required
                  style={inputStyle}
                />
                <p style={helpText}>
                  Use a structured, professional name. Avoid generic terms like
                  "Tech Fest".
                </p>
              </div>

              <div>
                <label style={labelStyle}>Event Type *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  required
                  style={selectStyle}
                >
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Event Category (Accreditation Mapping) *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={selectStyle}
                >
                  <option value="">Select category</option>
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Event Mode *</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["offline", "online", "hybrid"].map((mode) => (
                    <label
                      key={mode}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "12px",
                        borderRadius: "var(--radius-md)",
                        border:
                          formData.mode === mode
                            ? "2px solid var(--primary)"
                            : "1px solid var(--border)",
                        background:
                          formData.mode === mode
                            ? "rgba(99, 102, 241, 0.1)"
                            : "var(--background)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={mode}
                        checked={formData.mode === mode}
                        onChange={handleInputChange}
                        style={{ display: "none" }}
                      />
                      <iconify-icon
                        icon={
                          mode === "offline"
                            ? "lucide:map-pin"
                            : mode === "online"
                              ? "lucide:globe"
                              : "lucide:layers"
                        }
                        style={{ fontSize: "16px" }}
                      ></iconify-icon>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {mode}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>
                  {formData.mode === "online" ? "Platform Link *" : "Venue *"}
                </label>
                <input
                  type={formData.mode === "online" ? "url" : "text"}
                  name={formData.mode === "online" ? "platformLink" : "venue"}
                  value={
                    formData.mode === "online"
                      ? formData.platformLink
                      : formData.venue
                  }
                  onChange={handleInputChange}
                  placeholder={
                    formData.mode === "online"
                      ? "https://meet.google.com/..."
                      : "Main Auditorium, Block A"
                  }
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Registration Deadline *</label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Registration Fee (₹)</label>
                <input
                  type="number"
                  name="registrationFee"
                  value={formData.registrationFee}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  style={inputStyle}
                />
                <p style={helpText}>Enter 0 for free events</p>
              </div>
            </div>

            {/* File Uploads */}
            <div style={{ marginTop: "24px" }}>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  marginBottom: "16px",
                }}
              >
                Required Documents
              </h4>
              <div style={gridTwoCol}>
                <div>
                  <label style={labelStyle}>
                    Official Brochure (PDF Only) *
                  </label>
                  <div
                    style={{
                      ...fileUploadBox,
                      borderColor: formData.brochureFile
                        ? "var(--primary)"
                        : "var(--border)",
                      background: formData.brochureFile
                        ? "rgba(99, 102, 241, 0.05)"
                        : "var(--muted)",
                    }}
                    onClick={() => brochureInputRef.current?.click()}
                  >
                    <iconify-icon
                      icon={
                        formData.brochureFile
                          ? "lucide:file-check"
                          : "lucide:file-text"
                      }
                      style={{
                        fontSize: "32px",
                        color: formData.brochureFile
                          ? "#22c55e"
                          : "var(--primary)",
                        marginBottom: "8px",
                      }}
                    ></iconify-icon>
                    {formData.brochureFile ? (
                      <>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--foreground)",
                            margin: "8px 0 4px 0",
                            fontWeight: 500,
                          }}
                        >
                          {formData.brochureFile.name}
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#22c55e",
                          }}
                        >
                          Uploaded successfully - Click to change
                        </p>
                      </>
                    ) : (
                      <>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--foreground)",
                            margin: "8px 0 4px 0",
                          }}
                        >
                          Drop your brochure here or{" "}
                          <span style={{ color: "var(--primary)" }}>
                            browse
                          </span>
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          PDF only, max 5MB
                        </p>
                      </>
                    )}
                    <input
                      ref={brochureInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(e, "brochureFile")}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Approval Letter (PDF Only) *</label>
                  <div
                    style={{
                      ...fileUploadBox,
                      borderColor: formData.approvalLetterFile
                        ? "#22c55e"
                        : "var(--border)",
                      background: formData.approvalLetterFile
                        ? "rgba(34, 197, 94, 0.05)"
                        : "var(--muted)",
                    }}
                    onClick={() => approvalLetterInputRef.current?.click()}
                  >
                    <iconify-icon
                      icon="lucide:file-check"
                      style={{
                        fontSize: "32px",
                        color: formData.approvalLetterFile
                          ? "#22c55e"
                          : "var(--muted-foreground)",
                        marginBottom: "8px",
                      }}
                    ></iconify-icon>
                    {formData.approvalLetterFile ? (
                      <>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--foreground)",
                            margin: "8px 0 4px 0",
                            fontWeight: 500,
                          }}
                        >
                          {formData.approvalLetterFile.name}
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#22c55e",
                          }}
                        >
                          Uploaded successfully - Click to change
                        </p>
                      </>
                    ) : (
                      <>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--foreground)",
                            margin: "8px 0 4px 0",
                          }}
                        >
                          Drop your approval letter here or{" "}
                          <span style={{ color: "var(--primary)" }}>
                            browse
                          </span>
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          PDF only, max 5MB
                        </p>
                      </>
                    )}
                    <input
                      ref={approvalLetterInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleFileChange(e, "approvalLetterFile")
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <label style={labelStyle}>Event Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a comprehensive description of the event including objectives, expected outcomes, and unique aspects..."
                required
                style={textareaStyle}
              />
              <p style={helpText}>
                Minimum 100 characters. Be specific and professional.
              </p>
            </div>
          </div>
        )}

        {/* ===== STEP 3: PARTICIPATION STRUCTURE ===== */}
        {currentStep === 3 && (
          <div style={card}>
            <div style={sectionHeader}>
              <iconify-icon
                icon="lucide:users"
                style={{ fontSize: "24px", color: "var(--primary)" }}
              ></iconify-icon>
              <div>
                <h2 style={sectionTitle}>Participation Structure</h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--muted-foreground)",
                    margin: "4px 0 0 0",
                  }}
                >
                  Define participation requirements to ensure event authenticity
                </p>
              </div>
            </div>

            <div
              style={{
                ...alertBox,
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                marginBottom: "24px",
              }}
            >
              <iconify-icon
                icon="lucide:shield-alert"
                style={{ fontSize: "20px", color: "#f59e0b", flexShrink: 0 }}
              ></iconify-icon>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "4px",
                  }}
                >
                  Anti-Fake Event Verification
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                    lineHeight: 1.6,
                  }}
                >
                  Higher event levels require minimum participating
                  institutions. This ensures genuine inter-college/national
                  level events.
                </div>
              </div>
            </div>

            <div style={gridTwoCol}>
              <div>
                <label style={labelStyle}>Event Level *</label>
                <select
                  name="eventLevel"
                  value={formData.eventLevel}
                  onChange={handleEventLevelChange}
                  required
                  style={selectStyle}
                >
                  <option value="">Select event level</option>
                  {EVENT_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} (Min {level.minInstitutions} institution
                      {level.minInstitutions > 1 ? "s" : ""})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Minimum Participating Institutions
                </label>
                <input
                  type="number"
                  name="minParticipatingInstitutions"
                  value={formData.minParticipatingInstitutions}
                  onChange={handleInputChange}
                  min="1"
                  style={inputDisabled}
                  disabled
                />
                <p style={helpText}>Auto-set based on event level</p>
              </div>

              <div>
                <label style={labelStyle}>Expected Participant Count *</label>
                <input
                  type="number"
                  name="expectedParticipants"
                  value={formData.expectedParticipants}
                  onChange={handleInputChange}
                  placeholder="e.g., 200"
                  required
                  min="1"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Team Size</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="number"
                      name="minTeamSize"
                      value={formData.minTeamSize}
                      onChange={handleInputChange}
                      placeholder="Min"
                      min="1"
                      style={inputStyle}
                    />
                    <p style={helpText}>Minimum</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="number"
                      name="maxTeamSize"
                      value={formData.maxTeamSize}
                      onChange={handleInputChange}
                      placeholder="Max"
                      min="1"
                      style={inputStyle}
                    />
                    <p style={helpText}>Maximum</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligible Years */}
            <div style={{ marginTop: "24px" }}>
              <label style={labelStyle}>Eligible Years</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {YEARS.map((year) => (
                  <span
                    key={year}
                    onClick={() => handleMultiSelect("eligibleYears", year)}
                    style={{
                      ...tagStyle,
                      background: formData.eligibleYears.includes(year)
                        ? "var(--primary)"
                        : "var(--background)",
                      color: formData.eligibleYears.includes(year)
                        ? "white"
                        : "var(--foreground)",
                      borderColor: formData.eligibleYears.includes(year)
                        ? "var(--primary)"
                        : "var(--border)",
                    }}
                  >
                    {formData.eligibleYears.includes(year) && (
                      <iconify-icon
                        icon="lucide:check"
                        style={{ fontSize: "12px" }}
                      ></iconify-icon>
                    )}
                    {year}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligible Departments */}
            <div style={{ marginTop: "20px" }}>
              <label style={labelStyle}>Eligible Departments</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {DEPARTMENTS.map((dept) => (
                  <span
                    key={dept}
                    onClick={() =>
                      handleMultiSelect("eligibleDepartments", dept)
                    }
                    style={{
                      ...tagStyle,
                      background: formData.eligibleDepartments.includes(dept)
                        ? "var(--primary)"
                        : "var(--background)",
                      color: formData.eligibleDepartments.includes(dept)
                        ? "white"
                        : "var(--foreground)",
                      borderColor: formData.eligibleDepartments.includes(dept)
                        ? "var(--primary)"
                        : "var(--border)",
                    }}
                  >
                    {formData.eligibleDepartments.includes(dept) && (
                      <iconify-icon
                        icon="lucide:check"
                        style={{ fontSize: "12px" }}
                      ></iconify-icon>
                    )}
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 4: ACCREDITATION MAPPING ===== */}
        {currentStep === 4 && (
          <div style={card}>
            <div style={sectionHeader}>
              <iconify-icon
                icon="lucide:award"
                style={{ fontSize: "24px", color: "var(--primary)" }}
              ></iconify-icon>
              <div>
                <h2 style={sectionTitle}>Accreditation-Oriented Design</h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--muted-foreground)",
                    margin: "4px 0 0 0",
                  }}
                >
                  Auto-tagging for intelligent analytics and accreditation
                  reports
                </p>
              </div>
            </div>

            <div
              style={{
                ...alertBox,
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
              }}
            >
              <iconify-icon
                icon="lucide:sparkles"
                style={{ fontSize: "20px", color: "#6366f1", flexShrink: 0 }}
              ></iconify-icon>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "4px",
                  }}
                >
                  Intelligent Auto-Tagging
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                    lineHeight: 1.6,
                  }}
                >
                  Selected tags will be used to automatically generate NAAC
                  reports, NIRF scores, and skill analytics dashboards.
                </div>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <label style={labelStyle}>Skill Domains *</label>
              <p style={{ ...helpText, marginBottom: "12px" }}>
                Select all relevant skill domains this event covers
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {SKILL_DOMAINS.map((domain) => (
                  <span
                    key={domain}
                    onClick={() => handleMultiSelect("skillDomains", domain)}
                    style={{
                      ...tagStyle,
                      background: formData.skillDomains.includes(domain)
                        ? "var(--primary)"
                        : "var(--background)",
                      color: formData.skillDomains.includes(domain)
                        ? "white"
                        : "var(--foreground)",
                      borderColor: formData.skillDomains.includes(domain)
                        ? "var(--primary)"
                        : "var(--border)",
                    }}
                  >
                    {formData.skillDomains.includes(domain) && (
                      <iconify-icon
                        icon="lucide:check"
                        style={{ fontSize: "12px" }}
                      ></iconify-icon>
                    )}
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "28px" }}>
              <label style={labelStyle}>
                SDG Goals (Sustainable Development Goals)
              </label>
              <p style={{ ...helpText, marginBottom: "12px" }}>
                Optional but powerful for accreditation reports
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {SDG_GOALS.map((goal) => (
                  <span
                    key={goal}
                    onClick={() => handleMultiSelect("sdgGoals", goal)}
                    style={{
                      ...tagStyle,
                      background: formData.sdgGoals.includes(goal)
                        ? "#16a34a"
                        : "var(--background)",
                      color: formData.sdgGoals.includes(goal)
                        ? "white"
                        : "var(--foreground)",
                      borderColor: formData.sdgGoals.includes(goal)
                        ? "#16a34a"
                        : "var(--border)",
                    }}
                  >
                    {formData.sdgGoals.includes(goal) && (
                      <iconify-icon
                        icon="lucide:check"
                        style={{ fontSize: "12px" }}
                      ></iconify-icon>
                    )}
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 5: WINNER LOGIC ===== */}
        {currentStep === 5 && (
          <div style={card}>
            <div style={sectionHeader}>
              <iconify-icon
                icon="lucide:trophy"
                style={{ fontSize: "24px", color: "#f59e0b" }}
              ></iconify-icon>
              <div>
                <h2 style={sectionTitle}>Winner Logic Design</h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--muted-foreground)",
                    margin: "4px 0 0 0",
                  }}
                >
                  Structured, audit-proof winner declaration framework
                </p>
              </div>
            </div>

            {/* Winner Slots */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <label style={{ ...labelStyle, margin: 0 }}>
                  Winner Positions
                </label>
                <button
                  type="button"
                  onClick={addWinnerSlot}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: "var(--primary)",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <iconify-icon icon="lucide:plus"></iconify-icon>
                  Add Position
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {formData.winnerSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px 1fr 1fr 1fr auto",
                      gap: "12px",
                      padding: "16px",
                      background: "var(--muted)",
                      borderRadius: "var(--radius-md)",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>
                        {idx === 0
                          ? "🥇"
                          : idx === 1
                            ? "🥈"
                            : idx === 2
                              ? "🥉"
                              : "🏅"}
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>
                        {slot.rank}
                      </span>
                    </div>
                    <select
                      value={slot.prizeType}
                      onChange={(e) =>
                        handleWinnerSlotChange(idx, "prizeType", e.target.value)
                      }
                      style={selectStyle}
                    >
                      {PRIZE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={slot.prizeValue}
                      onChange={(e) =>
                        handleWinnerSlotChange(
                          idx,
                          "prizeValue",
                          e.target.value,
                        )
                      }
                      placeholder={
                        slot.prizeType === "Cash" ? "₹ Amount" : "Description"
                      }
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      value={slot.description}
                      onChange={(e) =>
                        handleWinnerSlotChange(
                          idx,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Prize details"
                      style={inputStyle}
                    />
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeWinnerSlot(idx)}
                        style={{
                          padding: "8px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid #ef4444",
                          background: "transparent",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                      >
                        <iconify-icon
                          icon="lucide:trash-2"
                          style={{ fontSize: "16px" }}
                        ></iconify-icon>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Special Categories */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label style={{ ...labelStyle, margin: 0 }}>
                    Special Categories (Optional)
                  </label>
                  <p style={helpText}>
                    e.g., Best Design, Most Innovative, People's Choice
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addSpecialCategory}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <iconify-icon icon="lucide:plus"></iconify-icon>
                  Add Category
                </button>
              </div>

              {formData.specialCategories.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {formData.specialCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr auto",
                        gap: "12px",
                        padding: "16px",
                        background: "var(--muted)",
                        borderRadius: "var(--radius-md)",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) =>
                          handleSpecialCategoryChange(
                            idx,
                            "name",
                            e.target.value,
                          )
                        }
                        placeholder="Category name (e.g., Best UI/UX)"
                        style={inputStyle}
                      />
                      <select
                        value={cat.prizeType}
                        onChange={(e) =>
                          handleSpecialCategoryChange(
                            idx,
                            "prizeType",
                            e.target.value,
                          )
                        }
                        style={selectStyle}
                      >
                        {PRIZE_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={cat.prizeValue}
                        onChange={(e) =>
                          handleSpecialCategoryChange(
                            idx,
                            "prizeValue",
                            e.target.value,
                          )
                        }
                        placeholder="Prize value"
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecialCategory(idx)}
                        style={{
                          padding: "8px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid #ef4444",
                          background: "transparent",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                      >
                        <iconify-icon
                          icon="lucide:trash-2"
                          style={{ fontSize: "16px" }}
                        ></iconify-icon>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Judging Criteria */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <label style={{ ...labelStyle, margin: 0 }}>
                  Judging Criteria *
                </label>
                <button
                  type="button"
                  onClick={() => addArrayField("judgingCriteria")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  + Add Criteria
                </button>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {formData.judgingCriteria.map((criteria, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      value={criteria}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          "judgingCriteria",
                          idx,
                          e.target.value,
                        )
                      }
                      placeholder={`Criterion ${idx + 1} (e.g., Innovation - 25%)`}
                      style={inputStyle}
                    />
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("judgingCriteria", idx)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border)",
                          background: "var(--background)",
                          color: "var(--muted-foreground)",
                          cursor: "pointer",
                        }}
                      >
                        <iconify-icon icon="lucide:x"></iconify-icon>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Jury Panel */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <label style={{ ...labelStyle, margin: 0 }}>
                  Jury Panel Names
                </label>
                <button
                  type="button"
                  onClick={() => addArrayField("juryPanelNames")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  + Add Judge
                </button>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {formData.juryPanelNames.map((name, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        handleArrayFieldChange(
                          "juryPanelNames",
                          idx,
                          e.target.value,
                        )
                      }
                      placeholder={`Judge ${idx + 1} name and designation`}
                      style={inputStyle}
                    />
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("juryPanelNames", idx)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border)",
                          background: "var(--background)",
                          color: "var(--muted-foreground)",
                          cursor: "pointer",
                        }}
                      >
                        <iconify-icon icon="lucide:x"></iconify-icon>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 6: REVIEW & SUBMIT ===== */}
        {currentStep === 6 && (
          <>
            {/* AI Validation */}
            <div style={card}>
              <div style={sectionHeader}>
                <iconify-icon
                  icon="lucide:bot"
                  style={{ fontSize: "24px", color: "#8b5cf6" }}
                ></iconify-icon>
                <div>
                  <h2 style={sectionTitle}>AI Validation</h2>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--muted-foreground)",
                      margin: "4px 0 0 0",
                    }}
                  >
                    Smart checks to ensure event quality and authenticity
                  </p>
                </div>
                <button
                  type="button"
                  onClick={runAIValidation}
                  disabled={isValidating}
                  style={{
                    marginLeft: "auto",
                    padding: "10px 18px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: isValidating ? "var(--muted)" : "#8b5cf6",
                    color: isValidating ? "var(--muted-foreground)" : "white",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: isValidating ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {isValidating ? (
                    <>
                      <iconify-icon
                        icon="lucide:loader-2"
                        style={{ animation: "spin 1s linear infinite" }}
                      ></iconify-icon>
                      Validating...
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="lucide:sparkles"></iconify-icon>
                      Run AI Check
                    </>
                  )}
                </button>
              </div>

              {aiValidationResults ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {Object.entries(aiValidationResults).map(([key, result]) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "14px 16px",
                        borderRadius: "var(--radius-md)",
                        background: result.passed
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(245, 158, 11, 0.1)",
                        border: `1px solid ${result.passed ? "rgba(34, 197, 94, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
                      }}
                    >
                      <iconify-icon
                        icon={
                          result.passed
                            ? "lucide:check-circle"
                            : "lucide:alert-triangle"
                        }
                        style={{
                          fontSize: "20px",
                          color: result.passed ? "#16a34a" : "#f59e0b",
                        }}
                      ></iconify-icon>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--foreground)",
                            textTransform: "capitalize",
                          }}
                        >
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          {result.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:shield-check"
                    style={{ fontSize: "40px", marginBottom: "12px" }}
                  ></iconify-icon>
                  <p style={{ margin: 0 }}>
                    Click "Run AI Check" to validate your event before
                    submission
                  </p>
                </div>
              )}
            </div>

            {/* Comprehensive Review */}
            <div style={card}>
              <div style={sectionHeader}>
                <iconify-icon
                  icon="lucide:file-text"
                  style={{ fontSize: "24px", color: "var(--primary)" }}
                ></iconify-icon>
                <div>
                  <h2 style={sectionTitle}>Complete Event Review</h2>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--muted-foreground)",
                      margin: "4px 0 0 0",
                    }}
                  >
                    Please review all details carefully before submitting
                  </p>
                </div>
              </div>

              {/* Section 1: Institution Details */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:building-2"
                    style={{ fontSize: "18px", color: "#6366f1" }}
                  ></iconify-icon>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>
                    Institution Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    style={{
                      marginLeft: "auto",
                      padding: "4px 10px",
                      fontSize: "11px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--muted-foreground)",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                  }}
                >
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      College:
                    </span>{" "}
                    <strong>{formData.collegeName}</strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      AISHE Code:
                    </span>{" "}
                    <strong>{formData.collegeCode}</strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Department:
                    </span>{" "}
                    <strong>{formData.department}</strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Organizing Faculty:
                    </span>{" "}
                    <strong>{formData.facultyName}</strong>
                  </div>
                </div>
              </div>

              {/* Section 2: Event Details */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:calendar-days"
                    style={{ fontSize: "18px", color: "#8b5cf6" }}
                  ></iconify-icon>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>
                    Event Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    style={{
                      marginLeft: "auto",
                      padding: "4px 10px",
                      fontSize: "11px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--muted-foreground)",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                  }}
                >
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Title:
                    </span>{" "}
                    <strong>{formData.title || "Not set"}</strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Type:
                    </span>{" "}
                    <strong>{formData.eventType || "Not set"}</strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Category:
                    </span>{" "}
                    <strong>
                      {EVENT_CATEGORIES.find(
                        (c) => c.value === formData.category,
                      )?.label || "Not set"}
                    </strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Level:
                    </span>{" "}
                    <strong>
                      {EVENT_LEVELS.find((l) => l.value === formData.eventLevel)
                        ?.label || "Not set"}
                    </strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Mode:
                    </span>{" "}
                    <strong>{formData.mode}</strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Venue/Link:
                    </span>{" "}
                    <strong>
                      {formData.venue || formData.platformLink || "Not set"}
                    </strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Start Date:
                    </span>{" "}
                    <strong>{formData.startDate || "Not set"}</strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      End Date:
                    </span>{" "}
                    <strong>{formData.endDate || "Not set"}</strong>
                  </div>
                  <div style={{ fontSize: "13px", gridColumn: "span 2" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Description:
                    </span>{" "}
                    <strong>
                      {formData.description?.substring(0, 150) || "Not set"}
                      {formData.description?.length > 150 ? "..." : ""}
                    </strong>
                  </div>
                </div>
                {formData.skillDomains.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      Skill Domains:{" "}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginTop: "6px",
                      }}
                    >
                      {formData.skillDomains.map((domain) => (
                        <span
                          key={domain}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            background: "rgba(139, 92, 246, 0.1)",
                            color: "#8b5cf6",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Participation & Registration */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:users"
                    style={{ fontSize: "18px", color: "#22c55e" }}
                  ></iconify-icon>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>
                    Participation & Registration
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    style={{
                      marginLeft: "auto",
                      padding: "4px 10px",
                      fontSize: "11px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--muted-foreground)",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                  }}
                >
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Participation Type:
                    </span>{" "}
                    <strong>{formData.participationType}</strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Team Size:
                    </span>{" "}
                    <strong>
                      {formData.minTeamSize} - {formData.maxTeamSize} members
                    </strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Expected Participants:
                    </span>{" "}
                    <strong>{formData.expectedParticipants || 0}</strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Registration Fee:
                    </span>{" "}
                    <strong>
                      {formData.registrationFee > 0
                        ? `₹${formData.registrationFee}`
                        : "Free"}
                    </strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Deadline:
                    </span>{" "}
                    <strong>
                      {formData.registrationDeadline || "Not set"}
                    </strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Email Verification:
                    </span>{" "}
                    <strong>
                      {formData.requiresEmailVerification
                        ? "Required"
                        : "Not Required"}
                    </strong>
                  </div>
                </div>
                {formData.eligibleDepartments.length > 0 && (
                  <div style={{ marginTop: "12px", fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Eligible Departments:{" "}
                    </span>
                    <strong>{formData.eligibleDepartments.join(", ")}</strong>
                  </div>
                )}
                {formData.eligibleYears.length > 0 && (
                  <div style={{ marginTop: "6px", fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Eligible Years:{" "}
                    </span>
                    <strong>{formData.eligibleYears.join(", ")}</strong>
                  </div>
                )}
              </div>

              {/* Section 4: Accreditation Mapping */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:award"
                    style={{ fontSize: "18px", color: "#f59e0b" }}
                  ></iconify-icon>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>
                    Accreditation Mapping
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    style={{
                      marginLeft: "auto",
                      padding: "4px 10px",
                      fontSize: "11px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--muted-foreground)",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                  }}
                >
                  {formData.naacCriteria.length > 0 && (
                    <div style={{ fontSize: "13px" }}>
                      <span style={{ color: "var(--muted-foreground)" }}>
                        NAAC Criteria:{" "}
                      </span>
                      <strong>{formData.naacCriteria.join(", ")}</strong>
                    </div>
                  )}
                  {formData.nbaOutcomes.length > 0 && (
                    <div style={{ fontSize: "13px" }}>
                      <span style={{ color: "var(--muted-foreground)" }}>
                        NBA Outcomes:{" "}
                      </span>
                      <strong>{formData.nbaOutcomes.join(", ")}</strong>
                    </div>
                  )}
                  {formData.sdgGoals.length > 0 && (
                    <div style={{ fontSize: "13px" }}>
                      <span style={{ color: "var(--muted-foreground)" }}>
                        SDG Goals:{" "}
                      </span>
                      <strong>{formData.sdgGoals.join(", ")}</strong>
                    </div>
                  )}
                  {formData.nbaRemarks && (
                    <div style={{ fontSize: "13px", gridColumn: "span 2" }}>
                      <span style={{ color: "var(--muted-foreground)" }}>
                        NBA Remarks:{" "}
                      </span>
                      <strong>{formData.nbaRemarks}</strong>
                    </div>
                  )}
                </div>
                {formData.naacCriteria.length === 0 &&
                  formData.nbaOutcomes.length === 0 &&
                  formData.sdgGoals.length === 0 && (
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--muted-foreground)",
                        fontStyle: "italic",
                      }}
                    >
                      No accreditation mappings selected
                    </div>
                  )}
              </div>

              {/* Section 5: Winners & Judging */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:trophy"
                    style={{ fontSize: "18px", color: "#ec4899" }}
                  ></iconify-icon>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>
                    Winners & Judging
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    style={{
                      marginLeft: "auto",
                      padding: "4px 10px",
                      fontSize: "11px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--muted-foreground)",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>

                {/* Winner Slots */}
                <div style={{ marginBottom: "16px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Winner Positions ({formData.winnerSlots.length})
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    {formData.winnerSlots.map((slot, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "var(--radius-md)",
                          background:
                            slot.type === "standard"
                              ? "rgba(34, 197, 94, 0.1)"
                              : "rgba(139, 92, 246, 0.1)",
                          border: `1px solid ${slot.type === "standard" ? "rgba(34, 197, 94, 0.2)" : "rgba(139, 92, 246, 0.2)"}`,
                          fontSize: "12px",
                        }}
                      >
                        <strong
                          style={{
                            color:
                              slot.type === "standard" ? "#16a34a" : "#8b5cf6",
                          }}
                        >
                          {slot.position}
                        </strong>
                        {slot.prize && (
                          <span style={{ color: "var(--muted-foreground)" }}>
                            {" "}
                            - ₹{slot.prize}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Judges */}
                {formData.judges.length > 0 && (
                  <div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Judges Panel ({formData.judges.length})
                    </span>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "8px",
                        marginTop: "8px",
                      }}
                    >
                      {formData.judges.map((judge, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "var(--radius-md)",
                            background: "var(--muted)",
                            fontSize: "13px",
                          }}
                        >
                          <strong>{judge.name || `Judge ${index + 1}`}</strong>
                          {judge.designation && (
                            <span
                              style={{
                                color: "var(--muted-foreground)",
                                display: "block",
                                fontSize: "12px",
                              }}
                            >
                              {judge.designation}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Judging Criteria */}
                {formData.judgingCriteria.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Judging Criteria
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginTop: "8px",
                      }}
                    >
                      {formData.judgingCriteria.map((criteria, index) => (
                        <span
                          key={index}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            background: "var(--muted)",
                            fontSize: "11px",
                          }}
                        >
                          {criteria.name} ({criteria.weight}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 6: Attachments & Resources */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:paperclip"
                    style={{ fontSize: "18px", color: "#06b6d4" }}
                  ></iconify-icon>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>
                    Attachments & Resources
                  </h3>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                  }}
                >
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Brochure:
                    </span>{" "}
                    <strong
                      style={{
                        color: formData.brochureFile
                          ? "#22c55e"
                          : "var(--muted-foreground)",
                      }}
                    >
                      {formData.brochureFile
                        ? formData.brochureFile.name
                        : "Not uploaded"}
                    </strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Approval Letter:
                    </span>{" "}
                    <strong
                      style={{
                        color: formData.approvalLetterFile
                          ? "#22c55e"
                          : "var(--muted-foreground)",
                      }}
                    >
                      {formData.approvalLetterFile
                        ? formData.approvalLetterFile.name
                        : "Not uploaded"}
                    </strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Contact Email:
                    </span>{" "}
                    <strong>{formData.contactEmail || "Not set"}</strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>
                      Contact Phone:
                    </span>{" "}
                    <strong>{formData.contactPhone || "Not set"}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Flow Notice */}
            <div
              style={{
                ...alertBox,
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              <iconify-icon
                icon="lucide:info"
                style={{ fontSize: "20px", color: "#f59e0b", flexShrink: 0 }}
              ></iconify-icon>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "4px",
                  }}
                >
                  Approval Workflow
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                    lineHeight: 1.6,
                  }}
                >
                  After submission, your event will follow this approval flow:
                  <br />
                  <strong>
                    Faculty Creates Event → College Admin Approves → Event Goes
                    Live
                  </strong>
                  <br />
                  You'll be notified once your event is approved or if any
                  changes are requested.
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "24px",
          }}
        >
          <button
            type="button"
            onClick={() =>
              currentStep > 1
                ? setCurrentStep(currentStep - 1)
                : navigate("/admin/my-events")
            }
            style={{
              padding: "12px 24px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <iconify-icon icon="lucide:arrow-left"></iconify-icon>
            {currentStep === 1 ? "Cancel" : "Previous"}
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              style={{
                padding: "12px 24px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: canProceed() ? "var(--primary)" : "var(--muted)",
                color: canProceed() ? "white" : "var(--muted-foreground)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: canProceed() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Next Step
              <iconify-icon icon="lucide:arrow-right"></iconify-icon>
            </button>
          ) : (
            <button
              type="submit"
              style={{
                padding: "12px 28px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "white",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <iconify-icon icon="lucide:send"></iconify-icon>
              Submit for Approval
            </button>
          )}
        </div>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
