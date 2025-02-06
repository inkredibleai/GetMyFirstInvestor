import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Users, Trash, Edit } from "lucide-react";

const Investors = () => {
  const { data: investors, isLoading } = useQuery({
    queryKey: ["investors"],
    queryFn: async () => {
      const { data } = await supabase.from("investors").select("*");
      return data || [];
    },
  });
 
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Investors Management
        </h1>
        <Button>Add Investor</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Investment Range</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investors?.map((investor: any) => (
            <TableRow key={investor.id}>
              <TableCell>{investor.full_name}</TableCell>
              <TableCell>{investor.email}</TableCell>
              <TableCell>{investor.investment_range}</TableCell>
              <TableCell>{investor.status}</TableCell>
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

export default Investors;