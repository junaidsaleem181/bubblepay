import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  // Get the current user from localStorage
  const currentUser = localStorage.getItem('currentUser');
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/signin'); // Redirect to signin page after logout
  };

  return (
    <nav className="bg-gray-800 text-white p-4 fixed w-full top-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className={`text-2xl font-bold tracking-tight ${currentUser ? 'pointer-events-none' : ''}`}>
          Bubble Pay
        </Link>
        <div>
          {currentUser ? (
            // If a user is logged in, show the Logout button
            <button
              onClick={handleLogout}
              className="ml-6 text-lg hover:text-gray-400 transition duration-300 ease-in-out"
            >
              Logout
            </button>
          ) : (
            // Otherwise, show the Customer and Admin links
            <>
              <Link to="/customer" className="ml-6 text-lg hover:text-gray-400 transition duration-300 ease-in-out">
                Customer
              </Link>
              <Link to="/signin" className="ml-6 text-lg hover:text-gray-400 transition duration-300 ease-in-out">
                Admin
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;