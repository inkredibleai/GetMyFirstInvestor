import React, { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client'; // Corrected path
import { Button } from '../components/ui/button'; // Corrected path
import { useNavigate } from "react-router-dom";

const TopStartups = () => {
  const [startups, setStartups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStartups = async () => {
      const { data, error } = await supabase
        .from('startups') // Assuming 'startups' is the table name
        .select('*')
        .order('created_at', { ascending: false }) // Fetching the latest startups
        .limit(10); // Limit to top 10 startups

      if (error) {
        console.error('Error fetching startups:', error);
      } else {
        setStartups(data);
      }
    };

    fetchStartups();
  }, []);

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Top Startups</h1>
      <p className="text-lg mb-4">Explore the top startups in various sectors.</p>
      <div className="grid md:grid-cols-3 gap-8">
        {startups.map((startup) => (
          <div key={startup.id} className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-2">{startup.name}</h3>
            <p className="text-gray-600 mb-4">{startup.description}</p>
            <Button onClick={() => navigate(`/startup-details/${startup.id}`)} className="w-full">View Details</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopStartups;
