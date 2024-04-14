import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import CubeLoader from '../common/CubeLoader';
import '../../tailwind.css';

const LightsailDeployment = () => {
  const navigate = useNavigate();
  const [awsRegions, setAwsRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [availabilityZones, setAvailabilityZones] = useState([]);
  const [selectedAZ, setSelectedAZ] = useState('');
  const [instanceName, setInstanceName] = useState('');
  const [blueprints, setBlueprints] = useState(['wordpress']); // Assuming fixed blueprint for simplicity
  const [selectedBlueprint, setSelectedBlueprint] = useState('');
  const [instancePlans, setInstancePlans] = useState(['nano', 'micro', 'small']); // Example plans
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAZ, setLoadingAZ] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState('');
  const token = sessionStorage.getItem('jwtToken');
  const userId = sessionStorage.getItem('userId');

  // Redirect to login if no token is present
  useEffect(() => {
    if (!sessionStorage.getItem('jwtToken')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3010/infra-deploy/regions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Regions fetched: ", response.data); // Log the fetched data
        setAwsRegions(response.data);
      } catch (error) {
        console.error('Failed to fetch AWS regions:', error);
        setAwsRegions([]); // Clear regions on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchAZs = async () => {
        if (!selectedRegion) return;
        setLoadingAZ(true);
        try {
            const response = await axios.get(`http://localhost:3010/infra-deploy/azs/${selectedRegion}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvailabilityZones(response.data);
        } catch (error) {
            console.error(`Failed to fetch AZs for region ${selectedRegion}:`, error);
            setAvailabilityZones([]);
        } finally {
            setLoadingAZ(false);
        }
    };

    fetchAZs();
}, [selectedRegion, token]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setShowMessage(false);

    const deploymentData = {
      lightRegion: selectedRegion,
      lightZone: selectedAZ,
      lightBlueprint: selectedBlueprint,
      instancePlan: selectedPlan,
      lightDeploymentName: instanceName,
      userId: userId,
    };

    try {
      // Replace with your actual deployment endpoint
      const { data } = await axios.post('http://localhost:3010/infra-deploy/lightsail', deploymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Deployment initiated successfully!');
      console.log(data);
      setMessageType('success');
      setShowMessage(true);
    } catch (error) {
      console.error('Deployment failed:', error);
      setMessage('Failed to initiate deployment.');
      setMessageType('error');
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };
  const closeMessage = () => {
    setShowMessage(false);
    setMessage('');  // Clear the message
  };


// Inside your LightsailDeployment component return statement

return (
  <div className="form-container mx-auto p-4 bg-page-background dark:bg-page-dark-background">
    <h2 className="text-xl font-bold mb-4">Initiate Lightsail Deployment</h2>
    {loadingAZ && (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <CubeLoader />
  </div>
)}
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Instance Name Input */}
      <div>
        <label htmlFor="instanceName" className="block text-sm font-medium text-gray-700">Instance Name</label>
        <input
          id="instanceName"
          type="text"
          value={instanceName}
          onChange={(e) => setInstanceName(e.target.value)}
          required
          className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
        />
      </div>

      {/* AWS Region Dropdown */}
      <div>
        <label htmlFor="region" className="block text-sm font-medium text-gray-700">AWS Region</label>
        <select
  id="region"
  className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
  value={selectedRegion}
  onChange={(e) => setSelectedRegion(e.target.value)}
  required>
  <option value="">Select a region</option>
  {awsRegions.map((region) => (
    <option key={region} value={region}>{region}</option>
  ))}
</select>
      </div>

      {/* Availability Zone Dropdown */}
      <div>
        <label htmlFor="az" className="block text-sm font-medium text-gray-700">Availability Zone</label>
        <select
          id="az"
          className=" form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          value={selectedAZ}
          onChange={(e) => setSelectedAZ(e.target.value)}
          required>
          <option value="">Select an availability zone</option>
          {availabilityZones.map((az) => (
            <option key={az} value={az}>{az}</option>
          ))}
        </select>
      </div>

      {/* Blueprint Dropdown */}
      <div>
        <label htmlFor="blueprint" className="block text-sm font-medium text-gray-700">Blueprint</label>
        <select
          id="blueprint"
          className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          value={selectedBlueprint}
          onChange={(e) => setSelectedBlueprint(e.target.value)}
          required>
          <option value="">Select a blueprint</option>
          {blueprints.map((blueprint) => (
            <option key={blueprint} value={blueprint}>{blueprint}</option>
          ))}
        </select>
      </div>

      {/* Instance Plan Dropdown */}
      <div>
        <label htmlFor="plan" className="block text-sm font-medium text-gray-700">Instance Plan</label>
        <select
          id="plan"
          className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          required>
          <option value="">Select a plan</option>
          {instancePlans.map((plan) => (
            <option key={plan} value={plan}>{plan}</option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="form-field w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={loading}>
        {loading ? 'Initiating...' : 'Initiate Deployment'}
      </button>
    </form>
    {/* Overlay for messages */}
    {showMessage && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-5 relative w-96 shadow-lg">
          <button 
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" 
            onClick={() => setShowMessage(false)}
          >
            <FiX size={24} />
          </button>
          <p className={`text-lg ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
        </div>
      </div>
    )}
  </div>
);
  
};

export default LightsailDeployment;
