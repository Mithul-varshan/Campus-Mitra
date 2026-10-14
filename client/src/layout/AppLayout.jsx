import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import Login from "../pages/Login";
import OAuthCallback from "../pages/auth/OAuthCallback";
import Dashboard from "../pages/Dashboard";
import LandingPage from "../pages/landing/LandingPage";
import Myevents from "../pages/events/MyEvents";
import EventDetail from "../pages/events/EventDetail";
import EventRegistration from "../pages/events/EventRegistration";
import FindTeammates from "../pages/FindTeammates";
import MyProjects from "../pages/MyProjectsNew";
import ProjectDetail from "../pages/ProjectDetail";
import Leaderboard from "../pages/Leaderboard";
import Certificates from "../pages/Certificates";
import InnovationScore from "../pages/InnovationScore";
import BulkImport from "../pages/BulkImport";
import Faculty from "../pages/Faculty";
import Students from "../pages/Students";
import Support from "../pages/Support";
import MentorMapping from "../pages/MentorMapping";
import Analytics from "../pages/Analytics";
import NaacReports from "../pages/NaacReports";
import Winners from "../pages/Winners";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import Colleges from "../pages/Colleges";
import CollegeDetail from "../pages/CollegeDetail";
import EventsMonitor from "../pages/EventsMonitor";
import SubscriptionPlans from "../pages/SubscriptionPlans";
import PlatformSettings from "../pages/PlatformSettings";
import AuditLogs from "../pages/AuditLogs";
import ReportsExports from "../pages/ReportsExports";
import MyPortfolio from "../pages/portfolio/MyPortfolioNew";
import DBAssistant from "../pages/DBAssistant";
import AdminMyEvents from "../pages/admin/AdminMyEvents";
import AdminIncomingEvents from "../pages/admin/AdminIncomingEvents";
import AdminEventAnalytics from "../pages/admin/AdminEventAnalytics";
import CreateEventPage from "../pages/admin/CreateEventPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminEventsOverview from "../pages/admin/AdminEventsOverview";
import RegisteredTeamsPage from "../pages/admin/RegisteredTeamsPage";
import DeclareWinnersPage from "../pages/admin/DeclareWinnersPage";
import EventAnalyticsPage from "../pages/admin/EventAnalyticsPage";
import AdminCertificates from "../pages/admin/AdminCertificates";
import MyStudents from "../pages/teacher/MyStudents";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherEvents from "../pages/teacher/TeacherEvents";
import VerifiedAchievements from "../pages/teacher/VerifiedAchievements";
import SkillIntelligence from "../pages/teacher/SkillIntelligence";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import CollegeExplorer from "../pages/recruiter/CollegeExplorer";
import CollegeComparison from "../pages/recruiter/CollegeComparison";
import SkillHeatmap from "../pages/recruiter/SkillHeatmap";
import CandidateDiscovery from "../pages/recruiter/CandidateDiscovery";
import CandidateProfile from "../pages/recruiter/CandidateProfile";
import CampusHiringPlanner from "../pages/recruiter/CampusHiringPlanner";
import AutoMatchedCandidates from "../pages/recruiter/AutoMatchedCandidates";
import ShortlistedCandidates from "../pages/recruiter/ShortlistedCandidates";
import InterviewPipeline from "../pages/recruiter/InterviewPipeline";
import RecruiterAnalytics from "../pages/recruiter/RecruiterAnalytics";
import SavedColleges from "../pages/recruiter/SavedColleges";
import SavedCandidates from "../pages/recruiter/SavedCandidates";
import RecruiterSettings from "../pages/recruiter/RecruiterSettings";
import Settings from "../pages/Settings";
import JudgeLogin from "../pages/judge/JudgeLogin";
import JudgeDashboard from "../pages/judge/JudgeDashboard";
import { useAuth } from "../context/AuthContext";

function ComingSoon({ title }) {
  return (
    <div style={{ padding: "32px" }}>
      <div className="text-2xl font-bold text-slate-800">
        {title} - Coming Soon
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/** Restricts a route to specific roles; redirects to /dashboard if unauthorized. */
function RoleProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

// Role-based dashboard component
function RoleBasedDashboard() {
  const { user, ROLES } = useAuth();

  if (user?.role === ROLES.ADMIN) {
    return <AdminDashboard />;
  }
  if (user?.role === ROLES.TEACHER) {
    return <TeacherDashboard />;
  }
  if (user?.role === ROLES.RECRUITER) {
    return <RecruiterDashboard />;
  }
  if (user?.role === ROLES.SUPER_ADMIN) {
    return <SuperAdminDashboard />;
  }
  // Default: student dashboard
  return <Dashboard />;
}

export default function AppLayout() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/judge/login" element={<JudgeLogin />} />
      <Route path="/judge/dashboard" element={<JudgeDashboard />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route path="/" element={<LandingPage />} />
      {/* Protected layout with sidebar */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<RoleBasedDashboard />} />
        <Route path="/events" element={<Myevents />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/:id/register" element={<EventRegistration />} />
        <Route path="/projects" element={<MyProjects />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/portfolio" element={<MyPortfolio />} />
        {/* redirect legacy devlogs URL to dashboard */}
        <Route path="/devlogs" element={<Navigate to="/dashboard" replace />} />
        <Route path="/teams" element={<ComingSoon title="Teams" />} />
        <Route path="/teammates" element={<FindTeammates />} />
        <Route path="/innovation-score" element={<InnovationScore />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/certificates" element={<Certificates />} />
        {/* Admin / Teacher / Super Admin routes */}
        <Route path="/students" element={<Students />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/bulk-import" element={<BulkImport />} />
        <Route path="/bulk_import" element={<Navigate to="/bulk-import" replace />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/naac-reports" element={<NaacReports />} />
        <Route path="/winners" element={<Winners />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/colleges/:id" element={<CollegeDetail />} />
        {/* Global analytics removed from routes */}
        <Route path="/events-monitor" element={<EventsMonitor />} />
        <Route path="/subscriptions" element={<SubscriptionPlans />} />
        <Route path="/db-assistant" element={<DBAssistant />} />
        {/* Admin Event Management routes */}
        <Route path="/admin/my-events" element={<AdminMyEvents />} />
        <Route path="/admin/my-events/:eventId" element={<AdminMyEvents />} />
        <Route path="/admin/create-event" element={<CreateEventPage />} />
        <Route
          path="/admin/registered-teams"
          element={<RegisteredTeamsPage />}
        />
        <Route path="/admin/declare-winners" element={<DeclareWinnersPage />} />
        <Route
          path="/admin/event-analytics-page"
          element={<EventAnalyticsPage />}
        />
        <Route
          path="/admin/incoming-events"
          element={<AdminIncomingEvents />}
        />
        <Route
          path="/admin/incoming-events/:eventId"
          element={<AdminIncomingEvents />}
        />
        <Route
          path="/admin/event-analytics"
          element={<AdminEventAnalytics />}
        />
        <Route
          path="/admin/events-overview"
          element={<AdminEventsOverview />}
        />
        <Route
          path="/admin/events-overview/:eventId"
          element={<AdminEventsOverview />}
        />
        <Route path="/admin/certificates" element={<AdminCertificates />} />
        <Route
          path="/manage-admins"
          element={<ComingSoon title="Manage Admins" />}
        />
        <Route path="/settings" element={<Settings />} />
        {/* Super Admin routes */}
        <Route
          path="/global-students"
          element={<ComingSoon title="Global Students" />}
        />
        <Route
          path="/cross-college-events"
          element={<ComingSoon title="Cross-College Events" />}
        />
        <Route
          path="/innovation-trends"
          element={<ComingSoon title="Innovation Trends" />}
        />
        <Route
          path="/policy-reports"
          element={<ComingSoon title="Policy Reports" />}
        />
        <Route path="/platform-settings" element={<PlatformSettings />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/reports-exports" element={<ReportsExports />} />
        {/* Faculty routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/my-students" element={<MyStudents />} />
        <Route path="/teacher/events" element={<TeacherEvents />} />
        <Route
          path="/teacher/verified-achievements"
          element={<VerifiedAchievements />}
        />
        <Route
          path="/teacher/skill-intelligence"
          element={<SkillIntelligence />}
        />
        <Route path="/reviews" element={<ComingSoon title="Reviews" />} />
        {/* Recruiter routes */}
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/colleges" element={<CollegeExplorer />} />
        <Route
          path="/recruiter/college-comparison"
          element={<CollegeComparison />}
        />
        <Route path="/recruiter/skill-heatmap" element={<SkillHeatmap />} />
        <Route
          path="/recruiter/candidate-discovery"
          element={<CandidateDiscovery />}
        />
        <Route
          path="/recruiter/candidate-profile"
          element={<CandidateProfile />}
        />
        <Route
          path="/recruiter/hiring-planner"
          element={<CampusHiringPlanner />}
        />
        <Route
          path="/recruiter/auto-matched"
          element={<AutoMatchedCandidates />}
        />
        <Route
          path="/recruiter/shortlisted"
          element={<ShortlistedCandidates />}
        />
        <Route
          path="/recruiter/interview-pipeline"
          element={<InterviewPipeline />}
        />
        <Route path="/recruiter/analytics" element={<RecruiterAnalytics />} />
        <Route path="/recruiter/saved-colleges" element={<SavedColleges />} />
        <Route
          path="/recruiter/saved-candidates"
          element={<SavedCandidates />}
        />
        <Route path="/recruiter/settings" element={<RecruiterSettings />} />
        <Route path="/support" element={<Support />} />
        <Route path="/mentor-mapping" element={<MentorMapping />} />
      </Route>
      {/* 404 catch-all — must be last */}
      <Route path="*" element={<ComingSoon title="Page Not Found" />} />
    </Routes>
  );
}
