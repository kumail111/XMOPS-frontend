import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Registration from './components/auth/Registration';
import VerifyEmail from './components/auth/VerifyEmail';
import Dashboard from './components/dashboard/Dashboard';
import ForgetPassword from './components/auth/ForgetPassword'; // Import ForgetPassword component
import ConfirmPassword from './components/auth/ConfirmPassword'; // Import ConfirmPassword component
import LightsailDeployment from './components/LightsailDeployment'; // Import LightsailDeployment component
import './index.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forget-password" element={<ForgetPassword />} /> {/* ForgetPassword route */}
            <Route path="/confirm-password" element={<ConfirmPassword />} /> {/* ConfirmPassword route */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lightsail-deployment" element={<LightsailDeployment />} /> {/* Lightsail Deployment route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
