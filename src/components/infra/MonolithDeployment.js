import React, { useState } from 'react';
import axios from 'axios';

const MonolithDeployment = () => {
  const [awsRegions] = useState([
    { id: 'us-east-1', name: 'US East (N. Virginia)' },
    { id: 'us-west-2', name: 'US West (Oregon)' },
  ]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [images] = useState([
    { id: 'ubuntu', name: 'Ubuntu' },
    { id: 'debian', name: 'Debian' },
  ]);
  const [selectedImage, setSelectedImage] = useState('');
  const [instanceTypes] = useState([
    { id: 't2.micro', name: 't2.micro' },
    { id: 't2.small', name: 't2.small' },
  ]);
  const [selectedInstanceType, setSelectedInstanceType] = useState('');
  const [dbTypes] = useState([
    { id: 'mysql', name: 'MySQL' },
    { id: 'postgresql', name: 'PostgreSQL' },
  ]);
  const [selectedDbType, setSelectedDbType] = useState('');
  const [phpVersions] = useState([
    { id: '7.4', name: '7.4' },
    { id: '8.0', name: '8.0' },
  ]);
  const [selectedPhpVersion, setSelectedPhpVersion] = useState('');
  const [serverSoftwares] = useState([
    { id: 'apache', name: 'Apache' },
    { id: 'nginx', name: 'Nginx' },
  ]);
  const [selectedServerSoftware, setSelectedServerSoftware] = useState('');
  const [keyPairName, setKeyPairName] = useState('');
  const [allowSSH, setAllowSSH] = useState(false);
  const [allowHTTP, setAllowHTTP] = useState(false);
  const [storage, setStorage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const deploymentData = {
      region: selectedRegion,
      image: selectedImage,
      instanceType: selectedInstanceType,
      dbType: selectedDbType,
      phpVersion: selectedPhpVersion,
      serverSoftware: selectedServerSoftware,
      keyPairName: keyPairName,
      allowSSH: allowSSH,
      allowHTTP: allowHTTP,
      storage: storage,
    };
      // Retrieve the JWT token
      const token = localStorage.getItem('jwtToken');
      
      if (!token) {
        console.error("JWT token is missing");
        setMessage('Authentication error. Please login again.');
        setLoading(false);
        return;
      }

      try {
        // Replace 'YOUR_BACKEND_API_URL/monolith' with your actual backend API URL
        const response = await axios.get('http://localhost:3000/infra-deploy/monolith', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Handle the response from the backend here
        setMessage('Deployment initiated successfully!');
        console.log(response.data); // Logging the response from the backend
      } catch (error) {
        console.error("Failed to initiate deployment:", error);
        setMessage('Failed to initiate deployment.');
      } finally {
        setLoading(false);
      }
  };
    return (
        <div className="container mx-auto p-4">
          <h2 className="text-xl font-bold mb-4">Initiate Monolith Deployment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* AWS Region Dropdown */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">AWS Region</label>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none">
                <option value="">Select AWS Region</option>
                {awsRegions.map(region => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
            </div>
      
            {/* Image (OS) Dropdown */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image (OS)</label>
              <select
                id="image"
                value={selectedImage}
                onChange={(e) => setSelectedImage(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none">
                <option value="">Select Image (OS)</option>
                {images.map(image => (
                  <option key={image.id} value={image.id}>{image.name}</option>
                ))}
              </select>
            </div>
      
            {/* Instance Type Dropdown */}
            <div>
              <label htmlFor="instanceType" className="block text-sm font-medium text-gray-700">Instance Type</label>
              <select
                id="instanceType"
                value={selectedInstanceType}
                onChange={(e) => setSelectedInstanceType(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none">
                <option value="">Select Instance Type</option>
                {instanceTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
      
            {/* Key Pair Name Input */}
            <div>
  <label htmlFor="keyPairName" className="block text-sm font-medium text-gray-700">Key Pair Name</label>
  <input
    id="keyPairName"
    type="text"
    value={keyPairName}
    onChange={(e) => setKeyPairName(e.target.value)}
    className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" />
</div>
      
            {/* Security Group Settings */}
            <div className="flex items-center">
  <input
    id="allowSSH"
    type="checkbox"
    checked={allowSSH}
    onChange={(e) => setAllowSSH(e.target.checked)}
    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
  <label htmlFor="allowSSH" className="ml-2 block text-sm font-medium text-gray-700">
    Allow SSH
  </label>
</div>
<div className="flex items-center">
  <input
    id="allowHTTP"
    type="checkbox"
    checked={allowHTTP}
    onChange={(e) => setAllowHTTP(e.target.checked)}
    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
  <label htmlFor="allowHTTP" className="ml-2 block text-sm font-medium text-gray-700">
    Allow HTTP
  </label>
</div>
      
            {/* Storage in GiB for EBS Volume */}
            <div>
  <label htmlFor="storage" className="block text-sm font-medium text-gray-700">Storage in GiB</label>
  <input
    id="storage"
    type="number"
    value={storage}
    onChange={(e) => setStorage(e.target.value)}
    className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" />
</div>

      {/* DB Type Dropdown */}
      <div>
        <label htmlFor="dbType" className="block text-sm font-medium text-gray-700">DB Type</label>
        <select
          id="dbType"
          value={selectedDbType}
          onChange={(e) => setSelectedDbType(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none">
          <option value="">Select DB Type</option>
          {dbTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>

      {/* PHP Version Dropdown */}
      <div>
        <label htmlFor="phpVersion" className="block text-sm font-medium text-gray-700">PHP Version</label>
        <select
          id="phpVersion"
          value={selectedPhpVersion}
          onChange={(e) => setSelectedPhpVersion(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none">
          <option value="">Select PHP Version</option>
          {phpVersions.map(version => (
            <option key={version.id} value={version.id}>{version.name}</option>
          ))}
        </select>
      </div>

      {/* Server Software Dropdown */}
      <div>
        <label htmlFor="serverSoftware" className="block text-sm font-medium text-gray-700">Server Software</label>
        <select
          id="serverSoftware"
          value={selectedServerSoftware}
          onChange={(e) => setSelectedServerSoftware(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none">
          <option value="">Select Server Software</option>
          {serverSoftwares.map(software => (
            <option key={software.id} value={software.id}>{software.name}</option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={loading}>
        {loading ? 'Initiating...' : 'Initiate Deployment'}
      </button>
    </form>
    {message && <p className="mt-4 text-center text-sm font-medium">{message}</p>}
  </div>
);
};
export default MonolithDeployment;
      
