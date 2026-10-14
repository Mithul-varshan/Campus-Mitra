import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";
import { getGitHubAuthUrl } from "../services/githubOAuth";
import {
  GraduationCap,
  Shield,
  ShieldCheck,
  BookOpen,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  Calendar,
  FileBarChart2,
  BarChart3,
  Building2,
  Users,
  Award,
} from "lucide-react";

const ROLE_OPTIONS = [
  {
    value: ROLES.STUDENT,
    label: "Student",
    Icon: GraduationCap,
    description: "Access courses, events & portfolio",
    route: "/dashboard",
    color: "#6366f1",
    light: "#eef2ff",
  },
  {
    value: ROLES.ADMIN,
    label: "College Admin",
    Icon: Shield,
    description: "Manage events, users & analytics",
    route: "/dashboard",
    color: "#8b5cf6",
    light: "#f5f3ff",
  },
  {
    value: ROLES.SUPER_ADMIN,
    label: "Super Admin",
    Icon: ShieldCheck,
    description: "Platform-wide control & monitoring",
    route: "/dashboard",
    color: "#ef4444",
    light: "#fef2f2",
  },
  {
    value: ROLES.TEACHER,
    label: "Faculty / Mentor",
    Icon: BookOpen,
    description: "Guide students & verify achievements",
    route: "/teacher/dashboard",
    color: "#10b981",
    light: "#ecfdf5",
  },
  {
    value: ROLES.RECRUITER,
    label: "Recruiter",
    Icon: Briefcase,
    description: "Discover talent & campus hiring",
    route: "/recruiter/dashboard",
    color: "#f59e0b",
    light: "#fffbeb",
  },
];

const STATS = [
  { value: "100+", label: "Institutions", Icon: Building2 },
  { value: "1L+", label: "Students", Icon: Users },
  { value: "45K+", label: "Certificates", Icon: Award },
];
const FEATURES = [
  { Icon: Trophy, text: "Innovation Scores" },
  { Icon: Calendar, text: "Campus Events" },
  { Icon: FileBarChart2, text: "NAAC Reports" },
  { Icon: BarChart3, text: "Analytics" },
];

function ConstellationBg() {
  const dots = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: (i * 37.3 + 11) % 100,
    y: (i * 19.7 + 7) % 100,
    size: (i % 3) * 0.6 + 0.9,
    dur: (i % 4) + 3.5,
    delay: (i % 5) * 0.8,
  }));
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {dots.map((d) => (
        <circle
          key={d.id}
          cx={`${d.x}%`}
          cy={`${d.y}%`}
          r={d.size}
          fill="rgba(255,255,255,0.28)"
        >
          <animate
            attributeName="opacity"
            values="0.1;0.65;0.1"
            dur={`${d.dur}s`}
            begin={`${d.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [active, setActive] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role === ROLES.TEACHER) {
      navigate("/teacher/dashboard", { replace: true });
      return;
    }

    if (user.role === ROLES.RECRUITER) {
      navigate("/recruiter/dashboard", { replace: true });
      return;
    }

    navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleRoleSelect = (role) => {
    setActive(role.value);
    setTimeout(() => {
      login(role.value);
      navigate(role.route);
    }, 200);
  };

  return (
    <div
      style={{
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        fontFamily: "'Sora','DM Sans',system-ui,sans-serif",
        background: "#080d1a",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { height: 100%; overflow: hidden; }
        ::selection { background: #6366f1; color: white; }

        .role-btn {
          all: unset; display: flex; align-items: center; gap: 11px;
          padding: 10px 13px; border-radius: 11px; cursor: pointer; width: 100%;
          border: 1.5px solid #f1f5f9; background: white;
          transition: border-color 0.17s, box-shadow 0.17s, transform 0.17s;
          position: relative; overflow: hidden;
        }
        .role-btn::before {
          content:''; position:absolute; inset:0; opacity:0;
          transition: opacity 0.17s; border-radius: 10px;
          background: var(--lc);
        }
        .role-btn:hover::before { opacity: 1; }
        .role-btn:hover {
          border-color: var(--c) !important;
          transform: translateX(3px);
          box-shadow: -3px 0 0 0 var(--c) inset, 0 3px 14px rgba(0,0,0,0.07);
        }
        .role-btn:active { transform: translateX(1px) scale(0.99); }
        .role-btn.activated { background: var(--lc) !important; border-color: var(--c) !important; }

        .social-btn {
          flex:1; display:flex; align-items:center; justify-content:center;
          gap:8px; padding:9px 14px; border: 1.5px solid #e2e8f0;
          border-radius: 10px; background: white; cursor: pointer;
          font-size: 13px; font-weight: 600; color: #374151;
          transition: all 0.17s; font-family: inherit;
        }
        .social-btn:hover { background:#f8fafc; border-color:#cbd5e1; transform:translateY(-1px); box-shadow:0 3px 10px rgba(0,0,0,0.06); }
        .social-btn.gh:hover { background:#0f172a; border-color:#0f172a; color:white; }

        .lp { opacity:0; transform:translateX(-16px); transition:opacity 0.55s, transform 0.55s; }
        .lp.in { opacity:1; transform:translateX(0); }
        .rp { opacity:0; transform:translateY(12px); transition:opacity 0.5s 0.07s, transform 0.5s 0.07s; }
        .rp.in { opacity:1; transform:translateY(0); }
        .fp { opacity:0; transform:translateY(6px); transition:opacity 0.36s, transform 0.36s; }
        .fp.in { opacity:1; transform:translateY(0); }
        .rr { opacity:0; transform:translateX(10px); transition:opacity 0.3s, transform 0.3s; }
        .rr.in { opacity:1; transform:translateX(0); }

        @media (max-width: 840px) {
          .left-col { display:none !important; }
          .right-col { width:100% !important; }
        }
      `}</style>

      {/* ══ LEFT PANEL ══ */}
      <div
        className="left-col"
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "44px 60px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 80% at 20% 50%,rgba(99,102,241,0.16) 0%,transparent 60%),radial-gradient(ellipse 60% 60% at 80% 20%,rgba(139,92,246,0.1) 0%,transparent 55%),radial-gradient(ellipse 50% 50% at 40% 90%,rgba(16,185,129,0.07) 0%,transparent 50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <ConstellationBg />

        <div
          className={`lp ${mounted ? "in" : ""}`}
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 18px rgba(99,102,241,0.36)",
              }}
            >
              <Sparkles size={17} color="white" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.4px",
                  lineHeight: 1,
                }}
              >
                CampusMitra
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#475569",
                  letterSpacing: "0.07em",
                  marginTop: 2,
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Innovation OS
              </div>
            </div>
          </Link>

          {/* Headline */}
          <h2
            style={{
              fontSize: "clamp(28px,3vw,46px)",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.08,
              letterSpacing: "-2px",
              margin: "0 0 12px",
              maxWidth: 420,
              fontFamily: "'Sora',sans-serif",
            }}
          >
            Power Your Campus
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg,#818cf8 0%,#a78bfa 40%,#34d399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Innovation Journey
            </span>
          </h2>

          <p
            style={{
              fontSize: 14.5,
              color: "#64748b",
              lineHeight: 1.72,
              maxWidth: 370,
              marginBottom: 24,
            }}
          >
            The unified platform for tracking student achievements, managing
            events, and automating accreditation across your institution.
          </p>

          {/* Feature pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 7,
              marginBottom: 30,
            }}
          >
            {FEATURES.map(({ Icon, text }, i) => (
              <div
                key={text}
                className={`fp ${mounted ? "in" : ""}`}
                style={{
                  transitionDelay: `${0.26 + i * 0.06}s`,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 13px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 100,
                  fontSize: 12,
                  color: "#94a3b8",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Icon size={12} color="#818cf8" />
                {text}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              paddingTop: 22,
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {STATS.map(({ value, label, Icon }, i) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  textAlign: "center",
                  paddingRight: i < 2 ? 18 : 0,
                  borderRight:
                    i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  paddingLeft: i > 0 ? 18 : 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: "rgba(99,102,241,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={12} color="#818cf8" />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "white",
                    letterSpacing: "-1.5px",
                    lineHeight: 1,
                    fontFamily: "'Sora',sans-serif",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#475569",
                    marginTop: 3,
                    fontWeight: 500,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -70,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(99,102,241,0.17) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div
        className="right-col"
        style={{
          width: 452,
          flexShrink: 0,
          background: "white",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          boxShadow: "-20px 0 80px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        {/* Top accent stripe */}
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg,#6366f1,#8b5cf6,#10b981)",
            flexShrink: 0,
          }}
        />

        {/* Main content — vertically centered, no scroll */}
        <div
          className={`rp ${mounted ? "in" : ""}`}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "24px 38px",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 16, flexShrink: 0 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "#eef2ff",
                color: "#6366f1",
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 100,
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              <Sparkles size={8} /> Secure Sign In
            </div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#0f172a",
                margin: "0 0 3px",
                letterSpacing: "-0.6px",
                fontFamily: "'Sora',sans-serif",
              }}
            >
              Welcome back
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#94a3b8",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Select your role to access your dashboard
            </p>
          </div>

          {/* Role cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 16,
              flexShrink: 0,
            }}
          >
            {ROLE_OPTIONS.map(
              ({ value, label, Icon, description, color, light, route }, i) => (
                <button
                  key={value}
                  className={`role-btn rr ${mounted ? "in" : ""} ${active === value ? "activated" : ""}`}
                  style={{
                    "--c": color,
                    "--lc": light,
                    transitionDelay: `${0.13 + i * 0.05}s`,
                  }}
                  onMouseEnter={() => setHovered(value)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleRoleSelect({ value, route })}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      flexShrink: 0,
                      background:
                        hovered === value || active === value
                          ? color
                          : `${color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.17s",
                      boxShadow:
                        hovered === value ? `0 3px 12px ${color}35` : "none",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Icon
                      size={15}
                      color={
                        hovered === value || active === value ? "white" : color
                      }
                      style={{ transition: "color 0.17s" }}
                    />
                  </div>

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: 1,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {description}
                    </div>
                  </div>

                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      flexShrink: 0,
                      background: hovered === value ? color : "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.17s",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <ArrowRight
                      size={11}
                      color={hovered === value ? "white" : "#94a3b8"}
                      style={{ transition: "color 0.17s" }}
                    />
                  </div>
                </button>
              ),
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              marginBottom: 12,
              flexShrink: 0,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
            <span
              style={{
                fontSize: 10,
                color: "#cbd5e1",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              or continue with
            </span>
            <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
          </div>

          {/* Social buttons */}
          <div
            style={{ display: "flex", gap: 8, marginBottom: 12, flexShrink: 0 }}
          >
            <button className="social-btn" style={{ fontFamily: "inherit" }}>
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              Google
            </button>
            <button
              className="social-btn gh"
              onClick={() => (window.location.href = getGitHubAuthUrl())}
              style={{ fontFamily: "inherit" }}
              title="Authorize with GitHub"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Judge Login Link */}
          <Link
            to="/judge/login"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 16px",
              background:
                "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))",
              border: "1.5px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "10px",
              textDecoration: "none",
              color: "#d97706",
              fontSize: "13px",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            <Award size={16} />
            Login as Event Judge
          </Link>

          {/* Demo notice */}
          <div
            style={{
              padding: "9px 12px",
              background: "#fafafa",
              borderRadius: 9,
              border: "1px solid #f1f5f9",
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={9} color="#6366f1" />
            </div>
            <p
              style={{
                fontSize: 11,
                color: "#94a3b8",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Demo mode — select any role to explore. No credentials required.
            </p>
          </div>
        </div>

        {/* Footer — pinned bottom */}
        <div
          style={{
            padding: "11px 38px 14px",
            borderTop: "1px solid #f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <p style={{ fontSize: 10.5, color: "#cbd5e1", margin: 0 }}>
            By signing in, you agree to our{" "}
            <a
              href="#"
              style={{ color: "#94a3b8", textDecoration: "underline" }}
            >
              Terms
            </a>
            {" & "}
            <a
              href="#"
              style={{ color: "#94a3b8", textDecoration: "underline" }}
            >
              Privacy
            </a>
          </p>
          <Link
            to="/"
            style={{
              fontSize: 11,
              color: "#6366f1",
              textDecoration: "none",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ArrowLeft size={11} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
