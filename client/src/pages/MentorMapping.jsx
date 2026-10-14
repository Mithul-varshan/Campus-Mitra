import { useState, useMemo } from "react";
import {
  UserCheck,
  Users,
  Search,
  Plus,
  X,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Upload,
  FileText,
  Download,
  LayoutList,
  CheckCircle,
  XCircle,
  SkipForward,
  Sliders,
  ArrowRight,
  Hash,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useData } from "../context/DataContext";
import { SEED_FACULTY, SEED_STUDENTS } from "../data/seeds";

const SAMPLE_CSV = `Faculty Employee ID,Student Identifier
FAC-1001,CS2021-045
FAC-1001,rahul.mehta@campus.edu
FAC-1002,IT2022-031
FAC-1002,ME2021-077
FAC-1003,CS2023-089
FAC-1004,IT2020-045
`;

function downloadSampleCSV() {
  const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "mentor-mapping-sample.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function scoreColor(score) {
  if (score >= 750) return { text: "text-green-600 dark:text-green-400", bg: "bg-green-500", badge: "bg-green-100 dark:bg-green-950/70 text-green-700 dark:text-green-300 dark:border dark:border-green-800/50" };
  if (score >= 500) return { text: "text-blue-600 dark:text-blue-400",  bg: "bg-blue-500",  badge: "bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 dark:border dark:border-blue-800/50" };
  return              { text: "text-orange-500 dark:text-orange-400", bg: "bg-orange-500", badge: "bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 dark:border dark:border-orange-800/50" };
}

function statusBadge(status) {
  if (status === "Active")          return "bg-green-100 dark:bg-green-950/70 text-green-700 dark:text-green-300 dark:border dark:border-green-800/50";
  if (status === "Onboard Pending") return "bg-yellow-100 dark:bg-yellow-950/70 text-yellow-700 dark:text-yellow-300 dark:border dark:border-yellow-800/50";
  return                                   "bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 dark:border dark:border-red-800/50";
}

function MiniBar({ value, max = 1000, color }) {
  return (
    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  );
}

// ── Student row in the "Add Mentees" list ─────────────────────────────────────
function AddStudentRow({ student, onAdd }) {
  const sc = scoreColor(student.siiScore);
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors group">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
        {student.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{student.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{student.rollNo} · {student.department} · {student.year}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs font-bold ${sc.text}`}>{student.siiScore}</span>
        <MiniBar value={student.siiScore} color={sc.bg} />
      </div>
      <button
        onClick={() => onAdd(student.id)}
        className="ml-1 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// ── Assigned mentee chip ──────────────────────────────────────────────────────
function MenteeChip({ student, onRemove }) {
  const sc = scoreColor(student.siiScore);
  const statusColor = statusBadge(student.status);
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
        {student.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{student.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{student.rollNo} · {student.department}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={11} className={sc.text} />
          <span className={`text-sm font-bold ${sc.text}`}>{student.siiScore}</span>
        </div>
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${statusColor}`}>{student.status}</span>
      </div>
      <button
        onClick={() => onRemove(student.id)}
        className="ml-1 w-7 h-7 rounded-full hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 dark:hover:text-red-400 flex items-center justify-center transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Bulk Mapping Tab ─────────────────────────────────────────────────────────
function BulkMappingTab({ allFaculty, allStudents, mentorMappings, addMentee }) {
  const [file, setFile]           = useState(null);
  const [rows, setRows]           = useState(null); // null = not parsed yet
  const [parseError, setParseError] = useState("");
  const [applied, setApplied]     = useState(false);

  const parseRows = (rawRows) => {
    return rawRows.map((r) => {
      const facId  = (r["Faculty Employee ID"] || r["faculty_employee_id"] || r["EmployeeID"] || "").toString().trim();
      // Accept roll no, email, or name in the student column
      const stuVal = (
        r["Student Identifier"] ||
        r["Student Roll No"]    ||
        r["student_identifier"] ||
        r["student_roll_no"]    ||
        r["Email"]              ||
        r["RollNo"]             || ""
      ).toString().trim();

      const faculty = allFaculty.find(
        (f) => f.employeeId?.toLowerCase() === facId.toLowerCase() ||
               f.email?.toLowerCase()      === facId.toLowerCase() ||
               f.name?.toLowerCase()       === facId.toLowerCase()
      );
      const student = allStudents.find(
        (s) => s.rollNo?.toLowerCase() === stuVal.toLowerCase() ||
               s.email?.toLowerCase()  === stuVal.toLowerCase() ||
               s.name?.toLowerCase()   === stuVal.toLowerCase()
      );

      const alreadyMapped = faculty && student &&
        (mentorMappings[faculty.id] || []).includes(student.id);

      let status = "valid";
      let error  = "";
      if (!faculty && !student) { status = "error"; error = `Faculty "${facId}" and Student "${stuVal}" not found`; }
      else if (!faculty)        { status = "error"; error = `Faculty "${facId}" not found`; }
      else if (!student)        { status = "error"; error = `Student "${stuVal}" not found`; }
      else if (alreadyMapped)   { status = "skip";  error = "Already mapped"; }

      return { facId, rollNo: stuVal, faculty, student, status, error };
    });
  };

  const handleFile = (f) => {
    if (!f) return;
    setFile(f); setApplied(false); setParseError(""); setRows(null);
    const ext = f.name.split(".").pop().toLowerCase();

    if (ext === "csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb   = XLSX.read(e.target.result, { type: "string" });
          const ws   = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
          setRows(parseRows(json));
        } catch { setParseError("Could not parse CSV. Check the format."); }
      };
      reader.readAsText(f);
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb   = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
          const ws   = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
          setRows(parseRows(json));
        } catch { setParseError("Could not parse Excel file. Check the format."); }
      };
      reader.readAsArrayBuffer(f);
    } else {
      setParseError("Unsupported file type. Upload a .csv or .xlsx file.");
    }
  };

  const validRows = rows ? rows.filter((r) => r.status === "valid") : [];
  const skipRows  = rows ? rows.filter((r) => r.status === "skip")  : [];
  const errorRows = rows ? rows.filter((r) => r.status === "error") : [];

  const handleApply = () => {
    validRows.forEach((r) => addMentee(r.faculty.id, r.student.id));
    setApplied(true);
  };

  const reset = () => { setFile(null); setRows(null); setParseError(""); setApplied(false); };

  return (
    <div className="space-y-5">

      {/* Instructions + download */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm px-6 py-5 transition-colors">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Bulk Mentor Mapping via CSV / Excel</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Upload a file with two columns: <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1 py-0.5 rounded text-xs font-mono">Faculty Employee ID</code> and{" "}
              <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1 py-0.5 rounded text-xs font-mono">Student Identifier</code>.
              Each row maps one student to one mentor.
            </p>
            <ul className="text-xs text-slate-400 dark:text-slate-500 list-disc list-inside space-y-0.5">
              <li>Faculty matched by Employee ID (e.g. FAC-1001), email, or full name</li>
              <li>Student matched by Roll No (e.g. CS2021-045), email, or full name</li>
              <li>Already-mapped pairs are skipped (not duplicated)</li>
              <li>Rows with unrecognised IDs are shown as errors and skipped</li>
            </ul>
          </div>
          <button
            onClick={downloadSampleCSV}
            className="flex items-center gap-2 shrink-0 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 rounded-lg px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
          >
            <Download size={14} /> Sample CSV
          </button>
        </div>
      </div>

      {/* Drop zone */}
      {!rows && !parseError && (
        <label className="block">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-14 bg-white dark:bg-slate-900 cursor-pointer hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50/30 dark:hover:bg-violet-950/20 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Upload size={22} className="text-slate-400 dark:text-slate-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Drop your file here or <span className="text-violet-600 dark:text-violet-400">browse</span></p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Supports .csv, .xlsx, .xls</p>
            </div>
          </div>
          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </label>
      )}

      {/* Parse error */}
      {parseError && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl px-5 py-4">
          <XCircle size={20} className="text-red-500 dark:text-red-400 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300 flex-1">{parseError}</p>
          <button onClick={reset} className="text-xs text-red-500 dark:text-red-400 hover:underline">Try again</button>
        </div>
      )}

      {/* Applied success */}
      {applied && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/60 rounded-xl px-5 py-4">
          <CheckCircle size={20} className="text-green-600 dark:text-green-400 shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-300 flex-1">
            <span className="font-bold">{validRows.length} mapping{validRows.length !== 1 ? "s" : ""} applied</span> successfully.
          </p>
          <button onClick={reset} className="text-xs text-green-700 dark:text-green-300 font-medium border border-green-300 dark:border-green-800 px-3 py-1 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">Import another</button>
        </div>
      )}

      {/* Preview table */}
      {rows && !applied && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Preview — {rows.length} row{rows.length !== 1 ? "s" : ""} parsed
              </h3>
              <span className="flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/70 px-2 py-0.5 rounded-full dark:border dark:border-green-800/50">
                <CheckCircle2 size={11} /> {validRows.length} valid
              </span>
              {skipRows.length > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-950/70 px-2 py-0.5 rounded-full dark:border dark:border-yellow-800/50">
                  <SkipForward size={11} /> {skipRows.length} skip
                </span>
              )}
              {errorRows.length > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/70 px-2 py-0.5 rounded-full dark:border dark:border-red-800/50">
                  <XCircle size={11} /> {errorRows.length} error
                </span>
              )}
            </div>
            <button onClick={reset} className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              <X size={14} /> Cancel
            </button>
          </div>

          <div className="overflow-x-auto" style={{ maxHeight: 380, overflowY: "auto" }}>
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-100 dark:border-slate-800 sticky top-0">
                <tr>
                  {["#", "Faculty", "Student", "SII Score", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const sc = r.student ? scoreColor(r.student.siiScore) : null;
                  const rowBg = r.status === "valid"  ? "" :
                                r.status === "skip"   ? "bg-yellow-50 dark:bg-yellow-950/30" : "bg-red-50 dark:bg-red-950/30";
                  return (
                    <tr key={i} className={`border-b border-slate-50 dark:border-slate-800/60 ${rowBg}`}>
                      <td className="px-4 py-2.5 text-xs text-slate-400">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        {r.faculty ? (
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{r.faculty.name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{r.faculty.employeeId} · {r.faculty.department}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-red-500 dark:text-red-400 font-mono">{r.facId || "—"}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {r.student ? (
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{r.student.name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{r.student.rollNo} · {r.student.department}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-red-500 dark:text-red-400 font-mono">{r.rollNo || "—"}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {r.student && sc ? (
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold ${sc.text}`}>{r.student.siiScore}</span>
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
                              <div style={{ width: `${Math.min(100,(r.student.siiScore/1000)*100)}%`, height: "100%", borderRadius: 3, background: r.student.siiScore >= 750 ? "#16a34a" : r.student.siiScore >= 500 ? "#2563eb" : "#f97316" }} />
                            </div>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        {r.status === "valid" && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/70 px-2 py-0.5 rounded-full dark:border dark:border-green-800/50">
                            <CheckCircle2 size={10} /> Will map
                          </span>
                        )}
                        {r.status === "skip" && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-950/70 px-2 py-0.5 rounded-full dark:border dark:border-yellow-800/50">
                            <SkipForward size={10} /> Already mapped
                          </span>
                        )}
                        {r.status === "error" && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/70 px-2 py-0.5 rounded-full dark:border dark:border-red-800/50" title={r.error}>
                            <XCircle size={10} /> {r.error}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {validRows.length} mapping{validRows.length !== 1 ? "s" : ""} will be applied
              {skipRows.length > 0 && `, ${skipRows.length} skipped`}
              {errorRows.length > 0 && `, ${errorRows.length} ignored`}.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={reset} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium">Cancel</button>
              <button
                onClick={handleApply}
                disabled={validRows.length === 0}
                className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <CheckCircle2 size={15} />
                Apply {validRows.length} Mapping{validRows.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Range Mapping Tab ────────────────────────────────────────────────────────
function RangeMappingTab({ allFaculty, allStudents, mentorMappings, addMentee }) {
  const [facultyId,  setFacultyId]  = useState("");
  const [department, setDepartment] = useState("");
  const [year,       setYear]       = useState("");
  const [startNum,   setStartNum]   = useState("");
  const [endNum,     setEndNum]     = useState("");
  const [preview,    setPreview]    = useState(null); // null | array
  const [applied,    setApplied]    = useState(false);
  const [applyCount, setApplyCount] = useState(0);

  // Distinct departments from students
  const departments = [...new Set(allStudents.map((s) => s.department))].sort();

  // Distinct years from roll numbers (e.g. CS2021-045 → 2021)
  const years = [
    ...new Set(
      allStudents
        .map((s) => { const m = s.rollNo.match(/\d{4}/); return m ? m[0] : null; })
        .filter(Boolean)
    ),
  ].sort();

  const selectedFaculty = allFaculty.find((f) => f.id === facultyId);
  const mappedIds       = facultyId ? (mentorMappings[facultyId] || []) : [];

  const canPreview = facultyId && department && startNum !== "" && endNum !== "" &&
    parseInt(startNum) > 0 && parseInt(endNum) >= parseInt(startNum);

  const handlePreview = () => {
    if (!canPreview) return;
    const start = parseInt(startNum);
    const end   = parseInt(endNum);

    const matched = allStudents
      .filter((s) => {
        if (s.department !== department) return false;
        // optional year filter
        if (year) {
          const m = s.rollNo.match(/\d{4}/);
          if (!m || m[0] !== year) return false;
        }
        const parts = s.rollNo.split("-");
        const num   = parseInt(parts[parts.length - 1]);
        return !isNaN(num) && num >= start && num <= end;
      })
      .map((s) => ({ student: s, alreadyMapped: mappedIds.includes(s.id) }));

    setPreview(matched);
    setApplied(false);
  };

  const handleApply = () => {
    if (!preview) return;
    const toMap = preview.filter((p) => !p.alreadyMapped);
    toMap.forEach((p) => addMentee(facultyId, p.student.id));
    setApplyCount(toMap.length);
    setApplied(true);
    setPreview(null);
  };

  const reset = () => {
    setPreview(null); setApplied(false); setApplyCount(0);
    setStartNum(""); setEndNum(""); setYear(""); setDepartment(""); setFacultyId("");
  };

  const toMapCount   = preview ? preview.filter((p) => !p.alreadyMapped).length : 0;
  const alreadyCount = preview ? preview.filter((p) =>  p.alreadyMapped).length : 0;

  return (
    <div className="space-y-5">

      {/* ── Step 1 + 2 + 3 form card ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Sliders size={14} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Assign by Roll Number Range</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Step 1 – Faculty */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">1</span>
              Select Faculty
            </label>
            <select
              value={facultyId}
              onChange={(e) => { setFacultyId(e.target.value); setPreview(null); setApplied(false); }}
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="" className="dark:bg-slate-800">— Choose faculty —</option>
              {allFaculty.map((f) => (
                <option key={f.id} value={f.id} className="dark:bg-slate-800">
                  {f.name} ({f.employeeId} · {f.department})
                </option>
              ))}
            </select>
            {selectedFaculty && (
              <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                {(mentorMappings[facultyId] || []).length} mentees already assigned
              </p>
            )}
          </div>

          {/* Step 2 – Department */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              Select Department
            </label>
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPreview(null); setApplied(false); }}
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="" className="dark:bg-slate-800">— Choose department —</option>
              {departments.map((d) => (
                <option key={d} value={d} className="dark:bg-slate-800">{d}</option>
              ))}
            </select>
          </div>

          {/* Optional – Year */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Batch Year <span className="text-slate-400 dark:text-slate-500 font-normal">(optional)</span>
            </label>
            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setPreview(null); setApplied(false); }}
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="" className="dark:bg-slate-800">All years</option>
              {years.map((y) => (
                <option key={y} value={y} className="dark:bg-slate-800">{y}</option>
              ))}
            </select>
          </div>

          {/* Step 3 – Roll range */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">3</span>
              Start Roll No.
            </label>
            <div className="relative">
              <Hash size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="number" min="1" placeholder="e.g. 001"
                value={startNum}
                onChange={(e) => { setStartNum(e.target.value); setPreview(null); setApplied(false); }}
                className="w-full pl-7 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">3</span>
              End Roll No.
            </label>
            <div className="relative">
              <Hash size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="number" min="1" placeholder="e.g. 100"
                value={endNum}
                onChange={(e) => { setEndNum(e.target.value); setPreview(null); setApplied(false); }}
                className="w-full pl-7 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          {/* Preview button aligned to bottom */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handlePreview}
              disabled={!canPreview}
              className="flex items-center justify-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Search size={14} /> Preview Matches
            </button>
          </div>
        </div>

        {/* roll format hint */}
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          Roll numbers follow the format <span className="font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1 py-0.5 rounded">DEPT{"YYYY"}-NNN</span> (e.g. CS2021-045). Enter the numeric suffix (e.g. 1 to 100) to select a range.
        </p>
      </div>

      {/* ── Applied success ── */}
      {applied && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl px-5 py-4">
          <CheckCircle size={20} className="text-green-600 dark:text-green-400 shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-300 flex-1">
            <span className="font-bold">{applyCount} student{applyCount !== 1 ? "s" : ""}</span> mapped to{" "}
            <span className="font-bold">{selectedFaculty?.name}</span> successfully.
          </p>
          <button onClick={reset} className="text-xs text-green-700 dark:text-green-300 font-medium border border-green-300 dark:border-green-700 px-3 py-1 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40">
            Map another range
          </button>
        </div>
      )}

      {/* ── Preview table ── */}
      {preview && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {preview.length} student{preview.length !== 1 ? "s" : ""} matched
              </h3>
              <span className="flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/50 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={11} /> {toMapCount} will map
              </span>
              {alreadyCount > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-950/50 px-2 py-0.5 rounded-full">
                  <SkipForward size={11} /> {alreadyCount} already mapped
                </span>
              )}
              {preview.length === 0 && (
                <span className="text-xs text-slate-400 dark:text-slate-500">No students found in this range</span>
              )}
            </div>
            <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={14} />
            </button>
          </div>

          {preview.length > 0 && (
            <div className="overflow-x-auto" style={{ maxHeight: 360, overflowY: "auto" }}>
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 sticky top-0">
                  <tr>
                    {["#", "Student", "Roll No", "SII Score", "Status", "Mapping"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map(({ student: s, alreadyMapped }, i) => {
                    const sc = scoreColor(s.siiScore);
                    return (
                      <tr key={s.id} className={`border-b border-slate-50 dark:border-slate-800/60 ${alreadyMapped ? "bg-yellow-50/60 dark:bg-yellow-950/30" : ""}`}>
                        <td className="px-4 py-2.5 text-xs text-slate-400 dark:text-slate-500">{i + 1}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {s.avatar}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{s.name}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500">{s.year}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-xs font-mono text-slate-700 dark:text-slate-300">{s.rollNo}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold ${sc.text}`}>{s.siiScore}</span>
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
                              <div style={{ width: `${Math.min(100, (s.siiScore / 1000) * 100)}%`, height: "100%", borderRadius: 3, background: s.siiScore >= 750 ? "#16a34a" : s.siiScore >= 500 ? "#2563eb" : "#f97316" }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(s.status)}`}>{s.status}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          {alreadyMapped ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-950/50 px-2 py-0.5 rounded-full">
                              <SkipForward size={10} /> Already mapped
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={10} /> Will map
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {toMapCount} new mapping{toMapCount !== 1 ? "s" : ""} will be applied to{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedFaculty?.name}</span>.
              {alreadyCount > 0 && ` ${alreadyCount} already mapped will be skipped.`}
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setPreview(null)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium">Cancel</button>
              <button
                onClick={handleApply}
                disabled={toMapCount === 0}
                className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle2 size={15} />
                Apply {toMapCount} Mapping{toMapCount !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MentorMapping() {
  const {
    importedFaculty,
    importedStudents,
    mentorMappings,
    addMentee,
    removeMentee,
  } = useData();

  const allFaculty  = useMemo(() => [...SEED_FACULTY, ...importedFaculty],   [importedFaculty]);
  const allStudents = useMemo(() => [...SEED_STUDENTS, ...importedStudents],  [importedStudents]);

  const [activeTab, setActiveTab]                 = useState("manual"); // "manual" | "bulk"
  const [selectedFacultyId, setSelectedFacultyId] = useState(allFaculty[0]?.id || null);
  const [addSearch, setAddSearch]                 = useState("");
  const [facultySearch, setFacultySearch]         = useState("");

  const selectedFaculty = allFaculty.find((f) => f.id === selectedFacultyId) || null;

  // IDs already mapped to this faculty
  const mappedIds = selectedFacultyId ? (mentorMappings[selectedFacultyId] || []) : [];

  // Students assigned to selected faculty
  const assignedStudents = mappedIds
    .map((id) => allStudents.find((s) => s.id === id))
    .filter(Boolean);

  // Students NOT yet assigned to selected faculty (for the add pool)
  const availableStudents = allStudents.filter(
    (s) => !mappedIds.includes(s.id) &&
      (addSearch === "" ||
        s.name.toLowerCase().includes(addSearch.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(addSearch.toLowerCase()) ||
        s.department.toLowerCase().includes(addSearch.toLowerCase()))
  );

  // Faculty list (filtered by search)
  const filteredFaculty = allFaculty.filter(
    (f) =>
      facultySearch === "" ||
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.department.toLowerCase().includes(facultySearch.toLowerCase())
  );

  // Global stats
  const totalMapped    = Object.values(mentorMappings).reduce((sum, ids) => sum + ids.length, 0);
  const mappedFacCount = Object.values(mentorMappings).filter((ids) => ids.length > 0).length;
  const unmappedStuds  = allStudents.filter(
    (s) => !Object.values(mentorMappings).flat().includes(s.id)
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
                <UserCheck size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mentor Mapping</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 ml-12 text-sm">
              Assign students to faculty mentors. Mentees and their performance will appear in the Faculty page.
            </p>
          </div>
        </div>

        {/* ── Tab switcher ── */}
        <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 mb-6 w-fit shadow-sm">
          {[
            { id: "manual", icon: LayoutList, label: "Manual Mapping" },
            { id: "range",  icon: Sliders,    label: "Range Assign" },
            { id: "bulk",   icon: Upload,     label: "Bulk Import" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={15} />{label}
            </button>
          ))}
        </div>

        {/* ── Summary strip ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: UserCheck, label: "Faculty with Mentees", value: mappedFacCount,  color: "bg-violet-600", sub: `of ${allFaculty.length} total` },
            { icon: Users,     label: "Total Mappings",       value: totalMapped,     color: "bg-blue-600",   sub: "student-mentor pairs" },
            { icon: AlertCircle,label: "Unmapped Students",   value: unmappedStuds,   color: "bg-orange-500", sub: "no mentor yet" },
          ].map(({ icon: Icon, label, value, color, sub }) => (
            <div key={label} className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main two-panel layout ── */}
        {activeTab === "bulk" ? (
          <BulkMappingTab
            allFaculty={allFaculty}
            allStudents={allStudents}
            mentorMappings={mentorMappings}
            addMentee={addMentee}
          />
        ) : activeTab === "range" ? (
          <RangeMappingTab
            allFaculty={allFaculty}
            allStudents={allStudents}
            mentorMappings={mentorMappings}
            addMentee={addMentee}
          />
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left: Faculty list ── */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
            <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">Faculty</h2>
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search faculty…"
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1" style={{ maxHeight: 480 }}>
              {filteredFaculty.map((f) => {
                const count = (mentorMappings[f.id] || []).length;
                const isSelected = f.id === selectedFacultyId;
                return (
                  <button
                    key={f.id}
                    onClick={() => { setSelectedFacultyId(f.id); setAddSearch(""); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-slate-50 dark:border-slate-800/60 last:border-0 ${
                      isSelected ? "bg-violet-50 dark:bg-violet-950/40 border-l-2 border-l-violet-500" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {f.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isSelected ? "text-violet-900 dark:text-violet-200" : "text-slate-900 dark:text-slate-100"}`}>{f.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{f.designation} · {f.department}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {count > 0 && (
                        <span className="text-xs font-bold bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded-full">
                          {count}
                        </span>
                      )}
                      <ChevronRight size={14} className={isSelected ? "text-violet-400" : "text-slate-300 dark:text-slate-600"} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Right: Mapping panel ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {!selectedFaculty ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center py-20">
                <UserCheck size={40} className="text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-400 dark:text-slate-500 text-sm">Select a faculty member to manage their mentees</p>
              </div>
            ) : (
              <>
                {/* Faculty info banner */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-base shrink-0">
                    {selectedFaculty.avatar}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedFaculty.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{selectedFaculty.designation} · {selectedFaculty.department} · {selectedFaculty.employeeId}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-center">
                    <div>
                      <p className="text-2xl font-extrabold text-violet-700 dark:text-violet-400">{assignedStudents.length}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Mentees</p>
                    </div>
                    {assignedStudents.length > 0 && (
                      <div>
                        <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                          {Math.round(assignedStudents.reduce((s, m) => s + (m.siiScore || 0), 0) / assignedStudents.length)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Avg SII</p>
                      </div>
                    )}
                    {assignedStudents.length > 0 && (
                      <div>
                        <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">
                          {assignedStudents.filter((s) => s.status === "Active").length}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Two-column: assigned + add pool */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Assigned mentees */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                    <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Assigned Mentees
                        <span className="ml-2 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-1.5 py-0.5 rounded-full">
                          {assignedStudents.length}
                        </span>
                      </h3>
                      {assignedStudents.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <CheckCircle2 size={12} className="text-green-500 dark:text-green-400" />
                          {assignedStudents.filter((s) => s.status === "Active").length} active
                        </div>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ maxHeight: 380 }}>
                      {assignedStudents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-center">
                          <Users size={28} className="text-slate-300 dark:text-slate-600 mb-2" />
                          <p className="text-xs text-slate-400 dark:text-slate-500">No mentees assigned yet.</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">Use the panel on the right to add.</p>
                        </div>
                      ) : (
                        assignedStudents.map((s) => (
                          <MenteeChip
                            key={s.id}
                            student={s}
                            onRemove={(sid) => removeMentee(selectedFaculty.id, sid)}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add mentees pool */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                    <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
                        Add Students
                        <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">
                          {availableStudents.length} available
                        </span>
                      </h3>
                      <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <input
                          type="text"
                          placeholder="Search by name, roll, dept…"
                          value={addSearch}
                          onChange={(e) => setAddSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-0.5" style={{ maxHeight: 380 }}>
                      {availableStudents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-center">
                          <CheckCircle2 size={28} className="text-green-400 mb-2" />
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {addSearch ? "No students match your search." : "All students are already assigned."}
                          </p>
                        </div>
                      ) : (
                        availableStudents.map((s) => (
                          <AddStudentRow
                            key={s.id}
                            student={s}
                            onAdd={(sid) => addMentee(selectedFaculty.id, sid)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance summary table */}
                {assignedStudents.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Mentee Performance Overview</h3>
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1"><Clock size={11} /> Real-time SII data</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
                          <tr>
                            {["Student", "Dept", "Year", "SII Score", "Performance", "Status"].map((h) => (
                              <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {assignedStudents
                            .slice()
                            .sort((a, b) => (b.siiScore || 0) - (a.siiScore || 0))
                            .map((s, idx) => {
                              const sc = scoreColor(s.siiScore);
                              return (
                                <tr key={s.id} className={`border-b border-slate-50 dark:border-slate-800/60 ${idx % 2 === 1 ? "bg-slate-50/40 dark:bg-slate-800/20" : ""}`}>
                                  <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{s.avatar}</div>
                                      <div>
                                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{s.name}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{s.rollNo}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300">{s.department}</td>
                                  <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300">{s.year}</td>
                                  <td className="px-4 py-2.5">
                                    <span className={`text-sm font-bold ${sc.text}`}>{s.siiScore}</span>
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
                                        <div className={`h-full rounded-full`} style={{ width: `${Math.min(100, (s.siiScore / 1000) * 100)}%`, background: s.siiScore >= 750 ? "#16a34a" : s.siiScore >= 500 ? "#2563eb" : "#f97316" }} />
                                      </div>
                                      <span className="text-xs text-slate-400 dark:text-slate-500">{s.scoreLevel}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(s.status)}`}>{s.status}</span>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        )} {/* end activeTab */}
      </div>
    </div>
  );
}
