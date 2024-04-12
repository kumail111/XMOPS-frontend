import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginUser = async () => {
    const url = 'http://localhost:3010/auth/login';
    const data = {
      username: username,
      email: email,
      password: password
    };
    const headers = {
      'accept': '*/*',
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await axios.post(url, data, { headers });
      
      if(response.status >= 200 && response.status < 300) {
        console.log(response)
        // Assuming the token is returned in the response data under the key 'token'
        const { accessToken, user } = response.data;
        // // Storing the token securely in sessionStorage
        sessionStorage.setItem('jwtToken', accessToken);
        sessionStorage.setItem('userId', user.id);
  
        // // Navigate to dashboard
        navigate('/dashboard');
      } else {
        // Handle non-success status codes appropriately
        setError('Login failed with status: ' + response.status);
      }
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
    }
  };
  

  const onSubmit = async (event) => {
    event.preventDefault();
    await loginUser();
  };

  return (
    <section className="bg-custom-gray dark:bg-custom-dark">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Username</label>
                <input type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Your Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  {/* <div className="flex items-center h-5">
                    <input id="remember-me" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  </div> */}
                  {/* <div className="ml-3 text-sm">
                    <label htmlFor="remember-me" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div> */}
                </div>
                <Link to="/forget-password" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</Link>
              </div>
              <div className="text-center mt-2">
                <Link to="/register" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Don't have an account? Register</Link>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
