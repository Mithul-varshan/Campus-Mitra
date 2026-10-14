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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Winners & Hall of Fame
            </h1>
            <p className="text-sm text-slate-600">
              Top performing students ranked by total wins across college events
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
            >
              <Download size={16} />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or roll number..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value={10}>Show 10</option>
              <option value={25}>Show 25</option>
              <option value={50}>Show 50</option>
              <option value={100}>Show All</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={selectedEventName}
              onChange={(e) => setSelectedEventName(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {allEventNames.map((eventName) => (
                <option key={eventName} value={eventName}>
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
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
            >
              Clear Filters
            </button>
          </div>
          {filtered.length > 0 && (
            <div className="mt-3 text-sm text-slate-600">
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
                className={`bg-white rounded-lg p-6 shadow-md border-2 ${
                  i === 0
                    ? "border-yellow-400"
                    : i === 1
                      ? "border-slate-400"
                      : "border-orange-400"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-600">
                      {i === 0
                        ? "🥇 1st Place"
                        : i === 1
                          ? "🥈 2nd Place"
                          : "🥉 3rd Place"}
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {t.rollNo}
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-xl">
                    {t.name
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium">{t.dept}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Year:</span>
                    <span className="font-medium">{t.year}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Total Wins:</span>
                    <span className="font-bold text-yellow-600">
                      {t.totalWins}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Events:</span>
                    <span className="font-medium">
                      {t.eventsParticipated.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Winners table */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              All Winners ({filtered.length})
            </h2>
            <div className="text-sm text-slate-600">Ranked by Total Wins</div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Award size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600">
                No winners found matching your filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">
                      Rank
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">
                      Student Name
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">
                      Roll Number
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">
                      Year
                    </th>
                    <th className="text-center py-3 px-4 text-slate-600 font-semibold">
                      Total Wins
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">
                      Events Participated
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, limit).map((w, idx) => (
                    <tr
                      key={w.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">
                        #{idx + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {w.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-sm">
                        {w.rollNo}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 text-sm font-medium rounded bg-blue-100 text-blue-700">
                          {w.dept}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 text-sm font-medium rounded bg-purple-100 text-purple-700">
                          {w.year}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 text-sm font-bold rounded bg-yellow-100 text-yellow-700">
                          {w.totalWins}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-slate-700">
                            {w.eventsParticipated.length} Events
                          </span>
                          <span
                            className="text-xs text-slate-500 truncate max-w-[200px]"
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
                        <span className="px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-slate-500 hover:text-slate-700 text-lg">
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
            <div className="mt-4 text-center text-sm text-slate-600">
              Showing {limit} of {filtered.length} winners
              <button
                onClick={() => setLimit(filtered.length)}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
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
