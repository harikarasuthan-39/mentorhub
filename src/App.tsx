import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useAuth } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { LoadingState } from "./components/ui/LoadingState";
import { IntroSplash } from "./components/ui/IntroSplash";

import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import MentorDashboard from "./pages/MentorDashboard";
import HodDashboard from "./pages/HodDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AiMentorChat from "./pages/AiMentorChat";
import StudyPlanner from "./pages/StudyPlanner";
import CareerGuidance from "./pages/CareerGuidance";
import SkillsMatrix from "./pages/SkillsMatrix";
import StudentProgress from "./pages/StudentProgress";
import Students from "./pages/Students";
import StudentProfile from "./pages/StudentProfile";
import Meetings from "./pages/Meetings";
import Issues from "./pages/Issues";
import Actions from "./pages/Actions";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingState label="Loading MentorHUB Intelligence Hub..." />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleDashboard() {
  const { user } = useAuth();
  if (user?.role === "MENTOR") return <MentorDashboard />;
  if (user?.role === "HOD") return <HodDashboard />;
  return <StudentDashboard />;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && <IntroSplash onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <Routes>
        <Route path="/welcome" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<RoleDashboard />} />
          <Route path="/ai-mentor" element={<AiMentorChat />} />
          <Route path="/study-planner" element={<StudyPlanner />} />
          <Route path="/career-guidance" element={<CareerGuidance />} />
          <Route path="/skills" element={<SkillsMatrix />} />
          <Route path="/progress" element={<StudentProgress />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
