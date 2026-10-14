export const stats = [
  {
    id: 1,
    title: "Total Students",
    value: "1,240",
    growth: "+12%",
    growthLabel: "this semester",
    positive: true,
    icon: "lucide:users",
    colorClass: "text-blue-500",
    bgClass: "bg-blue-50",
  },
  {
    id: 2,
    title: "Total Wins (This Month)",
    value: 48,
    growth: "+5%",
    growthLabel: "from last month",
    positive: true,
    icon: "lucide:trophy",
    colorClass: "text-yellow-500",
    bgClass: "bg-yellow-50",
  },
  {
    id: 3,
    title: "Active Participations",
    value: 312,
    growth: "Trending High",
    growthLabel: "across batches",
    positive: true,
    icon: "lucide:activity",
    colorClass: "text-indigo-500",
    bgClass: "bg-indigo-50",
  },
  {
    id: 4,
    title: "Upcoming Events",
    value: 14,
    growth: "",
    growthLabel: "3 events next week",
    positive: true,
    icon: "lucide:calendar-days",
    colorClass: "text-slate-500",
    bgClass: "bg-slate-100",
  },
];

export const departmentWins = [
  { department: "CSE", wins: 85 },
  { department: "ECE", wins: 45 },
  { department: "MECH", wins: 60 },
  { department: "CIVIL", wins: 35 },
  { department: "IT", wins: 70 },
  { department: "EEE", wins: 25 },
];

export const skillDistribution = [
  { skill: "Development", value: 40 },
  { skill: "Design", value: 25 },
  { skill: "Marketing", value: 20 },
  { skill: "Data Science", value: 15 },
];

export const monthlyGrowth = [
  { month: "Jan", participation: 80 },
  { month: "Feb", participation: 110 },
  { month: "Mar", participation: 150 },
  { month: "Apr", participation: 370 },
  { month: "May", participation: 360 },
  { month: "Jun", participation: 420 },
];

export const recentActivities = [
  {
    id: 1,
    student: "Arjun Kumar",
    initials: "AK",
    event: "Cloud Native Hackathon 2024",
    action: "Won",
    actionType: "win",
  },
  {
    id: 2,
    student: "Riya Patel",
    initials: "RP",
    event: "UI/UX Design Sprint",
    action: "Registered",
    actionType: "registered",
  },
  {
    id: 3,
    student: "Samir Menon",
    initials: "SM",
    event: "Advanced React Patterns",
    action: "Registered",
    actionType: "registered",
  },
  {
    id: 4,
    student: "Neha Jain",
    initials: "NJ",
    event: "Global Coding Challenge",
    action: "Won",
    actionType: "win",
  },
  {
    id: 5,
    student: "Priya Sharma",
    initials: "PS",
    event: "IEEE Hackathon 2026",
    action: "Registered",
    actionType: "registered",
  },
  {
    id: 6,
    student: "Karan Nair",
    initials: "KN",
    event: "DSA Olympiad",
    action: "Won",
    actionType: "win",
  },
];

export const PIE_COLORS = ["#6366f1", "#818cf8", "#c7d2fe", "#e0e7ff"];

/* ─── MyStudents ─────────────────────────────────────────────────────── */
function generateHeatmap(activityPct) {
  const grid = [];
  for (let w = 0; w < 52; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const r = Math.random() * 100;
      week.push(
        r > 100 - activityPct * 0.9
          ? 3
          : r > 100 - activityPct * 1.4
            ? 2
            : r > 100 - activityPct * 2.2
              ? 1
              : 0,
      );
    }
    grid.push(week);
  }
  return grid;
}

export const STUDENTS = [
  {
    id: 1,
    name: "Riya Patel",
    rollNo: "21CS045",
    year: "3rd Year",
    dept: "Computer Science",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=riyapatel&backgroundColor=ffd5dc",
    credits: 1480,
    rank: "#8",
    streak: 18,
    status: "active",
    gpa: "8.9",
    participation: 12,
    wins: 4,
    githubStats: { commits: 312, prs: 28, stars: 94, contributions: 218 },
    leetcodeStats: {
      solved: 187,
      easy: 80,
      medium: 82,
      hard: 25,
      rank: "Top 15%",
    },
    skills: ["Python", "ML/AI", "React", "FastAPI", "IoT", "Node.js"],
    bio: "Passionate about AI and automation. Working on bridging the gap between academia and real-world tech.",
    skillGaps: [
      {
        skill: "System Design",
        level: "low",
        suggestion:
          "Practice HLD/LLD patterns — critical for SDE roles at product companies.",
      },
      {
        skill: "Cloud (AWS/GCP)",
        level: "medium",
        suggestion: "Add a cloud certification to complement your ML projects.",
      },
    ],
    projects: [
      {
        name: "AI Resume Screener",
        status: "Ongoing",
        tech: ["Python", "FastAPI", "ML"],
        desc: "Automates resume shortlisting using NLP models.",
        score: 88,
      },
      {
        name: "Smart Campus IoT",
        status: "Completed",
        tech: ["Arduino", "MQTT", "React"],
        desc: "IoT-based smart energy monitoring for college labs.",
        score: 92,
      },
    ],
    events: [
      {
        name: "HackFest 2025",
        type: "Hackathon",
        result: "Winner 🏆",
        date: "Jan 2025",
        pts: 300,
      },
      {
        name: "Cloud Native Bootcamp",
        type: "Workshop",
        result: "Completed",
        date: "Oct 2024",
        pts: 80,
      },
      {
        name: "Open Source Sprint",
        type: "Competition",
        result: "Runner-up 🥈",
        date: "Aug 2024",
        pts: 180,
      },
    ],
    achievements: [
      { icon: "lucide:trophy", label: "Hackathon Winner", color: "#f59e0b" },
      { icon: "lucide:flame", label: "18-Day Streak", color: "#f97316" },
      { icon: "lucide:star", label: "Top Contributor", color: "#8b5cf6" },
      { icon: "lucide:code-2", label: "Open Source", color: "#06b6d4" },
    ],
    heatmap: generateHeatmap(75),
  },
  {
    id: 2,
    name: "Arjun Mehta",
    rollNo: "21CS022",
    year: "3rd Year",
    dept: "Computer Science",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=arjunmehta2&backgroundColor=b6e3f4",
    credits: 1620,
    rank: "#7",
    streak: 24,
    status: "active",
    gpa: "9.2",
    participation: 17,
    wins: 6,
    githubStats: { commits: 481, prs: 53, stars: 162, contributions: 390 },
    leetcodeStats: {
      solved: 254,
      easy: 90,
      medium: 120,
      hard: 44,
      rank: "Top 8%",
    },
    skills: ["Solidity", "Web3", "Docker", "Kubernetes", "React", "Go"],
    bio: "Blockchain enthusiast and DevOps advocate. Believe systems should be trustless and pipelines should be painless.",
    skillGaps: [
      {
        skill: "ML Fundamentals",
        level: "low",
        suggestion:
          "Supplement DevOps expertise with ML knowledge — AI-Ops is a rising area.",
      },
    ],
    projects: [
      {
        name: "Blockchain Voting System",
        status: "Ongoing",
        tech: ["Solidity", "React", "Ethers.js"],
        desc: "Decentralized voting platform for student unions.",
        score: 91,
      },
      {
        name: "DevOps Pipeline Automation",
        status: "Completed",
        tech: ["Docker", "GitHub Actions", "K8s"],
        desc: "CI/CD pipeline for multi-service applications.",
        score: 95,
      },
    ],
    events: [
      {
        name: "Web3 Hackathon",
        type: "Hackathon",
        result: "Winner 🏆",
        date: "Dec 2024",
        pts: 300,
      },
      {
        name: "DevOps Summit",
        type: "Conference",
        result: "Speaker",
        date: "Nov 2024",
        pts: 150,
      },
      {
        name: "Smart India Hackathon",
        type: "Hackathon",
        result: "Finalist",
        date: "Sep 2024",
        pts: 100,
      },
    ],
    achievements: [
      { icon: "lucide:trophy", label: "2x Hackathon Winner", color: "#f59e0b" },
      { icon: "lucide:flame", label: "24-Day Streak", color: "#f97316" },
      { icon: "lucide:mic-2", label: "Conference Speaker", color: "#8b5cf6" },
      { icon: "lucide:layers", label: "Blockchain Dev", color: "#14b8a6" },
    ],
    heatmap: generateHeatmap(90),
  },
  {
    id: 3,
    name: "Sneha Krishnan",
    rollNo: "22CS031",
    year: "2nd Year",
    dept: "Computer Science",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=snehakrishnan&backgroundColor=c0aede",
    credits: 940,
    rank: "#19",
    streak: 7,
    status: "active",
    gpa: "8.4",
    participation: 6,
    wins: 2,
    githubStats: { commits: 127, prs: 11, stars: 38, contributions: 98 },
    leetcodeStats: {
      solved: 98,
      easy: 60,
      medium: 32,
      hard: 6,
      rank: "Top 35%",
    },
    skills: ["Next.js", "Figma", "Firebase", "UI/UX", "Tailwind CSS"],
    bio: "Combining design thinking with engineering. Passionate about creating beautiful and functional interfaces.",
    skillGaps: [
      {
        skill: "Backend Development",
        level: "low",
        suggestion:
          "Add Node.js/Express or Django to round out your full-stack capability.",
      },
      {
        skill: "DSA",
        level: "medium",
        suggestion:
          "Increase LeetCode medium solves — currently at 32. Target 80+ before placements.",
      },
      {
        skill: "Git Workflow",
        level: "medium",
        suggestion:
          "Contribute to open source projects to build collaborative coding experience.",
      },
    ],
    projects: [
      {
        name: "E-Learning Platform",
        status: "Ongoing",
        tech: ["Next.js", "Firebase", "Tailwind"],
        desc: "Adaptive learning platform with AI quiz generation.",
        score: 78,
      },
    ],
    events: [
      {
        name: "UI/UX Designathon",
        type: "Competition",
        result: "Runner-up 🥈",
        date: "Jan 2025",
        pts: 120,
      },
      {
        name: "Frontend Workshop",
        type: "Workshop",
        result: "Completed",
        date: "Nov 2024",
        pts: 60,
      },
    ],
    achievements: [
      { icon: "lucide:palette", label: "Design Award", color: "#ec4899" },
      { icon: "lucide:zap", label: "Fast Learner", color: "#eab308" },
    ],
    heatmap: generateHeatmap(45),
  },
  {
    id: 4,
    name: "Dev Sharma",
    rollNo: "21CS058",
    year: "3rd Year",
    dept: "Computer Science",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=devsharma&backgroundColor=b6e3f4",
    credits: 1120,
    rank: "#14",
    streak: 3,
    status: "at-risk",
    gpa: "7.6",
    participation: 3,
    wins: 0,
    githubStats: { commits: 54, prs: 4, stars: 9, contributions: 41 },
    leetcodeStats: {
      solved: 47,
      easy: 30,
      medium: 14,
      hard: 3,
      rank: "Top 62%",
    },
    skills: ["Python", "Cybersecurity", "Linux", "Networking"],
    bio: "Interested in ethical hacking and security research. Currently exploring penetration testing methodologies.",
    skillGaps: [
      {
        skill: "Project Completion",
        level: "low",
        suggestion:
          "Current project is Paused — completing at least one side project builds resume credibility.",
      },
      {
        skill: "Communication Skills",
        level: "low",
        suggestion:
          "Consider joining speaking/writing clubs to improve soft skills alongside technical work.",
      },
      {
        skill: "DSA",
        level: "low",
        suggestion:
          "Only 47 problems solved. Aim for 150+ before campus placements start.",
      },
    ],
    projects: [
      {
        name: "Cybersecurity Scanner",
        status: "Paused",
        tech: ["Python", "Nmap", "SQLite"],
        desc: "Automated vulnerability scanner for web applications.",
        score: 65,
      },
    ],
    events: [
      {
        name: "Capture The Flag",
        type: "Competition",
        result: "Participated",
        date: "Dec 2024",
        pts: 50,
      },
    ],
    achievements: [
      { icon: "lucide:shield", label: "Security Track", color: "#6366f1" },
    ],
    heatmap: generateHeatmap(20),
  },
  {
    id: 5,
    name: "Fatima Zahra",
    rollNo: "22CS014",
    year: "2nd Year",
    dept: "Computer Science",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=fatimazahra&backgroundColor=ffd5dc",
    credits: 860,
    rank: "#22",
    streak: 11,
    status: "active",
    gpa: "8.7",
    participation: 8,
    wins: 3,
    githubStats: { commits: 203, prs: 19, stars: 67, contributions: 175 },
    leetcodeStats: {
      solved: 143,
      easy: 68,
      medium: 60,
      hard: 15,
      rank: "Top 22%",
    },
    skills: ["NLP", "HuggingFace", "Python", "Elasticsearch", "Research"],
    bio: "ML researcher at heart. Fascinated by how machines understand human language and context.",
    skillGaps: [
      {
        skill: "MLOps / Deployment",
        level: "medium",
        suggestion:
          "Strong in model building — add Docker + FastAPI deployment skills for production readiness.",
      },
    ],
    projects: [
      {
        name: "NLP Sentiment Analyzer",
        status: "Completed",
        tech: ["Python", "HuggingFace", "Flask"],
        desc: "Real-time social media sentiment analysis dashboard.",
        score: 84,
      },
      {
        name: "Research Paper Finder",
        status: "Ongoing",
        tech: ["Elasticsearch", "React", "Python"],
        desc: "Semantic search engine for academic papers.",
        score: 79,
      },
    ],
    events: [
      {
        name: "NLP Challenge 2024",
        type: "Competition",
        result: "3rd Place 🥉",
        date: "Nov 2024",
        pts: 140,
      },
      {
        name: "Research Symposium",
        type: "Conference",
        result: "Paper Published",
        date: "Oct 2024",
        pts: 200,
      },
    ],
    achievements: [
      { icon: "lucide:file-text", label: "Published Paper", color: "#6366f1" },
      { icon: "lucide:brain", label: "NLP Specialist", color: "#8b5cf6" },
      { icon: "lucide:flame", label: "11-Day Streak", color: "#f97316" },
    ],
    heatmap: generateHeatmap(55),
  },
  {
    id: 6,
    name: "Karan Nair",
    rollNo: "21CS071",
    year: "3rd Year",
    dept: "Computer Science",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=karanair&backgroundColor=b6e3f4",
    credits: 700,
    rank: "#31",
    streak: 0,
    status: "inactive",
    gpa: "7.1",
    participation: 1,
    wins: 0,
    githubStats: { commits: 12, prs: 1, stars: 2, contributions: 9 },
    leetcodeStats: {
      solved: 18,
      easy: 14,
      medium: 4,
      hard: 0,
      rank: "Top 85%",
    },
    skills: ["Java", "SQL"],
    bio: "Currently focusing on academics. Looking to restart project work next semester.",
    skillGaps: [
      {
        skill: "DSA",
        level: "low",
        suggestion:
          "Only 18 problems solved. Start with easy arrays/strings daily — consistency is key.",
      },
      {
        skill: "Frameworks",
        level: "low",
        suggestion:
          "Learn Spring Boot or a frontend framework to expand beyond Java basics.",
      },
      {
        skill: "Projects",
        level: "low",
        suggestion:
          "No active projects. Build a simple CRUD app to kick off your portfolio.",
      },
      {
        skill: "GitHub Activity",
        level: "low",
        suggestion:
          "Only 12 commits in the last year. Aim for daily small commits to build momentum.",
      },
    ],
    projects: [],
    events: [
      {
        name: "Tech Fest",
        type: "Event",
        result: "Participated",
        date: "Sep 2024",
        pts: 30,
      },
    ],
    achievements: [],
    heatmap: generateHeatmap(8),
  },
];

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const heatColors = {
  0: "#dde4f5",
  1: "#a5b4fc",
  2: "#4f46e5",
  3: "#1e1b4b",
};

export const LOG_STYLE = {
  commit: { bg: "#eff6ff", color: "#2563eb", icon: "lucide:git-commit" },
  fix: { bg: "#fef2f2", color: "#dc2626", icon: "lucide:wrench" },
  blog: { bg: "#faf5ff", color: "#7c3aed", icon: "lucide:book-open" },
  milestone: { bg: "#f0fdf4", color: "#16a34a", icon: "lucide:flag" },
  achievement: { bg: "#fffbeb", color: "#d97706", icon: "lucide:trophy" },
};

export const STATUS_COLOR = {
  active: { bg: "#f0fdf4", color: "#16a34a", label: "Active" },
  "at-risk": { bg: "#fffbeb", color: "#d97706", label: "At Risk" },
  inactive: { bg: "#fef2f2", color: "#dc2626", label: "Inactive" },
};

export const GAP_COLOR = {
  low: { bg: "#fef2f2", color: "#dc2626", label: "Critical" },
  medium: { bg: "#fffbeb", color: "#d97706", label: "Moderate" },
  high: { bg: "#f0fdf4", color: "#16a34a", label: "Good" },
};

/* ─── TeacherEvents ──────────────────────────────────────────────────── */
export const EVENTS = [
  {
    id: 1,
    title: "HackFest 2025 — AI Track",
    type: "Hosted",
    category: "Hackathon",
    status: "Completed",
    date: "Jan 15–17, 2025",
    venue: "Main Auditorium, Block A",
    organizer: "Dept. of CSE",
    participants: 142,
    maxSeats: 200,
    winners: [
      { rank: 1, name: "Riya Patel", rollNo: "21CS045", prize: "₹25,000" },
      { rank: 2, name: "Arjun Mehta", rollNo: "21CS022", prize: "₹15,000" },
      { rank: 3, name: "Fatima Zahra", rollNo: "22CS014", prize: "₹10,000" },
    ],
    tags: ["AI", "Machine Learning", "Python"],
    approvalStatus: "approved",
    engagementTrend: [12, 28, 45, 60, 80, 110, 142],
    description:
      "Inter-department AI hackathon focused on real-world problem solving using machine learning.",
    registrationsByDay: [
      8, 15, 22, 30, 38, 50, 62, 75, 88, 98, 110, 125, 135, 142,
    ],
  },
  {
    id: 2,
    title: "UI/UX Designathon 2025",
    type: "Hosted",
    category: "Competition",
    status: "Ongoing",
    date: "Feb 20–22, 2026",
    venue: "Lab Complex, Block C",
    organizer: "Design Club",
    participants: 88,
    maxSeats: 120,
    winners: [],
    tags: ["Figma", "Design Thinking", "UI/UX"],
    approvalStatus: "approved",
    engagementTrend: [5, 18, 35, 55, 72, 88],
    description:
      "A 48-hour design sprint where students tackle real product challenges.",
    registrationsByDay: [5, 12, 20, 30, 44, 56, 68, 80, 88],
  },
  {
    id: 3,
    title: "Cloud Native Bootcamp",
    type: "Hosted",
    category: "Workshop",
    status: "Upcoming",
    date: "Mar 10, 2026",
    venue: "Seminar Hall 2",
    organizer: "IEEE Student Branch",
    participants: 34,
    maxSeats: 80,
    winners: [],
    tags: ["Docker", "Kubernetes", "AWS"],
    approvalStatus: "pending",
    engagementTrend: [4, 10, 20, 34],
    description:
      "Hands-on workshop covering containerisation, orchestration and cloud deployment.",
    registrationsByDay: [4, 8, 14, 20, 28, 34],
  },
  {
    id: 4,
    title: "Smart India Hackathon 2025",
    type: "External",
    category: "Hackathon",
    status: "Completed",
    date: "Sep 20–22, 2025",
    venue: "National Level (Remote)",
    organizer: "Govt. of India / MIC",
    participants: 24,
    maxSeats: 30,
    winners: [
      { rank: 1, name: "Arjun Mehta", rollNo: "21CS022", prize: "₹1,00,000" },
    ],
    tags: ["National", "Problem Solving", "Technology"],
    approvalStatus: "approved",
    engagementTrend: [3, 8, 14, 20, 24],
    description:
      "India's flagship hackathon for students to solve government problem statements.",
    registrationsByDay: [3, 6, 10, 14, 18, 22, 24],
  },
  {
    id: 5,
    title: "NLP Challenge 2024",
    type: "External",
    category: "Competition",
    status: "Completed",
    date: "Nov 10, 2024",
    venue: "IIT Madras (Online)",
    organizer: "IIT Madras AI Lab",
    participants: 11,
    maxSeats: 20,
    winners: [
      {
        rank: 3,
        name: "Fatima Zahra",
        rollNo: "22CS014",
        prize: "Certificate + ₹5,000",
      },
    ],
    tags: ["NLP", "Python", "HuggingFace"],
    approvalStatus: "approved",
    engagementTrend: [2, 5, 8, 11],
    description:
      "Natural language processing competition open to undergraduate students.",
    registrationsByDay: [2, 4, 7, 9, 11],
  },
  {
    id: 6,
    title: "Open Source Sprint — GSSoC",
    type: "External",
    category: "Open Source",
    status: "Upcoming",
    date: "Apr 1 – Jun 30, 2026",
    venue: "Online",
    organizer: "GirlScript Foundation",
    participants: 6,
    maxSeats: 50,
    winners: [],
    tags: ["Open Source", "GitHub", "Community"],
    approvalStatus: "approved",
    engagementTrend: [1, 3, 6],
    description:
      "Summer open-source program where students contribute to real-world repositories.",
    registrationsByDay: [1, 2, 4, 6],
  },
  {
    id: 7,
    title: "Blockchain Dev Bootcamp",
    type: "Hosted",
    category: "Workshop",
    status: "Upcoming",
    date: "Mar 25, 2026",
    venue: "Seminar Hall 1",
    organizer: "Crypto & Web3 Club",
    participants: 19,
    maxSeats: 60,
    winners: [],
    tags: ["Solidity", "Web3", "Ethereum"],
    approvalStatus: "rejected",
    engagementTrend: [4, 10, 16, 19],
    description:
      "Introductory bootcamp on smart contract development using Solidity.",
    registrationsByDay: [2, 5, 10, 15, 19],
  },
];

export const STATUS_META = {
  Upcoming: { bg: "#eff6ff", color: "#2563eb", dot: "#3b82f6" },
  Ongoing: { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  Completed: { bg: "#f8fafc", color: "#64748b", dot: "#94a3b8" },
};

export const APPROVAL_META = {
  approved: {
    bg: "#f0fdf4",
    color: "#16a34a",
    icon: "lucide:check-circle-2",
    label: "Approved",
  },
  pending: {
    bg: "#fffbeb",
    color: "#d97706",
    icon: "lucide:clock",
    label: "Pending",
  },
  rejected: {
    bg: "#fef2f2",
    color: "#dc2626",
    icon: "lucide:x-circle",
    label: "Rejected",
  },
};

export const TYPE_META = {
  Hosted: { bg: "#eff6ff", color: "#4338ca", icon: "lucide:building-2" },
  External: { bg: "#faf5ff", color: "#7c3aed", icon: "lucide:globe" },
};

export const TREND_COLORS = ["#dde4f5", "#a5b4fc", "#4f46e5", "#1e1b4b"];

/* ─── VerifiedAchievements ───────────────────────────────────────────── */
export const VERIFIED_WINS = [
  {
    id: 1,
    studentName: "Arjun Kumar",
    rollNo: "CS2081042",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=arjunkumar&backgroundColor=b6e3f4",
    department: "CSE",
    hostCollege: "IIT Madras",
    eventName: "Shaastra Hackathon",
    position: "Gold",
    date: "12 Oct 2023",
    status: "verified",
  },
  {
    id: 2,
    studentName: "Priya Sharma",
    rollNo: "EC2081021",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=priyasharma&backgroundColor=ffd5dc",
    department: "ECE",
    hostCollege: "NIT Trichy",
    eventName: "Pragyan Robotics",
    position: "Silver",
    date: "08 Oct 2023",
    status: "verified",
  },
  {
    id: 3,
    studentName: "Rahul Menon",
    rollNo: "ME2081055",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=rahulmenon&backgroundColor=c0aede",
    department: "MECH",
    hostCollege: "BITS Pilani",
    eventName: "APOGEE CAD Design",
    position: "Bronze",
    date: "05 Oct 2023",
    status: "verified",
  },
  {
    id: 4,
    studentName: "Sneha Reddy",
    rollNo: "IT2081012",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=snehareddy&backgroundColor=ffd5dc",
    department: "IT",
    hostCollege: "VIT Vellore",
    eventName: "GraViTas Coding",
    position: "Gold",
    date: "28 Sep 2023",
    status: "verified",
  },
  {
    id: 5,
    studentName: "Karthik Raj",
    rollNo: "CE2081088",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=karthikraj&backgroundColor=b6e3f4",
    department: "CIVIL",
    hostCollege: "Anna University",
    eventName: "Kurukshetra Bridge",
    position: "Silver",
    date: "22 Sep 2023",
    status: "verified",
  },
  {
    id: 6,
    studentName: "Riya Patel",
    rollNo: "21CS045",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=riyapatel&backgroundColor=ffd5dc",
    department: "CSE",
    hostCollege: "IIT Madras",
    eventName: "Shaastra AI Challenge",
    position: "Gold",
    date: "15 Jan 2025",
    status: "verified",
  },
  {
    id: 7,
    studentName: "Arjun Mehta",
    rollNo: "21CS022",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=arjunmehta2&backgroundColor=b6e3f4",
    department: "CSE",
    hostCollege: "Govt. of India",
    eventName: "Smart India Hackathon",
    position: "Gold",
    date: "22 Sep 2025",
    status: "verified",
  },
  {
    id: 8,
    studentName: "Fatima Zahra",
    rollNo: "22CS014",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=fatimazahra&backgroundColor=ffd5dc",
    department: "CSE",
    hostCollege: "IIT Madras",
    eventName: "NLP Challenge 2024",
    position: "Bronze",
    date: "10 Nov 2024",
    status: "verified",
  },
  {
    id: 9,
    studentName: "Dev Sharma",
    rollNo: "21CS058",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=devsharma&backgroundColor=b6e3f4",
    department: "CSE",
    hostCollege: "IISc Bangalore",
    eventName: "CTF Open 2024",
    position: "Silver",
    date: "14 Dec 2024",
    status: "flagged",
  },
  {
    id: 10,
    studentName: "Sneha Krishnan",
    rollNo: "22CS031",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=snehakrishnan&backgroundColor=c0aede",
    department: "CSE",
    hostCollege: "VIT Vellore",
    eventName: "GraViTas UI/UX Sprint",
    position: "Silver",
    date: "20 Jan 2025",
    status: "verified",
  },
  {
    id: 11,
    studentName: "Meera Nair",
    rollNo: "EE2081034",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=meeranair&backgroundColor=c0aede",
    department: "EEE",
    hostCollege: "NIT Calicut",
    eventName: "Tathva Circuit Design",
    position: "Gold",
    date: "18 Sep 2023",
    status: "verified",
  },
  {
    id: 12,
    studentName: "Vikram Singh",
    rollNo: "CS2081097",
    avatar:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=vikramsingh&backgroundColor=b6e3f4",
    department: "CSE",
    hostCollege: "IIT Bombay",
    eventName: "Techfest AI Sprint",
    position: "Bronze",
    date: "04 Jan 2024",
    status: "flagged",
  },
];

export const VERIFIED_STATS = {
  totalVerifiedWins: 1248,
  winsThisMonth: 156,
  externalCollegeWins: 892,
  pendingFlags: 14,
};

export const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026"];

/* ─── SkillIntelligence ──────────────────────────────────────────────── */
export const summaryInsights = {
  strongestSkill: "DSA",
  weakestSkill: "Core Engineering",
  mostImprovedDepartment: "CSE",
  engagementScore: 78,
};

export const heatmapData = [
  { department: "CSE", DSA: 80, Web: 70, AI: 75, Core: 60 },
  { department: "AIDS", DSA: 65, Web: 72, AI: 82, Core: 55 },
  { department: "AIML", DSA: 60, Web: 68, AI: 90, Core: 50 },
  { department: "ECE", DSA: 72, Web: 55, AI: 65, Core: 78 },
  { department: "MECH", DSA: 48, Web: 42, AI: 55, Core: 85 },
];

export const SKILL_COLUMNS = ["DSA", "Web", "AI", "Core"];

export const weakSkillData = [
  {
    department: "AIML",
    skill: "Core Engineering",
    performance: 50,
    risk: "High",
    students: 38,
  },
  {
    department: "AIDS",
    skill: "DSA",
    performance: 65,
    risk: "Medium",
    students: 29,
  },
  {
    department: "MECH",
    skill: "DSA",
    performance: 48,
    risk: "High",
    students: 44,
  },
  {
    department: "ECE",
    skill: "Web Development",
    performance: 55,
    risk: "Medium",
    students: 31,
  },
];

export const yearlyComparisonData = [
  { month: "Jan", currentYear: 120, previousYear: 90 },
  { month: "Feb", currentYear: 150, previousYear: 100 },
  { month: "Mar", currentYear: 210, previousYear: 160 },
  { month: "Apr", currentYear: 195, previousYear: 142 },
  { month: "May", currentYear: 260, previousYear: 185 },
  { month: "Jun", currentYear: 310, previousYear: 220 },
];

export const recommendations = [
  {
    id: 1,
    title: "Conduct DSA Bootcamp",
    reason: "Low DSA engagement in AIDS and MECH departments — below 65%",
    priority: "High",
    icon: "lucide:cpu",
    dept: "AIDS, MECH",
  },
  {
    id: 2,
    title: "Organise Core Engineering Workshop",
    reason: "Core engineering performance below 60% in AIML",
    priority: "Medium",
    icon: "lucide:wrench",
    dept: "AIML",
  },
  {
    id: 3,
    title: "AI Fundamentals Crash Course",
    reason: "CSE AI scores are strong but ECE and MECH lag behind",
    priority: "Medium",
    icon: "lucide:brain",
    dept: "ECE, MECH",
  },
  {
    id: 4,
    title: "Web Dev Study Circle",
    reason: "MECH Web score at 42% — lowest across all departments",
    priority: "High",
    icon: "lucide:globe",
    dept: "MECH",
  },
];

export const SKILL_LABELS = {
  DSA: "DSA",
  Web: "Web Development",
  AI: "Artificial Intelligence",
  Core: "Core Engineering",
};

export const RISK_META = {
  High: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  Medium: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Low: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
};

export const PRIORITY_META = {
  High: { bg: "#fef2f2", color: "#dc2626" },
  Medium: { bg: "#fffbeb", color: "#d97706" },
  Low: { bg: "#f0fdf4", color: "#16a34a" },
};
