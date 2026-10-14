import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header
      style={{
        height: "60px",
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Institution Switcher */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: 500,
          color: "var(--foreground)",
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          background: "var(--background)",
        }}
      >
        <iconify-icon
          icon="lucide:building-2"
          style={{ fontSize: "16px" }}
        ></iconify-icon>
        DHANALAKSHMI SRINIVASAN UNIVERSITY
      </div>

      {/* Search Bar */}
      <div style={{ position: "relative", width: "320px" }}>
        <div
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted-foreground)",
            pointerEvents: "none",
            display: "flex",
          }}
        >
          <iconify-icon
            icon="lucide:search"
            style={{ fontSize: "16px" }}
          ></iconify-icon>
        </div>
        <input
          type="text"
          placeholder="Find hackathons, mentors, or skills..."
          style={{
            width: "100%",
            height: "36px",
            paddingLeft: "36px",
            paddingRight: "12px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-family-body)",
            fontSize: "13px",
            backgroundColor: "var(--muted)",
            color: "var(--foreground)",
            outline: "none",
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted-foreground)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
            borderRadius: "var(--radius-md)",
            transition: "color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--muted)";
            e.currentTarget.style.color = "var(--foreground)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "var(--muted-foreground)";
          }}
        >
          <iconify-icon
            icon={theme === "light" ? "lucide:moon" : "lucide:sun"}
            style={{ fontSize: "20px" }}
          ></iconify-icon>
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted-foreground)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <iconify-icon
            icon="lucide:bell"
            style={{ fontSize: "20px" }}
          ></iconify-icon>
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "8px",
              height: "8px",
              background: "var(--destructive)",
              borderRadius: "50%",
              border: "2px solid var(--background)",
            }}
          ></span>
        </button>
      </div>
    </header>
  );
}
