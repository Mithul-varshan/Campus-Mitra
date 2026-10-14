import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, Award, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function JudgeLogin() {
  const { loginAsJudge } = useAuth();
  const navigate = useNavigate();
  const [eventId, setEventId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate small delay for UX
    setTimeout(() => {
      const result = loginAsJudge(eventId.trim(), password.trim());
      setLoading(false);

      if (result.success) {
        navigate("/judge/dashboard");
      } else {
        setError(result.error || "Invalid credentials. Please try again.");
      }
    }, 500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "20px",
        fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Back to Login Link */}
        <Link
          to="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#64748b",
            textDecoration: "none",
            marginBottom: "24px",
          }}
        >
          <ArrowLeft size={14} />
          Back to main login
        </Link>

        {/* Logo & Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 20px rgba(245, 158, 11, 0.3)",
            }}
          >
            <Award size={28} color="white" />
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 8px",
            }}
          >
            Judge Portal
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              margin: 0,
            }}
          >
            Enter your credentials to access the scoring panel
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "13px",
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Event ID
            </label>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="e.g., evt-001"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <p
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                marginTop: "6px",
              }}
            >
              This is provided by the event organizer
            </p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Judge Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g., judge1"
                required
                style={{
                  width: "100%",
                  padding: "12px 44px 12px 16px",
                  fontSize: "14px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "10px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  color: "#94a3b8",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "15px",
              fontWeight: 600,
              color: "white",
              background: loading
                ? "#94a3b8"
                : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading
                ? "none"
                : "0 4px 14px rgba(245, 158, 11, 0.3)",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Authenticating..." : "Login as Judge"}
          </button>
        </form>

        {/* Help Text */}
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#f8fafc",
            borderRadius: "10px",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <strong style={{ color: "#374151" }}>Need help?</strong>
          <p style={{ margin: "8px 0 0" }}>
            Contact the event organizer to get your judge credentials. Each
            judge receives a unique password for their assigned event and round.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={12} color="white" />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
            CampusMitra
          </span>
        </div>
      </div>
    </div>
  );
}
