import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles, ChevronRight, X, Menu,
  BrainCircuit, Trophy, FileBarChart2, Globe,
  CheckCircle2, XCircle,
  Building2, GraduationCap, CalendarCheck2, Award,
  BarChart3, Users, Zap, Shield, Star, ChevronDown,
  Medal, Briefcase, BookOpen, Bell, TrendingUp, Lock,
  LayoutDashboard, ClipboardList, UserCheck, Search,
  FileText, Settings, Activity, Database,
} from "lucide-react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const NAV_LINKS = [["Product", "#product"], ["Features", "#features"], ["For Whom", "#roles"], ["Accreditation", "#accreditation"], ["Pricing", "#pricing"]];

const STATS = [
  { Icon: Building2, label: "Institutions", value: "100+", sub: "Onboarding" },
  { Icon: GraduationCap, label: "Students", value: "1L+", sub: "Tracked" },
  { Icon: CalendarCheck2, label: "Events", value: "300+", sub: "Managed" },
  { Icon: Award, label: "Certificates", value: "45K+", sub: "Issued" },
];

const PROBLEMS = [
  "Achievements scattered across departments",
  "Manual NAAC / NIRF documentation",
  "No real-time engagement analytics",
  "No centralized innovation record",
  "Excel-based tracking everywhere",
];

const SOLUTIONS = [
  "Centralized innovation record for every student",
  "AI-generated NAAC / NIRF / AQAR reports",
  "Live engagement and participation analytics",
  "Gamified leaderboards and certificate authority",
  "One dashboard — replace 50+ disconnected tools",
];

const FEATURES = [
  {
    Icon: BrainCircuit, tag: "AI-Powered",
    label: "Student Growth Tracker",
    desc: "Personalized growth signals, skill trajectories, and innovation credits for every student — automatically.",
    accent: "#6366f1",
  },
  {
    Icon: Trophy, tag: "Gamified",
    label: "Smart Event & Leaderboard",
    desc: "Boost campus engagement with gamified events, live leaderboards, and measurable outcome tracking.",
    accent: "#f59e0b",
  },
  {
    Icon: FileBarChart2, tag: "Accreditation",
    label: "Accreditation Intelligence",
    desc: "Predictive SSR, AQAR generation and NIRF parameter tracking — no manual compilation needed.",
    accent: "#10b981",
  },
  {
    Icon: Globe, tag: "Cross-College",
    label: "Innovation Ecosystem",
    desc: "Share projects, mentors, and funding across institutions. Build a network that transcends boundaries.",
    accent: "#3b82f6",
  },
  {
    Icon: BarChart3, tag: "Analytics",
    label: "Real-Time Analytics",
    desc: "College-wide metrics, participation heat maps, and skill distribution charts in one dashboard.",
    accent: "#ec4899",
  },
  {
    Icon: Shield, tag: "Compliance",
    label: "Audit & Compliance Logs",
    desc: "Full audit trails, role-based access control, and tamper-proof certificate authority built in.",
    accent: "#8b5cf6",
  },
  {
    Icon: Users, tag: "Recruitment",
    label: "Recruiter Module",
    desc: "Let companies discover top talent with skill heatmaps, candidate auto-matching, and interview pipelines.",
    accent: "#06b6d4",
  },
  {
    Icon: Database, tag: "AI Assistant",
    label: "DB Assistant",
    desc: "Ask natural-language questions about your campus data — no SQL, no exports, instant answers.",
    accent: "#f97316",
  },
];

const ROLES = [
  {
    icon: GraduationCap, role: "Student",
    color: "#6366f1",
    bg: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
    points: ["Personal Dashboard & Innovation Score", "Event Registration & Team Formation", "Portfolio, Devlogs & Certificates", "Cross-College Leaderboard", "Find Teammates & Collaborators"],
  },
  {
    icon: Building2, role: "College Admin",
    color: "#10b981",
    bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
    points: ["Event Creation & Management", "NAAC / NIRF / AQAR Reports", "User Management & Bulk Import", "Mentor-Student Mapping", "Analytics & DB Assistant"],
  },
  {
    icon: BookOpen, role: "Faculty",
    color: "#f59e0b",
    bg: "linear-gradient(135deg,#fffbeb,#fef3c7)",
    points: ["My Students Progress View", "Verified Achievement Tracking", "Skill Intelligence Insights", "Event Co-ordination", "Devlog Reviews"],
  },
  {
    icon: Briefcase, role: "Recruiter",
    color: "#3b82f6",
    bg: "linear-gradient(135deg,#eff6ff,#dbeafe)",
    points: ["College Explorer & Comparison", "Candidate Discovery & Matching", "Skill Heatmap Across Colleges", "Interview Pipeline Management", "Campus Hiring Planner"],
  },
];

const ACTIVITY = [
  { name: "Priya Sharma", act: "Won Hackathon 2026 🏆", col: "#22c55e" },
  { name: "Arjun Mehta", act: "Uploaded Devlog", col: "#3b82f6" },
  { name: "Riya Nair", act: "Certificate Issued 🎓", col: "#f59e0b" },
  { name: "Vikram Singh", act: "Joined Team: DeepBuild", col: "#a855f7" },
];

const PILLS = ["Dashboard", "Innovation Score", "Leaderboard", "Events", "My Projects", "Devlogs", "Portfolio", "Find Teammates", "NAAC Reports", "Analytics", "Certificates", "Bulk Import", "AI Config", "Audit Logs", "DB Assistant", "Skill Intelligence"];

const FAQS = [
  { q: "Does CampusMitra integrate with existing ERP systems?", a: "CampusMitra operates independently alongside your existing ERP. It complements — not replaces — your current systems by focusing on innovation, events, and accreditation data that ERPs typically don't handle." },
  { q: "How does the NAAC report generation work?", a: "Our AI automatically collects and maps student activities, event participations, certifications, and project records to NAAC/NIRF criterion parameters, generating draft SSR and AQAR reports at a click." },
  { q: "Is the data secure and hosted in India?", a: "Yes. We follow ISO 27001 practices with data residency in Indian data centers. Role-based access, end-to-end encryption, and full audit logs are standard across all plans." },
  { q: "Can multiple colleges collaborate on the same platform?", a: "Absolutely. Our Cross-College Innovation Ecosystem lets students from different institutions participate in shared events, form teams, share mentors, and appear on a unified national leaderboard." },
  { q: "What does the onboarding process look like?", a: "After sign-up, we assign a dedicated implementation partner. Bulk student/faculty import, configuration, and training typically take under 2 weeks for most institutions." },
];

/* ─────────────────────────────────────────────
   CONTACT MODAL
───────────────────────────────────────────── */
const iStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 8,
  border: "1.5px solid #e2e8f0", fontSize: 14, color: "#374151",
  outline: "none", background: "white", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color 0.15s",
};
const lStyle = {
  display: "block", fontSize: 11, fontWeight: 700, color: "#64748b",
  marginBottom: 5, letterSpacing: "0.06em", textTransform: "uppercase",
};

function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: "", position: "", email: "", phone: "", institute: "", address: "", staffCount: "", studentCount: "" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const fo = e => (e.target.style.borderColor = "#6366f1");
  const bl = e => (e.target.style.borderColor = "#e2e8f0");

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}>
      <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 500, padding: "40px 40px 44px", position: "relative", boxShadow: "0 50px 100px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, width: 34, height: 34, borderRadius: "50%", border: "1.5px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={14} color="#6b7280" />
        </button>
        <div style={{ marginBottom: 28 }}>
          <span style={{ display: "inline-block", background: "#eef2ff", color: "#6366f1", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Sales Inquiry</span>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0", letterSpacing: "-0.5px", fontFamily: "'Clash Display', 'Sora', sans-serif" }}>Contact Sales</h2>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: 0 }}>Our team will get back to you within <strong style={{ color: "#0f172a" }}>24 hours</strong>.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={lStyle}>Name *</label><input style={iStyle} placeholder="John Doe" value={form.name} onChange={set("name")} onFocus={fo} onBlur={bl} /></div>
            <div><label style={lStyle}>Position *</label><input style={iStyle} placeholder="Dean of Academics" value={form.position} onChange={set("position")} onFocus={fo} onBlur={bl} /></div>
          </div>
          <div><label style={lStyle}>Email *</label><input style={iStyle} type="email" placeholder="john@university.edu" value={form.email} onChange={set("email")} onFocus={fo} onBlur={bl} /></div>
          <div>
            <label style={lStyle}>Phone *</label>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ ...iStyle, width: 62, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontWeight: 700, userSelect: "none" }}>+91</div>
              <input style={{ ...iStyle, flex: 1 }} placeholder="98765 43210" value={form.phone} onChange={set("phone")} onFocus={fo} onBlur={bl} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={lStyle}>Institute *</label><input style={iStyle} placeholder="ABC Engineering" value={form.institute} onChange={set("institute")} onFocus={fo} onBlur={bl} /></div>
            <div><label style={lStyle}>City / State *</label><input style={iStyle} placeholder="Chennai, TN" value={form.address} onChange={set("address")} onFocus={fo} onBlur={bl} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={lStyle}>Staff <span style={{ opacity: 0.5 }}>(optional)</span></label><input style={iStyle} placeholder="e.g. 200" value={form.staffCount} onChange={set("staffCount")} onFocus={fo} onBlur={bl} /></div>
            <div><label style={lStyle}>Students <span style={{ opacity: 0.5 }}>(optional)</span></label><input style={iStyle} placeholder="e.g. 3000" value={form.studentCount} onChange={set("studentCount")} onFocus={fo} onBlur={bl} /></div>
          </div>
        </div>
        <button style={{ marginTop: 24, width: "100%", padding: "14px 0", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "white", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em" }} onClick={onClose}>
          Submit Request →
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 12, marginBottom: 0 }}>No spam. We respect your privacy.</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD MOCKUP
───────────────────────────────────────────── */
function DashMockup() {
  return (
    <div style={{ background: "#0f172a", borderRadius: 20, border: "1px solid #1e293b", boxShadow: "0 32px 80px rgba(0,0,0,0.45)", overflow: "hidden", fontFamily: "inherit" }}>
      {/* Browser chrome */}
      <div style={{ background: "#1e293b", borderBottom: "1px solid #334155", padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}>
        {["#ef4444","#f59e0b","#22c55e"].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />)}
        <div style={{ flex: 1, background: "#334155", borderRadius: 6, height: 22, marginLeft: 8, display: "flex", alignItems: "center", paddingLeft: 10 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>campusmitra.app/dashboard</span>
        </div>
      </div>
      <div style={{ display: "flex", height: 320 }}>
        {/* Sidebar */}
        <div style={{ width: 48, background: "#0f172a", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16, gap: 14 }}>
          {[LayoutDashboard, Trophy, CalendarCheck2, Users, FileText, BarChart3, Settings].map((Icon, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? "#6366f1" : "transparent", cursor: "pointer" }}>
              <Icon size={14} color={i === 0 ? "white" : "#475569"} />
            </div>
          ))}
        </div>
        {/* Content */}
        <div style={{ flex: 1, padding: "14px 14px 10px", overflowY: "hidden" }}>
          {/* Top metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 10 }}>
            {[
              { l: "Innovation Score", v: "78", c: "#6366f1", icon: Zap },
              { l: "NAAC Forecast", v: "A+", c: "#10b981", icon: Star },
              { l: "Participation", v: "62%", c: "#f59e0b", icon: TrendingUp },
            ].map(({ l, v, c, icon: Ic }) => (
              <div key={l} style={{ background: "#1e293b", borderRadius: 10, padding: "10px 11px", border: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</span>
                  <Ic size={10} color={c} />
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div style={{ background: "#1e293b", borderRadius: 10, padding: "10px 12px", border: "1px solid #334155", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#cbd5e1" }}>Event Participation Trend</span>
              <span style={{ fontSize: 9, color: "#475569" }}>Last 8 months</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 44 }}>
              {[40, 65, 52, 78, 60, 92, 72, 85].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0", background: i === 5 ? "#6366f1" : i === 7 ? "#818cf8" : "#1e3a5f" }} />
              ))}
            </div>
          </div>
          {/* Activity */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>Recent Activity</span>
            {ACTIVITY.map(({ name, act, col }) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, background: "#1e293b", borderRadius: 7, padding: "6px 10px", border: "1px solid #334155" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: col, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", minWidth: 80 }}>{name}</span>
                <span style={{ fontSize: 10, color: "#475569" }}>{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FAQ ITEM
───────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f1f5f9", padding: "20px 0" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", gap: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", lineHeight: 1.5 }}>{q}</span>
        <ChevronDown size={18} color="#94a3b8" style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      {open && <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.75, marginTop: 12, marginBottom: 0 }}>{a}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN LANDING
───────────────────────────────────────────── */
export default function LandingPage() {
  const [showContact, setShowContact] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{
      fontFamily: "'Sora', 'DM Sans', 'Segoe UI', sans-serif",
      background: "#fff",
      color: "#0f172a",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #6366f1; color: white; }
        html { scroll-behavior: smooth; }
        .pill-track { display: flex; gap: 8px; animation: ticker 30s linear infinite; width: max-content; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .pill-wrap { overflow: hidden; -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent); mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent); }
        .feat-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.1) !important; }
        .feat-card { transition: transform 0.25s, box-shadow 0.25s; }
        .role-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.08) !important; }
        .role-card { transition: transform 0.25s, box-shadow 0.25s; }
        .btn-primary { transition: opacity 0.15s, transform 0.1s; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-outline:hover { background: #f8fafc !important; }
        .nav-link { position: relative; text-decoration: none; color: #64748b; font-size: 13px; font-weight: 500; transition: color 0.15s; }
        .nav-link:hover { color: #0f172a; }
        .gradient-text { background: linear-gradient(135deg, #6366f1, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .faq-btn:hover { color: #6366f1 !important; }
      `}</style>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}

      {/* ─── NAVBAR ─── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.95)" : "white",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: "1px solid #f1f5f9",
        transition: "background 0.2s, box-shadow 0.2s",
        boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.07)" : "none",
      }}>
        <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={15} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.4px", color: "#0f172a" }}>
              Campus<span style={{ color: "#6366f1" }}>Mitra</span>
            </span>
          </a>
          {/* Desktop Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="hidden-mobile">
            {NAV_LINKS.map(([l, h]) => <a key={l} href={h} className="nav-link">{l}</a>)}
          </div>
          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden-mobile">
            <span style={{ fontSize: 11, color: "#94a3b8", marginRight: 4 }}>NAAC · NIRF · AICTE</span>
            <button onClick={() => setShowContact(true)} className="btn-outline"
              style={{ fontSize: 13, fontWeight: 500, color: "#374151", padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: 8, background: "white", cursor: "pointer", fontFamily: "inherit" }}>
              Contact Sales
            </button>
            <Link to="/login" style={{ fontSize: 13, fontWeight: 600, color: "#374151", padding: "8px 16px", border: "1.5px solid #cbd5e1", borderRadius: 8, background: "white", textDecoration: "none" }}>
              Login
            </Link>
            <a href="#early" className="btn-primary"
              style={{ fontSize: 13, fontWeight: 700, color: "white", padding: "9px 18px", borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#4f46e5)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              Get Early Access <ChevronRight size={13} />
            </a>
          </div>
          {/* Mobile menu btn */}
          <button onClick={() => setMobileOpen(o => !o)} style={{ display: "none", background: "none", border: "none", cursor: "pointer" }} className="mobile-menu-btn">
            <Menu size={22} color="#374151" />
          </button>
        </nav>
        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: 12, background: "white" }}>
            {NAV_LINKS.map(([l, h]) => <a key={l} href={h} style={{ color: "#374151", textDecoration: "none", fontSize: 14, fontWeight: 500 }} onClick={() => setMobileOpen(false)}>{l}</a>)}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <Link to="/login" style={{ flex: 1, textAlign: "center", padding: "9px", border: "1.5px solid #e2e8f0", borderRadius: 8, color: "#374151", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Login</Link>
              <a href="#early" style={{ flex: 1, textAlign: "center", padding: "9px", borderRadius: 8, background: "#6366f1", color: "white", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>Early Access</a>
            </div>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      <main>

        {/* ─── HERO ─── */}
        <section id="product" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 60px" }}>
          {/* Announcement badge */}
          {/* <div style={{ textAlign: "center", marginBottom: 28 }}>
            <a href="#early" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#eef2ff", color: "#4f46e5", fontSize: 12, fontWeight: 600, padding: "6px 16px", borderRadius: 100, textDecoration: "none", border: "1px solid #c7d2fe" }}>
              <Sparkles size={12} />
              Now in Early Access — Join 100+ Institutions
              <ArrowRight size={12} />
            </a>
          </div> */}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <h1 style={{
                fontSize: "clamp(36px,4vw,58px)", fontWeight: 900,
                lineHeight: 1.05, letterSpacing: "-2.5px",
                color: "#0f172a", marginBottom: 22,
                fontFamily: "'Sora', sans-serif",
              }}>
                The Innovation<br />
                <span className="gradient-text">Operating System</span><br />
                for Modern Colleges
              </h1>
              <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, maxWidth: 460, marginBottom: 36 }}>
                Track student achievements, automate accreditation intelligence, and power campus innovation — without touching your ERP.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
                <a href="#early" className="btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "white", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                  Get Early Access <ArrowRight size={15} />
                </a>
                <button onClick={() => setShowContact(true)} className="btn-outline"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, background: "white", color: "#374151", fontSize: 14, fontWeight: 600, border: "1.5px solid #e2e8f0", cursor: "pointer", fontFamily: "inherit" }}>
                  Book a Demo
                </button>
              </div>
              {/* Trust row */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex" }}>
                  {["#6366f1","#10b981","#f59e0b","#3b82f6","#ec4899"].map((c, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "2px solid white", marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <GraduationCap size={11} color="white" />
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: "#64748b" }}><strong style={{ color: "#0f172a" }}>1 Lakh+</strong> students tracked nationwide</span>
              </div>
            </div>

            {/* Dashboard mockup column */}
            <div style={{ position: "relative" }}>
              <DashMockup />
              {/* Floating card 1 */}
              <div style={{ position: "absolute", top: -16, right: -20, background: "white", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", padding: "12px 18px", minWidth: 130 }}>
                <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Leaderboard Rank</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#6366f1", lineHeight: 1 }}>#4</div>
                <div style={{ fontSize: 10, color: "#22c55e", marginTop: 3 }}>↑ 2 from last month</div>
              </div>
              {/* Floating card 2 */}
              <div style={{ position: "absolute", bottom: -12, left: -20, background: "white", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", padding: "12px 18px", minWidth: 130 }}>
                <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Active Events</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>18</div>
                <div style={{ fontSize: 10, color: "#6366f1", marginTop: 3 }}>Across 5 colleges</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PILL TICKER ─── */}
        <div className="pill-wrap" style={{ padding: "18px 0", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", background: "#fafafa" }}>
          <div className="pill-track">
            {[...PILLS, ...PILLS].map((p, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 100, border: "1px solid #e2e8f0", color: "#64748b", background: "white", whiteSpace: "nowrap", flexShrink: 0 }}>{p}</span>
            ))}
          </div>
        </div>

        {/* ─── STATS ─── */}
        <section style={{ borderBottom: "1px solid #f1f5f9", padding: "56px 0", background: "white" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#94a3b8", marginBottom: 36, textTransform: "uppercase" }}>
              Trusted by NAAC · NIRF · AICTE Institutions across India
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
              {STATS.map(({ Icon, label, value, sub }, i) => (
                <div key={label} style={{ textAlign: "center", borderRight: i < 3 ? "1px solid #f1f5f9" : "none", padding: "8px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color="#6366f1" />
                    </div>
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 900, color: "#0f172a", letterSpacing: "-2px", lineHeight: 1, fontFamily: "'Sora', sans-serif" }}>{value}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{sub} {label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PROBLEM / SOLUTION ─── */}
        <section id="accreditation" style={{ maxWidth: 1200, margin: "96px auto 0", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Why CampusMitra</p>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-1.5px", lineHeight: 1.1, fontFamily: "'Sora', sans-serif" }}>
              From Fragmented Chaos<br />to Unified Intelligence
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Problem */}
            <div style={{ background: "#fafafa", border: "1px solid #f1f5f9", borderRadius: 20, padding: "44px 40px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fee2e2", color: "#dc2626", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                The Problem
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginBottom: 12, fontFamily: "'Sora', sans-serif" }}>Education tech<br />is fragmented.</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.75, marginBottom: 28 }}>Separate tools for everything, manual NAAC prep, no unified student story.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {PROBLEMS.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#475569" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <X size={11} color="#dc2626" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {/* Solution */}
            <div style={{ background: "#0f172a", borderRadius: 20, padding: "44px 40px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(99,102,241,0.15)" }} />
              <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(139,92,246,0.1)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.06em", border: "1px solid rgba(99,102,241,0.3)" }}>
                  The Solution
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 12, fontFamily: "'Sora', sans-serif" }}>CampusMitra<br />unifies everything.</h3>
                <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75, marginBottom: 28 }}>One platform. Complete student lifecycle. AI-powered workflows that legacy systems can't touch.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {SOLUTIONS.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#cbd5e1" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CheckCircle2 size={11} color="#818cf8" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
                <a href="#early" className="btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, padding: "11px 22px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                  Get started <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES GRID ─── */}
        <section id="features" style={{ maxWidth: 1200, margin: "100px auto 0", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>What we offer</p>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 16, fontFamily: "'Sora', sans-serif" }}>
              One Platform.<br />Complete Innovation Visibility.
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              CampusMitra unifies student achievements, events, leaderboards, and accreditation intelligence so institutions can make data-driven decisions.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {FEATURES.map(({ Icon, tag, label, desc, accent }) => (
              <div key={label} className="feat-card"
                style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: 16, padding: "28px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", cursor: "default" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} color={accent} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: accent, background: `${accent}15`, padding: "3px 9px", borderRadius: 100, letterSpacing: "0.04em" }}>{tag}</span>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 8, lineHeight: 1.45 }}>{label}</h4>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ROLES SECTION ─── */}
        <section id="roles" style={{ maxWidth: 1200, margin: "100px auto 0", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Built for everyone</p>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-1.5px", lineHeight: 1.1, fontFamily: "'Sora', sans-serif" }}>
              Every Role. One Platform.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {ROLES.map(({ icon: Icon, role, color, bg, points }) => (
              <div key={role} className="role-card"
                style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ background: bg, padding: "28px 24px 22px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: `0 4px 16px ${color}30` }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h4 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>{role}</h4>
                </div>
                <div style={{ background: "white", padding: "20px 24px 24px" }}>
                  {points.map(p => (
                    <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 10, fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <CheckCircle2 size={9} color={color} />
                      </div>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── TESTIMONIAL / QUOTE ─── */}
        <section style={{ background: "#0f172a", margin: "100px 0 0", padding: "80px 24px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 24 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <blockquote style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 700, color: "white", lineHeight: 1.5, letterSpacing: "-0.5px", marginBottom: 28, fontStyle: "italic", fontFamily: "'Sora', sans-serif" }}>
              "CampusMitra reduced our NAAC documentation effort by 60% and gave us real-time visibility into student achievements we never had before."
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={18} color="white" />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Dr. Meena Krishnamurthy</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>IQAC Coordinator, Sri Venkateswara Engineering College</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── ACCREDITATION HIGHLIGHT ─── */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 0" }}>
          <div style={{ background: "linear-gradient(135deg,#eef2ff 0%,#e0e7ff 50%,#ede9fe 100%)", borderRadius: 24, padding: "60px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#6366f1", color: "white", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 100, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                <FileBarChart2 size={11} /> Accreditation Intelligence
              </div>
              <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 16, fontFamily: "'Sora', sans-serif" }}>
                NAAC · NIRF · AQAR<br />Reports in Minutes
              </h2>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 28 }}>
                Stop compiling spreadsheets manually. CampusMitra automatically maps every student activity, event, certificate, and project to NAAC/NIRF criterion — generating draft reports at a click.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["SSR Generation", "AQAR Automation", "NIRF Tracking", "Criterion Mapping", "Evidence Repository"].map(t => (
                  <span key={t} style={{ fontSize: 12, fontWeight: 600, padding: "5px 13px", borderRadius: 100, background: "white", color: "#6366f1", border: "1px solid #c7d2fe" }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Reports Generated", value: "1,200+", icon: FileText, color: "#6366f1" },
                { label: "Time Saved / Cycle", value: "60%", icon: Zap, color: "#10b981" },
                { label: "Institutions Passed A+", value: "38", icon: Star, color: "#f59e0b" },
                { label: "Parameters Tracked", value: "90+", icon: Activity, color: "#3b82f6" },
              ].map(({ label, value, icon: Ic, color }) => (
                <div key={label} style={{ background: "white", borderRadius: 16, padding: "22px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <Ic size={16} color={color} />
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1, fontFamily: "'Sora', sans-serif" }}>{value}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING ─── */}
        <section id="pricing" style={{ maxWidth: 1200, margin: "100px auto 0", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Pricing</p>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 14, fontFamily: "'Sora', sans-serif" }}>
              Simple, Institutional Pricing
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", maxWidth: 440, margin: "0 auto" }}>
              Flat annual pricing per institution. No per-student charges. Scale freely.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 900, margin: "0 auto" }}>
            {[
              {
                name: "Starter", price: "₹99K", period: "/ year",
                desc: "For small colleges up to 1,000 students.",
                color: "#64748b",
                features: ["Up to 1,000 students", "Event Management", "Basic NAAC Reports", "Certificate Authority", "Email Support"],
                cta: "Get Started",
              },
              {
                name: "Growth", price: "₹2.4L", period: "/ year",
                desc: "For mid-size institutions with deep analytics needs.",
                color: "#6366f1", highlight: true,
                features: ["Up to 5,000 students", "All Starter Features", "AI Accreditation Reports", "Leaderboard & Gamification", "DB Assistant", "Priority Support"],
                cta: "Most Popular",
              },
              {
                name: "Enterprise", price: "Custom", period: "",
                desc: "For university groups and multi-campus setups.",
                color: "#0f172a",
                features: ["Unlimited students", "All Growth Features", "Cross-College Ecosystem", "Super Admin Panel", "Recruiter Module", "Dedicated CSM"],
                cta: "Contact Sales",
              },
            ].map(({ name, price, period, desc, color, highlight, features, cta }) => (
              <div key={name}
                style={{
                  background: highlight ? "#0f172a" : "white",
                  border: highlight ? "none" : "1px solid #f1f5f9",
                  borderRadius: 20,
                  padding: "36px 32px",
                  boxShadow: highlight ? "0 24px 64px rgba(99,102,241,0.25)" : "0 2px 8px rgba(0,0,0,0.04)",
                  position: "relative",
                }}>
                {highlight && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 16px", borderRadius: 100, whiteSpace: "nowrap", letterSpacing: "0.04em" }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: 13, fontWeight: 700, color: highlight ? "#a5b4fc" : "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>{name}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: highlight ? "white" : "#0f172a", letterSpacing: "-2px", lineHeight: 1, fontFamily: "'Sora', sans-serif" }}>{price}</span>
                  <span style={{ fontSize: 14, color: highlight ? "#64748b" : "#94a3b8", marginBottom: 4 }}>{period}</span>
                </div>
                <p style={{ fontSize: 13, color: highlight ? "#64748b" : "#94a3b8", lineHeight: 1.6, marginBottom: 24 }}>{desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: highlight ? "#cbd5e1" : "#475569" }}>
                      <CheckCircle2 size={14} color={highlight ? "#818cf8" : "#6366f1"} />
                      {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowContact(true)} className="btn-primary"
                  style={{ width: "100%", padding: "12px", borderRadius: 10, background: highlight ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "#f8fafc", color: highlight ? "white" : "#374151", fontSize: 14, fontWeight: 700, border: highlight ? "none" : "1.5px solid #e2e8f0", cursor: "pointer", fontFamily: "inherit" }}>
                  {cta}
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 20 }}>
            All plans include a 30-day free trial. No credit card required.
          </p>
        </section>

        {/* ─── FAQ ─── */}
        <section style={{ maxWidth: 760, margin: "100px auto 0", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>FAQ</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,40px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1.1, fontFamily: "'Sora', sans-serif" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div style={{ border: "1px solid #f1f5f9", borderRadius: 16, padding: "0 28px" }}>
            {FAQS.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </section>

        {/* ─── CTA BANNER ─── */}
        <section id="early" style={{ maxWidth: 1000, margin: "100px auto 0", padding: "0 24px" }}>
          <div style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#1e1b4b 100%)", borderRadius: 24, padding: "72px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(99,102,241,0.2)" }} />
            <div style={{ position: "absolute", bottom: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(139,92,246,0.15)" }} />
            <div style={{ position: "relative" }}>
              <span style={{ display: "inline-block", background: "rgba(165,180,252,0.2)", color: "#a5b4fc", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 100, marginBottom: 20, border: "1px solid rgba(165,180,252,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Limited Early Access
              </span>
              <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "white", letterSpacing: "-1.5px", lineHeight: 1.1, margin: "0 0 16px 0", fontFamily: "'Sora', sans-serif" }}>
                Ready to Modernize<br />Campus Innovation?
              </h2>
              <p style={{ fontSize: 16, color: "#a5b4fc", maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.75 }}>
                Join 100+ institutions already using CampusMitra to automate accreditation, track innovation, and engage students like never before.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                <a href="#demo" className="btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 30px", borderRadius: 10, background: "white", color: "#1e1b4b", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                  Request Demo <ArrowRight size={14} />
                </a>
                <button onClick={() => setShowContact(true)} className="btn-outline"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.25)", color: "white", fontSize: 14, fontWeight: 600, background: "transparent", cursor: "pointer", fontFamily: "inherit" }}>
                  Contact Sales
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 28 }}>
                {["30-day free trial", "No credit card", "2-week onboarding"].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a5b4fc" }}>
                    <CheckCircle2 size={12} color="#818cf8" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{ marginTop: 80, borderTop: "1px solid #f1f5f9", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={13} color="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.4px", color: "#0f172a" }}>
                  Campus<span style={{ color: "#6366f1" }}>Mitra</span>
                </span>
              </a>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75, maxWidth: 240 }}>
                The Innovation Operating System for modern colleges. Built for NAAC, NIRF, and AICTE institutions.
              </p>
            </div>
            {[
              { head: "Product", links: ["Dashboard", "Events", "Leaderboard", "Certificates", "Portfolio"] },
              { head: "For Institutions", links: ["NAAC Reports", "NIRF Tracking", "Bulk Import", "Analytics", "DB Assistant"] },
              { head: "Company", links: ["About", "Blog", "Careers", "Contact", "Privacy"] },
            ].map(({ head, links }) => (
              <div key={head}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 14, letterSpacing: "0.04em", textTransform: "uppercase" }}>{head}</div>
                {links.map(l => (
                  <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "#64748b", textDecoration: "none", marginBottom: 8 }} className="nav-link">{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              © {new Date().getFullYear()} CampusMitra. Built for institutions across India.
            </span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy", "Terms", "Contact"].map(l => (
                <a key={l} href="#" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }} className="nav-link">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}