
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ServicesPage from "./pages/ServicesPage";
import PremiumLabs from "./pages/PremiumLabs";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Downloads from "./pages/Downloads";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Scroll to hash component
const ScrollToHash = () => {
  const location = useLocation();
  
  useEffect(() => {
    // If we have a hash in the URL
    if (location.hash) {
      // Get the element by id (without the #)
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        // Wait a bit for the page to fully render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // Scroll to top if no hash
      window.scrollTo(0, 0);
    }
  }, [location]);
  
  return null;
};

// Protected route component with proper loading state
const ProtectedRoute = ({ children, adminRequired = false }: { children: React.ReactNode, adminRequired?: boolean }) => {
  const { user, loading, profileLoading, userRole } = useAuth();
  
  // Show loading spinner while auth or profile is loading
  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ozar-red"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check for admin role if required and profile has loaded
  if (adminRequired && userRole !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  // All checks passed, render the children
  return <>{children}</>;
};

const AppRoutes = () => (
  <>
    <ScrollToHash />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/premium-labs" element={<PremiumLabs />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute adminRequired={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

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
