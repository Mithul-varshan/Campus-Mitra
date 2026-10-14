import { useState } from "react";
import {
  Download,
  AlertCircle,
  BarChart2,
  PieChart,
  FileText,
} from "lucide-react";

export default function NaacReports() {
  const [year] = useState("2024-25");

  const deptPerformance = [
    { name: "CSE", value: 9200 },
    { name: "ECE", value: 7600 },
    { name: "MECH", value: 5400 },
    { name: "CIVIL", value: 6800 },
    { name: "IT", value: 8200 },
    { name: "EEE", value: 4700 },
    { name: "BIO", value: 3600 },
  ];

  const heatmapRow = (label) => (
    <div className="flex items-center gap-4 py-2">
      <div className="w-40 text-sm text-slate-700">{label}</div>
      <div className="flex gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded ${i % 4 === 0 ? "bg-blue-800" : i % 3 === 0 ? "bg-blue-500" : "bg-blue-200"}`}
          ></div>
        ))}
      </div>
      <div className="ml-auto text-sm text-slate-600">
        {Math.floor(Math.random() * 10000)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              NAAC / NIRF Smart Analytics
            </h1>
            <p className="text-slate-600 text-sm">
              Institutional performance tracking for accreditation and ranking
              reports.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-700 flex items-center gap-2">
              <Download size={16} /> Export Excel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm flex items-center gap-2">
              <FileText size={16} /> Generate PDF Report
            </button>
          </div>
        </div>

        {/* AI Executive Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex gap-4">
            <AlertCircle
              size={22}
              className="text-blue-600 flex-shrink-0 mt-1"
            />
            <div>
              <h3 className="font-semibold text-blue-900">
                AI Executive Summary
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Innovation index has increased by 18% this semester, driven
                largely by the Computer Science department's hackathon
                participation. However, funding utilization in Mechanical
                Engineering remains low (32%). Recommended Action: Initiate
                cross-disciplinary IoT workshops to boost Mechanical
                participation before the next NAAC cycle.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-sm text-slate-600">Total Innovation Score</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">84,392</p>
            <p className="text-sm text-green-600 mt-1">+12.6% vs last year</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-sm text-slate-600">Student Participation Rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">76.4%</p>
            <p className="text-sm text-green-600 mt-1">+4.2% vs last year</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-sm text-slate-600">Patents / Papers Filed</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">42</p>
            <p className="text-sm text-red-600 mt-1">-2 this month</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-sm text-slate-600">External Funding Utilized</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">₹1.2 Cr</p>
            <p className="text-sm text-green-600 mt-1">On Track</p>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Innovation Growth Trend (Year-wise)
            </h3>
            <div className="h-56 flex items-center">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1.5"
                  points="5,30 15,24 25,20 35,18 45,16 55,12 65,10 75,8 85,6 95,4"
                />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Gender Participation
            </h3>
            <div className="flex items-center justify-center h-56">
              <div className="w-44 h-44 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="15"
                    strokeDasharray="75 25"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold">45%</div>
                  <div className="text-xs text-slate-600">Female</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Performance and Funding */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Department Performance Comparison
              </h3>
              <button className="text-sm text-slate-600">View Details</button>
            </div>
            <div className="h-44 flex items-end gap-3">
              {deptPerformance.map((d, i) => (
                <div key={i} className="flex-1 text-center">
                  <div
                    className="mx-auto bg-indigo-600 rounded-t"
                    style={{
                      height: `${(d.value / Math.max(...deptPerformance.map((x) => x.value))) * 120}px`,
                      width: "56%",
                    }}
                  ></div>
                  <div className="text-xs text-slate-600 mt-2">{d.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold">Funding Utilization</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="flex justify-between text-slate-600">
                  <div>Research Grants</div>
                  <div>85%</div>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded mt-1">
                  <div
                    className="bg-green-500 h-3 rounded"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-600">
                  <div>Event Budgets</div>
                  <div>62%</div>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded mt-1">
                  <div
                    className="bg-yellow-400 h-3 rounded"
                    style={{ width: "62%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-600">
                  <div>Incubation Fund</div>
                  <div>48%</div>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded mt-1">
                  <div
                    className="bg-blue-500 h-3 rounded"
                    style={{ width: "48%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap by month */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            Innovation Activity Heatmap (By Month)
          </h3>
          <div className="grid gap-2">
            {heatmapRow("Computer Science")}
            {heatmapRow("Mechanical Engg")}
            {heatmapRow("Electronics (ECE)")}
          </div>
        </div>
      </div>
    </div>
  );
}
