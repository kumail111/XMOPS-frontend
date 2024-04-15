import React, { useEffect, useState } from "react";
import { FaBuilding, FaNetworkWired, FaCloud, FaQuestion, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const infrastructureOptions = [
  {
    name: "Monolithic",
    icon: <FaBuilding className="w-10 h-10 text-gray-700" />,
    route: "/monolith-deployment",
  },
  {
    name: "Highly Available",
    icon: <FaNetworkWired className="w-10 h-10 text-gray-700" />,
    route: "/highlyavailable-deployment",
  },
  {
    name: "Lightsail Instances",
    icon: <FaCloud className="w-10 h-10 text-gray-700" />,
    route: "/lightsail-deployment", 
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [deployments, setDeployments] = useState([]);
  const token = sessionStorage.getItem('jwtToken');
  const userId = sessionStorage.getItem('userId');
  

  function inferInfrastructureType(deployment) {
    // Example conditions that should be specific and exclusive to each deployment type
    if (deployment.instanceType === "t2.micro" && deployment.amiId) {
        return "Monolithic";
    } else if (deployment.allowSSH && deployment.phpVersion) {
        // More specific condition for Highly Available, if possible refine further
        return "Highly Available";
    } else if (deployment.instancePlan && deployment.blueprint) {
        // Assuming Lightsail deployments always have instancePlan and blueprint fields
        return "Lightsail Instances";
    } else {
        return "Unknown";
    }
}



  function handleInfrastructureSelection(option) {
    navigate(option.route);
  }

  useEffect(() => {
    const fetchDeployments = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3010/infra-deploy/deployments/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Deployments:", response.data);
        const deploymentsWithInferredType = response.data.map(deployment => ({
          ...deployment,
          inferredType: inferInfrastructureType(deployment),
          keyPairName: deployment.keyPairName || 'None'
        }));
        setDeployments(deploymentsWithInferredType);
      } catch (error) {
        console.error('Error fetching deployments:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDeployments();
  }, [token, userId, navigate]);

  const toggleAccordion = (index) => {
    setDeployments(
      deployments.map((deployment, i) => {
        if (i === index) {
          deployment.isOpen = !deployment.isOpen;
        } else {
          deployment.isOpen = false;
        }
        return deployment;
      })
    );
  };
    
    return (
      <div className={`p-5 transition-colors duration-500 text-primary-text`}>
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
        {isLoading ? (
          <p>Loading deployments...</p>
        ) : deployments.length > 0 ? (
          <div className="space-y-4">
            {deployments.map((deployment, index) => {
              // Normalize the status here for use in the className logic
              const normalizedStatus = deployment.status ? deployment.status.toLowerCase() : 'unknown';
    
              return (
                <div key={deployment.id} className="bg-white p-4 rounded-lg shadow">
                  <div onClick={() => toggleAccordion(index)} className="cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <h2 className="font-bold text-lg">{deployment.deploymentName}</h2>
                        <span className="ml-2 text-sm bg-gray-200 text-gray-700 rounded-full px-3 py-1">
                          {deployment.inferredType}
                        </span>
                        <div className="ml-2 transform transition-transform duration-200">
                          {deployment.isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">{new Date(deployment.updatedDate).toLocaleString()}</span>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          normalizedStatus === 'success' ? 'bg-green-100 text-green-800' :
                          normalizedStatus === 'failed' ? 'bg-red-100 text-red-800' :
                          normalizedStatus === 'in progress' ? 'bg-orange-100 text-orange-800' : 'bg-orange-100 text-gray-800'}`}>
                          {deployment.status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    <hr className="my-2" />
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>Region: {deployment.region}</span>
                      <span>Instance Type: {deployment.instanceType}</span>
                      <span>Key Pair Name: {deployment.keyPairName || 'None'}</span>
                    </div>
                  </div>
                  {deployment.isOpen && (
                    <div className="mt-4 p-2 bg-gray-100 rounded-lg ">
                      <h3 className="font-semibold text-md mb-2 bg-white">Logs:</h3>
                      <div className="text-sm font-mono bg-white p-3 rounded shadow-inner overflow-auto bg-white" style={{ maxHeight: "300px", minHeight: "200px", maxWidth: "100%" }}>
                        {deployment.logs.split('\n').map((line, index) => (
                          <div key={index}>
                            <span className="text-blue-600">{line.includes('ERROR') ? '❌ ' : line.includes('SUCCESS') ? '✅ ' : 'ℹ️ '}</span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>No deployments found.</p>
        )}
      </div>
    );
    
      
};

export default Dashboard;