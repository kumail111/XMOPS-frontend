import React, { useEffect, useState } from "react";
import { FaBuilding, FaNetworkWired, FaCloud } from 'react-icons/fa';
import axios from 'axios';

const infrastructureOptions = [
  {
    name: "Monolithic",
    icon: <FaBuilding className="w-10 h-10 text-gray-700" />,
  },
  {
    name: "Microservices",
    icon: <FaNetworkWired className="w-10 h-10 text-gray-700" />,
  },
  {
    name: "Lightsail Instances",
    icon: <FaCloud className="w-10 h-10 text-gray-700" />,
  },
];

// Simulate deployment status and progress based on the post ID
const getDeploymentStatusAndProgress = (id) => {
  const progressValues = [
    { status: 'Deploying', progress: 25, color: '#f59e0b' }, // Yellow for deploying
    { status: 'In Progress', progress: 50, color: '#3b82f6' }, // Blue for in progress
    { status: 'Completed', progress: 100, color: '#10b981' }, // Green for completed
  ];
  return progressValues[id % 3];
};

const Dashboard = () => {
  const [selectedInfrastructure, setSelectedInfrastructure] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedInfrastructure === "Monolithic") {
        setIsLoading(true);
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
          const enhancedData = response.data.slice(0, 10).map((item, index) => ({
            ...item,
            createdAt: new Date().toISOString(),
            ...getDeploymentStatusAndProgress(item.id),
          }));
          setDeployments(enhancedData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          setDeployments([]);
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedInfrastructure]);

  return (
    <div className="p-5 bg-[#f4f4f5]">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>

      <div className="flex justify-center gap-5 mb-10">
        {infrastructureOptions.map((option) => (
          <div key={option.name} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedInfrastructure(option.name)}>
            <div className="w-20 h-20 flex items-center justify-center bg-white shadow-lg rounded-full text-3xl">
              {option.icon}
            </div>
            <p className="mt-2 text-sm font-semibold">{option.name}</p>
          </div>
        ))}
      </div>

      {isLoading ? <p>Loading...</p> : null}

      <div className="space-y-4">
        {deployments.map((deployment) => (
          <div key={deployment.id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{deployment.title}</p>
              <p>{deployment.body}</p>
              <p className="text-sm text-gray-500">{deployment.status === 'Completed' ? 'Completed on' : 'Deployed on'}: {new Date(deployment.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Status: {deployment.status}</p>
            </div>
            <div style={{ width: '40px', height: '40px' }}>
              <svg viewBox="0 0 36 36" width="100%" height="100%">
                <path className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="#eee" strokeWidth="2.5" />
                <path className="circle"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke={deployment.color} strokeWidth="2.5"
                  strokeDasharray={`${deployment.progress}, 100`} strokeDashoffset="0"
                  transform="rotate(-90 18 18)" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
