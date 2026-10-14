import { useEffect, useMemo, useState } from "react";

const DECLARED_WINNERS_KEY = "campusMitra_declared_winners";
const TEMPLATE_KEY = "campusMitra_certificate_template";
const ISSUED_CERTS_KEY = "campusMitra_issued_certificates";

// Simple CampusMitra logo SVG (default)
const CAMPUSMITRA_LOGO = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'%3E%3Crect width='120' height='40' fill='none'/%3E%3Ctext x='10' y='28' font-size='20' font-weight='bold' fill='%235b38c6' font-family='Arial'%3ECampusMitra%3C/text%3E%3C/svg%3E`;

// Default college logo SVG (circular institutional seal - no background)
const DEFAULT_COLLEGE_LOGO = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='55' fill='%232563eb' stroke='%23ffffff' stroke-width='2'/%3E%3Ctext x='60' y='40' font-size='16' font-weight='bold' fill='%23ffffff' text-anchor='middle' font-family='Georgia'%3EYour College%3C/text%3E%3Ctext x='60' y='65' font-size='12' fill='%23ffffff' text-anchor='middle' font-family='Georgia'%3EInstitution%3C/text%3E%3Ctext x='60' y='85' font-size='10' fill='%23ffffff' text-anchor='middle' font-family='Georgia'%3EEstablished%3C/text%3E%3C/svg%3E`;

const DEFAULT_TEMPLATE = {
  collegeName: "Your College Name",
  issuerName: "Your Company Name",
  title: "Certificate of Completion",
  subtitle: "This certificate acknowledges that",
  programLine: "has successfully completed",
  detailsLine:
    "Ensuring expertise in safety procedures and professional readiness.",
  accentColor: "#5b38c6",
  signatureImage: "",
  campusMitraLogo: CAMPUSMITRA_LOGO,
  collegeLogo: DEFAULT_COLLEGE_LOGO,
  signatureName: "Training Coordinator",
  signatureTitle: "Your company name",
  contactLine: "yourcompany@gmail.com",
};

const loadTemplate = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(TEMPLATE_KEY));
    return stored ? { ...DEFAULT_TEMPLATE, ...stored } : DEFAULT_TEMPLATE;
  } catch (error) {
    return DEFAULT_TEMPLATE;
  }
};

const loadDeclaredWinners = () => {
  try {
    return JSON.parse(localStorage.getItem(DECLARED_WINNERS_KEY) || "[]");
  } catch (error) {
    return [];
  }
};

const loadIssuedCerts = () => {
  try {
    return JSON.parse(localStorage.getItem(ISSUED_CERTS_KEY) || "[]");
  } catch (error) {
    return [];
  }
};

function TemplateEditorModal({ template, onSave, onClose }) {
  const [formData, setFormData] = useState(template);

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
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: 720,
          maxWidth: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 32px 72px -12px rgba(0,0,0,0.3)",
          padding: 28,
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 20,
            color: "#0f172a",
          }}
        >
          Edit Certificate Template
        </h2>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
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
              College Name
            </label>
            <input
              type="text"
              value={formData.collegeName}
              onChange={(e) => handleChange("collegeName", e.target.value)}
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
              Issuer Name
            </label>
            <input
              type="text"
              value={formData.issuerName}
              onChange={(e) => handleChange("issuerName", e.target.value)}
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
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
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
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
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
              Program Line
            </label>
            <input
              type="text"
              value={formData.programLine}
              onChange={(e) => handleChange("programLine", e.target.value)}
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
              Details Line
            </label>
            <input
              type="text"
              value={formData.detailsLine}
              onChange={(e) => handleChange("detailsLine", e.target.value)}
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
              College Logo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () =>
                  handleChange("collegeLogo", String(reader.result || ""));
                reader.readAsDataURL(file);
              }}
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
              Signature Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () =>
                  handleChange("signatureImage", String(reader.result || ""));
                reader.readAsDataURL(file);
              }}
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
              Signature Name
            </label>
            <input
              type="text"
              value={formData.signatureName}
              onChange={(e) => handleChange("signatureName", e.target.value)}
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
              Signature Title
            </label>
            <input
              type="text"
              value={formData.signatureTitle}
              onChange={(e) => handleChange("signatureTitle", e.target.value)}
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
              Contact Line
            </label>
            <input
              type="text"
              value={formData.contactLine}
              onChange={(e) => handleChange("contactLine", e.target.value)}
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
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
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
            }}
          >
            Save Template
          </button>
          <button
            onClick={onClose}
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
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function CertificatePreview({ eventData, template }) {
  const accent = template.accentColor || "#5b38c6";
  const programName = eventData?.event?.title || "Program Name";
  const eventType = eventData?.event?.type || "Event";
  const recipientName =
    eventData?.winners?.[0]?.members?.[0]?.name ||
    eventData?.participants?.[0]?.members?.[0]?.name ||
    "[Recipient Name]";

  const issueDate = new Date();
  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div
      style={{
        border: `2px solid ${accent}`,
        borderRadius: 18,
        padding: "28px 32px",
        background: "#fff",
        position: "relative",
        overflow: "hidden",
        minHeight: 320,
        boxShadow: "0 18px 40px -20px rgba(15,23,42,0.35)",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 96,
          height: 96,
          background: accent,
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          display: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          display: "grid",
          gridTemplateColumns: "repeat(3, 12px)",
          gap: 6,
          display: "none",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <span
            key={`square-${index}`}
            style={{
              width: 12,
              height: 12,
              background: accent,
              opacity: 0.85 - index * 0.05,
            }}
          />
        ))}
      </div>

      {/* CampusMitra Logo (Top Right) */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          maxWidth: 100,
          overflow: "hidden",
        }}
      >
        <img
          src={template.campusMitraLogo || CAMPUSMITRA_LOGO}
          alt="CampusMitra"
          style={{ height: 24, objectFit: "contain", maxWidth: "100%" }}
        />
      </div>

      {/* College Logo (Top Left) */}
      {template.collegeLogo && (
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <img
            src={template.collegeLogo}
            alt="College Logo"
            style={{ height: 72, objectFit: "contain" }}
          />
        </div>
      )}

      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}
      >
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: accent, fontWeight: 600 }}>
            {template.collegeName}
          </div>
          <div
            style={{
              width: 120,
              height: 2,
              background: "#e2e8f0",
              marginTop: 6,
              marginLeft: "auto",
            }}
          />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>
          {template.title}: {programName}
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 10 }}>
          {template.subtitle}
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#111827",
            margin: "18px 0 8px",
          }}
        >
          {recipientName}
        </div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          {template.programLine}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
          {programName}
        </div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
          {eventType}
        </div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}>
          {template.detailsLine}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 24,
          fontSize: 11,
          color: "#6b7280",
        }}
      >
        <div>
          <div>Date of issuance: {formatDate(issueDate)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          {template.signatureImage ? (
            <img
              src={template.signatureImage}
              alt="Signature"
              style={{ height: 38, objectFit: "contain", marginBottom: 6 }}
            />
          ) : (
            <div
              style={{
                height: 20,
                width: 120,
                borderBottom: "2px solid #cbd5f5",
                marginLeft: "auto",
                marginBottom: 6,
              }}
            />
          )}
          <div style={{ fontWeight: 600, color: "#111827" }}>
            {template.signatureName}
          </div>
          <div>{template.signatureTitle}</div>
          <div>{template.contactLine}</div>
        </div>
      </div>
    </div>
  );
}

function ShareCertificateTab() {
  const [declaredEvents, setDeclaredEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [template, setTemplate] = useState(loadTemplate);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [issuedCerts, setIssuedCerts] = useState(loadIssuedCerts);

  useEffect(() => {
    const items = loadDeclaredWinners();
    setDeclaredEvents(items);
    if (!selectedEventId && items[0]?.event?.id) {
      setSelectedEventId(items[0].event.id);
    }
  }, [selectedEventId]);

  const selectedEvent = useMemo(
    () => declaredEvents.find((item) => item?.event?.id === selectedEventId),
    [declaredEvents, selectedEventId],
  );

  const handleTemplateSave = (nextTemplate) => {
    setTemplate(nextTemplate);
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(nextTemplate));
    setShowTemplateEditor(false);
  };

  const collectRecipients = (eventData) => {
    const winners = (eventData?.winners || []).flatMap((team) => {
      const members = team?.members?.length
        ? team.members
        : [{ name: team?.teamName || "Winner" }];
      return members.map((member) => ({
        name: member.name,
        type: "Winner",
        teamName: team?.teamName,
      }));
    });

    const participants = (eventData?.participants || []).flatMap((team) => {
      const members = team?.members?.length
        ? team.members
        : [{ name: team?.teamName || "Participant" }];
      return members.map((member) => ({
        name: member.name,
        type: "Participant",
        teamName: team?.teamName,
      }));
    });

    return [...winners, ...participants];
  };

  const handleShareCertificates = () => {
    if (!selectedEvent) {
      alert("Please select an event with declared winners.");
      return;
    }

    const recipients = collectRecipients(selectedEvent);
    if (!recipients.length) {
      alert("No recipients available for this event.");
      return;
    }

    const issuedAt = new Date().toISOString();
    const newCerts = recipients.map((recipient, index) => ({
      id: `CERT-${Date.now()}-${index}`,
      studentName: recipient.name,
      type: recipient.type,
      teamName: recipient.teamName,
      eventName: selectedEvent?.event?.title,
      issuedAt,
      templateName: template.title,
    }));

    const updated = [...newCerts, ...issuedCerts];
    setIssuedCerts(updated);
    localStorage.setItem(ISSUED_CERTS_KEY, JSON.stringify(updated));

    alert(`${newCerts.length} certificate(s) shared successfully!`);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32 }}>
      <div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
              Select Event
            </h3>
            <button
              onClick={() => setDeclaredEvents(loadDeclaredWinners())}
              style={{
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                padding: "6px 10px",
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
          </div>

          {declaredEvents.length === 0 ? (
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              No declared winners found. Declare winners first to enable
              sharing.
            </div>
          ) : (
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            >
              {declaredEvents.map((item) => (
                <option key={item?.event?.id} value={item?.event?.id}>
                  {item?.event?.title || "Untitled Event"}
                </option>
              ))}
            </select>
          )}

          {selectedEvent && (
            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "#f1f5f9",
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 12,
                }}
              >
                <div style={{ color: "#64748b" }}>Winners</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {selectedEvent?.winners?.length || 0}
                </div>
              </div>
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 12,
                }}
              >
                <div style={{ color: "#64748b" }}>Participants</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {selectedEvent?.participants?.length || 0}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
              Active Template
            </h3>
            <button
              onClick={() => setShowTemplateEditor(true)}
              style={{
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                padding: "6px 10px",
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Edit Template
            </button>
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
            {template.title} by {template.issuerName}
          </div>
          <button
            onClick={handleShareCertificates}
            style={{
              width: "100%",
              padding: "12px 0",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Share Certificates
          </button>
        </div>

        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            Recent Shares ({issuedCerts.length})
          </h4>
          {issuedCerts.length === 0 ? (
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              No certificates shared yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {issuedCerts.slice(0, 5).map((cert) => (
                <div
                  key={cert.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    padding: "10px 12px",
                    fontSize: 12,
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>
                    {cert.studentName}
                  </div>
                  <div style={{ color: "#64748b" }}>
                    {cert.eventName} • {cert.type}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    {new Date(cert.issuedAt).toLocaleDateString()} • {cert.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <CertificatePreview eventData={selectedEvent} template={template} />
      </div>

      {showTemplateEditor && (
        <TemplateEditorModal
          template={template}
          onSave={handleTemplateSave}
          onClose={() => setShowTemplateEditor(false)}
        />
      )}
    </div>
  );
}

export default function AdminCertificates() {
  return (
    <div
      style={{
        padding: "32px",
        maxWidth: 1400,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 6,
          }}
        >
          Certificate Management
        </h1>
        <p style={{ fontSize: 14, color: "#64748b" }}>
          Choose an event, review the template, and share certificates with
          declared winners and participants.
        </p>
      </div>

      <ShareCertificateTab />
    </div>
  );
}
