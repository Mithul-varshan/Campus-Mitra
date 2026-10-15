import { useState, useEffect, useRef, useMemo } from "react";
import {
  generateQRCodeDataURL,
  triggerCertificateConfetti,
  exportCertificatePDF,
  exportCertificatePNG,
  getLinkedInCertUrl,
  computeVerificationHash,
} from "../utils/certificateExporter";

/* ─── Template Colors by Domain ─────────────────────────────────────── */
const TEMPLATE_COLORS = {
  Hackathon: { bg: "#fef9c3", accent: "#b45309" },
  Workshop: { bg: "#f8fafc", accent: "#475569" },
  Seminar: { bg: "#f0fdf4", accent: "#16a34a" },
  Competition: { bg: "#fef2f2", accent: "#dc2626" },
  Conference: { bg: "#ddd6fe", accent: "#6366f1" },
  Webinar: { bg: "#e0e7ff", accent: "#4f46e5" },
  Bootcamp: { bg: "#fef3c7", accent: "#d97706" },
  Ideathon: { bg: "#ecfdf5", accent: "#059669" },
};

/* ─── Data ──────────────────────────────────────────────────────────── */
const CERTS = [
  {
    id: 1,
    type: "HACKATHON",
    typeColor: "#b45309",
    title: "Campus Hack 2024 — Runner Up",
    issuer: "CampusTech",
    studentName: "Riya Patel",
    category: "Runner-up",
    description:
      "Built an accessible education platform during a 36-hour sprint.",
    tag: "Hackathon",
    verified: true,
    verifiedLabel: "Verified",
    featured: false,
    date: "Nov 2024",
    credentialId: "CH-2024-2ND-2102",
  },
  {
    id: 2,
    type: "WORKSHOP",
    typeColor: "#475569",
    title: "React Performance Workshop",
    issuer: "Frontend Masters",
    studentName: "Riya Patel",
    category: "Completion",
    description:
      "Hands-on workshop covering profiling and optimization techniques.",
    tag: "Workshop",
    verified: true,
    verifiedLabel: "Verified",
    featured: false,
    date: "Oct 2024",
    credentialId: "WF-REACT-2024-3309",
  },
  {
    id: 3,
    type: "COMPETITION",
    typeColor: "#dc2626",
    title: "City IoT Challenge — Finalist",
    issuer: "GovTech",
    studentName: "Riya Patel",
    category: "Finalist",
    description: null,
    tag: "Competition",
    verified: true,
    verifiedLabel: "Verified",
    featured: false,
    date: "Sep 2024",
    credentialId: "CIOT-2024-FNL-4410",
  },
  {
    id: 4,
    type: "SEMINAR",
    typeColor: "#16a34a",
    title: "AI & Future of Work Seminar",
    issuer: "Tech Institute",
    studentName: "Riya Patel",
    category: "Attendance",
    description: "Insightful seminar on AI's impact on modern workplaces.",
    tag: "Seminar",
    verified: true,
    verifiedLabel: "Verified",
    featured: false,
    date: "Aug 2024",
    credentialId: "SEM-AI-2024-7781",
  },
  {
    id: 5,
    type: "IDEATHON",
    typeColor: "#059669",
    title: "Innovation Challenge — 3rd Place",
    issuer: "Startup India",
    studentName: "Riya Patel",
    category: "Winner",
    description: "Prototype for low-cost water purification won 3rd prize.",
    tag: "Ideathon",
    verified: true,
    verifiedLabel: "Verified",
    featured: false,
    date: "Jul 2024",
    credentialId: "IC-2024-3RD-6612",
  },
  {
    id: 6,
    type: "BOOTCAMP",
    typeColor: "#d97706",
    title: "Full-Stack Bootcamp — Participant",
    issuer: "CodeWorks",
    studentName: "Riya Patel",
    category: "Completion",
    description: null,
    tag: "Bootcamp",
    verified: true,
    verifiedLabel: "Verified",
    featured: false,
    date: "Jun 2024",
    credentialId: "CW-BC-2024-9920",
  },
  {
    id: 7,
    type: "HACKATHON",
    typeColor: "#b45309",
    title: "Open Source Sprint — Top 5",
    issuer: "OpenDev",
    studentName: "Riya Patel",
    category: "Achievement",
    description:
      "Contributed major features to an open-source monitoring tool.",
    tag: "Hackathon",
    verified: true,
    verifiedLabel: "Verified",
    featured: false,
    date: "May 2024",
    credentialId: "OSS-2024-T5-2703",
  },
  {
    id: 8,
    type: "WEBINAR",
    typeColor: "#4f46e5",
    title: "Cloud Architecture Fundamentals",
    issuer: "AWS Academy",
    studentName: "Riya Patel",
    category: "Completion",
    description:
      "Comprehensive webinar on AWS cloud services and architecture.",
    tag: "Webinar",
    verified: true,
    verifiedLabel: "Verified",
    featured: false,
    date: "Apr 2024",
    credentialId: "AWS-WEB-2024-1145",
  },
  {
    id: 9,
    type: "CONFERENCE",
    typeColor: "#6366f1",
    title: "TechCon 2024 — Attendee",
    issuer: "TechCon Global",
    studentName: "Riya Patel",
    category: "Attendance",
    description:
      "Attended keynotes and workshops at the annual technology conference.",
    tag: "Conference",
    verified: true,
    verifiedLabel: "Verified",
    featured: false,
    date: "Mar 2024",
    credentialId: "TC-2024-ATT-8844",
  },
  {
    id: 10,
    type: "COMPETITION",
    typeColor: "#dc2626",
    title: "National Coding Contest — Top 10",
    issuer: "CodeNation",
    studentName: "Riya Patel",
    category: "Achievement",
    description: null,
    tag: "Competition",
    verified: true,
    verifiedLabel: "Verified",
    featured: false,
    date: "Feb 2024",
    credentialId: "NC-2024-T10-3321",
  },
];

const TABS = [
  "All",
  "Hackathon",
  "Workshop",
  "Seminar",
  "Competition",
  "Conference",
  "Webinar",
  "Bootcamp",
  "Ideathon",
];

/* ─── Real Scannable QR Code Component ──────────────────────────────── */
function QRBlock({ size = 52, accentColor = "#0f172a", credentialId = "CH-2024-2ND-2102" }) {
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    let mounted = true;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://campusmitra.dsu.edu";
    const verifyUrl = `${origin}/certificates?verify=${encodeURIComponent(credentialId)}`;
    generateQRCodeDataURL(verifyUrl, {
      width: Math.max(120, size * 3),
      darkColor: accentColor,
      margin: 0,
    }).then((url) => {
      if (mounted && url) setQrUrl(url);
    });
    return () => {
      mounted = false;
    };
  }, [credentialId, size, accentColor]);

  return (
    <div
      title={`Scan to verify credential: ${credentialId}`}
      style={{
        width: size,
        height: size,
        background: "#fff",
        borderRadius: 4,
        padding: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.06)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {qrUrl ? (
        <img
          src={qrUrl}
          alt="Verification QR"
          style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }}
        />
      ) : (
        <div style={{ fontSize: 8, color: accentColor, fontWeight: 700 }}>QR</div>
      )}
    </div>
  );
}

/* ─── Certificate Template Preview ─────────────────────────────────── */
function CertificatePreview({ cert, size = "medium" }) {
  const colors = TEMPLATE_COLORS[cert.tag] || {
    bg: "#f8fafc",
    accent: "#475569",
  };
  const isSmall = size === "small";
  const isMedium = size === "medium";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: colors.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: isSmall ? "12px 10px" : isMedium ? "16px 14px" : "24px 20px",
        fontFamily: "Georgia, serif",
        textAlign: "center",
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,.02) 20px, rgba(0,0,0,.02) 40px)",
        position: "relative",
        borderBottom: `3px solid ${colors.accent}`,
      }}
    >
      {/* Header */}
      <div>
        <div
          style={{
            fontSize: isSmall ? 7 : isMedium ? 8 : 10,
            fontWeight: 700,
            color: colors.accent,
            letterSpacing: "1.5px",
            marginBottom: isSmall ? 4 : 8,
          }}
        >
          CAMPUSMITRA
        </div>
        <div
          style={{
            fontSize: isSmall ? 6 : isMedium ? 7 : 9,
            color: colors.accent,
            opacity: 0.7,
          }}
        >
          {cert.issuer}
        </div>
      </div>

      {/* Main Content */}
      <div>
        <div
          style={{
            fontSize: isSmall ? 7 : isMedium ? 9 : 11,
            color: colors.accent,
            marginBottom: isSmall ? 3 : 6,
          }}
        >
          Certificate of {cert.category}
        </div>
        <div
          style={{
            fontSize: isSmall ? 11 : isMedium ? 14 : 20,
            fontWeight: 700,
            color: colors.accent,
            marginBottom: isSmall ? 4 : 8,
            lineHeight: 1.2,
          }}
        >
          {cert.studentName || "[Student Name]"}
        </div>
        <div
          style={{
            fontSize: isSmall ? 6 : isMedium ? 8 : 10,
            color: colors.accent,
            opacity: 0.9,
          }}
        >
          {cert.title}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: `1px solid ${colors.accent}`,
          paddingTop: isSmall ? 6 : 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: isSmall ? 6 : isMedium ? 7 : 9,
          color: colors.accent,
        }}
      >
        <div style={{ textAlign: "left", opacity: 0.8 }}>
          <div style={{ fontStyle: "italic" }}>Authorized</div>
        </div>
        <div style={{ textAlign: "right", opacity: 0.8 }}>
          <div>{cert.date}</div>
        </div>
      </div>

      {/* QR Code */}
      <div
        style={{
          position: "absolute",
          bottom: isSmall ? 6 : 10,
          right: isSmall ? 6 : 10,
        }}
      >
        <QRBlock
          size={isSmall ? 28 : isMedium ? 36 : 46}
          accentColor={colors.accent}
        />
      </div>
    </div>
  );
}

/* ─── Featured (wide) card ──────────────────────────────────────────── */
function FeaturedCard({ cert, onView }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        marginBottom: 20,
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 8px 32px -8px rgba(0,0,0,0.12)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Certificate Preview */}
      <div
        style={{
          width: 280,
          height: 200,
          flexShrink: 0,
          position: "relative",
        }}
      >
        <CertificatePreview cert={cert} size="large" />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: cert.typeColor,
            letterSpacing: "0.6px",
            marginBottom: 8,
          }}
        >
          {cert.type}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 6,
          }}
        >
          {cert.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 13,
            color: "#64748b",
            marginBottom: 12,
          }}
        >
          <iconify-icon icon="lucide:building-2" style={{ fontSize: 13 }} />
          {cert.issuer}
        </div>
        {cert.description && (
          <p
            style={{
              fontSize: 13.5,
              color: "#475569",
              lineHeight: 1.65,
              margin: "0 0 16px",
            }}
          >
            {cert.description}
          </p>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              fontWeight: 600,
              color: "#16a34a",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              padding: "4px 12px",
              borderRadius: 999,
            }}
          >
            <iconify-icon icon="lucide:shield-check" style={{ fontSize: 12 }} />
            {cert.verifiedLabel}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ActionBtn
              icon="lucide:eye"
              title="View"
              onClick={() => onView(cert)}
            />
            <ActionBtn icon="lucide:download" title="Download" />
            <ActionBtn icon="lucide:share-2" title="Share" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Small action button ────────────────────────────────────────────── */
function ActionBtn({ icon, title, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        borderRadius: 7,
        border: "1px solid #e2e8f0",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#64748b",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f1f5f9";
        e.currentTarget.style.color = "#0f172a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.color = "#64748b";
      }}
    >
      <iconify-icon icon={icon} style={{ fontSize: 14 }} />
    </button>
  );
}

/* ─── Grid card ─────────────────────────────────────────────────────── */
function GridCard({ cert, onView }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "pointer",
        minHeight: 320,
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
          height: 150,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <CertificatePreview cert={cert} size="medium" />
      </div>

      {/* Body */}
      <div
        style={{
          padding: "16px 18px 14px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: cert.typeColor,
            letterSpacing: "0.6px",
            marginBottom: 6,
          }}
        >
          {cert.type}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 5,
            lineHeight: 1.4,
          }}
        >
          {cert.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            color: "#64748b",
            marginBottom: 14,
          }}
        >
          <iconify-icon icon="lucide:building-2" style={{ fontSize: 12 }} />
          {cert.issuer}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              color: "#16a34a",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              padding: "3px 9px",
              borderRadius: 999,
            }}
          >
            <iconify-icon icon="lucide:shield-check" style={{ fontSize: 11 }} />
            {cert.verifiedLabel}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ActionBtn
              icon="lucide:eye"
              title="View"
              onClick={() => onView(cert)}
            />
            <ActionBtn icon="lucide:download" title="Download" />
            <ActionBtn icon="lucide:share-2" title="Share" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail Modal ──────────────────────────────────────────────────── */
function CertModal({ cert, onClose }) {
  if (!cert) return null;
  const colors = TEMPLATE_COLORS[cert.tag] || {
    bg: "#f8fafc",
    accent: "#475569",
  };

  const certRef = useRef(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/certificates?verify=${encodeURIComponent(cert.credentialId || "")}`
    : "";

  const linkedInUrl = getLinkedInCertUrl(cert);
  const authHash = computeVerificationHash(cert.credentialId);

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    try {
      setIsExportingPDF(true);
      await exportCertificatePDF(certRef.current, cert);
      triggerCertificateConfetti();
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to export certificate PDF.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (!certRef.current) return;
    try {
      setIsExportingPNG(true);
      await exportCertificatePNG(certRef.current, `${cert.credentialId || "Certificate"}.png`);
      triggerCertificateConfetti();
    } catch (err) {
      console.error("PNG export error:", err);
      alert("Failed to export certificate PNG.");
    } finally {
      setIsExportingPNG(false);
    }
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(verifyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
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
        zIndex: 200,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: 620,
          maxWidth: "94vw",
          maxHeight: "92vh",
          overflow: "auto",
          boxShadow: "0 32px 72px -12px rgba(0,0,0,0.3)",
        }}
      >
        {/* Certificate Preview (Export Target) */}
        <div
          ref={certRef}
          style={{
            height: 290,
            background: colors.bg,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 36px",
            fontFamily: "Georgia, serif",
            textAlign: "center",
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.02) 35px, rgba(0,0,0,.02) 70px)",
            borderBottom: `4px solid ${colors.accent}`,
          }}
        >
          {/* Header */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: colors.accent,
                letterSpacing: "2px",
                marginBottom: 6,
              }}
            >
              CAMPUSMITRA
            </div>
            <div
              style={{
                fontSize: 10,
                color: colors.accent,
                opacity: 0.75,
              }}
            >
              {cert.issuer}
            </div>
          </div>

          {/* Main Content */}
          <div>
            <div
              style={{
                fontSize: 13,
                color: colors.accent,
                marginBottom: 8,
              }}
            >
              Certificate of {cert.category}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: colors.accent,
                marginBottom: 8,
              }}
            >
              {cert.studentName || "[Student Name]"}
            </div>
            <div
              style={{
                fontSize: 12,
                color: colors.accent,
                opacity: 0.9,
              }}
            >
              {cert.title}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: `2px solid ${colors.accent}`,
              paddingTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 10,
              color: colors.accent,
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontStyle: "italic", marginBottom: 2 }}>
                Authorized Signature
              </div>
              <div style={{ fontSize: 9, opacity: 0.7 }}>Event Coordinator</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 9 }}>
              <div>Date: {cert.date}</div>
              <div style={{ marginTop: 2 }}>ID: {cert.credentialId}</div>
            </div>
          </div>

          {/* QR Code */}
          <div style={{ position: "absolute", bottom: 16, right: 20 }}>
            <QRBlock
              size={54}
              accentColor={colors.accent}
              credentialId={cert.credentialId}
            />
          </div>
        </div>

        <div style={{ padding: "26px 30px 30px" }}>
          {/* Close */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: cert.typeColor,
                  letterSpacing: "0.6px",
                  marginBottom: 4,
                }}
              >
                {cert.type}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                {cert.title}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                padding: 4,
                marginLeft: 12,
                flexShrink: 0,
              }}
            >
              <iconify-icon icon="lucide:x" style={{ fontSize: 20 }} />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#64748b",
              marginBottom: 14,
            }}
          >
            <iconify-icon icon="lucide:building-2" style={{ fontSize: 13 }} />
            {cert.issuer}
          </div>

          {cert.description && (
            <p
              style={{
                fontSize: 13.5,
                color: "#475569",
                lineHeight: 1.65,
                marginBottom: 18,
              }}
            >
              {cert.description}
            </p>
          )}

          {/* Meta grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 20,
            }}
          >
            {[
              {
                label: "Issue Date",
                value: cert.date,
                icon: "lucide:calendar",
              },
              { label: "Category", value: cert.tag, icon: "lucide:tag" },
              {
                label: "Credential ID",
                value: cert.credentialId,
                icon: "lucide:hash",
              },
              {
                label: "Integrity Stamp",
                value: authHash,
                icon: "lucide:shield-check",
              },
            ].map((m) => (
              <div key={m.label}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    color: "#94a3b8",
                    fontWeight: 600,
                    marginBottom: 3,
                    letterSpacing: "0.4px",
                  }}
                >
                  <iconify-icon icon={m.icon} style={{ fontSize: 11 }} />
                  {m.label}
                </div>
                <div
                  style={{ fontSize: 12.5, fontWeight: 600, color: "#0f172a", wordBreak: "break-all" }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              style={{
                flex: "1 1 180px",
                padding: "10px 0",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: isExportingPDF ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <iconify-icon
                icon={isExportingPDF ? "lucide:loader-2" : "lucide:download"}
                style={{
                  fontSize: 15,
                  animation: isExportingPDF ? "spin 1s linear infinite" : "none",
                }}
              />
              {isExportingPDF ? "Exporting PDF..." : "Download PDF"}
            </button>
            <button
              onClick={() => setShowShareModal(!showShareModal)}
              style={{
                flex: "1 1 140px",
                padding: "10px 0",
                background: "#fff",
                color: "#334155",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <iconify-icon icon="lucide:share-2" style={{ fontSize: 15 }} />
              Share
            </button>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: "1 1 180px",
                padding: "10px 0",
                background: "#0a66c2",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <iconify-icon icon="lucide:linkedin" style={{ fontSize: 15 }} />
              Add to LinkedIn
            </a>
          </div>

          {/* Share Modal Drawer */}
          {showShareModal && (
            <div
              style={{
                marginTop: 16,
                padding: "14px 16px",
                background: "#f1f5f9",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                Public Verification Link
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <input
                  type="text"
                  readOnly
                  value={verifyUrl}
                  style={{
                    flex: 1,
                    background: "#fff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    padding: "6px 10px",
                    fontSize: 12,
                    color: "#334155",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleCopyLink}
                  style={{
                    background: copiedLink ? "#16a34a" : "var(--primary)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {copiedLink ? "Copied!" : "Copy"}
                </button>
              </div>
              <button
                onClick={handleDownloadPNG}
                disabled={isExportingPNG}
                style={{
                  background: "#fff",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: isExportingPNG ? "wait" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <iconify-icon icon="lucide:image" style={{ fontSize: 13 }} />
                {isExportingPNG ? "Generating PNG..." : "Export as High-Res PNG"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Load issued certificates dynamically from Admin ────────────── */
const loadIssuedCertificates = () => {
  try {
    const raw = localStorage.getItem("campusMitra_issued_certificates");
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.map((item, idx) => ({
      id: item.id || `issued-${idx}`,
      type: item.type === "Winner" ? "HACKATHON" : "WORKSHOP",
      typeColor: item.type === "Winner" ? "#b45309" : "#4f46e5",
      title: item.eventName || "CampusMitra Achievement",
      issuer: "Dhanalakshmi Srinivasan University",
      studentName: item.studentName || "Riya Patel",
      category: item.type || "Certificate of Excellence",
      description: item.teamName
        ? `Awarded to team "${item.teamName}" for outstanding technical performance.`
        : "Officially conferred by DSU Academic Affairs.",
      tag: item.type === "Winner" ? "Hackathon" : "Workshop",
      verified: true,
      verifiedLabel: "Verified",
      featured: idx === 0,
      date: item.issuedAt
        ? new Date(item.issuedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "Oct 2026",
      credentialId: item.id || `DSU-ISS-${1000 + idx}`,
      isNew: true,
    }));
  } catch (e) {
    return [];
  }
};

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function Certificates() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedCert, setSelectedCert] = useState(null);
  const [issuedCerts, setIssuedCerts] = useState(loadIssuedCertificates);

  useEffect(() => {
    const sync = () => setIssuedCerts(loadIssuedCertificates());
    window.addEventListener("campusmitra:state-sync", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("campusmitra:state-sync", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const allCerts = useMemo(() => {
    return [...issuedCerts, ...CERTS];
  }, [issuedCerts]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyId = params.get("verify");
    if (verifyId) {
      const match = allCerts.find((c) => c.credentialId === verifyId);
      if (match) {
        setSelectedCert(match);
        triggerCertificateConfetti();
      }
    }
  }, [allCerts]);

  const filtered = allCerts.filter(
    (c) => activeTab === "All" || c.tag === activeTab,
  );
  const featured = filtered.find((c) => c.featured);
  const grid = filtered.filter((c) => !c.featured);

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: 1100,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: "0 0 4px",
              color: "#0f172a",
            }}
          >
            My Certificates
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Verify, download, and share your academic achievements.
          </p>
        </div>

        {/* Tab pills — right side */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            background: "#f1f5f9",
            borderRadius: 9,
            padding: 4,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "7px 12px",
                borderRadius: 6,
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background:
                  activeTab === tab ? "var(--primary)" : "transparent",
                color: activeTab === tab ? "#fff" : "#64748b",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid cards ── */}
      {featured && <FeaturedCard cert={featured} onView={setSelectedCert} />}

      {/* ── Grid cards ── */}
      {grid.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {grid.map((cert) => (
            <GridCard key={cert.id} cert={cert} onView={setSelectedCert} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 32px",
            color: "#94a3b8",
          }}
        >
          <iconify-icon
            icon="lucide:file-badge"
            style={{ fontSize: 52, display: "block", margin: "0 auto 12px" }}
          />
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 6,
              color: "#475569",
            }}
          >
            No certificates found
          </div>
          <div style={{ fontSize: 14 }}>
            Participate in events to earn certificates.
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
    </div>
  );
}
