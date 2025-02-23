import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { Overview } from "./components/Overview";
import { Investors } from "./components/Investors";
import { Startups } from "./components/Startups";
import { Tools } from "./components/Tools";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import LandingPage from "./pages/LandingPage";
import FounderDashboard from './pages/FounderDashboard';
import MentorsPage from "./pages/MentorsPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

const LandingProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (session) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingProtectedRoute>
                <LandingPage />
              </LandingProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout><Overview /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/investors" 
            element={
              <ProtectedRoute>
                <DashboardLayout><Investors /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/startups" 
            element={
              <ProtectedRoute>
                <DashboardLayout><Startups /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tools" 
            element={
              <ProtectedRoute>
                <DashboardLayout><Tools /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="/founder-dashboard" element={<FounderDashboard />} />
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
