import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Building, Phone, Mail } from "lucide-react";

export const IncubatorDetail = () => {
  const { id } = useParams();
  const [incubator, setIncubator] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncubatorDetails();
  }, [id]);

  const fetchIncubatorDetails = async () => {
    const { data, error } = await supabase
      .from('incubators')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error:', error);
      return;
    }

    setIncubator(data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!incubator) return <div>Incubator not found</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-6">
          {incubator.logo_url && (
            <img 
              src={incubator.logo_url} 
              alt={incubator.name} 
              className="w-24 h-24 rounded-lg"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">{incubator.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{incubator.city}, {incubator.state}</span>
            </div>
          </div>
        </div>
        <p className="text-xl text-gray-600">{incubator.description}</p>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="startups">Success Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Application Process</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {incubator.application_process}
              </p>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-500" />
                    <span>{incubator.contact_info.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-500" />
                    <span>{incubator.contact_info.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="text-gray-500" />
                    <span>{incubator.contact_info.address}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eligibility">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Eligibility Criteria</h3>
              <div className="space-y-3">
                {incubator.eligibility_criteria?.map((criteria: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 mt-1" />
                    <p className="text-gray-600">{criteria}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add remaining tabs content */}
      </Tabs>
    </div>
  );
};
