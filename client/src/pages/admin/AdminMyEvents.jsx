import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CertificateTemplate from "../../components/CertificateTemplate";
import { useAuth } from "../../context/AuthContext";

// Feedback storage key (shared with MyEvents.jsx)
const FEEDBACK_KEY = "campusmitra_event_feedback";
const TEAMS_STORAGE_KEY = "campusmitra_event_teams";
const JUDGE_SCORES_KEY = "campusmitra_judge_scores";

// Load feedback from localStorage
const loadFeedback = () => {
  try {
    const saved = localStorage.getItem(FEEDBACK_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
    ``;
  }
};

/* ===== SAMPLE DATA ===== */
const EVENT_TYPES = [
  "Hackathon",
  "Workshop",
  "Seminar",
  "Competition",
  "Conference",
  "Webinar",
  "Bootcamp",
  "Ideathon",
];
const DOMAINS = [
  "AI/ML",
  "Web Development",
  "Mobile Development",
  "IoT",
  "Blockchain",
  "Cybersecurity",
  "Cloud Computing",
  "Data Science",
  "AR/VR",
  "Robotics",
];
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

// Default judging criteria (common for all teams in an event)
const DEFAULT_JUDGING_CRITERIA = [
  {
    id: "innovation",
    name: "Innovation & Creativity",
    maxScore: 25,
    description: "Originality and uniqueness of the solution",
  },
  {
    id: "technical",
    name: "Technical Implementation",
    maxScore: 25,
    description: "Quality of code, architecture, and technical approach",
  },
  {
    id: "presentation",
    name: "Presentation & Demo",
    maxScore: 20,
    description: "Clarity of presentation and effective demonstration",
  },
  {
    id: "impact",
    name: "Impact & Feasibility",
    maxScore: 15,
    description: "Real-world applicability and potential impact",
  },
  {
    id: "teamwork",
    name: "Teamwork & Collaboration",
    maxScore: 15,
    description: "Evidence of effective team collaboration",
  },
];

const DEFAULT_JUDGING_ROUNDS = [
  { id: "round-1", name: "Round 1" },
  { id: "round-2", name: "Round 2" },
  { id: "final", name: "Final" },
];

const SAMPLE_EVENTS = [
  {
    id: "evt-001",
    title: "Hackathon 2026",
    type: "Hackathon",
    domain: "AI/ML",
    image:
      "https://media.licdn.com/dms/image/v2/D5612AQGAc84-a20Zrg/article-cover_image-shrink_720_1280/B56Zxs01DHKUAI-/0/1771352316177?e=2147483647&v=beta&t=lD1yUQbpZGOrBAjG4xDYhj2a5h8VmrYTP01_aCLzBtI",
    description:
      "48-hour coding competition to build innovative AI solutions for campus problems. Teams will work on real-world challenges provided by industry partners.",
    startDate: "2026-03-15",
    endDate: "2026-03-17",
    registrationDeadline: "2026-03-10",
    venue: "Main Auditorium, Block A",
    mode: "offline",
    maxTeamSize: 4,
    minTeamSize: 2,
    maxParticipants: 200,
    eligibleYears: ["2nd Year", "3rd Year", "4th Year"],
    eligibleDepartments: ["CSE", "ECE", "IT", "AIDS", "AIML"],
    requiresMentorApproval: true,
    registrationFee: 100,
    prizes: [
      { position: "1st", amount: "25000" },
      { position: "2nd", amount: "15000" },
      { position: "3rd", amount: "10000" },
    ],
    status: "ongoing",
    registeredTeams: 45,
    totalParticipants: 156,
    createdAt: "2026-02-01",
    organizer: "Department of CSE",
    contactEmail: "hackathon@college.edu",
    contactPhone: "+91 98765 43210",
    rules: [
      "Each team must have 2-4 members",
      "Cross-department teams allowed",
      "Participants must bring their own laptops",
      "Internet will be provided",
    ],
    judges: [
      "Dr. Ramesh Kumar",
      "Prof. Anita Sharma",
      "Mr. Vikram Singh (Industry Expert)",
    ],
  },
  {
    id: "evt-002",
    title: "AI Workshop Series",
    type: "Workshop",
    domain: "AI/ML",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    description:
      "3-day intensive workshop covering Machine Learning fundamentals, Deep Learning with TensorFlow, and practical applications in computer vision.",
    startDate: "2026-03-20",
    endDate: "2026-03-22",
    registrationDeadline: "2026-03-18",
    venue: "Seminar Hall B, Research Block",
    mode: "hybrid",
    maxTeamSize: 1,
    minTeamSize: 1,
    maxParticipants: 100,
    eligibleYears: ["All Years"],
    eligibleDepartments: ["All Departments"],
    requiresMentorApproval: false,
    registrationFee: 0,
    prizes: [],
    status: "upcoming",
    registeredTeams: 0,
    totalParticipants: 67,
    createdAt: "2026-02-10",
    organizer: "AI Research Lab",
    contactEmail: "ailab@college.edu",
    contactPhone: "+91 98765 43211",
    rules: [
      "Basic Python knowledge required",
      "Bring laptop with Python 3.8+",
      "Certificate provided on completion",
    ],
    judges: [],
  },
  {
    id: "evt-003",
    title: "Web Dev Championship",
    type: "Competition",
    domain: "Web Development",
    image:
      "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80",
    description:
      "Annual web development competition where participants build responsive web applications within 24 hours based on given themes.",
    startDate: "2026-02-28",
    endDate: "2026-03-01",
    registrationDeadline: "2026-02-25",
    venue: "Computer Lab 1 & 2",
    mode: "offline",
    maxTeamSize: 2,
    minTeamSize: 1,
    maxParticipants: 80,
    eligibleYears: ["2nd Year", "3rd Year", "4th Year"],
    eligibleDepartments: ["CSE", "IT", "AIDS"],
    requiresMentorApproval: true,
    registrationFee: 50,
    prizes: [
      { position: "1st", amount: "15000" },
      { position: "2nd", amount: "10000" },
      { position: "3rd", amount: "5000" },
    ],
    status: "completed",
    registeredTeams: 38,
    totalParticipants: 72,
    createdAt: "2026-01-15",
    organizer: "Web Development Club",
    contactEmail: "webclub@college.edu",
    contactPhone: "+91 98765 43212",
    rules: [
      "Use any web technology",
      "No pre-built templates allowed",
      "Must be original work",
    ],
    judges: ["Dr. Suresh Patel", "Ms. Priya Krishnan"],
    winners: [
      {
        position: "1st",
        teamName: "Code Crusaders",
        members: ["Rahul S.", "Anika M."],
        projectTitle: "EcoTrack - Sustainability Dashboard",
      },
      {
        position: "2nd",
        teamName: "Pixel Perfect",
        members: ["Kiran J."],
        projectTitle: "MindSpace - Mental Health Platform",
      },
      {
        position: "3rd",
        teamName: "Binary Blazers",
        members: ["Arjun R.", "Neha K."],
        projectTitle: "StudyBuddy - Collaborative Learning",
      },
    ],
  },
  {
    id: "evt-004",
    title: "IoT Innovation Challenge",
    type: "Hackathon",
    domain: "IoT",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    description:
      "Design and build IoT solutions for smart campus initiatives. Hardware kits will be provided to all participating teams.",
    startDate: "2026-04-05",
    endDate: "2026-04-07",
    registrationDeadline: "2026-03-30",
    venue: "Innovation Lab, Tech Park",
    mode: "offline",
    maxTeamSize: 5,
    minTeamSize: 3,
    maxParticipants: 75,
    eligibleYears: ["2nd Year", "3rd Year", "4th Year"],
    eligibleDepartments: ["CSE", "ECE", "EEE", "IT"],
    requiresMentorApproval: true,
    registrationFee: 200,
    prizes: [
      { position: "1st", amount: "30000" },
      { position: "2nd", amount: "20000" },
      { position: "3rd", amount: "10000" },
    ],
    status: "upcoming",
    registeredTeams: 12,
    totalParticipants: 48,
    createdAt: "2026-02-15",
    organizer: "ECE Department & Innovation Cell",
    contactEmail: "iot@college.edu",
    contactPhone: "+91 98765 43213",
    rules: [
      "Hardware kits provided",
      "Must return kits after event",
      "Working prototype required",
      "Documentation mandatory",
    ],
    judges: ["Dr. Vijay Kumar", "Prof. Meera Rao", "Mr. Anil Tech (Industry)"],
  },
];

const SAMPLE_TEAMS = {
  "evt-001": [
    {
      id: "t-001",
      teamName: "Code Warriors",
      members: [
        {
          name: "Arun Kumar",
          department: "CSE",
          year: 3,
          role: "Leader",
          email: "arun@college.edu",
          phone: "9876543001",
        },
        {
          name: "Priya Sharma",
          department: "CSE",
          year: 3,
          role: "Member",
          email: "priya@college.edu",
          phone: "9876543002",
        },
        {
          name: "Vikash J",
          department: "IT",
          year: 3,
          role: "Member",
          email: "vikash@college.edu",
          phone: "9876543003",
        },
      ],
      status: "approved",
      projectTitle: "AI Campus Assistant",
      projectDescription:
        "An AI-powered chatbot to help students navigate campus resources",
      mentorApproval: "approved",
      registeredAt: "2026-02-20",
    },
    {
      id: "t-002",
      teamName: "Tech Titans",
      members: [
        {
          name: "Vikram J",
          department: "ECE",
          year: 4,
          role: "Leader",
          email: "vikram@college.edu",
          phone: "9876543004",
        },
        {
          name: "Ananya R",
          department: "IT",
          year: 3,
          role: "Member",
          email: "ananya@college.edu",
          phone: "9876543005",
        },
        {
          name: "Karthik S",
          department: "CSE",
          year: 4,
          role: "Member",
          email: "karthik@college.edu",
          phone: "9876543006",
        },
        {
          name: "Deepa M",
          department: "AIDS",
          year: 3,
          role: "Member",
          email: "deepa@college.edu",
          phone: "9876543007",
        },
      ],
      status: "pending",
      projectTitle: "Smart IoT Dashboard",
      projectDescription:
        "Real-time monitoring dashboard for campus IoT devices",
      mentorApproval: "pending",
      registeredAt: "2026-02-22",
    },
    {
      id: "t-003",
      teamName: "Neural Nexus",
      members: [
        {
          name: "Rohit Kumar",
          department: "AIML",
          year: 3,
          role: "Leader",
          email: "rohit@college.edu",
          phone: "9876543008",
        },
        {
          name: "Sneha P",
          department: "CSE",
          year: 3,
          role: "Member",
          email: "sneha@college.edu",
          phone: "9876543009",
        },
      ],
      status: "approved",
      projectTitle: "Sentiment Analysis Tool",
      projectDescription: "Analyze social media sentiment for trending topics",
      mentorApproval: "approved",
      registeredAt: "2026-02-18",
    },
    {
      id: "t-004",
      teamName: "Byte Builders",
      members: [
        {
          name: "Ajay M",
          department: "IT",
          year: 4,
          role: "Leader",
          email: "ajay@college.edu",
          phone: "9876543010",
        },
        {
          name: "Kavitha R",
          department: "CSE",
          year: 4,
          role: "Member",
          email: "kavitha@college.edu",
          phone: "9876543011",
        },
        {
          name: "Suresh K",
          department: "ECE",
          year: 3,
          role: "Member",
          email: "suresh@college.edu",
          phone: "9876543012",
        },
      ],
      status: "rejected",
      projectTitle: "Blockchain Voting",
      projectDescription: "Secure voting system using blockchain",
      mentorApproval: "rejected",
      registeredAt: "2026-02-19",
    },
  ],
  "evt-002": [
    {
      id: "t-005",
      teamName: "Solo Participant",
      members: [
        {
          name: "Meera K",
          department: "CSE",
          year: 2,
          role: "Individual",
          email: "meera@college.edu",
          phone: "9876543013",
        },
      ],
      status: "approved",
      projectTitle: null,
      projectDescription: null,
      mentorApproval: "not_required",
      registeredAt: "2026-02-25",
    },
  ],
  "evt-003": [
    {
      id: "t-006",
      teamName: "Code Crusaders",
      members: [
        {
          name: "Rahul S",
          department: "CSE",
          year: 3,
          role: "Leader",
          email: "rahul@college.edu",
          phone: "9876543014",
        },
        {
          name: "Anika M",
          department: "IT",
          year: 3,
          role: "Member",
          email: "anika@college.edu",
          phone: "9876543015",
        },
      ],
      status: "winner",
      position: "1st",
      projectTitle: "EcoTrack",
      projectDescription: "Sustainability Dashboard for Campus",
      mentorApproval: "approved",
      registeredAt: "2026-02-10",
    },
    {
      id: "t-007",
      teamName: "Pixel Perfect",
      members: [
        {
          name: "Kiran J",
          department: "CSE",
          year: 4,
          role: "Individual",
          email: "kiran@college.edu",
          phone: "9876543016",
        },
      ],
      status: "winner",
      position: "2nd",
      projectTitle: "MindSpace",
      projectDescription: "Mental Health Platform",
      mentorApproval: "approved",
      registeredAt: "2026-02-11",
    },
  ],
};

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
      {
        city: "Madurai",
        state: "Tamil Nadu",
        lat: 9.9252,
        lng: 78.1198,
        teams: 4,
        participants: 15,
      },
      {
        city: "Pune",
        state: "Maharashtra",
        lat: 18.5204,
        lng: 73.8567,
        teams: 3,
        participants: 11,
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
  },
};

const EMPTY_FORM = {
  title: "",
  type: "",
  domain: "",
  description: "",
  startDate: "",
  endDate: "",
  registrationDeadline: "",
  venue: "",
  mode: "offline",
  maxTeamSize: 4,
  minTeamSize: 1,
  maxParticipants: 100,
  eligibleYears: [],
  eligibleDepartments: [],
  requiresMentorApproval: false,
  registrationFee: 0,
  prizes: [
    { position: "1st", amount: "" },
    { position: "2nd", amount: "" },
    { position: "3rd", amount: "" },
  ],
  organizer: "",
  contactEmail: "",
  contactPhone: "",
  rules: [""],
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
export default function AdminMyEvents() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { generateJudgeCredentials, getJudgeCredentials, getJudgeScores } =
    useAuth();

  const [activeTab, setActiveTab] = useState("manage");
  const [events, setEvents] = useState(SAMPLE_EVENTS);
  const [teams, setTeams] = useState(SAMPLE_TEAMS);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [selectedEventForTeams, setSelectedEventForTeams] = useState(null);
  const [selectedEventForWinners, setSelectedEventForWinners] = useState(null);
  const [selectedEventForAnalytics, setSelectedEventForAnalytics] =
    useState(null);
  const [winnerSelections, setWinnerSelections] = useState({});
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState({
    event: null,
    winners: [],
    participants: [],
  });

  // Judge credentials modal state
  const [showJudgeCredentialsModal, setShowJudgeCredentialsModal] =
    useState(false);
  const [currentJudgeCredentials, setCurrentJudgeCredentials] = useState(null);

  // Scoring state - round wise scores by judge
  // Structure: { eventId: { roundId: { teamId: { judgeIndex: { criterionId: score } } } } }
  const [roundScores, setRoundScores] = useState({});
  const [activeRoundId, setActiveRoundId] = useState(
    DEFAULT_JUDGING_ROUNDS[0].id,
  );
  const [leaderboardMode, setLeaderboardMode] = useState("round");
  const [judgeCounts, setJudgeCounts] = useState({});
  const [showScoringForTeam, setShowScoringForTeam] = useState(null);
  const [showScoringView, setShowScoringView] = useState(false);

  // Feedback state - loaded from localStorage (shared with student MyEvents)
  const [feedbacks, setFeedbacks] = useState(() => loadFeedback());
  const [selectedEventForFeedback, setSelectedEventForFeedback] =
    useState(null);

  // Refresh feedbacks periodically (in case students submit new feedback)
  useEffect(() => {
    const interval = setInterval(() => {
      setFeedbacks(loadFeedback());
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Store teams in localStorage so judges can access them
  useEffect(() => {
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  }, [teams]);

  // Load judge scores from localStorage periodically
  useEffect(() => {
    const loadJudgeScores = () => {
      const storedScores = JSON.parse(
        localStorage.getItem(JUDGE_SCORES_KEY) || "{}",
      );
      // Merge judge scores into roundScores state
      Object.keys(storedScores).forEach((evtId) => {
        const eventScores = storedScores[evtId];
        Object.keys(eventScores).forEach((rndId) => {
          const roundTeams = eventScores[rndId];
          Object.keys(roundTeams).forEach((tmId) => {
            const teamJudges = roundTeams[tmId];
            Object.keys(teamJudges).forEach((jdgIdx) => {
              const judgeScores = teamJudges[jdgIdx];
              Object.keys(judgeScores).forEach((critId) => {
                setRoundScores((prev) => {
                  const eventRounds = { ...(prev[evtId] || {}) };
                  const roundTeamsData = { ...(eventRounds[rndId] || {}) };
                  const teamJudgesData = { ...(roundTeamsData[tmId] || {}) };
                  const judgeScoresData = { ...(teamJudgesData[jdgIdx] || {}) };
                  judgeScoresData[critId] = judgeScores[critId];
                  teamJudgesData[jdgIdx] = judgeScoresData;
                  roundTeamsData[tmId] = teamJudgesData;
                  eventRounds[rndId] = roundTeamsData;
                  return { ...prev, [evtId]: eventRounds };
                });
              });
            });
          });
        });
      });
    };

    loadJudgeScores();
    const interval = setInterval(loadJudgeScores, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle generating judge credentials
  const handleGenerateJudgeCredentials = (
    eventIdParam,
    roundIdParam,
    judgeCount,
  ) => {
    const event = events.find((e) => e.id === eventIdParam);
    const round = DEFAULT_JUDGING_ROUNDS.find((r) => r.id === roundIdParam);

    if (!event || !round) return;

    const credentials = generateJudgeCredentials(
      eventIdParam,
      event.title,
      roundIdParam,
      round.name,
      judgeCount,
    );

    setCurrentJudgeCredentials(credentials);
    setShowJudgeCredentialsModal(true);
  };

  // Get feedbacks for a specific event
  const getEventFeedbacks = (eventId) => {
    return feedbacks.filter((fb) => fb.eventId === eventId);
  };

  // Calculate average rating for an event
  const getAverageRating = (eventId) => {
    const eventFeedbacks = getEventFeedbacks(eventId);
    if (eventFeedbacks.length === 0) return 0;
    const sum = eventFeedbacks.reduce((acc, fb) => acc + fb.overallRating, 0);
    return (sum / eventFeedbacks.length).toFixed(1);
  };

  // If eventId is in URL, show event detail
  const selectedEvent = eventId ? events.find((e) => e.id === eventId) : null;

  const handleNavigateToEvent = (event) => {
    navigate(`/admin/my-events/${event.id}`);
  };

  const handleBack = () => {
    navigate("/admin/my-events");
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handlePrizeChange = (index, value) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index].amount = value;
    setFormData((prev) => ({ ...prev, prizes: newPrizes }));
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData((prev) => ({ ...prev, rules: newRules }));
  };

  const addRule = () => {
    setFormData((prev) => ({ ...prev, rules: [...prev.rules, ""] }));
  };

  const removeRule = (index) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      ...formData,
      id: `evt-${String(events.length + 1).padStart(3, "0")}`,
      status: "upcoming",
      registeredTeams: 0,
      totalParticipants: 0,
      createdAt: new Date().toISOString().split("T")[0],
      rules: formData.rules.filter((r) => r.trim() !== ""),
    };
    setEvents((prev) => [newEvent, ...prev]);
    setTeams((prev) => ({ ...prev, [newEvent.id]: [] }));
    setFormData(EMPTY_FORM);
    setActiveTab("manage");
  };

  const handleApproveTeam = (eventId, teamId) => {
    setTeams((prev) => ({
      ...prev,
      [eventId]: prev[eventId].map((t) =>
        t.id === teamId ? { ...t, status: "approved" } : t,
      ),
    }));
  };

  const handleRejectTeam = (eventId, teamId) => {
    setTeams((prev) => ({
      ...prev,
      [eventId]: prev[eventId].map((t) =>
        t.id === teamId ? { ...t, status: "rejected" } : t,
      ),
    }));
  };

  const getJudgeCount = (eventId, roundId) => {
    const event = events.find((e) => e.id === eventId);
    const defaultCount = event?.judges?.length ? event.judges.length : 3;
    return judgeCounts[eventId]?.[roundId] ?? defaultCount;
  };

  const handleJudgeCountChange = (eventId, roundId, count) => {
    const safeCount = Math.min(Math.max(1, parseInt(count, 10) || 1), 7);
    setJudgeCounts((prev) => ({
      ...prev,
      [eventId]: {
        ...(prev[eventId] || {}),
        [roundId]: safeCount,
      },
    }));
  };

  // Score handling functions
  const handleRoundScoreChange = (
    eventId,
    roundId,
    teamId,
    judgeIndex,
    criterionId,
    score,
  ) => {
    const maxScore =
      DEFAULT_JUDGING_CRITERIA.find((c) => c.id === criterionId)?.maxScore ||
      100;
    const hasValue = score !== "" && score !== null && score !== undefined;
    const validScore = hasValue
      ? Math.min(Math.max(0, parseInt(score, 10) || 0), maxScore)
      : undefined;

    setRoundScores((prev) => {
      const eventRounds = { ...(prev[eventId] || {}) };
      const roundTeams = { ...(eventRounds[roundId] || {}) };
      const teamJudges = { ...(roundTeams[teamId] || {}) };
      const judgeScores = { ...(teamJudges[judgeIndex] || {}) };

      if (hasValue) {
        judgeScores[criterionId] = validScore;
      } else {
        delete judgeScores[criterionId];
      }

      if (Object.keys(judgeScores).length === 0) {
        delete teamJudges[judgeIndex];
      } else {
        teamJudges[judgeIndex] = judgeScores;
      }

      if (Object.keys(teamJudges).length === 0) {
        delete roundTeams[teamId];
      } else {
        roundTeams[teamId] = teamJudges;
      }

      if (Object.keys(roundTeams).length === 0) {
        delete eventRounds[roundId];
      } else {
        eventRounds[roundId] = roundTeams;
      }

      return { ...prev, [eventId]: eventRounds };
    });
  };

  const getJudgeScore = (eventId, roundId, teamId, judgeIndex, criterionId) => {
    const value =
      roundScores[eventId]?.[roundId]?.[teamId]?.[judgeIndex]?.[criterionId];
    return value ?? "";
  };

  const getRoundTeamAverageScore = (eventId, roundId, teamId, criterionId) => {
    const judgeCount = getJudgeCount(eventId, roundId);
    if (!judgeCount) return 0;
    let sum = 0;
    for (let i = 0; i < judgeCount; i += 1) {
      const value =
        roundScores[eventId]?.[roundId]?.[teamId]?.[i]?.[criterionId];
      sum += parseFloat(value) || 0;
    }
    return sum / judgeCount;
  };

  const getRoundTeamTotalScore = (eventId, roundId, teamId) => {
    return DEFAULT_JUDGING_CRITERIA.reduce(
      (sum, criterion) =>
        sum + getRoundTeamAverageScore(eventId, roundId, teamId, criterion.id),
      0,
    );
  };

  const getRoundHasScores = (eventId, roundId) => {
    const roundData = roundScores[eventId]?.[roundId] || {};
    return Object.keys(roundData).length > 0;
  };

  const getOverallTeamTotalScore = (eventId, teamId) => {
    const activeRounds = DEFAULT_JUDGING_ROUNDS.filter((round) =>
      getRoundHasScores(eventId, round.id),
    );
    if (activeRounds.length === 0) return 0;
    const total = activeRounds.reduce(
      (sum, round) => sum + getRoundTeamTotalScore(eventId, round.id, teamId),
      0,
    );
    return total / activeRounds.length;
  };

  const getMaxPossibleScore = () => {
    return DEFAULT_JUDGING_CRITERIA.reduce((sum, c) => sum + c.maxScore, 0);
  };

  const getRoundRankings = (eventId, roundId) => {
    const eventTeamsList = teams[eventId] || [];
    const approvedTeams = eventTeamsList.filter(
      (t) => t.status === "approved" || t.status === "winner",
    );

    return approvedTeams
      .map((team) => ({
        ...team,
        totalScore: getRoundTeamTotalScore(eventId, roundId, team.id),
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((team, index) => ({ ...team, rank: index + 1 }));
  };

  const getOverallRankings = (eventId) => {
    const eventTeamsList = teams[eventId] || [];
    const approvedTeams = eventTeamsList.filter(
      (t) => t.status === "approved" || t.status === "winner",
    );

    return approvedTeams
      .map((team) => ({
        ...team,
        totalScore: getOverallTeamTotalScore(eventId, team.id),
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((team, index) => ({ ...team, rank: index + 1 }));
  };

  const formatScore = (value) => {
    if (Number.isNaN(value)) return "0";
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  };

  const getRoundCompletionStats = (eventId, roundId) => {
    const eventTeamsList = teams[eventId] || [];
    const eligibleTeams = eventTeamsList.filter(
      (t) => t.status === "approved" || t.status === "winner",
    );
    const judgeCount = getJudgeCount(eventId, roundId);
    const totalCells =
      eligibleTeams.length * DEFAULT_JUDGING_CRITERIA.length * judgeCount;
    if (!totalCells) {
      return { filled: 0, total: 0, percent: 0 };
    }

    let filled = 0;
    eligibleTeams.forEach((team) => {
      for (let i = 0; i < judgeCount; i += 1) {
        DEFAULT_JUDGING_CRITERIA.forEach((criterion) => {
          const value =
            roundScores[eventId]?.[roundId]?.[team.id]?.[i]?.[criterion.id];
          if (value !== undefined && value !== null && value !== "") {
            filled += 1;
          }
        });
      }
    });

    return {
      filled,
      total: totalCells,
      percent: Math.round((filled / totalCells) * 100),
    };
  };

  const toggleScoringPanel = (teamId) => {
    setShowScoringForTeam(showScoringForTeam === teamId ? null : teamId);
  };

  const handleDeclareWinner = (eventId, teamId, position) => {
    setWinnerSelections((prev) => ({
      ...prev,
      [`${eventId}-${position}`]: teamId,
    }));
  };

  const handleSaveWinners = (eventId) => {
    const positions = ["1st", "2nd", "3rd"];
    const event = events.find((e) => e.id === eventId);
    const eventTeams = teams[eventId] || [];

    // Calculate winners based on current selections
    const winnersData = positions
      .filter((pos) => winnerSelections[`${eventId}-${pos}`])
      .map((pos) => {
        const selectedTeamId = winnerSelections[`${eventId}-${pos}`];
        const team = eventTeams.find((t) => t.id === selectedTeamId);
        return {
          ...team,
          position: pos,
          members: team?.members || [],
        };
      });

    const participantsData = eventTeams.filter(
      (t) => !winnersData.find((w) => w.id === t.id),
    );

    // Update teams with winner status
    setTeams((prev) => ({
      ...prev,
      [eventId]: prev[eventId].map((t) => {
        const pos = positions.find(
          (p) => winnerSelections[`${eventId}-${p}`] === t.id,
        );
        return pos ? { ...t, status: "winner", position: pos } : t;
      }),
    }));

    // Update event status
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: "completed" } : e)),
    );

    // Set certificate data immediately
    setCertificateData({
      event,
      winners: winnersData,
      participants: participantsData,
    });

    console.log("Winners Data:", winnersData);
    console.log("Participants Data:", participantsData);
    console.log("Certificate Modal opening from AdminMyEvents...");
    setShowCertificateModal(true);
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    const styles = {
      ongoing: {
        bg: "rgba(34, 197, 94, 0.1)",
        color: "#16a34a",
        border: "1px solid rgba(34, 197, 94, 0.2)",
      },
      upcoming: {
        bg: "rgba(59, 130, 246, 0.1)",
        color: "#2563eb",
        border: "1px solid rgba(59, 130, 246, 0.2)",
      },
      completed: {
        bg: "rgba(107, 114, 128, 0.1)",
        color: "#6b7280",
        border: "1px solid rgba(107, 114, 128, 0.2)",
      },
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
      winner: {
        bg: "rgba(234, 179, 8, 0.1)",
        color: "#ca8a04",
        border: "1px solid rgba(234, 179, 8, 0.2)",
      },
    };
    return styles[status] || styles.upcoming;
  };

  const totalStats = {
    totalEvents: events.length,
    ongoing: events.filter((e) => e.status === "ongoing").length,
    upcoming: events.filter((e) => e.status === "upcoming").length,
    completed: events.filter((e) => e.status === "completed").length,
    totalParticipants: events.reduce((sum, e) => sum + e.totalParticipants, 0),
    totalTeams: events.reduce((sum, e) => sum + e.registeredTeams, 0),
  };

  /* ===== EVENT DETAIL VIEW ===== */
  if (selectedEvent) {
    const eventTeams = teams[selectedEvent.id] || [];
    const statusStyle = getStatusStyle(selectedEvent.status);
    const roundLeaderboardRows = getRoundRankings(
      selectedEvent.id,
      activeRoundId,
    );
    const leaderboardRows =
      leaderboardMode === "overall"
        ? getOverallRankings(selectedEvent.id)
        : roundLeaderboardRows;
    const roundCompletion = getRoundCompletionStats(
      selectedEvent.id,
      activeRoundId,
    );
    const roundTopTeam = roundLeaderboardRows[0];
    const roundSecondTeam = roundLeaderboardRows[1];
    const roundAverageScore = roundLeaderboardRows.length
      ? roundLeaderboardRows.reduce((sum, team) => sum + team.totalScore, 0) /
        roundLeaderboardRows.length
      : 0;

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
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
            onClick={handleBack}
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
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  margin: 0,
                  color: "var(--foreground)",
                }}
              >
                {selectedEvent.title}
              </h1>
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
            <p
              style={{
                fontSize: "14px",
                color: "var(--muted-foreground)",
                margin: "4px 0 0 0",
              }}
            >
              {selectedEvent.type} • {selectedEvent.domain} •{" "}
              {selectedEvent.organizer}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowScoringView(!showScoringView)}
              style={{
                padding: "10px 16px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: showScoringView
                  ? "var(--primary)"
                  : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              <iconify-icon
                icon={
                  showScoringView
                    ? "lucide:arrow-left"
                    : "lucide:clipboard-check"
                }
                style={{ fontSize: "16px" }}
              ></iconify-icon>{" "}
              {showScoringView ? "Back to Event" : "Score Participants"}
            </button>
            <button
              style={{
                padding: "10px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
              }}
            >
              <iconify-icon
                icon="lucide:edit"
                style={{ fontSize: "16px" }}
              ></iconify-icon>{" "}
              Edit
            </button>
            <button
              style={{
                padding: "10px 16px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "var(--primary)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              <iconify-icon
                icon="lucide:share-2"
                style={{ fontSize: "16px" }}
              ></iconify-icon>{" "}
              Share
            </button>
          </div>
        </div>

        {/* Scoring View */}
        {showScoringView ? (
          <div>
            {/* Scoring Header */}
            <div
              style={{
                ...card,
                background:
                  "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <iconify-icon
                  icon="lucide:trophy"
                  style={{ fontSize: "28px", color: "#f59e0b" }}
                ></iconify-icon>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                    }}
                  >
                    Judge Scoring Panel
                  </h2>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: "13px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Enter scores for each team based on the judging criteria
                    below
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {DEFAULT_JUDGING_CRITERIA.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    <strong style={{ color: "var(--foreground)" }}>
                      {c.name}:
                    </strong>{" "}
                    {c.maxScore} pts
                  </div>
                ))}
                <div
                  style={{
                    fontSize: "12px",
                    padding: "4px 12px",
                    background: "var(--primary)",
                    color: "white",
                    borderRadius: "20px",
                    fontWeight: 600,
                  }}
                >
                  Max Total: {getMaxPossibleScore()} pts
                </div>
              </div>
              <div
                style={{
                  marginTop: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Active Round
                </div>
                <select
                  value={activeRoundId}
                  onChange={(e) => setActiveRoundId(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {DEFAULT_JUDGING_ROUNDS.map((round) => (
                    <option key={round.id} value={round.id}>
                      {round.name}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Judges in Round
                </div>
                <select
                  value={getJudgeCount(selectedEvent.id, activeRoundId)}
                  onChange={(e) =>
                    handleJudgeCountChange(
                      selectedEvent.id,
                      activeRoundId,
                      e.target.value,
                    )
                  }
                  style={{
                    padding: "6px 10px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((count) => (
                    <option key={count} value={count}>
                      {count} Judge{count === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    handleGenerateJudgeCredentials(
                      selectedEvent.id,
                      activeRoundId,
                      getJudgeCount(selectedEvent.id, activeRoundId),
                    )
                  }
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <iconify-icon
                    icon="lucide:key"
                    style={{ fontSize: "14px" }}
                  ></iconify-icon>
                  Generate Judge Credentials
                </button>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Avg scores are calculated across all judges in the round
                </div>
              </div>
            </div>

            {/* Scoreboard / Rankings Section */}
            <div style={card}>
              <div style={cardHeaderRow}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <iconify-icon
                    icon="lucide:bar-chart-2"
                    style={{ fontSize: "20px", color: "#6366f1" }}
                  ></iconify-icon>
                  <h3 style={cardTitle}>Live Scoreboard & Rankings</h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      border: "1px solid var(--border)",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    {["round", "overall"].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setLeaderboardMode(mode)}
                        style={{
                          padding: "6px 12px",
                          border: "none",
                          background:
                            leaderboardMode === mode
                              ? "var(--primary)"
                              : "transparent",
                          color:
                            leaderboardMode === mode
                              ? "white"
                              : "var(--muted-foreground)",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {mode === "round" ? "Round" : "Overall"}
                      </button>
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {DEFAULT_JUDGING_ROUNDS.find(
                      (round) => round.id === activeRoundId,
                    )?.name || "Round"}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {
                      eventTeams.filter(
                        (t) => t.status === "approved" || t.status === "winner",
                      ).length
                    }{" "}
                    teams eligible for scoring
                  </div>
                </div>
              </div>
              {eventTeams.filter(
                (t) => t.status === "approved" || t.status === "winner",
              ).length === 0 ? (
                <div
                  style={{
                    padding: "48px",
                    textAlign: "center",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:users-x"
                    style={{ fontSize: "48px", marginBottom: "12px" }}
                  ></iconify-icon>
                  <p style={{ margin: 0 }}>No approved teams to score yet</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--muted)" }}>
                        <th
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--muted-foreground)",
                            borderBottom: "1px solid var(--border)",
                          }}
                        >
                          Rank
                        </th>
                        <th
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--muted-foreground)",
                            borderBottom: "1px solid var(--border)",
                          }}
                        >
                          Team
                        </th>
                        {leaderboardMode === "round"
                          ? DEFAULT_JUDGING_CRITERIA.map((c) => (
                              <th
                                key={c.id}
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "center",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  color: "var(--muted-foreground)",
                                  borderBottom: "1px solid var(--border)",
                                }}
                              >
                                {c.name.split(" ")[0]}
                                <br />
                                <span
                                  style={{ fontWeight: 400, fontSize: "10px" }}
                                >
                                  /{c.maxScore}
                                </span>
                              </th>
                            ))
                          : DEFAULT_JUDGING_ROUNDS.map((round) => (
                              <th
                                key={round.id}
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "center",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  color: "var(--muted-foreground)",
                                  borderBottom: "1px solid var(--border)",
                                }}
                              >
                                {round.name}
                                <br />
                                <span
                                  style={{ fontWeight: 400, fontSize: "10px" }}
                                >
                                  /{getMaxPossibleScore()}
                                </span>
                              </th>
                            ))}
                        <th
                          style={{
                            padding: "12px 16px",
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--primary)",
                            borderBottom: "1px solid var(--border)",
                          }}
                        >
                          {leaderboardMode === "round"
                            ? "Round Total"
                            : "Overall"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardRows.map((team, index) => (
                        <tr
                          key={team.id}
                          style={{
                            background:
                              index === 0
                                ? "rgba(245, 158, 11, 0.05)"
                                : index === 1
                                  ? "rgba(156, 163, 175, 0.05)"
                                  : index === 2
                                    ? "rgba(205, 127, 50, 0.05)"
                                    : "transparent",
                          }}
                        >
                          <td
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid var(--border)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              {team.rank === 1 ? (
                                <span style={{ fontSize: "18px" }}>🥇</span>
                              ) : team.rank === 2 ? (
                                <span style={{ fontSize: "18px" }}>🥈</span>
                              ) : team.rank === 3 ? (
                                <span style={{ fontSize: "18px" }}>🥉</span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "var(--muted-foreground)",
                                    width: "24px",
                                    textAlign: "center",
                                  }}
                                >
                                  #{team.rank}
                                </span>
                              )}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid var(--border)",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 500,
                                color: "var(--foreground)",
                                fontSize: "14px",
                              }}
                            >
                              {team.teamName}
                            </div>
                            {team.projectTitle && (
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--primary)",
                                }}
                              >
                                {team.projectTitle}
                              </div>
                            )}
                          </td>
                          {leaderboardMode === "round"
                            ? DEFAULT_JUDGING_CRITERIA.map((c) => {
                                const avgScore = getRoundTeamAverageScore(
                                  selectedEvent.id,
                                  activeRoundId,
                                  team.id,
                                  c.id,
                                );
                                return (
                                  <td
                                    key={c.id}
                                    style={{
                                      padding: "12px 16px",
                                      textAlign: "center",
                                      borderBottom: "1px solid var(--border)",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color:
                                          avgScore >= c.maxScore * 0.7
                                            ? "#22c55e"
                                            : avgScore >= c.maxScore * 0.4
                                              ? "#f59e0b"
                                              : "var(--muted-foreground)",
                                      }}
                                    >
                                      {formatScore(avgScore)}
                                    </span>
                                  </td>
                                );
                              })
                            : DEFAULT_JUDGING_ROUNDS.map((round) => {
                                const roundTotal = getRoundTeamTotalScore(
                                  selectedEvent.id,
                                  round.id,
                                  team.id,
                                );
                                return (
                                  <td
                                    key={round.id}
                                    style={{
                                      padding: "12px 16px",
                                      textAlign: "center",
                                      borderBottom: "1px solid var(--border)",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color:
                                          roundTotal >=
                                          getMaxPossibleScore() * 0.7
                                            ? "#22c55e"
                                            : roundTotal >=
                                                getMaxPossibleScore() * 0.4
                                              ? "#f59e0b"
                                              : "var(--muted-foreground)",
                                      }}
                                    >
                                      {formatScore(roundTotal)}
                                    </span>
                                  </td>
                                );
                              })}
                          <td
                            style={{
                              padding: "12px 16px",
                              textAlign: "center",
                              borderBottom: "1px solid var(--border)",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "4px 12px",
                                background:
                                  team.totalScore >= getMaxPossibleScore() * 0.7
                                    ? "rgba(34, 197, 94, 0.1)"
                                    : team.totalScore >=
                                        getMaxPossibleScore() * 0.4
                                      ? "rgba(245, 158, 11, 0.1)"
                                      : "var(--muted)",
                                borderRadius: "20px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "15px",
                                  fontWeight: 700,
                                  color:
                                    team.totalScore >=
                                    getMaxPossibleScore() * 0.7
                                      ? "#22c55e"
                                      : team.totalScore >=
                                          getMaxPossibleScore() * 0.4
                                        ? "#f59e0b"
                                        : "var(--foreground)",
                                }}
                              >
                                {formatScore(team.totalScore)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Scoring Analysis */}
            <div style={card}>
              <div style={cardHeaderRow}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <iconify-icon
                    icon="lucide:activity"
                    style={{ fontSize: "20px", color: "#0ea5e9" }}
                  ></iconify-icon>
                  <h3 style={cardTitle}>Scoring Analysis</h3>
                </div>
                <div
                  style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
                >
                  {DEFAULT_JUDGING_ROUNDS.find(
                    (round) => round.id === activeRoundId,
                  )?.name || "Round"}
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--muted)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Top Team
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      marginTop: "6px",
                    }}
                  >
                    {roundTopTeam?.teamName || "-"}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                      marginTop: "4px",
                    }}
                  >
                    {roundTopTeam
                      ? `${formatScore(roundTopTeam.totalScore)} / ${getMaxPossibleScore()}`
                      : "No scores yet"}
                  </div>
                </div>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--muted)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Score Gap
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      marginTop: "6px",
                    }}
                  >
                    {roundTopTeam && roundSecondTeam
                      ? formatScore(
                          roundTopTeam.totalScore - roundSecondTeam.totalScore,
                        )
                      : "-"}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                      marginTop: "4px",
                    }}
                  >
                    Lead vs second place
                  </div>
                </div>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--muted)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Round Average
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      marginTop: "6px",
                    }}
                  >
                    {formatScore(roundAverageScore)}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                      marginTop: "4px",
                    }}
                  >
                    Avg of eligible teams
                  </div>
                </div>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--muted)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Scoring Progress
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      marginTop: "6px",
                    }}
                  >
                    {roundCompletion.percent}%
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                      marginTop: "4px",
                    }}
                  >
                    {roundCompletion.filled} of {roundCompletion.total} scores
                  </div>
                </div>
              </div>
            </div>

            {/* Teams Scoring Cards */}
            <div style={card}>
              <div style={cardHeaderRow}>
                <h3 style={cardTitle}>Enter Scores for Teams</h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {eventTeams
                  .filter(
                    (t) => t.status === "approved" || t.status === "winner",
                  )
                  .map((team) => (
                    <div
                      key={team.id}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        onClick={() => toggleScoringPanel(team.id)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "16px",
                          cursor: "pointer",
                          background:
                            showScoringForTeam === team.id
                              ? "rgba(99, 102, 241, 0.05)"
                              : "var(--muted)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "var(--radius-md)",
                              background: "var(--primary)",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "16px",
                            }}
                          >
                            {team.teamName.charAt(0)}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "15px",
                                fontWeight: 600,
                                color: "var(--foreground)",
                              }}
                            >
                              {team.teamName}
                            </div>
                            {team.projectTitle && (
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "var(--primary)",
                                }}
                              >
                                {team.projectTitle}
                              </div>
                            )}
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
                              padding: "6px 14px",
                              borderRadius: "20px",
                              fontSize: "13px",
                              fontWeight: 600,
                              background:
                                getRoundTeamTotalScore(
                                  selectedEvent.id,
                                  activeRoundId,
                                  team.id,
                                ) > 0
                                  ? "rgba(99, 102, 241, 0.1)"
                                  : "var(--muted)",
                              color:
                                getRoundTeamTotalScore(
                                  selectedEvent.id,
                                  activeRoundId,
                                  team.id,
                                ) > 0
                                  ? "var(--primary)"
                                  : "var(--muted-foreground)",
                            }}
                          >
                            Round Total:{" "}
                            {formatScore(
                              getRoundTeamTotalScore(
                                selectedEvent.id,
                                activeRoundId,
                                team.id,
                              ),
                            )}
                            /{getMaxPossibleScore()}
                          </span>
                          <iconify-icon
                            icon={
                              showScoringForTeam === team.id
                                ? "lucide:chevron-up"
                                : "lucide:chevron-down"
                            }
                            style={{
                              color: "var(--muted-foreground)",
                              fontSize: "18px",
                            }}
                          ></iconify-icon>
                        </div>
                      </div>

                      {showScoringForTeam === team.id && (
                        <div
                          style={{
                            padding: "20px",
                            borderTop: "1px solid var(--border)",
                            background: "var(--card)",
                          }}
                        >
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
                                justifyContent: "space-between",
                                gap: "12px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                {DEFAULT_JUDGING_ROUNDS.find(
                                  (round) => round.id === activeRoundId,
                                )?.name || "Round"}{" "}
                                score inputs
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                {getJudgeCount(selectedEvent.id, activeRoundId)}{" "}
                                judge
                                {getJudgeCount(
                                  selectedEvent.id,
                                  activeRoundId,
                                ) === 1
                                  ? ""
                                  : "s"}
                              </div>
                            </div>
                            {DEFAULT_JUDGING_CRITERIA.map((criterion) => (
                              <div
                                key={criterion.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "16px",
                                  padding: "14px",
                                  background: "var(--background)",
                                  borderRadius: "var(--radius-md)",
                                  border: "1px solid var(--border)",
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 500,
                                      color: "var(--foreground)",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    {criterion.name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "var(--muted-foreground)",
                                    }}
                                  >
                                    {criterion.description}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {Array.from({
                                    length: getJudgeCount(
                                      selectedEvent.id,
                                      activeRoundId,
                                    ),
                                  }).map((_, judgeIndex) => (
                                    <div
                                      key={judgeIndex}
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          color: "var(--muted-foreground)",
                                        }}
                                      >
                                        J{judgeIndex + 1}
                                      </span>
                                      <input
                                        type="number"
                                        min="0"
                                        max={criterion.maxScore}
                                        value={getJudgeScore(
                                          selectedEvent.id,
                                          activeRoundId,
                                          team.id,
                                          judgeIndex,
                                          criterion.id,
                                        )}
                                        onChange={(e) =>
                                          handleRoundScoreChange(
                                            selectedEvent.id,
                                            activeRoundId,
                                            team.id,
                                            judgeIndex,
                                            criterion.id,
                                            e.target.value,
                                          )
                                        }
                                        style={{
                                          width: "64px",
                                          padding: "6px 8px",
                                          borderRadius: "var(--radius-md)",
                                          border: "1px solid var(--border)",
                                          background: "var(--card)",
                                          color: "var(--foreground)",
                                          fontSize: "13px",
                                          fontWeight: 600,
                                          textAlign: "center",
                                        }}
                                      />
                                    </div>
                                  ))}
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      gap: "4px",
                                      minWidth: "80px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        color: "var(--muted-foreground)",
                                      }}
                                    >
                                      Avg
                                    </span>
                                    <div
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: "var(--foreground)",
                                      }}
                                    >
                                      {formatScore(
                                        getRoundTeamAverageScore(
                                          selectedEvent.id,
                                          activeRoundId,
                                          team.id,
                                          criterion.id,
                                        ),
                                      )}
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          color: "var(--muted-foreground)",
                                        }}
                                      >
                                        / {criterion.maxScore}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div
                            style={{
                              marginTop: "16px",
                              padding: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "rgba(34, 197, 94, 0.1)",
                              borderRadius: "var(--radius-md)",
                              border: "1px solid rgba(34, 197, 94, 0.2)",
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
                                icon="lucide:check-circle"
                                style={{ fontSize: "16px", color: "#22c55e" }}
                              ></iconify-icon>
                              <span
                                style={{
                                  fontSize: "13px",
                                  color: "var(--foreground)",
                                }}
                              >
                                Scores saved automatically
                              </span>
                            </div>
                            <div style={{ fontSize: "14px", fontWeight: 600 }}>
                              Total:{" "}
                              <span
                                style={{
                                  color:
                                    getRoundTeamTotalScore(
                                      selectedEvent.id,
                                      activeRoundId,
                                      team.id,
                                    ) >=
                                    getMaxPossibleScore() * 0.7
                                      ? "#22c55e"
                                      : getRoundTeamTotalScore(
                                            selectedEvent.id,
                                            activeRoundId,
                                            team.id,
                                          ) >=
                                          getMaxPossibleScore() * 0.4
                                        ? "#f59e0b"
                                        : "#ef4444",
                                }}
                              >
                                {formatScore(
                                  getRoundTeamTotalScore(
                                    selectedEvent.id,
                                    activeRoundId,
                                    team.id,
                                  ),
                                )}
                                /{getMaxPossibleScore()} (
                                {Math.round(
                                  (getRoundTeamTotalScore(
                                    selectedEvent.id,
                                    activeRoundId,
                                    team.id,
                                  ) /
                                    getMaxPossibleScore()) *
                                    100,
                                )}
                                %)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                {eventTeams.filter(
                  (t) => t.status === "approved" || t.status === "winner",
                ).length === 0 && (
                  <div
                    style={{
                      padding: "48px",
                      textAlign: "center",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    <iconify-icon
                      icon="lucide:clipboard-x"
                      style={{ fontSize: "48px", marginBottom: "12px" }}
                    ></iconify-icon>
                    <p style={{ margin: 0 }}>
                      No approved teams available for scoring
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "13px" }}>
                      Approve teams first to enable scoring
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
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
                  label: "Total Registrations",
                  value: selectedEvent.totalParticipants,
                  icon: "lucide:users",
                  color: "#6366f1",
                },
                {
                  label: "Teams Registered",
                  value: eventTeams.length,
                  icon: "lucide:users-2",
                  color: "#8b5cf6",
                },
                {
                  label: "Approved",
                  value: eventTeams.filter(
                    (t) => t.status === "approved" || t.status === "winner",
                  ).length,
                  icon: "lucide:check-circle",
                  color: "#22c55e",
                },
                {
                  label: "Pending",
                  value: eventTeams.filter((t) => t.status === "pending")
                    .length,
                  icon: "lucide:clock",
                  color: "#f59e0b",
                },
                {
                  label: "Days Left",
                  value: Math.max(
                    0,
                    Math.ceil(
                      (new Date(selectedEvent.startDate) - new Date()) /
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

            {/* Event Details Grid */}
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
                      icon: "lucide:calendar",
                      label: "Event Date",
                      value: `${new Date(selectedEvent.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} - ${new Date(selectedEvent.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
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
                      value: `${selectedEvent.minTeamSize} - ${selectedEvent.maxTeamSize} members`,
                    },
                    {
                      icon: "lucide:user-check",
                      label: "Max Participants",
                      value: selectedEvent.maxParticipants,
                    },
                    {
                      icon: "lucide:indian-rupee",
                      label: "Registration Fee",
                      value:
                        selectedEvent.registrationFee > 0
                          ? `₹${selectedEvent.registrationFee}`
                          : "Free",
                    },
                    {
                      icon: "lucide:shield-check",
                      label: "Mentor Approval",
                      value: selectedEvent.requiresMentorApproval
                        ? "Required"
                        : "Not Required",
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
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {/* Eligibility */}
                <div style={card}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>Eligibility</h3>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
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
                      {(selectedEvent.eligibleYears.length > 0
                        ? selectedEvent.eligibleYears
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
                      {(selectedEvent.eligibleDepartments.length > 0
                        ? selectedEvent.eligibleDepartments
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
                </div>

                {/* Contact */}
                <div style={card}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>Contact Information</h3>
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
                      {selectedEvent.contactEmail}
                    </div>
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
                        icon="lucide:phone"
                        style={{ color: "var(--muted-foreground)" }}
                      ></iconify-icon>
                      {selectedEvent.contactPhone}
                    </div>
                  </div>
                </div>

                {/* Prizes */}
                {selectedEvent.prizes?.some((p) => p.amount) && (
                  <div style={card}>
                    <div style={cardHeaderRow}>
                      <h3 style={cardTitle}>Prizes</h3>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {selectedEvent.prizes
                        .filter((p) => p.amount)
                        .map((prize, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "10px 14px",
                              background: "var(--muted)",
                              borderRadius: "var(--radius-md)",
                            }}
                          >
                            <span style={{ fontSize: "24px" }}>
                              {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                            </span>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                {prize.position} Place
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  color: "var(--foreground)",
                                }}
                              >
                                ₹{Number(prize.amount).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rules */}
            {selectedEvent.rules?.length > 0 && (
              <div style={{ ...card, marginBottom: "24px" }}>
                <div style={cardHeaderRow}>
                  <h3 style={cardTitle}>Rules & Guidelines</h3>
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {selectedEvent.rules.map((rule, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "14px",
                        color: "var(--foreground)",
                        lineHeight: 1.5,
                      }}
                    >
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Registered Teams */}
            <div style={card}>
              <div style={cardHeaderRow}>
                <h3 style={cardTitle}>
                  Registered Teams ({eventTeams.length})
                </h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    style={{
                      padding: "6px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      color: "var(--foreground)",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              {eventTeams.length === 0 ? (
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
                  <p style={{ margin: 0 }}>No teams registered yet</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {eventTeams.map((team) => {
                    const teamStatus = getStatusStyle(team.status);
                    return (
                      <div
                        key={team.id}
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-md)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          onClick={() =>
                            setExpandedTeam(
                              expandedTeam === team.id ? null : team.id,
                            )
                          }
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px",
                            cursor: "pointer",
                            background: "var(--muted)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                            }}
                          >
                            <div
                              style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "var(--radius-md)",
                                background: "var(--primary)",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "16px",
                              }}
                            >
                              {team.teamName.charAt(0)}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "15px",
                                  fontWeight: 600,
                                  color: "var(--foreground)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                {team.teamName}
                                {team.position && (
                                  <span style={{ fontSize: "14px" }}>
                                    {team.position === "1st"
                                      ? "🥇"
                                      : team.position === "2nd"
                                        ? "🥈"
                                        : "🥉"}
                                  </span>
                                )}
                              </div>
                              {team.projectTitle && (
                                <div
                                  style={{
                                    fontSize: "13px",
                                    color: "var(--primary)",
                                  }}
                                >
                                  {team.projectTitle}
                                </div>
                              )}
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
                                fontSize: "13px",
                                color: "var(--muted-foreground)",
                              }}
                            >
                              {team.members.length} member
                              {team.members.length > 1 ? "s" : ""}
                            </span>
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: 500,
                                background: teamStatus.bg,
                                color: teamStatus.color,
                                textTransform: "capitalize",
                              }}
                            >
                              {team.status}
                            </span>
                            <iconify-icon
                              icon={
                                expandedTeam === team.id
                                  ? "lucide:chevron-up"
                                  : "lucide:chevron-down"
                              }
                              style={{
                                color: "var(--muted-foreground)",
                                fontSize: "18px",
                              }}
                            ></iconify-icon>
                          </div>
                        </div>
                        {expandedTeam === team.id && (
                          <div
                            style={{
                              padding: "16px",
                              borderTop: "1px solid var(--border)",
                            }}
                          >
                            {team.projectDescription && (
                              <div
                                style={{
                                  marginBottom: "16px",
                                  padding: "12px",
                                  background: "var(--muted)",
                                  borderRadius: "var(--radius-md)",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "var(--muted-foreground)",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Project Description
                                </div>
                                <div
                                  style={{
                                    fontSize: "14px",
                                    color: "var(--foreground)",
                                  }}
                                >
                                  {team.projectDescription}
                                </div>
                              </div>
                            )}
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: "12px",
                                marginBottom: "16px",
                              }}
                            >
                              {team.members.map((member, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "14px",
                                    background: "var(--background)",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid var(--border)",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "42px",
                                      height: "42px",
                                      borderRadius: "10px",
                                      background:
                                        member.role === "Leader"
                                          ? "#f59e0b"
                                          : "var(--primary)",
                                      color: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: 600,
                                      fontSize: "14px",
                                    }}
                                  >
                                    {member.name.charAt(0)}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: "var(--foreground)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                      }}
                                    >
                                      {member.name}
                                      {member.role === "Leader" && (
                                        <span
                                          style={{
                                            padding: "2px 6px",
                                            background:
                                              "rgba(245, 158, 11, 0.1)",
                                            color: "#d97706",
                                            borderRadius: "4px",
                                            fontSize: "10px",
                                            fontWeight: 600,
                                          }}
                                        >
                                          Leader
                                        </span>
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        color: "var(--muted-foreground)",
                                      }}
                                    >
                                      {member.department} • Year {member.year}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "11px",
                                        color: "var(--muted-foreground)",
                                        marginTop: "2px",
                                      }}
                                    >
                                      {member.email}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                Registered on{" "}
                                {new Date(team.registeredAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </div>
                              {team.status === "pending" && (
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <button
                                    onClick={() =>
                                      handleApproveTeam(
                                        selectedEvent.id,
                                        team.id,
                                      )
                                    }
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      padding: "8px 16px",
                                      borderRadius: "var(--radius-md)",
                                      border: "none",
                                      background: "#22c55e",
                                      color: "white",
                                      fontSize: "13px",
                                      fontWeight: 500,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <iconify-icon icon="lucide:check"></iconify-icon>{" "}
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRejectTeam(
                                        selectedEvent.id,
                                        team.id,
                                      )
                                    }
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      padding: "8px 16px",
                                      borderRadius: "var(--radius-md)",
                                      border: "1px solid #dc2626",
                                      background: "transparent",
                                      color: "#dc2626",
                                      fontSize: "13px",
                                      fontWeight: 500,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <iconify-icon icon="lucide:x"></iconify-icon>{" "}
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Judge Credentials Modal */}
        {showJudgeCredentialsModal && currentJudgeCredentials && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={() => setShowJudgeCredentialsModal(false)}
          >
            <div
              style={{
                background: "var(--card)",
                borderRadius: "var(--radius-lg)",
                padding: "32px",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    Judge Credentials Generated
                  </h2>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "13px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Share these credentials with judges for scoring
                  </p>
                </div>
                <button
                  onClick={() => setShowJudgeCredentialsModal(false)}
                  style={{
                    padding: "8px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:x"
                    style={{ fontSize: "20px" }}
                  ></iconify-icon>
                </button>
              </div>

              <div
                style={{
                  padding: "16px",
                  background: "var(--muted)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "20px",
                }}
              >
                <div style={{ fontSize: "13px", marginBottom: "8px" }}>
                  <strong>Event:</strong> {currentJudgeCredentials.eventTitle}
                </div>
                <div style={{ fontSize: "13px", marginBottom: "8px" }}>
                  <strong>Round:</strong> {currentJudgeCredentials.roundName}
                </div>
                <div style={{ fontSize: "13px" }}>
                  <strong>Event ID (Username):</strong>{" "}
                  <code
                    style={{
                      background: "var(--card)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                    }}
                  >
                    {currentJudgeCredentials.eventId}
                  </code>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                  }}
                >
                  Judge Passwords
                </h3>
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  {currentJudgeCredentials.judges.map((judge, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 16px",
                        background: "var(--muted)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>
                        {judge.name}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <code
                          style={{
                            background: "var(--card)",
                            padding: "4px 12px",
                            borderRadius: "6px",
                            fontFamily: "monospace",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#10b981",
                          }}
                        >
                          {judge.password}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(judge.password);
                          }}
                          style={{
                            padding: "6px 10px",
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "11px",
                            color: "var(--foreground)",
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  background: "rgba(245, 158, 11, 0.1)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <iconify-icon
                    icon="lucide:info"
                    style={{
                      fontSize: "18px",
                      color: "#f59e0b",
                      flexShrink: 0,
                    }}
                  ></iconify-icon>
                  <div style={{ fontSize: "12px", color: "var(--foreground)" }}>
                    <strong>Instructions for Judges:</strong>
                    <ol style={{ margin: "8px 0 0", paddingLeft: "16px" }}>
                      <li>
                        Go to the login page and click "Login as Event Judge"
                      </li>
                      <li>
                        Enter the Event ID:{" "}
                        <strong>{currentJudgeCredentials.eventId}</strong>
                      </li>
                      <li>
                        Enter their assigned password (e.g., judge1, judge2,
                        etc.)
                      </li>
                      <li>Score teams based on the judging criteria</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setShowJudgeCredentialsModal(false)}
                  style={{
                    padding: "10px 24px",
                    background: "var(--primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ===== MAIN TABS VIEW ===== */
  const tabs = [
    { id: "manage", icon: "lucide:folder-kanban", label: "Manage Events" },
    {
      id: "create",
      icon: "lucide:plus-circle",
      label: "Create Event",
      isExternal: true,
      path: "/admin/create-event",
    },
    {
      id: "teams",
      icon: "lucide:users-2",
      label: "Registered Teams",
      isExternal: true,
      path: "/admin/registered-teams",
    },
    {
      id: "winners",
      icon: "lucide:trophy",
      label: "Declare Winners",
      isExternal: true,
      path: "/admin/declare-winners",
    },
    {
      id: "analytics",
      icon: "lucide:bar-chart-3",
      label: "Event Analytics",
      isExternal: true,
      path: "/admin/event-analytics-page",
    },
    {
      id: "feedback",
      icon: "lucide:message-square-text",
      label: "Feedback",
      badge: feedbacks.length > 0 ? feedbacks.length : null,
    },
  ];

  const handleTabClick = (tab) => {
    if (tab.isExternal && tab.path) {
      navigate(tab.path);
    } else {
      setActiveTab(tab.id);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
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
          My Events
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--muted-foreground)",
            margin: 0,
          }}
        >
          Create and manage events organized by your institution
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Total Events",
            value: totalStats.totalEvents,
            icon: "lucide:calendar",
            color: "#6366f1",
          },
          {
            label: "Ongoing",
            value: totalStats.ongoing,
            icon: "lucide:play-circle",
            color: "#22c55e",
          },
          {
            label: "Upcoming",
            value: totalStats.upcoming,
            icon: "lucide:clock",
            color: "#3b82f6",
          },
          {
            label: "Completed",
            value: totalStats.completed,
            icon: "lucide:check-circle-2",
            color: "#6b7280",
          },
          {
            label: "Total Teams",
            value: totalStats.totalTeams,
            icon: "lucide:users-2",
            color: "#8b5cf6",
          },
          {
            label: "Participants",
            value: totalStats.totalParticipants,
            icon: "lucide:users",
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

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          background: "var(--muted)",
          padding: "4px",
          borderRadius: "var(--radius-lg)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: activeTab === tab.id ? "var(--card)" : "transparent",
              color:
                activeTab === tab.id
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
              fontSize: "14px",
              fontWeight: 500,
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
            {tab.badge > 0 && (
              <span
                style={{
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: "10px",
                  minWidth: "18px",
                  textAlign: "center",
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ===== MANAGE EVENTS TAB ===== */}
      {activeTab === "manage" && (
        <>
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
                placeholder="Search events by title or domain..."
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
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            {/* <button
              onClick={() => navigate("/admin/create-event")}
              style={{
                marginLeft: "auto",
                padding: "10px 18px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "var(--primary)",
                color: "white",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <iconify-icon
                icon="lucide:plus"
                style={{ fontSize: "16px" }}
              ></iconify-icon>{" "}
              Create Event
            </button> */}
          </div>

          {/* Events Grid - Image Card Style */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredEvents.map((event) => {
              const statusStyle = getStatusStyle(event.status);
              const typeColors = {
                Hackathon: { bg: "#1e3a8a", text: "#fff" },
                Workshop: { bg: "#0369a1", text: "#fff" },
                Seminar: { bg: "#6d28d9", text: "#fff" },
                Competition: { bg: "#b45309", text: "#fff" },
                Conference: { bg: "#0f766e", text: "#fff" },
                Webinar: { bg: "#065f46", text: "#fff" },
                Bootcamp: { bg: "#9333ea", text: "#fff" },
                Ideathon: { bg: "#be185d", text: "#fff" },
              };
              const typeColor = typeColors[event.type] || {
                bg: "#334155",
                text: "#fff",
              };
              const seatsFilled =
                event.maxParticipants > 0
                  ? Math.round(
                      (event.totalParticipants / event.maxParticipants) * 100,
                    )
                  : 0;
              const seatsLeft = event.maxParticipants - event.totalParticipants;

              return (
                <div
                  key={event.id}
                  onClick={() => handleNavigateToEvent(event)}
                  style={{
                    background: "var(--card)",
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
                      height: "160px",
                      position: "relative",
                      background: "#f1f5f9",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={
                        event.image ||
                        "https://images.unsplash.com/photo-1504384308090-c54be3855463?auto=format&fit=crop&w=800&q=80"
                      }
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
                        top: "12px",
                        right: "12px",
                        background: typeColor.bg,
                        color: typeColor.text,
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: "4px",
                        letterSpacing: "0.3px",
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
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: "20px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {event.status}
                    </span>
                  </div>

                  {/* Body */}
                  <div
                    style={{
                      padding: "20px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#f59e0b",
                        fontWeight: 700,
                        marginBottom: "6px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {new Date(event.startDate)
                        .toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                        .toUpperCase()}
                      {event.startDate !== event.endDate && (
                        <span>
                          {" "}
                          –{" "}
                          {new Date(event.endDate)
                            .toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        marginBottom: "8px",
                        lineHeight: 1.4,
                      }}
                    >
                      {event.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: "var(--muted-foreground)",
                        marginBottom: "12px",
                      }}
                    >
                      <iconify-icon
                        icon="lucide:map-pin"
                        style={{ fontSize: "14px" }}
                      ></iconify-icon>
                      {event.venue.split(",")[0]}
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
                          background: "rgba(139, 92, 246, 0.1)",
                          color: "#8b5cf6",
                          fontWeight: 500,
                        }}
                      >
                        {event.domain}
                      </span>
                      {event.registrationFee > 0 ? (
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
                          ₹{event.registrationFee}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            background: "rgba(16, 185, 129, 0.1)",
                            color: "#10b981",
                            fontWeight: 500,
                          }}
                        >
                          Free
                        </span>
                      )}
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
                        marginTop: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "14px",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--muted-foreground)",
                            fontWeight: 500,
                          }}
                        >
                          {event.status === "completed"
                            ? "Completed"
                            : seatsLeft > 0
                              ? `${seatsLeft} seats left`
                              : "Full"}
                        </span>
                        <div
                          style={{
                            width: "80px",
                            height: "4px",
                            background: "var(--muted)",
                            borderRadius: "2px",
                            marginTop: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(seatsFilled, 100)}%`,
                              height: "100%",
                              background:
                                event.status === "completed"
                                  ? "#6b7280"
                                  : seatsFilled >= 90
                                    ? "#ef4444"
                                    : seatsFilled >= 60
                                      ? "#f59e0b"
                                      : "#10b981",
                              borderRadius: "2px",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "var(--foreground)",
                            }}
                          >
                            {event.registeredTeams}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            Teams
                          </div>
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
                icon="lucide:calendar-x"
                style={{ fontSize: "56px" }}
              ></iconify-icon>
              <p style={{ margin: 0, fontSize: "16px" }}>No events found</p>
              <button
                onClick={() => setActiveTab("create")}
                style={{
                  padding: "10px 20px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Create your first event
              </button>
            </div>
          )}
        </>
      )}

      {/* ===== CREATE EVENT TAB ===== */}
      {activeTab === "create" && (
        <form onSubmit={handleSubmitEvent}>
          {/* Basic Info */}
          <div style={{ ...card, marginBottom: "20px" }}>
            <div style={{ ...cardHeaderRow, marginBottom: "20px" }}>
              <h3
                style={{
                  ...cardTitle,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <iconify-icon
                  icon="lucide:info"
                  style={{ color: "var(--primary)" }}
                ></iconify-icon>
                Basic Information
              </h3>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              <div style={{ gridColumn: "span 2" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Hackathon 2026"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Event Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select type</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Domain *
                </label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select domain</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe your event in detail..."
                  rows={4}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "14px",
                    resize: "vertical",
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Organizer *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleFormChange}
                  placeholder="e.g., Department of CSE"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--foreground)",
                      marginBottom: "6px",
                    }}
                  >
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleFormChange}
                    placeholder="email@college.edu"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--foreground)",
                      marginBottom: "6px",
                    }}
                  >
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleFormChange}
                    placeholder="+91 98765 43210"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div style={{ ...card, marginBottom: "20px" }}>
            <div style={{ ...cardHeaderRow, marginBottom: "20px" }}>
              <h3
                style={{
                  ...cardTitle,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <iconify-icon
                  icon="lucide:calendar-clock"
                  style={{ color: "var(--primary)" }}
                ></iconify-icon>
                Schedule & Venue
              </h3>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleFormChange}
                  required
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
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleFormChange}
                  required
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
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Registration Deadline *
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleFormChange}
                  required
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
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Mode *
                </label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div style={{ gridColumn: "span 4" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Venue *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleFormChange}
                  placeholder="e.g., Main Auditorium, Block A"
                  required
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
            </div>
          </div>

          {/* Participation */}
          <div style={{ ...card, marginBottom: "20px" }}>
            <div style={{ ...cardHeaderRow, marginBottom: "20px" }}>
              <h3
                style={{
                  ...cardTitle,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <iconify-icon
                  icon="lucide:users"
                  style={{ color: "var(--primary)" }}
                ></iconify-icon>
                Team & Participation
              </h3>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Min Team Size
                </label>
                <input
                  type="number"
                  name="minTeamSize"
                  value={formData.minTeamSize}
                  onChange={handleFormChange}
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
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Max Team Size
                </label>
                <input
                  type="number"
                  name="maxTeamSize"
                  value={formData.maxTeamSize}
                  onChange={handleFormChange}
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
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Max Participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleFormChange}
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
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Registration Fee (₹)
                </label>
                <input
                  type="number"
                  name="registrationFee"
                  value={formData.registrationFee}
                  onChange={handleFormChange}
                  min={0}
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
            </div>
          </div>

          {/* Eligibility */}
          <div style={{ ...card, marginBottom: "20px" }}>
            <div style={{ ...cardHeaderRow, marginBottom: "20px" }}>
              <h3
                style={{
                  ...cardTitle,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <iconify-icon
                  icon="lucide:check-square"
                  style={{ color: "var(--primary)" }}
                ></iconify-icon>
                Eligibility Criteria
              </h3>
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
                      background: formData.eligibleYears.includes(year)
                        ? "var(--primary)"
                        : "var(--background)",
                      color: formData.eligibleYears.includes(year)
                        ? "white"
                        : "var(--foreground)",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s",
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
                      background: formData.eligibleDepartments.includes(dept)
                        ? "var(--primary)"
                        : "var(--background)",
                      color: formData.eligibleDepartments.includes(dept)
                        ? "white"
                        : "var(--foreground)",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
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
                name="requiresMentorApproval"
                checked={formData.requiresMentorApproval}
                onChange={handleFormChange}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "var(--primary)",
                }}
              />
              Require Mentor Approval for Registration
            </label>
          </div>

          {/* Rules */}
          <div style={{ ...card, marginBottom: "20px" }}>
            <div style={{ ...cardHeaderRow, marginBottom: "20px" }}>
              <h3
                style={{
                  ...cardTitle,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <iconify-icon
                  icon="lucide:list-checks"
                  style={{ color: "var(--primary)" }}
                ></iconify-icon>
                Rules & Guidelines
              </h3>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {formData.rules.map((rule, index) => (
                <div key={index} style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    placeholder={`Rule ${index + 1}`}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  {formData.rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      style={{
                        padding: "12px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                        background: "var(--background)",
                        color: "#dc2626",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
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
              <button
                type="button"
                onClick={addRule}
                style={{
                  padding: "10px",
                  borderRadius: "var(--radius-md)",
                  border: "1px dashed var(--border)",
                  background: "transparent",
                  color: "var(--primary)",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <iconify-icon icon="lucide:plus"></iconify-icon> Add Rule
              </button>
            </div>
          </div>

          {/* Prizes */}
          <div style={{ ...card, marginBottom: "24px" }}>
            <div style={{ ...cardHeaderRow, marginBottom: "20px" }}>
              <h3
                style={{
                  ...cardTitle,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <iconify-icon
                  icon="lucide:trophy"
                  style={{ color: "var(--primary)" }}
                ></iconify-icon>
                Prizes (Optional)
              </h3>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
              }}
            >
              {formData.prizes.map((prize, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "20px",
                    background: "var(--muted)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span style={{ fontSize: "32px" }}>
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        marginBottom: "6px",
                      }}
                    >
                      {prize.position} Place
                    </label>
                    <input
                      type="number"
                      value={prize.amount}
                      onChange={(e) => handlePrizeChange(index, e.target.value)}
                      placeholder="Amount (₹)"
                      style={{
                        width: "100%",
                        padding: "10px",
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
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
          >
            <button
              type="button"
              onClick={() => {
                setFormData(EMPTY_FORM);
                setActiveTab("manage");
              }}
              style={{
                padding: "12px 24px",
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
              type="submit"
              style={{
                padding: "12px 28px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "var(--primary)",
                color: "white",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <iconify-icon icon="lucide:check"></iconify-icon> Create Event
            </button>
          </div>
        </form>
      )}

      {/* ===== REGISTERED TEAMS TAB ===== */}
      {activeTab === "teams" && (
        <>
          <div style={{ marginBottom: "20px" }}>
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
              value={selectedEventForTeams || ""}
              onChange={(e) => setSelectedEventForTeams(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <option value="">Choose an event to view teams</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} ({e.status})
                </option>
              ))}
            </select>
          </div>

          {selectedEventForTeams &&
            (() => {
              const eventTeams = teams[selectedEventForTeams] || [];
              const event = events.find((e) => e.id === selectedEventForTeams);
              return (
                <>
                  {/* Team Statistics */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "16px",
                      marginBottom: "24px",
                    }}
                  >
                    {[
                      {
                        label: "Total Teams",
                        value: eventTeams.length,
                        icon: "lucide:users-2",
                        color: "#6366f1",
                      },
                      {
                        label: "Approved",
                        value: eventTeams.filter(
                          (t) =>
                            t.status === "approved" || t.status === "winner",
                        ).length,
                        icon: "lucide:check-circle",
                        color: "#22c55e",
                      },
                      {
                        label: "Pending",
                        value: eventTeams.filter((t) => t.status === "pending")
                          .length,
                        icon: "lucide:clock",
                        color: "#f59e0b",
                      },
                      {
                        label: "Rejected",
                        value: eventTeams.filter((t) => t.status === "rejected")
                          .length,
                        icon: "lucide:x-circle",
                        color: "#ef4444",
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

                  {/* Event Details Card - Shows when event is selected */}
                  <div style={{ ...card, marginBottom: "20px" }}>
                    <div style={cardHeaderRow}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <img
                          src={
                            event?.image ||
                            "https://images.unsplash.com/photo-1504384308090-c54be3855463?auto=format&fit=crop&w=100&q=80"
                          }
                          alt={event?.title}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "var(--radius-md)",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <h3 style={{ ...cardTitle, marginBottom: "4px" }}>
                            {event?.title}
                          </h3>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            {event?.type} • {event?.domain} • {event?.mode}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background: getStatusStyle(event?.status).bg,
                            color: getStatusStyle(event?.status).color,
                            textTransform: "capitalize",
                          }}
                        >
                          {event?.status}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "16px",
                        marginTop: "16px",
                      }}
                    >
                      <div
                        style={{
                          padding: "12px",
                          background: "var(--muted)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--muted-foreground)",
                            marginBottom: "4px",
                          }}
                        >
                          Event Date
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--foreground)",
                          }}
                        >
                          {new Date(event?.startDate).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short" },
                          )}{" "}
                          -{" "}
                          {new Date(event?.endDate).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "12px",
                          background: "var(--muted)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--muted-foreground)",
                            marginBottom: "4px",
                          }}
                        >
                          Registration Deadline
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--foreground)",
                          }}
                        >
                          {new Date(
                            event?.registrationDeadline,
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "12px",
                          background: "var(--muted)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--muted-foreground)",
                            marginBottom: "4px",
                          }}
                        >
                          Venue
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--foreground)",
                          }}
                        >
                          {event?.venue}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "12px",
                          background: "var(--muted)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--muted-foreground)",
                            marginBottom: "4px",
                          }}
                        >
                          Team Size
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--foreground)",
                          }}
                        >
                          {event?.minTeamSize} - {event?.maxTeamSize} members
                        </div>
                      </div>
                    </div>
                    {event?.prizes?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          marginTop: "16px",
                          paddingTop: "16px",
                          borderTop: "1px solid var(--border)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--muted-foreground)",
                            fontWeight: 500,
                          }}
                        >
                          Prizes:
                        </div>
                        {event.prizes
                          .filter((p) => p.amount)
                          .map((prize, idx) => (
                            <span
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                background:
                                  idx === 0
                                    ? "rgba(234, 179, 8, 0.1)"
                                    : idx === 1
                                      ? "rgba(148, 163, 184, 0.1)"
                                      : "rgba(205, 127, 50, 0.1)",
                                color:
                                  idx === 0
                                    ? "#ca8a04"
                                    : idx === 1
                                      ? "#64748b"
                                      : "#b45309",
                                fontSize: "12px",
                                fontWeight: 600,
                              }}
                            >
                              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"} ₹
                              {Number(prize.amount).toLocaleString()}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Teams List */}
                  {eventTeams.length === 0 ? (
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
                        icon="lucide:users-x"
                        style={{ fontSize: "56px" }}
                      ></iconify-icon>
                      <p style={{ margin: 0, fontSize: "16px" }}>
                        No teams registered for this event
                      </p>
                    </div>
                  ) : (
                    <div style={card}>
                      <div style={cardHeaderRow}>
                        <h3 style={cardTitle}>Teams for {event?.title}</h3>
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
                          <iconify-icon icon="lucide:download"></iconify-icon>{" "}
                          Export
                        </button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {eventTeams.map((team) => {
                          const teamStatus = getStatusStyle(team.status);
                          return (
                            <div
                              key={team.id}
                              style={{
                                border: "1px solid var(--border)",
                                borderRadius: "var(--radius-md)",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                onClick={() =>
                                  setExpandedTeam(
                                    expandedTeam === team.id ? null : team.id,
                                  )
                                }
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: "16px",
                                  cursor: "pointer",
                                  background: "var(--muted)",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "44px",
                                      height: "44px",
                                      borderRadius: "var(--radius-md)",
                                      background: "var(--primary)",
                                      color: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: 700,
                                      fontSize: "16px",
                                    }}
                                  >
                                    {team.teamName.charAt(0)}
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        fontSize: "15px",
                                        fontWeight: 600,
                                        color: "var(--foreground)",
                                      }}
                                    >
                                      {team.teamName}
                                    </div>
                                    {team.projectTitle && (
                                      <div
                                        style={{
                                          fontSize: "13px",
                                          color: "var(--primary)",
                                        }}
                                      >
                                        {team.projectTitle}
                                      </div>
                                    )}
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
                                      fontSize: "13px",
                                      color: "var(--muted-foreground)",
                                    }}
                                  >
                                    {team.members.length} members
                                  </span>
                                  <span
                                    style={{
                                      padding: "4px 10px",
                                      borderRadius: "20px",
                                      fontSize: "11px",
                                      fontWeight: 500,
                                      background: teamStatus.bg,
                                      color: teamStatus.color,
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {team.status}
                                  </span>
                                  <iconify-icon
                                    icon={
                                      expandedTeam === team.id
                                        ? "lucide:chevron-up"
                                        : "lucide:chevron-down"
                                    }
                                    style={{
                                      color: "var(--muted-foreground)",
                                      fontSize: "18px",
                                    }}
                                  ></iconify-icon>
                                </div>
                              </div>
                              {expandedTeam === team.id && (
                                <div
                                  style={{
                                    padding: "16px",
                                    borderTop: "1px solid var(--border)",
                                  }}
                                >
                                  {team.projectDescription && (
                                    <div
                                      style={{
                                        marginBottom: "16px",
                                        padding: "12px",
                                        background: "var(--muted)",
                                        borderRadius: "var(--radius-md)",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          color: "var(--muted-foreground)",
                                          marginBottom: "4px",
                                        }}
                                      >
                                        Project Description
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "14px",
                                          color: "var(--foreground)",
                                        }}
                                      >
                                        {team.projectDescription}
                                      </div>
                                    </div>
                                  )}
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns:
                                        "repeat(auto-fill, minmax(280px, 1fr))",
                                      gap: "12px",
                                      marginBottom: "16px",
                                    }}
                                  >
                                    {team.members.map((member, idx) => (
                                      <div
                                        key={idx}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "12px",
                                          padding: "14px",
                                          background: "var(--background)",
                                          borderRadius: "var(--radius-md)",
                                          border: "1px solid var(--border)",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "42px",
                                            height: "42px",
                                            borderRadius: "10px",
                                            background:
                                              member.role === "Leader"
                                                ? "#f59e0b"
                                                : "var(--primary)",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 600,
                                            fontSize: "14px",
                                          }}
                                        >
                                          {member.name.charAt(0)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                          <div
                                            style={{
                                              fontSize: "14px",
                                              fontWeight: 500,
                                              color: "var(--foreground)",
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "6px",
                                            }}
                                          >
                                            {member.name}
                                            {member.role === "Leader" && (
                                              <span
                                                style={{
                                                  padding: "2px 6px",
                                                  background:
                                                    "rgba(245, 158, 11, 0.1)",
                                                  color: "#d97706",
                                                  borderRadius: "4px",
                                                  fontSize: "10px",
                                                  fontWeight: 600,
                                                }}
                                              >
                                                Leader
                                              </span>
                                            )}
                                          </div>
                                          <div
                                            style={{
                                              fontSize: "12px",
                                              color: "var(--muted-foreground)",
                                            }}
                                          >
                                            {member.department} • Year{" "}
                                            {member.year}
                                          </div>
                                          <div
                                            style={{
                                              fontSize: "11px",
                                              color: "var(--muted-foreground)",
                                              marginTop: "2px",
                                            }}
                                          >
                                            {member.email}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  {team.status === "pending" && (
                                    <div
                                      style={{ display: "flex", gap: "10px" }}
                                    >
                                      <button
                                        onClick={() =>
                                          handleApproveTeam(
                                            selectedEventForTeams,
                                            team.id,
                                          )
                                        }
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "6px",
                                          padding: "8px 16px",
                                          borderRadius: "var(--radius-md)",
                                          border: "none",
                                          background: "#22c55e",
                                          color: "white",
                                          fontSize: "13px",
                                          fontWeight: 500,
                                          cursor: "pointer",
                                        }}
                                      >
                                        <iconify-icon icon="lucide:check"></iconify-icon>{" "}
                                        Approve
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleRejectTeam(
                                            selectedEventForTeams,
                                            team.id,
                                          )
                                        }
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "6px",
                                          padding: "8px 16px",
                                          borderRadius: "var(--radius-md)",
                                          border: "1px solid #dc2626",
                                          background: "transparent",
                                          color: "#dc2626",
                                          fontSize: "13px",
                                          fontWeight: 500,
                                          cursor: "pointer",
                                        }}
                                      >
                                        <iconify-icon icon="lucide:x"></iconify-icon>{" "}
                                        Reject
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

          {!selectedEventForTeams && (
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
                icon="lucide:hand-pointing"
                style={{ fontSize: "56px" }}
              ></iconify-icon>
              <p style={{ margin: 0, fontSize: "16px" }}>
                Select an event to view registered teams
              </p>
            </div>
          )}
        </>
      )}

      {/* ===== DECLARE WINNERS TAB ===== */}
      {activeTab === "winners" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--foreground)",
                marginBottom: "8px",
              }}
            >
              Select Completed Event
            </label>
            <select
              value={selectedEventForWinners || ""}
              onChange={(e) => setSelectedEventForWinners(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <option value="">Choose an event to declare winners</option>
              {events
                .filter(
                  (e) => e.status === "ongoing" || e.status === "completed",
                )
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({e.status})
                  </option>
                ))}
            </select>
          </div>

          {selectedEventForWinners &&
            (() => {
              const eventTeams = teams[selectedEventForWinners] || [];
              const approvedTeams = eventTeams.filter(
                (t) => t.status === "approved" || t.status === "winner",
              );
              const event = events.find(
                (e) => e.id === selectedEventForWinners,
              );
              const existingWinners = eventTeams.filter(
                (t) => t.status === "winner",
              );

              return (
                <div style={card}>
                  <div style={cardHeaderRow}>
                    <h3 style={cardTitle}>Declare Winners - {event?.title}</h3>
                  </div>

                  {existingWinners.length > 0 && (
                    <div
                      style={{
                        marginBottom: "24px",
                        padding: "20px",
                        background: "var(--muted)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--foreground)",
                          marginBottom: "16px",
                        }}
                      >
                        🏆 Current Winners
                      </div>
                      <div style={{ display: "flex", gap: "16px" }}>
                        {existingWinners
                          .sort((a, b) => a.position.localeCompare(b.position))
                          .map((team) => (
                            <div
                              key={team.id}
                              style={{
                                flex: 1,
                                padding: "16px",
                                background: "var(--card)",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid var(--border)",
                                textAlign: "center",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "32px",
                                  marginBottom: "8px",
                                }}
                              >
                                {team.position === "1st"
                                  ? "🥇"
                                  : team.position === "2nd"
                                    ? "🥈"
                                    : "🥉"}
                              </div>
                              <div
                                style={{
                                  fontSize: "15px",
                                  fontWeight: 600,
                                  color: "var(--foreground)",
                                }}
                              >
                                {team.teamName}
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "var(--primary)",
                                }}
                              >
                                {team.projectTitle}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {approvedTeams.length === 0 ? (
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
                      <p style={{ margin: 0 }}>No approved teams available</p>
                    </div>
                  ) : (
                    <>
                      {/* Flexible Winner Positions */}
                      <div style={{ marginBottom: "24px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "var(--foreground)",
                            }}
                          >
                            Winner Positions
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const currentPositions = Object.keys(
                                winnerSelections,
                              ).filter((k) =>
                                k.startsWith(selectedEventForWinners),
                              ).length;
                              const nextPos = currentPositions + 1;
                              const posLabel =
                                nextPos === 1
                                  ? "1st"
                                  : nextPos === 2
                                    ? "2nd"
                                    : nextPos === 3
                                      ? "3rd"
                                      : `${nextPos}th`;
                              setWinnerSelections((prev) => ({
                                ...prev,
                                [`${selectedEventForWinners}-${posLabel}`]: "",
                              }));
                            }}
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
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(250px, 1fr))",
                            gap: "16px",
                          }}
                        >
                          {[
                            "1st",
                            "2nd",
                            "3rd",
                            "4th",
                            "5th",
                            "6th",
                            "7th",
                            "8th",
                            "9th",
                            "10th",
                          ]
                            .filter((pos) => {
                              // Always show first 3, show others only if they have a key
                              const posIdx = [
                                "1st",
                                "2nd",
                                "3rd",
                                "4th",
                                "5th",
                                "6th",
                                "7th",
                                "8th",
                                "9th",
                                "10th",
                              ].indexOf(pos);
                              if (posIdx < 3) return true;
                              return (
                                winnerSelections[
                                  `${selectedEventForWinners}-${pos}`
                                ] !== undefined
                              );
                            })
                            .map((position, posIdx) => (
                              <div
                                key={position}
                                style={{
                                  padding: "20px",
                                  background: "var(--muted)",
                                  borderRadius: "var(--radius-md)",
                                  border: "1px solid var(--border)",
                                  position: "relative",
                                }}
                              >
                                {posIdx >= 3 && (
                                  <button
                                    onClick={() => {
                                      const newSelections = {
                                        ...winnerSelections,
                                      };
                                      delete newSelections[
                                        `${selectedEventForWinners}-${position}`
                                      ];
                                      setWinnerSelections(newSelections);
                                    }}
                                    style={{
                                      position: "absolute",
                                      top: "8px",
                                      right: "8px",
                                      padding: "4px",
                                      borderRadius: "4px",
                                      border: "none",
                                      background: "transparent",
                                      color: "var(--muted-foreground)",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <iconify-icon
                                      icon="lucide:x"
                                      style={{ fontSize: "14px" }}
                                    ></iconify-icon>
                                  </button>
                                )}
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    marginBottom: "16px",
                                  }}
                                >
                                  <span style={{ fontSize: "28px" }}>
                                    {posIdx === 0
                                      ? "🥇"
                                      : posIdx === 1
                                        ? "🥈"
                                        : posIdx === 2
                                          ? "🥉"
                                          : "🏅"}
                                  </span>
                                  <div>
                                    <div
                                      style={{
                                        fontSize: "15px",
                                        fontWeight: 600,
                                        color: "var(--foreground)",
                                      }}
                                    >
                                      {position} Place
                                    </div>
                                    {event?.prizes?.[posIdx]?.amount && (
                                      <div
                                        style={{
                                          fontSize: "13px",
                                          color: "var(--primary)",
                                        }}
                                      >
                                        ₹
                                        {Number(
                                          event.prizes[posIdx].amount,
                                        ).toLocaleString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <select
                                  value={
                                    winnerSelections[
                                      `${selectedEventForWinners}-${position}`
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleDeclareWinner(
                                      selectedEventForWinners,
                                      e.target.value,
                                      position,
                                    )
                                  }
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
                                  <option value="">Select team</option>
                                  {approvedTeams
                                    .filter(
                                      (t) =>
                                        !Object.values(
                                          winnerSelections,
                                        ).includes(t.id) ||
                                        winnerSelections[
                                          `${selectedEventForWinners}-${position}`
                                        ] === t.id,
                                    )
                                    .map((team) => (
                                      <option key={team.id} value={team.id}>
                                        {team.teamName} -{" "}
                                        {team.projectTitle || "N/A"}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Special Categories */}
                      <div style={{ marginBottom: "24px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "var(--foreground)",
                              }}
                            >
                              Special Categories
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "var(--muted-foreground)",
                              }}
                            >
                              e.g., Best UI/UX, Most Innovative, People's Choice
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setWinnerSelections((prev) => ({
                                ...prev,
                                [`${selectedEventForWinners}-special-${Date.now()}`]:
                                  { name: "", teamId: "" },
                              }));
                            }}
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
                            <iconify-icon icon="lucide:award"></iconify-icon>
                            Add Special Award
                          </button>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                          }}
                        >
                          {Object.entries(winnerSelections)
                            .filter(([key]) =>
                              key.startsWith(
                                `${selectedEventForWinners}-special-`,
                              ),
                            )
                            .map(([key, value]) => (
                              <div
                                key={key}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr auto",
                                  gap: "12px",
                                  padding: "16px",
                                  background: "var(--muted)",
                                  borderRadius: "var(--radius-md)",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  type="text"
                                  placeholder="Award name (e.g., Best Design)"
                                  value={
                                    typeof value === "object" ? value.name : ""
                                  }
                                  onChange={(e) =>
                                    setWinnerSelections((prev) => ({
                                      ...prev,
                                      [key]: {
                                        ...prev[key],
                                        name: e.target.value,
                                      },
                                    }))
                                  }
                                  style={{
                                    padding: "12px",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid var(--border)",
                                    background: "var(--card)",
                                    color: "var(--foreground)",
                                    fontSize: "14px",
                                  }}
                                />
                                <select
                                  value={
                                    typeof value === "object"
                                      ? value.teamId
                                      : ""
                                  }
                                  onChange={(e) =>
                                    setWinnerSelections((prev) => ({
                                      ...prev,
                                      [key]: {
                                        ...prev[key],
                                        teamId: e.target.value,
                                      },
                                    }))
                                  }
                                  style={{
                                    padding: "12px",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid var(--border)",
                                    background: "var(--card)",
                                    color: "var(--foreground)",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <option value="">Select team</option>
                                  {approvedTeams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                      {team.teamName} -{" "}
                                      {team.projectTitle || "N/A"}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => {
                                    const newSelections = {
                                      ...winnerSelections,
                                    };
                                    delete newSelections[key];
                                    setWinnerSelections(newSelections);
                                  }}
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
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "12px",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleSaveWinners(selectedEventForWinners)
                          }
                          disabled={
                            !winnerSelections[`${selectedEventForWinners}-1st`]
                          }
                          style={{
                            padding: "12px 24px",
                            borderRadius: "var(--radius-md)",
                            border: "none",
                            background: winnerSelections[
                              `${selectedEventForWinners}-1st`
                            ]
                              ? "var(--primary)"
                              : "var(--muted)",
                            color: winnerSelections[
                              `${selectedEventForWinners}-1st`
                            ]
                              ? "white"
                              : "var(--muted-foreground)",
                            fontSize: "14px",
                            fontWeight: 500,
                            cursor: winnerSelections[
                              `${selectedEventForWinners}-1st`
                            ]
                              ? "pointer"
                              : "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <iconify-icon icon="lucide:trophy"></iconify-icon>{" "}
                          Confirm Winners
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

          {!selectedEventForWinners && (
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
                icon="lucide:trophy"
                style={{ fontSize: "56px" }}
              ></iconify-icon>
              <p style={{ margin: 0, fontSize: "16px" }}>
                Select an event to declare winners
              </p>
            </div>
          )}
        </>
      )}

      {/* ===== EVENT ANALYTICS TAB ===== */}
      {activeTab === "analytics" && (
        <>
          <div style={{ marginBottom: "20px" }}>
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
                maxWidth: "400px",
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
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          {selectedEventForAnalytics &&
            (() => {
              const event = events.find(
                (e) => e.id === selectedEventForAnalytics,
              );
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
              };

              return (
                <>
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

                  {/* Geographic Distribution Map */}
                  <div style={{ ...card, marginBottom: "20px" }}>
                    <div style={cardHeaderRow}>
                      <h3 style={cardTitle}>
                        <iconify-icon
                          icon="lucide:map"
                          style={{
                            marginRight: "8px",
                            color: "var(--primary)",
                          }}
                        ></iconify-icon>
                        Geographic Distribution of Participants
                      </h3>
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
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: "20px",
                      }}
                    >
                      {/* Map Container */}
                      <div
                        id={`map-${selectedEventForAnalytics}`}
                        style={{
                          height: "350px",
                          borderRadius: "var(--radius-md)",
                          background:
                            "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Static Map Visualization (Mapbox would be initialized via useEffect) */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              textAlign: "center",
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            <iconify-icon
                              icon="lucide:map"
                              style={{ fontSize: "48px", marginBottom: "12px" }}
                            ></iconify-icon>
                            <p style={{ margin: 0, fontSize: "13px" }}>
                              Loading Mapbox...
                            </p>
                            <p
                              style={{ margin: "4px 0 0 0", fontSize: "11px" }}
                            >
                              Interactive map with participant locations
                            </p>
                          </div>
                        </div>
                        {/* Map Markers Preview */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: import.meta.env.VITE_MAPBOX_TOKEN
                              ? `url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/80.2707,13.0827,5,0/600x350?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}') center/cover no-repeat`
                              : "#0f172a",
                          }}
                        >
                          {/* Marker overlays */}
                          {analytics.geographicData?.map((loc, idx) => {
                            // Calculate approximate position (simplified)
                            const centerLat = 13.0827;
                            const centerLng = 80.2707;
                            const scale = 50;
                            const x = 50 + (loc.lng - centerLng) * scale;
                            const y = 50 - (loc.lat - centerLat) * scale;
                            const size = Math.min(
                              40,
                              Math.max(16, loc.participants / 3),
                            );
                            return (
                              <div
                                key={idx}
                                style={{
                                  position: "absolute",
                                  left: `${Math.max(5, Math.min(90, x))}%`,
                                  top: `${Math.max(5, Math.min(90, y))}%`,
                                  transform: "translate(-50%, -50%)",
                                  width: `${size}px`,
                                  height: `${size}px`,
                                  borderRadius: "50%",
                                  background: "rgba(99, 102, 241, 0.7)",
                                  border: "2px solid rgba(255,255,255,0.8)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                }}
                                title={`${loc.city}: ${loc.participants} participants`}
                              >
                                {loc.teams}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {/* Location List */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--muted-foreground)",
                            marginBottom: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Top Locations
                        </div>
                        {analytics.geographicData
                          ?.slice(0, 6)
                          .map((loc, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px",
                                background: "var(--muted)",
                                borderRadius: "var(--radius-md)",
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

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    {/* Domain Distribution - NEW */}
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
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {(analytics.domainDistribution || []).map((item, i) => {
                          const colors = [
                            "#6366f1",
                            "#8b5cf6",
                            "#a855f7",
                            "#d946ef",
                            "#ec4899",
                          ];
                          return (
                            <div key={i}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "6px",
                                }}
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
                                      width: "10px",
                                      height: "10px",
                                      borderRadius: "2px",
                                      background: colors[i % colors.length],
                                    }}
                                  ></span>
                                  <span
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: 500,
                                      color: "var(--foreground)",
                                    }}
                                  >
                                    {item.domain}
                                  </span>
                                </div>
                                <span
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: colors[i % colors.length],
                                  }}
                                >
                                  {item.count} teams ({item.percentage}%)
                                </span>
                              </div>
                              <div
                                style={{
                                  height: "6px",
                                  background: "var(--muted)",
                                  borderRadius: "3px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${item.percentage}%`,
                                    height: "100%",
                                    background: colors[i % colors.length],
                                    borderRadius: "3px",
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Registration Status */}
                    <div style={card}>
                      <div style={cardHeaderRow}>
                        <h3 style={cardTitle}>Registration Status</h3>
                      </div>
                      <div style={{ display: "flex", gap: "16px" }}>
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
                              flex: 1,
                              padding: "20px",
                              background: "var(--muted)",
                              borderRadius: "var(--radius-md)",
                              textAlign: "center",
                            }}
                          >
                            <iconify-icon
                              icon={item.icon}
                              style={{
                                fontSize: "24px",
                                color: item.color,
                                marginBottom: "8px",
                              }}
                            ></iconify-icon>
                            <div
                              style={{
                                fontSize: "28px",
                                fontWeight: 700,
                                color: item.color,
                              }}
                            >
                              {item.value}
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "var(--muted-foreground)",
                              }}
                            >
                              {item.label}
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
                      marginBottom: "20px",
                    }}
                  >
                    {/* Department Distribution */}
                    <div style={card}>
                      <div style={cardHeaderRow}>
                        <h3 style={cardTitle}>Department Wise Participation</h3>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {analytics.departmentDistribution
                          .slice(0, 5)
                          .map((item, i) => {
                            const maxCount = Math.max(
                              ...analytics.departmentDistribution.map(
                                (d) => d.count,
                              ),
                            );
                            const percentage = (item.count / maxCount) * 100;
                            return (
                              <div key={i}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "4px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: 500,
                                      color: "var(--foreground)",
                                    }}
                                  >
                                    {item.dept}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "13px",
                                      color: "var(--muted-foreground)",
                                    }}
                                  >
                                    {item.count} students
                                  </span>
                                </div>
                                <div
                                  style={{
                                    height: "8px",
                                    background: "var(--muted)",
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${percentage}%`,
                                      height: "100%",
                                      background: "var(--primary)",
                                      borderRadius: "4px",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* College Distribution - NEW */}
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
                    {/* Year Distribution */}
                    <div style={card}>
                      <div style={cardHeaderRow}>
                        <h3 style={cardTitle}>Year Wise Distribution</h3>
                      </div>
                      <div style={{ display: "flex", gap: "16px" }}>
                        {analytics.yearDistribution.map((item, i) => {
                          const total = analytics.yearDistribution.reduce(
                            (sum, y) => sum + y.count,
                            0,
                          );
                          const percentage = (
                            (item.count / total) *
                            100
                          ).toFixed(0);
                          return (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                padding: "20px",
                                background: "var(--muted)",
                                borderRadius: "var(--radius-md)",
                                textAlign: "center",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "24px",
                                  fontWeight: 700,
                                  color: "var(--primary)",
                                }}
                              >
                                {percentage}%
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                {item.year}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--muted-foreground)",
                                  marginTop: "4px",
                                }}
                              >
                                {item.count} students
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Registration Trend */}
                    <div style={card}>
                      <div style={cardHeaderRow}>
                        <h3 style={cardTitle}>Registration Trend</h3>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          gap: "8px",
                          height: "120px",
                        }}
                      >
                        {analytics.registrationTrend.map((item, i) => {
                          const maxCount = Math.max(
                            ...analytics.registrationTrend.map((r) => r.count),
                          );
                          const height = (item.count / maxCount) * 100;
                          return (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  color: "var(--foreground)",
                                }}
                              >
                                {item.count}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  height: `${height}%`,
                                  minHeight: "4px",
                                  background: "var(--primary)",
                                  borderRadius: "4px 4px 0 0",
                                }}
                              ></div>
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                {item.date}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
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
        </>
      )}

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateTemplate
          event={certificateData.event}
          winners={certificateData.winners}
          participants={certificateData.participants}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* Judge Credentials Modal */}
      {showJudgeCredentialsModal && currentJudgeCredentials && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowJudgeCredentialsModal(false)}
        >
          <div
            style={{
              background: "var(--card)",
              borderRadius: "var(--radius-lg)",
              padding: "32px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                  }}
                >
                  Judge Credentials Generated
                </h2>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "13px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Share these credentials with judges for scoring
                </p>
              </div>
              <button
                onClick={() => setShowJudgeCredentialsModal(false)}
                style={{
                  padding: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted-foreground)",
                }}
              >
                <iconify-icon
                  icon="lucide:x"
                  style={{ fontSize: "20px" }}
                ></iconify-icon>
              </button>
            </div>

            <div
              style={{
                padding: "16px",
                background: "var(--muted)",
                borderRadius: "var(--radius-md)",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "13px", marginBottom: "8px" }}>
                <strong>Event:</strong> {currentJudgeCredentials.eventTitle}
              </div>
              <div style={{ fontSize: "13px", marginBottom: "8px" }}>
                <strong>Round:</strong> {currentJudgeCredentials.roundName}
              </div>
              <div style={{ fontSize: "13px" }}>
                <strong>Event ID (Username):</strong>{" "}
                <code
                  style={{
                    background: "var(--card)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                  }}
                >
                  {currentJudgeCredentials.eventId}
                </code>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  margin: "0 0 12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                }}
              >
                Judge Passwords
              </h3>
              <div
                style={{
                  display: "grid",
                  gap: "10px",
                }}
              >
                {currentJudgeCredentials.judges.map((judge, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "var(--muted)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {judge.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <code
                        style={{
                          background: "var(--card)",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontFamily: "monospace",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#10b981",
                        }}
                      >
                        {judge.password}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(judge.password);
                        }}
                        style={{
                          padding: "6px 10px",
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "11px",
                          color: "var(--foreground)",
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                background: "rgba(245, 158, 11, 0.1)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <iconify-icon
                  icon="lucide:info"
                  style={{ fontSize: "18px", color: "#f59e0b", flexShrink: 0 }}
                ></iconify-icon>
                <div style={{ fontSize: "12px", color: "var(--foreground)" }}>
                  <strong>Instructions for Judges:</strong>
                  <ol style={{ margin: "8px 0 0", paddingLeft: "16px" }}>
                    <li>
                      Go to the login page and click "Login as Event Judge"
                    </li>
                    <li>
                      Enter the Event ID:{" "}
                      <strong>{currentJudgeCredentials.eventId}</strong>
                    </li>
                    <li>
                      Enter their assigned password (e.g., judge1, judge2, etc.)
                    </li>
                    <li>Score teams based on the judging criteria</li>
                  </ol>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowJudgeCredentialsModal(false)}
                style={{
                  padding: "10px 24px",
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
