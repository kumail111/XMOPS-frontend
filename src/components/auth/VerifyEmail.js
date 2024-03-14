import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const data = location.state;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await verifyUser();
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000); // Auto navigate after success
    } catch (error) {
      console.error('Error verifying email:', error);
      setError(error.message);
    }
  };

  const verifyUser = async () => {
    const url = 'http://localhost:5010/auth/verify';
    const userData = { name: data.name, email: data.email, code };
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await axios.post(url, userData, { headers });
      if (response.status === 200 || response.status === 201) {
        console.log('Email verified successfully!');
      } else {
        setError('Verification failed with status: ' + response.status);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <section className="bg-custom-gray dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md dark:bg-gray-800 p-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">Verify Your Email</h2>
        {!success ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Verification Code</label>
              <input
                type="text"
                id="code"
                autoComplete="off"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700">
              Verify Email
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        ) : (
          <p className="text-green-500 text-center">Email verified successfully! Redirecting to login...</p>
        )}
      </div>
    </section>
  );
};

export default VerifyEmail;
