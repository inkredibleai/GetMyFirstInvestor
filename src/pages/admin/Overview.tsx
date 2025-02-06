import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users, Wrench } from "lucide-react";

const Overview = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [startups, investors, tools] = await Promise.all([
        supabase.from("startups").select("id", { count: "exact" }),
        supabase.from("investors").select("id", { count: "exact" }),
        supabase.from("tools").select("id", { count: "exact" }),
      ]);

      return {
        startups: startups.count || 0,
        investors: investors.count || 0,
        tools: tools.count || 0,
      };
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Startups</p>
              <p className="text-2xl font-bold">{stats?.startups || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Investors</p>
              <p className="text-2xl font-bold">{stats?.investors || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tools</p>
              <p className="text-2xl font-bold">{stats?.tools || 0}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;