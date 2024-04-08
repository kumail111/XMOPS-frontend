import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../tailwind.css';

const MonolithDeployment = () => {
  const [awsRegions, setAwsRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const osOptions = [
    // 'linux', 
    // 'windows', 
    'al2023', 
    // 'ubuntu', 
    // 'red hat enterprise linux', 
    // 'suse linux enterprise server', 
    // 'debian', 
    // 'centos', 
    // 'fedora', 
    // 'oracle linux'
  ];
  const [selectedOs, setSelectedOs] = useState('');
  const instanceTypes = [
    't2.micro', 
    't3.micro', 
    't3.small', 
    't3.medium', 
    't3.large'
  ];
  const [selectedInstanceType, setSelectedInstanceType] = useState('');
  const dbTypes = [
    'MySQL', 
    'MariaDB'
  ];
  const phpVersions = [
    'PHP 8.0', 
    'PHP 8.1'
  ];
  const serverSoftwares = [
    'Apache', 
    'Nginx'
  ];
  const [selectedDbType, setSelectedDbType] = useState('');
  const [selectedPhpVersion, setSelectedPhpVersion] = useState('');
  const [selectedServerSoftware, setSelectedServerSoftware] = useState('');
  const [keyPairName, setKeyPairName] = useState('');
  const [allowSSH, setAllowSSH] = useState(false);
  const [allowHTTP, setAllowHTTP] = useState(false);
  const [storage, setStorage] = useState(20); // Default storage size
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [deploymentName, setDeploymentName] = useState('');
  const token = sessionStorage.getItem('jwtToken');
  // Helper function for fetching data
  const fetchData = async (url, setter) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const { data } = await axios.get(url, { headers });
      setter(data);
    } catch (error) {
      console.error(`Failed to fetch from ${url}:`, error);
      setter([]);
    }
  };


  useEffect(() => {
    fetchData('http://localhost:3010/infra-deploy/regions', setAwsRegions);
    // OS options are hardcoded, so no need to fetch them
  }, [token]);

  // Fetch EC2 instances based on selected OS
  useEffect(() => {
    if (selectedOs) {
      fetchData(`http://localhost:3010/infra-deploy/ec2-instances/${selectedOs}`, setImages);
    } else {
      setImages([]); // Clear images if no OS is selected
    }
  }, [selectedOs, token]);

  useEffect(() => {
    console.log("this is getting triggered", selectedRegion);
    if (selectedRegion) {
      const fetchAZs = async () => {
        try {
          const response = await axios.get(`http://localhost:3010/infra-deploy/azs/${selectedRegion}?timestamp=123123`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(`Fetching AZs for region: ${selectedRegion}`);
          console.log('AZs response:', response.data);
        } catch (error) {
          console.error(`Failed to fetch AZs for region ${selectedRegion}:`, error);
        }
      };
      fetchAZs();
    } else {
    }
  }, [selectedRegion, token]); // Adding token to dependency array as a best practice
  
  


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const deploymentData = {
      deploymentName: deploymentName,
      region: selectedRegion,
      image: selectedImage,
      instanceType: selectedInstanceType,
      dbType: selectedDbType,
      phpVersion: selectedPhpVersion,
      serverSoftware: selectedServerSoftware,
      keyPairName,
      allowSSH,
      allowHTTP,
      storage,
    };

    try {
      const headers = { Authorization: `Bearer ${token}` };
      setMessage('Deployment initiated successfully!');
      const response = await axios.post('http://localhost:3010/infra-deploy/monolith', deploymentData, { headers });
      console.log('Deployment response:', response.data);
    } catch (error) {
      setMessage('Failed to initiate deployment. Error: ' + (error.response ? error.response.data.message : error.message));
    } finally {
      setLoading(false);
    }
  };
    
    return (
      <div className="container mx-auto p-4">
         <h2 className="text-xl font-bold mb-4">Initiate Monolith Deployment</h2>
     <form onSubmit={handleSubmit} className="space-y-4">

      {/* Deployment Name */}
      <div>
        <label htmlFor="deploymentName" className="block text-sm font-medium text-gray-700">Deployment Name</label>
        <input
          id="deploymentName"
          type="text"
          className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          value={deploymentName}
          onChange={(e) => setDeploymentName(e.target.value)}
          required
        />
      </div>

      {/* AWS Region Dropdown */}
      <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">AWS Region</label>
          <select id="region" className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} required>
            <option value="">Select AWS Region</option>
            {awsRegions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

      {/* Image (OS) Dropdown */}
      <div>
        <label htmlFor="selectedOs" className="block text-sm font-medium text-gray-700">Image OS</label>
        <select
          id="selectedOs"
          className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          value={selectedOs}
          onChange={(e) => setSelectedOs(e.target.value)}
          required>
          <option value="">Select OS Parameter</option>
          {osOptions.map((osOption) => (
            <option key={osOption} value={osOption}>{osOption}</option>
          ))}
        </select>
      </div>
      {/* Image (EC2 AMI) Dropdown */}
<div>
  <label htmlFor="selectedImage" className="block text-sm font-medium text-gray-700">EC2 Image</label>
  <select
    id="selectedImage"
    className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
    value={selectedImage}
    onChange={(e) => setSelectedImage(e.target.value)}
    required>
    <option value="">Select EC2 Image</option>
    {images.map((image) => (
      // Optionally, use image.Description if it's more informative
      <option key={image.ImageId} value={image.ImageId}>{image.Name}</option>
    ))}
  </select>
</div>

      {/* Instance Type Dropdown */}
      {/* Instance Type Dropdown */}
      <div>
        <label htmlFor="instanceType" className="block text-sm font-medium text-gray-700">Instance Type</label>
        <select id="instanceType" className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedInstanceType} onChange={(e) => setSelectedInstanceType(e.target.value)} required>
          <option value="">Select Instance Type</option>
          {instanceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* DB Type Dropdown */}
      <div>
        <label htmlFor="dbType" className="block text-sm font-medium text-gray-700">DB Type</label>
        <select id="dbType" className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedDbType} onChange={(e) => setSelectedDbType(e.target.value)} required>
          <option value="">Select DB Type</option>
          {dbTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* PHP Version Dropdown */}
      <div>
        <label htmlFor="phpVersion" className="block text-sm font-medium text-gray-700">PHP Version</label>
        <select id="phpVersion" className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedPhpVersion} onChange={(e) => setSelectedPhpVersion(e.target.value)} required>
          <option value="">Select PHP Version</option>
{phpVersions.map(version => (
        <option key={version} value={version}>{version}</option>
      ))}
    </select>
  </div>

  {/* Server Software Dropdown */}
  <div>
    <label htmlFor="serverSoftware" className="block text-sm font-medium text-gray-700">Server Software</label>
    <select id="serverSoftware" className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedServerSoftware} onChange={(e) => setSelectedServerSoftware(e.target.value)} required>
      <option value="">Select Server Software</option>
      {serverSoftwares.map(software => (
        <option key={software} value={software}>{software}</option>
      ))}
    </select>
  </div>

  {/* Storage in GiB Input */}
  <div>
    <label htmlFor="storage" className="block text-sm font-medium text-gray-700">Storage in GiB</label>
    <input id="storage" type="number" className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={storage} onChange={(e) => setStorage(e.target.value)} required />
  </div>
      {/* Key Pair Name Input */}
      <div>
        <label htmlFor="keyPairName" className="block text-sm font-medium text-gray-700">Key Pair Name</label>
        <input
          id="keyPairName"
          type="text"
          className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          value={keyPairName}
          onChange={(e) => setKeyPairName(e.target.value)}
          required
        />
      </div> 
      {/* Security Group Settings */}
      <div className="flex gap-4">
        <div className="flex items-center">
          <input
            id="allowSSH"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={allowSSH}
            onChange={(e) => setAllowSSH(e.target.checked)}
          />
          <label htmlFor="allowSSH" className="ml-2 text-sm font-medium text-gray-700">
            Allow SSH
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="allowHTTP"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={allowHTTP}
            onChange={(e) => setAllowHTTP(e.target.checked)}
          />
          <label htmlFor="allowHTTP" className="ml-2 text-sm font-medium text-gray-700">
            Allow HTTP
          </label>
        </div>
      </div>
       

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={loading}>
        {loading ? 'Initiating...' : 'Initiate Deployment'}
      </button>
    </form>
    {loading && (
      <div className="flex justify-center items-center">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    )}
    {message && <p className="mt-4 text-center text-sm font-medium">{message}</p>}
  </div>
);
};
  
export default MonolithDeployment;