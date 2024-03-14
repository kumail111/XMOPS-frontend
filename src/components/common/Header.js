import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from storage
    sessionStorage.removeItem('jwtToken'); // Or localStorage.removeItem('jwtToken');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Xmops Accelerate</h1>
        <nav>
          <ul className="flex gap-4">
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
            {location.pathname === '/dashboard' && (
              <li><button onClick={handleLogout} className="text-sm font-medium text-white hover:underline">Logout</button></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
