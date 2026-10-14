import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CollegeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suspended, setSuspended] = useState(false);

  const college = {
    id,
    name: "New Tech Institute",
    location: "Karnataka",
    students: 4200,
    innovators: 842,
    participation: "68%",
    plan: "Enterprise",
    departments: [
      { name: "CSE", students: 1200, innovators: 240 },
      { name: "ECE", students: 800, innovators: 120 },
      { name: "MECH", students: 600, innovators: 80 },
    ],
    events: [
      {
        id: "e1",
        title: "Hackathon 2026",
        date: "2026-01-30",
        participants: 420,
      },
      {
        id: "e2",
        title: "Innovators Summit",
        date: "2025-11-12",
        participants: 320,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {college.name}
            </h1>
            <p className="text-sm text-slate-600">
              {college.location} • {college.plan}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-slate-300 rounded"
            >
              Back
            </button>
            <button
              onClick={() => setSuspended(!suspended)}
              className={`px-4 py-2 rounded ${suspended ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
            >
              {suspended ? "Reactivate" : "Suspend"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">College Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600">Total Students</p>
                <p className="font-bold text-slate-900">{college.students}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Active Innovators</p>
                <p className="font-bold text-slate-900">{college.innovators}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Participation</p>
                <p className="font-bold text-slate-900">
                  {college.participation}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-slate-600 mb-2">
                Performance Analytics
              </h4>
              <div className="h-40 bg-slate-100 rounded" />
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-slate-600 mb-2">Event History</h4>
              <ul className="space-y-2">
                {college.events.map((e) => (
                  <li key={e.id} className="text-sm text-slate-700">
                    {e.title} — {e.date} — {e.participants} participants
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-sm text-slate-600 mb-2">
              Department Breakdown
            </h4>
            <ul className="space-y-2">
              {college.departments.map((d) => (
                <li key={d.name} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-slate-600">
                      {d.students} students
                    </div>
                  </div>
                  <div className="text-sm text-slate-700">
                    {d.innovators} innovators
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h4 className="text-sm text-slate-600 mb-2">
                Student Activity Summary
              </h4>
              <div className="text-sm text-slate-700">
                Recent activity and engagement metrics placeholder.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
