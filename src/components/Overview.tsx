
import { Users, Briefcase, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StatCard = ({ icon: Icon, label, value, change }: any) => (
  <div className="bg-dashboard-card p-6 rounded-xl shadow-sm border border-gray-100 animate-fadeIn hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <h3 className="text-2xl font-semibold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center">
        <Icon className="h-6 w-6 text-dashboard-accent" />
      </div>
    </div>
    <div className="mt-4">
      <span className={`text-sm ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
        {change >= 0 ? "+" : ""}{change}%
      </span>
      <span className="text-sm text-gray-500 ml-2">vs last month</span>
    </div>
  </div>
);

export const Overview = () => {
  const { data: investorsCount } = useQuery({
    queryKey: ['investorsCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('investors')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: startupsCount } = useQuery({
    queryKey: ['startupsCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('startups')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: toolsCount } = useQuery({
    queryKey: ['toolsCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const stats = [
    { icon: Users, label: "Total Investors", value: investorsCount || 0, change: 12 },
    { icon: Briefcase, label: "Total Startups", value: startupsCount || 0, change: -2 },
    { icon: Settings, label: "Total Tools", value: toolsCount || 0, change: 8 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};
