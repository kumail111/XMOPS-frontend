import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import CubeLoader from '../common/CubeLoader'; 

import '../../tailwind.css';


const MonolithDeployment = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [awsRegions, setAwsRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false); 
  const [selectedImage, setSelectedImage] = useState('');
  const userId = sessionStorage.getItem('userId');

  const osOptions = [
// 'linux', 
    // 'windows', 
    'amazon linux', 
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
    '8.1', 
    '8.2'
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
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState('');
  const [deploymentName, setDeploymentName] = useState('');
  const [keyPairId, setKeyPairId] = useState('');
  const token = sessionStorage.getItem('jwtToken');
  
  // Helper function for fetching data
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
  useEffect(() => {
    // Redirect to login if no token found on component mount
    if (!sessionStorage.getItem('jwtToken')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchData('http://localhost:3010/infra-deploy/regions', setAwsRegions);
    
  }, [token]);

  // Fetch EC2 instances based on selected OS
  useEffect(() => {
    if (selectedOs) {
      setLoadingImages(true); // Set loading to true before the fetch operation begins
      fetchData(`http://localhost:3010/infra-deploy/ec2-instances/${selectedOs}`, data => {
        setImages(data);
        setLoadingImages(false); // Set loading to false after the fetch operation is complete
      });
    } else {
      setImages([]); // Clear images if no OS is selected
    }
  }, [selectedOs, token]);

  
  // Add this function to handle generating and downloading the key pair
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
      keyPairId,
      allowSSH,
      allowHTTP,
      storage,
      userId
    };

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post('http://localhost:3010/infra-deploy/monolith', deploymentData, { headers });
      console.log(response.data);
      setMessage('Deployment initiated successfully!');
      setMessageType('success');
      setShowMessage(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setMessage('Failed to initiate deployment. Error: ' + (error.response ? error.response.data.message : error.message));
      setMessageType('error');
      
    } finally {
      setShowMessage(true);
      setLoading(false);
    }
  };
  const isLoading = loadingImages;
  const closeMessage = () => {
    setShowMessage(false);
    setMessage(''); // Clear the message to avoid showing it below the button
  };

    return (
      <div className="form-container mx-auto p-4 bg-page-background">
{/* Loader Overlay */}
{(loading || loadingImages) && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <CubeLoader />
      </div>
    )}


         <h2 className="text-xl font-bold mb-4">Initiate Monolith Deployment</h2>
     <form onSubmit={handleSubmit} className="space-y-4 bg-white ">

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

      {/* AWS Region Dropdown */}
      <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">AWS Region</label>
          <select id="region" className=" form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} required>
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
          className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
          value={selectedOs}
          onChange={(e) => setSelectedOs(e.target.value)}
          required
        >
          <option value="">Select OS Parameter</option>
          {osOptions.map((osOption) => (
            <option key={osOption} value={osOption}>{osOption}</option>
          ))}
        </select>
      </div>
      {/* Image (EC2 AMI) Dropdown */}
      <div>
        <label htmlFor="selectedImage" className="block text-sm font-medium text-gray-700">EC2 Image</label>
        {/* {loadingImages ? (
          <div>Loading EC2 images...</div>
        ) : ( */}
          <select
            id="selectedImage"
            className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={selectedImage}
            onChange={(e) => setSelectedImage(e.target.value)}
            required
          >
            <option value="">Select EC2 Image</option>
            {images.map((image) => (
              <option key={image.ImageId} value={image.ImageId}>{image.Name}</option>
            ))}
          </select>
        {/* )} */}
      </div>

      
      {/* Instance Type Dropdown */}
      <div>
        <label htmlFor="instanceType" className="block text-sm font-medium text-gray-700">Instance Type</label>
        <select id="instanceType" className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedInstanceType} onChange={(e) => setSelectedInstanceType(e.target.value)} required>
          <option value="">Select Instance Type</option>
          {instanceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* DB Type Dropdown */}
      <div>
        <label htmlFor="dbType" className="block text-sm font-medium text-gray-700">DB Type</label>
        <select id="dbType" className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedDbType} onChange={(e) => setSelectedDbType(e.target.value)} required>
          <option value="">Select DB Type</option>
          {dbTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* PHP Version Dropdown */}
      <div>
        <label htmlFor="phpVersion" className="block text-sm font-medium text-gray-700">PHP Version</label>
        <select id="phpVersion" className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedPhpVersion} onChange={(e) => setSelectedPhpVersion(e.target.value)} required>
          <option value="">Select PHP Version</option>
{phpVersions.map(version => (
        <option key={version} value={version}>{version}</option>
      ))}
    </select>
  </div>

  {/* Server Software Dropdown */}
  <div>
    <label htmlFor="serverSoftware" className="block text-sm font-medium text-gray-700">Server Software</label>
    <select id="serverSoftware" className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={selectedServerSoftware} onChange={(e) => setSelectedServerSoftware(e.target.value)} required>
      <option value="">Select Server Software</option>
      {serverSoftwares.map(software => (
        <option key={software} value={software}>{software}</option>
      ))}
    </select>
  </div>

  {/* Storage in GiB Input */}
  <div>
    <label htmlFor="storage" className="block text-sm font-medium text-gray-700">Storage in GiB</label>
    <input id="storage" type="number" className="form-field mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={storage} onChange={(e) => setStorage(e.target.value)} required />
  </div>
  
  <div className="relative mb-4">
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
          {/* Overlay for messages */}
          {showMessage && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-5 relative w-96 shadow-lg">
      <button 
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" 
        onClick={closeMessage}
      >
        <FiX size={24} />
      </button>
      <p className={`text-lg ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
    </div>
  </div>
)}

      {/* Submit Button */}
      <button
        type="submit"
        className="form-field w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={loading}
      >
        {loading ? 'Initiating...' : 'Initiate Deployment'}
      </button>
    </form>
    {/* {loading && (
      <div className="flex justify-center items-center">
        <div className="loader"></div>
      </div>
    )} */}
    {message && <p className="mt-4 text-center text-sm font-medium">{message}</p>}
  </div>
);
};
  
export default MonolithDeployment;