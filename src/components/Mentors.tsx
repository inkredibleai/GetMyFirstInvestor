import { useState, useMemo } from "react";
import { MoreHorizontal, Pencil, Trash2, Search, Users, CheckCircle, Activity } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Mentor } from "@/types/mentor";

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MentorForm } from "./MentorForm";
import Papa from 'papaparse';

// Add this function at the top of the file, before the component
const getInitialsColor = (name: string) => {
  const colors = [
    { bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-200" },
    { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
    { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200" },
    { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
    { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
    { bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-200" },
    { bg: "bg-red-100", text: "text-red-600", border: "border-red-200" },
    { bg: "bg-cyan-100", text: "text-cyan-600", border: "border-cyan-200" },
  ];
  
  // Use the sum of character codes to pick a consistent color
  const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charSum % colors.length];
};
 
export const Mentors = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: mentors = [], isLoading } = useQuery<Mentor[]>({
    queryKey: ['mentors'],
    queryFn: async () => {
      // First get the mentors
      const { data: mentorsData, error: mentorsError } = await supabase
        .from('mentors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (mentorsError) throw mentorsError;

      // Then get their time slots
      const mentorsWithSlots = await Promise.all(
        mentorsData.map(async (mentor) => {
          const { data: slots, error: slotsError } = await supabase
            .from('mentor_availability')
            .select('*')
            .eq('mentor_id', mentor.id);
          
          if (slotsError) throw slotsError;
          
          return {
            ...mentor,
            timeSlots: slots || []
          };
        })
      );

      return mentorsWithSlots;
    }
  });

  const filteredMentors = useMemo(() => {
    if (!searchQuery.trim()) {
      return mentors;
    }
    
    const query = searchQuery.toLowerCase();
    return mentors.filter((mentor) => {
      const searchableFields = [
        mentor.name,
        mentor.email,
        mentor.expertise,
        mentor.industry,
        mentor.city,
        mentor.country,
      ];

      return searchableFields.some(field => 
        field?.toLowerCase().includes(query)
      );
    });
  }, [mentors, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: mentors.length,
      verified: mentors.filter(i => i.status === 'verified').length,
      active: mentors.filter(i => i.active).length
    };
  }, [mentors]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        setPreviewData(result.data);
        setShowPreview(true);
      },
      header: true,
    });
  };

  const handleBulkUpload = async () => {
    try {
      // Validate and transform the data before upload
      const transformedData = previewData.map(row => ({
        ...row,
        years_of_experience: parseInt(row.years_of_experience) || 0,
        active: row.active === 'true' || row.active === true,
        status: row.status || 'pending'
      }));

      const { error } = await supabase
        .from('mentors')
        .insert(transformedData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Mentors uploaded successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      setShowPreview(false);
      setPreviewData([]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "John Doe",
        email: "john@example.com",
        expertise: "AI",
        years_of_experience: 5,
        industry: "Tech",
        website: "https://example.com",
        linkedin_url: "https://linkedin.com/in/johndoe",
        city: "San Francisco",
        country: "USA",
        availability: "Weekdays",
        status: "pending",
        active: true,
        avatar: "https://example.com/avatar.jpg"
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mentors_template.csv';
    a.click();
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mentors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Mentor deleted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEditClick = (mentor: Mentor) => {
    // Convert the timeSlots to the expected format if necessary
    const formattedMentor = {
      ...mentor,
      timeSlots: mentor.timeSlots?.map(slot => ({
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time
      })) || []
    };
    setSelectedMentor(formattedMentor);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mentors</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your mentor relationships</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={downloadTemplate} className="bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Template
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()} className="bg-white hover:bg-gray-50">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Mentor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl !p-0"> {/* Added !p-0 */}
              <div className="sticky top-0 z-50 bg-white border-b px-6 py-4">
                <DialogHeader>
                  <DialogTitle>Add New Mentor</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new mentor to the platform.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="overflow-y-auto p-6 max-h-[80vh]">
                <MentorForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['mentors'] })} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Mentors</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Verified Mentors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.verified}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({((stats.verified / stats.total) * 100).toFixed(1)}%)
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Mentors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.active}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({((stats.active / stats.total) * 100).toFixed(1)}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Update Table Section with proper scrolling */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="relative h-[calc(100vh-18rem)]">
          <div className="absolute inset-0 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredMentors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50">
                <Search className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">No mentors found</p>
                <p className="text-sm text-gray-500">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="min-w-[1600px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-[50px]">Avatar</TableHead>
                      <TableHead className="min-w-[150px]">Name</TableHead>
                      <TableHead className="min-w-[200px]">Email</TableHead>
                      <TableHead className="min-w-[150px]">Expertise</TableHead>
                      <TableHead className="min-w-[120px]">Years of Experience</TableHead>
                      <TableHead className="min-w-[150px]">Industry</TableHead>
                      <TableHead className="min-w-[100px]">Website</TableHead>
                      <TableHead className="min-w-[100px]">LinkedIn</TableHead>
                      <TableHead className="min-w-[150px]">Location</TableHead>
                      <TableHead className="min-w-[150px]">Availability</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[80px]">Active</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMentors.map((mentor) => (
                      <TableRow 
                        key={mentor.id}
                        className="hover:bg-gray-50/50 transition-colors border-gray-100"
                      >
                        <TableCell className="py-3">
                          {mentor.avatar ? (
                            <img 
                              src={mentor.avatar} 
                              alt={mentor.name} 
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full ${getInitialsColor(mentor.name).bg} ${getInitialsColor(mentor.name).text} flex items-center justify-center font-medium border-2 ${getInitialsColor(mentor.name).border}`}>
                              {mentor.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">{mentor.name}</TableCell>
                        <TableCell className="text-gray-600">{mentor.email}</TableCell>
                        <TableCell className="text-gray-600 font-medium">{mentor.expertise}</TableCell>
                        <TableCell className="font-medium text-green-600">{mentor.years_of_experience}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {mentor.industry}
                          </span>
                        </TableCell>
                        <TableCell>
                          {mentor.website && (
                            <a 
                              href={mentor.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Visit
                            </a>
                          )}
                        </TableCell>
                        <TableCell>
                          {mentor.linkedin_url && (
                            <a 
                              href={mentor.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Profile
                            </a>
                          )}
                        </TableCell>
                        <TableCell>{`${mentor.city || ''}, ${mentor.country || ''}`}</TableCell>
                        <TableCell>{mentor.availability}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            mentor.status === "verified" 
                              ? "bg-green-50 text-green-700" 
                              : "bg-yellow-50 text-yellow-700"
                          }`}>
                            {mentor.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            mentor.active 
                              ? "bg-green-50 text-green-700" 
                              : "bg-red-50 text-red-700"
                          }`}>
                            {mentor.active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditClick(mentor)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDelete(mentor.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-5xl !p-0"> {/* Added !p-0 */}
          <div className="sticky top-0 z-50 bg-white border-b px-6 py-4">
            <DialogHeader>
              <DialogTitle>Edit Mentor</DialogTitle>
              <DialogDescription>
                Update the mentor's information using the form below.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="overflow-y-auto p-6 max-h-[80vh]">
            <MentorForm 
              mentor={selectedMentor || undefined}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['mentors'] });
                setIsEditDialogOpen(false);
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>
      {showPreview && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Upload</h2>
            <p className="text-gray-600 mb-4">Please review the data before uploading.</p>
            <ScrollArea className="h-64 mb-4">
              <Table>
                <TableHeader>
                  {Object.keys(previewData[0] || {}).map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableHeader>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i}>{String(value)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setShowPreview(false)}>Cancel</Button>
              <Button onClick={handleBulkUpload}>Confirm Upload</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
