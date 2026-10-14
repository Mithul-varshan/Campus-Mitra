import { useState } from "react";

/* ─── Data ──────────────────────────────────────────────────────────── */

// Inter-College Leaderboard Data - Organized by Year
const INTER_COLLEGE_DATA = {
  "Year 1": {
    top3: [
      {
        rank: 2,
        name: "Ananya Reddy",
        college: "IIT Madras",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=ananyareddy&backgroundColor=ffd5dc",
        pts: 1650,
        badge: "4 Active Projects",
        badgeIcon: "lucide:folder-kanban",
        accentColor: "#2b4ed6",
        borderColor: "#bfdbfe",
        bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
      },
      {
        rank: 1,
        name: "Karthik Menon",
        college: "BITS Pilani",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=karthikmenon&backgroundColor=b6e3f4",
        pts: 1820,
        badge: "First Year Champion",
        badgeIcon: "lucide:trophy",
        accentColor: "#d97706",
        borderColor: "#fde68a",
        bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
        crown: true,
      },
      {
        rank: 3,
        name: "Tanvi Shah",
        college: "NIT Trichy",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=tanvishah&backgroundColor=c0aede",
        pts: 1580,
        badge: "5 Projects",
        badgeIcon: "lucide:file-text",
        accentColor: "#b45309",
        borderColor: "#fed7aa",
        bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
      },
    ],
    rows: [
      {
        rank: 4,
        name: "Rohan Kapoor",
        college: "VIT Vellore",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=rohankapoor&backgroundColor=ffd5dc",
        score: 1450,
        projects: "3 Active",
        trend: "+18%",
        trendUp: true,
        isYou: false,
      },
      {
        rank: 5,
        name: "Priya Desai",
        college: "SRM University",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=priyadesai&backgroundColor=b6e3f4",
        score: 1380,
        projects: "2 Active",
        trend: "+10%",
        trendUp: true,
        isYou: false,
      },
      {
        rank: 6,
        name: "Arjun Mehta",
        college: "Anna University",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=arjunmehta&backgroundColor=b6e3f4",
        score: 1320,
        projects: "3 Active",
        trend: "+5%",
        trendUp: true,
        isYou: true,
      },
    ],
    yourRank: {
      rank: 6,
      score: 1320,
      pointsBehind: 60,
      behindName: "Priya Desai",
    },
  },
  "Year 2": {
    top3: [
      {
        rank: 2,
        name: "Priya Sharma",
        college: "IIT Bombay",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=priyasharma&backgroundColor=ffd5dc",
        pts: 2150,
        badge: "5 Active Projects",
        badgeIcon: "lucide:folder-kanban",
        accentColor: "#2b4ed6",
        borderColor: "#bfdbfe",
        bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
      },
      {
        rank: 1,
        name: "Rahul Verma",
        college: "BITS Pilani",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=rahulverma&backgroundColor=b6e3f4",
        pts: 2480,
        badge: "Hackathon Winner '24",
        badgeIcon: "lucide:trophy",
        accentColor: "#d97706",
        borderColor: "#fde68a",
        bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
        crown: true,
      },
      {
        rank: 3,
        name: "Alex Chen",
        college: "NIT Trichy",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=alexchen&backgroundColor=c0aede",
        pts: 1980,
        badge: "12 Research Papers",
        badgeIcon: "lucide:file-text",
        accentColor: "#b45309",
        borderColor: "#fed7aa",
        bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
      },
    ],
    rows: [
      {
        rank: 4,
        name: "Sara Khan",
        college: "VIT Vellore",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=sarakhan&backgroundColor=ffd5dc",
        score: 1850,
        projects: "4 Active",
        trend: "+12%",
        trendUp: true,
        isYou: false,
      },
      {
        rank: 5,
        name: "Carlos Ruiz",
        college: "SRM University",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=carlosruiz&backgroundColor=b6e3f4",
        score: 1780,
        projects: "3 Active",
        trend: "+5%",
        trendUp: true,
        isYou: false,
      },
      {
        rank: 6,
        name: "Emma Watson",
        college: "Manipal Tech",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=emmawatson&backgroundColor=ffd5dc",
        score: 1690,
        projects: "6 Active",
        trend: "-2%",
        trendUp: false,
        isYou: false,
      },
    ],
    yourRank: {
      rank: 7,
      score: 1620,
      pointsBehind: 70,
      behindName: "Emma Watson",
    },
  },
  "Year 3": {
    top3: [
      {
        rank: 2,
        name: "Sneha Iyer",
        college: "IIT Delhi",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=snehaiyer&backgroundColor=ffd5dc",
        pts: 2680,
        badge: "Research Lead",
        badgeIcon: "lucide:folder-kanban",
        accentColor: "#2b4ed6",
        borderColor: "#bfdbfe",
        bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
      },
      {
        rank: 1,
        name: "Vikram Singh",
        college: "IIT Kharagpur",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=vikramsingh2&backgroundColor=b6e3f4",
        pts: 2920,
        badge: "Innovation Award",
        badgeIcon: "lucide:trophy",
        accentColor: "#d97706",
        borderColor: "#fde68a",
        bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
        crown: true,
      },
      {
        rank: 3,
        name: "Maya Krishnan",
        college: "BITS Goa",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=mayakrishnan&backgroundColor=c0aede",
        pts: 2450,
        badge: "8 Active Projects",
        badgeIcon: "lucide:file-text",
        accentColor: "#b45309",
        borderColor: "#fed7aa",
        bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
      },
    ],
    rows: [
      {
        rank: 4,
        name: "Dev Patel",
        college: "NIT Surathkal",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=devpatel2&backgroundColor=ffd5dc",
        score: 2280,
        projects: "7 Active",
        trend: "+15%",
        trendUp: true,
        isYou: false,
      },
      {
        rank: 5,
        name: "Aisha Malik",
        college: "VIT Chennai",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=aishamalik&backgroundColor=b6e3f4",
        score: 2150,
        projects: "6 Active",
        trend: "+8%",
        trendUp: true,
        isYou: false,
      },
    ],
    yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
  },
  "Year 4": {
    top3: [
      {
        rank: 2,
        name: "Ravi Kumar",
        college: "IIT Bombay",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=ravikumar&backgroundColor=ffd5dc",
        pts: 3250,
        badge: "15 Projects",
        badgeIcon: "lucide:folder-kanban",
        accentColor: "#2b4ed6",
        borderColor: "#bfdbfe",
        bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
      },
      {
        rank: 1,
        name: "Divya Nair",
        college: "IIT Madras",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=divyanair&backgroundColor=b6e3f4",
        pts: 3580,
        badge: "Final Year Excellence",
        badgeIcon: "lucide:trophy",
        accentColor: "#d97706",
        borderColor: "#fde68a",
        bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
        crown: true,
      },
      {
        rank: 3,
        name: "Arjun Reddy",
        college: "BITS Pilani",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=arjunreddy&backgroundColor=c0aede",
        pts: 3100,
        badge: "Startup Founder",
        badgeIcon: "lucide:file-text",
        accentColor: "#b45309",
        borderColor: "#fed7aa",
        bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
      },
    ],
    rows: [
      {
        rank: 4,
        name: "Pooja Sharma",
        college: "NIT Warangal",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=poojasharma&backgroundColor=ffd5dc",
        score: 2950,
        projects: "12 Active",
        trend: "+20%",
        trendUp: true,
        isYou: false,
      },
      {
        rank: 5,
        name: "Sameer Joshi",
        college: "IIIT Hyderabad",
        avatar:
          "https://api.dicebear.com/9.x/thumbs/svg?seed=sameerjoshi&backgroundColor=b6e3f4",
        score: 2820,
        projects: "10 Active",
        trend: "+12%",
        trendUp: true,
        isYou: false,
      },
    ],
    yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
  },
};

// Intra-College Leaderboard Data - Department-wise, Year-wise, Semester-wise
const INTRA_COLLEGE_DATA = {
  CSE: {
    "Year 1": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Divya Patel",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=divyapatel&backgroundColor=c0aede",
            pts: 1720,
            badge: "6 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Aarav Singh",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=aaravsingh&backgroundColor=b6e3f4",
            pts: 1850,
            badge: "8 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Karan Gupta",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=karangupta&backgroundColor=ffd5dc",
            pts: 1590,
            badge: "5 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Neha Verma",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=nehaverma&backgroundColor=ffd5dc",
            score: 1450,
            projects: "3 Active",
            trend: "+15%",
            trendUp: true,
            isYou: false,
          },
          {
            rank: 5,
            name: "Arjun Mehta",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=arjunmehta&backgroundColor=b6e3f4",
            score: 1380,
            projects: "4 Active",
            trend: "+8%",
            trendUp: true,
            isYou: true,
          },
        ],
        yourRank: {
          rank: 5,
          score: 1380,
          pointsBehind: 70,
          behindName: "Neha Verma",
        },
      },
      "Sem 2": {
        top3: [
          {
            rank: 2,
            name: "Aarav Singh",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=aaravsingh&backgroundColor=b6e3f4",
            pts: 1820,
            badge: "7 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Divya Patel",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=divyapatel&backgroundColor=c0aede",
            pts: 1950,
            badge: "9 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Karan Gupta",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=karangupta&backgroundColor=ffd5dc",
            pts: 1680,
            badge: "6 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Arjun Mehta",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=arjunmehta&backgroundColor=b6e3f4",
            score: 1550,
            projects: "5 Active",
            trend: "+12%",
            trendUp: true,
            isYou: true,
          },
          {
            rank: 5,
            name: "Neha Verma",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=nehaverma&backgroundColor=ffd5dc",
            score: 1480,
            projects: "3 Active",
            trend: "+2%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 4, score: 1550, pointsBehind: 0, behindName: "" },
      },
    },
    "Year 2": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Ananya Roy",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=ananyaroy&backgroundColor=c0aede",
            pts: 2050,
            badge: "8 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Vijay Kumar",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=vijaykumar&backgroundColor=b6e3f4",
            pts: 2200,
            badge: "10 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Rohan Das",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=rohandas&backgroundColor=ffd5dc",
            pts: 1920,
            badge: "7 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Priya Singh",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=priyasingh&backgroundColor=ffd5dc",
            score: 1780,
            projects: "5 Active",
            trend: "+10%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
    "Year 3": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Maya Desai",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 3",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=mayadesai&backgroundColor=c0aede",
            pts: 2250,
            badge: "10 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Shreyas Nair",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 3",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=shreyasnair&backgroundColor=b6e3f4",
            pts: 2400,
            badge: "12 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Arpit Singh",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 3",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=arpitsingh&backgroundColor=ffd5dc",
            pts: 2100,
            badge: "9 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Sneha Joshi",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 3",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=snehajoshi&backgroundColor=ffd5dc",
            score: 1950,
            projects: "7 Active",
            trend: "+9%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
    "Year 4": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Riya Kapoor",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 4",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=riyakapoor&backgroundColor=c0aede",
            pts: 2500,
            badge: "12 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Dev Patel",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 4",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=devpatel&backgroundColor=b6e3f4",
            pts: 2650,
            badge: "14 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Ashok Kumar",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 4",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=ashokkumar&backgroundColor=ffd5dc",
            pts: 2350,
            badge: "11 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Priya Sharma",
            college: "IIT Bombay",
            department: "CSE",
            year: "Year 4",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=priyasharma&backgroundColor=ffd5dc",
            score: 2180,
            projects: "10 Active",
            trend: "+14%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
  },
  ECE: {
    "Year 1": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Sneha Nair",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=snehanair&backgroundColor=c0aede",
            pts: 1580,
            badge: "5 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Ravi Patel",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=ravipatel&backgroundColor=b6e3f4",
            pts: 1720,
            badge: "7 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Aditya Jain",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=adityajain&backgroundColor=ffd5dc",
            pts: 1420,
            badge: "4 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Vikram Singh",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=vikramsingh&backgroundColor=ffd5dc",
            score: 1280,
            projects: "3 Active",
            trend: "+7%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
      "Sem 2": {
        top3: [
          {
            rank: 2,
            name: "Ravi Patel",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=ravipatel&backgroundColor=b6e3f4",
            pts: 1750,
            badge: "7 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Sneha Nair",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=snehanair&backgroundColor=c0aede",
            pts: 1820,
            badge: "8 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Aditya Jain",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=adityajain&backgroundColor=ffd5dc",
            pts: 1620,
            badge: "6 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Vikram Singh",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=vikramsingh&backgroundColor=ffd5dc",
            score: 1520,
            projects: "5 Active",
            trend: "+18%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
    "Year 2": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Nitin Malhotra",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=nitinmalhotra&backgroundColor=c0aede",
            pts: 1920,
            badge: "7 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Lakshmi Iyer",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=lakshmiiyer&backgroundColor=b6e3f4",
            pts: 2080,
            badge: "9 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Prerna Shah",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=prernashah&backgroundColor=ffd5dc",
            pts: 1820,
            badge: "6 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Keshav Reddy",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=keshavreddy&backgroundColor=ffd5dc",
            score: 1680,
            projects: "5 Active",
            trend: "+10%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
    "Year 3": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Ritika Bansal",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 3",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=ritikabansal&backgroundColor=c0aede",
            pts: 2180,
            badge: "9 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Aryan Khanna",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 3",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=aryankhanna&backgroundColor=b6e3f4",
            pts: 2320,
            badge: "11 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Sahil Gupta",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 3",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=sahilgupta&backgroundColor=ffd5dc",
            pts: 2050,
            badge: "8 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Neelam Verma",
            college: "IIT Bombay",
            department: "ECE",
            year: "Year 3",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=neelamverma&backgroundColor=ffd5dc",
            score: 1920,
            projects: "7 Active",
            trend: "+11%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
  },
  Mechanical: {
    "Year 1": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Pooja Sharma",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=pojasharma&backgroundColor=c0aede",
            pts: 1520,
            badge: "5 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Harshit Verma",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=harshitverma&backgroundColor=b6e3f4",
            pts: 1650,
            badge: "6 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Sameer Khan",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=sameerkhan&backgroundColor=ffd5dc",
            pts: 1380,
            badge: "4 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Manya Singh",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=manyasingh&backgroundColor=ffd5dc",
            score: 1250,
            projects: "2 Active",
            trend: "+5%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
      "Sem 2": {
        top3: [
          {
            rank: 2,
            name: "Harshit Verma",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=harshitverma&backgroundColor=b6e3f4",
            pts: 1680,
            badge: "6 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Sameer Khan",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=sameerkhan&backgroundColor=ffd5dc",
            pts: 1720,
            badge: "7 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Pooja Sharma",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=pojasharma&backgroundColor=c0aede",
            pts: 1590,
            badge: "5 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Manya Singh",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=manyasingh&backgroundColor=ffd5dc",
            score: 1420,
            projects: "4 Active",
            trend: "+13%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
    "Year 2": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Ishita Rao",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=ishitarao&backgroundColor=c0aede",
            pts: 1950,
            badge: "7 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Karan Mehta",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=karanmehta&backgroundColor=b6e3f4",
            pts: 2100,
            badge: "9 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Manish Kumar",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=manishkumar&backgroundColor=ffd5dc",
            pts: 1820,
            badge: "6 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Tanya Desai",
            college: "IIT Bombay",
            department: "Mechanical",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=tanyadesai&backgroundColor=ffd5dc",
            score: 1680,
            projects: "5 Active",
            trend: "+11%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
  },
  Civil: {
    "Year 1": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Radhika Menon",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=radhikamenon&backgroundColor=c0aede",
            pts: 1450,
            badge: "4 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Nikhil Agarwal",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=nikhilagarwal&backgroundColor=b6e3f4",
            pts: 1580,
            badge: "5 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Suresh Yadav",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=sureshyadav&backgroundColor=ffd5dc",
            pts: 1320,
            badge: "3 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Anjali Singh",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=anjalisingh&backgroundColor=ffd5dc",
            score: 1180,
            projects: "2 Active",
            trend: "+6%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
      "Sem 2": {
        top3: [
          {
            rank: 2,
            name: "Nikhil Agarwal",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=nikhilagarwal&backgroundColor=b6e3f4",
            pts: 1620,
            badge: "5 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Radhika Menon",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=radhikamenon&backgroundColor=c0aede",
            pts: 1680,
            badge: "6 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Suresh Yadav",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=sureshyadav&backgroundColor=ffd5dc",
            pts: 1520,
            badge: "4 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Anjali Singh",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=anjalisingh&backgroundColor=ffd5dc",
            score: 1380,
            projects: "3 Active",
            trend: "+16%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
    "Year 2": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Kavya Reddy",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=kavyareddy&backgroundColor=c0aede",
            pts: 1820,
            badge: "6 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Abhishek Jain",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=abhishekjain&backgroundColor=b6e3f4",
            pts: 1950,
            badge: "8 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Rahul Iyer",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=rahuliyer&backgroundColor=ffd5dc",
            pts: 1720,
            badge: "5 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Meera Nair",
            college: "IIT Bombay",
            department: "Civil",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=meeranair&backgroundColor=ffd5dc",
            score: 1580,
            projects: "4 Active",
            trend: "+9%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
  },
  Electrical: {
    "Year 1": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Ria Kapoor",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=riakapoor&backgroundColor=c0aede",
            pts: 1620,
            badge: "5 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Siddharth Bose",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=siddharthbose&backgroundColor=b6e3f4",
            pts: 1720,
            badge: "7 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Kunal Sharma",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=kunalsharma&backgroundColor=ffd5dc",
            pts: 1520,
            badge: "4 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Nisha Patel",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 1",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=nishapatel&backgroundColor=ffd5dc",
            score: 1380,
            projects: "3 Active",
            trend: "+8%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
      "Sem 2": {
        top3: [
          {
            rank: 2,
            name: "Siddharth Bose",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=siddharthbose&backgroundColor=b6e3f4",
            pts: 1780,
            badge: "7 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Ria Kapoor",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=riakapoor&backgroundColor=c0aede",
            pts: 1850,
            badge: "8 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Kunal Sharma",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=kunalsharma&backgroundColor=ffd5dc",
            pts: 1690,
            badge: "6 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Nisha Patel",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 1",
            semester: "Sem 2",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=nishapatel&backgroundColor=ffd5dc",
            score: 1580,
            projects: "5 Active",
            trend: "+14%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
    "Year 2": {
      "Sem 1": {
        top3: [
          {
            rank: 2,
            name: "Simran Kaur",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=simrankaur&backgroundColor=c0aede",
            pts: 2020,
            badge: "8 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#2b4ed6",
            borderColor: "#bfdbfe",
            bgGrad: "linear-gradient(160deg,#eff6ff 0%,#fff 60%)",
          },
          {
            rank: 1,
            name: "Varun Gupta",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=varungupta&backgroundColor=b6e3f4",
            pts: 2150,
            badge: "10 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#d97706",
            borderColor: "#fde68a",
            bgGrad: "linear-gradient(160deg,#fffbeb 0%,#fff 60%)",
            crown: true,
          },
          {
            rank: 3,
            name: "Aakash Singh",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=aakashsingh&backgroundColor=ffd5dc",
            pts: 1880,
            badge: "7 Active Projects",
            badgeIcon: "lucide:folder-kanban",
            accentColor: "#b45309",
            borderColor: "#fed7aa",
            bgGrad: "linear-gradient(160deg,#fff7ed 0%,#fff 60%)",
          },
        ],
        rows: [
          {
            rank: 4,
            name: "Tara Deshmukh",
            college: "IIT Bombay",
            department: "Electrical",
            year: "Year 2",
            semester: "Sem 1",
            avatar:
              "https://api.dicebear.com/9.x/thumbs/svg?seed=taradeshmukh&backgroundColor=ffd5dc",
            score: 1750,
            projects: "6 Active",
            trend: "+12%",
            trendUp: true,
            isYou: false,
          },
        ],
        yourRank: { rank: 0, score: 0, pointsBehind: 0, behindName: "" },
      },
    },
  },
};

const LEVELS = ["Inter-College", "Intra-College"];
const SEMESTERS = ["All Semesters", "Sem 1", "Sem 2", "Sem 3", "Sem 4"];
const DEPARTMENTS = [
  "All Departments",
  "CSE",
  "ECE",
  "Mechanical",
  "Civil",
  "Electrical",
];
const YEARS = ["2025", "2024", "2023"];
const YEAR_LEVELS = ["Year 1", "Year 2", "Year 3", "Year 4"];

/* ─── Podium card ───────────────────────────────────────────────────── */
function PodiumCard({ p, center }) {
  return (
    <div
      style={{
        background: p.bgGrad,
        border: `2px solid ${p.borderColor}`,
        borderRadius: 14,
        padding: center ? "28px 32px 22px" : "22px 28px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        flex: 1,
        alignSelf: center ? "flex-start" : "flex-end",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        minWidth: 0,
        marginTop: center ? 0 : 28,
        boxShadow: center
          ? "0 16px 48px -12px rgba(217,119,6,0.18)"
          : "0 4px 16px -4px rgba(0,0,0,0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = center
          ? "0 24px 56px -12px rgba(217,119,6,0.28)"
          : "0 10px 28px -6px rgba(0,0,0,0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = center
          ? "0 16px 48px -12px rgba(217,119,6,0.18)"
          : "0 4px 16px -4px rgba(0,0,0,0.08)";
      }}
    >
      {/* Crown for #1 */}
      {p.crown && (
        <div style={{ fontSize: 26, marginBottom: 4, lineHeight: 1 }}>
          <iconify-icon
            icon="lucide:crown"
            style={{ color: "#f59e0b", fontSize: 28 }}
          />
        </div>
      )}

      {/* Rank label */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: p.accentColor,
          marginBottom: center ? 14 : 10,
          letterSpacing: "-0.3px",
        }}
      >
        #{p.rank}
      </div>

      {/* Avatar */}
      <div
        style={{
          width: center ? 80 : 66,
          height: center ? 80 : 66,
          borderRadius: 999,
          border: `3px solid ${p.accentColor}`,
          overflow: "hidden",
          marginBottom: 12,
          flexShrink: 0,
        }}
      >
        <img
          src={p.avatar}
          alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Name */}
      <div
        style={{
          fontSize: center ? 17 : 15,
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: 3,
        }}
      >
        {p.name}
      </div>

      {/* College */}
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
        {p.college}
      </div>

      {/* Points */}
      <div
        style={{
          fontSize: center ? 20 : 17,
          fontWeight: 800,
          color: p.accentColor,
          marginBottom: 10,
        }}
      >
        {p.pts.toLocaleString()} pts
      </div>

      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11,
          color: "#64748b",
          fontWeight: 500,
        }}
      >
        <iconify-icon
          icon={p.badgeIcon}
          style={{ fontSize: 12, color: p.accentColor }}
        />
        {p.badge}
      </div>
    </div>
  );
}

/* ─── Table row ─────────────────────────────────────────────────────── */
function TableRow({ row }) {
  const isNeutral = row.trendUp === null;
  const trendColor = isNeutral
    ? "#64748b"
    : row.trendUp
      ? "#16a34a"
      : "#dc2626";
  const trendIcon = isNeutral
    ? "lucide:minus"
    : row.trendUp
      ? "lucide:trending-up"
      : "lucide:trending-down";

  return (
    <tr
      style={{
        background: row.isYou ? "#eff6ff" : "transparent",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!row.isYou) e.currentTarget.style.background = "#f8fafc";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = row.isYou
          ? "#eff6ff"
          : "transparent";
      }}
    >
      {/* Rank */}
      <td
        style={{
          padding: "14px 20px",
          fontSize: 14,
          fontWeight: 700,
          color: "#64748b",
          width: 60,
        }}
      >
        {row.rank}
      </td>

      {/* Name + avatar */}
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={row.avatar}
            alt={row.name}
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              objectFit: "cover",
              border: "2px solid #e2e8f0",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: row.isYou ? 700 : 600,
              color: "#0f172a",
            }}
          >
            {row.name}
          </span>
          {row.isYou && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: 999,
                background: "#2b4ed6",
                color: "#fff",
                letterSpacing: "0.3px",
              }}
            >
              YOU
            </span>
          )}
        </div>
      </td>

      {/* Institution */}
      <td
        style={{
          padding: "14px 16px",
          fontSize: 13,
          color: "#475569",
        }}
      >
        {row.college}
      </td>

      {/* Score */}
      <td
        style={{
          padding: "14px 16px",
          fontSize: 14,
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        {row.score.toLocaleString()}
      </td>

      {/* Projects */}
      <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>
        {row.projects}
      </td>

      {/* Weekly Trend */}
      <td style={{ padding: "14px 20px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 13,
            fontWeight: 700,
            color: trendColor,
          }}
        >
          <iconify-icon icon={trendIcon} style={{ fontSize: 13 }} />
          {row.trend}
        </span>
      </td>
    </tr>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function Leaderboard() {
  const [level, setLevel] = useState("Inter-College");
  const [semester, setSemester] = useState("All Semesters");
  const [department, setDepartment] = useState("All Departments");
  const [year, setYear] = useState("Year 1");

  // Get filtered data based on level and filters
  const getFilteredData = () => {
    if (level === "Inter-College") {
      // Inter-College with year filtering
      if (INTER_COLLEGE_DATA[year]) {
        return {
          top3: INTER_COLLEGE_DATA[year].top3,
          rows: INTER_COLLEGE_DATA[year].rows,
          yourRank: INTER_COLLEGE_DATA[year].yourRank,
        };
      }
      return { top3: [], rows: [], yourRank: {} };
    } else {
      // Intra-College
      const dept = department !== "All Departments" ? department : "CSE";
      const yr = year;
      const sem = semester !== "All Semesters" ? semester : "Sem 1";

      if (
        INTRA_COLLEGE_DATA[dept] &&
        INTRA_COLLEGE_DATA[dept][yr] &&
        INTRA_COLLEGE_DATA[dept][yr][sem]
      ) {
        return {
          top3: INTRA_COLLEGE_DATA[dept][yr][sem].top3,
          rows: INTRA_COLLEGE_DATA[dept][yr][sem].rows,
          yourRank: INTRA_COLLEGE_DATA[dept][yr][sem].yourRank,
        };
      }
      return { top3: [], rows: [], yourRank: {} };
    }
  };

  const filteredData = getFilteredData();

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: 1100,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* ── Page Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: "0 0 4px",
              color: "#0f172a",
            }}
          >
            Innovation Leaderboard
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Recognizing top innovators and institutions driving change.
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Level Filter */}
          <div style={{ position: "relative" }}>
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                // Reset year to Year 1 for both levels
                setYear("Year 1");
              }}
              style={{
                padding: "8px 32px 8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                color: "#0f172a",
                background: "#fff",
                cursor: "pointer",
                outline: "none",
                fontFamily: "var(--font-family-body)",
                appearance: "none",
                WebkitAppearance: "none",
                minWidth: 145,
                fontWeight: 600,
              }}
            >
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <iconify-icon
              icon="lucide:chevron-down"
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 14,
                color: "#94a3b8",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Conditional filters */}
          {level === "Inter-College" ? (
            <>
              <div style={{ position: "relative" }}>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{
                    padding: "8px 32px 8px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 7,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#334155",
                    background: "#fff",
                    cursor: "pointer",
                    outline: "none",
                    fontFamily: "var(--font-family-body)",
                    appearance: "none",
                    WebkitAppearance: "none",
                    minWidth: 100,
                  }}
                >
                  {YEAR_LEVELS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <iconify-icon
                  icon="lucide:chevron-down"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 14,
                    color: "#94a3b8",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </>
          ) : (
            <>
              {/* Intra-College Filters */}
              <div style={{ position: "relative" }}>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    padding: "8px 32px 8px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 7,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#334155",
                    background: "#fff",
                    cursor: "pointer",
                    outline: "none",
                    fontFamily: "var(--font-family-body)",
                    appearance: "none",
                    WebkitAppearance: "none",
                    minWidth: 150,
                  }}
                >
                  {DEPARTMENTS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <iconify-icon
                  icon="lucide:chevron-down"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 14,
                    color: "#94a3b8",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <div style={{ position: "relative" }}>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{
                    padding: "8px 32px 8px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 7,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#334155",
                    background: "#fff",
                    cursor: "pointer",
                    outline: "none",
                    fontFamily: "var(--font-family-body)",
                    appearance: "none",
                    WebkitAppearance: "none",
                    minWidth: 100,
                  }}
                >
                  {YEAR_LEVELS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <iconify-icon
                  icon="lucide:chevron-down"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 14,
                    color: "#94a3b8",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <div style={{ position: "relative" }}>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  style={{
                    padding: "8px 32px 8px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 7,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#334155",
                    background: "#fff",
                    cursor: "pointer",
                    outline: "none",
                    fontFamily: "var(--font-family-body)",
                    appearance: "none",
                    WebkitAppearance: "none",
                    minWidth: 130,
                  }}
                >
                  {SEMESTERS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <iconify-icon
                  icon="lucide:chevron-down"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 14,
                    color: "#94a3b8",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Update note ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginBottom: 32,
          gap: 6,
          fontSize: 12,
          color: "#94a3b8",
        }}
      >
        <iconify-icon icon="lucide:clock" style={{ fontSize: 13 }} />
        Updated daily at 12:00 AM IST
      </div>

      {/* ── Podium ── */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 40,
          alignItems: "flex-end",
        }}
      >
        {filteredData.top3.length >= 3 ? (
          <>
            {/* #2 */}
            <PodiumCard p={filteredData.top3[0]} center={false} />
            {/* #1 center, taller */}
            <PodiumCard p={filteredData.top3[1]} center={true} />
            {/* #3 */}
            <PodiumCard p={filteredData.top3[2]} center={false} />
          </>
        ) : (
          <div style={{ width: "100%", textAlign: "center", color: "#94a3b8" }}>
            No data available for selected filters
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          {/* Header */}
          <thead>
            <tr
              style={{
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              {[
                { label: "RANK", w: 60 },
                { label: "INNOVATOR" },
                { label: "INSTITUTION" },
                { label: "SCORE" },
                { label: "PROJECTS" },
                { label: "WEEKLY TREND" },
              ].map((col) => (
                <th
                  key={col.label}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.5px",
                    width: col.w || "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {filteredData.rows.map((row, idx) => (
              <tr
                key={row.rank}
                style={{
                  background: row.isYou ? "#eff6ff" : "transparent",
                  borderBottom:
                    idx === filteredData.rows.length - 1
                      ? "none"
                      : "1px solid #f1f5f9",
                  transition: "background 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  if (!row.isYou) e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = row.isYou
                    ? "#eff6ff"
                    : "transparent";
                }}
              >
                {/* Rank */}
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#94a3b8",
                  }}
                >
                  {row.rank}
                </td>

                {/* Name + avatar */}
                <td style={{ padding: "14px 16px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <img
                      src={row.avatar}
                      alt={row.name}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 999,
                        objectFit: "cover",
                        border: "2px solid #e2e8f0",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: row.isYou ? 700 : 500,
                        color: "#0f172a",
                      }}
                    >
                      {row.name}
                      {row.isYou ? " (You)" : ""}
                    </span>
                    {row.isYou && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: 999,
                          background: "#2b4ed6",
                          color: "#fff",
                          letterSpacing: "0.3px",
                          flexShrink: 0,
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </div>
                </td>

                {/* Institution */}
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: 13,
                    color: "#475569",
                  }}
                >
                  {row.college}
                </td>

                {/* Score */}
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  {row.score.toLocaleString()}
                </td>

                {/* Projects */}
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: 13,
                    color: "#64748b",
                  }}
                >
                  {row.projects}
                </td>

                {/* Weekly Trend */}
                <td style={{ padding: "14px 20px" }}>
                  {(() => {
                    const isNeutral = row.trendUp === null;
                    const color = isNeutral
                      ? "#64748b"
                      : row.trendUp
                        ? "#16a34a"
                        : "#dc2626";
                    const icon = isNeutral
                      ? "lucide:minus"
                      : row.trendUp
                        ? "lucide:trending-up"
                        : "lucide:trending-down";
                    return (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 13,
                          fontWeight: 700,
                          color,
                        }}
                      >
                        <iconify-icon icon={icon} style={{ fontSize: 13 }} />
                        {row.trend}
                      </span>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Load More */}
        <div
          style={{
            padding: "18px",
            textAlign: "center",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              color: "#94a3b8",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--primary)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            Load More
            <iconify-icon icon="lucide:chevron-down" style={{ fontSize: 15 }} />
          </button>
        </div>
      </div>

      {/* ── Your ranking sticky strip ── */}
      {filteredData.yourRank && filteredData.yourRank.rank > 0 ? (
        <div
          style={{
            marginTop: 24,
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 10,
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src="https://api.dicebear.com/9.x/thumbs/svg?seed=arjunmehta&backgroundColor=b6e3f4"
              alt="You"
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                objectFit: "cover",
                border: "2px solid #93c5fd",
              }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                Your current rank:{" "}
                <span style={{ color: "var(--primary)", fontSize: 15 }}>
                  #{filteredData.yourRank.rank}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>
                Score: <strong>{filteredData.yourRank.score}</strong> ·{" "}
                {filteredData.yourRank.pointsBehind > 0
                  ? `${filteredData.yourRank.pointsBehind} points behind ${filteredData.yourRank.behindName} (#${filteredData.yourRank.rank - 1})`
                  : "You are at the top!"}
              </div>
            </div>
          </div>
          <button
            style={{
              padding: "9px 18px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e3fa8")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--primary)")
            }
          >
            <iconify-icon icon="lucide:rocket" style={{ fontSize: 14 }} />
            Boost My Score
          </button>
        </div>
      ) : null}
    </div>
  );
}
