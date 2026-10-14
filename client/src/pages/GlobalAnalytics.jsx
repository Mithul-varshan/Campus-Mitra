import { useState, useMemo } from "react";
import { Save, History, Download } from "lucide-react";

const DEFAULT_RULES = [
  {
    key: "hackathon_participation",
    label: "Hackathon Participation Points",
    points: 10,
    weight: 20,
    enabled: true,
  },
  {
    key: "hackathon_win",
    label: "Hackathon Win Points",
    points: 50,
    weight: 30,
    enabled: true,
  },
  {
    key: "workshop_attendance",
    label: "Workshop Attendance Points",
    points: 5,
    weight: 10,
    enabled: true,
  },

  {
    key: "upvote",
    label: "Upvote Points",
    points: 2,
    weight: 10,
    enabled: true,
  },
  {
    key: "mentorship",
    label: "Mentorship Points",
    points: 20,
    weight: 20,
    enabled: true,
  },
];

export default function GlobalAnalytics() {
  const [yearFilter, setYearFilter] = useState("2025-26");
  const [domainFilter, setDomainFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");

  const [rules, setRules] = useState(DEFAULT_RULES);
  const [versionHistory, setVersionHistory] = useState([
    {
      id: 1,
      version: "v1.2",
      date: "2026-01-10",
      notes: "Adjusted hackathon win weight.",
    },
    {
      id: 2,
      version: "v1.1",
      date: "2025-08-22",
      notes: "Initial production rules.",
    },
  ]);
  const [previewSample, setPreviewSample] = useState({
    participation: 3,
    wins: 1,
    workshops: 2,
    upvotes: 12,
    mentorships: 1,
  });
  const [saving, setSaving] = useState(false);

  const updateRule = (key, patch) => {
    setRules((prev) =>
      prev.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );
  };

  const totalWeight = useMemo(
    () => rules.reduce((s, r) => (r.enabled ? s + r.weight : s), 0),
    [rules],
  );

  const computePreview = () => {
    const weights = rules.reduce((acc, r) => {
      acc[r.key] = r.enabled ? r.weight : 0;
      return acc;
    }, {});
    const sumWeight = Object.values(weights).reduce((s, v) => s + v, 0) || 1;
    const mapping = {
      hackathon_participation: previewSample.participation,
      hackathon_win: previewSample.wins,
      workshop_attendance: previewSample.workshops,
      upvote: previewSample.upvotes,
      mentorship: previewSample.mentorships,
    };

    let score = 0;
    rules.forEach((r) => {
      const count = mapping[r.key] || 0;
      const comp = r.enabled ? r.points * count * (r.weight / sumWeight) : 0;
      score += comp;
    });

    return Math.round(score);
  };

  const previewScore = computePreview();

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      const newVersion = {
        id: Date.now(),
        version: `v${(Math.random() * 0.9 + 1).toFixed(2)}`,
        date: new Date().toISOString().slice(0, 10),
        notes: "Saved rule changes",
      };
      setVersionHistory((prev) => [newVersion, ...prev]);
      setSaving(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Global Analytics
            </h1>
            <p className="text-sm text-slate-600">
              Cross-college insights, performance metrics and analytics
              dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded bg-white text-sm hover:bg-slate-50">
              <Download size={16} /> Export PDF
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded bg-white text-sm hover:bg-slate-50">
              <Download size={16} /> Export Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow-md mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-600 mb-2">Year</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option>2023-24</option>
                <option>2024-25</option>
                <option>2025-26</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-2">
                Domain
              </label>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option>All Domains</option>
                <option>AI/ML</option>
                <option>Web Development</option>
                <option>IoT</option>
                <option>Blockchain</option>
                <option>Mobile</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-2">
                Region
              </label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option>All Regions</option>
                <option>North</option>
                <option>South</option>
                <option>East</option>
                <option>West</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Year-wise Innovation Growth */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Year-wise Innovation Growth
            </h3>
            <div className="h-48 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 300 120">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop
                      offset="0%"
                      style={{ stopColor: "#2563eb", stopOpacity: 0.3 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#2563eb", stopOpacity: 0 }}
                    />
                  </linearGradient>
                </defs>
                <polyline
                  fill="url(#grad1)"
                  stroke="#2563eb"
                  strokeWidth="2"
                  points="10,100 40,85 70,75 100,60 130,45 160,35 190,25 220,20 250,15 280,12"
                />
                <circle cx="10" cy="100" r="3" fill="#2563eb" />
                <circle cx="40" cy="85" r="3" fill="#2563eb" />
                <circle cx="70" cy="75" r="3" fill="#2563eb" />
                <circle cx="100" cy="60" r="3" fill="#2563eb" />
                <circle cx="130" cy="45" r="3" fill="#2563eb" />
                <circle cx="160" cy="35" r="3" fill="#2563eb" />
                <circle cx="190" cy="25" r="3" fill="#2563eb" />
                <circle cx="220" cy="20" r="3" fill="#2563eb" />
                <circle cx="250" cy="15" r="3" fill="#2563eb" />
                <circle cx="280" cy="12" r="3" fill="#2563eb" />
              </svg>
            </div>
            <div className="mt-2 text-xs text-slate-600">
              Showing consistent growth trend over time
            </div>
          </div>

          {/* College Comparison */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Top Colleges Comparison
            </h3>
            <div className="space-y-2">
              {[
                "IIT Example",
                "Tech Uni",
                "City College",
                "State Institute",
                "Polytechnic A",
              ].map((c, i) => (
                <div key={c} className="flex items-center gap-3">
                  <div className="w-28 text-xs font-medium text-slate-700 truncate">
                    {c}
                  </div>
                  <div className="flex-1 bg-slate-100 h-6 rounded relative overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${80 - i * 10}%` }}
                    />
                  </div>
                  <div className="w-12 text-xs text-slate-600 text-right">
                    {980 - i * 140}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Department Comparison */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Department Comparison
            </h3>
            <div className="flex items-end justify-between h-40 gap-1 px-2">
              {["CSE", "ECE", "MECH", "IT", "CIVIL"].map((dept, i) => (
                <div key={dept} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-indigo-600 rounded-t hover:bg-indigo-700"
                    style={{ height: `${40 + i * 12}px` }}
                  />
                  <div className="text-xs text-slate-600 mt-2">{dept}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Participation */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Gender Participation</h3>
            <div className="flex items-center justify-center h-40">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="14"
                  strokeDasharray="82.5 251.2"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="14"
                  strokeDasharray="58.8 251.2"
                  strokeDashoffset="-82.5"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray="109.9 251.2"
                  strokeDashoffset="-141.3"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-2 text-xs mt-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Male (33%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span>Female (23%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Other (44%)</span>
              </div>
            </div>
          </div>

          {/* Event Category Popularity */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Event Category Popularity
            </h3>
            <div className="space-y-2">
              {[
                "Hackathons",
                "Workshops",
                "Seminars",
                "Competitions",
                "Webinars",
              ].map((cat, i) => (
                <div key={cat} className="flex items-center gap-2">
                  <div className="w-24 text-xs text-slate-700">{cat}</div>
                  <div className="flex-1 bg-slate-100 h-4 rounded overflow-hidden">
                    <div
                      className="bg-orange-500 h-full"
                      style={{ width: `${85 - i * 12}%` }}
                    />
                  </div>
                  <div className="w-10 text-xs text-slate-600">
                    {42 - i * 6}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Innovation Score Percentile */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Innovation Score Percentile Distribution
          </h3>
          <div className="flex items-end justify-between h-40 gap-1 px-2">
            {["0-200", "200-400", "400-600", "600-800", "800-1000"].map(
              (range, i) => {
                const heights = [45, 62, 78, 55, 38];
                return (
                  <div
                    key={range}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-yellow-500 rounded-t hover:bg-yellow-600"
                      style={{ height: `${heights[i]}px` }}
                    />
                    <div className="text-xs text-slate-600 mt-2">{range}</div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* SII Settings Section */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">
                Global Innovation Score (SII) Settings
              </h3>
              <p className="text-sm text-slate-600">
                Configure scoring components and weights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded bg-white text-sm hover:bg-slate-50">
                <History size={16} /> Version History
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {rules.map((r) => (
              <div key={r.key} className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-5">
                  <div className="font-medium text-slate-900">{r.label}</div>
                  <div className="text-sm text-slate-600">
                    Toggle to enable/disable this component
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={r.enabled}
                      onChange={(e) =>
                        updateRule(r.key, { enabled: e.target.checked })
                      }
                    />
                    <span className="text-sm text-slate-600">Enabled</span>
                  </label>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={r.points}
                      onChange={(e) =>
                        updateRule(r.key, { points: Number(e.target.value) })
                      }
                      className="w-24 px-2 py-1 border rounded"
                    />
                    <div className="text-sm text-slate-600">points</div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={r.weight}
                      onChange={(e) =>
                        updateRule(r.key, { weight: Number(e.target.value) })
                      }
                    />
                    <div className="w-10 text-sm text-slate-600">
                      {r.weight}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="text-sm text-slate-600">
              Total enabled weight:{" "}
              <strong className="text-slate-900">{totalWeight}%</strong>
            </div>
          </div>
        </div>

        {/* Preview and Version History */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-lg p-6 shadow-md">
            <h4 className="text-lg font-semibold mb-4">Real-time Preview</h4>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <label className="text-sm text-slate-700">
                Hackathon participations
                <input
                  type="number"
                  value={previewSample.participation}
                  onChange={(e) =>
                    setPreviewSample((s) => ({
                      ...s,
                      participation: Number(e.target.value),
                    }))
                  }
                  className="w-full mt-1 px-2 py-1 border rounded"
                />
              </label>
              <label className="text-sm text-slate-700">
                Hackathon wins
                <input
                  type="number"
                  value={previewSample.wins}
                  onChange={(e) =>
                    setPreviewSample((s) => ({
                      ...s,
                      wins: Number(e.target.value),
                    }))
                  }
                  className="w-full mt-1 px-2 py-1 border rounded"
                />
              </label>
              <label className="text-sm text-slate-700">
                Workshops
                <input
                  type="number"
                  value={previewSample.workshops}
                  onChange={(e) =>
                    setPreviewSample((s) => ({
                      ...s,
                      workshops: Number(e.target.value),
                    }))
                  }
                  className="w-full mt-1 px-2 py-1 border rounded"
                />
              </label>
              <label className="text-sm text-slate-700">
                Upvotes
                <input
                  type="number"
                  value={previewSample.upvotes}
                  onChange={(e) =>
                    setPreviewSample((s) => ({
                      ...s,
                      upvotes: Number(e.target.value),
                    }))
                  }
                  className="w-full mt-1 px-2 py-1 border rounded"
                />
              </label>
              <label className="text-sm text-slate-700">
                Mentorships
                <input
                  type="number"
                  value={previewSample.mentorships}
                  onChange={(e) =>
                    setPreviewSample((s) => ({
                      ...s,
                      mentorships: Number(e.target.value),
                    }))
                  }
                  className="w-full mt-1 px-2 py-1 border rounded"
                />
              </label>
            </div>

            <div className="bg-slate-50 p-4 rounded">
              <div className="text-sm text-slate-600 mb-2">
                Computed SII (preview)
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {previewScore}
              </div>
              <div className="text-sm text-slate-500 mt-2">
                Based on current rule configuration and sample input.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h4 className="text-lg font-semibold mb-4">Version History</h4>
            <div className="space-y-3">
              {versionHistory.map((v) => (
                <div key={v.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{v.version}</div>
                      <div className="text-xs text-slate-600">{v.date}</div>
                    </div>
                    <div className="text-xs text-slate-500">{v.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
