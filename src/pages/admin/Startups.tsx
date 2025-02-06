import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Building2, Trash, Edit } from "lucide-react";

const Startups = () => {
  const { data: startups, isLoading } = useQuery({
    queryKey: ["startups"],
    queryFn: async () => {
      const { data } = await supabase.from("startups").select("*");
      return data || [];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Startups Management
        </h1>
        <Button>Add Startup</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Funding Goal</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {startups?.map((startup: any) => (
            <TableRow key={startup.id}>
              <TableCell>{startup.name}</TableCell>
              <TableCell>{startup.industry}</TableCell>
              <TableCell>{startup.stage}</TableCell>
              <TableCell>{startup.funding_goal}</TableCell>
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

export default Startups;