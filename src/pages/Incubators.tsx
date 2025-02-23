import React, { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client'; // Corrected path
import { Button } from '../components/ui/button'; // Corrected path
import { useNavigate } from "react-router-dom";

const Incubators = () => {
  const [incubators, setIncubators] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncubators = async () => {
      const { data, error } = await supabase
        .from('incubators') // Assuming 'incubators' is the table name
        .select('*')
        .order('created_at', { ascending: false }); // Fetching incubators

      if (error) {
        console.error('Error fetching incubators:', error);
      } else {
        setIncubators(data);
      }
    };

    fetchIncubators();
  }, []);

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Incubators</h1>
      <p className="text-lg mb-4">Find the right incubator for your startup's growth.</p>
      <div className="grid md:grid-cols-3 gap-8">
        {incubators.map((incubator) => (
          <div key={incubator.id} className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-2">{incubator.name}</h3>
            <p className="text-gray-600 mb-4">{incubator.description}</p>
            <Button onClick={() => navigate(`/incubator-details/${incubator.id}`)} className="w-full">View Details</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Incubators;
