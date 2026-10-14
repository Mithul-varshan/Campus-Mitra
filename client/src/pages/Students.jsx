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
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Onboard Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Flagged for low activity") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                Students
              </h1>
              <p className="text-slate-600">
                {allStudents.length} total •{" "}
                {allStudents.filter((s) => s.status === "Active").length} active
              </p>
            </div>
          </div>

          {importedStudents.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">{importedStudents.length}</span>
              <span className="text-xs text-blue-700 font-medium">imported</span>
            </div>
          )}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-slate-600 text-sm font-medium mb-2">
              Total Students
            </p>
            <p className="text-3xl font-bold text-slate-900 mb-2">
              {allStudents.length.toLocaleString()}
            </p>
            <p className="text-sm text-green-600">
              {importedStudents.length > 0
                ? `+${importedStudents.length} imported`
                : "↑ 14.2% vs last year"}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-slate-600 text-sm font-medium mb-2">
              Active Innovators
            </p>
            <p className="text-3xl font-bold text-slate-900 mb-2">
              {allStudents.filter((s) => s.status === "Active").length.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">
              {allStudents.length > 0
                ? `${Math.round((allStudents.filter((s) => s.status === "Active").length / allStudents.length) * 100)}% active`
                : "0% active"}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-slate-600 text-sm font-medium mb-2">
              Avg. Innovation Score (SII)
            </p>
            <p className="text-3xl font-bold text-slate-900 mb-2">
              {allStudents.length > 0
                ? Math.round(
                    allStudents.reduce((sum, s) => sum + (s.siiScore || 0), 0) /
                      allStudents.length
                  )
                : 0}
            </p>
            <p className="text-sm text-slate-600">AI benchmark: 710</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-slate-600 text-sm font-medium mb-2">
              Pending Onboarding
            </p>
            <p className="text-3xl font-bold text-slate-900 mb-2">
              {allStudents
                .filter((s) => s.status === "Onboard Pending")
                .length.toLocaleString()}
            </p>
            <p className="text-sm text-orange-600">Pending next verification</p>
          </div>
        </div>

        {/* Students Directory */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Students Directory
            </h2>
            <p className="text-slate-600 text-sm mb-4">
              Search, filter, and manage students across all departments.
            </p>

            {/* Search and Filters */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              {/* Search Input */}
              <div className="relative col-span-2">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by name, roll no., email"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Departments</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>IT</option>
                <option>Mechanical</option>
              </select>

              {/* Year Filter */}
              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Years</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors">
                  Save View
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors">
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="px-3 py-1 bg-slate-100 rounded">
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
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Roll No.
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Department / Year
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    SII Score
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Last Active
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(
                            idx,
                          )}`}
                        >
                          {student.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">
                              {student.name}
                            </p>
                            {student.isImported && (
                              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                Imported
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {student.rollNo}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-slate-900 font-medium">
                          {student.department}
                        </p>
                        <p className="text-sm text-slate-600">{student.year}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-slate-900">
                          ♦ {student.siiScore}
                        </p>
                        <p className="text-sm text-slate-600">
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
                    <td className="py-3 px-4 text-slate-600">
                      {student.lastActive}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(student)}
                          title="Delete student"
                          className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-slate-300 rounded text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="text-sm text-slate-600">
              Showing {startIdx + 1}-
              {Math.min(startIdx + rowsPerPage, filteredStudents.length)} of{" "}
              {filteredStudents.length} students
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-300 rounded disabled:opacity-50 hover:bg-slate-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-300 rounded disabled:opacity-50 hover:bg-slate-50"
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
