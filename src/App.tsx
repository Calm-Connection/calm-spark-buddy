import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import ChildSignup from "./pages/child/ChildSignup";
import CarerSignup from "./pages/carer/CarerSignup";
import QuickTour from "./pages/QuickTour";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Child pages
import ChildHome from "./pages/child/ChildHome";
import EnterInviteCode from "./pages/child/EnterInviteCode";
import PickTheme from "./pages/child/PickTheme";
import CreateAvatar from "./pages/child/CreateAvatar";
import SafetyNote from "./pages/child/SafetyNote";
import FirstMoodCheckin from "./pages/child/FirstMoodCheckin";
import JournalEntry from "./pages/child/JournalEntry";
import WendyChat from "./pages/child/WendyChat";
import ViewEntries from "./pages/child/ViewEntries";
import Tools from "./pages/child/Tools";

// Carer pages
import CarerHome from "./pages/carer/CarerHome";
import PickAvatar from "./pages/carer/PickAvatar";
import InviteCode from "./pages/carer/InviteCode";
import Insights from "./pages/carer/Insights";
import SharedEntries from "./pages/carer/SharedEntries";
import JointTools from "./pages/carer/JointTools";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'child' | 'carer' }) {
  const { user, userRole, loading } = useAuth();
  
  if (loading) {
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
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Redirect authenticated users to their home
  if (user && userRole) {
    const homePath = userRole === 'child' ? '/child/home' : '/carer/home';
    return (
      <Routes>
        <Route path="/" element={<Navigate to={homePath} replace />} />
        <Route path="/welcome" element={<Navigate to={homePath} replace />} />
        <Route path="/login" element={<Navigate to={homePath} replace />} />
        <Route path="/role-selection" element={<Navigate to={homePath} replace />} />
        <Route path="/child/signup" element={<Navigate to={homePath} replace />} />
        <Route path="/carer/signup" element={<Navigate to={homePath} replace />} />
        
        {/* Child routes */}
        <Route path="/child/home" element={<ProtectedRoute role="child"><ChildHome /></ProtectedRoute>} />
        <Route path="/child/enter-invite-code" element={<ProtectedRoute role="child"><EnterInviteCode /></ProtectedRoute>} />
        <Route path="/child/pick-theme" element={<ProtectedRoute role="child"><PickTheme /></ProtectedRoute>} />
        <Route path="/child/create-avatar" element={<ProtectedRoute role="child"><CreateAvatar /></ProtectedRoute>} />
        <Route path="/child/safety-note" element={<ProtectedRoute role="child"><SafetyNote /></ProtectedRoute>} />
        <Route path="/child/first-mood-checkin" element={<ProtectedRoute role="child"><FirstMoodCheckin /></ProtectedRoute>} />
        <Route path="/child/journal-entry" element={<ProtectedRoute role="child"><JournalEntry /></ProtectedRoute>} />
        <Route path="/child/wendy-chat" element={<ProtectedRoute role="child"><WendyChat /></ProtectedRoute>} />
        <Route path="/child/entries" element={<ProtectedRoute role="child"><ViewEntries /></ProtectedRoute>} />
        <Route path="/child/tools" element={<ProtectedRoute role="child"><Tools /></ProtectedRoute>} />
        
        {/* Carer routes */}
        <Route path="/carer/home" element={<ProtectedRoute role="carer"><CarerHome /></ProtectedRoute>} />
        <Route path="/carer/pick-avatar" element={<ProtectedRoute role="carer"><PickAvatar /></ProtectedRoute>} />
        <Route path="/carer/invite-code" element={<ProtectedRoute role="carer"><InviteCode /></ProtectedRoute>} />
        <Route path="/carer/insights" element={<ProtectedRoute role="carer"><Insights /></ProtectedRoute>} />
        <Route path="/carer/shared-entries" element={<ProtectedRoute role="carer"><SharedEntries /></ProtectedRoute>} />
        <Route path="/carer/joint-tools" element={<ProtectedRoute role="carer"><JointTools /></ProtectedRoute>} />
        
        {/* Shared routes */}
        <Route path="/quick-tour" element={<ProtectedRoute><QuickTour /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/child/signup" element={<ChildSignup />} />
      <Route path="/carer/signup" element={<CarerSignup />} />
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
