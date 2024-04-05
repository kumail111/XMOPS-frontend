import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LightsailDeployment = () => {
  const [awsRegions, setAwsRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [availabilityZones, setAvailabilityZones] = useState([]);
  const [selectedAZ, setSelectedAZ] = useState('');
  const [instanceName, setInstanceName] = useState('');
  const [blueprints, setBlueprints] = useState(['WordPress']); // Assuming fixed blueprint for simplicity, map this to actual blueprint IDs
  const [selectedBlueprint, setSelectedBlueprint] = useState('WordPress');
  const [instancePlans, setInstancePlans] = useState(['nano', 'micro', 'small']); // Map these to actual bundle IDs
  const [selectedPlan, setSelectedPlan] = useState('');
  const [customerPublicSSHKey, setCustomerPublicSSHKey] = useState(''); // Add this state for SSH key
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(''); // Assuming you're storing the token somewhere

  useEffect(() => {
    // Initialize with static data or fetch from API
    setAwsRegions([
      { id: 'us-east-1', name: 'US East (N. Virginia)' },
      { id: 'us-west-2', name: 'US West (Oregon)' }
    ]);
  }, []);

  useEffect(() => {
    // Adjust based on selected region
    if (selectedRegion === 'us-east-1') {
      setAvailabilityZones(['us-east-1a', 'us-east-1b']);
    } else if (selectedRegion === 'us-west-2') {
      setAvailabilityZones(['us-west-2a', 'us-west-2b']);
    }
  }, [selectedRegion]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const deploymentData = {
      instanceNames: [instanceName],
      availabilityZone: selectedAZ,
      blueprintId: selectedBlueprint,
      keyPairName: customerPublicSSHKey, // Assuming the frontend collects this; otherwise, adjust accordingly
      bundleId: selectedPlan,
    };

    try {
        const response = await axios.post('http://localhost:3010/infra-deploy/deploylightsail', deploymentData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      
        // If the request is successful
        setMessage('Deployment initiated successfully!');
        console.log(response.data);
      } catch (error) {
        // Checking if the error response exists and has a status
        if (error.response) {
          // Specifically checking for a 409 Conflict error
          if (error.response.status === 409) {
            console.error("Conflict error: ", error.response.data);
            setMessage('Deployment failed: ' + error.response.data.message); // Assuming 'message' exists in the response data
          } else {
            // For all other errors with a response from the server
            console.error("Error: ", error.response.data);
            setMessage('Error: ' + error.response.data.message); // Adjust if the server sends a different error structure
          }
        } else {
          // For errors without a response from the server (network errors, etc.)
          console.error("Failed to initiate deployment: ", error);
          setMessage('Failed to initiate deployment.');
        }
      }
       finally {
      setLoading(false);
    }
  };


// Inside your LightsailDeployment component return statement

return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Initiate Lightsail Deployment</h2>
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
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          />
        </div>
        {/* AWS Region Dropdown */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">AWS Region</label>
          <select
            id="region"
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            required>
            <option value="">Select a region</option>
            {awsRegions.map((region) => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </div>
        {/* Availability Zone Dropdown */}
        <div>
          <label htmlFor="az" className="block text-sm font-medium text-gray-700">Availability Zone</label>
          <select
            id="az"
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedAZ}
            onChange={(e) => setSelectedAZ(e.target.value)}
            required>
            <option value="">Select an availability zone</option>
            {availabilityZones.map((az) => (
              <option key={az} value={az}>{az}</option>
            ))}
          </select>
        </div>
        {/* Add SSH Key Input */}
        <div>
          <label htmlFor="customerPublicSSHKey" className="block text-sm font-medium text-gray-700">SSH Key</label>
          <input
            id="customerPublicSSHKey"
            type="text"
            value={customerPublicSSHKey}
            onChange={(e) => setCustomerPublicSSHKey(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          />
        </div>
        {/* Blueprint Dropdown */}
        <div>
          <label htmlFor="blueprint" className="block text-sm font-medium text-gray-700">Blueprint</label>
          <select
            id="blueprint"
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
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
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
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
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}>
          {loading ? 'Initiating...' : 'Initiate Deployment'}
        </button>
      </form>
      {message && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">{message}</p>
        </div>
      )}
    </div>
  );
  
};

export default LightsailDeployment;
