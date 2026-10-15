import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useEvents } from "../../context/EventsContext";

/**
 * DemoSpeedSwitcher
 * 
 * Floating hackathon presenter HUD:
 * - 1-Click Role Switcher (Student, Admin, Recruiter, Super Admin, Judge)
 * - 1-Click "Clean Slate" Reset Button (clears junk input & restores pristine demo seeds)
 * - Toggle with Ctrl+Shift+D or corner icon
 */
export default function DemoSpeedSwitcher() {
  const { user, login } = useAuth();
  const { resetToDefaults } = useEvents();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Global keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentRole = user?.role || "guest";

  const handleSwitchRole = (roleKey, targetPath) => {
    login(roleKey);
    setIsOpen(false);
    navigate(targetPath);
  };

  const handlePristineReset = () => {
    // 1. Reset EventsContext
    if (resetToDefaults) {
      resetToDefaults();
    }

    // 2. Clear junk keys, keep baseline demo seeds
    const keysToClean = [
      "campusmitra_registrations",
      "campusmitra_invitations",
      "campusmitra_event_feedback",
      "campusMitra_issued_certificates",
      "campusos_imported_students",
      "campusos_support_tickets",
    ];
    keysToClean.forEach((k) => localStorage.removeItem(k));

    // 3. Dispatch global sync event
    window.dispatchEvent(new CustomEvent("campusmitra:state-sync", { detail: { action: "RESET_PRISTINE" } }));

    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const roleConfigs = [
    {
      role: ROLES.STUDENT,
      label: "Student",
      path: "/dashboard",
      icon: "🎓",
      color: "from-blue-600 to-indigo-600",
      description: "Events, LeetCode, GitHub & Projects",
    },
    {
      role: ROLES.ADMIN,
      label: "College Admin",
      path: "/admin/dashboard",
      icon: "🏛️",
      color: "from-violet-600 to-purple-600",
      description: "Create Event, Approvals, Certificates",
    },
    {
      role: ROLES.RECRUITER,
      label: "Recruiter",
      path: "/recruiter/candidate-discovery",
      icon: "💼",
      color: "from-emerald-600 to-teal-600",
      description: "Talent Discovery, Heatmaps & Shortlists",
    },
    {
      role: ROLES.SUPER_ADMIN,
      label: "Super Admin",
      path: "/super-admin/dashboard",
      icon: "⚡",
      color: "from-amber-600 to-orange-600",
      description: "Institutions, System Telemetry & Logs",
    },
    {
      role: ROLES.JUDGE,
      label: "Event Judge",
      path: "/judge/dashboard",
      icon: "⚖️",
      color: "from-rose-600 to-pink-600",
      description: "Team Evaluation & Scoring Rubrics",
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans select-none print:hidden">
      {/* Floating Pill Trigger */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Demo Speed Switcher (Ctrl+Shift+D)"
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl shadow-slate-950/20 border border-slate-700/80 backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-xs font-medium cursor-pointer"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 capitalize">{currentRole.replace("_", " ")}</span>
          <span className="bg-slate-800 text-[10px] text-slate-400 px-1.5 py-0.5 rounded font-mono group-hover:text-slate-200">
            Ctrl+⇧+D
          </span>
        </button>
      ) : (
        /* Expanded HUD Modal */
        <div className="w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Demo Command Center
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>

          {/* Quick Persona Switcher */}
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Switch Persona Instantly
            </p>
            <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {roleConfigs.map((cfg) => {
                const isActive = currentRole === cfg.role;
                return (
                  <button
                    key={cfg.role}
                    type="button"
                    onClick={() => handleSwitchRole(cfg.role, cfg.path)}
                    className={`flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                      isActive
                        ? "bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/80 text-violet-900 dark:text-violet-100 font-semibold shadow-xs"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <span>{cfg.label}</span>
                        {isActive && (
                          <span className="text-[10px] bg-violet-600 text-white px-1.5 py-0.2 rounded-full font-normal">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {cfg.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Reset State & DB Assistant Link */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePristineReset}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 border ${
                resetSuccess
                  ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <span>{resetSuccess ? "✓ Pristine Data Restored" : "🔄 Reset to Clean Demo"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate("/db-assistant");
              }}
              title="Open Natural Language DB Assistant"
              className="py-2 px-3 rounded-xl text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xs transition-all flex items-center gap-1"
            >
              <span>✨ Ask AI DB</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
