import React, { useEffect, useState } from "react";
import { FaBuilding, FaNetworkWired, FaCloud, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
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
// Helper function to map 'type' to a human-readable format
const getInfraName = (type) => {
  const infraMapping = {
    monolith: 'Monolith',
    highlyavailable: 'Highly Available',
    lightsail: 'Lightsail',
    // Add more mappings if needed
  };

  return infraMapping[type] || 'Unknown'; // Default to 'Unknown' if type is not found
};


const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [deployments, setDeployments] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDeploymentId, setCurrentDeploymentId] = useState(null);
  const token = sessionStorage.getItem('jwtToken');
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    fetchDeployments();
  }, [token, userId]);

  

  const fetchDeployments = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3010/infra-deploy/deployments/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sortedDeployments = response.data.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));
      setDeployments(sortedDeployments);
    } catch (error) {
      console.error('Error fetching deployments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirmation = async () => {
    if (currentDeploymentId) {
      try {
        // API call to delete deployment
        await axios.delete(`http://localhost:3010/infra-deploy`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { deploymentId: currentDeploymentId }
        });
        // Refresh the deployments list after deletion
        fetchDeployments();
      } catch (error) {
        console.error('Error deleting deployment:', error.response.data);
        alert('Failed to delete deployment. ' + error.response.data.message);
      } finally {
        closeDeleteModal();
      }
    }
  };
  
  const openDeleteModal = (deploymentId) => {
    setCurrentDeploymentId(deploymentId);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentDeploymentId(null);
  };

  
  const toggleAccordion = (index) => {
    setDeployments(
      deployments.map((deployment, i) => ({
        ...deployment,
        isOpen: i === index ? !deployment.isOpen : deployment.isOpen
      }))
    );
  };

  return (
    <div className={`p-5 transition-colors duration-500 text-primary-text`}>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>
      <div className="flex justify-center gap-5 mb-10">
        {infrastructureOptions.map((option) => (
          <div key={option.name} className="flex flex-col items-center cursor-pointer" onClick={() => navigate(option.route)}>
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
        <div className="space-y-4 border border-gray-300 shadow-lg p-4 rounded-lg" style={{ minHeight: '500px' }}>
          {deployments.map((deployment, index) => (
            <div key={deployment.id} className="bg-white p-4 rounded-lg shadow border border-gray-300">
              <div onClick={() => toggleAccordion(index)} className="cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h2 className="font-bold text-lg">{deployment.deploymentName}</h2>
                    <span className="ml-2 text-sm bg-gray-200 text-gray-700 rounded-full px-3 py-1">
                {getInfraName(deployment.type)} {/* This line displays the infrastructure name */}
              </span>
                    <div className="ml-2 transform transition-transform duration-200">
                      {deployment.isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">{new Date(deployment.updatedDate).toLocaleString()}</span>
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => openDeleteModal(deployment.id)} />

                  </div>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="font-bold">Region: {deployment.region}</span>
                    {/* <span className="font-bold">Instance Type: {deployment.instanceType}</span> */}
                  </div>
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    deployment.status === 'success' ? 'bg-green-100 text-green-800' :
                    deployment.status === 'failed' ? 'bg-red-100 text-red-800' :
                    deployment.status === 'in progress' ? 'bg-orange-100 text-orange-800' : 'bg-orange-100 text-gray-800'}`}>
                    {deployment.status || 'Unknown'}
                  </span>
                </div>
              </div>
                 {/* Modal for deletion confirmation */}
                 {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full mx-auto">
            <div className="flex justify-end">
              <button onClick={closeDeleteModal} className="text-black text-lg leading-none">×</button>
            </div>
            <h5 className="text-xl font-medium leading-tight mb-4">Confirm Deletion</h5>
            <p className="mb-8">Are you sure you want to delete this deployment?</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-blue-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                onClick={handleDeleteConfirmation}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
              {deployment.isOpen && (
                <div className="mt-4 p-2 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold text-md mb-2 bg-white">Logs:</h3>
                  <div className="text-sm font-mono bg-white p-3 rounded shadow-inner overflow-auto" style={{ maxHeight: "300px", maxWidth: "100%" }}>
                    {deployment.logs.split('\n').map((line, index) => (
                      <div key={index}>
                        <span className="text-blue-600">{line.includes('ERROR') ? '❌' : line.includes('SUCCESS') ? '✅' : 'ℹ️'}</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No deployments found.</p>
      )}
    </div>
  );
};

export default Dashboard;
