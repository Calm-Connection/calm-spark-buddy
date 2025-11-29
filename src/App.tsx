import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useEffect } from "react";
import { loadSavedTheme, applyTheme } from "@/hooks/useTheme";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import LearnMore from "./pages/LearnMore";
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
import BreathingSpace from "./pages/child/tools/BreathingSpace";
import OceanBreathing from "./pages/child/tools/breathing/OceanBreathing";
import CloudBreathing from "./pages/child/tools/breathing/CloudBreathing";
import AnimalBreathing from "./pages/child/tools/breathing/AnimalBreathing";
import ForestBreathing from "./pages/child/tools/breathing/ForestBreathing";
import StarBreathing from "./pages/child/tools/breathing/StarBreathing";
import GardenBreathing from "./pages/child/tools/breathing/GardenBreathing";
import RainbowBreathing from "./pages/child/tools/breathing/RainbowBreathing";
import CreateCustom from "./pages/child/tools/breathing/CreateCustom";
import CustomSpace from "./pages/child/tools/breathing/CustomSpace";
import GroundingGame from "./pages/child/tools/GroundingGame";
import ThoughtClouds from "./pages/child/tools/ThoughtClouds";
import ColourCalm from "./pages/child/tools/ColourCalm";
import GentleReflections from "./pages/child/tools/GentleReflections";
import ChildJournal from "./pages/child/ChildJournal";
import { ChildAchievements } from "./pages/child/ChildAchievements";
import ChildNotificationSettingsPage from "./pages/child/NotificationSettingsPage";

// Carer pages
import CarerHome from "./pages/carer/CarerHome";
import PickAvatar from "./pages/carer/PickAvatar";
import InviteCode from "./pages/carer/InviteCode";
import CarerInsights from "./pages/carer/CarerInsights";
import CarerResources from "./pages/carer/CarerResources";
import SharedEntries from "./pages/carer/SharedEntries";
import JointTools from "./pages/carer/JointTools";
import BreathingTogether from "./pages/carer/tools/BreathingTogether";
import CalmMoment from "./pages/carer/tools/CalmMoment";
import ReflectionPrompts from "./pages/carer/tools/ReflectionPrompts";
import CarerJournal from "./pages/carer/CarerJournal";
import CarerNotificationSettings from "./pages/carer/NotificationSettings";
import SafeguardingDashboard from "./pages/carer/SafeguardingDashboard";
import PrivacyPolicy from "./pages/carer/PrivacyPolicy";
import TermsOfUse from "./pages/carer/TermsOfUse";
import PseudonymPolicy from "./pages/carer/PseudonymPolicy";
import SafeguardingInfo from "./pages/carer/SafeguardingInfo";
import TrustAndSafetyFAQ from "./pages/carer/TrustAndSafetyFAQ";
import PolicyHub from "./pages/carer/PolicyHub";
import SafetyAndPrivacy from "./pages/child/SafetyAndPrivacy";

// Shared pages
import Modules from "./pages/shared/Modules";
import ModuleDetail from "./pages/shared/ModuleDetail";

// Admin pages
import GenerateAvatarAssets from "./pages/admin/GenerateAvatarAssets";

// Mockup pages
import MoodSelectionMockup from "./pages/MoodSelectionMockup";

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
      <Route path="/about" element={user && userRole ? <Navigate to={homePath} replace /> : <About />} />
      <Route path="/learn-more" element={<LearnMore />} />
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
      <Route path="/child/tools/breathing-space" element={<ProtectedRoute role="child"><BreathingSpace /></ProtectedRoute>} />
      <Route path="/child/tools/breathing/ocean" element={<ProtectedRoute role="child"><OceanBreathing /></ProtectedRoute>} />
      <Route path="/child/tools/breathing/cloud" element={<ProtectedRoute role="child"><CloudBreathing /></ProtectedRoute>} />
      <Route path="/child/tools/breathing/animal" element={<ProtectedRoute role="child"><AnimalBreathing /></ProtectedRoute>} />
      <Route path="/child/tools/breathing/forest" element={<ProtectedRoute role="child"><ForestBreathing /></ProtectedRoute>} />
      <Route path="/child/tools/breathing/star" element={<ProtectedRoute role="child"><StarBreathing /></ProtectedRoute>} />
      <Route path="/child/tools/breathing/garden" element={<ProtectedRoute role="child"><GardenBreathing /></ProtectedRoute>} />
      <Route path="/child/tools/breathing/rainbow" element={<ProtectedRoute role="child"><RainbowBreathing /></ProtectedRoute>} />
      <Route path="/child/tools/breathing/create" element={<ProtectedRoute role="child"><CreateCustom /></ProtectedRoute>} />
      <Route path="/child/tools/breathing/custom/:id" element={<ProtectedRoute role="child"><CustomSpace /></ProtectedRoute>} />
      <Route path="/child/tools/grounding-game" element={<ProtectedRoute role="child"><GroundingGame /></ProtectedRoute>} />
      <Route path="/child/tools/thought-clouds" element={<ProtectedRoute role="child"><ThoughtClouds /></ProtectedRoute>} />
      <Route path="/child/tools/colour-calm" element={<ProtectedRoute role="child"><ColourCalm /></ProtectedRoute>} />
      <Route path="/child/tools/gentle-reflections" element={<ProtectedRoute role="child"><GentleReflections /></ProtectedRoute>} />
      <Route path="/child/journal" element={<ProtectedRoute role="child"><ChildJournal /></ProtectedRoute>} />
      <Route path="/child/achievements" element={<ProtectedRoute role="child"><ChildAchievements /></ProtectedRoute>} />
      <Route path="/child/notification-settings" element={<ProtectedRoute role="child"><ChildNotificationSettingsPage /></ProtectedRoute>} />
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
      <Route path="/carer/tools/breathing-together" element={<ProtectedRoute role="carer"><BreathingTogether /></ProtectedRoute>} />
      <Route path="/carer/tools/calm-moment" element={<ProtectedRoute role="carer"><CalmMoment /></ProtectedRoute>} />
      <Route path="/carer/tools/reflection-prompts" element={<ProtectedRoute role="carer"><ReflectionPrompts /></ProtectedRoute>} />
      <Route path="/carer/journal" element={<ProtectedRoute role="carer"><CarerJournal /></ProtectedRoute>} />
      <Route path="/carer/notification-settings" element={<ProtectedRoute role="carer"><CarerNotificationSettings /></ProtectedRoute>} />
            <Route path="/carer/safeguarding" element={<ProtectedRoute role="carer"><SafeguardingDashboard /></ProtectedRoute>} />
            <Route path="/carer/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/carer/terms-of-use" element={<TermsOfUse />} />
          <Route path="/carer/safeguarding-info" element={<SafeguardingInfo />} />
          <Route path="/carer/trust-safety-faq" element={<TrustAndSafetyFAQ />} />
          <Route path="/carer/policy-hub" element={<PolicyHub />} />
          <Route path="/child/safety-privacy" element={<SafetyAndPrivacy />} />
            <Route path="/carer/pseudonym-policy" element={<PseudonymPolicy />} />
      <Route path="/carer/modules" element={<ProtectedRoute role="carer"><Modules /></ProtectedRoute>} />
      <Route path="/carer/modules/:moduleId" element={<ProtectedRoute role="carer"><ModuleDetail /></ProtectedRoute>} />
      
      {/* Shared routes - protected */}
      <Route path="/quick-tour" element={<ProtectedRoute><QuickTour /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      {/* Admin routes - protected */}
      <Route path="/admin/generate-assets" element={<ProtectedRoute><GenerateAvatarAssets /></ProtectedRoute>} />
      
      {/* Mockup/Demo routes - public */}
      <Route path="/mood-mockup" element={<MoodSelectionMockup />} />
      
      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function ThemeObserver() {
  useEffect(() => {
    // Reapply theme when dark mode is toggled
    const observer = new MutationObserver(() => {
      const savedTheme = loadSavedTheme();
      if (savedTheme) {
        applyTheme(savedTheme);
      }
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ThemeProvider>
          <ThemeObserver />
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
