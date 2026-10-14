import { useState } from "react";

export default function RecruiterSettings() {
  const [form, setForm] = useState({
    name: "Rohan Kapoor",
    title: "Senior Technical Recruiter",
    email: "rohan.kapoor@techmahindra.com",
    phone: "+91 98765 43210",
    company: "Tech Mahindra",
    industry: "IT Services & Consulting",
    website: "https://techmahindra.com",
    hq: "Pune, Maharashtra",
    size: "100,000+",
    about: "Tech Mahindra is a global provider of IT and BPO services. We actively recruit from top engineering and MBA colleges across India.",
    autoMatch: true,
    emailAlerts: true,
    weeklyDigest: false,
    publicProfile: true,
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const Section = ({ title, icon, color, children }) => (
    <div style={{ background: "var(--card, white)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px" }}>
        <iconify-icon icon={icon} style={{ color }}></iconify-icon> {title}
      </h2>
      {children}
    </div>
  );

  const Field = ({ label, k, type = "text", placeholder }) => (
    <div>
      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>{label}</label>
      {type === "textarea"
        ? <textarea rows={3} value={form[k]} onChange={(e) => update(k, e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)", fontSize: "13px", color: "var(--foreground)", outline: "none", resize: "vertical", boxSizing: "border-box" }}></textarea>
        : <input type={type} value={form[k]} onChange={(e) => update(k, e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)", fontSize: "13px", color: "var(--foreground)", outline: "none", boxSizing: "border-box" }} />}
    </div>
  );

  const Toggle = ({ label, desc, k }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--foreground)" }}>{label}</div>
        <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{desc}</div>
      </div>
      <div onClick={() => update(k, !form[k])} style={{ width: "44px", height: "24px", borderRadius: "12px", background: form[k] ? "#f97316" : "var(--border)", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
        <div style={{ position: "absolute", top: "3px", left: form[k] ? "22px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "white", transition: "left 0.2s" }}></div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", background: "var(--background)", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)", margin: "0 0 6px 0" }}>Settings & Company Profile</h1>
        <p style={{ fontSize: "14px", color: "var(--muted-foreground)", margin: 0 }}>Manage your recruiter profile and preferences.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", alignItems: "start" }}>
        <div>
          {/* Personal Info */}
          <Section title="Personal Information" icon="lucide:user" color="#f97316">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <Field label="Full Name" k="name" placeholder="Your name" />
              <Field label="Job Title" k="title" placeholder="Your designation" />
              <Field label="Work Email" k="email" type="email" placeholder="your@company.com" />
              <Field label="Phone" k="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
            </div>
          </Section>

          {/* Company Info */}
          <Section title="Company Profile" icon="lucide:building-2" color="#3b82f6">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <Field label="Company Name" k="company" placeholder="Company name" />
              <Field label="Industry" k="industry" placeholder="e.g. IT Services" />
              <Field label="Website" k="website" placeholder="https://company.com" />
              <Field label="Headquarters" k="hq" placeholder="City, State" />
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>Company Size</label>
                <select value={form.size} onChange={(e) => update("size", e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)", fontSize: "13px", color: "var(--foreground)" }}>
                  {["1–50", "50–200", "200–1000", "1000–10,000", "10,000–100,000", "100,000+"].map((s) => <option key={s} value={s}>{s} employees</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="About the Company" k="about" type="textarea" placeholder="Brief company description..." />
              </div>
            </div>
          </Section>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Profile Preview */}
          <div style={{ background: "var(--card, white)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ height: "70px", background: "linear-gradient(135deg, #f97316, #ef4444)" }}></div>
            <div style={{ padding: "0 16px 16px", textAlign: "center", marginTop: "-24px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ef4444)", color: "white", fontWeight: 700, fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", border: "3px solid white" }}>
                {form.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{form.name}</div>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{form.title}</div>
              <div style={{ fontSize: "12px", color: "#f97316", fontWeight: 600, marginTop: "4px" }}>{form.company}</div>
            </div>
          </div>

          {/* Notifications */}
          <div style={{ background: "var(--card, white)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <iconify-icon icon="lucide:bell" style={{ color: "#f97316" }}></iconify-icon> Preferences
            </h2>
            <Toggle label="Auto-Match Alerts" desc="Get notified when new candidates match your JDs" k="autoMatch" />
            <Toggle label="Email Notifications" desc="Daily application summaries via email" k="emailAlerts" />
            <Toggle label="Weekly Digest" desc="Weekly summary of top candidates" k="weeklyDigest" />
            <Toggle label="Public Recruiter Profile" desc="Candidates can view your company profile" k="publicProfile" />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
        <button style={{ padding: "11px 32px", borderRadius: "8px", background: "#f97316", color: "white", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
        <button style={{ padding: "11px 24px", borderRadius: "8px", background: "transparent", color: "var(--foreground)", border: "1px solid var(--border)", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>Discard</button>
      </div>
    </div>
  );
}
