import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Wrench, Trash, Edit } from "lucide-react";

const Tools = () => {
  const { data: tools, isLoading } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data } = await supabase.from("tools").select("*");
      return data || [];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wrench className="h-6 w-6" />
          Tools Management
        </h1>
        <Button>Add Tool</Button>
      </div>
 
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools?.map((tool: any) => (
            <TableRow key={tool.id}>
              <TableCell>{tool.name}</TableCell>
              <TableCell>{tool.category}</TableCell>
              <TableCell>{tool.description}</TableCell>
              <TableCell>{tool.status}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Tools;