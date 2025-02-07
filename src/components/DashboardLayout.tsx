
import { useState, useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart3, Users, Briefcase, Settings, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const menuItems = [
  { icon: BarChart3, label: "Overview", path: "/" },
  { icon: Users, label: "Investors", path: "/investors" },
  { icon: Briefcase, label: "Startups", path: "/startups" },
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
