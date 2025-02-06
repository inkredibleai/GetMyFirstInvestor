import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Navigate, Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Building2,
  Wrench,
  LogOut,
} from "lucide-react";
 
const AdminDashboard = () => {
  const { adminEmail, logout } = useAdminAuth();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white p-6">
        <div className="flex flex-col h-full">
          <div className="space-y-2">
            <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
            <nav className="space-y-2">
              <Link to="/admin">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:text-primary hover:bg-white"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </Button>
              </Link>
              <Link to="/admin/investors">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:text-primary hover:bg-white"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Investors
                </Button>
              </Link>
              <Link to="/admin/startups">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:text-primary hover:bg-white"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Startups
                </Button>
              </Link>
              <Link to="/admin/tools">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:text-primary hover:bg-white"
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  Tools
                </Button>
              </Link>
            </nav>
          </div>
          <div className="mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-primary hover:bg-white"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;