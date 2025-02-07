import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2).max(100).nonempty(),
  industry: z.string().min(2).max(50).nullable(),
  description: z.string().min(10).max(500).nullable(),
  team_size: z.string()
    .transform(val => val ? parseInt(val, 10) : null)
    .nullable(),
  website: z.string().url().nullable(),
  contact_email: z.string().email().nullable(),
  contact_phone: z.string().nullable(),
  business_model: z.string().min(2).nullable(),
  funding_stage: z.string().nullable(),
  total_funding: z.string().nullable(),
  location: z.string().nullable(),
  founded_year: z.string()
    .regex(/^\d{4}$/, "Must be a valid year")
    .transform(val => val ? parseInt(val, 10) : null)
    .nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
  pitch_deck: z.string().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

export const StartupForm = ({ 
  startup, 
  onSuccess 
}: { 
  startup?: any;
  onSuccess: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: startup?.name || "",
      industry: startup?.industry || null,
      description: startup?.description || null,
      team_size: startup?.team_size?.toString() || null,
      website: startup?.website || null,
      contact_email: startup?.contact_email || null,
      contact_phone: startup?.contact_phone || null,
      business_model: startup?.business_model || null,
      funding_stage: startup?.funding_stage || null,
      total_funding: startup?.total_funding || null,
      location: startup?.location || null,
      founded_year: startup?.founded_year?.toString() || null,
      status: startup?.status || "active",
      pitch_deck: startup?.pitch_deck || null
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const { error } = startup
        ? await supabase
            .from('startups')
            .update({
              ...values,
              updated_at: new Date().toISOString()
            })
            .eq('id', startup.id)
        : await supabase
            .from('startups')
            .insert({ ...values, name: values.name || "" });

      if (error) throw error;

      toast.success(`Startup ${startup ? 'updated' : 'added'} successfully!`);
      onSuccess();
      if (!startup) form.reset();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${startup ? 'update' : 'add'} startup`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] p-1">
        {/* Name & Industry section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input {...field} required className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" placeholder="e.g. Fintech, AI, Healthcare" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description - full width */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="w-full min-h-[100px]" placeholder="Brief description of the startup" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Update all grid containers to be responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="funding_stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funding Stage</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pre-seed">Pre-seed</SelectItem>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="series-a">Series A</SelectItem>
                    <SelectItem value="series-b">Series B</SelectItem>
                    <SelectItem value="series-c">Series C</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total_funding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Funding</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. $1M, $500K" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="team_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Size</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="Number of employees" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business_model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Model</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. B2B, B2C, Marketplace" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} placeholder="contact@startup.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+1 (555) 000-0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="City, Country" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="founded_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Founded Year</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1900" 
                    max={new Date().getFullYear()} 
                    {...field} 
                    placeholder={new Date().getFullYear().toString()} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://startup.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pitch_deck"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pitch Deck URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status - full width on mobile */}
        <div className="grid grid-cols-1 md:w-1/2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit button - full width always */}
        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Startup"}
        </Button>
      </form>
    </Form>
  )
}
