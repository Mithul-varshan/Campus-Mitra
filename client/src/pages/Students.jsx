import { useState } from "react";
import {
  Upload,
  UserPlus,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter,
  Trash2,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { SEED_STUDENTS } from "../data/seeds";

export default function Students() {
  const { importedStudents, deleteImportedStudent } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Seed students (mutable so they can be deleted)
  const [students, setStudents] = useState(SEED_STUDENTS);

  // Merge seed + imported students (imported first so they're visible immediately)
  const allStudents = [...importedStudents, ...students];

  const handleDelete = (student) => {
    if (student.isImported) {
      deleteImportedStudent(student.id);
    } else {
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
    }
    // if deletion moves current page out of range, go back one
    setCurrentPage((p) => {
      const newTotal = allStudents.length - 1;
      const newPages = Math.max(1, Math.ceil(newTotal / rowsPerPage));
      return Math.min(p, newPages);
    });
  };

  // Filter and search logic
  const filteredStudents = allStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      departmentFilter === "All" || student.department === departmentFilter;

    const matchesYear = yearFilter === "All" || student.year === yearFilter;

    return matchesSearch && matchesDept && matchesYear;
  });

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedStudents = filteredStudents.slice(
    startIdx,
    startIdx + rowsPerPage,
  );

  const getStatusColor = (status) => {
    if (status === "Active")
      return "bg-green-100 dark:bg-green-950/70 text-green-700 dark:text-green-300 dark:border dark:border-green-800/50";
    if (status === "Onboard Pending")
      return "bg-yellow-100 dark:bg-yellow-950/70 text-yellow-700 dark:text-yellow-300 dark:border dark:border-yellow-800/50";
    if (status === "Flagged for low activity")
      return "bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 dark:border dark:border-red-800/50";
    return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  };

  const getAvatarColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-green-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Students
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {allStudents.length} total •{" "}
                {allStudents.filter((s) => s.status === "Active").length} active
              </p>
            </div>
          </div>

          {importedStudents.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">{importedStudents.length}</span>
              <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">imported</span>
            </div>
          )}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-6 shadow-sm transition-colors">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
              Total Students
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {allStudents.length.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {importedStudents.length > 0
                ? `+${importedStudents.length} imported`
                : "↑ 14.2% vs last year"}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-6 shadow-sm transition-colors">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
              Active Innovators
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {allStudents.filter((s) => s.status === "Active").length.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {allStudents.length > 0
                ? `${Math.round((allStudents.filter((s) => s.status === "Active").length / allStudents.length) * 100)}% active`
                : "0% active"}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-6 shadow-sm transition-colors">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
              Avg. Innovation Score (SII)
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {allStudents.length > 0
                ? Math.round(
                    allStudents.reduce((sum, s) => sum + (s.siiScore || 0), 0) /
                      allStudents.length
                  )
                : 0}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">AI benchmark: 710</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-6 shadow-sm transition-colors">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
              Pending Onboarding
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {allStudents
                .filter((s) => s.status === "Onboard Pending")
                .length.toLocaleString()}
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400">Pending next verification</p>
          </div>
        </div>

        {/* Students Directory */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-md p-6 transition-colors">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Students Directory
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Search, filter, and manage students across all departments.
            </p>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Search Input */}
              <div className="relative md:col-span-2">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Search by name, roll no., email"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option className="dark:bg-slate-800">All Departments</option>
                <option className="dark:bg-slate-800">CSE</option>
                <option className="dark:bg-slate-800">ECE</option>
                <option className="dark:bg-slate-800">IT</option>
                <option className="dark:bg-slate-800">Mechanical</option>
              </select>

              {/* Year Filter */}
              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option className="dark:bg-slate-800">All Years</option>
                <option className="dark:bg-slate-800">1st Year</option>
                <option className="dark:bg-slate-800">2nd Year</option>
                <option className="dark:bg-slate-800">3rd Year</option>
                <option className="dark:bg-slate-800">4th Year</option>
              </select>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Save View
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                  Bulk Actions
                </span>
                <span>|</span>
                <span>Onboard Pending</span>
                <span>|</span>
                <span>Flagged</span>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    <input type="checkbox" className="rounded dark:bg-slate-800 dark:border-slate-700" />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Roll No.
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Department / Year
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    SII Score
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Last Active
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input type="checkbox" className="rounded dark:bg-slate-800 dark:border-slate-700" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${getAvatarColor(
                            idx,
                          )}`}
                        >
                          {student.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {student.name}
                            </p>
                            {student.isImported && (
                              <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 rounded text-xs font-medium dark:border dark:border-blue-800/50">
                                Imported
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-mono text-sm">
                      {student.rollNo}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-slate-900 dark:text-slate-200 font-medium">
                          {student.department}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{student.year}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          ♦ {student.siiScore}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {student.scoreLevel}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          student.status,
                        )}`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {student.lastActive}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(student)}
                          title="Delete student"
                          className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10} className="dark:bg-slate-800">10</option>
                <option value={25} className="dark:bg-slate-800">25</option>
                <option value={50} className="dark:bg-slate-800">50</option>
              </select>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing {startIdx + 1}-
              {Math.min(startIdx + rowsPerPage, filteredStudents.length)} of{" "}
              {filteredStudents.length} students
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-300 dark:border-slate-700 rounded disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-300 dark:border-slate-700 rounded disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
