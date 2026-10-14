import { createContext, useContext, useState, useEffect } from "react";

// ===== CENTRALIZED DUMMY EVENT DATA =====
// All event data based on CreateEventPage form structure
const INITIAL_EVENTS = [
  {
    id: "evt-001",
    // Basic Info
    title: "National AI Innovation Hackathon",
    eventType: "Hackathon",
    category: "naac_criterion_3",
    mode: "offline",
    // Dates
    startDate: "2026-03-12",
    endDate: "2026-03-14",
    registrationDeadline: "2026-03-10",
    // Location
    venue: "IIT Delhi Campus, New Delhi",
    platformLink: "",
    // Organizer
    collegeName: "IIT Delhi",
    college: "IIT Delhi",
    organizer: "IIT Delhi",
    institutionCode: "IITD-2024",
    naacGrade: "A++",
    hostingDepartment: "Computer Science & Engineering",
    coordinatorName: "Dr. Rajesh Kumar",
    officialEmail: "events@iitd.ac.in",
    contactPhone: "+91 9876543210",
    isInternal: false,
    // Participation
    eventLevel: "national",
    minParticipatingInstitutions: 10,
    expectedParticipants: 200,
    maxParticipants: 200,
    totalParticipants: 158,
    seats: 42,
    totalSeats: 200,
    maxTeamSize: 4,
    minTeamSize: 2,
    eligibleYears: ["2nd Year", "3rd Year", "4th Year"],
    eligibleDepartments: ["CSE", "IT", "ECE", "AIDS", "AIML"],
    registrationFee: 500,
    // Accreditation
    skillDomains: ["Artificial Intelligence", "Machine Learning"],
    sdgGoals: [
      "SDG 9: Industry, Innovation & Infrastructure",
      "SDG 4: Quality Education",
    ],
    domain: "Artificial Intelligence",
    // Winners & Prizes
    winnerSlots: [
      {
        rank: "1st Place",
        prizeType: "Cash",
        prizeValue: "100000",
        description: "Winner",
      },
      {
        rank: "2nd Place",
        prizeType: "Cash",
        prizeValue: "50000",
        description: "Runner Up",
      },
      {
        rank: "3rd Place",
        prizeType: "Cash",
        prizeValue: "25000",
        description: "Second Runner Up",
      },
    ],
    prizes: [
      { position: "1st", amount: "100000", type: "Cash" },
      { position: "2nd", amount: "50000", type: "Cash" },
      { position: "3rd", amount: "25000", type: "Cash" },
    ],
    specialCategories: [],
    judgingCriteria: [
      "Innovation",
      "Technical Implementation",
      "Business Viability",
      "Presentation",
    ],
    juryPanelNames: ["Dr. Amit Shah", "Prof. Neha Gupta", "Mr. Vikram Singh"],
    // Additional
    description:
      "A national level AI hackathon bringing together the brightest minds to solve real-world problems using artificial intelligence and machine learning.",
    rules: [
      "Team size: 2-4 members",
      "Original work only",
      "All code must be written during the event",
    ],
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    tags: ["Artificial Intelligence", "Machine Learning", "Python", "National"],
    status: "upcoming",
    createdAt: "2026-01-15",
    // Registration tracking
    registeredTeamsFromCollege: [
      {
        id: "t1",
        name: "AI Pioneers",
        members: ["Rahul S.", "Priya K.", "Amit V."],
        status: "registered",
      },
      {
        id: "t2",
        name: "Neural Ninjas",
        members: ["Kiran M.", "Neha P."],
        status: "registered",
      },
    ],
    winnersFromCollege: [],
  },
  {
    id: "evt-002",
    title: "Full Stack Web Development Bootcamp",
    eventType: "Bootcamp",
    category: "technical_skill",
    mode: "hybrid",
    startDate: "2026-04-05",
    endDate: "2026-04-10",
    registrationDeadline: "2026-04-01",
    venue: "BITS Pilani Campus & Online",
    platformLink: "https://meet.google.com/bootcamp",
    collegeName: "BITS Pilani",
    college: "BITS Pilani",
    organizer: "BITS Pilani",
    institutionCode: "BITS-2024",
    naacGrade: "A+",
    hostingDepartment: "Information Technology",
    coordinatorName: "Prof. Sunita Sharma",
    officialEmail: "bootcamp@bits.ac.in",
    contactPhone: "+91 9876543211",
    isInternal: false,
    eventLevel: "inter_college",
    minParticipatingInstitutions: 5,
    expectedParticipants: 150,
    maxParticipants: 150,
    totalParticipants: 30,
    seats: 120,
    totalSeats: 150,
    maxTeamSize: 1,
    minTeamSize: 1,
    eligibleYears: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    eligibleDepartments: ["CSE", "IT", "ECE", "All Departments"],
    registrationFee: 500,
    skillDomains: ["Web Development"],
    sdgGoals: [
      "SDG 4: Quality Education",
      "SDG 8: Decent Work & Economic Growth",
    ],
    domain: "Web Development",
    winnerSlots: [],
    prizes: [],
    specialCategories: [],
    judgingCriteria: [],
    juryPanelNames: [],
    description:
      "5-day intensive bootcamp covering React, Node.js, MongoDB, and modern web development practices with hands-on projects.",
    rules: ["Laptop required", "Basic programming knowledge preferred"],
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Node.js", "Web Development", "Beginner Friendly"],
    status: "upcoming",
    createdAt: "2026-02-01",
    registeredTeamsFromCollege: [],
    winnersFromCollege: [],
  },
  {
    id: "evt-003",
    title: "IoT Innovation Summit",
    eventType: "Technical Symposium",
    category: "naac_criterion_3",
    mode: "offline",
    startDate: "2026-03-28",
    endDate: "2026-03-28",
    registrationDeadline: "2026-03-25",
    venue: "Anna University Auditorium, Chennai",
    platformLink: "",
    collegeName: "Anna University",
    college: "Anna University",
    organizer: "Anna University",
    institutionCode: "AU-2024",
    naacGrade: "A++",
    hostingDepartment: "Electronics & Communication",
    coordinatorName: "Dr. Kumaran S.",
    officialEmail: "iot@annauniv.edu",
    contactPhone: "+91 9876543212",
    isInternal: false,
    eventLevel: "state",
    minParticipatingInstitutions: 5,
    expectedParticipants: 100,
    maxParticipants: 100,
    totalParticipants: 95,
    seats: 5,
    totalSeats: 100,
    maxTeamSize: 1,
    minTeamSize: 1,
    eligibleYears: ["2nd Year", "3rd Year", "4th Year"],
    eligibleDepartments: ["ECE", "EEE", "CSE", "IT"],
    registrationFee: 500,
    skillDomains: ["IoT", "Cloud Computing"],
    sdgGoals: [
      "SDG 9: Industry, Innovation & Infrastructure",
      "SDG 11: Sustainable Cities",
    ],
    domain: "IoT",
    winnerSlots: [],
    prizes: [],
    specialCategories: [],
    judgingCriteria: [],
    juryPanelNames: ["Dr. Senthil Kumar", "Prof. Lakshmi Priya"],
    description:
      "Explore the future of IoT in agriculture, smart cities, and industrial automation with industry experts.",
    rules: ["ID card mandatory", "Certificate will be provided"],
    image:
      "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80",
    tags: ["IoT", "Smart Cities", "Industry 4.0", "State Level"],
    status: "upcoming",
    createdAt: "2026-02-10",
    registeredTeamsFromCollege: [],
    winnersFromCollege: [],
  },
  {
    id: "evt-004",
    title: "Inter-College Robotics Championship",
    eventType: "Competition",
    category: "naac_criterion_5",
    mode: "offline",
    startDate: "2026-04-15",
    endDate: "2026-04-17",
    registrationDeadline: "2026-04-10",
    venue: "NIT Trichy Campus",
    platformLink: "",
    collegeName: "NIT Trichy",
    college: "NIT Trichy",
    organizer: "NIT Trichy",
    institutionCode: "NITT-2024",
    naacGrade: "A++",
    hostingDepartment: "Mechanical Engineering",
    coordinatorName: "Prof. Arun Kumar",
    officialEmail: "robotics@nitt.edu",
    contactPhone: "+91 9876543213",
    isInternal: false,
    eventLevel: "inter_college",
    minParticipatingInstitutions: 8,
    expectedParticipants: 80,
    maxParticipants: 80,
    totalParticipants: 80,
    seats: 0,
    totalSeats: 80,
    maxTeamSize: 5,
    minTeamSize: 3,
    eligibleYears: ["2nd Year", "3rd Year", "4th Year"],
    eligibleDepartments: ["MECH", "ECE", "EEE", "CSE"],
    registrationFee: 1000,
    skillDomains: ["Core Engineering", "IoT"],
    sdgGoals: ["SDG 9: Industry, Innovation & Infrastructure"],
    domain: "Robotics",
    winnerSlots: [
      {
        rank: "1st Place",
        prizeType: "Cash",
        prizeValue: "75000",
        description: "Champion",
      },
      {
        rank: "2nd Place",
        prizeType: "Cash",
        prizeValue: "40000",
        description: "Runner Up",
      },
      {
        rank: "3rd Place",
        prizeType: "Cash",
        prizeValue: "20000",
        description: "Second Runner Up",
      },
    ],
    prizes: [
      { position: "1st", amount: "75000", type: "Cash" },
      { position: "2nd", amount: "40000", type: "Cash" },
      { position: "3rd", amount: "20000", type: "Cash" },
    ],
    specialCategories: ["Best Design Award", "Innovation Award"],
    judgingCriteria: ["Design", "Functionality", "Innovation", "Presentation"],
    juryPanelNames: ["Dr. Raghav M.", "Prof. Deepa S.", "Mr. Karthik R."],
    description:
      "Build and compete with autonomous robots in various challenging tasks including line following, obstacle avoidance, and sumo battles.",
    rules: [
      "Robot dimensions: max 30x30x30 cm",
      "Weight limit: 3kg",
      "No remote control allowed",
    ],
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    tags: ["Robotics", "Engineering", "Hardware", "Competition"],
    status: "closed",
    createdAt: "2026-01-20",
    registeredTeamsFromCollege: [
      {
        id: "t3",
        name: "RoboWarriors",
        members: ["Ravi R.", "Anjali S.", "Vikram B.", "Maya L."],
        status: "won",
        prize: "2nd Place",
        prizeAmount: 40000,
      },
    ],
    winnersFromCollege: [
      {
        teamName: "RoboMasters",
        projectTitle: "Autonomous Line Follower Pro",
        prize: "1st Place",
        prizeAmount: 75000,
        members: ["Arjun K.", "Lakshmi R.", "Sanjay M."],
      },
      {
        teamName: "RoboWarriors",
        projectTitle: "Obstacle Navigator Bot",
        prize: "2nd Place",
        prizeAmount: 40000,
        members: ["Ravi R.", "Anjali S.", "Vikram B.", "Maya L."],
      },
      {
        teamName: "Circuit Breakers",
        projectTitle: "Sumo Battle Champion",
        prize: "3rd Place",
        prizeAmount: 20000,
        members: ["Ravi T.", "Neha K."],
      },
    ],
  },
  {
    id: "evt-005",
    title: "Blockchain & Web3 Workshop",
    eventType: "Workshop",
    category: "technical_skill",
    mode: "online",
    startDate: "2026-03-20",
    endDate: "2026-03-20",
    registrationDeadline: "2026-03-19",
    venue: "Online",
    platformLink: "https://zoom.us/blockchain-workshop",
    collegeName: "IIIT Hyderabad",
    college: "IIIT Hyderabad",
    organizer: "IIIT Hyderabad",
    institutionCode: "IIITH-2024",
    naacGrade: "A+",
    hostingDepartment: "Computer Science",
    coordinatorName: "Dr. Venkat Rao",
    officialEmail: "blockchain@iiit.ac.in",
    contactPhone: "+91 9876543214",
    isInternal: false,
    eventLevel: "national",
    minParticipatingInstitutions: 15,
    expectedParticipants: 500,
    maxParticipants: null,
    totalParticipants: 450,
    seats: null,
    totalSeats: null,
    maxTeamSize: 1,
    minTeamSize: 1,
    eligibleYears: ["All Years"],
    eligibleDepartments: ["All Departments"],
    registrationFee: 0,
    skillDomains: ["Blockchain"],
    sdgGoals: [
      "SDG 8: Decent Work & Economic Growth",
      "SDG 9: Industry, Innovation & Infrastructure",
    ],
    domain: "Blockchain",
    winnerSlots: [],
    prizes: [],
    specialCategories: [],
    judgingCriteria: [],
    juryPanelNames: [],
    description:
      "Learn the fundamentals of blockchain technology, smart contracts, and how Web3 is transforming enterprise solutions.",
    rules: ["Stable internet connection required", "No prerequisites"],
    image:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=800&q=80",
    tags: ["Blockchain", "Web3", "Smart Contracts", "Online"],
    status: "upcoming",
    createdAt: "2026-02-15",
    registeredTeamsFromCollege: [],
    winnersFromCollege: [],
  },
  {
    id: "evt-006",
    title: "UI/UX Design Masterclass",
    eventType: "Workshop",
    category: "technical_skill",
    mode: "offline",
    startDate: "2026-04-20",
    endDate: "2026-04-22",
    registrationDeadline: "2026-04-15",
    venue: "NID Ahmedabad Campus",
    platformLink: "",
    collegeName: "NID Ahmedabad",
    college: "NID Ahmedabad",
    organizer: "NID Ahmedabad",
    institutionCode: "NID-2024",
    naacGrade: "A+",
    hostingDepartment: "Design",
    coordinatorName: "Prof. Meera Shah",
    officialEmail: "design@nid.edu",
    contactPhone: "+91 9876543215",
    isInternal: false,
    eventLevel: "national",
    minParticipatingInstitutions: 10,
    expectedParticipants: 50,
    maxParticipants: 50,
    totalParticipants: 35,
    seats: 15,
    totalSeats: 50,
    maxTeamSize: 1,
    minTeamSize: 1,
    eligibleYears: ["2nd Year", "3rd Year", "4th Year"],
    eligibleDepartments: ["CSE", "IT", "All Departments"],
    registrationFee: 2000,
    skillDomains: ["Design Thinking", "Soft Skills"],
    sdgGoals: [
      "SDG 4: Quality Education",
      "SDG 9: Industry, Innovation & Infrastructure",
    ],
    domain: "Design Thinking",
    winnerSlots: [],
    prizes: [],
    specialCategories: [],
    judgingCriteria: [],
    juryPanelNames: ["Ms. Ananya Patel", "Mr. Rohan Desai"],
    description:
      "Master UI/UX design principles with hands-on projects using Figma, user research methodologies, and design systems.",
    rules: ["Laptop with Figma installed", "Basic design knowledge helpful"],
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    tags: ["UI/UX", "Figma", "Design", "Workshop"],
    status: "upcoming",
    createdAt: "2026-02-20",
    registeredTeamsFromCollege: [],
    winnersFromCollege: [],
  },
  {
    id: "evt-007",
    title: "National Coding Championship 2026",
    eventType: "Coding Contest",
    category: "naac_criterion_5",
    mode: "online",
    startDate: "2026-05-10",
    endDate: "2026-05-12",
    registrationDeadline: "2026-05-05",
    venue: "Online (HackerRank Platform)",
    platformLink: "https://hackerrank.com/ncc-2026",
    collegeName: "IIT Bombay",
    college: "IIT Bombay",
    organizer: "IIT Bombay",
    institutionCode: "IITB-2024",
    naacGrade: "A++",
    hostingDepartment: "Computer Science",
    coordinatorName: "Prof. Sanjay Deshmukh",
    officialEmail: "coding@iitb.ac.in",
    contactPhone: "+91 9876543216",
    isInternal: false,
    eventLevel: "national",
    minParticipatingInstitutions: 20,
    expectedParticipants: 2500,
    maxParticipants: 5000,
    totalParticipants: 0,
    seats: 5000,
    totalSeats: 5000,
    maxTeamSize: 3,
    minTeamSize: 1,
    eligibleYears: ["All Years"],
    eligibleDepartments: ["All Departments"],
    registrationFee: 0,
    skillDomains: ["Data Structures & Algorithms"],
    sdgGoals: [
      "SDG 4: Quality Education",
      "SDG 8: Decent Work & Economic Growth",
    ],
    domain: "Competitive Programming",
    winnerSlots: [
      {
        rank: "1st Place",
        prizeType: "Cash",
        prizeValue: "100000",
        description: "Champion",
      },
      {
        rank: "2nd Place",
        prizeType: "Cash",
        prizeValue: "50000",
        description: "Runner Up",
      },
      {
        rank: "3rd Place",
        prizeType: "Cash",
        prizeValue: "25000",
        description: "Second Runner Up",
      },
      {
        rank: "Top 10",
        prizeType: "Internship",
        prizeValue: "",
        description: "Internship Opportunities",
      },
    ],
    prizes: [
      { position: "1st", amount: "100000", type: "Cash" },
      { position: "2nd", amount: "50000", type: "Cash" },
      { position: "3rd", amount: "25000", type: "Cash" },
    ],
    specialCategories: ["Best Freshman", "Best Women Coder"],
    judgingCriteria: [
      "Time Complexity",
      "Space Complexity",
      "Code Quality",
      "Problem Solving",
    ],
    juryPanelNames: [],
    description:
      "India's premier coding competition. Solve algorithmic challenges and compete with the best coders across the nation.",
    rules: [
      "Individual or team participation",
      "No plagiarism",
      "Time-bound challenges",
    ],
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    tags: ["Coding", "DSA", "Competitive Programming", "National"],
    status: "pending",
    createdAt: "2026-02-20",
    registeredTeamsFromCollege: [],
    winnersFromCollege: [],
  },
  {
    id: "evt-008",
    title: "AI/ML Research Symposium",
    eventType: "Paper Presentation",
    category: "naac_criterion_3",
    mode: "hybrid",
    startDate: "2026-04-25",
    endDate: "2026-04-26",
    registrationDeadline: "2026-04-15",
    venue: "IISc Bangalore & Online",
    platformLink: "https://meet.google.com/iisc-symposium",
    collegeName: "IISc Bangalore",
    college: "IISc Bangalore",
    organizer: "IISc Bangalore",
    institutionCode: "IISc-2024",
    naacGrade: "A++",
    hostingDepartment: "Computational & Data Sciences",
    coordinatorName: "Prof. Ashwin Kumar",
    officialEmail: "aiml@iisc.ac.in",
    contactPhone: "+91 9876543217",
    isInternal: false,
    eventLevel: "international",
    minParticipatingInstitutions: 25,
    expectedParticipants: 300,
    maxParticipants: 300,
    totalParticipants: 120,
    seats: 180,
    totalSeats: 300,
    maxTeamSize: 3,
    minTeamSize: 1,
    eligibleYears: ["3rd Year", "4th Year"],
    eligibleDepartments: ["CSE", "IT", "AIDS", "AIML", "ECE"],
    registrationFee: 1500,
    skillDomains: ["Artificial Intelligence", "Machine Learning"],
    sdgGoals: [
      "SDG 4: Quality Education",
      "SDG 9: Industry, Innovation & Infrastructure",
    ],
    domain: "Machine Learning",
    winnerSlots: [
      {
        rank: "Best Paper",
        prizeType: "Cash",
        prizeValue: "50000",
        description: "Best Research Paper",
      },
      {
        rank: "Best Poster",
        prizeType: "Certificate",
        prizeValue: "",
        description: "Best Poster Presentation",
      },
    ],
    prizes: [{ position: "Best Paper", amount: "50000", type: "Cash" }],
    specialCategories: ["Best Student Paper", "Best Industry Application"],
    judgingCriteria: [
      "Novelty",
      "Technical Depth",
      "Presentation",
      "Potential Impact",
    ],
    juryPanelNames: [
      "Dr. Partha Pratim",
      "Prof. Sunita Rao",
      "Dr. Michael Chen",
    ],
    description:
      "Present your AI/ML research papers at India's premier academic symposium with participation from global researchers.",
    rules: ["Paper format: IEEE", "Max 8 pages", "Original unpublished work"],
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    tags: ["Research", "AI", "ML", "Paper Presentation", "International"],
    status: "upcoming",
    createdAt: "2026-01-25",
    registeredTeamsFromCollege: [
      {
        id: "t4",
        name: "Research Team Alpha",
        members: ["Dr. Priya S.", "Rahul M."],
        status: "registered",
      },
    ],
    winnersFromCollege: [],
  },
  {
    id: "evt-009",
    title: "Cybersecurity CTF Challenge",
    eventType: "Hackathon",
    category: "technical_skill",
    mode: "online",
    startDate: "2026-05-01",
    endDate: "2026-05-02",
    registrationDeadline: "2026-04-28",
    venue: "Online (Custom Platform)",
    platformLink: "https://ctf.cyberdefense.in",
    collegeName: "IIT Kanpur",
    college: "IIT Kanpur",
    organizer: "IIT Kanpur",
    institutionCode: "IITK-2024",
    naacGrade: "A++",
    hostingDepartment: "Computer Science",
    coordinatorName: "Prof. Manindra Agrawal",
    officialEmail: "ctf@iitk.ac.in",
    contactPhone: "+91 9876543218",
    isInternal: false,
    eventLevel: "national",
    minParticipatingInstitutions: 15,
    expectedParticipants: 500,
    maxParticipants: 1000,
    totalParticipants: 0,
    seats: 1000,
    totalSeats: 1000,
    maxTeamSize: 4,
    minTeamSize: 2,
    eligibleYears: ["All Years"],
    eligibleDepartments: ["CSE", "IT", "ECE"],
    registrationFee: 0,
    skillDomains: ["Cybersecurity"],
    sdgGoals: [
      "SDG 9: Industry, Innovation & Infrastructure",
      "SDG 16: Peace, Justice & Strong Institutions",
    ],
    domain: "Cybersecurity",
    winnerSlots: [
      {
        rank: "1st Place",
        prizeType: "Cash",
        prizeValue: "50000",
        description: "Champion",
      },
      {
        rank: "2nd Place",
        prizeType: "Cash",
        prizeValue: "30000",
        description: "Runner Up",
      },
      {
        rank: "3rd Place",
        prizeType: "Cash",
        prizeValue: "15000",
        description: "Second Runner Up",
      },
    ],
    prizes: [
      { position: "1st", amount: "50000", type: "Cash" },
      { position: "2nd", amount: "30000", type: "Cash" },
      { position: "3rd", amount: "15000", type: "Cash" },
    ],
    specialCategories: [],
    judgingCriteria: ["Challenges Solved", "Time Taken", "Solution Quality"],
    juryPanelNames: [],
    description:
      "Capture The Flag competition testing skills in cryptography, reverse engineering, web security, and digital forensics.",
    rules: [
      "No automated hacking tools",
      "No attacking infrastructure",
      "All activities logged",
    ],
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    tags: ["Cybersecurity", "CTF", "Hacking", "Security"],
    status: "pending",
    createdAt: "2026-02-22",
    registeredTeamsFromCollege: [],
    winnersFromCollege: [],
  },
  {
    id: "evt-010",
    title: "Startup Pitch Competition",
    eventType: "Innovation Challenge",
    category: "entrepreneurship",
    mode: "offline",
    startDate: "2026-05-15",
    endDate: "2026-05-16",
    registrationDeadline: "2026-05-10",
    venue: "T-Hub, Hyderabad",
    platformLink: "",
    collegeName: "T-Hub Foundation",
    college: "T-Hub Foundation",
    organizer: "T-Hub Foundation",
    institutionCode: "THUB-2024",
    naacGrade: "",
    hostingDepartment: "Innovation & Entrepreneurship",
    coordinatorName: "Mr. Ravi Narayan",
    officialEmail: "startups@t-hub.co",
    contactPhone: "+91 9876543219",
    isInternal: false,
    eventLevel: "national",
    minParticipatingInstitutions: 20,
    expectedParticipants: 100,
    maxParticipants: 100,
    totalParticipants: 45,
    seats: 55,
    totalSeats: 100,
    maxTeamSize: 5,
    minTeamSize: 2,
    eligibleYears: ["3rd Year", "4th Year"],
    eligibleDepartments: ["All Departments"],
    registrationFee: 500,
    skillDomains: ["Management", "Soft Skills"],
    sdgGoals: [
      "SDG 8: Decent Work & Economic Growth",
      "SDG 9: Industry, Innovation & Infrastructure",
    ],
    domain: "Entrepreneurship",
    winnerSlots: [
      {
        rank: "1st Place",
        prizeType: "Cash",
        prizeValue: "500000",
        description: "Winner - Seed Funding",
      },
      {
        rank: "2nd Place",
        prizeType: "Cash",
        prizeValue: "250000",
        description: "Runner Up",
      },
      {
        rank: "3rd Place",
        prizeType: "Cash",
        prizeValue: "100000",
        description: "Second Runner Up",
      },
    ],
    prizes: [
      { position: "1st", amount: "500000", type: "Cash" },
      { position: "2nd", amount: "250000", type: "Cash" },
      { position: "3rd", amount: "100000", type: "Cash" },
    ],
    specialCategories: [
      "Best Social Impact",
      "Most Innovative",
      "Best Tech Solution",
    ],
    judgingCriteria: [
      "Business Model",
      "Market Potential",
      "Team Capability",
      "Pitch Quality",
    ],
    juryPanelNames: [
      "Mr. Kunal Shah",
      "Ms. Falguni Nayar",
      "Mr. Bhavish Aggarwal",
    ],
    description:
      "Pitch your startup idea to top VCs and angel investors. Winners receive seed funding and incubation support.",
    rules: ["MVP required", "5-minute pitch", "Q&A session"],
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    tags: ["Startup", "Entrepreneurship", "Pitch", "Funding"],
    status: "upcoming",
    createdAt: "2026-02-18",
    registeredTeamsFromCollege: [],
    winnersFromCollege: [],
  },
];

// Admin-specific incoming events data (external events that invited our college)
const INCOMING_EVENTS = [
  {
    id: "inc-001",
    title: "National Coding Championship 2026",
    eventType: "Hackathon",
    organizer: "IIT Delhi",
    organizerLogo:
      "https://api.dicebear.com/9.x/initials/svg?seed=IIT&backgroundColor=4f46e5",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    type: "Hackathon",
    domain: "Competitive Programming",
    description:
      "A national level coding competition for college students across India. Top performers get internship opportunities at leading tech companies.",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    registrationDeadline: "2026-04-05",
    venue: "Online",
    mode: "online",
    maxTeamSize: 3,
    minTeamSize: 1,
    registrationFee: 0,
    prizes: [
      { position: "1st", amount: "100000" },
      { position: "2nd", amount: "50000" },
      { position: "3rd", amount: "25000" },
    ],
    externalRegistrations: 2500,
    invitedAt: "2026-03-01",
    status: "pending",
    collegeSettings: null,
  },
  {
    id: "inc-002",
    title: "Tech Startup Summit 2026",
    eventType: "Conference",
    organizer: "BITS Pilani",
    organizerLogo:
      "https://api.dicebear.com/9.x/initials/svg?seed=BP&backgroundColor=8b5cf6",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    type: "Conference",
    domain: "Entrepreneurship",
    description:
      "Join India's biggest tech startup summit featuring keynotes from industry leaders, networking sessions, and startup pitch competitions.",
    startDate: "2026-04-25",
    endDate: "2026-04-27",
    registrationDeadline: "2026-04-20",
    venue: "BITS Pilani Campus",
    mode: "offline",
    maxTeamSize: 1,
    minTeamSize: 1,
    registrationFee: 500,
    prizes: [],
    externalRegistrations: 1800,
    invitedAt: "2026-02-15",
    status: "approved",
    collegeSettings: {
      eligibleYears: ["3rd Year", "4th Year"],
      eligibleDepartments: ["CSE", "ECE", "IT", "AIDS"],
      maxParticipants: 25,
      requiresMentorApproval: true,
      approvedAt: "2026-02-20",
    },
  },
  {
    id: "inc-003",
    title: "AI/ML Bootcamp - Industry Ready",
    eventType: "Bootcamp",
    organizer: "IISc Bangalore",
    organizerLogo:
      "https://api.dicebear.com/9.x/initials/svg?seed=IISc&backgroundColor=22c55e",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    type: "Bootcamp",
    domain: "AI/ML",
    description:
      "5-day intensive bootcamp covering machine learning fundamentals, deep learning with PyTorch, and hands-on industry projects.",
    startDate: "2026-05-01",
    endDate: "2026-05-05",
    registrationDeadline: "2026-04-25",
    venue: "IISc Campus & Online",
    mode: "hybrid",
    maxTeamSize: 1,
    minTeamSize: 1,
    registrationFee: 2000,
    prizes: [],
    externalRegistrations: 1200,
    invitedAt: "2026-03-10",
    status: "pending",
    collegeSettings: null,
  },
  {
    id: "inc-004",
    title: "Web3 & Blockchain Hackathon",
    eventType: "Hackathon",
    organizer: "NIT Trichy",
    organizerLogo:
      "https://api.dicebear.com/9.x/initials/svg?seed=NITT&backgroundColor=f59e0b",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
    type: "Hackathon",
    domain: "Blockchain",
    description:
      "Build decentralized applications on Ethereum and Solana. Industry mentors and Web3 experts will guide participants.",
    startDate: "2026-05-15",
    endDate: "2026-05-17",
    registrationDeadline: "2026-05-10",
    venue: "NIT Trichy Campus",
    mode: "offline",
    maxTeamSize: 4,
    minTeamSize: 2,
    registrationFee: 200,
    prizes: [
      { position: "1st", amount: "50000" },
      { position: "2nd", amount: "30000" },
      { position: "3rd", amount: "15000" },
    ],
    externalRegistrations: 680,
    invitedAt: "2026-03-05",
    status: "rejected",
    collegeSettings: null,
    rejectedAt: "2026-03-08",
    rejectionReason: "Timeline conflicts with our annual fest",
  },
  {
    id: "inc-005",
    title: "Cybersecurity CTF Challenge",
    eventType: "Competition",
    organizer: "IIIT Hyderabad",
    organizerLogo:
      "https://api.dicebear.com/9.x/initials/svg?seed=IIITH&backgroundColor=ec4899",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    type: "Competition",
    domain: "Cybersecurity",
    description:
      "Capture The Flag competition testing skills in cryptography, reverse engineering, web security, and forensics.",
    startDate: "2026-04-20",
    endDate: "2026-04-21",
    registrationDeadline: "2026-04-15",
    venue: "Online",
    mode: "online",
    maxTeamSize: 4,
    minTeamSize: 2,
    registrationFee: 0,
    prizes: [
      { position: "1st", amount: "75000" },
      { position: "2nd", amount: "40000" },
      { position: "3rd", amount: "20000" },
    ],
    externalRegistrations: 950,
    invitedAt: "2026-03-12",
    status: "approved",
    collegeSettings: {
      eligibleYears: ["2nd Year", "3rd Year", "4th Year"],
      eligibleDepartments: ["CSE", "IT", "AIDS", "AIML"],
      maxParticipants: 40,
      requiresMentorApproval: false,
      approvedAt: "2026-03-15",
    },
  },
];

// Sample registrations for incoming events
const SAMPLE_REGISTRATIONS = {
  "inc-002": [
    {
      id: "r-001",
      studentName: "Rahul Sharma",
      department: "CSE",
      year: 3,
      email: "rahul@college.edu",
      phone: "9876543210",
      mentorApproval: "approved",
      mentor: "Dr. Ramesh Kumar",
      registeredAt: "2026-03-01",
    },
    {
      id: "r-002",
      studentName: "Priya Menon",
      department: "IT",
      year: 4,
      email: "priya@college.edu",
      phone: "9876543211",
      mentorApproval: "pending",
      mentor: "Dr. Anita Sharma",
      registeredAt: "2026-03-02",
    },
    {
      id: "r-003",
      studentName: "Arjun Reddy",
      department: "ECE",
      year: 3,
      email: "arjun@college.edu",
      phone: "9876543212",
      mentorApproval: "approved",
      mentor: "Prof. Vijay Patel",
      registeredAt: "2026-03-03",
    },
    {
      id: "r-004",
      studentName: "Sneha Krishnan",
      department: "AIDS",
      year: 4,
      email: "sneha@college.edu",
      phone: "9876543213",
      mentorApproval: "approved",
      mentor: "Dr. Meera Rao",
      registeredAt: "2026-03-04",
    },
  ],
  "inc-005": [
    {
      id: "r-005",
      studentName: "Vikram J",
      teamName: "Byte Breakers",
      department: "CSE",
      year: 3,
      email: "vikram@college.edu",
      phone: "9876543214",
      mentorApproval: "not_required",
      registeredAt: "2026-03-16",
    },
    {
      id: "r-006",
      studentName: "Kavitha R",
      teamName: "Cyber Squad",
      department: "IT",
      year: 4,
      email: "kavitha@college.edu",
      phone: "9876543215",
      mentorApproval: "not_required",
      registeredAt: "2026-03-17",
    },
  ],
};

const EventsContext = createContext();

export function EventsProvider({ children }) {
  const [events, setEvents] = useState(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem("campusMitra_events");
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [incomingEvents, setIncomingEvents] = useState(() => {
    const saved = localStorage.getItem("campusMitra_incoming_events");
    return saved ? JSON.parse(saved) : INCOMING_EVENTS;
  });

  const [registrations] = useState(SAMPLE_REGISTRATIONS);

  // Save to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem("campusMitra_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(
      "campusMitra_incoming_events",
      JSON.stringify(incomingEvents),
    );
  }, [incomingEvents]);

  // Add a new event (from CreateEventPage)
  const addEvent = (eventData) => {
    const newEvent = {
      id: `evt-${Date.now()}`,
      ...eventData,
      // Map form fields to event structure
      title: eventData.title,
      eventType: eventData.eventType,
      category: eventData.category,
      domain: eventData.skillDomains?.[0] || "General",
      college: eventData.collegeName,
      organizer: eventData.collegeName,
      isInternal: true,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      registrationDeadline: eventData.registrationDeadline,
      venue: eventData.venue || "Online",
      mode: eventData.mode,
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      description: eventData.description,
      maxParticipants: parseInt(eventData.expectedParticipants) || 100,
      totalParticipants: 0,
      seats: parseInt(eventData.expectedParticipants) || 100,
      totalSeats: parseInt(eventData.expectedParticipants) || 100,
      maxTeamSize: eventData.maxTeamSize || 4,
      minTeamSize: eventData.minTeamSize || 1,
      registrationFee: eventData.registrationFee || 0,
      skillDomains: eventData.skillDomains || [],
      tags: [
        ...(eventData.skillDomains || []),
        eventData.eventType,
        eventData.eventLevel?.replace("_", "-"),
      ].filter(Boolean),
      eventLevel: eventData.eventLevel,
      status: "pending", // New events start as pending approval
      createdAt: new Date().toISOString().split("T")[0],
      prizes:
        eventData.winnerSlots?.map((slot) => ({
          position: slot.rank,
          amount: slot.prizeValue,
          type: slot.prizeType,
        })) || [],
      eligibleYears: eventData.eligibleYears || [],
      eligibleDepartments: eventData.eligibleDepartments || [],
      sdgGoals: eventData.sdgGoals || [],
      judgingCriteria: eventData.judgingCriteria || [],
      coordinatorName: eventData.coordinatorName,
      officialEmail: eventData.officialEmail,
      contactPhone: eventData.contactPhone,
      rules: eventData.rules || [],
    };

    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  // Update event status
  const updateEventStatus = (eventId, status) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, status } : event,
      ),
    );
  };

  // Update event
  const updateEvent = (eventId, updates) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, ...updates } : event,
      ),
    );
  };

  // Delete event
  const deleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  // Get events by status
  const getEventsByStatus = (status) => {
    return events.filter((event) => event.status === status);
  };

  // Get internal events (created by our college)
  const getInternalEvents = () => {
    return events.filter((event) => event.isInternal);
  };

  // Get external events (from other colleges)
  const getExternalEvents = () => {
    return events.filter((event) => !event.isInternal);
  };

  // Get upcoming events
  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split("T")[0];
    return events.filter(
      (event) => event.startDate >= today && event.status !== "closed",
    );
  };

  // ===== INCOMING EVENTS FUNCTIONS =====

  // Update incoming event status (approve/reject)
  const updateIncomingEventStatus = (eventId, status, settings = null) => {
    setIncomingEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              status,
              collegeSettings: settings,
              ...(status === "approved" && {
                approvedAt: new Date().toISOString().split("T")[0],
              }),
              ...(status === "rejected" && {
                rejectedAt: new Date().toISOString().split("T")[0],
              }),
            }
          : event,
      ),
    );
  };

  // Get incoming events by status
  const getIncomingEventsByStatus = (status) => {
    if (status === "all") return incomingEvents;
    return incomingEvents.filter((event) => event.status === status);
  };

  // Get registrations for an incoming event
  const getEventRegistrations = (eventId) => {
    return registrations[eventId] || [];
  };

  // Reset to default data (clears localStorage cache)
  const resetToDefaults = () => {
    localStorage.removeItem("campusMitra_events");
    localStorage.removeItem("campusMitra_incoming_events");
    setEvents(INITIAL_EVENTS);
    setIncomingEvents(INCOMING_EVENTS);
  };
  return (
    <EventsContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        updateEventStatus,
        deleteEvent,
        getEventsByStatus,
        getInternalEvents,
        getExternalEvents,
        getUpcomingEvents,
        // Incoming events
        incomingEvents,
        registrations,
        updateIncomingEventStatus,
        getIncomingEventsByStatus,
        getEventRegistrations,
        // Utility
        resetToDefaults,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}

export default EventsContext;
