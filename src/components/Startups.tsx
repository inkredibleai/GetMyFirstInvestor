import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { StartupForm } from "./StartupForm";
import { StartupDetails } from "./StartupDetails";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent as AlertDialogContentComponent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Startups = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStartup, setEditingStartup] = useState<any>(null);
  const [deleteStartup, setDeleteStartup] = useState<any>(null);
  const [viewStartup, setViewStartup] = useState<any>(null);

  const { data: startups = [], isLoading } = useQuery({
    queryKey: ['startups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredStartups = startups.filter(startup =>
    startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    startup.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    startup.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (startup: any) => {
    setEditingStartup(startup);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('startups')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      toast.success("Startup deleted successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteStartup(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Startups ({startups.length})</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Startup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Add New Startup</DialogTitle>
            </DialogHeader>
            <StartupForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['startups'] })} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search startups by name, industry or location..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : filteredStartups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No startups found</TableCell>
              </TableRow>
            ) : (
              filteredStartups.map((startup) => (
                <TableRow key={startup.id}>
                  <TableCell className="font-medium">{startup.name}</TableCell>
                  <TableCell>
                    {startup.website && (
                      <a href={startup.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline">
                        Website ↗
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      startup.status === "active" ? "bg-green-100 text-green-800" : 
                      "bg-red-100 text-red-800"
                    }`}>
                      {startup.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewStartup(startup)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(startup)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteStartup(startup)}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* View Details Dialog */}
      <Dialog open={!!viewStartup} onOpenChange={() => setViewStartup(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Startup Details</DialogTitle>
          </DialogHeader>
          {viewStartup && <StartupDetails startup={viewStartup} />}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingStartup} onOpenChange={() => setEditingStartup(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Startup</DialogTitle>
          </DialogHeader>
          <StartupForm 
            startup={editingStartup} 
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['startups'] });
              setEditingStartup(null);
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteStartup} onOpenChange={() => setDeleteStartup(null)}>
        <AlertDialogContentComponent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deleteStartup?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteStartup && handleDelete(deleteStartup.id)}
              className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContentComponent>
      </AlertDialog>
    </div>
  );
};
