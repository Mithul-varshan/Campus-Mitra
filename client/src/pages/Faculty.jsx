import { useState } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2,
  Users,
  TrendingUp,
  X,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { SEED_FACULTY, SEED_STUDENTS } from "../data/seeds";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-green-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-teal-500",
  "bg-yellow-500",
];

export default function Faculty() {
  const { importedFaculty, deleteImportedFaculty, clearImportedFaculty, importedStudents, getMenteeIds } = useData();
  const navigate = useNavigate();

  const [seedFaculty, setSeedFaculty] = useState(SEED_FACULTY);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMentorId, setSelectedMentorId] = useState(null);

  const allFaculty = [...importedFaculty, ...seedFaculty];
  const allStudents = [...importedStudents, ...SEED_STUDENTS];

  const selectedFaculty = allFaculty.find((f) => f.id === selectedMentorId) || null;
  const menteeStudents = selectedFaculty
    ? getMenteeIds(selectedFaculty.id).map((sid) => allStudents.find((s) => s.id === sid)).filter(Boolean)
    : [];

  const handleDelete = (member) => {
    if (member.isImported) {
      deleteImportedFaculty(member.id);
    } else {
      setSeedFaculty((prev) => prev.filter((f) => f.id !== member.id));
    }
    setCurrentPage((p) => {
      const newTotal = allFaculty.length - 1;
      const newPages = Math.max(1, Math.ceil(newTotal / rowsPerPage));
      return Math.min(p, newPages);
    });
  };

  const filtered = allFaculty.filter((f) => {
    const matchSearch =
      f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept =
      departmentFilter === "All" || f.department === departmentFilter;
    return matchSearch && matchDept;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedFaculty = filtered.slice(startIdx, startIdx + rowsPerPage);

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "On Leave") return "bg-yellow-100 text-yellow-700";
    return "bg-slate-100 text-slate-700";
  };

  const getAvatarColor = (idx) => AVATAR_COLORS[idx % AVATAR_COLORS.length];

  // Unique departments across all faculty for filter
  const departments = ["All", ...new Set(allFaculty.map((f) => f.department).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">Faculty</h1>
              <p className="text-slate-600">
                {allFaculty.length} total •{" "}
                {allFaculty.filter((f) => f.status === "Active").length} active
              </p>
            </div>
            <button
              onClick={() => navigate("/bulk-import")}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Bulk Import Faculty
            </button>
          </div>

          {importedFaculty.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white text-xs font-bold">{importedFaculty.length}</span>
              <span className="text-xs text-purple-700 font-medium">imported</span>
            </div>
          )}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-slate-600 text-sm font-medium mb-2">Total Faculty</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">{allFaculty.length}</p>
            <p className="text-sm text-green-600">↑ Across all departments</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-slate-600 text-sm font-medium mb-2">Active Members</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">
              {allFaculty.filter((f) => f.status === "Active").length}
            </p>
            <p className="text-sm text-slate-600">Currently active</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-slate-600 text-sm font-medium mb-2">Departments</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">{departments.length - 1}</p>
            <p className="text-sm text-slate-600">Unique departments</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-slate-600 text-sm font-medium mb-2">Imported</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">{importedFaculty.length}</p>
            <p className="text-sm text-orange-600">Via Bulk Import</p>
          </div>
        </div>

        {/* Faculty Directory */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Faculty Directory</h2>
            <p className="text-slate-600 text-sm mb-4">
              Search, filter, and manage faculty across all departments.
            </p>

            {/* Search and Filter */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="relative col-span-2">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by name, employee ID, email"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map((d) => (
                  <option key={d}>{d === "All" ? "All Departments" : d}</option>
                ))}
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors">
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Faculty</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Employee ID</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Designation</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedFaculty.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No faculty found.{" "}
                      <button
                        onClick={() => navigate("/bulk-import")}
                        className="text-blue-600 underline"
                      >
                        Import faculty
                      </button>
                    </td>
                  </tr>
                ) : (
                  displayedFaculty.map((member, idx) => (
                    <tr
                      key={member.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(idx)}`}
                          >
                            {member.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900">{member.name}</p>
                              {member.isImported && (
                                <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                  Imported
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{member.employeeId}</td>
                      <td className="py-3 px-4 text-slate-700">{member.department}</td>
                      <td className="py-3 px-4 text-slate-700">{member.designation}</td>
                      <td className="py-3 px-4 text-slate-600 text-sm">{member.contact}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(member)}
                            title="Delete faculty"
                            className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                          <button
                            onClick={() => setSelectedMentorId((prev) => (prev === member.id ? null : member.id))}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors ${
                              selectedMentorId === member.id
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-slate-300 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <Users size={13} />
                            {getMenteeIds(member.id).length > 0 && (
                              <span className="font-bold">{getMenteeIds(member.id).length}</span>
                            )}
                            Mentees
                          </button>
                          <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-3 py-1 border border-slate-300 rounded text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="text-sm text-slate-600">
              Showing {Math.min(startIdx + 1, filtered.length)}–{Math.min(startIdx + rowsPerPage, filtered.length)} of {filtered.length} faculty
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
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-300 rounded disabled:opacity-50 hover:bg-slate-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mentees Panel ── */}
        {selectedFaculty && (
          <div className="mt-6 bg-white rounded-xl border border-blue-100 shadow-sm">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {selectedFaculty.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{selectedFaculty.name}</h3>
                  <p className="text-xs text-slate-500">{selectedFaculty.designation} &bull; {selectedFaculty.department}</p>
                </div>
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  <Users size={11} /> {menteeStudents.length} mentee{menteeStudents.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/mentor-mapping")}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Manage Mappings →
                </button>
                <button onClick={() => setSelectedMentorId(null)} className="p-1 rounded hover:bg-slate-100">
                  <X size={16} className="text-slate-400" />
                </button>
              </div>
            </div>

            {/* Mentees table */}
            {menteeStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Users size={32} className="text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm font-medium">No mentees assigned yet</p>
                <button
                  onClick={() => navigate("/mentor-mapping")}
                  className="mt-3 text-xs text-blue-600 hover:underline"
                >
                  Go to Mentor Mapping to assign students
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {["Student", "Roll No.", "Department", "Year", "SII Score", "Status", "Last Active"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {menteeStudents.map((s, idx) => {
                      const scoreColor = s.siiScore >= 750 ? "text-green-600" : s.siiScore >= 500 ? "text-blue-600" : "text-orange-500";
                      const scoreBg   = s.siiScore >= 750 ? "bg-green-100" : s.siiScore >= 500 ? "bg-blue-100" : "bg-orange-100";
                      const statusColor = s.status === "Active" ? "bg-green-100 text-green-700" : s.status === "Onboard Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
                      return (
                        <tr key={s.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{s.avatar}</div>
                              <span className="text-sm font-medium text-slate-900">{s.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500 font-mono">{s.rollNo}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">{s.department}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">{s.year}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${scoreColor}`}>{s.siiScore}</span>
                              <div className="flex-1 h-1.5 bg-slate-200 rounded-full w-16">
                                <div className={`h-full rounded-full ${scoreBg.replace("100","500").replace("bg-","bg-")}`} style={{ width: `${Math.min(100, (s.siiScore / 1000) * 100)}%`, background: s.siiScore >= 750 ? "#16a34a" : s.siiScore >= 500 ? "#2563eb" : "#f97316" }} />
                              </div>
                              <span className="text-xs text-slate-400">{s.scoreLevel}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>{s.status}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{s.lastActive}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Avg SII Score: <span className="font-semibold text-slate-700">
                      {Math.round(menteeStudents.reduce((s, m) => s + (m.siiScore || 0), 0) / menteeStudents.length)}
                    </span>
                  </span>
                  <span className="text-xs text-slate-500">
                    Active: <span className="font-semibold text-green-700">{menteeStudents.filter((m) => m.status === "Active").length}</span> / {menteeStudents.length}
                  </span>
                  <button onClick={() => navigate("/mentor-mapping")} className="text-xs text-blue-600 hover:underline">
                    + Add / Remove Mentees
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
