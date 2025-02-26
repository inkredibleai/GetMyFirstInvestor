import { useState, useMemo } from "react";
import { MoreHorizontal, Pencil, Trash2, Search, Users, CheckCircle, Activity } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Investor } from "@/types/investor";

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
import { InvestorForm } from "./InvestorForm";
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

export const Investors = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: investors = [], isLoading } = useQuery<Investor[]>({
    queryKey: ['investors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Investor[];
    }
  });

  const filteredInvestors = useMemo(() => {
    if (!searchQuery.trim()) {
      return investors;
    }
    
    const query = searchQuery.toLowerCase();
    return investors.filter((investor) => {
      const searchableFields = [
        investor.name,
        investor.email,
        investor.organization,
        investor.investment_focus,
        investor.city,
        investor.country,
      ];

      return searchableFields.some(field => 
        field?.toLowerCase().includes(query)
      );
    });
  }, [investors, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: investors.length,
      verified: investors.filter(i => i.status === 'verified').length,
      active: investors.filter(i => i.active).length
    };
  }, [investors]);

  const validateInvestorData = (data: any) => {
    const requiredFields = ['name', 'email'];
    const errors: string[] = [];

    data.forEach((row: any, index: number) => {
      requiredFields.forEach(field => {
        if (!row[field]) {
          errors.push(`Row ${index + 1}: Missing required field '${field}'`);
        }
      });
    });

    return errors;
  };

  const handleBulkUpload = async () => {
    try {
      if (!previewData.length) {
        throw new Error("No data to upload");
      }

      // Transform the data
      const transformedData = previewData.map((row: any) => ({
        name: row.name?.toString().trim(),
        email: row.email?.toString().trim(),
        organization: row.organization?.toString().trim() || null,
        total_investment: row.total_investment?.toString().trim() || null,
        invested_startups: parseInt(row.invested_startups) || 0,
        investment_focus: row.investment_focus?.toString().trim() || null,
        city: row.city?.toString().trim() || null,
        country: row.country?.toString().trim() || null,
        minimum_investment: row.minimum_investment?.toString().trim() || null,
        maximum_investment: row.maximum_investment?.toString().trim() || null,
        website: row.website?.toString().trim() || null,
        linkedin_url: row.linkedin_url?.toString().trim() || null,
        avatar: row.avatar?.toString().trim() || null,
        active: true,
        status: 'pending'
      }));

      console.log('Transformed data:', transformedData); // Debug log

      const { data, error } = await supabase
        .from('investors')
        .insert(transformedData)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: `${transformedData.length} investors uploaded successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ['investors'] });
      setShowPreview(false);
      setPreviewData([]);

    } catch (error: any) {
      console.error('Upload error:', error); // Debug log
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Read the file using FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        Papa.parse(e.target?.result as string, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              console.log('Parsed data:', results.data); // Debug log
              setPreviewData(results.data);
              setShowPreview(true);
            } else {
              toast({
                variant: "destructive",
                title: "Error",
                description: "No valid data found in CSV file",
              });
            }
          },
          error: (error) => {
            toast({
              variant: "destructive",
              title: "Error",
              description: `Error parsing CSV: ${error.message}`,
            });
          }
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "John Doe",
        email: "john@example.com",
        organization: "Example VC",
        total_investment: "5M",
        invested_startups: "10",
        investment_focus: "Tech, Healthcare",
        website: "https://example.com",
        linkedin_url: "https://linkedin.com/in/johndoe",
        city: "San Francisco",
        country: "USA",
        minimum_investment: "100K",
        maximum_investment: "1M",
        status: "pending",
        active: "true",
        avatar: ""
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'investors_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('investors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investor deleted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['investors'] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEditClick = (investor: Investor) => {
    setSelectedInvestor(investor);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investors</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your investor relationships</p>
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
                Add Investor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New Investor</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new investor to the platform.
                </DialogDescription>
              </DialogHeader>
              <InvestorForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['investors'] })} />
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
              <p className="text-sm font-medium text-gray-500">Total Investors</p>
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
              <p className="text-sm font-medium text-gray-500">Verified Investors</p>
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
              <p className="text-sm font-medium text-gray-500">Active Investors</p>
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
              placeholder="Search by name, email, organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {filteredInvestors.length} investor{filteredInvestors.length !== 1 ? 's' : ''}
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
            ) : filteredInvestors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50">
                <Search className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">No investors found</p>
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
                      <TableHead className="min-w-[150px]">Organization</TableHead>
                      <TableHead className="min-w-[120px]">Total Investment</TableHead>
                      <TableHead className="min-w-[150px]">Investment Focus</TableHead>
                      <TableHead className="min-w-[100px]">Website</TableHead>
                      <TableHead className="min-w-[100px]">LinkedIn</TableHead>
                      <TableHead className="min-w-[120px]">Invested Startups</TableHead>
                      <TableHead className="min-w-[150px]">Min-Max Investment</TableHead>
                      <TableHead className="min-w-[150px]">Location</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[80px]">Active</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvestors.map((investor) => (
                      <TableRow 
                        key={investor.id}
                        className="hover:bg-gray-50/50 transition-colors border-gray-100"
                      >
                        <TableCell className="py-3">
                          {investor.avatar ? (
                            <img 
                              src={investor.avatar} 
                              alt={investor.name} 
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full ${getInitialsColor(investor.name).bg} ${getInitialsColor(investor.name).text} flex items-center justify-center font-medium border-2 ${getInitialsColor(investor.name).border}`}>
                              {investor.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">{investor.name}</TableCell>
                        <TableCell className="text-gray-600">{investor.email}</TableCell>
                        <TableCell className="text-gray-600 font-medium">{investor.organization}</TableCell>
                        <TableCell className="font-medium text-green-600">{investor.total_investment}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {investor.investment_focus}
                          </span>
                        </TableCell>
                        <TableCell>
                          {investor.website && (
                            <a 
                              href={investor.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Visit
                            </a>
                          )}
                        </TableCell>
                        <TableCell>
                          {investor.linkedin_url && (
                            <a 
                              href={investor.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Profile
                            </a>
                          )}
                        </TableCell>
                        <TableCell>{investor.invested_startups}</TableCell>
                        <TableCell>{`${investor.minimum_investment} - ${investor.maximum_investment}`}</TableCell>
                        <TableCell>{`${investor.city || ''}, ${investor.country || ''}`}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            investor.status === "verified" 
                              ? "bg-green-50 text-green-700" 
                              : "bg-yellow-50 text-yellow-700"
                          }`}>
                            {investor.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            investor.active 
                              ? "bg-green-50 text-green-700" 
                              : "bg-red-50 text-red-700"
                          }`}>
                            {investor.active ? "Active" : "Inactive"}
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
                              <DropdownMenuItem onClick={() => handleEditClick(investor)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDelete(investor.id)}
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Investor</DialogTitle>
            <DialogDescription>
              Update the investor's information using the form below.
            </DialogDescription>
          </DialogHeader>
          <InvestorForm 
            investor={selectedInvestor || undefined}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['investors'] });
              setIsEditDialogOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
      {showPreview && previewData.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <h2 className="text-2xl font-bold mb-4">Preview Data</h2>
            <div className="overflow-auto max-h-[60vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(previewData[0]).map((header) => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value: any, i) => (
                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {value?.toString() || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkUpload}>
                Confirm Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

