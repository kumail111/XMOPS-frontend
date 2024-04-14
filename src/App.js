import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Registration from './components/auth/Registration';
import VerifyEmail from './components/auth/VerifyEmail';
import Dashboard from './components/dashboard/Dashboard';
import ForgetPassword from './components/auth/ForgetPassword';
import ConfirmPassword from './components/auth/ConfirmPassword';
import LightsailDeployment from './components/infra/LightsailDeployment';
import MonolithDeployment from './components/infra/MonolithDeployment';
import HighlyavailableDeployment from './components/infra/HighlyavailableDeployment';
import CubeLoader from './components/common/CubeLoader';


import './index.css';
import './tailwind.css';

// Helper function to check if the user is authenticated
const isAuthenticated = () => {
  const token = sessionStorage.getItem('jwtToken');
  return token != null;
};

// Custom Route component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
        <div className="flex flex-col min-h-screen">
          <Header /> {/* No longer need to pass props to Header */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Navigate replace to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/confirm-password" element={<ConfirmPassword />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/lightsail-deployment" element={<PrivateRoute><LightsailDeployment /></PrivateRoute>} />
              <Route path="/monolith-deployment" element={<PrivateRoute><MonolithDeployment /></PrivateRoute>} />
              <Route path="/highlyavailable-deployment" element={<PrivateRoute><HighlyavailableDeployment /></PrivateRoute>} />
              {/* No longer need to pass props to UserProfile */}
            </Routes>
          </main>
          <Footer />
        </div>
    </Router>
  );
}

export default App;
