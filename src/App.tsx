import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LandingPage from "@/components/LandingPage";
import AuthPage from "@/components/AuthPage";
import ProfileSetup from "@/components/ProfileSetup";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/components/Dashboard";
import ChatbotPage from "@/components/ChatbotPage";
import AnalyticsPage from "@/components/AnalyticsPage";
import EducationPage from "@/components/EducationPage";
import RealTimeDataPage from "@/components/RealTimeDataPage";
import PremiumPage from "@/components/PremiumPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile-setup" element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="chatbot" element={<ChatbotPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="education" element={<EducationPage />} />
                <Route path="realtime" element={<RealTimeDataPage />} />
                <Route path="premium" element={<PremiumPage />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
