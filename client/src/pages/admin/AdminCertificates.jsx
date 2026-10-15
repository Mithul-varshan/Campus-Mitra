import { useEffect, useMemo, useState } from "react";

const DECLARED_WINNERS_KEY = "campusMitra_declared_winners";
const TEMPLATE_KEY = "campusMitra_certificate_template";
const ISSUED_CERTS_KEY = "campusMitra_issued_certificates";

// Simple CampusMitra logo SVG (default)
const CAMPUSMITRA_LOGO = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'%3E%3Crect width='120' height='40' fill='none'/%3E%3Ctext x='10' y='28' font-size='20' font-weight='bold' fill='%235b38c6' font-family='Arial'%3ECampusMitra%3C/text%3E%3C/svg%3E`;

// Default college logo SVG (circular institutional seal - no background)
const DEFAULT_COLLEGE_LOGO = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='55' fill='%232563eb' stroke='%23ffffff' stroke-width='2'/%3E%3Ctext x='60' y='40' font-size='16' font-weight='bold' fill='%23ffffff' text-anchor='middle' font-family='Georgia'%3EYour College%3C/text%3E%3Ctext x='60' y='65' font-size='12' fill='%23ffffff' text-anchor='middle' font-family='Georgia'%3EInstitution%3C/text%3E%3Ctext x='60' y='85' font-size='10' fill='%23ffffff' text-anchor='middle' font-family='Georgia'%3EEstablished%3C/text%3E%3C/svg%3E`;

const DEFAULT_TEMPLATE = {
  collegeName: "Dhanalakshmi Srinivasan University",
  issuerName: "Dhanalakshmi Srinivasan University",
  title: "Certificate of Completion",
  subtitle: "This certificate acknowledges that",
  programLine: "has successfully completed",
  detailsLine:
    "Ensuring expertise in technical innovation and professional readiness.",
  accentColor: "#5b38c6",
  signatureImage: "",
  campusMitraLogo: CAMPUSMITRA_LOGO,
  collegeLogo: DEFAULT_COLLEGE_LOGO,
  signatureName: "Dr. K. Elangovan",
  signatureTitle: "Dean of Academic Affairs, DSU",
  contactLine: "events@dsuniversity.ac.in",
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
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-[720px] max-w-full max-h-[90vh] overflow-y-auto shadow-2xl p-7 text-slate-900 dark:text-slate-100">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
          Edit Certificate Template
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              College Name
            </label>
            <input
              type="text"
              value={formData.collegeName}
              onChange={(e) => handleChange("collegeName", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Issuer Name
            </label>
            <input
              type="text"
              value={formData.issuerName}
              onChange={(e) => handleChange("issuerName", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Accent Color
            </label>
            <div className="flex gap-2.5 items-center">
              <input
                type="color"
                value={formData.accentColor}
                onChange={(e) => handleChange("accentColor", e.target.value)}
                className="w-12 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent p-1"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {formData.accentColor}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Program Line
            </label>
            <input
              type="text"
              value={formData.programLine}
              onChange={(e) => handleChange("programLine", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Details Line
            </label>
            <input
              type="text"
              value={formData.detailsLine}
              onChange={(e) => handleChange("detailsLine", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
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
              className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 dark:file:bg-violet-950/50 dark:file:text-violet-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
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
              className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 dark:file:bg-violet-950/50 dark:file:text-violet-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Signature Name
            </label>
            <input
              type="text"
              value={formData.signatureName}
              onChange={(e) => handleChange("signatureName", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Signature Title
            </label>
            <input
              type="text"
              value={formData.signatureTitle}
              onChange={(e) => handleChange("signatureTitle", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Contact Line
            </label>
            <input
              type="text"
              value={formData.contactLine}
              onChange={(e) => handleChange("contactLine", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(formData)}
            className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Save Template
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold transition-colors"
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
    <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div
        className="rounded-xl p-7 relative overflow-hidden min-h-[340px] shadow-lg font-serif"
        style={{
          border: `2px solid ${accent}`,
          background: "#ffffff",
          color: "#0f172a",
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

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
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
    const refresh = () => {
      const items = loadDeclaredWinners();
      if (items.length > 0) {
        setDeclaredEvents(items);
        if (!selectedEventId && items[0]?.event?.id) {
          setSelectedEventId(items[0].event.id);
        }
      } else {
        // Fallback baseline declared event for guaranteed pristine demo state
        const baseline = [
          {
            event: {
              id: "evt-001",
              title: "National AI Innovation Hackathon 2026",
              type: "Hackathon",
              domain: "Artificial Intelligence",
              status: "completed",
            },
            winners: [
              {
                id: "t-001",
                teamName: "Neural Ninjas",
                position: "1st",
                members: [
                  { name: "Arundhathidevi", department: "CSE" },
                  { name: "Mithul Varshan", department: "CSE" },
                ],
              },
            ],
            participants: [
              {
                id: "t-002",
                teamName: "Code Warriors",
                members: [{ name: "Rohit Sharma", department: "AI-DS" }],
              },
            ],
            declaredAt: new Date().toISOString(),
          },
        ];
        setDeclaredEvents(baseline);
        if (!selectedEventId) {
          setSelectedEventId(baseline[0].event.id);
        }
      }
    };

    refresh();
    window.addEventListener("campusmitra:state-sync", refresh);
    return () => window.removeEventListener("campusmitra:state-sync", refresh);
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Select Event
            </h3>
            <button
              onClick={() => setDeclaredEvents(loadDeclaredWinners())}
              className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Refresh
            </button>
          </div>

          {declaredEvents.length === 0 ? (
            <div className="text-sm text-slate-400 dark:text-slate-500 py-3">
              No declared winners found. Declare winners first to enable sharing.
            </div>
          ) : (
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              {declaredEvents.map((item) => (
                <option key={item?.event?.id} value={item?.event?.id} className="dark:bg-slate-800">
                  {item?.event?.title || "Untitled Event"}
                </option>
              ))}
            </select>
          )}

          {selectedEvent && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg p-3 text-xs">
                <div className="text-slate-500 dark:text-slate-400">Winners</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedEvent?.winners?.length || 0}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3 text-xs">
                <div className="text-slate-500 dark:text-slate-400">Participants</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedEvent?.participants?.length || 0}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Active Template
            </h3>
            <button
              onClick={() => setShowTemplateEditor(true)}
              className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Edit Template
            </button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {template.title} by {template.issuerName}
          </div>
          <button
            onClick={handleShareCertificates}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            Share Certificates
          </button>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2.5">
            Recent Shares ({issuedCerts.length})
          </h4>
          {issuedCerts.length === 0 ? (
            <div className="text-xs text-slate-400 dark:text-slate-500">
              No certificates shared yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {issuedCerts.slice(0, 5).map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs"
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {cert.studentName}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {cert.eventName} • {cert.type}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                    {new Date(cert.issuedAt).toLocaleDateString()} • {cert.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-7">
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
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1.5">
          Certificate Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Choose an event, review the template, and share certificates with
          declared winners and participants.
        </p>
      </div>

      <ShareCertificateTab />
    </div>
  );
}
