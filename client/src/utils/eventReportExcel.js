import * as XLSX from 'xlsx';

export function generateEventReportExcel({
  academicYear = "2024-25",
  eventsData = []
} = {}) {
  // Default dummy data if none provided
  const data = eventsData.length > 0 ? eventsData : [
    {
      "Event Name": "Smart India Hackathon",
      "Event Type": "Hackathon",
      "Date": "15-Jan-2025",
      "Department": "CSE",
      "Level": "National",
      "No. of Participants": 12,
      "Outcome": "1st Prize Winner"
    },
    {
      "Event Name": "Technical Symposium",
      "Event Type": "Technical",
      "Date": "20-Feb-2025",
      "Department": "ECE",
      "Level": "College",
      "No. of Participants": 285,
      "Outcome": "Participation"
    },
    {
      "Event Name": "Cultural Fest - Kaleidoscope",
      "Event Type": "Cultural",
      "Date": "5-Mar-2025",
      "Department": "Student Council",
      "Level": "College",
      "No. of Participants": 320,
      "Outcome": "Participation"
    },
    {
      "Event Name": "State Level Project Expo",
      "Event Type": "Project",
      "Date": "10-Apr-2025",
      "Department": "IT",
      "Level": "State",
      "No. of Participants": 28,
      "Outcome": "Best Project Award"
    },
    {
      "Event Name": "Inter-college Sports Meet",
      "Event Type": "Sports",
      "Date": "18-Mar-2025",
      "Department": "Sports",
      "Level": "State",
      "No. of Participants": 45,
      "Outcome": "Participation"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Events");
  XLSX.writeFile(wb, `Event_Report_${academicYear.replace(/\s+/g, "_")}.xlsx`);
}
