import React, { useEffect, useState } from "react";
import { FaBuilding, FaNetworkWired, FaCloud } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const infrastructureOptions = [
  {
    name: "Monolithic",
    icon: <FaBuilding className="w-10 h-10 text-gray-700" />,
  },
  {
    name: "Highly Available",
    icon: <FaNetworkWired className="w-10 h-10 text-gray-700" />,
  },
  {
    name: "Lightsail Instances",
    icon: <FaCloud className="w-10 h-10 text-gray-700" />,
    route: "/lightsail-deployment", // Add a route to the Lightsail deployment page
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    // If you plan to fetch data based on the selected infrastructure, implement it here
  }, []);

  const handleInfrastructureSelection = (option) => {
    // Navigate to the specified route if it exists, otherwise fetch data based on the selection
    if (option.route) {
      navigate(option.route);
    } else {
      // Fetch and display data related to the selected infrastructure
      console.log(`Fetching data for ${option.name}`);
    }
  };

  return (
    <div className="p-5 bg-[#f4f4f5]">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>

      <div className="flex justify-center gap-5 mb-10">
        {infrastructureOptions.map((option) => (
          <div key={option.name} className="flex flex-col items-center cursor-pointer" onClick={() => handleInfrastructureSelection(option)}>
            <div className="w-20 h-20 flex items-center justify-center bg-white shadow-lg rounded-full text-3xl">
              {option.icon}
            </div>
            <p className="mt-2 text-sm font-semibold">{option.name}</p>
          </div>
        ))}
      </div>

      {isLoading ? <p>Loading...</p> : null}

      {/* Deployment overview and status display */}
    </div>
  );
};

export default Dashboard;
