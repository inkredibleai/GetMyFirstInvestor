import { useState, useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart3, Users, Briefcase, Settings, LogOut, BookOpen, Building2, FileText, GraduationCap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

const menuItems = [
  { icon: BarChart3, label: "Overview", path: "/" },
  { icon: Users, label: "Investors", path: "/investors" },
  { icon: Briefcase, label: "Startups", path: "/startups" },
  // { icon: Briefcase, label: "Upcoming Startups", path: "/upcoming-startups" },
  { icon: Users, label: "Mentors", path: "/mentors" },
  // { icon: Building2, label: "Incubators", path: "/incubators" },
  // { icon: GraduationCap, label: "Workshops & Events", path: "/events" },
  // { icon: FileText, label: "Govt. Schemes", path: "/schemes" },
  // { icon: BookOpen, label: "Blogs", path: "/blogs" },
  { icon: Settings, label: "Tools", path: "/tools" },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  // Add query for mentor sessions
  const { data: sessionStats } = useQuery({
    queryKey: ['mentorSessionStats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { total: 0, upcoming: 0 };

      const { data: sessions } = await supabase
        .from('mentor_sessions')
        .select('*')
        .eq('founder_id', user.id);

      const now = new Date();
      const upcoming = sessions?.filter(session => 
        new Date(session.session_date) > now && 
        session.status !== 'cancelled'
      ).length || 0;

      return {
        total: sessions?.length || 0,
        upcoming
      };
    }
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar className="border-r border-gray-200">
          <SidebarContent>
            <div className="p-4">
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            </div>
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-dashboard-accent text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            
            {/* Add session stats */}
            {sessionStats && (
              <div className="px-4 py-3 mt-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-purple-800 mb-2">Mentor Sessions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{sessionStats.total}</p>
                      <p className="text-xs text-purple-800">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{sessionStats.upcoming}</p>
                      <p className="text-xs text-purple-800">Upcoming</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </SidebarContent>
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};
