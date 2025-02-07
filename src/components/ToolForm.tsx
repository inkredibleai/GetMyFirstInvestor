
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ToolForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price_model: "",
    website: "",
    contact_email: "",
    integration_details: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('tools')
        .insert([{
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()),
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tool added successfully",
      });

      setFormData({
        name: "",
        category: "",
        description: "",
        price_model: "",
        website: "",
        contact_email: "",
        integration_details: "",
        tags: "",
      });

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
          <label className="text-sm font-medium">Category</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Price Model</label>
          <Input
            value={formData.price_model}
            onChange={(e) => setFormData(prev => ({ ...prev, price_model: e.target.value }))}
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
          <label className="text-sm font-medium">Contact Email</label>
          <Input
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Integration Details</label>
          <Textarea
            value={formData.integration_details}
            onChange={(e) => setFormData(prev => ({ ...prev, integration_details: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Tags (comma-separated)</label>
          <Input
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="tag1, tag2, tag3"
          />
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Tool"}
      </Button>
    </form>
  );
};
