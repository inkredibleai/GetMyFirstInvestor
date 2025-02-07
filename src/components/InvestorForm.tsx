import { useState, useEffect } from "react";
import { Investor } from "@/types/investor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InvestorFormProps {
  investor?: Investor;
  onSuccess?: () => void;
}

export const InvestorForm = ({ investor, onSuccess }: InvestorFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    investment_focus: "",
    minimum_investment: "",
    maximum_investment: "",
    city: "",
    country: "",
    website: "",
    linkedin_url: "",
    invested_startups: 0,
    total_investment: "",
    active: true,
    status: "pending" as "pending" | "verified",
  });

  useEffect(() => {
    if (investor) {
      setFormData({
        name: investor.name || "",
        email: investor.email || "",
        organization: investor.organization || "",
        investment_focus: investor.investment_focus || "",
        minimum_investment: investor.minimum_investment || "",
        maximum_investment: investor.maximum_investment || "",
        city: investor.city || "",
        country: investor.country || "",
        website: investor.website || "",
        linkedin_url: investor.linkedin_url || "",
        invested_startups: investor.invested_startups || 0,
        total_investment: investor.total_investment || "",
        active: investor.active,
        status: investor.status as "pending" | "verified",
      });
    }
  }, [investor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (investor?.id) {
        // Using upsert instead of update
        const { error } = await supabase
          .from('investors')
          .upsert({
            id: investor.id, // Include the ID in the data
            ...formData,
            updated_at: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;

        toast({
          title: "Success",
          description: "Investor updated successfully",
        });
      } else {
        // Create new investor
        const { error } = await supabase
          .from('investors')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Investor added successfully",
        });

        // Reset form only for new investor
        setFormData({
          name: "",
          email: "",
          organization: "",
          investment_focus: "",
          minimum_investment: "",
          maximum_investment: "",
          city: "",
          country: "",
          website: "",
          linkedin_url: "",
          invested_startups: 0,
          total_investment: "",
          active: true,
          status: "pending",
        });
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Organization</label>
          <Input
            value={formData.organization}
            onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Investment Focus</label>
          <Input
            value={formData.investment_focus}
            onChange={(e) => setFormData(prev => ({ ...prev, investment_focus: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Minimum Investment</label>
          <Input
            value={formData.minimum_investment}
            onChange={(e) => setFormData(prev => ({ ...prev, minimum_investment: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Maximum Investment</label>
          <Input
            value={formData.maximum_investment}
            onChange={(e) => setFormData(prev => ({ ...prev, maximum_investment: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">City</label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Country</label>
          <Input
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Website</label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">LinkedIn URL</label>
          <Input
            type="url"
            value={formData.linkedin_url}
            onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
          />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium">Status</label>
          <select
            className="w-full border rounded-md p-2"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              status: e.target.value as 'pending' | 'verified'
            }))}
          >
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
            />
            <span className="text-sm font-medium">Active</span>
          </label>
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? (investor ? "Updating..." : "Adding...") : (investor ? "Update Investor" : "Add Investor")}
      </Button>
    </form>
  );
};
