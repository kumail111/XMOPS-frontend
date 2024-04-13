import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../tailwind.css';

const HighlyAvailableDeployment = () => {
  const navigate = useNavigate();
  // Add a state for each input according to your requirements
  const [vpc, setVpc] = useState('');

  // EC2 State
  const [awsRegion, setAwsRegion] = useState('');
  const [minInstances, setMinInstances] = useState('');
  const [maxInstances, setMaxInstances] = useState('');
  const [ami, setAmi] = useState('');
  const [instanceType, setInstanceType] = useState('');
  const [keyPair, setKeyPair] = useState('');
  const [securityGroups, setSecurityGroups] = useState([]);
  const [storageConfig, setStorageConfig] = useState({ size: 0, type: 'gp2' });

  // RDS State
  const [dbEngine, setDbEngine] = useState('');
  const [engineVersion, setEngineVersion] = useState('');
  const [environment, setEnvironment] = useState('');
  const [specs, setSpecs] = useState({ vCpus: 0, memory: 0, storage: 0 });
  const [availability, setAvailability] = useState('');

  // General State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = sessionStorage.getItem('jwtToken');

  // Handlers
  const handleSubmission = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const deploymentData = {
      ec2: {
        region: awsRegion,
        minInstances,
        maxInstances,
        ami,
        instanceType,
        keyPair,
        securityGroups,
        storage: storageConfig,
      },
      rds: {
        dbEngine,
        engineVersion,
        environment,
        specs,
        availability,
      },
    };

    try {
      
      const { data } = await axios.post('http://localhost:3010/infra-deploy/highly-available', deploymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Highly Available Deployment initiated successfully!');
      console.log(data);
    } catch (error) {
      console.error('Deployment failed:', error);
      setMessage('Failed to initiate deployment. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if no token is present
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="container mx-auto p-4 bg-page-background dark:bg-page-dark-background">
      <h2 className="text-xl font-bold mb-4">Highly Available Deployment</h2>
      {loading && (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      )}
      <form onSubmit={handleSubmission} className="space-y-4">
        
               {/* VPC Configuration */}
               <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">VPC Configuration</h3>
          
          {/* Public and Private Subnets */}
          <div className="mb-4">
            <label htmlFor="publicSubnets" className="block text-sm font-medium text-gray-700">Public Subnets</label>
            <input
              id="publicSubnets"
              type="text"
              placeholder="e.g., subnet-0123456789abcdef0, subnet-0123456789abcdef1"
              className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
              value={vpc.publicSubnets}
              onChange={(e) => setVpc({ ...vpc, publicSubnets: e.target.value.split(',').map(s => s.trim()) })}
            />
            <p className="mt-1 text-sm text-gray-500">Enter comma-separated subnet IDs for public access.</p>
          </div>

          <div className="mb-4">
            <label htmlFor="privateSubnets" className="block text-sm font-medium text-gray-700">Private Subnets</label>
            <input
              id="privateSubnets"
              type="text"
              placeholder="e.g., subnet-0123456789abcdef2, subnet-0123456789abcdef3"
              className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
              value={vpc.privateSubnets}
              onChange={(e) => setVpc({ ...vpc, privateSubnets: e.target.value.split(',').map(s => s.trim()) })}
            />
            <p className="mt-1 text-sm text-gray-500">Enter comma-separated subnet IDs for private access.</p>
          </div>

          {/* Network Configuration */}
          <div className="mb-4">
            <label htmlFor="networkConfig" className="block text-sm font-medium text-gray-700">Network Configuration</label>
            {/* This could be a select input for existing network configurations or additional text inputs */}
            <input
              id="networkConfig"
              type="text"
              placeholder="Enter network configuration details"
              className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
              value={vpc.networkConfig}
              onChange={(e) => setVpc({ ...vpc, networkConfig: e.target.value })}
            />
          </div>
        </div>

      
      {/* EC2 Configuration */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">EC2 Configuration</h3>
        
        {/* AWS Region */}
        <div className="mb-4">
          <label htmlFor="awsRegion" className="block text-sm font-medium text-gray-700">AWS Region</label>
          <select
            id="awsRegion"
            value={awsRegion}
            onChange={(e) => setAwsRegion(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          >
            {/* Populate this select input with actual AWS region options */}
          </select>
        </div>
        
        {/* Minimum Number of Instances */}
        <div className="mb-4">
          <label htmlFor="minInstances" className="block text-sm font-medium text-gray-700">Minimum Number of Instances</label>
          <input
            id="minInstances"
            type="number"
            value={minInstances}
            onChange={(e) => setMinInstances(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          />
        </div>
        
        {/* Maximum Number of Instances */}
        <div className="mb-4">
          <label htmlFor="maxInstances" className="block text-sm font-medium text-gray-700">Maximum Number of Instances</label>
          <input
            id="maxInstances"
            type="number"
            value={maxInstances}
            onChange={(e) => setMaxInstances(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          />
        </div>
        
        {/* AMI */}
        {/* AMI selection would typically be a select input, but here's a text input as a placeholder */}
        <div className="mb-4">
          <label htmlFor="ami" className="block text-sm font-medium text-gray-700">AMI</label>
          <input
            id="ami"
            type="text"
            value={ami}
            onChange={(e) => setAmi(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          />
        </div>
        
        {/* Instance Type */}
        {/* Replace with a select input with instance type options */}
        <div className="mb-4">
          <label htmlFor="instanceType" className="block text-sm font-medium text-gray-700">Instance Type</label>
          <input
            id="instanceType"
            type="text"
            value={instanceType}
            onChange={(e) => setInstanceType(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          />
        </div>
        
        {/* Key Pair */}
        {/* This would usually be a select input if selecting from existing key pairs */}
        <div className="mb-4">
          <label htmlFor="keyPair" className="block text-sm font-medium text-gray-700">Key Pair</label>
          <input
            id="keyPair"
            type="text"
            value={keyPair}
            onChange={(e) => setKeyPair(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          />
        </div>
         {/* Security Group */}
         <div className="mb-4">
          <label htmlFor="securityGroup" className="block text-sm font-medium text-gray-700">Security Group</label>
          <input
            id="securityGroup"
            type="text"
            value={keyPair}
            onChange={(e) => setKeyPair(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            placeholder="Enter security group ID"
          />
          <p className="mt-1 text-sm text-gray-500">Enter security group ID. If you need to specify multiple, separate them with commas.</p>
        </div>
        
        {/* Storage Configuration */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Storage Configuration</label>
          
          {/* Storage Size */}
          <div className="mt-1 mb-2">
            <label htmlFor="storageSize" className="block text-sm font-medium text-gray-700">Size (GiB)</label>
            <input
              id="storageSize"
              type="number"
              value={storageConfig.size}
              onChange={(e) => setStorageConfig({ ...storageConfig, size: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            />
          </div>
          
          {/* Storage Type */}
          <div className="mb-2">
            <label htmlFor="storageType" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="storageType"
              value={storageConfig.type}
              onChange={(e) => setStorageConfig({ ...storageConfig, type: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            >
              <option value="gp2">General Purpose SSD (gp2)</option>
              <option value="gp3">General Purpose SSD (gp3)</option>
              <option value="io1">Provisioned IOPS SSD (io1)</option>
              <option value="io2">Provisioned IOPS SSD (io2)</option>
              <option value="st1">Throughput Optimized HDD (st1)</option>
              <option value="sc1">Cold HDD (sc1)</option>
              {/* Add more storage types as needed */}
            </select>
          </div>
        </div>

        {/* You can now continue with the rest of the form as previously outlined */}

      </div>
         {/* RDS Configuration */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">RDS Configuration</h3>
              {/* DB Engine Type */}
              <div className="mb-4">
          <label htmlFor="dbEngine" className="block text-sm font-medium text-gray-700">DB Engine Type</label>
          <select
            id="dbEngine"
            value={dbEngine}
            onChange={(e) => setDbEngine(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          >
            {/* Populate this select input with actual DB engine options */}
          </select>
        </div>
        
        {/* Engine Version */}
        <div className="mb-4">
          <label htmlFor="engineVersion" className="block text-sm font-medium text-gray-700">Engine Version</label>
          <select
            id="engineVersion"
            value={engineVersion}
            onChange={(e) => setEngineVersion(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          >
            {/* Populate this select input with actual engine version options based on the engine type selected */}
          </select>
        </div>
        
        {/* Environment */}
        <div className="mb-4">
          <label htmlFor="environment" className="block text-sm font-medium text-gray-700">Environment</label>
          <select
            id="environment"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          >
            <option value="production">Production</option>
            <option value="dev">Development</option>
            <option value="test">Test</option>
          </select>
        </div>
        
        {/* Specs */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* vCPUs */}
          <div>
            <label htmlFor="vCpus" className="block text-sm font-medium text-gray-700">vCPUs</label>
            <input
              id="vCpus"
              type="number"
              value={specs.vCpus}
              onChange={(e) => setSpecs({ ...specs, vCpus: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            />
          </div>

          {/* Memory */}
          <div>
            <label htmlFor="memory" className="block text-sm font-medium text-gray-700">Memory (GB)</label>
            <input
              id="memory"
              type="number"
              value={specs.memory}
              onChange={(e) => setSpecs({ ...specs, memory: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            />
          </div>

          {/* Storage */}
          <div>
            <label htmlFor="storage" className="block text-sm font-medium text-gray-700">Storage (GiB)</label>
            <input
              id="storage"
              type="number"
              value={specs.storage}
              onChange={(e) => setSpecs({ ...specs, storage: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            />
          </div>
        </div>
        
        {/* Availability */}
        <div className="mb-4">
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
          <select
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          >
            <option value="">Select Availability</option>
            <option value="multiAz">Multi-AZ</option>
            <option value="noReplicas">No replicas</option>
          </select>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Deploying...' : 'Initiate Deployment'}
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


export default HighlyAvailableDeployment;
