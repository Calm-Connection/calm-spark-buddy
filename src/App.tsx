import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Welcome from "./pages/Welcome";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import ChildSignup from "./pages/child/ChildSignup";
import CarerSignup from "./pages/carer/CarerSignup";
import NotFound from "./pages/NotFound";

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
        <Route path="/login" element={<Navigate to={homePath} replace />} />
        <Route path="/role-selection" element={<Navigate to={homePath} replace />} />
        <Route path="/child/signup" element={<Navigate to={homePath} replace />} />
        <Route path="/carer/signup" element={<Navigate to={homePath} replace />} />
        
        {/* Child routes - placeholder for now */}
        <Route path="/child/home" element={<ProtectedRoute role="child"><div className="p-8">Child Home - Coming Soon</div></ProtectedRoute>} />
        
        {/* Carer routes - placeholder for now */}
        <Route path="/carer/home" element={<ProtectedRoute role="carer"><div className="p-8">Carer Home - Coming Soon</div></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
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
