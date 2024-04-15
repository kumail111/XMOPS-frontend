import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../tailwind.css';

const HighlyAvailableDeployment = () => {
  const navigate = useNavigate();
  // Add a state for each input according to your requirements

  

  const [deploymentName, setDeploymentName] = useState('');
  const [awsRegions, setAwsRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedInstanceType, setSelectedInstanceType] = useState('');
  const [selectedDBInstanceType, setSelectedDBInstanceType] = useState('');
  const [selectedAZ, setSelectedAZ] = useState('');
  const [availabilityZones, setAvailabilityZones] = useState([]);
  const [keyPairName, setKeyPairName] = useState('');
  const [keyPairId, setKeyPairId] = useState('');


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
  const userId = sessionStorage.getItem('userId');

  const instanceTypes = [
    't2.micro', 
    't3.micro', 
    't3.small', 
    't3.medium', 
    't3.large'
  ];

  // Handlers
  const handleSubmission = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const deploymentData = {
        highDeploymentName: deploymentName,
        "miniInstances": minInstances,
        "maxInstances": maxInstances,
        "highImage": "linux",
        "highInstanceType": selectedInstanceType,
        "highDbInstanceType": selectedDBInstanceType,
        "dbType": "mysql",
        "highKeyPairName": keyPairName,
        "highRegion": selectedRegion,
        "highAZone": selectedAZ,
        "highStorage": storageConfig.type,
        "highDbEngine": "mysql",
        "highEnviroment": "test",
        "highEngVersion": "5.7",
        "userId": userId
      }

      console.log(deploymentData);

    try {
      
      const { data } = await axios.post('http://localhost:3010/infra-deploy/highlyavailable', deploymentData, {
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

  const fetchData = async (url, setter, setLoading = null) => {
    try {
      if (setLoading) setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const { data } = await axios.get(url, { headers });
      setter(data);
    } catch (error) {
      console.error(`Failed to fetch from ${url}:`, error);
      setter([]);
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  // Redirect to login if no token is present
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchData('http://localhost:3010/infra-deploy/regions', setAwsRegions);
    
  }, [token]);

  useEffect(() => {
    const fetchAZs = async () => {
        if (!selectedRegion) return;
        try {
            const response = await axios.get(`http://localhost:3010/infra-deploy/azs/${selectedRegion}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvailabilityZones(response.data);
        } catch (error) {
            console.error(`Failed to fetch AZs for region ${selectedRegion}:`, error);
            setAvailabilityZones([]);
        } finally {
        }
    };

    fetchAZs();
}, [selectedRegion, token]);

const handleGenerateKeyPair = async () => {
  try {
    const response = await axios.post('http://localhost:3010/infra-deploy/create-keypair', {
      keyName: keyPairName,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const {KeyMaterial, KeyPairId} = response.data;
    setKeyPairId(KeyPairId);
    // Trigger file download
    const blob = new Blob([KeyMaterial], { type: 'application/x-pem-file' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${keyPairName}.pem`); // Name the file here
    document.body.appendChild(link);
    link.click();
    link.remove();
    setMessage('Key pair generated and downloaded successfully.');
  } catch (error) {
    console.error('Error generating key pair:', error);
    setMessage('Failed to generate key pair.');
  }
};

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

        {/* Deployment Name */}
      <div>
        <label htmlFor="deploymentName" className="block text-sm font-medium text-gray-700">Deployment Name</label>
        <input
          id="deploymentName"
          type="text"
          className="form-field  mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          value={deploymentName}
          onChange={(e) => setDeploymentName(e.target.value)}
          required
        />
        </div>

      
      {/* EC2 Configuration */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">EC2 Configuration</h3>
        
        {/* AWS Region */}
        <div className="mb-4">
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">AWS Region</label>
          <select id="region" className=" form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} required>
            <option value="">Select AWS Region</option>
            {awsRegions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        </div>

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
        <div>
        <label htmlFor="instanceType" className="block text-sm font-medium text-gray-700">Instance Type</label>
        <select id="instanceType" className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedInstanceType} onChange={(e) => setSelectedInstanceType(e.target.value)} required>
          <option value="">Select Instance Type</option>
          {instanceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="instanceType" className="block text-sm font-medium text-gray-700">DB Instance Type</label>
        <select id="instanceType" className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedDBInstanceType} onChange={(e) => setSelectedDBInstanceType(e.target.value)} required>
          <option value="">Select DB Instance Type</option>
          {instanceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
        
        <label htmlFor="keyPairName" className="block text-sm font-medium text-gray-700">Key Pair Name</label>
        <div className="relative">
          <input
            id="keyPairName"
            type="text"
            className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none pl-12"
            value={keyPairName}
            onChange={(e) => setKeyPairName(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-r-md focus:outline-none"
            onClick={handleGenerateKeyPair}
            disabled={loading}
          >
            Generate
          </button>
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
            <option value="MySQL">MySQL</option>
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
            <option value="5.7">5.7</option>
            <option value="8.0">8.0</option>
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
          {/* <div>
            <label htmlFor="vCpus" className="block text-sm font-medium text-gray-700">vCPUs</label>
            <input
              id="vCpus"
              type="number"
              value={specs.vCpus}
              onChange={(e) => setSpecs({ ...specs, vCpus: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            />
          </div> */}

          {/* Memory */}
          {/* <div>
            <label htmlFor="memory" className="block text-sm font-medium text-gray-700">Memory (GB)</label>
            <input
              id="memory"
              type="number"
              value={specs.memory}
              onChange={(e) => setSpecs({ ...specs, memory: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            />
          </div> */}

          {/* Storage */}
          {/* <div>
            <label htmlFor="storage" className="block text-sm font-medium text-gray-700">Storage (GiB)</label>
            <input
              id="storage"
              type="number"
              value={specs.storage}
              onChange={(e) => setSpecs({ ...specs, storage: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            />
          </div> */}
        </div>
        
        {/* Availability */}
        {/* <div className="mb-4">
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
        </div> */}
        
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
