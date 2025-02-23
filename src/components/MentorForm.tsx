import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mentor } from "@/types/mentor";
import { Plus, Trash2 } from "lucide-react";
import { queryClient } from "@/lib/react-query";

const timeSlotSchema = z.object({
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  start_time: z.string(),
  end_time: z.string(),
});

const mentorSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  expertise: z.string().optional(),
  years_of_experience: z.number().min(0).max(100).default(0),
  industry: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  availability: z.string().optional(),
  linkedin_url: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }).optional(),
  website: z.string().url({
    message: "Please enter a valid website URL.",
  }).optional(),
  avatar: z.string().url({
    message: "Please enter a valid image URL.",
  }).optional().nullable(), // Make avatar optional and nullable
  active: z.boolean().default(true),
  status: z.enum(['pending', 'verified']).default('pending'),
  timeSlots: z.array(timeSlotSchema)
});

interface MentorFormProps {
  mentor?: Mentor;
  onSuccess?: () => void;
}

export const MentorForm = ({ mentor, onSuccess }: MentorFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof mentorSchema>>({
    resolver: zodResolver(mentorSchema),
    defaultValues: mentor || {
      name: "",
      email: "",
      expertise: "",
      years_of_experience: 0,
      industry: "",
      city: "",
      country: "",
      availability: "",
      linkedin_url: "",
      website: "",
      avatar: "",
      active: true,
      status: 'pending',
      timeSlots: [{
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '17:00'
      }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "timeSlots"
  });

  async function onSubmit(values: z.infer<typeof mentorSchema>) {
    setIsSubmitting(true);
    try {
      // First, handle mentor data
      const mentorData = {
        name: values.name,
        email: values.email,
        expertise: values.expertise,
        years_of_experience: values.years_of_experience,
        industry: values.industry,
        city: values.city,
        country: values.country,
        availability: values.availability,
        linkedin_url: values.linkedin_url,
        website: values.website,
        avatar: values.avatar,
        active: values.active,
        status: values.status,
      };

      let mentorId = mentor?.id;

      if (mentor) {
        const { error: mentorError } = await supabase
          .from('mentors')
          .update(mentorData)
          .eq('id', mentor.id);
        if (mentorError) throw mentorError;
      } else {
        const { data, error: mentorError } = await supabase
          .from('mentors')
          .insert([mentorData])
          .select()
          .single();
        if (mentorError) throw mentorError;
        mentorId = data.id;
      }

      // Then, handle time slots
      if (mentorId) {
        // Delete existing time slots
        await supabase
          .from('mentor_availability')
          .delete()
          .eq('mentor_id', mentorId);

        // Insert new time slots
        const timeSlotsData = values.timeSlots.map(slot => ({
          mentor_id: mentorId,
          ...slot
        }));

        const { error: timeSlotError } = await supabase
          .from('mentor_availability')
          .insert(timeSlotsData);

        if (timeSlotError) throw timeSlotError;
      }

      toast({
        title: "Success",
        description: `Mentor ${mentor ? 'updated' : 'created'} successfully`,
      });
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Mentor Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="mentor@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expertise</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., AI, Marketing" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="years_of_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Years"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Tech, Finance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Weekdays, Evenings" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select className="rounded-md border border-gray-200 px-3 py-2 w-full" {...field}>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary shadow-sm focus:ring-2 focus:ring-primary"
                  />
                  <FormLabel className="font-normal">
                    Active Status
                  </FormLabel>
                </div>
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormDescription>
                  Toggle mentor's active status on the platform
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Time Slots Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Availability</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({
                day_of_week: 'Monday',
                start_time: '09:00',
                end_time: '17:00'
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
              <FormField
                control={form.control}
                name={`timeSlots.${index}.day_of_week`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Day</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`timeSlots.${index}.start_time`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`timeSlots.${index}.end_time`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : mentor ? "Update Mentor" : "Create Mentor"}
        </Button>
      </form>
    </Form>
  );
};

<DialogContent className="max-w-5xl">  {/* Increase max-width */}
  <DialogHeader>
    <DialogTitle>Add New Mentor</DialogTitle>
    <DialogDescription>
      Fill in the details to add a new mentor to the platform.
    </DialogDescription>
  </DialogHeader>
  <div className="overflow-y-auto max-h-[80vh]">  {/* Add scrollable container */}
    <MentorForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['mentors'] })} />
  </div>
</DialogContent>
