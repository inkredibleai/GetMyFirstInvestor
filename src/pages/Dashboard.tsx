
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate("/auth");
    }
  }, [profile, navigate]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Welcome, {profile.full_name || "User"}
          </h1>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {profile.user_type === "investor" ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Startups</h2>
            <p className="text-gray-600">
              (Startup list will be implemented in the next phase)
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Startup Tools</h2>
              <p className="text-gray-600">
                (Startup tools will be implemented in the next phase)
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Investor Directory</h2>
              <p className="text-gray-600">
                (Investor list will be implemented in the next phase)
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
