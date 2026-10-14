import { useState, useMemo } from "react";

/* ─── Constants ─────────────────────────────────────────────────────── */
const PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "Get started at zero cost",
    price: 0,
    unit: "forever",
    accent: "#64748b",
    accentLight: "#f8fafc",
    accentBorder: "#e2e8f0",
    badge: null,
    features: [
      { label: "Students", value: "Up to 200" },
      { label: "Events per month", value: "3" },
      { label: "Projects", value: "50 max" },
      { label: "Certificates", value: "Basic templates" },
      { label: "Analytics", value: "Basic only" },
      { label: "AI Assistant", value: false },
      { label: "API Access", value: false },
      { label: "Custom Branding", value: false },
      { label: "Priority Support", value: false },
      { label: "NAAC Reports", value: false },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "For growing institutions",
    price: 4999,
    unit: "/month",
    accent: "#2563eb",
    accentLight: "#eff6ff",
    accentBorder: "#bfdbfe",
    badge: "Most Popular",
    features: [
      { label: "Students", value: "Up to 2,000" },
      { label: "Events per month", value: "Unlimited" },
      { label: "Projects", value: "Unlimited" },
      { label: "Certificates", value: "All templates + QR" },
      { label: "Analytics", value: "Advanced" },
      { label: "AI Assistant", value: true },
      { label: "API Access", value: "Read-only" },
      { label: "Custom Branding", value: false },
      { label: "Priority Support", value: "Email" },
      { label: "NAAC Reports", value: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For large universities & groups",
    price: 14999,
    unit: "/month",
    accent: "#7c3aed",
    accentLight: "#faf5ff",
    accentBorder: "#ddd6fe",
    badge: "Best Value",
    features: [
      { label: "Students", value: "Unlimited" },
      { label: "Events per month", value: "Unlimited" },
      { label: "Projects", value: "Unlimited" },
      { label: "Certificates", value: "Custom + Digital Sig" },
      { label: "Analytics", value: "Full + Export" },
      { label: "AI Assistant", value: "Full access" },
      { label: "API Access", value: "Full R/W + Webhooks" },
      { label: "Custom Branding", value: true },
      { label: "Priority Support", value: "Dedicated SLA" },
      { label: "NAAC Reports", value: "Auto-generated" },
    ],
  },
];

const COLLEGES_DATA = [
  { name: "Greenfield College", plan: "standard", joined: "Jan 2025", mrr: 4999, status: "active" },
  { name: "Tech Institute of Advanced Studies", plan: "enterprise", joined: "Nov 2024", mrr: 14999, status: "active" },
  { name: "Northside University", plan: "standard", joined: "Feb 2025", mrr: 4999, status: "active" },
  { name: "City Polytechnic", plan: "free", joined: "Mar 2025", mrr: 0, status: "active" },
  { name: "Merit Engineering College", plan: "free", joined: "Dec 2024", mrr: 0, status: "active" },
  { name: "Sunrise Institute of Tech", plan: "standard", joined: "Oct 2024", mrr: 4999, status: "active" },
  { name: "Hillside University", plan: "enterprise", joined: "Sep 2024", mrr: 14999, status: "active" },
  { name: "Pioneer Academy", plan: "standard", joined: "Apr 2025", mrr: 4999, status: "overdue" },
  { name: "Capital College of Science", plan: "free", joined: "May 2025", mrr: 0, status: "active" },
  { name: "Southern Polytechnic", plan: "standard", joined: "Jun 2024", mrr: 4999, status: "active" },
  { name: "Eastern Tech University", plan: "standard", joined: "Jul 2024", mrr: 4999, status: "churned" },
  { name: "Western Institute", plan: "free", joined: "Aug 2024", mrr: 0, status: "active" },
];

// Monthly revenue for the past 12 months (₹ thousands)
const REVENUE_MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
const REVENUE_DATA = {
  free: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  standard: [14997, 19996, 24995, 24995, 29994, 34993, 34993, 34993, 39992, 39992, 44991, 44991],
  enterprise: [0, 0, 14999, 14999, 14999, 29998, 29998, 29998, 29998, 29998, 29998, 29998],
};

/* ─── Helpers ───────────────────────────────────────────────────────── */
function fmt(n) {
  return n >= 100000
    ? `₹${(n / 100000).toFixed(2)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(1)}k`
    : `₹${n}`;
}

function FeatureRow({ label, value }) {
  const isTrue = value === true;
  const isFalse = value === false;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)", gap: "8px" }}>
      <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>{label}</span>
      {isFalse ? (
        <iconify-icon icon="lucide:x" style={{ fontSize: "14px", color: "#94a3b8", flexShrink: 0 }} />
      ) : isTrue ? (
        <iconify-icon icon="lucide:check" style={{ fontSize: "14px", color: "#16a34a", flexShrink: 0 }} />
      ) : (
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)", textAlign: "right" }}>{value}</span>
      )}
    </div>
  );
}

/* ─── Revenue Chart ─────────────────────────────────────────────────── */
function RevenueChart({ activeLines }) {
  const W = 820, H = 220, PAD = { top: 16, right: 20, bottom: 36, left: 64 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const totals = REVENUE_MONTHS.map((_, i) =>
    REVENUE_DATA.standard[i] + REVENUE_DATA.enterprise[i]
  );
  const maxVal = Math.max(...totals, 1);

  const xStep = chartW / (REVENUE_MONTHS.length - 1);

  const pts = (key) =>
    REVENUE_MONTHS.map((_, i) => {
      const v = key === "total"
        ? REVENUE_DATA.standard[i] + REVENUE_DATA.enterprise[i]
        : REVENUE_DATA[key][i];
      const x = PAD.left + i * xStep;
      const y = PAD.top + chartH - (v / maxVal) * chartH;
      return `${x},${y}`;
    }).join(" ");

  const areaPath = (key) => {
    const points = REVENUE_MONTHS.map((_, i) => {
      const v = key === "total"
        ? REVENUE_DATA.standard[i] + REVENUE_DATA.enterprise[i]
        : REVENUE_DATA[key][i];
      const x = PAD.left + i * xStep;
      const y = PAD.top + chartH - (v / maxVal) * chartH;
      return [x, y];
    });
    const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
    const base = `L${PAD.left + (REVENUE_MONTHS.length - 1) * xStep},${PAD.top + chartH} L${PAD.left},${PAD.top + chartH} Z`;
    return d + " " + base;
  };

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * maxVal));

  const LINES = [
    { key: "total", color: "#6366f1", label: "Total MRR" },
    { key: "standard", color: "#2563eb", label: "Standard" },
    { key: "enterprise", color: "#7c3aed", label: "Enterprise" },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", overflow: "visible" }}>
      {/* Grid lines */}
      {yTicks.map((tick, i) => {
        const y = PAD.top + chartH - (tick / maxVal) * chartH;
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--muted-foreground)">
              {fmt(tick)}
            </text>
          </g>
        );
      })}

      {/* Area fills */}
      {LINES.filter((l) => activeLines[l.key]).map((line) => (
        <path key={line.key + "-area"} d={areaPath(line.key)} fill={line.color} opacity="0.06" />
      ))}

      {/* Lines */}
      {LINES.filter((l) => activeLines[l.key]).map((line) => (
        <polyline
          key={line.key}
          points={pts(line.key)}
          fill="none"
          stroke={line.color}
          strokeWidth={line.key === "total" ? 2.5 : 1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={line.key === "total" ? undefined : "0"}
        />
      ))}

      {/* Data dots */}
      {LINES.filter((l) => activeLines[l.key]).map((line) =>
        REVENUE_MONTHS.map((_, i) => {
          const v = line.key === "total"
            ? REVENUE_DATA.standard[i] + REVENUE_DATA.enterprise[i]
            : REVENUE_DATA[line.key][i];
          const x = PAD.left + i * xStep;
          const y = PAD.top + chartH - (v / maxVal) * chartH;
          return v > 0 ? (
            <circle key={`${line.key}-${i}`} cx={x} cy={y} r="3.5" fill={line.color} />
          ) : null;
        })
      )}

      {/* X-axis labels */}
      {REVENUE_MONTHS.map((m, i) => (
        <text key={m} x={PAD.left + i * xStep} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">
          {m}
        </text>
      ))}

      {/* X axis line */}
      <line x1={PAD.left} y1={PAD.top + chartH} x2={W - PAD.right} y2={PAD.top + chartH} stroke="var(--border)" strokeWidth="1" />
    </svg>
  );
}

/* ─── Admin Plan Card ───────────────────────────────────────────────── */
function PlanCard({ plan, collegeCount, mrr, onEdit }) {
  const tierColors = { free: { status: "#64748b", statusBg: "#f1f5f9" }, standard: { status: "#2563eb", statusBg: "#eff6ff" }, enterprise: { status: "#7c3aed", statusBg: "#faf5ff" } };
  const tc = tierColors[plan.id] ?? tierColors.free;
  return (
    <div style={{
      background: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      {/* Top accent bar */}
      <div style={{ height: "3px", background: plan.accent }} />

      <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", marginBottom: "2px" }}>{plan.name} Plan</div>
            <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{plan.tagline}</div>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 9px", borderRadius: "999px", background: tc.statusBg, color: tc.status, border: `1px solid ${plan.accentBorder}` }}>
            Active
          </span>
        </div>

        {/* Price block */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--muted)", borderRadius: "10px", padding: "12px 14px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Billing Price</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--foreground)" }}>
              {plan.price === 0 ? "Free" : `₹${plan.price.toLocaleString()}`}
              {plan.price > 0 && <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--muted-foreground)", marginLeft: "4px" }}>/month</span>}
            </div>
          </div>
          <button
            onClick={() => onEdit(plan)}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "7px 13px", borderRadius: "8px", border: `1px solid ${plan.accentBorder}`,
              background: plan.accentLight, color: plan.accent,
              fontSize: "12px", fontWeight: 600, cursor: "pointer",
            }}
          >
            <iconify-icon icon="lucide:pencil" style={{ fontSize: "13px" }} />
            Edit Plan
          </button>
        </div>

        {/* Subscriber stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 12px" }}>
            <div style={{ fontSize: "22px", fontWeight: 800, color: plan.accent, lineHeight: 1 }}>{collegeCount}</div>
            <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>Colleges enrolled</div>
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 12px" }}>
            <div style={{ fontSize: "22px", fontWeight: 800, color: plan.accent, lineHeight: 1 }}>{fmt(mrr)}</div>
            <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>Monthly revenue</div>
          </div>
        </div>

        {/* Feature list */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "8px" }}>Included Features</div>
          {plan.features.map((f) => (
            <FeatureRow key={f.label} label={f.label} value={f.value} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Plan Modal ───────────────────────────────────────────────── */
function EditPlanModal({ plan, onClose, onSave }) {
  const [price, setPrice] = useState(String(plan.price));
  const [tagline, setTagline] = useState(plan.tagline);
  const [features, setFeatures] = useState(plan.features.map((f) => ({ ...f })));

  const updateFeature = (i, val) => {
    setFeatures((prev) => prev.map((f, fi) => fi === i ? { ...f, value: val } : f));
  };

  const handleSave = () => {
    onSave({ ...plan, price: parseInt(price) || 0, tagline, features });
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      onClick={onClose}
    >
      <div
        style={{ background: "var(--background)", borderRadius: "16px", padding: "26px", width: "100%", maxWidth: "520px", boxShadow: "0 24px 48px -8px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: plan.accentLight, border: `1px solid ${plan.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <iconify-icon icon="lucide:pencil" style={{ fontSize: "16px", color: plan.accent }} />
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>Edit {plan.name} Plan</div>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Changes apply to all new college billing cycles</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "4px" }}>
            <iconify-icon icon="lucide:x" style={{ fontSize: "18px" }} />
          </button>
        </div>

        {/* Price & Tagline */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>Monthly Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={plan.id === "free"}
              style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: plan.id === "free" ? "var(--muted)" : "var(--background)", color: "var(--foreground)", fontSize: "14px", fontWeight: 700, outline: "none", boxSizing: "border-box" }}
            />
            {plan.id === "free" && <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "3px" }}>Free plan price is always ₹0</div>}
          </div>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Feature limits */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "10px" }}>Feature Limits</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {features.map((f, i) => (
              <div key={f.label} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", alignItems: "center", padding: "8px 10px", borderRadius: "8px", background: "var(--muted)" }}>
                <span style={{ fontSize: "12px", color: "var(--foreground)", fontWeight: 500 }}>{f.label}</span>
                {typeof f.value === "boolean" ? (
                  <button
                    onClick={() => updateFeature(i, !f.value)}
                    style={{
                      display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600, border: "none",
                      background: f.value ? "#f0fdf4" : "#f1f5f9", color: f.value ? "#16a34a" : "#94a3b8",
                    }}
                  >
                    <iconify-icon icon={f.value ? "lucide:check" : "lucide:x"} style={{ fontSize: "13px" }} />
                    {f.value ? "Enabled" : "Disabled"}
                  </button>
                ) : (
                  <input
                    type="text"
                    value={typeof f.value === "boolean" ? "" : String(f.value)}
                    onChange={(e) => updateFeature(i, e.target.value)}
                    style={{ padding: "5px 9px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: "12px", outline: "none" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--muted)", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "none", background: plan.accent, cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
          >
            <iconify-icon icon="lucide:save" style={{ fontSize: "14px" }} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function SubscriptionPlans() {
  const [tab, setTab] = useState("plans");
  const [collegePlanFilter, setCollegePlanFilter] = useState("all");
  const [collegeSearch, setCollegeSearch] = useState("");
  const [modal, setModal] = useState(null); // { college, action, targetPlan } — college tab
  const [colleges, setColleges] = useState(COLLEGES_DATA);
  const [activeLines, setActiveLines] = useState({ total: true, standard: true, enterprise: true });
  const [plans, setPlans] = useState(PLANS);
  const [editingPlan, setEditingPlan] = useState(null);

  const planStats = useMemo(() => {
    const result = {};
    plans.forEach((p) => {
      const subset = colleges.filter((c) => c.plan === p.id && c.status === "active");
      result[p.id] = {
        count: colleges.filter((c) => c.plan === p.id).length,
        mrr: subset.reduce((s, c) => s + c.mrr, 0),
      };
    });
    return result;
  }, [colleges]);

  const totalMRR = useMemo(() =>
    colleges.filter((c) => c.status === "active").reduce((s, c) => s + c.mrr, 0),
    [colleges]
  );

  const filteredColleges = useMemo(() => {
    return colleges.filter((c) => {
      const matchPlan = collegePlanFilter === "all" || c.plan === collegePlanFilter;
      const matchSearch = c.name.toLowerCase().includes(collegeSearch.toLowerCase());
      return matchPlan && matchSearch;
    });
  }, [colleges, collegePlanFilter, collegeSearch]);

  const handleConfirmAction = () => {
    if (!modal) return;
    setColleges((prev) =>
      prev.map((c) =>
        c.name === modal.college?.name
          ? { ...c, plan: modal.targetPlan, mrr: plans.find((p) => p.id === modal.targetPlan)?.price ?? 0 }
          : c
      )
    );
    setModal(null);
  };

  const handleSavePlan = (updated) => {
    setPlans((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    setEditingPlan(null);
  };

  const statusStyle = {
    active: { bg: "#f0fdf4", color: "#16a34a" },
    overdue: { bg: "#fefce8", color: "#ca8a04" },
    churned: { bg: "#f1f5f9", color: "#94a3b8" },
  };

  const TABS = [
    { id: "plans", label: "Plan Management", icon: "lucide:layers" },
    { id: "colleges", label: "College Registry", icon: "lucide:building-2" },
    { id: "revenue", label: "Revenue Analytics", icon: "lucide:bar-chart-2" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 4px", color: "var(--foreground)" }}>
            Subscription &amp; Plans
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: 0 }}>
            Manage plan tiers, college subscriptions, and revenue across the platform
          </p>
        </div>

        {/* Top KPIs */}
        <div style={{ display: "flex", gap: "10px" }}>
          {[
            { label: "Total MRR", value: fmt(totalMRR), icon: "lucide:trending-up", color: "#16a34a", bg: "#f0fdf4" },
            { label: "ARR (est.)", value: fmt(totalMRR * 12), icon: "lucide:calendar", color: "#6366f1", bg: "#eff6ff" },
            { label: "Paying Colleges", value: colleges.filter((c) => c.mrr > 0 && c.status === "active").length, icon: "lucide:building-2", color: "#2563eb", bg: "#eff6ff" },
          ].map((k) => (
            <div key={k.label} style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", minWidth: "130px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <iconify-icon icon={k.icon} style={{ fontSize: "17px", color: k.color }} />
              </div>
              <div>
                <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--foreground)", lineHeight: 1.2 }}>{k.value}</div>
                <div style={{ fontSize: "11px", color: "var(--muted-foreground)", fontWeight: 500 }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "var(--muted)", borderRadius: "12px", padding: "4px", width: "fit-content" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "8px 18px", borderRadius: "9px", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: 600,
              background: tab === t.id ? "var(--background)" : "transparent",
              color: tab === t.id ? "var(--foreground)" : "var(--muted-foreground)",
              boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}
          >
            <iconify-icon icon={t.icon} style={{ fontSize: "15px" }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════ TAB: PLANS ════════ */}
      {tab === "plans" && (
        <div>
          {/* Admin guidance banner */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", marginBottom: "20px" }}>
            <iconify-icon icon="lucide:info" style={{ fontSize: "16px", color: "#2563eb", flexShrink: 0 }} />
            <span style={{ fontSize: "13px", color: "#1d4ed8" }}>Click <strong>Edit Plan</strong> on any tier to update pricing, feature limits, or plan description. Changes apply to new billing cycles.</span>
          </div>

          {/* Plan cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "28px" }}>
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                collegeCount={planStats[plan.id]?.count ?? 0}
                mrr={planStats[plan.id]?.mrr ?? 0}
                onEdit={setEditingPlan}
              />
            ))}
          </div>

          {/* Feature comparison table */}
          <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <iconify-icon icon="lucide:table-2" style={{ fontSize: "16px", color: "var(--primary)" }} />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>Plan Feature Matrix</span>
              </div>
              <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Live — reflects latest edits</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--muted)" }}>
                    <th style={{ padding: "11px 18px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Feature / Limit</th>
                    {plans.map((p) => (
                      <th key={p.id} style={{ padding: "11px 18px", textAlign: "center", fontSize: "13px", fontWeight: 800, color: p.accent, minWidth: "140px" }}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plans[0].features.map((f, fi) => (
                    <tr key={f.label} style={{ borderBottom: "1px solid var(--border)", background: fi % 2 === 0 ? "transparent" : "var(--muted)" }}>
                      <td style={{ padding: "10px 18px", fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>{f.label}</td>
                      {plans.map((p) => {
                        const val = p.features[fi].value;
                        return (
                          <td key={p.id} style={{ padding: "10px 18px", textAlign: "center" }}>
                            {val === true ? (
                              <iconify-icon icon="lucide:check-circle" style={{ fontSize: "16px", color: "#16a34a" }} />
                            ) : val === false ? (
                              <iconify-icon icon="lucide:minus-circle" style={{ fontSize: "16px", color: "#cbd5e1" }} />
                            ) : (
                              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>{val}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr style={{ background: "var(--muted)", borderTop: "2px solid var(--border)" }}>
                    <td style={{ padding: "12px 18px", fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>Monthly Price</td>
                    {plans.map((p) => (
                      <td key={p.id} style={{ padding: "12px 18px", textAlign: "center" }}>
                        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: p.accent }}>
                            {p.price === 0 ? "Free" : `₹${p.price.toLocaleString()}/mo`}
                          </span>
                          <button
                            onClick={() => setEditingPlan(p)}
                            style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px", border: `1px solid ${p.accentBorder}`, background: p.accentLight, color: p.accent, cursor: "pointer", fontWeight: 600 }}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════ TAB: COLLEGES ════════ */}
      {tab === "colleges" && (
        <div>
          {/* Summary chips */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
            {[
              { key: "all", label: `All (${colleges.length})`, color: "#6366f1" },
              ...plans.map((p) => ({ key: p.id, label: `${p.name} (${planStats[p.id]?.count ?? 0})`, color: p.accent })),
            ].map((chip) => (
              <button
                key={chip.key}
                onClick={() => setCollegePlanFilter(chip.key)}
                style={{
                  padding: "6px 14px", borderRadius: "999px", cursor: "pointer", fontSize: "12px", fontWeight: 600,
                  border: collegePlanFilter === chip.key ? `2px solid ${chip.color}` : "2px solid var(--border)",
                  background: collegePlanFilter === chip.key ? `${chip.color}15` : "var(--muted)",
                  color: collegePlanFilter === chip.key ? chip.color : "var(--muted-foreground)",
                  transition: "all 0.15s",
                }}
              >
                {chip.label}
              </button>
            ))}
            {/* Search */}
            <div style={{ position: "relative", marginLeft: "auto" }}>
              <iconify-icon icon="lucide:search" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "var(--muted-foreground)" }} />
              <input
                type="text"
                placeholder="Search college..."
                value={collegeSearch}
                onChange={(e) => setCollegeSearch(e.target.value)}
                style={{ paddingLeft: "32px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", fontSize: "13px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--background)", color: "var(--foreground)", outline: "none", width: "220px" }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "11px 20px", background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
              {["College", "Plan", "Joined", "MRR", "Status"].map((h) => (
                <div key={h} style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</div>
              ))}
            </div>
            {filteredColleges.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--muted-foreground)", fontSize: "14px" }}>No colleges match your filter</div>
            ) : (
              filteredColleges.map((college, i) => {
                const plan = plans.find((p) => p.id === college.plan);
                const ss = statusStyle[college.status] ?? { bg: "#f1f5f9", color: "#64748b" };
                return (
                  <div
                    key={college.name}
                    style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "13px 20px", borderBottom: i < filteredColleges.length - 1 ? "1px solid var(--border)" : "none", alignItems: "center", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>{college.name}</div>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px", background: plan?.accentLight, color: plan?.accent, border: `1px solid ${plan?.accentBorder}` }}>
                        {plan?.name}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{college.joined}</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: college.mrr > 0 ? "#16a34a" : "var(--muted-foreground)" }}>
                      {college.mrr > 0 ? `₹${college.mrr.toLocaleString()}` : "—"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", background: ss.bg, color: ss.color, textTransform: "capitalize" }}>
                        {college.status}
                      </span>
                      {/* Quick plan change buttons */}
                      <div style={{ display: "flex", gap: "4px" }}>
                        {college.plan !== "enterprise" && college.status !== "churned" && (
                          <button
                            onClick={() => {
                              const nextPlan = college.plan === "free" ? "standard" : "enterprise";
                              setModal({ college, action: "upgrade", targetPlan: nextPlan, plans });
                            }}
                            title="Upgrade plan"
                            style={{ padding: "3px 6px", borderRadius: "6px", border: "1px solid #bbf7d0", background: "#f0fdf4", cursor: "pointer", color: "#16a34a", display: "flex", fontSize: "12px" }}
                          >
                            <iconify-icon icon="lucide:arrow-up" style={{ fontSize: "13px" }} />
                          </button>
                        )}
                        {college.plan !== "free" && college.status !== "churned" && (
                          <button
                            onClick={() => {
                              const prevPlan = college.plan === "enterprise" ? "standard" : "free";
                              setModal({ college, action: "downgrade", targetPlan: prevPlan });
                            }}
                            title="Downgrade plan"
                            style={{ padding: "3px 6px", borderRadius: "6px", border: "1px solid #fde68a", background: "#fffbeb", cursor: "pointer", color: "#d97706", display: "flex", fontSize: "12px" }}
                          >
                            <iconify-icon icon="lucide:arrow-down" style={{ fontSize: "13px" }} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ════════ TAB: REVENUE ════════ */}
      {tab === "revenue" && (
        <div>
          {/* Revenue summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
            {[
              { label: "Total MRR", value: fmt(totalMRR), sub: "Current month", icon: "lucide:trending-up", color: "#6366f1", bg: "#eff6ff" },
              { label: "Standard MRR", value: fmt(planStats.standard?.mrr ?? 0), sub: `${planStats.standard?.count ?? 0} colleges`, icon: "lucide:layers", color: "#2563eb", bg: "#eff6ff" },
              { label: "Enterprise MRR", value: fmt(planStats.enterprise?.mrr ?? 0), sub: `${planStats.enterprise?.count ?? 0} colleges`, icon: "lucide:crown", color: "#7c3aed", bg: "#faf5ff" },
              { label: "Projected ARR", value: fmt(totalMRR * 12), sub: "Annualized", icon: "lucide:calendar-range", color: "#16a34a", bg: "#f0fdf4" },
            ].map((s) => (
              <div key={s.label} style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px", display: "flex", gap: "14px", alignItems: "center" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "11px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <iconify-icon icon={s.icon} style={{ fontSize: "20px", color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--foreground)", lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)" }}>{s.label}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Panel */}
          <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "2px" }}>MRR Growth — Last 12 Months</div>
                <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Monthly Recurring Revenue by plan tier</div>
              </div>
              {/* Line toggles */}
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { key: "total", color: "#6366f1", label: "Total" },
                  { key: "standard", color: "#2563eb", label: "Standard" },
                  { key: "enterprise", color: "#7c3aed", label: "Enterprise" },
                ].map((l) => (
                  <button
                    key={l.key}
                    onClick={() => setActiveLines((prev) => ({ ...prev, [l.key]: !prev[l.key] }))}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600,
                      border: `1.5px solid ${activeLines[l.key] ? l.color : "var(--border)"}`,
                      background: activeLines[l.key] ? `${l.color}12` : "var(--muted)",
                      color: activeLines[l.key] ? l.color : "var(--muted-foreground)",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: activeLines[l.key] ? l.color : "var(--border)" }} />
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <RevenueChart activeLines={activeLines} />
          </div>

          {/* Rev breakdown by plan */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Plan contribution */}
            <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", marginBottom: "16px" }}>Revenue Contribution</div>
              {PLANS.filter((p) => p.price > 0).map((plan) => {
                const mrr = planStats[plan.id]?.mrr ?? 0;
                const pct = totalMRR > 0 ? Math.round((mrr / totalMRR) * 100) : 0;
                return (
                  <div key={plan.id} style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: plan.accent }} />
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>{plan.name}</span>
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{fmt(mrr)}</span>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: plan.accent }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: "8px", background: "var(--muted)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${plan.accentBorder}, ${plan.accent})`, borderRadius: "999px", transition: "width 0.4s" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Churn / Overdue */}
            <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", marginBottom: "14px" }}>Billing Health</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Active &amp; Paying", value: colleges.filter((c) => c.status === "active" && c.mrr > 0).length, color: "#16a34a", bg: "#f0fdf4", icon: "lucide:check-circle" },
                  { label: "On Free Plan", value: colleges.filter((c) => c.plan === "free").length, color: "#64748b", bg: "#f8fafc", icon: "lucide:gift" },
                  { label: "Payment Overdue", value: colleges.filter((c) => c.status === "overdue").length, color: "#d97706", bg: "#fffbeb", icon: "lucide:alert-triangle" },
                  { label: "Churned", value: colleges.filter((c) => c.status === "churned").length, color: "#dc2626", bg: "#fef2f2", icon: "lucide:user-x" },
                ].map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: s.bg, borderRadius: "10px" }}>
                    <iconify-icon icon={s.icon} style={{ fontSize: "17px", color: s.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: "13px", fontWeight: 500, color: "var(--foreground)" }} dangerouslySetInnerHTML={{ __html: s.label }} />
                    <span style={{ fontSize: "18px", fontWeight: 800, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── College plan change modal ── */}
      {/* ── College plan change modal ── */}
      {modal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          onClick={() => setModal(null)}
        >
          <div
            style={{ background: "var(--background)", borderRadius: "14px", padding: "26px", maxWidth: "400px", width: "100%", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "10px" }}>
              {modal.action === "upgrade" ? "Upgrade" : "Downgrade"} College Plan
            </div>
            <div style={{ fontSize: "13px", color: "var(--muted-foreground)", marginBottom: "18px", lineHeight: 1.6 }}>
              Move <strong style={{ color: "var(--foreground)" }}>{modal.college?.name}</strong> to the{" "}
              <strong style={{ color: plans.find((p) => p.id === modal.targetPlan)?.accent }}>
                {plans.find((p) => p.id === modal.targetPlan)?.name}
              </strong>{" "}plan?
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--muted)", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>Cancel</button>
              <button onClick={handleConfirmAction} style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "none", background: modal.action === "upgrade" ? "#16a34a" : "#d97706", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "white" }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Plan Modal ── */}
      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          onClose={() => setEditingPlan(null)}
          onSave={handleSavePlan}
        />
      )}
    </div>
  );
}
