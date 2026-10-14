import { createContext, useContext, useState } from "react";

const DataContext = createContext(null);

const STUDENTS_KEY = "campusos_imported_students";
const FACULTY_KEY  = "campusos_imported_faculty";
const TICKETS_KEY  = "campusos_support_tickets";
const MENTOR_KEY   = "campusos_mentor_mappings";

function load(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function loadObj(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function persist(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function DataProvider({ children }) {
  const [importedStudents, setImportedStudentsRaw] = useState(() => load(STUDENTS_KEY));
  const [importedFaculty, setImportedFacultyRaw]   = useState(() => load(FACULTY_KEY));
  const [tickets, setTicketsRaw]                   = useState(() => load(TICKETS_KEY));
  const [mentorMappings, setMentorMappingsRaw]     = useState(() => loadObj(MENTOR_KEY));

  // ── Students ──────────────────────────────────────────────────────────
  const addImportedStudents = (newStudents) => {
    setImportedStudentsRaw((prev) => {
      const existing = Array.isArray(prev) ? prev : [];
      const keys = new Set(existing.map((s) => s.email?.toLowerCase()));
      const fresh = newStudents.filter((s) => !keys.has(s.email?.toLowerCase()));
      const merged = [...existing, ...fresh];
      persist(STUDENTS_KEY, merged);
      return merged;
    });
  };

  const deleteImportedStudent = (id) => {
    setImportedStudentsRaw((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      persist(STUDENTS_KEY, updated);
      return updated;
    });
  };

  const clearImportedStudents = () => {
    setImportedStudentsRaw([]);
    localStorage.removeItem(STUDENTS_KEY);
  };

  // ── Faculty ───────────────────────────────────────────────────────────
  const addImportedFaculty = (newFaculty) => {
    setImportedFacultyRaw((prev) => {
      const existing = Array.isArray(prev) ? prev : [];
      const keys = new Set(existing.map((f) => f.email?.toLowerCase()));
      const fresh = newFaculty.filter((f) => !keys.has(f.email?.toLowerCase()));
      const merged = [...existing, ...fresh];
      persist(FACULTY_KEY, merged);
      return merged;
    });
  };

  const deleteImportedFaculty = (id) => {
    setImportedFacultyRaw((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      persist(FACULTY_KEY, updated);
      return updated;
    });
  };

  const clearImportedFaculty = () => {
    setImportedFacultyRaw([]);
    localStorage.removeItem(FACULTY_KEY);
  };

  // ── Support Tickets ───────────────────────────────────────────────────
  const addTicket = (ticket) => {
    const newTicket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminReply: "",
    };
    setTicketsRaw((prev) => {
      const updated = [newTicket, ...prev];
      persist(TICKETS_KEY, updated);
      return updated;
    });
    return newTicket;
  };

  const updateTicketStatus = (id, status) => {
    setTicketsRaw((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
      );
      persist(TICKETS_KEY, updated);
      return updated;
    });
  };

  const replyToTicket = (id, reply) => {
    setTicketsRaw((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? { ...t, adminReply: reply, status: "replied", updatedAt: new Date().toISOString() }
          : t
      );
      persist(TICKETS_KEY, updated);
      return updated;
    });
  };

  const deleteTicket = (id) => {
    setTicketsRaw((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      persist(TICKETS_KEY, updated);
      return updated;
    });
  };

  // ── Mentor Mappings ── { facultyId: [studentId, ...] } ───────────────
  const setMentees = (facultyId, studentIds) => {
    setMentorMappingsRaw((prev) => {
      const updated = { ...prev, [facultyId]: studentIds };
      persist(MENTOR_KEY, updated);
      return updated;
    });
  };

  const addMentee = (facultyId, studentId) => {
    setMentorMappingsRaw((prev) => {
      const existing = prev[facultyId] || [];
      if (existing.includes(studentId)) return prev;
      const updated = { ...prev, [facultyId]: [...existing, studentId] };
      persist(MENTOR_KEY, updated);
      return updated;
    });
  };

  const removeMentee = (facultyId, studentId) => {
    setMentorMappingsRaw((prev) => {
      const updated = { ...prev, [facultyId]: (prev[facultyId] || []).filter((id) => id !== studentId) };
      persist(MENTOR_KEY, updated);
      return updated;
    });
  };

  const getMenteeIds = (facultyId) => mentorMappings[facultyId] || [];

  return (
    <DataContext.Provider
      value={{
        importedStudents,
        addImportedStudents,
        deleteImportedStudent,
        clearImportedStudents,
        importedFaculty,
        addImportedFaculty,
        deleteImportedFaculty,
        clearImportedFaculty,
        tickets,
        addTicket,
        updateTicketStatus,
        replyToTicket,
        deleteTicket,
        mentorMappings,
        setMentees,
        addMentee,
        removeMentee,
        getMenteeIds,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
