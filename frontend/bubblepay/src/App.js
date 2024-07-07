import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // You can use this for custom styles if needed
import Navbar from './components/Navbar'; // Import Navbar component
import Customer from './components/customer/Customer';
import Admin from './components/admin/Admin'; // Import Admin component
import SignIn from './components/SignIn';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <div className="container mx-auto p-4">
          <Routes>
            <Route exact path="/" element={<Customer />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;