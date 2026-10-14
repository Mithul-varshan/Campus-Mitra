import { useState } from "react";

const DOMAINS = [
  "Hackathon",
  "Technical Symposium",
  "Workshop",
  "Seminar",
  "Coding Contest",
  "Paper Presentation",
  "Project Expo",
  "Industry Talk",
  "Innovation Challenge",
  "Bootcamp",
  "Conference",
  "Webinar",
];

const INITIAL_TEMPLATES = {
  Hackathon: {
    name: "Hackathon Certificate",
    collegeName: "",
    eventName: "",
    studentName: "",
    price: "",
    category: "Winner",
    description: "",
    backgroundColor: "#fef9c3",
    accentColor: "#b45309",
    featured: true,
  },
  "Technical Symposium": {
    name: "Technical Symposium Certificate",
    collegeName: "",
    eventName: "Tech Symposium 2025",
    studentName: "",
    price: "",
    category: "Participant",
    description: "",
    backgroundColor: "#eff6ff",
    accentColor: "#1d4ed8",
    featured: false,
  },
  Workshop: {
    name: "Workshop Certificate",
    collegeName: "",
    eventName: "",
    studentName: "",
    price: "",
    category: "Completion",
    description: "",
    backgroundColor: "#f8fafc",
    accentColor: "#475569",
    featured: false,
  },
  Seminar: {
    name: "Seminar Certificate",
    collegeName: "",
    eventName: "",
    studentName: "",
    price: "",
    category: "Attendance",
    description: "",
    backgroundColor: "#f0fdf4",
    accentColor: "#16a34a",
    featured: false,
  },
  "Coding Contest": {
    name: "Coding Contest Certificate",
    collegeName: "",
    eventName: "",
    studentName: "",
    price: "",
    category: "Achievement",
    description: "",
    backgroundColor: "#fef2f2",
    accentColor: "#dc2626",
    featured: false,
  },
  "Paper Presentation": {
    name: "Paper Presentation Certificate",
    collegeName: "",
    eventName: "",
    studentName: "",
    price: "",
    category: "Recognition",
    description: "",
    backgroundColor: "#faf5ff",
    accentColor: "#7c3aed",
    featured: false,
  },
  "Project Expo": {
    name: "Project Expo Certificate",
    collegeName: "",
    eventName: "",
    studentName: "",
    price: "",
    category: "Participation",
    description: "",
    backgroundColor: "#fffbeb",
    accentColor: "#f59e0b",
    featured: false,
  },
  "Industry Talk": {
    name: "Industry Talk Certificate",
    collegeName: "",
    eventName: "",
    studentName: "",
    price: "",
    category: "Attendance",
    description: "",
    backgroundColor: "#fce7f3",
    accentColor: "#be185d",
    featured: false,
  },
  "Innovation Challenge": {
    name: "Innovation Challenge Certificate",
    collegeName: "",
    eventName: "",
    studentName: "",
    price: "",
    category: "Winner",
    description: "",
    backgroundColor: "#ecfdf5",
    accentColor: "#059669",
    featured: false,
  },
  Bootcamp: {
    name: "Bootcamp Certificate",
    collegeName: "",
    eventName: "",
    studentName: "",
    price: "",
    category: "Completion",
    description: "",
    backgroundColor: "#fef3c7",
    accentColor: "#d97706",
    featured: false,
  },
  Conference: {
    name: "Conference Certificate",
    collegeName: "",
    eventName: "",
    studentName: "",
    price: "",
    category: "Attendance",
    description: "",
    backgroundColor: "#ddd6fe",
    accentColor: "#6366f1",
    featured: false,
  },
  Webinar: {
    name: "Webinar Certificate",
    collegeName: "",
    eventName: "",
    studentName: "",
    price: "",
    category: "Completion",
    description: "",
    backgroundColor: "#e0e7ff",
    accentColor: "#4f46e5",
    featured: false,
  },
};

function TemplateForm({ domain, initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: 600,
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 32px 72px -12px rgba(0,0,0,0.3)",
          padding: 32,
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 24,
            color: "#0f172a",
          }}
        >
          Edit: {domain} Certificate
        </h2>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Name */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                display: "block",
                marginBottom: 6,
              }}
            >
              Certificate Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* College Name */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                display: "block",
                marginBottom: 6,
              }}
            >
              College Name
            </label>
            <input
              type="text"
              value={formData.collegeName}
              onChange={(e) => handleChange("collegeName", e.target.value)}
              placeholder="e.g., Tech Institute of Advanced Studies"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Event Name */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                display: "block",
                marginBottom: 6,
              }}
            >
              Event Name
            </label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => handleChange("eventName", e.target.value)}
              placeholder="e.g., HackFest 2025"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Student Name Placeholder */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                display: "block",
                marginBottom: 6,
              }}
            >
              Student Name Placeholder (will be auto-filled)
            </label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => handleChange("studentName", e.target.value)}
              placeholder="e.g., [Student Name]"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                display: "block",
                marginBottom: 6,
              }}
            >
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            >
              <option>Winner</option>
              <option>Runner-up</option>
              <option>Participant</option>
              <option>Completion</option>
              <option>Attendance</option>
              <option>Recognition</option>
              <option>Achievement</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                display: "block",
                marginBottom: 6,
              }}
            >
              Price (Optional)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="e.g., 500"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                display: "block",
                marginBottom: 6,
              }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Certificate description or special notes"
              rows="3"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          {/* Colors */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#64748b",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Background Color
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) =>
                    handleChange("backgroundColor", e.target.value)
                  }
                  style={{
                    width: 50,
                    height: 40,
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  {formData.backgroundColor}
                </span>
              </div>
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#64748b",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Accent Color
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => handleChange("accentColor", e.target.value)}
                  style={{
                    width: 50,
                    height: 40,
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  {formData.accentColor}
                </span>
              </div>
            </div>
          </div>

          {/* Featured */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleChange("featured", e.target.checked)}
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
            <label
              style={{ fontSize: 14, color: "#475569", cursor: "pointer" }}
            >
              Mark as Featured
            </label>
          </div>

          {/* Preview */}
          <div
            style={{
              background: formData.backgroundColor,
              border: `1px solid #d1d5db`,
              borderRadius: 8,
              padding: "32px 40px",
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "center",
              fontFamily: "Georgia, serif",
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.02) 35px, rgba(0,0,0,.02) 70px)",
            }}
          >
            {/* Header */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: formData.accentColor,
                  letterSpacing: "2px",
                  marginBottom: 12,
                }}
              >
                CAMPUSMITRA
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: formData.accentColor,
                  opacity: 0.7,
                  marginBottom: 24,
                }}
              >
                {formData.collegeName || "[College Name]"}
              </div>
            </div>

            {/* Main Content */}
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: formData.accentColor,
                  marginBottom: 8,
                }}
              >
                This certificate is awarded to
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: formData.accentColor,
                  marginBottom: 12,
                }}
              >
                {formData.studentName || "[Student Name]"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: formData.accentColor,
                  marginBottom: 6,
                }}
              >
                for successfully completing
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: formData.accentColor,
                  marginBottom: 8,
                }}
              >
                {formData.eventName || domain}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: formData.accentColor,
                  opacity: 0.8,
                }}
              >
                Category:{" "}
                <span style={{ fontWeight: 600 }}>{formData.category}</span>
              </div>
            </div>

            {/* Footer with Signature */}
            <div>
              <div
                style={{
                  borderTop: `2px solid ${formData.accentColor}`,
                  paddingTop: 16,
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  fontSize: 10,
                  color: formData.accentColor,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontStyle: "italic", marginBottom: 2 }}>
                    Authorized Signature
                  </div>
                  <div style={{ fontSize: 9, opacity: 0.7 }}>
                    Event Coordinator
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 9 }}>
                  <div>Completion Date: {new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button
            onClick={() => onSave(formData)}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e3fa8")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--primary)")
            }
          >
            Save Template
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "#f1f5f9",
              color: "#334155",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ domain, template, onEdit }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 30px -8px rgba(0,0,0,0.13)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Certificate Preview */}
      <div
        style={{
          height: 160,
          background: template.backgroundColor,
          borderBottom: `2px solid ${template.accentColor}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "16px 12px",
          fontFamily: "Georgia, serif",
          textAlign: "center",
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,.01) 20px, rgba(0,0,0,.01) 40px)",
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontWeight: 700,
            color: template.accentColor,
            letterSpacing: "1px",
          }}
        >
          CAMPUSMITRA
        </div>
        <div
          style={{ fontSize: 11, fontWeight: 700, color: template.accentColor }}
        >
          Certificate of {template.category}
        </div>
        <div style={{ fontSize: 8, color: template.accentColor, opacity: 0.8 }}>
          {template.eventName
            ? template.eventName.substring(0, 30)
            : domain.substring(0, 30)}
        </div>
        <div
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: template.accentColor,
            marginTop: 4,
          }}
        >
          {template.name.substring(0, 25)}
        </div>

        {template.featured && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: template.accentColor,
              color: "#fff",
              fontSize: 8,
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: 3,
            }}
          >
            Featured
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: "16px 18px" }}>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 6,
          }}
        >
          {domain}
        </h3>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
          <strong>Category:</strong> {template.category}
        </div>
        {template.eventName && (
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
            <strong>Event:</strong> {template.eventName}
          </div>
        )}
        {template.price && (
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
            <strong>Price:</strong> ₹{template.price}
          </div>
        )}
        <button
          onClick={() => onEdit(domain)}
          style={{
            width: "100%",
            marginTop: 12,
            padding: "10px 0",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1e3fa8")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--primary)")
          }
        >
          Edit Template
        </button>
      </div>
    </div>
  );
}

export default function CertificateTemplates() {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [editingDomain, setEditingDomain] = useState(null);

  const handleSave = (formData) => {
    setTemplates((prev) => ({
      ...prev,
      [editingDomain]: formData,
    }));
    setEditingDomain(null);
  };

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 6,
          }}
        >
          Certificate Templates
        </h1>
        <p style={{ fontSize: 14, color: "#64748b" }}>
          Create and manage certificate templates for different event domains
        </p>
      </div>

      {/* Grid of Templates */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {DOMAINS.map((domain) => (
          <TemplateCard
            key={domain}
            domain={domain}
            template={templates[domain]}
            onEdit={setEditingDomain}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {editingDomain && (
        <TemplateForm
          domain={editingDomain}
          initialData={templates[editingDomain]}
          onSave={handleSave}
          onCancel={() => setEditingDomain(null)}
        />
      )}
    </div>
  );
}
