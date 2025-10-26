import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Welcome from "./pages/Welcome";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ChildSignup from "./pages/child/ChildSignup";
import CarerSignup from "./pages/carer/CarerSignup";
import QuickTour from "./pages/QuickTour";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Child pages
import ChildHome from "./pages/child/ChildHome";
import EnterInviteCode from "./pages/child/EnterInviteCode";
import PickTheme from "./pages/child/PickTheme";
import CreateAvatarEnhanced from "./pages/child/CreateAvatarEnhanced";
import SafetyNote from "./pages/child/SafetyNote";
import FirstMoodCheckin from "./pages/child/FirstMoodCheckin";
import JournalEntry from "./pages/child/JournalEntry";
import WendyChat from "./pages/child/WendyChat";
import ViewEntries from "./pages/child/ViewEntries";
import Tools from "./pages/child/Tools";
import ChildJournal from "./pages/child/ChildJournal";
import { ChildAchievements } from "./pages/child/ChildAchievements";

// Carer pages
import CarerHome from "./pages/carer/CarerHome";
import PickAvatar from "./pages/carer/PickAvatar";
import InviteCode from "./pages/carer/InviteCode";
import CarerInsights from "./pages/carer/CarerInsights";
import CarerResources from "./pages/carer/CarerResources";
import SharedEntries from "./pages/carer/SharedEntries";
import JointTools from "./pages/carer/JointTools";
import CarerJournal from "./pages/carer/CarerJournal";

// Shared pages
import Modules from "./pages/shared/Modules";
import ModuleDetail from "./pages/shared/ModuleDetail";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'child' | 'carer' }) {
  const { user, userRole, loading, roleLoading } = useAuth();
  
  if (loading || roleLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user, userRole, loading, roleLoading } = useAuth();

  if (loading || roleLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const homePath = userRole === 'child' ? '/child/home' : '/carer/home';

  return (
    <Routes>
      {/* Root route - smart redirect based on auth state */}
      <Route path="/" element={user && userRole ? <Navigate to={homePath} replace /> : <Welcome />} />
      
      {/* Public routes - redirect to home if already authenticated */}
      <Route path="/role-selection" element={user && userRole ? <Navigate to={homePath} replace /> : <RoleSelection />} />
      <Route path="/login" element={user && userRole ? <Navigate to={homePath} replace /> : <Login />} />
      <Route path="/forgot-password" element={user && userRole ? <Navigate to={homePath} replace /> : <ForgotPassword />} />
      <Route path="/child/signup" element={user && userRole ? <Navigate to={homePath} replace /> : <ChildSignup />} />
      <Route path="/carer/signup" element={user && userRole ? <Navigate to={homePath} replace /> : <CarerSignup />} />
      
      {/* Child routes - protected */}
      <Route path="/child/home" element={<ProtectedRoute role="child"><ChildHome /></ProtectedRoute>} />
      <Route path="/child/enter-invite-code" element={<ProtectedRoute role="child"><EnterInviteCode /></ProtectedRoute>} />
      <Route path="/child/pick-theme" element={<ProtectedRoute role="child"><PickTheme /></ProtectedRoute>} />
      <Route path="/child/create-avatar" element={<ProtectedRoute role="child"><CreateAvatarEnhanced /></ProtectedRoute>} />
      <Route path="/child/safety-note" element={<ProtectedRoute role="child"><SafetyNote /></ProtectedRoute>} />
      <Route path="/child/first-mood-checkin" element={<ProtectedRoute role="child"><FirstMoodCheckin /></ProtectedRoute>} />
      <Route path="/child/journal-entry" element={<ProtectedRoute role="child"><JournalEntry /></ProtectedRoute>} />
      <Route path="/child/wendy-chat" element={<ProtectedRoute role="child"><WendyChat /></ProtectedRoute>} />
      <Route path="/child/entries" element={<ProtectedRoute role="child"><ViewEntries /></ProtectedRoute>} />
      <Route path="/child/tools" element={<ProtectedRoute role="child"><Tools /></ProtectedRoute>} />
      <Route path="/child/journal" element={<ProtectedRoute role="child"><ChildJournal /></ProtectedRoute>} />
      <Route path="/child/achievements" element={<ProtectedRoute role="child"><ChildAchievements /></ProtectedRoute>} />
      <Route path="/child/modules" element={<ProtectedRoute role="child"><Modules /></ProtectedRoute>} />
      <Route path="/child/modules/:moduleId" element={<ProtectedRoute role="child"><ModuleDetail /></ProtectedRoute>} />
      
      {/* Carer routes - protected */}
      <Route path="/carer/home" element={<ProtectedRoute role="carer"><CarerHome /></ProtectedRoute>} />
      <Route path="/carer/pick-avatar" element={<ProtectedRoute role="carer"><PickAvatar /></ProtectedRoute>} />
      <Route path="/carer/invite-code" element={<ProtectedRoute role="carer"><InviteCode /></ProtectedRoute>} />
      <Route path="/carer/insights" element={<ProtectedRoute role="carer"><CarerInsights /></ProtectedRoute>} />
      <Route path="/carer/resources" element={<ProtectedRoute role="carer"><CarerResources /></ProtectedRoute>} />
      <Route path="/carer/shared-entries" element={<ProtectedRoute role="carer"><SharedEntries /></ProtectedRoute>} />
      <Route path="/carer/joint-tools" element={<ProtectedRoute role="carer"><JointTools /></ProtectedRoute>} />
      <Route path="/carer/journal" element={<ProtectedRoute role="carer"><CarerJournal /></ProtectedRoute>} />
      <Route path="/carer/modules" element={<ProtectedRoute role="carer"><Modules /></ProtectedRoute>} />
      <Route path="/carer/modules/:moduleId" element={<ProtectedRoute role="carer"><ModuleDetail /></ProtectedRoute>} />
      
      {/* Shared routes - protected */}
      <Route path="/quick-tour" element={<ProtectedRoute><QuickTour /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
