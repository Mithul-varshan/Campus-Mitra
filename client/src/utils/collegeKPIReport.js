import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateCollegeKPIReport({
  instituteName = "Dhanalakshmi Srinivasan University",
  academicYear = "2024-25"
} = {}) {
  const doc = new jsPDF("l", "mm", "a4");
  const W = doc.internal.pageSize.getWidth();
  const M = 12;
  const TW = W - 2 * M;
  let y = 12;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(instituteName, W / 2, y, { align: "center" });
  doc.setFontSize(11);
  doc.text("College KPI Dashboard Report", W / 2, y + 7, { align: "center" });
  doc.setFontSize(9);
  doc.text(`Academic Year: ${academicYear}`, W / 2, y + 13, { align: "center" });
  y += 20;

  autoTable(doc, {
    startY: y,
    head: [[
      "KPI",
      "2024-25",
      "2023-24",
      "2022-23"
    ]],
    body: [
      ["Total Students", "1980", "1925", "1880"],
      ["Total Faculty", "110", "105", "102"],
      ["Student-Faculty Ratio", "18:1", "18:1", "18:1"],
      ["Graduation Rate (%)", "92.5", "91.2", "90.8"],
      ["Placement Rate (%)", "87.3", "85.1", "83.7"],
      ["Average Package (INR)", "5,80,000", "5,20,000", "4,80,000"],
      ["Research Publications", "28", "22", "18"],
      ["Patents Filed", "6", "4", "3"],
      ["Capstone Projects", "32", "28", "25"],
      ["Student Awards", "14", "12", "10"],
      ["Faculty FDPs", "18", "15", "13"],
      ["MOUs Signed", "7", "5", "4"],
      ["Industry Projects", "9", "7", "6"],
      ["Internships Completed", "120", "110", "98"],
      ["NBA Compliance (%)", "100", "100", "100"]
    ],
    styles: { fontSize: 7, cellPadding: 1.4 },
    headStyles: { fillColor: [240,240,240], textColor: [30,30,30], fontStyle: "bold" },
    margin: { left: M, right: M },
    tableWidth: TW
  });

  doc.save(`College_KPI_Report_${academicYear.replace(/\s+/g,"_")}.pdf`);
}
