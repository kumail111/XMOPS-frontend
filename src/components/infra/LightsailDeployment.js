import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LightsailDeployment = () => {
  const [awsRegions, setAwsRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [blueprints, setBlueprints] = useState([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState('');
  const [instancePlans, setInstancePlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Mock fetching AWS regions and instance plans
    setAwsRegions(['us-east-1', 'us-west-2']);
    setInstancePlans(['nano', 'micro', 'small']);
  }, []);

  useEffect(() => {
    // Mock fetching blueprints based on selected region
    if (selectedRegion) {
      setBlueprints(['WordPress', 'LAMP Stack', 'Node.js']);
    }
  }, [selectedRegion]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Replace with your backend endpoint
      const response = await axios.post('YOUR_BACKEND_ENDPOINT', {
        region: selectedRegion,
        blueprint: selectedBlueprint,
        plan: selectedPlan,
      });
      setMessage('Deployment initiated successfully!');
    } catch (error) {
      setMessage('Failed to initiate deployment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Initiate Lightsail Deployment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
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
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}>
          {loading ? 'Initiating...' : 'Initiate Deployment'}
        </button>
      </form>
      {message && <p className="mt-4 text-center font-medium">{message}</p>}
    </div>
  );
};

export default LightsailDeployment;

