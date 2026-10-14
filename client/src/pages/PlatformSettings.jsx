import { useState } from "react";

/* ─── Reusable primitives ───────────────────────────────────────────── */
function SectionCard({ icon, iconColor, iconBg, title, subtitle, children }) {
  return (
    <div
      style={{
        background: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 22px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <iconify-icon
            icon={icon}
            style={{ fontSize: "18px", color: iconColor }}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                marginTop: "1px",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: "20px 22px" }}>{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--foreground)",
          marginBottom: "4px",
        }}
      >
        {label}
      </label>
      {hint && (
        <div
          style={{
            fontSize: "11px",
            color: "var(--muted-foreground)",
            marginBottom: "6px",
          }}
        >
          {hint}
        </div>
      )}
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, mono }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "9px 12px",
        fontSize: "13px",
        fontFamily: mono ? "monospace" : "inherit",
        border: "1px solid var(--border)",
        borderRadius: "9px",
        background: "var(--muted)",
        color: "var(--foreground)",
        outline: "none",
      }}
    />
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "9px 12px",
        fontSize: "13px",
        border: "1px solid var(--border)",
        borderRadius: "9px",
        background: "var(--muted)",
        color: "var(--foreground)",
        outline: "none",
        cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Toggle({ checked, onChange, label, description, danger }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ flex: 1, paddingRight: "16px" }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: danger ? "#dc2626" : "var(--foreground)",
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontSize: "12px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: "46px",
          height: "26px",
          borderRadius: "999px",
          border: "none",
          cursor: "pointer",
          background: checked
            ? danger
              ? "#dc2626"
              : "var(--primary)"
            : "var(--border)",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: checked ? "22px" : "3px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}

function SaveRow({ onSave, saved }) {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}
    >
      <button
        onClick={onSave}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "9px 20px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          background: saved ? "#16a34a" : "var(--primary)",
          color: "white",
          fontSize: "13px",
          fontWeight: 700,
          transition: "background 0.3s",
        }}
      >
        <iconify-icon
          icon={saved ? "lucide:check" : "lucide:save"}
          style={{ fontSize: "15px" }}
        />
        {saved ? "Saved!" : "Save Changes"}
      </button>
    </div>
  );
}

/* ─── Color picker swatch row ───────────────────────────────────────── */
const PALETTE = [
  "#4f46e5",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#db2777",
];

function ColorPicker({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {PALETTE.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: c,
            border: "none",
            cursor: "pointer",
            outline: value === c ? `3px solid ${c}` : "3px solid transparent",
            outlineOffset: "2px",
            transition: "outline 0.15s",
          }}
        />
      ))}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        title="Custom colour"
        style={{
          width: "28px",
          height: "28px",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          cursor: "pointer",
          padding: "0",
          background: "none",
        }}
      />
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function PlatformSettings() {
  /* Saved flash per section */
  const [saved, setSaved] = useState({});
  const flash = (key) => {
    setSaved((p) => ({ ...p, [key]: true }));
    setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 2500);
  };

  /* ── Branding ── */
  const [brand, setBrand] = useState({
    platformName: "CampusMitra",
    tagline: "Connect. Build. Grow.",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#4f46e5",
    supportEmail: "support@campusmitra.io",
    websiteUrl: "https://campusmitra.io",
    footerText: "© 2026 CampusMitra. All rights reserved.",
  });

  /* ── Email config ── */
  const [email, setEmail] = useState({
    provider: "smtp",
    host: "smtp.mailgun.org",
    port: "587",
    username: "postmaster@campusmitra.io",
    password: "••••••••••••",
    fromName: "CampusMitra",
    fromAddress: "no-reply@campusmitra.io",
    tlsEnabled: true,
    verifyEnabled: true,
  });

  /* ── Announcements ── */
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      text: "Scheduled maintenance on Feb 22, 2026 from 2–4 AM IST.",
      type: "warning",
      active: true,
    },
    {
      id: 2,
      text: "New AI Assistant features are now live for Enterprise colleges!",
      type: "info",
      active: true,
    },
    {
      id: 3,
      text: "Certificate digital signatures upgraded to RSA-4096.",
      type: "success",
      active: false,
    },
  ]);
  const [newAnn, setNewAnn] = useState({ text: "", type: "info" });

  /* ── Maintenance ── */
  const [maintenance, setMaintenance] = useState({
    enabled: false,
    message:
      "CampusMitra is undergoing scheduled maintenance. We'll be back shortly.",
    allowAdmins: true,
    scheduledStart: "2026-02-22T02:00",
    scheduledEnd: "2026-02-22T04:00",
    showCountdown: true,
    notifyColleges: true,
  });

  /* ── Data retention ── */
  const [retention, setRetention] = useState({
    logRetentionDays: "90",
    auditLogRetentionDays: "365",
    certificateRetentionYears: "10",
    inactiveAccountDays: "180",
    autoDeleteInactive: false,
    backupFrequency: "daily",
    backupRetentionWeeks: "8",
    gdprMode: true,
    anonymizeOnDelete: true,
  });

  const annTypeStyle = {
    info: {
      bg: "#eff6ff",
      color: "#2563eb",
      border: "#bfdbfe",
      icon: "lucide:info",
    },
    warning: {
      bg: "#fffbeb",
      color: "#d97706",
      border: "#fde68a",
      icon: "lucide:alert-triangle",
    },
    success: {
      bg: "#f0fdf4",
      color: "#16a34a",
      border: "#bbf7d0",
      icon: "lucide:check-circle",
    },
    error: {
      bg: "#fef2f2",
      color: "#dc2626",
      border: "#fecaca",
      icon: "lucide:alert-circle",
    },
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 800,
            margin: "0 0 4px",
            color: "var(--foreground)",
          }}
        >
          Platform Settings
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "var(--muted-foreground)",
            margin: 0,
          }}
        >
          Configure global branding, email, announcements, maintenance mode, and
          data policies
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        {/* ══════════════════════════════════════════
            1. GLOBAL BRANDING
        ══════════════════════════════════════════ */}
        <SectionCard
          icon="lucide:palette"
          iconColor="#7c3aed"
          iconBg="#faf5ff"
          title="Global Branding"
          subtitle="Platform name, logo, colours, and contact info shown across all colleges"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 24px",
            }}
          >
            <Field label="Platform Name">
              <TextInput
                value={brand.platformName}
                onChange={(v) => setBrand({ ...brand, platformName: v })}
              />
            </Field>
            <Field label="Tagline">
              <TextInput
                value={brand.tagline}
                onChange={(v) => setBrand({ ...brand, tagline: v })}
              />
            </Field>
            <Field
              label="Logo URL"
              hint="Hosted image URL (SVG or PNG, min 200×60px)"
            >
              <TextInput
                value={brand.logoUrl}
                onChange={(v) => setBrand({ ...brand, logoUrl: v })}
                placeholder="https://cdn.example.com/logo.svg"
                mono
              />
            </Field>
            <Field label="Favicon URL" hint="32×32 ICO or PNG">
              <TextInput
                value={brand.faviconUrl}
                onChange={(v) => setBrand({ ...brand, faviconUrl: v })}
                placeholder="https://cdn.example.com/favicon.ico"
                mono
              />
            </Field>
            <Field label="Support Email">
              <TextInput
                value={brand.supportEmail}
                onChange={(v) => setBrand({ ...brand, supportEmail: v })}
                mono
              />
            </Field>
            <Field label="Website URL">
              <TextInput
                value={brand.websiteUrl}
                onChange={(v) => setBrand({ ...brand, websiteUrl: v })}
                mono
              />
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Footer Text">
                <TextInput
                  value={brand.footerText}
                  onChange={(v) => setBrand({ ...brand, footerText: v })}
                />
              </Field>
            </div>
            <div style={{ gridColumn: "1 / -1", marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  marginBottom: "8px",
                }}
              >
                Primary Brand Colour
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <ColorPicker
                  value={brand.primaryColor}
                  onChange={(v) => setBrand({ ...brand, primaryColor: v })}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 14px",
                    background: brand.primaryColor,
                    borderRadius: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    Preview
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {brand.primaryColor}
                </span>
              </div>
            </div>
          </div>
          <SaveRow onSave={() => flash("brand")} saved={saved.brand} />
        </SectionCard>

        {/* ══════════════════════════════════════════
            2. EMAIL CONFIGURATION
        ══════════════════════════════════════════ */}
        <SectionCard
          icon="lucide:mail"
          iconColor="#2563eb"
          iconBg="#eff6ff"
          title="Email Configuration"
          subtitle="SMTP settings for system notifications, OTPs and certificate delivery"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 24px",
            }}
          >
            <div style={{ gridColumn: "1 / -1", marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  marginBottom: "6px",
                }}
              >
                Email Provider
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["smtp", "sendgrid", "mailgun", "ses"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setEmail({ ...email, provider: p })}
                    style={{
                      padding: "7px 16px",
                      borderRadius: "9px",
                      cursor: "pointer",
                      border: `1.5px solid ${email.provider === p ? "var(--primary)" : "var(--border)"}`,
                      background:
                        email.provider === p
                          ? "var(--primary)"
                          : "var(--muted)",
                      color:
                        email.provider === p
                          ? "white"
                          : "var(--muted-foreground)",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      transition: "all 0.15s",
                    }}
                  >
                    {p === "ses"
                      ? "Amazon SES"
                      : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Field label="SMTP Host">
              <TextInput
                value={email.host}
                onChange={(v) => setEmail({ ...email, host: v })}
                mono
              />
            </Field>
            <Field label="SMTP Port">
              <TextInput
                value={email.port}
                onChange={(v) => setEmail({ ...email, port: v })}
                mono
              />
            </Field>
            <Field label="Username / API Key">
              <TextInput
                value={email.username}
                onChange={(v) => setEmail({ ...email, username: v })}
                mono
              />
            </Field>
            <Field label="Password / Secret">
              <TextInput
                value={email.password}
                onChange={(v) => setEmail({ ...email, password: v })}
                mono
              />
            </Field>
            <Field label="From Name">
              <TextInput
                value={email.fromName}
                onChange={(v) => setEmail({ ...email, fromName: v })}
              />
            </Field>
            <Field label="From Address">
              <TextInput
                value={email.fromAddress}
                onChange={(v) => setEmail({ ...email, fromAddress: v })}
                mono
              />
            </Field>
          </div>

          <div style={{ marginBottom: "6px" }}>
            <Toggle
              checked={email.tlsEnabled}
              onChange={(v) => setEmail({ ...email, tlsEnabled: v })}
              label="Enable TLS / STARTTLS"
              description="Encrypt SMTP connection (recommended)"
            />
            <Toggle
              checked={email.verifyEnabled}
              onChange={(v) => setEmail({ ...email, verifyEnabled: v })}
              label="Verify SSL Certificate"
              description="Reject connections with invalid certificates"
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 16px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--muted)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              <iconify-icon icon="lucide:send" style={{ fontSize: "14px" }} />{" "}
              Send Test Email
            </button>
            <SaveRow onSave={() => flash("email")} saved={saved.email} />
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════
            3. SYSTEM ANNOUNCEMENTS
        ══════════════════════════════════════════ */}
        <SectionCard
          icon="lucide:megaphone"
          iconColor="#d97706"
          iconBg="#fffbeb"
          title="System Announcements"
          subtitle="Banners shown to all users at the top of their dashboard"
        >
          {/* Existing */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {announcements.map((ann) => {
              const s = annTypeStyle[ann.type];
              return (
                <div
                  key={ann.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: "11px",
                    opacity: ann.active ? 1 : 0.5,
                  }}
                >
                  <iconify-icon
                    icon={s.icon}
                    style={{ fontSize: "17px", color: s.color, flexShrink: 0 }}
                  />
                  <span
                    style={{
                      flex: 1,
                      fontSize: "13px",
                      color: s.color,
                      fontWeight: 500,
                    }}
                  >
                    {ann.text}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {/* Active toggle */}
                    <button
                      onClick={() =>
                        setAnnouncements((prev) =>
                          prev.map((a) =>
                            a.id === ann.id ? { ...a, active: !a.active } : a,
                          ),
                        )
                      }
                      title={ann.active ? "Deactivate" : "Activate"}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "7px",
                        border: `1px solid ${s.border}`,
                        background: ann.active ? s.color : "transparent",
                        color: ann.active ? "white" : s.color,
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {ann.active ? "Live" : "Off"}
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() =>
                        setAnnouncements((prev) =>
                          prev.filter((a) => a.id !== ann.id),
                        )
                      }
                      style={{
                        width: "28px",
                        height: "28px",
                        border: "1px solid #fecaca",
                        borderRadius: "7px",
                        background: "#fef2f2",
                        cursor: "pointer",
                        color: "#dc2626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <iconify-icon
                        icon="lucide:trash-2"
                        style={{ fontSize: "13px" }}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add new */}
          <div
            style={{
              background: "var(--muted)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--foreground)",
                marginBottom: "12px",
              }}
            >
              Add Announcement
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "10px",
                alignItems: "flex-end",
              }}
            >
              <Field label="Message">
                <TextInput
                  value={newAnn.text}
                  onChange={(v) => setNewAnn({ ...newAnn, text: v })}
                  placeholder="Type your announcement..."
                />
              </Field>
              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "6px",
                  }}
                >
                  Type
                </label>
                <SelectInput
                  value={newAnn.type}
                  onChange={(v) => setNewAnn({ ...newAnn, type: v })}
                  options={[
                    { value: "info", label: "Info" },
                    { value: "warning", label: "Warning" },
                    { value: "success", label: "Success" },
                    { value: "error", label: "Error" },
                  ]}
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (!newAnn.text.trim()) return;
                setAnnouncements((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    text: newAnn.text,
                    type: newAnn.type,
                    active: true,
                  },
                ]);
                setNewAnn({ text: "", type: "info" });
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 16px",
                borderRadius: "9px",
                border: "none",
                background: "var(--primary)",
                cursor: "pointer",
                color: "white",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              <iconify-icon icon="lucide:plus" style={{ fontSize: "15px" }} />{" "}
              Post Announcement
            </button>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════
            4. MAINTENANCE MODE
        ══════════════════════════════════════════ */}
        <SectionCard
          icon="lucide:wrench"
          iconColor={maintenance.enabled ? "#dc2626" : "#64748b"}
          iconBg={maintenance.enabled ? "#fef2f2" : "#f8fafc"}
          title="Maintenance Mode"
          subtitle="Take the platform offline for all non-admin users"
        >
          {/* Big status indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "20px",
              background: maintenance.enabled ? "#fef2f2" : "#f0fdf4",
              border: `1.5px solid ${maintenance.enabled ? "#fecaca" : "#bbf7d0"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: maintenance.enabled ? "#dc2626" : "#16a34a",
                  boxShadow: maintenance.enabled
                    ? "0 0 0 4px #fecaca"
                    : "0 0 0 4px #bbf7d0",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: maintenance.enabled ? "#dc2626" : "#16a34a",
                  }}
                >
                  {maintenance.enabled
                    ? "Maintenance Mode ACTIVE"
                    : "Platform Operational"}
                </div>
                <div
                  style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
                >
                  {maintenance.enabled
                    ? "Non-admin users are seeing the maintenance page"
                    : "All users have full access"}
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                setMaintenance({
                  ...maintenance,
                  enabled: !maintenance.enabled,
                })
              }
              style={{
                padding: "10px 22px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                background: maintenance.enabled ? "#16a34a" : "#dc2626",
                color: "white",
                fontSize: "13px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <iconify-icon
                icon={maintenance.enabled ? "lucide:power" : "lucide:wrench"}
                style={{ fontSize: "15px" }}
              />
              {maintenance.enabled
                ? "Disable Maintenance"
                : "Enable Maintenance"}
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 24px",
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <Field
                label="Maintenance Message"
                hint="Shown to users on the maintenance screen"
              >
                <textarea
                  value={maintenance.message}
                  onChange={(e) =>
                    setMaintenance({ ...maintenance, message: e.target.value })
                  }
                  rows={2}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "9px 12px",
                    fontSize: "13px",
                    border: "1px solid var(--border)",
                    borderRadius: "9px",
                    background: "var(--muted)",
                    color: "var(--foreground)",
                    outline: "none",
                    resize: "vertical",
                    lineHeight: 1.5,
                  }}
                />
              </Field>
            </div>
            <Field label="Scheduled Start">
              <input
                type="datetime-local"
                value={maintenance.scheduledStart}
                onChange={(e) =>
                  setMaintenance({
                    ...maintenance,
                    scheduledStart: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "9px 12px",
                  fontSize: "13px",
                  border: "1px solid var(--border)",
                  borderRadius: "9px",
                  background: "var(--muted)",
                  color: "var(--foreground)",
                  outline: "none",
                }}
              />
            </Field>
            <Field label="Scheduled End">
              <input
                type="datetime-local"
                value={maintenance.scheduledEnd}
                onChange={(e) =>
                  setMaintenance({
                    ...maintenance,
                    scheduledEnd: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "9px 12px",
                  fontSize: "13px",
                  border: "1px solid var(--border)",
                  borderRadius: "9px",
                  background: "var(--muted)",
                  color: "var(--foreground)",
                  outline: "none",
                }}
              />
            </Field>
          </div>

          <div style={{ marginBottom: "6px" }}>
            <Toggle
              checked={maintenance.allowAdmins}
              onChange={(v) =>
                setMaintenance({ ...maintenance, allowAdmins: v })
              }
              label="Allow Super Admins to access during maintenance"
              description="Super admin accounts bypass the maintenance screen"
            />
            <Toggle
              checked={maintenance.showCountdown}
              onChange={(v) =>
                setMaintenance({ ...maintenance, showCountdown: v })
              }
              label="Show countdown timer on maintenance page"
              description="Uses the scheduled end time as target"
            />
            <Toggle
              checked={maintenance.notifyColleges}
              onChange={(v) =>
                setMaintenance({ ...maintenance, notifyColleges: v })
              }
              label="Email colleges before maintenance starts"
              description="Send notification 30 minutes before scheduled start"
            />
          </div>

          <SaveRow
            onSave={() => flash("maintenance")}
            saved={saved.maintenance}
          />
        </SectionCard>

        {/* ══════════════════════════════════════════
            5. DATA RETENTION POLICY
        ══════════════════════════════════════════ */}
        <SectionCard
          icon="lucide:database"
          iconColor="#0891b2"
          iconBg="#ecfeff"
          title="Data Retention Policy"
          subtitle="Control how long platform data is stored before automatic purging"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 24px",
            }}
          >
            <Field label="System Logs Retention" hint="Activity and error logs">
              <SelectInput
                value={retention.logRetentionDays}
                onChange={(v) =>
                  setRetention({ ...retention, logRetentionDays: v })
                }
                options={[
                  { value: "30", label: "30 days" },
                  { value: "60", label: "60 days" },
                  { value: "90", label: "90 days" },
                  { value: "180", label: "180 days" },
                  { value: "365", label: "1 year" },
                ]}
              />
            </Field>
            <Field label="Audit Log Retention" hint="Admin action audit trail">
              <SelectInput
                value={retention.auditLogRetentionDays}
                onChange={(v) =>
                  setRetention({ ...retention, auditLogRetentionDays: v })
                }
                options={[
                  { value: "90", label: "90 days" },
                  { value: "180", label: "180 days" },
                  { value: "365", label: "1 year" },
                  { value: "730", label: "2 years" },
                  { value: "forever", label: "Forever" },
                ]}
              />
            </Field>
            <Field
              label="Certificate Records Retention"
              hint="Issued certificate metadata"
            >
              <SelectInput
                value={retention.certificateRetentionYears}
                onChange={(v) =>
                  setRetention({ ...retention, certificateRetentionYears: v })
                }
                options={[
                  { value: "5", label: "5 years" },
                  { value: "10", label: "10 years" },
                  { value: "20", label: "20 years" },
                  { value: "forever", label: "Forever (recommended)" },
                ]}
              />
            </Field>
            <Field
              label="Inactive Account Threshold"
              hint="Days before an account is flagged as inactive"
            >
              <SelectInput
                value={retention.inactiveAccountDays}
                onChange={(v) =>
                  setRetention({ ...retention, inactiveAccountDays: v })
                }
                options={[
                  { value: "90", label: "90 days" },
                  { value: "180", label: "180 days" },
                  { value: "365", label: "1 year" },
                  { value: "730", label: "2 years" },
                ]}
              />
            </Field>
            <Field label="Backup Frequency">
              <SelectInput
                value={retention.backupFrequency}
                onChange={(v) =>
                  setRetention({ ...retention, backupFrequency: v })
                }
                options={[
                  { value: "hourly", label: "Hourly" },
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                ]}
              />
            </Field>
            <Field
              label="Backup Retention"
              hint="How many backup snapshots to keep"
            >
              <SelectInput
                value={retention.backupRetentionWeeks}
                onChange={(v) =>
                  setRetention({ ...retention, backupRetentionWeeks: v })
                }
                options={[
                  { value: "2", label: "2 weeks" },
                  { value: "4", label: "4 weeks" },
                  { value: "8", label: "8 weeks" },
                  { value: "12", label: "12 weeks" },
                  { value: "26", label: "6 months" },
                ]}
              />
            </Field>
          </div>

          <div style={{ margin: "4px 0 8px" }}>
            <Toggle
              checked={retention.autoDeleteInactive}
              onChange={(v) =>
                setRetention({ ...retention, autoDeleteInactive: v })
              }
              label="Auto-delete inactive accounts"
              description="Permanently remove accounts inactive beyond the threshold"
              danger
            />
            <Toggle
              checked={retention.gdprMode}
              onChange={(v) => setRetention({ ...retention, gdprMode: v })}
              label="GDPR / data privacy mode"
              description="Enable right-to-erasure workflows and consent tracking"
            />
            <Toggle
              checked={retention.anonymizeOnDelete}
              onChange={(v) =>
                setRetention({ ...retention, anonymizeOnDelete: v })
              }
              label="Anonymize data on account deletion"
              description="Replace PII with anonymized tokens instead of hard delete"
            />
          </div>

          {/* Warning callout when auto-delete is on */}
          {retention.autoDeleteInactive && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                padding: "12px 14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                marginTop: "8px",
                marginBottom: "12px",
              }}
            >
              <iconify-icon
                icon="lucide:alert-triangle"
                style={{
                  fontSize: "17px",
                  color: "#dc2626",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              />
              <div
                style={{ fontSize: "12px", color: "#7f1d1d", lineHeight: 1.6 }}
              >
                <strong>Warning:</strong> Auto-delete is enabled. Accounts
                inactive for more than {retention.inactiveAccountDays} days will
                be permanently removed. Ensure a backup policy is active before
                enabling this.
              </div>
            </div>
          )}

          <SaveRow onSave={() => flash("retention")} saved={saved.retention} />
        </SectionCard>
      </div>
    </div>
  );
}
