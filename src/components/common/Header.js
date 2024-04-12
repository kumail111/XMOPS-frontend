import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiArrowRight } from 'react-icons/fi';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear(); // This will clear the session storage including the user data
    navigate('/login'); // Redirect to login page
  };

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
  const closeDropdown = () => setIsDropdownOpen(false); // Function to close the dropdown

  // Retrieve user data from sessionStorage
  const userName = sessionStorage.getItem('userName');
  const userEmail = sessionStorage.getItem('userEmail');

  const isAuthRoute = location.pathname === '/login' ||
                      location.pathname === '/register' ||
                      location.pathname === '/forget-password' ||
                      location.pathname === '/verify-email';

  const isDashboardOrInfra = location.pathname === '/dashboard' ||
                             location.pathname.includes('/monolith') ||
                             location.pathname.includes('/highlyavailable') ||
                             location.pathname.includes('/lightsail');

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Xmops Accelerate</h1>
        {!isAuthRoute && (
          <nav>
            <ul className="flex gap-4">
              {isDashboardOrInfra && (
                <li className="relative">
                  <button onClick={toggleDropdown} className="hover:underline focus:outline-none">
                    Account
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-blue-600 rounded-md shadow-xl z-50">
                      <button onClick={closeDropdown} className="absolute top-0 right-0 p-2 text-white text-lg">
                        ×
                      </button>
                      <div className="pt-8 px-4 pb-2">
                        <span className="block py-2 text-sm capitalize text-white border-b border-white">Name: {userName}</span>
                        <span className="block py-2 text-sm text-white border-b border-white">Email: {userEmail}</span>
                        <Link to="/dashboard" className="block py-2 text-sm text-white hover:bg-blue-700 flex items-center border-b border-white">
                          <FiArrowRight className="mr-2" /> View Deployments
                        </Link>
                        <button onClick={handleLogout} className="block py-2 text-sm text-white hover:bg-blue-700 flex items-center w-full text-left">
                          <FiLogOut className="mr-2" /> Log out
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
