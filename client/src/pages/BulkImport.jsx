import { useState, useRef } from "react";
import { Upload, Download, Check, AlertCircle, FileText, X, CheckCircle2, Users, UserCheck } from "lucide-react";
import * as XLSX from "xlsx";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";

export default function BulkImport() {
  const navigate = useNavigate();
  const {
    addImportedStudents, clearImportedStudents, importedStudents,
    addImportedFaculty, clearImportedFaculty, importedFaculty,
  } = useData();
  const [activeTab, setActiveTab] = useState("students");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [parseError, setParseError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(null);
  const fileInputRef = useRef(null);
  const [importHistory, setImportHistory] = useState([
    {
      id: 1,
      fileName: "ECE_Dept_Faculty.csv",
      date: "Oct 24, 2023",
      type: "Faculty",
      records: 45,
      status: "completed",
    },
    {
      id: 2,
      fileName: "Mech_Students_2023.xlsx",
      date: "Oct 22, 2023",
      type: "Students",
      records: 180,
      status: "partial",
    },
    {
      id: 3,
      fileName: "Event_TechFest_Participants.csv",
      date: "Oct 15, 2023",
      type: "Events",
      records: null,
      status: "failed",
    },
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showReview, setShowReview] = useState(false);

  const tabConfig = {
    students: {
      title: "Import Students",
      template: "Students_Template.csv",
      fields: ["Name", "Roll No.", "Email", "Department", "Year", "Section", "Contact"],
    },
    faculty: {
      title: "Import Faculty",
      template: "Faculty_Template.csv",
      fields: ["Name", "Employee ID", "Email", "Department", "Designation", "Contact"],
    },
    events: {
      title: "Import Events",
      template: "Events_Template.csv",
      fields: ["Event Name", "Date", "Venue", "Participants"],
    },
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  function makeInitials(name) {
    return (name || "").split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "??";
  }

  // CSV parser (plain text)
  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1).map((line, idx) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row = { _rowIndex: idx + 2 };
      headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
      return row;
    }).filter((row) => Object.values(row).some((v) => v !== "" && v !== undefined));
  }

  // Excel parser using xlsx library → same shape as parseCSV output
  function parseExcel(arrayBuffer) {
    const wb = XLSX.read(arrayBuffer, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
    return data.map((row, idx) => ({ ...row, _rowIndex: idx + 2 }));
  }

  // Row → student object
  function rowToStudent(row, index) {
    const name = row["Name"] || row["name"] || "";
    const email = row["Email"] || row["email"] || "";
    const rollNo = row["Roll No."] || row["Roll No"] || row["rollNo"] || row["RollNo"] || "";
    return {
      id: `imported-${Date.now()}-${index}`,
      name,
      email,
      rollNo,
      department: row["Department"] || row["department"] || "—",
      section: row["Section"] || row["section"] || "—",
      year: row["Year"] || row["year"] || "—",
      siiScore: 0,
      scoreLevel: "Newly Imported",
      status: "Onboard Pending",
      lastActive: "Just imported",
      avatar: makeInitials(name),
      isImported: true,
    };
  }

  // Row → faculty object
  function rowToFaculty(row, index) {
    const name = row["Name"] || row["name"] || "";
    const email = row["Email"] || row["email"] || "";
    return {
      id: `fac-imported-${Date.now()}-${index}`,
      name,
      email,
      employeeId: row["Employee ID"] || row["EmployeeID"] || row["employee_id"] || "—",
      department: row["Department"] || row["department"] || "—",
      designation: row["Designation"] || row["designation"] || "Faculty",
      contact: row["Contact"] || row["contact"] || "—",
      status: "Active",
      avatar: makeInitials(name),
      isImported: true,
    };
  }
  // ─────────────────────────────────────────────────────────────────────────

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setParseError(null);
    setParsedRows([]);

    setUploadedFile({
      name: file.name,
      size: (file.size / 1024).toFixed(2),
      type: file.type,
      raw: file,
    });

    const isExcel = /\.xlsx?$/i.test(file.name);

    if (activeTab === "students" || activeTab === "faculty") {
      if (isExcel) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const rows = parseExcel(ev.target.result);
            if (rows.length === 0) {
              setParseError("No data rows found in the Excel file.");
            } else {
              setParsedRows(rows);
            }
          } catch (err) {
            setParseError("Failed to parse Excel file: " + err.message);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // CSV / plain text
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const rows = parseCSV(ev.target.result);
            if (rows.length === 0) {
              setParseError("No data rows found. Make sure the CSV has header + data rows.");
            } else {
              setParsedRows(rows);
            }
          } catch (err) {
            setParseError("Failed to parse file: " + err.message);
          }
        };
        reader.readAsText(file);
      }
    }

    setCurrentStep(2);
    // Reset the input so re-uploading same file works
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadTemplate = () => {
    const config = tabConfig[activeTab];
    const csv = [
      config.fields.join(","),
      ...Array(3)
        .fill(null)
        .map(() => config.fields.map(() => "").join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = config.template;
    a.click();
  };

  const handleStartImport = () => {
    setShowReview(true);
    setCurrentStep(3);
  };

  const handleConfirmImport = () => {
    let count = parsedRows.length;

    if (activeTab === "students" && parsedRows.length > 0) {
      const students = parsedRows.map((row, i) => rowToStudent(row, i));
      addImportedStudents(students);
      count = students.length;
    } else if (activeTab === "faculty" && parsedRows.length > 0) {
      const faculty = parsedRows.map((row, i) => rowToFaculty(row, i));
      addImportedFaculty(faculty);
      count = faculty.length;
    }

    const newImport = {
      id: importHistory.length + 1,
      fileName: uploadedFile.name,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      type: tabConfig[activeTab].title.split(" ")[1],
      records: count || Math.floor(Math.random() * 200),
      status: "completed",
    };

    setImportHistory([newImport, ...importHistory]);
    setImportSuccess({ count: count, type: activeTab === "faculty" ? "faculty" : "student" });
    resetImport();
  };

  const resetImport = () => {
    setUploadedFile(null);
    setCurrentStep(1);
    setShowReview(false);
    setParsedRows([]);
    setParseError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Success Modal ─────────────────────────────────────────── */}
        {importSuccess !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 size={36} className="text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-1">Import Successful!</h2>
              <p className="text-slate-500 text-sm mb-6">
                {importSuccess.count} {importSuccess.type}{importSuccess.count !== 1 ? "s" : ""} have been added successfully.
              </p>

              {/* Stat pill */}
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-6 py-4 mb-8 w-full justify-center">
                {importSuccess.type === "student" ? (
                  <Users size={22} className="text-blue-600" />
                ) : (
                  <UserCheck size={22} className="text-purple-600" />
                )}
                <div>
                  <p className="text-3xl font-extrabold text-slate-900">{importSuccess.count}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    {importSuccess.type}{importSuccess.count !== 1 ? "s" : ""} imported
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setImportSuccess(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Stay Here
                </button>
                <button
                  onClick={() => {
                    setImportSuccess(null);
                    navigate(importSuccess.type === "student" ? "/students" : "/faculty");
                  }}
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors ${
                    importSuccess.type === "student"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  View {importSuccess.type === "student" ? "Students" : "Faculty"} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bulk Data Import
          </h1>
          <p className="text-slate-600">
            Import student, faculty, and event data in bulk using CSV or Excel
            files
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-8">
            {Object.entries(tabConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  resetImport();
                }}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === key
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {config.title}
              </button>
            ))}
          </div>

          {/* Steps Indicator */}
          <div className="flex justify-between mb-12">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {step < currentStep ? <Check size={20} /> : step}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-slate-900">
                    {step === 1
                      ? "Download Template"
                      : step === 2
                        ? "Fill Data"
                        : "Upload & Review"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {step === 1
                      ? "Get the CSV template with required fields like Name, Roll No., Email"
                      : step === 2
                        ? "Add student details ensuring email uniqueness and valid roll numbers."
                        : "Upload the file, review for any errors, and confirm import."}
                  </p>
                </div>
                {step < 3 && (
                  <div className="flex-1 mx-4 h-1 bg-slate-200"></div>
                )}
              </div>
            ))}
          </div>

          {/* Content based on current step */}
          {currentStep === 1 && !uploadedFile && (
            <div className="text-center">
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Download size={20} />
                Download Template
              </button>
              <p className="text-slate-600 mt-4">
                Template: {tabConfig[activeTab].template}
              </p>
            </div>
          )}

          {(currentStep === 1 || currentStep === 2) && (
            <div className="mt-8">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-input"
                  ref={fileInputRef}
                />
                <label
                  htmlFor="file-input"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload size={48} className="text-slate-400 mb-4" />
                  <p className="text-lg font-medium text-slate-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    CSV, XLS, XLSX (Max 10MB)
                  </p>
                </label>

                {uploadedFile && (
                  <div className="mt-6 bg-white p-4 rounded border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-green-600" />
                        <div className="text-left">
                          <p className="font-medium text-slate-900">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {uploadedFile.size} KB
                          </p>
                        </div>
                      </div>
                      <Check size={20} className="text-green-600" />
                    </div>
                  </div>
                )}
              </div>

              {uploadedFile && currentStep === 2 && (
                <div className="mt-6 flex gap-4 justify-center">
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="px-6 py-2 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Remove File
                  </button>
                  <button
                    onClick={handleStartImport}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Review & Upload
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && showReview && (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex gap-4">
                  <AlertCircle
                    size={24}
                    className="text-blue-600 shrink-0 mt-1"
                  />
                  <div>
                    <p className="font-medium text-blue-900">
                      Review before importing
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Please check the data preview below. Any errors will be
                      reported after import.
                    </p>
                  </div>
                </div>
              </div>

              {parseError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-600 shrink-0" />
                  <p className="text-sm text-red-700">{parseError}</p>
                </div>
              )}

              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="font-medium text-slate-900 mb-4">
                  Import Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">File Name</p>
                    <p className="font-medium text-slate-900">
                      {uploadedFile.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Import Type</p>
                    <p className="font-medium text-slate-900">
                      {tabConfig[activeTab].title.split(" ")[1]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">File Size</p>
                    <p className="font-medium text-slate-900">
                      {uploadedFile.size} KB
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Records Detected</p>
                    <p className="font-medium text-slate-900">
                      {parsedRows.length > 0 ? parsedRows.length : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Preview Table (students + faculty) */}
              {(activeTab === "students" || activeTab === "faculty") && parsedRows.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-slate-900 mb-3">
                    Data Preview{" "}
                    <span className="text-slate-500 font-normal text-sm">
                      (showing first {Math.min(parsedRows.length, 5)} of {parsedRows.length} rows)
                    </span>
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100">
                        <tr>
                          {Object.keys(parsedRows[0])
                            .filter((k) => k !== "_rowIndex")
                            .map((h) => (
                              <th
                                key={h}
                                className="text-left px-3 py-2 font-medium text-slate-700 whitespace-nowrap"
                              >
                                {h}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedRows.slice(0, 5).map((row, i) => (
                          <tr
                            key={i}
                            className="border-t border-slate-100 hover:bg-slate-50"
                          >
                            {Object.entries(row)
                              .filter(([k]) => k !== "_rowIndex")
                              .map(([k, v]) => (
                                <td
                                  key={k}
                                  className="px-3 py-2 text-slate-700 whitespace-nowrap"
                                >
                                  {v || <span className="text-slate-400">—</span>}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetImport}
                  className="px-6 py-2 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={
                    (activeTab === "students" || activeTab === "faculty") &&
                    parsedRows.length === 0
                  }
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Import Process
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Import History */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Import History</h2>
            <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
              View All Logs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    File Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Records
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {importHistory.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" />
                        <span className="text-slate-900 font-medium">
                          {record.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{record.date}</td>
                    <td className="py-3 px-4 text-slate-600">{record.type}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {record.records || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : record.status === "partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status === "completed"
                          ? "Completed"
                          : record.status === "partial"
                            ? "Partial (2 Failed)"
                            : "Failed"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-slate-600 hover:text-slate-900">
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
