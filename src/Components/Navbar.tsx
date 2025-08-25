import { } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const { search } = useLocation();
  const gatewayId = new URLSearchParams(search).get("gateway");

  return (
    <nav className="bg-gradient-to-r from-[#BFCBCE] to-[#303655ac]">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">

        <ul className="flex items-center space-x-6 text-gray-900 dark:text-white font-medium  " >

          {/* Always visible */}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/aboutus">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/termsandconditions">Terms And Conditions</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>

          {/* Only show if logged in */}
          {token && (
            <>
              <li>
                <Link to={`/dashboard`} className="">Main Dashboard</Link>
              </li>
              {gatewayId ?
                <>
                  <Link to={`/maindashboard${gatewayId ? `?gateway=${gatewayId}` : ""}`}>
                    Dashboard
                  </Link>
                  <Link to={`/fileview${gatewayId ? `?gateway=${gatewayId}` : ""}`} >
                    File View
                  </Link>
                  <Link to={`/alaram${gatewayId ? `?gateway=${gatewayId}` : ""}`}>
                    Alarms
                  </Link>
                </>
                : null
              }
            </>
          )}


        </ul>

        
    {/* RIGHT SIDE: Logout or Login */}
    <div className="text-gray-900 dark:text-white font-medium">
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

      </div>
    </nav>
  );
};

export default Navbar;
