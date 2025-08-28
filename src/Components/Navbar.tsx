import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const gatewayId = new URLSearchParams(search).get("gateway");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className=" sticky top-0 z-50 bg-gradient-to-r from-[#BFCBCE] to-primary  ">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">

        {/* LEFT - LOGO */}
        <Link to="/" className="text-xl font-bold text-primary dark:text-white">
          Watt Matrix
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center space-x-6 text-gray-900 dark:text-white font-medium">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/aboutus">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/termsandconditions">Terms And Conditions</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>

          {token && (
            <>
              <li><Link to="/dashboard">Main Dashboard</Link></li>
              {gatewayId && (
                <>
                  <li><Link to={`/maindashboard?gateway=${gatewayId}`}>Dashboard</Link></li>
                  <li><Link to={`/fileview?gateway=${gatewayId}`}>File View</Link></li>
                  <li><Link to={`/alaram?gateway=${gatewayId}`}>Alarms</Link></li>
                </>
              )}
            </>
          )}
        </ul>

        {/* DESKTOP RIGHT BUTTON */}
        <div className="hidden md:block text-gray-900 dark:text-white font-medium">
          {token ? (
            <button onClick={handleLogout} className="hover:text-red-600">
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-blue-600">
              Login
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-900 dark:text-white"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-r from-[#BFCBCE] to-primary dark:bg-gray-800 shadow-lg p-6 flex flex-col space-y-4 z-50 transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-2xl text-primary font-bold mb-4">Menu</h2>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/aboutus" onClick={() => setIsOpen(false)}>About Us</Link>
        <Link to="/contact" onClick={() => setIsOpen(false)}>Contact Us</Link>
        <Link to="/termsandconditions" onClick={() => setIsOpen(false)}>Terms And Conditions</Link>
        <Link to="/privacy" onClick={() => setIsOpen(false)}>Privacy Policy</Link>

        {token && (
          <>
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>Main Dashboard</Link>
            {gatewayId && (
              <>
                <Link to={`/maindashboard?gateway=${gatewayId}`} onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to={`/fileview?gateway=${gatewayId}`} onClick={() => setIsOpen(false)}>File View</Link>
                <Link to={`/alaram?gateway=${gatewayId}`} onClick={() => setIsOpen(false)}>Alarms</Link>
              </>
            )}
          </>
        )}

        <div className="mt-auto">
          {token ? (
            <button onClick={handleLogout} className="text-red-600 font-semibold">
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="text-blue-600 font-semibold">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
