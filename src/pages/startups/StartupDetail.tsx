import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Users, Target, AlertTriangle, Trophy } from "lucide-react";

export const StartupDetail = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartupDetails();
  }, [id]);

  const fetchStartupDetails = async () => {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error:', error);
      return;
    }

    setStartup(data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!startup) return <div>Startup not found</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-6">
          {startup.logo_url && (
            <img 
              src={startup.logo_url} 
              alt={startup.name} 
              className="w-24 h-24 rounded-lg"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">{startup.name}</h1>
            <div className="flex gap-2">
              <Badge>{startup.sector}</Badge>
              <Badge variant="outline">{startup.location}</Badge>
            </div>
          </div>
        </div>
        <p className="text-xl text-gray-600">{startup.short_description}</p>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Problem Statement</h3>
                <p className="text-gray-600">{startup.problem_statement}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Solution</h3>
                <p className="text-gray-600">{startup.solution_description}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="story">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold mb-6">Founding Story</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {startup.founding_story}
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-6">Challenges Faced</h3>
              <div className="space-y-4">
                {startup.challenges?.map((challenge: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertTriangle className="text-yellow-500 mt-1" />
                    <p className="text-gray-600">{challenge}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <div className="grid md:grid-cols-3 gap-6">
            {startup.team_members?.map((member: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    {member.avatar && (
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-16 h-16 rounded-full" 
                      />
                    )}
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="space-y-4">
            {startup.achievements?.map((achievement: string, index: number) => (
              <Card key={index}>
                <CardContent className="pt-6 flex items-start gap-3">
                  <Trophy className="text-yellow-500" />
                  <p className="text-gray-600">{achievement}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
