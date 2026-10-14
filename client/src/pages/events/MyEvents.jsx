import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../context/EventsContext";
import { useAuth, ROLES } from "../../context/AuthContext";
import { SEED_STUDENTS } from "../../data/seeds";

const tabs = [
  "All Events",
  "My Registered",
  "Recommended",
  "Completed",
  "Invitations",
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

// ===== ML RECOMMENDATION ENGINE =====
// Simulated user profile (would come from user context/auth in production)
const USER_PROFILE = {
  id: "s1",
  name: "Ananya Gupta",
  department: "CSE",
  year: "3rd Year",
  siiScore: 892, // Student Innovation Index (0-1000)
  skills: ["Python", "Machine Learning", "React", "Node.js", "Data Science"],
  interests: ["Artificial Intelligence", "Web Development", "IoT"],
  pastParticipation: ["Hackathon", "Workshop", "Bootcamp"],
  achievements: {
    hackathonsWon: 2,
    workshopsAttended: 5,
    certificationsEarned: 3,
  },
  preferredMode: "hybrid", // online, offline, hybrid
};

// Skill domain mappings for semantic matching
const SKILL_DOMAIN_MAP = {
  "Artificial Intelligence": [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "AI",
    "Neural Networks",
    "Data Science",
  ],
  "Machine Learning": [
    "Python",
    "Scikit-learn",
    "TensorFlow",
    "PyTorch",
    "Data Science",
    "Statistics",
    "AI",
  ],
  "Web Development": [
    "React",
    "Node.js",
    "JavaScript",
    "HTML",
    "CSS",
    "MongoDB",
    "Express",
    "Full Stack",
  ],
  IoT: [
    "Arduino",
    "Raspberry Pi",
    "Embedded Systems",
    "Sensors",
    "Cloud Computing",
    "Edge Computing",
  ],
  Robotics: [
    "Arduino",
    "ROS",
    "Embedded Systems",
    "Mechanical",
    "Electronics",
    "Control Systems",
  ],
  Blockchain: [
    "Solidity",
    "Web3",
    "Ethereum",
    "Smart Contracts",
    "Cryptography",
  ],
  "Cloud Computing": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "DevOps"],
  "Data Science": [
    "Python",
    "R",
    "Statistics",
    "Machine Learning",
    "Data Visualization",
    "SQL",
  ],
  "Core Engineering": [
    "Mechanical",
    "Electronics",
    "Electrical",
    "Civil",
    "Design",
  ],
};

// Event level difficulty mapping
const EVENT_LEVEL_DIFFICULTY = {
  college: 1,
  inter_college: 2,
  state: 3,
  national: 4,
  international: 5,
};

// Year to experience level mapping
const YEAR_EXPERIENCE = {
  "1st Year": 1,
  "2nd Year": 2,
  "3rd Year": 3,
  "4th Year": 4,
  "All Years": 2.5,
};

// ===== ML RECOMMENDATION ALGORITHM =====
const calculateMatchScore = (event, userProfile) => {
  let totalScore = 0;
  let maxScore = 0;
  const factors = {};

  // 1. SKILL ALIGNMENT (Weight: 35%)
  const skillWeight = 0.35;
  maxScore += skillWeight * 100;

  const eventDomains = [
    ...(event.skillDomains || []),
    event.domain,
    ...(event.tags || []),
  ]
    .filter(Boolean)
    .map((s) => s.toLowerCase());

  const userSkillsLower = userProfile.skills.map((s) => s.toLowerCase());
  const userInterestsLower = userProfile.interests.map((s) => s.toLowerCase());

  // Calculate semantic skill match
  let skillMatchCount = 0;
  let totalSkillChecks = 0;

  eventDomains.forEach((domain) => {
    const relatedSkills =
      SKILL_DOMAIN_MAP[
        Object.keys(SKILL_DOMAIN_MAP).find(
          (key) =>
            key.toLowerCase() === domain ||
            SKILL_DOMAIN_MAP[key].some((s) => s.toLowerCase() === domain),
        )
      ] || [];

    const hasDirectMatch = userSkillsLower.some(
      (skill) => domain.includes(skill) || skill.includes(domain),
    );

    const hasRelatedMatch = relatedSkills.some((relSkill) =>
      userSkillsLower.some((skill) =>
        skill.toLowerCase().includes(relSkill.toLowerCase()),
      ),
    );

    const hasInterestMatch = userInterestsLower.some(
      (interest) =>
        domain.includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(domain),
    );

    if (hasDirectMatch) skillMatchCount += 1.0;
    else if (hasRelatedMatch) skillMatchCount += 0.7;
    else if (hasInterestMatch) skillMatchCount += 0.5;
    totalSkillChecks++;
  });

  const skillScore =
    totalSkillChecks > 0
      ? (skillMatchCount / totalSkillChecks) * 100 * skillWeight
      : 0;
  totalScore += skillScore;
  factors.skillAlignment = Math.round((skillScore / (skillWeight * 100)) * 100);

  // 2. EXPERIENCE LEVEL MATCH (Weight: 25%)
  const levelWeight = 0.25;
  maxScore += levelWeight * 100;

  const eventDifficulty = EVENT_LEVEL_DIFFICULTY[event.eventLevel] || 2;
  const userExperience = YEAR_EXPERIENCE[userProfile.year] || 2;
  const capacityBonus = userProfile.siiScore / 1000; // Normalized 0-1

  // Gaussian-like matching - best when event matches experience
  const adjustedUserLevel = userExperience + capacityBonus * 1.5;
  const levelDiff = Math.abs(eventDifficulty - adjustedUserLevel);
  const levelFit = Math.exp(-0.5 * Math.pow(levelDiff, 2)); // Gaussian curve

  const levelScore = levelFit * 100 * levelWeight;
  totalScore += levelScore;
  factors.experienceMatch = Math.round(levelFit * 100);

  // 3. DEPARTMENT ELIGIBILITY (Weight: 15%)
  const deptWeight = 0.15;
  maxScore += deptWeight * 100;

  const eligibleDepts = (event.eligibleDepartments || []).map((d) =>
    d.toLowerCase(),
  );
  const userDept = userProfile.department.toLowerCase();

  let deptScore = 0;
  if (eligibleDepts.length === 0 || eligibleDepts.includes("all departments")) {
    deptScore = 100 * deptWeight;
    factors.departmentMatch = 100;
  } else if (
    eligibleDepts.some((d) => d.includes(userDept) || userDept.includes(d))
  ) {
    deptScore = 100 * deptWeight;
    factors.departmentMatch = 100;
  } else {
    deptScore = 20 * deptWeight; // Small score for cross-domain exploration
    factors.departmentMatch = 20;
  }
  totalScore += deptScore;

  // 4. EVENT TYPE PREFERENCE (Weight: 15%)
  const typeWeight = 0.15;
  maxScore += typeWeight * 100;

  const eventType = (event.eventType || "").toLowerCase();
  const pastTypes = userProfile.pastParticipation.map((t) => t.toLowerCase());

  let typeScore = 0;
  if (pastTypes.some((t) => eventType.includes(t) || t.includes(eventType))) {
    typeScore = 100 * typeWeight;
    factors.typePreference = 100;
  } else {
    // Slight novelty bonus for trying new things
    typeScore = 40 * typeWeight;
    factors.typePreference = 40;
  }
  totalScore += typeScore;

  // 5. CAPACITY/CHALLENGE SCORE (Weight: 10%)
  const capacityWeight = 0.1;
  maxScore += capacityWeight * 100;

  // Higher SII score = better equipped for competitive events
  const isCompetitive = ["hackathon", "competition", "championship"].some(
    (type) => eventType.includes(type),
  );

  let capacityScore = 0;
  if (isCompetitive) {
    // For competitive events, higher SII = better match
    capacityScore = (userProfile.siiScore / 1000) * 100 * capacityWeight;
  } else {
    // For learning events, all levels welcome (slight boost for lower scores)
    const learningBonus = 1 - userProfile.siiScore / 2000;
    capacityScore = (0.7 + learningBonus * 0.3) * 100 * capacityWeight;
  }
  totalScore += capacityScore;
  factors.capacityFit = Math.round(
    (capacityScore / (capacityWeight * 100)) * 100,
  );

  // Calculate final percentage
  const matchPercentage = Math.round((totalScore / maxScore) * 100);

  // Generate recommendation reason
  const topFactors = Object.entries(factors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([key]) => key);

  let reason = "";
  if (topFactors.includes("skillAlignment") && factors.skillAlignment > 70) {
    reason = "Strong skill match with your profile";
  } else if (
    topFactors.includes("experienceMatch") &&
    factors.experienceMatch > 70
  ) {
    reason = "Perfect for your experience level";
  } else if (factors.departmentMatch === 100) {
    reason = "Relevant to your department";
  } else if (factors.capacityFit > 80) {
    reason = "Great challenge for your capability";
  } else {
    reason = "Aligns with your interests";
  }

  return {
    score: matchPercentage,
    factors,
    reason,
    confidence:
      matchPercentage > 75 ? "high" : matchPercentage > 50 ? "medium" : "low",
  };
};

// Get recommended events with ML scores
const getRecommendedEvents = (events, userProfile, limit = 10) => {
  const scoredEvents = events.map((event) => ({
    ...event,
    recommendation: calculateMatchScore(event, userProfile),
  }));

  // Sort by score and filter minimum threshold
  return scoredEvents
    .filter((e) => e.recommendation.score >= 30 && e.status !== "closed")
    .sort((a, b) => b.recommendation.score - a.recommendation.score)
    .slice(0, limit);
};

// ===== REGISTRATION SYSTEM =====
// Available participants for team selection (excluding current user)
const AVAILABLE_PARTICIPANTS = SEED_STUDENTS.filter(
  (s) => s.id !== USER_PROFILE.id,
);

// Local storage keys for persistence
const REGISTRATIONS_KEY = "campusmitra_registrations";
const INVITATIONS_KEY = "campusmitra_invitations";
const FEEDBACK_KEY = "campusmitra_event_feedback";

// Dummy invitation data for UI demonstration
const DUMMY_INVITATIONS = [
  {
    id: "inv-demo-1",
    registrationId: "reg-demo-1",
    eventId: 1,
    eventTitle: "Smart India Hackathon 2026",
    eventImage:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400",
    eventDate: "March 15-17, 2026",
    teamName: "Code Warriors",
    invitedBy: "Rahul Sharma",
    invitedById: "s5",
    invitedTo: USER_PROFILE.id,
    invitedToName: USER_PROFILE.name,
    teamSize: 4,
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "inv-demo-2",
    registrationId: "reg-demo-2",
    eventId: 3,
    eventTitle: "AI/ML Workshop: Deep Learning Fundamentals",
    eventImage:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
    eventDate: "March 20, 2026",
    teamName: "Neural Ninjas",
    invitedBy: "Priya Patel",
    invitedById: "s8",
    invitedTo: USER_PROFILE.id,
    invitedToName: USER_PROFILE.name,
    teamSize: 3,
    status: "pending",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "inv-demo-3",
    registrationId: "reg-demo-3",
    eventId: 5,
    eventTitle: "Robotics Challenge 2026",
    eventImage:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
    eventDate: "April 5-6, 2026",
    teamName: "RoboTech Masters",
    invitedBy: "Amit Kumar",
    invitedById: "s12",
    invitedTo: USER_PROFILE.id,
    invitedToName: USER_PROFILE.name,
    teamSize: 5,
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
];

// Domain filter mapping for event categorization
const DOMAIN_FILTER_MAP = {
  Hackathons: ["hackathon", "hack", "code sprint"],
  Workshops: ["workshop", "bootcamp", "training"],
  Seminars: ["seminar", "talk", "lecture", "conference", "symposium"],
  "Web Development": [
    "web",
    "frontend",
    "backend",
    "full stack",
    "react",
    "node",
    "javascript",
  ],
  "AI/ML": [
    "ai",
    "ml",
    "machine learning",
    "artificial intelligence",
    "deep learning",
    "neural",
    "data science",
  ],
  Robotics: ["robot", "iot", "embedded", "arduino", "hardware"],
};

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
      const totalTeamSize = formData.teammates.length + 1; // +1 for current user
      if (totalTeamSize < minTeamSize) {
        newErrors.teammates = `Minimum ${minTeamSize} team members required (including you)`;
      }
    }

    if (event.registrationFee > 0 && formData.paymentStatus === "pending") {
      // Payment can be pending for now, will mark as draft
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
      // Status logic:
      // - "draft" if teammates haven't all approved OR payment pending
      // - "registered" if all conditions met
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
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
                  readOnly
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
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, year: e.target.value }))
                  }
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
                  readOnly
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

// ===== INVITATION CARD COMPONENT =====
const InvitationCard = ({ invitation, onAccept, onDecline }) => {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        gap: "16px",
        marginBottom: "12px",
      }}
    >
      <img
        src={invitation.eventImage}
        alt={invitation.eventTitle}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "10px",
            color: "#f59e0b",
            fontWeight: 600,
            marginBottom: "4px",
          }}
        >
          TEAM INVITATION
        </div>
        <h3
          style={{
            margin: "0 0 4px 0",
            fontSize: "16px",
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          {invitation.eventTitle}
        </h3>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#64748b" }}>
          <strong>{invitation.invitedBy}</strong> invited you to join team{" "}
          <strong>"{invitation.teamName}"</strong>
        </p>
        <div
          style={{
            display: "flex",
            gap: "8px",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <iconify-icon icon="lucide:calendar"></iconify-icon>
            {invitation.eventDate}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <iconify-icon icon="lucide:users"></iconify-icon>
            {invitation.teamSize} members
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          onClick={() => onAccept(invitation.id)}
          style={{
            padding: "8px 16px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <iconify-icon icon="lucide:check"></iconify-icon>
          Accept
        </button>
        <button
          onClick={() => onDecline(invitation.id)}
          style={{
            padding: "8px 16px",
            background: "white",
            color: "#ef4444",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <iconify-icon icon="lucide:x"></iconify-icon>
          Decline
        </button>
      </div>
    </div>
  );
};

// ===== FEEDBACK MODAL COMPONENT =====
const FeedbackModal = ({ event, onClose, onSubmit, currentUser }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [categories, setCategories] = useState({
    content: 0,
    organization: 0,
    venue: 0,
    speakers: 0,
  });
  const [wouldRecommend, setWouldRecommend] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please provide an overall rating");
      return;
    }

    setIsSubmitting(true);

    const feedbackData = {
      id: `fb-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userDepartment: currentUser.department,
      overallRating: rating,
      categoryRatings: categories,
      feedback: feedback.trim(),
      wouldRecommend,
      submittedAt: new Date().toISOString(),
    };

    onSubmit(feedbackData);
  };

  const StarRating = ({ value, onChange, onHover, size = 24 }) => {
    return (
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => onHover && onHover(star)}
            onMouseLeave={() => onHover && onHover(0)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px",
            }}
          >
            <iconify-icon
              icon={
                star <= (onHover ? hoverRating || value : value)
                  ? "lucide:star"
                  : "lucide:star"
              }
              style={{
                fontSize: `${size}px`,
                color: star <= (hoverRating || value) ? "#f59e0b" : "#e2e8f0",
                fill: star <= (hoverRating || value) ? "#f59e0b" : "none",
              }}
            ></iconify-icon>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
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
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Share Your Feedback
            </h2>
            <p
              style={{ margin: "4px 0 0", fontSize: "14px", color: "#64748b" }}
            >
              {event.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <iconify-icon
              icon="lucide:x"
              style={{ fontSize: "20px", color: "#64748b" }}
            ></iconify-icon>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          {/* Overall Rating */}
          <div style={{ marginBottom: "24px", textAlign: "center" }}>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: "12px",
              }}
            >
              Overall Experience *
            </label>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "8px" }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    transition: "transform 0.2s",
                    transform:
                      star <= (hoverRating || rating)
                        ? "scale(1.1)"
                        : "scale(1)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:star"
                    style={{
                      fontSize: "36px",
                      color:
                        star <= (hoverRating || rating) ? "#f59e0b" : "#e2e8f0",
                    }}
                  ></iconify-icon>
                </button>
              ))}
            </div>
            <p
              style={{ margin: "8px 0 0", fontSize: "13px", color: "#64748b" }}
            >
              {rating === 0
                ? "Click to rate"
                : ["Poor", "Fair", "Good", "Very Good", "Excellent"][
                    rating - 1
                  ]}
            </p>
          </div>

          {/* Category Ratings */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: "12px",
              }}
            >
              Rate Different Aspects
            </label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {[
                {
                  key: "content",
                  label: "Content Quality",
                  icon: "lucide:book-open",
                },
                {
                  key: "organization",
                  label: "Organization",
                  icon: "lucide:calendar-check",
                },
                {
                  key: "venue",
                  label: "Venue & Facilities",
                  icon: "lucide:building",
                },
                {
                  key: "speakers",
                  label: "Speakers/Mentors",
                  icon: "lucide:users",
                },
              ].map((cat) => (
                <div
                  key={cat.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <iconify-icon
                      icon={cat.icon}
                      style={{ fontSize: "18px", color: "#64748b" }}
                    ></iconify-icon>
                    <span style={{ fontSize: "13px", color: "#475569" }}>
                      {cat.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setCategories((prev) => ({
                            ...prev,
                            [cat.key]: star,
                          }))
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px",
                        }}
                      >
                        <iconify-icon
                          icon="lucide:star"
                          style={{
                            fontSize: "18px",
                            color:
                              star <= categories[cat.key]
                                ? "#f59e0b"
                                : "#e2e8f0",
                          }}
                        ></iconify-icon>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Would Recommend */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: "12px",
              }}
            >
              Would you recommend this event to others?
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                {
                  value: true,
                  label: "Yes, definitely!",
                  icon: "lucide:thumbs-up",
                  color: "#10b981",
                },
                {
                  value: false,
                  label: "No, not really",
                  icon: "lucide:thumbs-down",
                  color: "#ef4444",
                },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setWouldRecommend(opt.value)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: `2px solid ${wouldRecommend === opt.value ? opt.color : "#e2e8f0"}`,
                    borderRadius: "8px",
                    background:
                      wouldRecommend === opt.value ? `${opt.color}10` : "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: wouldRecommend === opt.value ? opt.color : "#64748b",
                    transition: "all 0.2s",
                  }}
                >
                  <iconify-icon
                    icon={opt.icon}
                    style={{ fontSize: "18px" }}
                  ></iconify-icon>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Written Feedback */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              Share your thoughts (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did you like? What could be improved? Any suggestions for future events?"
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              background: "white",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: rating === 0 ? "#94a3b8" : "#1e3a8a",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: rating === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {isSubmitting ? (
              <>
                <iconify-icon
                  icon="lucide:loader-2"
                  style={{
                    fontSize: "16px",
                    animation: "spin 1s linear infinite",
                  }}
                ></iconify-icon>
                Submitting...
              </>
            ) : (
              <>
                <iconify-icon
                  icon="lucide:send"
                  style={{ fontSize: "16px" }}
                ></iconify-icon>
                Submit Feedback
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to format date for display
const formatEventDate = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options = { month: "short", day: "numeric" };
  const yearOptions = { year: "numeric" };

  const startStr = start.toLocaleDateString("en-US", options).toUpperCase();
  const endStr = end.toLocaleDateString("en-US", options).toUpperCase();
  const year = start.toLocaleDateString("en-US", yearOptions);

  if (startDate === endDate) {
    return `${startStr}, ${year}`;
  }
  return `${startStr}-${end.getDate()}, ${year}`;
};

// Helper function to calculate seat status
const getSeatStatus = (seats, totalSeats) => {
  if (seats === null || totalSeats === null) return "unlimited";
  if (seats === 0) return "closed";
  const pct = ((totalSeats - seats) / totalSeats) * 100;
  if (pct >= 90) return "critical";
  if (pct >= 60) return "warning";
  return "success";
};

const statusColors = {
  success: "#10b981",
  warning: "#eab308",
  critical: "#ef4444",
  closed: "#64748b",
  unlimited: "#10b981",
};

export default function Myevents() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const navigate = useNavigate();
  const { events: contextEvents } = useEvents();
  const currentUserProfile = useMemo(() => {
    const githubUsername =
      user?.role === ROLES.STUDENT && user?.githubUsername?.trim()
        ? user.githubUsername.trim()
        : "";

    if (!githubUsername) {
      return USER_PROFILE;
    }

    return {
      ...USER_PROFILE,
      name: githubUsername,
    };
  }, [user]);

  // Registration modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEventForRegistration, setSelectedEventForRegistration] =
    useState(null);

  // Registrations state (persisted to localStorage)
  const [registrations, setRegistrations] = useState(() =>
    loadFromStorage(REGISTRATIONS_KEY, []),
  );
  const [invitations, setInvitations] = useState(() => {
    const stored = loadFromStorage(INVITATIONS_KEY, []);
    // Include dummy invitations for UI demonstration if no stored invitations
    if (stored.length === 0) {
      return DUMMY_INVITATIONS;
    }
    return stored;
  });

  // Persist registrations to localStorage
  useEffect(() => {
    saveToStorage(REGISTRATIONS_KEY, registrations);
  }, [registrations]);

  useEffect(() => {
    saveToStorage(INVITATIONS_KEY, invitations);
  }, [invitations]);

  // Handle registration submission
  const handleRegistrationSubmit = (registration) => {
    // Add to registrations
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
    setSelectedEventForRegistration(null);
  };

  // Handle invitation acceptance
  const handleAcceptInvitation = (invitationId) => {
    setInvitations((prev) => {
      const updated = prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: "accepted" } : inv,
      );

      // Check if all teammates for this registration have accepted
      const acceptedInvitation = updated.find((inv) => inv.id === invitationId);
      if (acceptedInvitation) {
        const relatedInvitations = updated.filter(
          (inv) => inv.registrationId === acceptedInvitation.registrationId,
        );
        const allAccepted = relatedInvitations.every(
          (inv) => inv.status === "accepted",
        );

        if (allAccepted) {
          // Update registration status to "registered"
          setRegistrations((prevRegs) =>
            prevRegs.map((reg) =>
              reg.id === acceptedInvitation.registrationId
                ? {
                    ...reg,
                    status:
                      reg.paymentStatus === "paid" || reg.registrationFee === 0
                        ? "registered"
                        : "draft",
                  }
                : reg,
            ),
          );
        }
      }

      return updated;
    });
  };

  // Handle invitation decline
  const handleDeclineInvitation = (invitationId) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: "declined" } : inv,
      ),
    );
  };

  // ===== FEEDBACK STATE & HANDLERS =====
  const [feedbacks, setFeedbacks] = useState(() =>
    loadFromStorage(FEEDBACK_KEY, []),
  );
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedEventForFeedback, setSelectedEventForFeedback] =
    useState(null);

  // Persist feedbacks to localStorage
  useEffect(() => {
    saveToStorage(FEEDBACK_KEY, feedbacks);
  }, [feedbacks]);

  // Handle feedback submission
  const handleFeedbackSubmit = (feedbackData) => {
    setFeedbacks((prev) => [...prev, feedbackData]);
    setShowFeedbackModal(false);
    setSelectedEventForFeedback(null);
    alert("Thank you for your feedback! Your response has been submitted.");
  };

  // Open feedback modal for a completed event
  const openFeedbackModal = (event, e) => {
    e.stopPropagation();
    const fullEvent = getFullEventById(event.id);
    if (fullEvent) {
      setSelectedEventForFeedback(fullEvent);
      setShowFeedbackModal(true);
    }
  };

  // Check if user has already submitted feedback for an event
  const hasSubmittedFeedback = (eventId) => {
    return feedbacks.some(
      (fb) => fb.eventId === eventId && fb.userId === currentUserProfile.id,
    );
  };

  // Get incoming invitations for current user
  const incomingInvitations = useMemo(() => {
    return invitations.filter(
      (inv) =>
        inv.invitedTo === currentUserProfile.id && inv.status === "pending",
    );
  }, [invitations, currentUserProfile.id]);

  // Get registered event IDs
  const registeredEventIds = useMemo(() => {
    return new Set(registrations.map((r) => r.eventId));
  }, [registrations]);

  // Get event object from contextEvents for registration modal
  const getFullEventById = (eventId) => {
    return contextEvents.find((e) => e.id === eventId);
  };

  // Open registration modal
  const openRegistrationModal = (event, e) => {
    e.stopPropagation();
    const fullEvent = getFullEventById(event.id);
    if (fullEvent) {
      setSelectedEventForRegistration(fullEvent);
      setShowRegistrationModal(true);
    }
  };

  // Transform context events for display
  const events = useMemo(() => {
    return contextEvents.map((event) => {
      const seatsLeft = event.seats;
      const totalSeats = event.totalSeats || event.maxParticipants;
      const seatsPct = totalSeats
        ? ((totalSeats - (seatsLeft || 0)) / totalSeats) * 100
        : 0;

      // Calculate ML recommendation score for each event
      const recommendation = calculateMatchScore(event, currentUserProfile);

      // Get registration status for this event
      const registration = registrations.find((r) => r.eventId === event.id);

      return {
        id: event.id,
        image: event.image,
        category: event.eventType,
        date: formatEventDate(event.startDate, event.endDate),
        title: event.title,
        college: event.collegeName || event.college,
        tags: event.tags || [],
        seatsLeft: seatsLeft,
        seatsPct: seatsPct,
        status:
          event.status === "closed"
            ? "closed"
            : getSeatStatus(seatsLeft, totalSeats),
        // ML Recommendation data
        recommendation,
        matchScore: recommendation.score,
        matchReason: recommendation.reason,
        matchConfidence: recommendation.confidence,
        // Original event data for filtering
        eventLevel: event.eventLevel,
        skillDomains: event.skillDomains,
        domain: event.domain,
        eventType: event.eventType,
        // Registration data
        registration,
        isRegistered: !!registration,
        registrationStatus: registration?.status || null,
        // Feedback data
        hasFeedback: hasSubmittedFeedback(event.id),
        isCompleted: event.status === "closed",
      };
    });
  }, [contextEvents, registrations, feedbacks, currentUserProfile]);

  // Get ML-recommended events sorted by match score
  const recommendedEvents = useMemo(() => {
    return events
      .filter((e) => e.matchScore >= 40 && e.status !== "closed")
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [events]);

  // Get my registered events
  const myRegisteredEvents = useMemo(() => {
    return events.filter((e) => e.isRegistered);
  }, [events]);

  // Helper function to check if event matches domain filter
  const matchesDomainFilter = (event, filterName) => {
    if (filterName === "All Domains") return true;

    const keywords = DOMAIN_FILTER_MAP[filterName] || [];
    const searchText = [
      event.title,
      event.category,
      event.eventType,
      event.domain,
      ...(event.tags || []),
      ...(event.skillDomains || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return keywords.some((keyword) =>
      searchText.includes(keyword.toLowerCase()),
    );
  };

  // Filter events based on active tab and domain filter
  const displayedEvents = useMemo(() => {
    const selectedFilter = filters[activeFilter];

    let tabFilteredEvents;
    switch (activeTab) {
      case 0: // All Events
        tabFilteredEvents = events;
        break;
      case 1: // My Registered
        tabFilteredEvents = myRegisteredEvents;
        break;
      case 2: // Recommended
        tabFilteredEvents = recommendedEvents;
        break;
      case 3: // Completed
        tabFilteredEvents = events.filter((e) => e.status === "closed");
        break;
      case 4: // Invitations - handled separately
        return [];
      default:
        tabFilteredEvents = events;
    }

    // Apply domain filter
    return tabFilteredEvents.filter((event) =>
      matchesDomainFilter(event, selectedFilter),
    );
  }, [events, recommendedEvents, myRegisteredEvents, activeTab, activeFilter]);

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            margin: "0 0 8px 0",
            color: "#1e3a8a",
          }}
        >
          Explore Events
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Discover hackathons, workshops, and seminars across the network.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "24px",
        }}
      >
        {tabs.map((tab, i) => (
          <div
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: "12px 0",
              fontSize: "14px",
              fontWeight: activeTab === i ? 600 : 500,
              color: activeTab === i ? "#1e3a8a" : "#64748b",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {tab}
            {tab === "Recommended" && (
              <span
                style={{
                  background: "#f59e0b",
                  color: "white",
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "8px",
                }}
              >
                AI
              </span>
            )}
            {tab === "Invitations" && incomingInvitations.length > 0 && (
              <span
                style={{
                  background: "#ef4444",
                  color: "white",
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "8px",
                  minWidth: "18px",
                  textAlign: "center",
                }}
              >
                {incomingInvitations.length}
              </span>
            )}
            {tab === "My Registered" && myRegisteredEvents.length > 0 && (
              <span
                style={{
                  background: "#10b981",
                  color: "white",
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "8px",
                  minWidth: "18px",
                  textAlign: "center",
                }}
              >
                {myRegisteredEvents.length}
              </span>
            )}
            {activeTab === i && (
              <span
                style={{
                  position: "absolute",
                  bottom: "-1px",
                  left: 0,
                  width: "100%",
                  height: "2px",
                  background: "#1e3a8a",
                }}
              ></span>
            )}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}
      >
        {filters.map((f, i) => (
          <div
            key={f}
            onClick={() => setActiveFilter(i)}
            style={{
              padding: "8px 16px",
              borderRadius: "9999px",
              background: activeFilter === i ? "#1e3a8a" : "#ffffff",
              border: `1px solid ${activeFilter === i ? "#1e3a8a" : "#e2e8f0"}`,
              fontSize: "13px",
              fontWeight: 500,
              color: activeFilter === i ? "white" : "#64748b",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {f}
          </div>
        ))}
      </div>

      {/* AI Recommendation Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #bfdbfe",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 4px 0",
              color: "#1e3a8a",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <iconify-icon
              icon="lucide:sparkles"
              style={{ color: "#f59e0b" }}
            ></iconify-icon>
            AI-Powered Recommendations for {currentUserProfile.name}
          </h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#1e293b" }}>
            Based on your skills ({currentUserProfile.skills.slice(0, 3).join(", ")}),{" "}
            {currentUserProfile.year} experience, and SII Score of{" "}
            {currentUserProfile.siiScore}.
          </p>
        </div>
        <button
          onClick={() => setActiveTab(2)}
          style={{
            background: activeTab === 2 ? "#1e3a8a" : "white",
            border: "1px solid #e2e8f0",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            color: activeTab === 2 ? "white" : "#0f172a",
          }}
        >
          {activeTab === 2
            ? `${recommendedEvents.length} Matches Found`
            : "View Recommendations"}
        </button>
      </div>

      {/* Section Label */}
      <div
        style={{
          fontSize: "18px",
          fontWeight: 600,
          margin: "32px 0 16px 0",
          color: "#0f172a",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {activeTab === 2 ? (
          <>
            <iconify-icon
              icon="lucide:brain"
              style={{ color: "#7c3aed" }}
            ></iconify-icon>
            ML-Recommended Events
            <span
              style={{
                fontSize: "12px",
                background: "#f3e8ff",
                color: "#7c3aed",
                padding: "2px 8px",
                borderRadius: "4px",
                fontWeight: 500,
              }}
            >
              Sorted by Match Score
            </span>
          </>
        ) : activeTab === 1 ? (
          <>
            <iconify-icon
              icon="lucide:ticket"
              style={{ color: "#10b981" }}
            ></iconify-icon>
            My Registered Events
            {myRegisteredEvents.some(
              (e) => e.registrationStatus === "draft",
            ) && (
              <span
                style={{
                  fontSize: "12px",
                  background: "#fef3c7",
                  color: "#b45309",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: 500,
                }}
              >
                {
                  myRegisteredEvents.filter(
                    (e) => e.registrationStatus === "draft",
                  ).length
                }{" "}
                Pending
              </span>
            )}
          </>
        ) : activeTab === 4 ? (
          <>
            <iconify-icon
              icon="lucide:mail"
              style={{ color: "#3b82f6" }}
            ></iconify-icon>
            Team Invitations
            {incomingInvitations.length > 0 && (
              <span
                style={{
                  fontSize: "12px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: 500,
                }}
              >
                {incomingInvitations.length} Pending
              </span>
            )}
          </>
        ) : (
          "Trending & Upcoming"
        )}
      </div>

      {/* Invitations Tab Content */}
      {activeTab === 4 && (
        <div style={{ marginBottom: "32px" }}>
          {incomingInvitations.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px dashed #e2e8f0",
              }}
            >
              <iconify-icon
                icon="lucide:mail-open"
                style={{
                  fontSize: "48px",
                  color: "#cbd5e1",
                  marginBottom: "16px",
                }}
              ></iconify-icon>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  color: "#64748b",
                  fontWeight: 600,
                }}
              >
                No Pending Invitations
              </h3>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
                You'll see team invitations here when someone invites you to
                join their team.
              </p>
            </div>
          ) : (
            <div>
              {incomingInvitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onAccept={handleAcceptInvitation}
                  onDecline={handleDeclineInvitation}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Events Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {displayedEvents.map((ev) => (
          <div
            key={ev.id}
            onClick={() => navigate(`/events/${ev.id}`)}
            style={{
              background: "white",
              border:
                activeTab === 2 && ev.matchScore >= 70
                  ? "2px solid #7c3aed"
                  : "1px solid #e2e8f0",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 24px -10px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            {/* ML Match Score Badge */}
            {activeTab === 2 && ev.matchScore && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  background:
                    ev.matchScore >= 80
                      ? "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
                      : ev.matchScore >= 60
                        ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
                        : "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
                  color: "white",
                  fontSize: "12px",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <iconify-icon
                  icon="lucide:brain"
                  style={{ fontSize: "14px" }}
                ></iconify-icon>
                {ev.matchScore}% Match
              </div>
            )}

            {/* Card Image */}
            <div
              style={{
                height: "160px",
                width: "100%",
                background: "#f1f5f9",
                position: "relative",
              }}
            >
              <img
                src={ev.image}
                alt={ev.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(0,0,0,0.7)",
                  color: "white",
                  fontSize: "11px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backdropFilter: "blur(4px)",
                  fontWeight: 600,
                }}
              >
                {ev.category}
              </div>
            </div>

            {/* Card Body */}
            <div
              style={{
                padding: "20px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Match Reason - only in Recommended tab */}
              {activeTab === 2 && ev.matchReason && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "#7c3aed",
                    fontWeight: 600,
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "#f3e8ff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    width: "fit-content",
                  }}
                >
                  <iconify-icon
                    icon="lucide:sparkles"
                    style={{ fontSize: "12px" }}
                  ></iconify-icon>
                  {ev.matchReason}
                </div>
              )}
              <div
                style={{
                  fontSize: "12px",
                  color: "#f59e0b",
                  fontWeight: 600,
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {ev.date}
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 8px 0",
                  lineHeight: 1.4,
                }}
              >
                {ev.title}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  color: "#64748b",
                  marginBottom: "16px",
                }}
              >
                <iconify-icon
                  icon="lucide:building-2"
                  style={{ fontSize: "14px" }}
                ></iconify-icon>
                {ev.college}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                {ev.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "#f1f5f9",
                      color: "#64748b",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* ML Match Factors Breakdown - only in Recommended tab */}
              {activeTab === 2 && ev.recommendation && (
                <div
                  style={{
                    background: "#faf5ff",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "16px",
                    border: "1px solid #e9d5ff",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#7c3aed",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Match Analysis
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {Object.entries(ev.recommendation.factors).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            background:
                              value >= 70
                                ? "#dcfce7"
                                : value >= 40
                                  ? "#fef3c7"
                                  : "#fee2e2",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                          }}
                        >
                          <span
                            style={{
                              color:
                                value >= 70
                                  ? "#15803d"
                                  : value >= 40
                                    ? "#b45309"
                                    : "#dc2626",
                              fontWeight: 600,
                            }}
                          >
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (s) => s.toUpperCase())}
                            :
                          </span>
                          <span
                            style={{
                              color:
                                value >= 70
                                  ? "#166534"
                                  : value >= 40
                                    ? "#92400e"
                                    : "#b91c1c",
                              fontWeight: 700,
                            }}
                          >
                            {value}%
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Card Footer */}
              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "16px",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {/* Registration Status Badge */}
                  {ev.isRegistered ? (
                    <div
                      style={{
                        fontSize: "12px",
                        color:
                          ev.registrationStatus === "draft"
                            ? "#b45309"
                            : "#15803d",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <iconify-icon
                        icon={
                          ev.registrationStatus === "draft"
                            ? "lucide:clock"
                            : "lucide:check-circle-2"
                        }
                        style={{ fontSize: "14px" }}
                      ></iconify-icon>
                      {ev.registrationStatus === "draft"
                        ? "Draft (Pending Approval)"
                        : "Registered"}
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: "12px",
                          color: ev.status === "closed" ? "#ef4444" : "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        {ev.status === "closed"
                          ? "Registration Closed"
                          : ev.status === "unlimited"
                            ? "Unlimited"
                            : `${ev.seatsLeft} seats left`}
                      </div>
                      <div
                        style={{
                          width: "80px",
                          height: "4px",
                          background: "#f1f5f9",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${ev.seatsPct}%`,
                            background: statusColors[ev.status],
                            borderRadius: "2px",
                          }}
                        ></div>
                      </div>
                    </>
                  )}
                </div>
                {ev.isRegistered ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${ev.id}`);
                    }}
                    style={{
                      background:
                        ev.registrationStatus === "draft"
                          ? "#fef3c7"
                          : "#dcfce7",
                      color:
                        ev.registrationStatus === "draft"
                          ? "#b45309"
                          : "#15803d",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <iconify-icon
                      icon="lucide:eye"
                      style={{ fontSize: "14px" }}
                    ></iconify-icon>
                    {ev.registrationStatus === "draft"
                      ? "View Draft"
                      : "View Details"}
                  </button>
                ) : ev.isCompleted ? (
                  // Completed event - show feedback button
                  <button
                    onClick={(e) => !ev.hasFeedback && openFeedbackModal(ev, e)}
                    style={{
                      background: ev.hasFeedback ? "#dcfce7" : "#7c3aed",
                      color: ev.hasFeedback ? "#15803d" : "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: ev.hasFeedback ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <iconify-icon
                      icon={
                        ev.hasFeedback
                          ? "lucide:check-circle-2"
                          : "lucide:message-square"
                      }
                      style={{ fontSize: "14px" }}
                    ></iconify-icon>
                    {ev.hasFeedback ? "Feedback Sent" : "Give Feedback"}
                  </button>
                ) : (
                  <button
                    disabled={ev.status === "closed"}
                    onClick={(e) => openRegistrationModal(ev, e)}
                    style={{
                      background:
                        ev.status === "closed" ? "transparent" : "#1e3a8a",
                      color: ev.status === "closed" ? "#0f172a" : "white",
                      border:
                        ev.status === "closed" ? "1px solid #e2e8f0" : "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor:
                        ev.status === "closed" ? "not-allowed" : "pointer",
                    }}
                  >
                    {ev.status === "closed" ? "Closed" : "Register Now"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && selectedEventForRegistration && (
        <RegistrationModal
          event={selectedEventForRegistration}
          onClose={() => {
            setShowRegistrationModal(false);
            setSelectedEventForRegistration(null);
          }}
          onSubmit={handleRegistrationSubmit}
          availableParticipants={AVAILABLE_PARTICIPANTS}
          currentUser={currentUserProfile}
        />
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedEventForFeedback && (
        <FeedbackModal
          event={selectedEventForFeedback}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedEventForFeedback(null);
          }}
          onSubmit={handleFeedbackSubmit}
          currentUser={currentUserProfile}
        />
      )}
    </div>
  );
}
