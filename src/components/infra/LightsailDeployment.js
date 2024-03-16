import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LightsailDeployment = () => {
  const [awsRegions, setAwsRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [availabilityZones, setAvailabilityZones] = useState([]);
  const [selectedAZ, setSelectedAZ] = useState('');
  const [blueprints, setBlueprints] = useState(['WordPress']); // Assuming fixed blueprint for simplicity
  const [selectedBlueprint, setSelectedBlueprint] = useState('WordPress');
  const [instancePlans, setInstancePlans] = useState(['nano', 'micro', 'small']);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch AWS regions
    setAwsRegions([
      { id: 'us-east-1', name: 'US East (N. Virginia)' },
      { id: 'us-west-2', name: 'US West (Oregon)' }
    ]);
    // Simulate fetching instance plans if needed
  }, []);

  useEffect(() => {
    if (selectedRegion === 'us-east-1') {
      setAvailabilityZones(['us-east-1a', 'us-east-1b']);
    } else if (selectedRegion === 'us-west-2') {
      setAvailabilityZones(['us-west-2a', 'us-west-2b']);
    }
  }, [selectedRegion]);
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // Here you would replace with the actual call to your backend to initiate deployment
    console.log({
      region: selectedRegion,
      az: selectedAZ,
      blueprint: selectedBlueprint,
      plan: selectedPlan,
    });
    // Simulating API call response
    setTimeout(() => {
      setLoading(false);
      setMessage('Deployment initiated successfully!');
      // Reset form or handle next steps here
    }, 2000);
  };
  console.log("Selected Region:", selectedRegion, "Availability Zones:", availabilityZones);

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
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </div>
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
        {message && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">{message}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default LightsailDeployment;
  