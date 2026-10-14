import { useState } from "react";
import { Search, Award, Download } from "lucide-react";

const DEPARTMENTS = [
  "All Departments",
  "CSE",
  "IT",
  "AI/ML",
  "AI/DS",
  "ECE",
  "EEE",
  "Mechanical",
];

const YEARS = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"];

const EVENT_TYPES = [
  "All Event Types",
  "Hackathon",
  "Competition",
  "Workshop",
  "Seminar",
  "Contest",
  "Challenge",
];

export default function Winners() {
  const [query, setQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedEventType, setSelectedEventType] = useState("All Event Types");
  const [selectedEventName, setSelectedEventName] = useState("All Events");
  const [limit, setLimit] = useState(10);

  // Sample data - Individual student winners
  const winners = [
    {
      id: "STU001",
      name: "Arun Kumar",
      rollNo: "21CS001",
      dept: "CSE",
      year: "3rd Year",
      totalWins: 8,
      eventsParticipated: [
        { name: "Tech Hackathon 2025", type: "Hackathon" },
        { name: "AI Innovation Challenge", type: "Challenge" },
        { name: "Code Sprint 2026", type: "Competition" },
      ],
      status: "Verified",
    },
    {
      id: "STU002",
      name: "Priya Sharma",
      rollNo: "21ML003",
      dept: "AI/ML",
      year: "3rd Year",
      totalWins: 7,
      eventsParticipated: [
        { name: "AI Innovation Challenge", type: "Challenge" },
        { name: "ML Competition", type: "Competition" },
        { name: "Smart Campus Hackathon", type: "Hackathon" },
      ],
      status: "Verified",
    },
    {
      id: "STU003",
      name: "Vikash Rao",
      rollNo: "22IT015",
      dept: "IT",
      year: "2nd Year",
      totalWins: 6,
      eventsParticipated: [
        { name: "Web Dev Championship", type: "Competition" },
        { name: "Cloud Computing Contest", type: "Contest" },
        { name: "Code Sprint 2026", type: "Competition" },
      ],
      status: "Verified",
    },
    {
      id: "STU004",
      name: "Sneha Patel",
      rollNo: "21CS042",
      dept: "CSE",
      year: "3rd Year",
      totalWins: 6,
      eventsParticipated: [
        { name: "Tech Hackathon 2025", type: "Hackathon" },
        { name: "Cyber Security Challenge", type: "Challenge" },
      ],
      status: "Verified",
    },
    {
      id: "STU005",
      name: "Rahul Mehta",
      rollNo: "22DS007",
      dept: "AI/DS",
      year: "2nd Year",
      totalWins: 5,
      eventsParticipated: [
        { name: "Data Analytics Fest", type: "Competition" },
        { name: "AI Innovation Challenge", type: "Challenge" },
      ],
      status: "Verified",
    },
    {
      id: "STU006",
      name: "Ananya Singh",
      rollNo: "23ME021",
      dept: "Mechanical",
      year: "1st Year",
      totalWins: 5,
      eventsParticipated: [
        { name: "Engineering Design Contest", type: "Contest" },
        { name: "Innovation Expo", type: "Seminar" },
      ],
      status: "Verified",
    },
    {
      id: "STU007",
      name: "Karan Reddy",
      rollNo: "21EE018",
      dept: "EEE",
      year: "3rd Year",
      totalWins: 4,
      eventsParticipated: [
        { name: "Smart Grid Challenge", type: "Challenge" },
        { name: "Renewable Energy Fest", type: "Seminar" },
      ],
      status: "Verified",
    },
    {
      id: "STU008",
      name: "Meera Krishnan",
      rollNo: "22EC012",
      dept: "ECE",
      year: "2nd Year",
      totalWins: 4,
      eventsParticipated: [
        { name: "IoT Hackathon", type: "Hackathon" },
        { name: "Communication Systems Contest", type: "Contest" },
      ],
      status: "Verified",
    },
    {
      id: "STU009",
      name: "Arjun Desai",
      rollNo: "20IT045",
      dept: "IT",
      year: "4th Year",
      totalWins: 3,
      eventsParticipated: [
        { name: "Web Dev Championship", type: "Competition" },
        { name: "Database Design Contest", type: "Contest" },
      ],
      status: "Verified",
    },
    {
      id: "STU010",
      name: "Divya Nair",
      rollNo: "22ML019",
      dept: "AI/ML",
      year: "2nd Year",
      totalWins: 3,
      eventsParticipated: [
        { name: "ML Competition", type: "Competition" },
        { name: "Smart Campus Hackathon", type: "Hackathon" },
      ],
      status: "Verified",
    },
    {
      id: "STU011",
      name: "Rohit Kumar",
      rollNo: "21CS028",
      dept: "CSE",
      year: "3rd Year",
      totalWins: 2,
      eventsParticipated: [{ name: "Code Sprint 2026", type: "Competition" }],
      status: "Verified",
    },
    {
      id: "STU012",
      name: "Sanjana Iyer",
      rollNo: "23DS005",
      dept: "AI/DS",
      year: "1st Year",
      totalWins: 2,
      eventsParticipated: [
        { name: "Data Analytics Fest", type: "Competition" },
      ],
      status: "Verified",
    },
  ];

  // Extract unique event names for the filter dropdown
  const allEventNames = [
    "All Events",
    ...new Set(winners.flatMap((w) => w.eventsParticipated.map((e) => e.name))),
  ];

  // Sort by total wins and apply filters
  const sortedWinners = [...winners].sort((a, b) => b.totalWins - a.totalWins);

  const filtered = sortedWinners.filter(
    (w) =>
      (selectedDepartment === "All Departments" ||
        w.dept === selectedDepartment) &&
      (selectedYear === "All Years" || w.year === selectedYear) &&
      (selectedEventType === "All Event Types" ||
        w.eventsParticipated.some((e) => e.type === selectedEventType)) &&
      (selectedEventName === "All Events" ||
        w.eventsParticipated.some((e) => e.name === selectedEventName)) &&
      (w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.rollNo.toLowerCase().includes(query.toLowerCase())),
  );

  const topThree = filtered.slice(0, 3).length > 0 ? filtered.slice(0, 3) : [];

  // Function to export winners data to Excel (CSV format)
  const exportToExcel = () => {
    // Create CSV header
    const headers = [
      "Rank",
      "Student Name",
      "Roll Number",
      "Department",
      "Year",
      "Total Wins",
      "Events Participated",
      "Status",
    ];

    // Create CSV rows from filtered data
    const rows = filtered.map((winner, index) => [
      index + 1,
      winner.name,
      winner.rollNo,
      winner.dept,
      winner.year,
      winner.totalWins,
      winner.eventsParticipated.map((e) => `${e.name} (${e.type})`).join("; "),
      winner.status,
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `winners_list_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Winners & Hall of Fame
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Top performing students ranked by total wins across college events
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded text-sm font-medium hover:bg-emerald-700 shadow-sm transition-colors"
            >
              <Download size={16} />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-md dark:border dark:border-slate-800 mb-6 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={16}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or roll number..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {YEARS.map((year) => (
                <option key={year} value={year} className="dark:bg-slate-800">
                  {year}
                </option>
              ))}
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="dark:bg-slate-800">
                  {dept}
                </option>
              ))}
            </select>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10} className="dark:bg-slate-800">Show 10</option>
              <option value={25} className="dark:bg-slate-800">Show 25</option>
              <option value={50} className="dark:bg-slate-800">Show 50</option>
              <option value={100} className="dark:bg-slate-800">Show All</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type} className="dark:bg-slate-800">
                  {type}
                </option>
              ))}
            </select>
            <select
              value={selectedEventName}
              onChange={(e) => setSelectedEventName(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allEventNames.map((eventName) => (
                <option key={eventName} value={eventName} className="dark:bg-slate-800">
                  {eventName}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setQuery("");
                setSelectedDepartment("All Departments");
                setSelectedYear("All Years");
                setSelectedEventType("All Event Types");
                setSelectedEventName("All Events");
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
          {filtered.length > 0 && (
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Showing {filtered.length} winner{filtered.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Top 3 winners cards */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {topThree.map((t, i) => (
              <div
                key={t.id}
                className={`bg-white dark:bg-slate-900 rounded-lg p-6 shadow-md border-2 transition-colors ${
                  i === 0
                    ? "border-yellow-400 dark:border-yellow-500/80 shadow-yellow-500/10"
                    : i === 1
                      ? "border-slate-400 dark:border-slate-600 shadow-slate-500/10"
                      : "border-orange-400 dark:border-orange-500/80 shadow-orange-500/10"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {i === 0
                        ? "🥇 1st Place"
                        : i === 1
                          ? "🥈 2nd Place"
                          : "🥉 3rd Place"}
                    </div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {t.rollNo}
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-xl shadow-md">
                    {t.name
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Department:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{t.dept}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Year:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{t.year}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Total Wins:</span>
                    <span className="font-bold text-yellow-600 dark:text-yellow-400">
                      {t.totalWins}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Events:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      {t.eventsParticipated.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Winners table */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-md dark:border dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              All Winners ({filtered.length})
            </h2>
            <div className="text-sm text-slate-600 dark:text-slate-400">Ranked by Total Wins</div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Award size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-600 dark:text-slate-400">
                No winners found matching your filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                      Rank
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                      Student Name
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                      Roll Number
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                      Year
                    </th>
                    <th className="text-center py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                      Total Wins
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                      Events Participated
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, limit).map((w, idx) => (
                    <tr
                      key={w.id}
                      className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        #{idx + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {w.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-sm">
                        {w.rollNo}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 text-sm font-medium rounded bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 dark:border dark:border-blue-800/50">
                          {w.dept}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 text-sm font-medium rounded bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 dark:border dark:border-purple-800/50">
                          {w.year}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 text-sm font-bold rounded bg-yellow-100 dark:bg-yellow-950/70 text-yellow-700 dark:text-yellow-400 dark:border dark:border-yellow-800/50">
                          {w.totalWins}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {w.eventsParticipated.length} Events
                          </span>
                          <span
                            className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]"
                            title={w.eventsParticipated
                              .map((e) => e.name)
                              .join(", ")}
                          >
                            {w.eventsParticipated[0]?.name}
                            {w.eventsParticipated.length > 1 &&
                              " +" + (w.eventsParticipated.length - 1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-950/70 text-green-700 dark:text-green-300 dark:border dark:border-green-800/50">
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg transition-colors">
                          ⋮
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > limit && (
            <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
              Showing {limit} of {filtered.length} winners
              <button
                onClick={() => setLimit(filtered.length)}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                View All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
