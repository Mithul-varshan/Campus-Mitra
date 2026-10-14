import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* â”€â”€ Palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const DARK = [30, 30, 30];
const GRAY = [100, 100, 100];
const LIGHT_G = [240, 240, 240]; // #f0f0f0 â€” header fills
const MID_G = [220, 220, 220]; // sub-header row fill
const BORDER = [190, 190, 190];

/* â”€â”€ Shared helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function centeredText(doc, text, y, size = 10, style = "normal", color = DARK) {
  doc.setFontSize(size);
  doc.setFont("helvetica", style);
  doc.setTextColor(...color);
  doc.text(text, doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
}

/** #f0f0f0 banner with dark bold text */
function sectionHeader(doc, text, y, W) {
  doc.setFillColor(...LIGHT_G);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.rect(10, y - 4, W - 20, 7, "FD");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(text, 14, y);
  return y + 5;
}

/** Bold sub-section label */
function subHeader(doc, text, y, M) {
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(text, M, y);
  return y + 5;
}

function addPageNumber(doc) {
  const n = doc.internal.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i);
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    doc.text(`Page ${i} of ${n}`, w - 12, h - 4, { align: "right" });
    doc.text("CampusMitra", 12, h - 4);
  }
}

/* Shared table defaults â€” #f0f0f0 head, dark text everywhere */
const BASE = {
  styles: { fontSize: 6.5, cellPadding: 1.4, lineColor: BORDER, lineWidth: 0.2, textColor: DARK, overflow: "linebreak" },
  headStyles: { fillColor: LIGHT_G, textColor: DARK, fontStyle: "bold", fontSize: 6.5, lineColor: BORDER, lineWidth: 0.2 },
  alternateRowStyles: { fillColor: [248, 248, 248] },
};

/* Sub-header row embedded inside a table body */
const SUB_ROW = { fontStyle: "bold", fillColor: MID_G, textColor: DARK };

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NIRF REPORT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export function generateNIRFReport({
  dateFrom,
  dateTo,
  subReportName,
  instituteName = "Dhanalakshmi Srinivasan University",
  instituteCode = "IR-E-C-00000",
}) {
  const toYear = dateTo ? parseInt(dateTo.slice(0, 4)) : new Date().getFullYear();
  const fromYear = dateFrom ? parseInt(dateFrom.slice(0, 4)) : toYear - 1;
  const ay = (y) => `${y}-${String(y + 1).slice(-2)}`;
  const yrs = [toYear - 1, toYear - 2, toYear - 3, toYear - 4, toYear - 5, toYear - 6];

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 10;
  const TW = W - M * 2;
  const T = { ...BASE, margin: { left: M, right: M }, tableWidth: TW };

  /* â”€â”€ PAGE 1 â”€â”€ */
  let y = 12;

  doc.setFillColor(...LIGHT_G);
  doc.setDrawColor(...BORDER); doc.setLineWidth(0.3);
  doc.rect(M, y - 4, TW, 26, "FD");
  centeredText(doc, "National Institutional Ranking Framework", y + 2, 11, "bold", DARK);
  centeredText(doc, "Ministry of Education  |  Government of India", y + 8, 8, "normal", GRAY);
  centeredText(doc, "Welcome to Data Capturing System: ENGINEERING", y + 14, 8, "bold", DARK);
  y += 26;

  doc.setLineWidth(0.2); doc.setDrawColor(...BORDER);
  doc.line(M, y, W - M, y); y += 4;

  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
  doc.text(`Submitted Institute Data for NIRF'${toYear}`, M, y); y += 4;
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(...GRAY);
  doc.text(`Institute Name: ${instituteName} [${instituteCode}]`, M, y); y += 4;
  doc.text(`Reporting Period: ${ay(fromYear)} to ${ay(toYear - 1)}`, M, y); y += 5;

  y = sectionHeader(doc, "Sanctioned (Approved) Intake", y, W);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Academic Year", ay(yrs[0]), ay(yrs[1]), ay(yrs[2]), ay(yrs[3]), ay(yrs[4]), ay(yrs[5])]],
    body: [
      ["UG [4 Years Program(s)]", "180", "180", "180", "180", "180", "180"],
      ["PG [2 Year Program(s)]", "18", "18", "18", "18", "18", "18"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = sectionHeader(doc, "Total Actual Student Strength (Program(s) Offered by Your Institution)", y, W);
  autoTable(doc, {
    ...T, startY: y,
    styles: { ...T.styles, fontSize: 5.5 }, headStyles: { ...T.headStyles, fontSize: 5.5 },
    head: [[
      "All programs\n(all years)", "No. of Male\nStudents", "No. of Female\nStudents", "Total\nStudents",
      "Within State\n(M & F)", "Outside State\n(M & F)", "Outside\nCountry", "Economically\nBackward",
      "Socially\nChallenged\n(SC+ST+OBC)", "Full Tuition\nReimb.\nState/Govt", "Full Tuition\nReimb.\nInstitution",
      "Full Tuition\nReimb.\nPrivate Bodies", "Not Receiving\nFull Tuition\nReimb.",
    ]],
    body: [
      ["UG [4 Years\nProgram(s)]", "45", "625", "670", "650", "20", "0", "180", "245", "120", "0", "0", "305"],
      ["PG [2 Year\nProgram(s)]", "8", "32", "40", "40", "0", "0", "10", "15", "8", "0", "0", "17"],
    ],
    columnStyles: {
      0: { cellWidth: 22 }, 1: { cellWidth: 13 }, 2: { cellWidth: 13 }, 3: { cellWidth: 13 },
      4: { cellWidth: 17 }, 5: { cellWidth: 17 }, 6: { cellWidth: 13 }, 7: { cellWidth: 17 },
      8: { cellWidth: 21 }, 9: { cellWidth: 21 }, 10: { cellWidth: 21 }, 11: { cellWidth: 21 }, 12: { cellWidth: 21 },
    },
  });
  y = doc.lastAutoTable.finalY + 3;

  y = sectionHeader(doc, "Placement & Higher Studies", y, W);
  y = subHeader(doc, "UG [4 Years Program(s)]: Placement & higher studies for previous 3 years", y, M);
  autoTable(doc, {
    ...T, startY: y,
    styles: { ...T.styles, fontSize: 6 }, headStyles: { ...T.headStyles, fontSize: 6 },
    head: [["Academic Year", "No. of first year\nstudents intake\nin year", "No. of first year\nstudents admitted\nin year",
      "Academic Year", "No. of students\nadmitted through\nLateral entry", "Academic Year",
      "No. of students\ngraduating in\nmin. stipulated time", "No. of students\nplaced",
      "Median salary of\nplaced graduates\n(Amount in Rs.)", "No. of students\nselected for\nHigher Studies"]],
    body: [
      [ay(toYear - 6), "180", "165", ay(toYear - 5), "25", ay(toYear - 3), "182", "145", "450000\n(Four Lac Fifty Thousand only)", "28"],
      [ay(toYear - 5), "180", "170", ay(toYear - 4), "28", ay(toYear - 2), "188", "158", "520000\n(Five Lac Twenty Thousand only)", "22"],
      [ay(toYear - 4), "180", "168", ay(toYear - 3), "30", ay(toYear - 1), "192", "165", "580000\n(Five Lac Eighty Thousand only)", "18"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "PG [2 Years Program(s)]: Placement & higher studies for previous 3 years", y, M);
  autoTable(doc, {
    ...T, startY: y,
    styles: { ...T.styles, fontSize: 6 }, headStyles: { ...T.headStyles, fontSize: 6 },
    head: [["Academic Year", "No. of first year\nstudents intake\nin year", "No. of first year\nstudents admitted\nin year",
      "Academic Year", "No. of students\ngraduating in\nmin. stipulated time",
      "No. of students\nplaced", "Median salary of\nplaced graduates\n(Amount in Rs.)", "No. of students\nselected for\nHigher Studies"]],
    body: [
      [ay(toYear - 4), "18", "15", ay(toYear - 3), "13", "8", "650000\n(Six Lac Fifty Thousand only)", "3"],
      [ay(toYear - 3), "18", "16", ay(toYear - 2), "14", "10", "720000\n(Seven Lac Twenty Thousand only)", "2"],
      [ay(toYear - 2), "18", "18", ay(toYear - 1), "16", "12", "780000\n(Seven Lac Eighty Thousand only)", "2"],
    ],
  });

  /* â”€â”€ PAGE 2 â”€â”€ */
  doc.addPage(); y = 12;

  y = sectionHeader(doc, "Ph.D Student Details", y, W);
  autoTable(doc, {
    ...T, startY: y,
    head: [[{ content: `Ph.D â€” Students pursuing doctoral program till ${toYear - 1}-${String(toYear).slice(-2)}`, colSpan: 2 }],
    ["", "Total Students"]],
    body: [
      ["Full Time", "0"], ["Part Time", "0"],
      [{ content: "No. of Ph.D students graduated (including Integrated Ph.D)", colSpan: 2, styles: SUB_ROW }],
      ["Full Time", "0 / 0 / 0"], ["Part Time", "0 / 0 / 0"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = sectionHeader(doc, "Financial Resources: Utilised Amount for Capital Expenditure â€” previous 3 years", y, W);
  autoTable(doc, {
    ...T, startY: y,
    head: [
      [{ content: "Academic Year", rowSpan: 2 }, { content: ay(toYear - 1) }, { content: ay(toYear - 2) }, { content: ay(toYear - 3) }],
      ["Utilised Amount", "Utilised Amount", "Utilised Amount"],
      [{ content: "Annual Capital Expenditure on Academic Activities and Resources (excl. buildings)", colSpan: 4, styles: SUB_ROW }],
    ],
    body: [
      ["Library (Books, Journals and e-Resources only)", "245000 (Two Lac Forty Five Thousand)", "198000 (One Lac Ninety Eight Thousand)", "175000 (One Lac Seventy Five Thousand)"],
      ["New Equipment and software for Laboratories", "3250000 (Thirty Two Lac Fifty Thousand)", "2850000 (Twenty Eight Lac Fifty Thousand)", "2450000 (Twenty Four Lac Fifty Thousand)"],
      ["Engineering Workshops", "125000 (One Lac Twenty Five Thousand)", "98000 (Ninety Eight Thousand)", "85000 (Eighty Five Thousand)"],
      ["Other expenditure on Capital Assets", "175000 (One Lac Seventy Five Thousand)", "150000 (One Lac Fifty Thousand)", "125000 (One Lac Twenty Five Thousand)"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = sectionHeader(doc, "Financial Resources: Utilised Amount for Operational Expenditure â€” previous 3 years", y, W);
  autoTable(doc, {
    ...T, startY: y,
    head: [
      [{ content: "Academic Year", rowSpan: 2 }, { content: ay(toYear - 1) }, { content: ay(toYear - 2) }, { content: ay(toYear - 3) }],
      ["Utilised Amount", "Utilised Amount", "Utilised Amount"],
      [{ content: "Annual Operational Expenditure", colSpan: 4, styles: SUB_ROW }],
    ],
    body: [
      ["Salaries (Teaching and Non Teaching staff)", "45500000 (Four Crore Fifty Five Lac)", "42800000 (Four Crore Twenty Eight Lac)", "39500000 (Three Crore Ninety Five Lac)"],
      ["Maintenance of Academic Infrastructure and other running expenditures", "1850000 (Eighteen Lac Fifty Thousand)", "1650000 (Sixteen Lac Fifty Thousand)", "1450000 (Fourteen Lac Fifty Thousand)"],
      ["Seminars/Conferences/Workshops", "385000 (Three Lac Eighty Five Thousand)", "325000 (Three Lac Twenty Five Thousand)", "285000 (Two Lac Eighty Five Thousand)"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = sectionHeader(doc, "IPR", y, W);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Calendar year", String(toYear - 1), String(toYear - 2), String(toYear - 3)]],
    body: [["No. of Patents Published", "4", "3", "2"], ["No. of Patents Granted", "2", "1", "1"]],
  });

  /* â”€â”€ PAGE 3 â”€â”€ */
  doc.addPage(); y = 12;

  y = sectionHeader(doc, "Sponsored Research Details", y, W);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Financial Year", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [
      ["Total no. of Sponsored Projects", "2", "1", "1"],
      ["Total no. of Funding Agencies", "2", "1", "1"],
      ["Total Amount Received (Amount in Rs.)", "285000", "150000", "150000"],
      ["Amount Received in Words", "Two Lac Eighty Five Thousand only", "One Lac Fifty Thousand only", "One Lac Fifty Thousand only"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = sectionHeader(doc, "Consultancy Project Details", y, W);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Financial Year", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [
      ["Total no. of Consultancy Projects", "0", "0", "0"],
      ["Total no. of Client Organizations", "0", "0", "0"],
      ["Total Amount Received (Amount in Rs.)", "0", "0", "0"],
      ["Amount Received in Words", "Zero", "Zero", "Zero"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = sectionHeader(doc, "PCS Facilities: Facilities of physically challenged students", y, W);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Question", "Response"]],
    body: [
      ["1. Do your institution buildings have Lifts/Ramps?", "Yes, more than 80% of the buildings"],
      ["2. Do your institution have provision for walking aids, including wheelchairs and transportation from one building to another for handicapped students?", "Yes"],
      ["3. Do your institution buildings have specially designed toilets for handicapped students?", "Yes, more than 80% of the buildings"],
    ],
    columnStyles: { 0: { cellWidth: 160 } },
  });
  y = doc.lastAutoTable.finalY + 3;

  y = sectionHeader(doc, "Faculty Details", y, W);
  autoTable(doc, {
    ...T, startY: y,
    styles: { ...T.styles, fontSize: 6 }, headStyles: { ...T.headStyles, fontSize: 6 },
    head: [["Srno", "Name", "Age", "Designation", "Gender", "Qualification", "Experience\n(In Months)", "Currently\nWorking?", "Joining Date", "Leaving Date", "Association\nType"]],
    body: [
      ["1", "Dr. Rajesh Kumar", "45", "Professor", "Male", "Ph.D", "240", "Yes", "15-07-2010", "–", "Regular"],
      ["2", "Dr. Priya Sharma", "38", "Associate Professor", "Female", "Ph.D", "156", "Yes", "10-08-2012", "–", "Regular"],
      ["3", "Arun Patel", "42", "Assistant Professor", "Male", "M.Tech", "180", "Yes", "20-06-2011", "–", "Regular"],
      ["4", "Sneha Reddy", "35", "Assistant Professor", "Female", "M.Tech", "120", "Yes", "05-09-2015", "–", "Regular"],
      ["5", "Dr. Karthik Iyer", "40", "Associate Professor", "Male", "Ph.D", "168", "Yes", "12-07-2013", "–", "Regular"],
    ],
    columnStyles: {
      0: { cellWidth: 10 }, 1: { cellWidth: 34 }, 2: { cellWidth: 10 }, 3: { cellWidth: 32 },
      4: { cellWidth: 14 }, 5: { cellWidth: 20 }, 6: { cellWidth: 16 }, 7: { cellWidth: 16 },
      8: { cellWidth: 20 }, 9: { cellWidth: 20 }, 10: { cellWidth: 22 },
    },
  });

  addPageNumber(doc);
  doc.save(`NIRF_Report_${toYear}_${instituteName.replace(/\s+/g, "_")}.pdf`);
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NAAC REPORT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export function generateNAACReport({
  dateFrom,
  dateTo,
  subReportName,
  instituteName = "Dhanalakshmi Srinivasan University",
  instituteCode = "NAAC-A-00000",
}) {
  const toYear = dateTo ? parseInt(dateTo.slice(0, 4)) : new Date().getFullYear();
  const fromYear = dateFrom ? parseInt(dateFrom.slice(0, 4)) : toYear - 1;
  const ay = (y) => `${y}-${String(y + 1).slice(-2)}`;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 12;
  const TW = W - M * 2;
  const T = { ...BASE, margin: { left: M, right: M }, tableWidth: TW };

  /* â”€â”€ PAGE 1 â€” Cover â”€â”€ */
  let y = 10;

  doc.setFillColor(...LIGHT_G);
  doc.setDrawColor(...BORDER); doc.setLineWidth(0.3);
  doc.rect(0, 0, W, 20, "FD");
  centeredText(doc, "NATIONAL ASSESSMENT AND ACCREDITATION COUNCIL (NAAC)", 10, 10, "bold", DARK);
  centeredText(doc, "Accreditation Data Report", 17, 8, "normal", GRAY);

  y = 28;
  doc.setFillColor(...LIGHT_G);
  doc.setDrawColor(...BORDER); doc.setLineWidth(0.4);
  doc.rect(M, y, TW, 50, "FD");

  centeredText(doc, instituteName, y + 11, 13, "bold", DARK);
  centeredText(doc, `[${instituteCode}]`, y + 18, 8, "normal", GRAY);
  doc.setDrawColor(...BORDER); doc.setLineWidth(0.2);
  doc.line(M + 16, y + 22, W - M - 16, y + 22);
  centeredText(doc, "Accreditation Report", y + 28, 10, "bold", DARK);
  centeredText(doc, subReportName || "Criterion-wise Student Data Report", y + 35, 8, "normal", DARK);
  centeredText(doc, `Reporting Period: ${ay(fromYear)} to ${ay(toYear - 1)}`, y + 41, 7, "normal", GRAY);
  centeredText(doc, `Report Year: ${toYear}`, y + 46, 7, "normal", GRAY);

  y += 56;

  autoTable(doc, {
    ...T, startY: y,
    theme: "grid",
    body: [
      ["Report Type", "NAAC â€” Self Study Report (SSR) Data"],
      ["Report Name", subReportName || "Student Participation & Engagement Report"],
      ["Prepared For", `Year ${toYear}`],
      ["Reporting Period", `${ay(fromYear)} to ${ay(toYear - 1)}`],
      ["Institute", instituteName],
      ["Institute Code", instituteCode],
      ["Date Generated", new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })],
      ["Status", "Draft â€” For Internal Review"],
    ],
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 44, fillColor: LIGHT_G, textColor: DARK } },
  });
  y = doc.lastAutoTable.finalY + 3;
  centeredText(doc, "Auto-generated by CampusMitra for NAAC accreditation preparation.", y, 7, "italic", GRAY);
  centeredText(doc, "Contains sample/representative institutional data.", y + 4, 7, "italic", GRAY);

  /* â”€â”€ PAGE 2 â€” Criterion I & II â”€â”€ */
  doc.addPage(); y = 12;
  y = sectionHeader(doc, "CRITERION I & II â€” Students & Teaching-Learning Environment", y, W);

  y = subHeader(doc, "1.1  Student Enrollment Trend", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Program", ay(toYear - 5), ay(toYear - 4), ay(toYear - 3), ay(toYear - 2), ay(toYear - 1)]],
    body: [
      ["B.E. / B.Tech", "180", "180", "180", "180", "180"],
      ["M.E. / M.Tech", "18", "18", "18", "18", "18"],
      ["Ph.D", "0", "0", "0", "0", "0"],
      [{ content: "Total", styles: { fontStyle: "bold" } }, "198", "198", "198", "198", "198"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "1.2  Gender Distribution of Students", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Academic Year", "Male Students", "Female Students", "Total Students", "Female %"]],
    body: [[ay(toYear - 1), "285", "425", "710", "59.9%"], [ay(toYear - 2), "280", "405", "685", "59.1%"], [ay(toYear - 3), "275", "390", "665", "58.6%"]],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "1.3  State-wise Student Distribution", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Category", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [["Within State Students", "680", "660", "640"], ["Outside State Students", "30", "25", "25"], ["Outside Country", "0", "0", "0"]],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "1.4  Economically Weaker & Socially Challenged Students", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Category", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [
      ["Economically Backward", "185", "180", "175"],
      ["Socially Challenged (SC+ST+OBC)", "280", "270", "265"],
      ["Full tuition fee reimb. (Govt)", "165", "158", "152"],
      ["Full tuition fee reimb. (Institution)", "0", "0", "0"],
      ["Not receiving any fee reimb.", "360", "355", "348"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "2.1  Teaching & Learning Quality Indicators", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Indicator", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [
      ["Student-Teacher Ratio", "18:1", "18:1", "19:1"],
      ["Faculty with Ph.D", "15", "14", "12"],
      ["Visiting Faculty / Guest Lectures", "24", "22", "20"],
      ["NPTEL / MOOC Enrolments", "185", "165", "145"],
      ["Value Added Courses Offered", "12", "10", "8"],
    ],
  });

  /* â”€â”€ PAGE 3 â€” Criterion III â”€â”€ */
  doc.addPage(); y = 12;
  y = sectionHeader(doc, "CRITERION III â€” Research, Innovation & Extension Activities", y, W);

  y = subHeader(doc, "3.1  Student Research & Innovation Participation", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Activity", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [
      ["Students participated in Hackathons", "125", "110", "95"],
      ["Students with Research Publications", "8", "6", "5"],
      ["Mini-Projects Completed", "165", "155", "140"],
      ["Capstone Projects Completed", "85", "78", "72"],
      ["Patents Filed by Students", "2", "1", "1"],
      ["Startups / Entrepreneurship Ventures", "3", "2", "1"],
      ["Awards Won at National Level", "12", "10", "8"],
      ["Awards Won at State Level", "28", "24", "20"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "3.2  Sponsored Research & Consultancy", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Parameter", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [
      ["Sponsored Projects", "2", "1", "1"], ["Funding Agencies", "2", "1", "1"], ["Total Amount Received (₹)", "285000", "150000", "150000"], ["Consultancy Projects", "0", "0", "0"], ["Consultancy Revenue (₹)", "0", "0", "0"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "3.3  IPR – Patents & Publications", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Category", "2022", "2021", "2020"]],
    body: [["Patents Published", "4", "3", "2"], ["Patents Granted", "2", "1", "1"], ["Journal Publications (Faculty)", "15", "12", "10"], ["Conference Papers", "8", "6", "5"]],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "3.4  Extension & Outreach Activities", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Activity", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [["NSS / NCC Activities", "5", "4", "3"], ["Community Service Events", "3", "2", "2"], ["Blood Donation Camps", "2", "2", "1"], ["Students Benefited (Outreach)", "250", "200", "180"]],
  });

  /* â”€â”€ PAGE 4 â€” Criterion V â”€â”€ */
  doc.addPage(); y = 12;
  y = sectionHeader(doc, "CRITERION V â€” Student Support & Progression", y, W);

  y = subHeader(doc, "5.1  Student Placement & Higher Studies", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Parameter", ay(toYear - 3), ay(toYear - 2), ay(toYear - 1)]],
    body: [
      ["UG Students Graduating", "226", "216", "224"], ["Students Placed", "184", "196", "151"],
      ["Placement % (UG)", "81.4%", "90.7%", "67.4%"], ["Median Salary (UG) (â‚¹)", "3,50,000", "4,00,000", "5,40,000"],
      ["Students for Higher Studies", "16", "4", "8"], ["PG Students Graduating", "0", "2", "2"], ["PG Students Placed", "0", "0", "0"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "5.2  Scholarships & Financial Aid", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Scheme", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [["Govt. Scholarship Beneficiaries", "320", "298", "285"], ["Institute Scholarship Beneficiaries", "45", "38", "32"], ["Total Scholarship Amount (₹)", "2850000", "2550000", "2300000"], ["Students with Education Loans", "125", "118", "110"]],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "5.3  Student Achievements & Recognition", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Category", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [
      ["National Level Competitions â€” Top 3", "18", "14", "12"], ["State Level Competitions â€” Top 3", "42", "38", "30"],
      ["Internal Events Conducted", "28", "22", "18"], ["Students Participated in Events", "850", "780", "720"], ["Inter-college Events Won", "12", "9", "8"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "5.4  Alumni Engagement", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Parameter", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [["Alumni Guest Lectures Delivered", "12", "10", "8"], ["Alumni Mentoring Students", "35", "28", "22"], ["Alumni Contributions (₹)", "450000", "380000", "320000"]],
  });

  /* â”€â”€ PAGE 5 â€” Criterion VI â”€â”€ */
  doc.addPage(); y = 12;
  y = sectionHeader(doc, "CRITERION VI â€” Governance, Leadership & Management", y, W);

  y = subHeader(doc, "6.1  Financial Management & Resource Mobilisation", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Expenditure Head", ay(toYear - 1) + " (â‚¹)", ay(toYear - 2) + " (â‚¹)", ay(toYear - 3) + " (â‚¹)"]],
    body: [
      ["Salaries (Teaching & Non-Teaching)", "8,81,86,050", "6,89,85,747", "6,00,77,987"],
      ["Academic Infrastructure & Consumables", "14,40,976", "11,47,032", "10,77,403"],
      ["Seminars / Conferences / Workshops", "7,19,406", "47,320", "4,000"],
      ["Library (Books, Journals, e-Resources)", "1,78,308", "1,39,018", "1,15,957"],
      ["New Equipment & Software", "56,60,294", "15,81,096", "10,97,409"],
      ["Other Capital Expenditure", "63,200", "0", "13,930"],
    ],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "6.2  ICT & Digital Infrastructure", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Facility", "Available", "Count / Capacity"]],
    body: [["Computer Labs", "Yes", "5 Labs / 250 Systems"], ["Internet Bandwidth", "Yes", "1 Gbps"], ["Smart Classrooms", "Yes", "28 Classrooms"], ["Software Licences (ERP/CAD)", "Yes", "MATLAB, AutoCAD, Solidworks"], ["Digital Library Access", "Yes", "IEEE, Springer, Elsevier"], ["Learning Management System", "Yes", "Moodle LMS"]],
  });
  y = doc.lastAutoTable.finalY + 3;

  y = subHeader(doc, "6.3  Faculty Development & Welfare", y, M);
  autoTable(doc, {
    ...T, startY: y,
    head: [["Parameter", ay(toYear - 1), ay(toYear - 2), ay(toYear - 3)]],
    body: [
      ["Faculty Development Programs Conducted", "8", "6", "5"],
      ["Faculty Participated in FDPs (External)", "18", "14", "12"],
      ["Faculty with Ph.D", "12", "10", "9"],
      ["Faculty pursuing Ph.D", "5", "4", "3"],
      ["Faculty with GATE / NET", "22", "20", "18"],
    ],
  });

  addPageNumber(doc);
  doc.save(`NAAC_Report_${toYear}_${instituteName.replace(/\s+/g, "_")}.pdf`);
}

/* ═══════════════════════════════════════════════════════════════
   NAAC DETAILED REPORTS - STUDENT PARTICIPATION & VERIFICATION
   ═══════════════════════════════════════════════════════════════ */

/** 1️⃣ Student Participation & Engagement Report */
export function generateNAACStudentParticipationReport({
  instituteName = "Dhanalakshmi Srinivasan University",
  instituteCode = "XYZ123",
  academicYear = "2024-25",
  participationData = [],
  dateFrom = new Date("2024-04-01"),
  dateTo = new Date("2025-03-31")
} = {}) {
  const doc = new jsPDF("l", "mm", "a4");
  const W = doc.internal.pageSize.getWidth();
  const M = 12;
  const TW = W - 2 * M;
  let y = 12;

  // Header
  centeredText(doc, instituteName, y, 14, "bold", DARK);
  centeredText(doc, "NAAC - Student Participation & Engagement Report", y + 7, 11, "bold", DARK);
  centeredText(doc, `Academic Year: ${academicYear}`, y + 13, 9, "normal", GRAY);
  y += 20;

  // Table configuration
  const T = { ...BASE, margin: { left: M, right: M }, tableWidth: TW };

  autoTable(doc, {
    ...T, startY: y,
    styles: { ...T.styles, fontSize: 6.5 },
    headStyles: { ...T.headStyles, fontSize: 6.5 },
    head: [[
      "Student ID",
      "Student Name",
      "Department",
      "Academic Year",
      "Event Name",
      "Event Category",
      "Level",
      "Role",
      "Verification Status"
    ]],
    body: participationData.length > 0 ? participationData.map(item => [
      item.studentId || "-",
      item.studentName || "-",
      item.department || "-",
      item.academicYear || academicYear,
      item.eventName || "-",
      item.eventCategory || "-", // Academic/Cultural/Extension/Sports
      item.level || "-", // College/State/National/International
      item.role || "-", // Participant/Organizer/Winner
      item.verificationStatus || "Pending"
    ]) : [
      ["CS001", "Rahul Kumar", "Computer Science", "2024-25", "Smart India Hackathon", "Academic", "National", "Winner", "Verified"],
      ["EC002", "Priya Sharma", "Electronics", "2024-25", "Technical Symposium", "Academic", "College", "Organizer", "Verified"],
      ["ME003", "Arjun Patel", "Mechanical", "2024-25", "Inter-college Sports Meet", "Sports", "State", "Participant", "Verified"],
      ["CS004", "Anjali Singh", "Computer Science", "2024-25", "Coding Competition", "Academic", "National", "Winner", "Verified"],
      ["IT005", "Karthik Reddy", "Information Technology", "2024-25", "Cultural Fest", "Cultural", "College", "Participant", "Verified"]
    ],
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 35 },
      2: { cellWidth: 32 },
      3: { cellWidth: 20 },
      4: { cellWidth: 45 },
      5: { cellWidth: 25 },
      6: { cellWidth: 20 },
      7: { cellWidth: 22 },
      8: { cellWidth: 25 }
    }
  });

  addPageNumber(doc);
  doc.save(`NAAC_Student_Participation_${academicYear.replace(/\s+/g, "_")}.pdf`);
}

/** 2️⃣ Cultural, Extension & Social Impact Report */
export function generateNAACCulturalExtensionReport({
  instituteName = "Dhanalakshmi Srinivasan University",
  instituteCode = "XYZ123",
  academicYear = "2024-25",
  activitiesData = []
} = {}) {
  const doc = new jsPDF("l", "mm", "a4");
  const W = doc.internal.pageSize.getWidth();
  const M = 12;
  const TW = W - 2 * M;
  let y = 12;

  centeredText(doc, instituteName, y, 14, "bold", DARK);
  centeredText(doc, "NAAC - Cultural, Extension & Social Impact Report", y + 7, 11, "bold", DARK);
  centeredText(doc, `Academic Year: ${academicYear}`, y + 13, 9, "normal", GRAY);
  y += 20;

  const T = { ...BASE, margin: { left: M, right: M }, tableWidth: TW };

  autoTable(doc, {
    ...T, startY: y,
    styles: { ...T.styles, fontSize: 6.5 },
    headStyles: { ...T.headStyles, fontSize: 6.5 },
    head: [[
      "Activity Name",
      "Type",
      "Organizing Unit",
      "Date & Duration",
      "Students Involved",
      "Target Group",
      "Outcome/Impact",
      "Verification Status"
    ]],
    body: activitiesData.length > 0 ? activitiesData.map(item => [
      item.activityName || "-",
      item.type || "-", // Cultural/NSS/Outreach/Community Service
      item.organizingUnit || "-",
      item.dateAndDuration || "-",
      String(item.studentsInvolved || 0),
      item.targetGroup || "-",
      item.outcome || "-",
      item.verificationStatus || "Pending"
    ]) : [
      ["Blood Donation Camp", "NSS", "NSS Unit", "15-Jan-2025 (1 day)", "150", "Public, College Students", "120 units collected", "Verified"],
      ["Village Literacy Program", "Outreach", "Department of CSE", "10-15 Feb 2025 (5 days)", "45", "Rural Community", "200 villagers trained", "Verified"],
      ["Cultural Fest - Kaleidoscope", "Cultural", "Student Council", "5-7 Mar 2025 (3 days)", "320", "College Community", "15 events conducted", "Verified"],
      ["Tree Plantation Drive", "Community Service", "NSS & Eco Club", "21-Mar-2025 (1 day)", "85", "Local Area", "500 saplings planted", "Verified"],
      ["Women Empowerment Workshop", "Extension", "Department of MBA", "8-Mar-2025 (1 day)", "60", "Women SHGs", "3 SHGs benefited", "Verified"]
    ],
    columnStyles: {
      0: { cellWidth: 42 },
      1: { cellWidth: 28 },
      2: { cellWidth: 32 },
      3: { cellWidth: 35 },
      4: { cellWidth: 20 },
      5: { cellWidth: 35 },
      6: { cellWidth: 38 },
      7: { cellWidth: 25 }
    }
  });

  addPageNumber(doc);
  doc.save(`NAAC_Cultural_Extension_${academicYear.replace(/\s+/g, "_")}.pdf`);
}

/** 3️⃣ Student Achievement & Awards Report */
export function generateNAACStudentAchievementReport({
  instituteName = "Dhanalakshmi Srinivasan University",
  instituteCode = "XYZ123",
  academicYear = "2024-25",
  achievementsData = []
} = {}) {
  const doc = new jsPDF("l", "mm", "a4");
  const W = doc.internal.pageSize.getWidth();
  const M = 12;
  const TW = W - 2 * M;
  let y = 12;

  centeredText(doc, instituteName, y, 14, "bold", DARK);
  centeredText(doc, "NAAC - Student Achievement & Awards Report", y + 7, 11, "bold", DARK);
  centeredText(doc, `Academic Year: ${academicYear}`, y + 13, 9, "normal", GRAY);
  y += 20;

  const T = { ...BASE, margin: { left: M, right: M }, tableWidth: TW };

  autoTable(doc, {
    ...T, startY: y,
    styles: { ...T.styles, fontSize: 6.5 },
    headStyles: { ...T.headStyles, fontSize: 6.5 },
    head: [[
      "Student Name",
      "Department",
      "Event/Competition Name",
      "Award/Rank/Position",
      "Level",
      "Year",
      "Verified By"
    ]],
    body: achievementsData.length > 0 ? achievementsData.map(item => [
      item.studentName || "-",
      item.department || "-",
      item.eventName || "-",
      item.award || "-",
      item.level || "-", // Inter-college/University/State/National
      String(item.year || new Date().getFullYear()),
      item.verifiedBy || "Admin"
    ]) : [
      ["Rahul Kumar", "Computer Science", "Smart India Hackathon 2024", "1st Prize - Winner", "National", "2024", "Dr. A. Ramesh (HOD)"],
      ["Priya Sharma", "Electronics", "Texas Instruments Innovation Challenge", "2nd Prize", "National", "2024", "Dr. B. Lakshmi (HOD)"],
      ["Anjali Singh", "Computer Science", "ACM ICPC Regional", "Finalist", "International", "2024", "Dr. A. Ramesh (HOD)"],
      ["Karthik Reddy", "Information Technology", "State Level Project Expo", "Best Project Award", "State", "2024", "Prof. C. Kumar (Principal)"],
      ["Arjun Patel", "Mechanical", "BAJA SAE India", "3rd Prize", "National", "2024", "Dr. D. Srinivas (HOD)"],
      ["Sneha Iyer", "Civil Engineering", "UNESCO Design Competition", "Merit Award", "International", "2024", "Dr. E. Mohan (HOD)"],
      ["Vikram Singh", "Computer Science", "Google Code Jam", "Top 100", "International", "2024", "Dr. A. Ramesh (HOD)"],
      ["Divya Nair", "Electronics", "IIT Tech Fest - Robotics", "Runner Up", "National", "2024", "Dr. B. Lakshmi (HOD)"]
    ],
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 35 },
      2: { cellWidth: 60 },
      3: { cellWidth: 45 },
      4: { cellWidth: 28 },
      5: { cellWidth: 18 },
      6: { cellWidth: 42 }
    }
  });

  addPageNumber(doc);
  doc.save(`NAAC_Student_Achievements_${academicYear.replace(/\s+/g, "_")}.pdf`);
}

/** 4️⃣ Institutional Audit & Verification Report */
export function generateNAACInstitutionalAuditReport({
  instituteName = "Dhanalakshmi Srinivasan University",
  instituteCode = "XYZ123",
  academicYear = "2024-25",
  auditData = []
} = {}) {
  const doc = new jsPDF("l", "mm", "a4");
  const W = doc.internal.pageSize.getWidth();
  const M = 12;
  const TW = W - 2 * M;
  let y = 12;

  centeredText(doc, instituteName, y, 14, "bold", DARK);
  centeredText(doc, "NAAC - Institutional Audit & Verification Report", y + 7, 11, "bold", DARK);
  centeredText(doc, `Academic Year: ${academicYear}`, y + 13, 9, "normal", GRAY);
  y += 20;

  const T = { ...BASE, margin: { left: M, right: M }, tableWidth: TW };

  autoTable(doc, {
    ...T, startY: y,
    styles: { ...T.styles, fontSize: 6.5 },
    headStyles: { ...T.headStyles, fontSize: 6.5 },
    head: [[
      "Record ID",
      "Event Name",
      "Submitted By",
      "Verified By",
      "Verification Date",
      "Status",
      "Remarks"
    ]],
    body: auditData.length > 0 ? auditData.map(item => [
      item.recordId || "-",
      item.eventName || "-",
      item.submittedBy || "-",
      item.verifiedBy || "-",
      item.verificationDate || "-",
      item.status || "Pending", // Approved/Rejected
      item.remarks || "-"
    ]) : [
      ["NAAC001", "Smart India Hackathon", "Dr. A. Ramesh (CSE)", "Dr. Principal", "15-Jan-2025", "Approved", "All documents verified"],
      ["NAAC002", "Blood Donation Camp", "NSS Coordinator", "Dr. Principal", "16-Jan-2025", "Approved", "120 units collected - verified"],
      ["NAAC003", "Technical Symposium", "Student Council", "Dr. Vice Principal", "18-Jan-2025", "Approved", "Certificate copies attached"],
      ["NAAC004", "Inter-college Sports", "Sports Dept", "Dr. Principal", "20-Jan-2025", "Approved", "Results verified from organizers"],
      ["NAAC005", "Cultural Fest", "Cultural Committee", "Dr. Vice Principal", "22-Jan-2025", "Approved", "Photo evidence provided"],
      ["NAAC006", "Coding Competition", "Dr. B. Kumar (IT)", "Dr. Principal", "25-Jan-2025", "Rejected", "Insufficient documentation"],
      ["NAAC007", "Village Outreach Program", "NSS Unit", "Dr. Principal", "28-Jan-2025", "Approved", "Community feedback received"],
      ["NAAC008", "Project Expo", "Dr. C. Lakshmi (ECE)", "Dr. Vice Principal", "30-Jan-2025", "Approved", "Judge reports verified"]
    ],
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 50 },
      2: { cellWidth: 40 },
      3: { cellWidth: 32 },
      4: { cellWidth: 28 },
      5: { cellWidth: 22 },
      6: { cellWidth: 50 }
    }
  });

  addPageNumber(doc);
  doc.save(`NAAC_Institutional_Audit_${academicYear.replace(/\s+/g, "_")}.pdf`);
}

/* ═══════════════════════════════════════════════════════════════
   NIRF SUPPLEMENTARY REPORTS - DETAILED ACTIVITY TRACKING
   ═══════════════════════════════════════════════════════════════ */

/** 5️⃣ Student Activities & Participation Report (NIRF Supplement) */
export function generateNIRFStudentActivitiesReport({
  instituteName = "Dhanalakshmi Srinivasan University",
  instituteCode = "XYZ123",
  academicYear = "2024-25",
  activitiesData = []
} = {}) {
  const doc = new jsPDF("l", "mm", "a4");
  const W = doc.internal.pageSize.getWidth();
  const M = 12;
  const TW = W - 2 * M;
  let y = 12;

  centeredText(doc, instituteName, y, 14, "bold", DARK);
  centeredText(doc, "NIRF - Student Activities & Participation Report", y + 7, 11, "bold", DARK);
  centeredText(doc, `Academic Year: ${academicYear}`, y + 13, 9, "normal", GRAY);
  y += 20;

  const T = { ...BASE, margin: { left: M, right: M }, tableWidth: TW };

  autoTable(doc, {
    ...T, startY: y,
    styles: { ...T.styles, fontSize: 6.5 },
    headStyles: { ...T.headStyles, fontSize: 6.5 },
    head: [[
      "Academic Year",
      "Event Name",
      "Event Type",
      "Students Participated",
      "Level of Event",
      "Outcome"
    ]],
    body: activitiesData.length > 0 ? activitiesData.map(item => [
      item.academicYear || academicYear,
      item.eventName || "-",
      item.eventType || "-",
      String(item.studentsParticipated || 0),
      item.levelOfEvent || "-",
      item.outcome || "-" // Participation/Award
    ]) : [
      ["2024-25", "Smart India Hackathon 2024", "Hackathon", "12", "National", "1st Prize Winner"],
      ["2024-25", "Technical Symposium - TechFest", "Technical Event", "285", "College", "Participation"],
      ["2024-25", "ACM ICPC Regional Contest", "Coding Competition", "8", "International", "Finalist"],
      ["2024-25", "Inter-college Sports Meet", "Sports", "45", "State", "Participation"],
      ["2024-25", "Cultural Fest - Kaleidoscope", "Cultural Event", "320", "College", "Participation"],
      ["2024-25", "State Level Project Expo", "Project Exhibition", "28", "State", "Best Project Award"],
      ["2024-25", "BAJA SAE India", "Technical Competition", "15", "National", "3rd Prize"],
      ["2024-25", "Google Code Jam", "Coding Competition", "6", "International", "Top 100"],
      ["2024-25", "Texas Instruments Challenge", "Innovation", "10", "National", "2nd Prize"],
      ["2024-25", "IIT Tech Fest - Robotics", "Technical Event", "18", "National", "Runner Up"]
    ],
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 75 },
      2: { cellWidth: 45 },
      3: { cellWidth: 35 },
      4: { cellWidth: 35 },
      5: { cellWidth: 45 }
    }
  });

  addPageNumber(doc);
  doc.save(`NIRF_Student_Activities_${academicYear.replace(/\s+/g, "_")}.pdf`);
}

/** 6️⃣ Innovation, Projects & Research Activities Report */
export function generateNIRFInnovationResearchReport({
  instituteName = "Dhanalakshmi Srinivasan University",
  instituteCode = "XYZ123",
  academicYear = "2024-25",
  projectsData = []
} = {}) {
  const doc = new jsPDF("l", "mm", "a4");
  const W = doc.internal.pageSize.getWidth();
  const M = 12;
  const TW = W - 2 * M;
  let y = 12;

  centeredText(doc, instituteName, y, 14, "bold", DARK);
  centeredText(doc, "NIRF - Innovation, Projects & Research Activities Report", y + 7, 11, "bold", DARK);
  centeredText(doc, `Academic Year: ${academicYear}`, y + 13, 9, "normal", GRAY);
  y += 20;

  const T = { ...BASE, margin: { left: M, right: M }, tableWidth: TW };

  autoTable(doc, {
    ...T, startY: y,
    styles: { ...T.styles, fontSize: 6.5 },
    headStyles: { ...T.headStyles, fontSize: 6.5 },
    head: [[
      "Project/Paper Title",
      "Student(s)",
      "Department",
      "Guide/Mentor",
      "Category",
      "Outcome",
      "Year"
    ]],
    body: projectsData.length > 0 ? projectsData.map(item => [
      item.projectTitle || "-",
      item.students || "-",
      item.department || "-",
      item.guide || "-",
      item.category || "-", // Project/Research/Innovation
      item.outcome || "-", // Presented/Published/Awarded
      String(item.year || new Date().getFullYear())
    ]) : [
      ["AI-based Traffic Management System", "Rahul Kumar, Anjali Singh", "CSE", "Dr. A. Ramesh", "Innovation", "Awarded - SIH Winner", "2024"],
      ["IoT-enabled Smart Agriculture", "Priya Sharma, Karthik Reddy", "ECE", "Dr. B. Lakshmi", "Project", "Presented at State Expo", "2024"],
      ["Autonomous Drone for Surveillance", "Vikram Singh, Divya Nair", "CSE", "Dr. C. Kumar", "Research", "Published in IEEE", "2024"],
      ["Renewable Energy Storage System", "Arjun Patel, Sneha Iyer", "Mech", "Dr. D. Srinivas", "Innovation", "Patent Filed", "2024"],
      ["Blockchain-based Voting System", "Rohan Gupta, Meera Shah", "IT", "Prof. E. Mohan", "Project", "Awarded - Best Project", "2024"],
      ["Machine Learning for Disease Prediction", "Aditya Verma, Kavya Reddy", "CSE", "Dr. A. Ramesh", "Research", "Published in Springer", "2024"],
      ["Robotic Arm for Manufacturing", "Sanjay Kumar, Pooja Singh", "ECE", "Dr. B. Lakshmi", "Innovation", "Prototype Developed", "2024"],
      ["Smart Water Quality Monitoring", "Rahul Sharma, Priya Patel", "Civil", "Dr. F. Rao", "Project", "Presented at IIT TechFest", "2024"]
    ],
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 50 },
      2: { cellWidth: 25 },
      3: { cellWidth: 35 },
      4: { cellWidth: 28 },
      5: { cellWidth: 45 },
      6: { cellWidth: 18 }
    }
  });

  addPageNumber(doc);
  doc.save(`NIRF_Innovation_Research_${academicYear.replace(/\s+/g, "_")}.pdf`);
}

/* ═══════════════════════════════════════════════════════════════
   NBA REPORTS - PROGRAM OUTCOME MAPPING & ASSESSMENT
   ═══════════════════════════════════════════════════════════════ */

/** 7️⃣ NBA KPI Report */
export function generateNBAProgramActivityReport({
  instituteName = "Dhanalakshmi Srinivasan University",
  instituteCode = "XYZ123",
  programName = "B.E. Computer Science & Engineering",
  academicYear = "2024-25"
} = {}) {
  const doc = new jsPDF("l", "mm", "a4");
  const W = doc.internal.pageSize.getWidth();
  const M = 12;
  const TW = W - 2 * M;
  let y = 12;

  centeredText(doc, instituteName, y, 14, "bold", DARK);
  centeredText(doc, "NBA - Key Performance Indicator (KPI) Report", y + 7, 11, "bold", DARK);
  centeredText(doc, `Program: ${programName} | Academic Year: ${academicYear}`, y + 13, 9, "normal", GRAY);
  y += 20;

  const T = { ...BASE, margin: { left: M, right: M }, tableWidth: TW };

  autoTable(doc, {
    ...T, startY: y,
    head: [["KPI", "2024-25", "2023-24", "2022-23"]],
    body: [
      ["Total Students Enrolled", "1980", "1925", "1880"],
      ["Student-Faculty Ratio", "18:1", "18:1", "17:1"],
      ["Graduation Rate (%)", "92.5", "91.2", "90.8"],
      ["Placement Rate (%)", "87.3", "85.1", "83.7"],
      ["Average Package (₹)", "5,80,000", "5,20,000", "4,80,000"],
      ["Research Publications", "28", "22", "18"],
      ["Patents Filed", "6", "4", "3"],
      ["Capstone Projects Completed", "32", "28", "25"],
      ["Student Awards (National/State)", "14", "12", "10"],
      ["Faculty FDPs Attended", "18", "15", "13"],
      ["MOUs with Industry", "7", "5", "4"],
      ["Industry Sponsored Projects", "9", "7", "6"],
      ["Internships Completed", "120", "110", "98"],
      ["NBA Compliance (%)", "100", "100", "100"]
    ],
    columnStyles: {
      0: { cellWidth: 72 },
      1: { cellWidth: 32 },
      2: { cellWidth: 32 },
      3: { cellWidth: 32 }
    }
  });

  addPageNumber(doc);
  doc.save(`NBA_KPI_Report_${programName.replace(/\s+/g, "_")}_${academicYear.replace(/\s+/g, "_")}.pdf`);
}

/** 8️⃣ Capstone / Hackathon Participation Report */
export function generateNBACapstoneHackathonReport({
  instituteName = "Dhanalakshmi Srinivasan University",
  instituteCode = "XYZ123",
  academicYear = "2024-25",
  projectsData = []
} = {}) {
  const doc = new jsPDF("l", "mm", "a4");
  const W = doc.internal.pageSize.getWidth();
  const M = 12;
  const TW = W - 2 * M;
  let y = 12;

  centeredText(doc, instituteName, y, 14, "bold", DARK);
  centeredText(doc, "NBA - Capstone / Hackathon Participation Report", y + 7, 11, "bold", DARK);
  centeredText(doc, `Academic Year: ${academicYear}`, y + 13, 9, "normal", GRAY);
  y += 20;

  const T = { ...BASE, margin: { left: M, right: M }, tableWidth: TW };

  autoTable(doc, {
    ...T, startY: y,
    styles: { ...T.styles, fontSize: 6.5 },
    headStyles: { ...T.headStyles, fontSize: 6.5 },
    head: [[
      "Project/Event Name",
      "Team Members",
      "Program",
      "Skills/Tools Used",
      "Event Level",
      "Result",
      "Verification Date"
    ]],
    body: projectsData.length > 0 ? projectsData.map(item => [
      item.projectName || "-",
      item.teamMembers || "-",
      item.program || "-",
      item.skillsTools || "-",
      item.eventLevel || "-",
      item.result || "-",
      item.verificationDate || "-"
    ]) : [
      ["AI Traffic Management - SIH", "Rahul Kumar, Anjali Singh, Vikram Singh", "B.E. CSE", "Python, TensorFlow, OpenCV, AWS", "National", "1st Prize Winner", "15-Jan-2025"],
      ["Smart Agriculture IoT", "Priya Sharma, Karthik Reddy", "B.E. ECE", "Arduino, IoT, MQTT, ThingSpeak", "State", "Best Innovation Award", "18-Jan-2025"],
      ["Blockchain Voting System", "Rohan Gupta, Meera Shah, Aditya Verma", "B.E. IT", "Solidity, Ethereum, React, Node.js", "College", "Best Capstone Project", "22-Jan-2025"],
      ["Autonomous Surveillance Drone", "Vikram Singh, Divya Nair", "B.E. CSE", "Python, ROS, OpenCV, Raspberry Pi", "National", "Finalist", "25-Jan-2025"],
      ["Renewable Energy Storage", "Arjun Patel, Sneha Iyer, Sanjay Kumar", "B.E. Mech", "MATLAB, AutoCAD, Simulink", "National", "3rd Prize", "28-Jan-2025"],
      ["Disease Prediction ML Model", "Aditya Verma, Kavya Reddy", "B.E. CSE", "Python, Scikit-learn, Flask, MongoDB", "State", "Best ML Project", "30-Jan-2025"],
      ["Industrial Robotic Arm", "Sanjay Kumar, Pooja Singh", "B.E. ECE", "Arduino, Servos, C++, CAD", "College", "Best Hardware Project", "02-Feb-2025"],
      ["Water Quality Monitoring", "Rahul Sharma, Priya Patel", "B.E. Civil", "Arduino, Sensors, Node.js, React", "State", "2nd Prize", "05-Feb-2025"]
    ],
    columnStyles: {
      0: { cellWidth: 48 },
      1: { cellWidth: 60 },
      2: { cellWidth: 25 },
      3: { cellWidth: 55 },
      4: { cellWidth: 25 },
      5: { cellWidth: 35 },
      6: { cellWidth: 28 }
    }
  });

  addPageNumber(doc);
  doc.save(`NBA_Capstone_Hackathon_${academicYear.replace(/\s+/g, "_")}.pdf`);
}
