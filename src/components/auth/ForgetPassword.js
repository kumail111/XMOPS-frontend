import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5010/auth/forgot-password', { username });
      navigate('/confirm-password'); // Navigate to confirm password page
    } catch (error) {
      setError(error.response.data.message || 'An error occurred');
    }
  };

  return (
    <section className="bg-custom-gray dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow dark:bg-gray-800 p-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">Forget Password</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700">Submit</button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default ForgetPassword;
