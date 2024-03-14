import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Registration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const registerUser = async () => {
    const url = 'http://localhost:5010/auth/register'; 
    const data = { name: username, email, password, phone: phoneNumber };
    const headers = { 'Content-Type': 'application/json' };

    console.log("Registering user with data:", data); 

    try {
      const response = await axios.post(url, data, { headers });
      if (response.status === 200 || response.status === 201) {
        navigate('/verify-email', {state:data}); // Navigate to email verification page
      } else {
        // Handle any status codes that are not explicitly handled in the catch block
        setError('Registration failed with status: ' + response.status);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    registerUser();
  };

  return (
    <section className="bg-custom-gray dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow dark:bg-gray-800 p-8">
        <form className="space-y-6" onSubmit={onSubmit}>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">Register</h2>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
            <input type="text" id="username" required className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input type="email" id="email" required className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone Number</label>
            <input type="phonenumber" id="phonenumber" required className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
            <input type="password" id="password" required className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700">Register</button>
        </form>
      </div>
    </section>
  );
};

export default Registration;
