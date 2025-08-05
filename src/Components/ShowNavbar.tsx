import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100">
      <div className="space-x-4">
        <Link to="/"        className="font-medium hover:underline">Home</Link>
        <Link to="/about"   className="font-medium hover:underline">About Us</Link>
        <Link to="/contact" className="font-medium hover:underline">Contact Us</Link>
        <Link to="/privacy" className="font-medium hover:underline">Privacy Policy</Link>
      </div>
      <div className="space-x-2">
        <Link to="/register" className="px-4 py-1 border rounded hover:bg-blue-50">Sign Up</Link>
        <Link to="/login"    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Log In</Link>
      </div>
    </nav>
  );
}
