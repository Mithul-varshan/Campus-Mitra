import { useState, useMemo } from "react";
import { Save, History } from "lucide-react";

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

export default function InnovationSettings() {
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
    // simplistic calculation using points*counts weighted by normalized weight
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Global Innovation Score (SII) Settings
            </h1>
            <p className="text-sm text-slate-600">
              Configure scoring components, weights and preview the impact in
              real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded bg-white text-sm">
              <History size={16} /> Version History
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Scoring Components</h3>
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

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-lg p-6 shadow-md">
            <h4 className="text-lg font-semibold mb-4">Real-time Preview</h4>
            <div className="mb-4 text-sm text-slate-600">
              Adjust sample input to preview calculated SII for a single
              student.
            </div>
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