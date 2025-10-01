import React, { useState , useEffect , useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import watticon from '../../assets/watticon.png'
const Navbar: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const gatewayId = new URLSearchParams(search).get("gateway");
  const [isOpen, setIsOpen] = useState(false);

    const [open, setOpen] = useState(false);
  // Parent ko <li> ya <div> jo bhi use kar rahe ho — type match kara do
  const ddRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const targetNode = e.target as Node | null;
      if (ddRef.current && targetNode && !ddRef.current.contains(targetNode)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className=" sticky top-0 z-50 bg-gradient-to-tr from-[#001a33] to-[#02396c]">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">

        {/* LEFT - LOGO */}
        <Link to="/" className='flex justify-center items-center ' >
        <img src={watticon} className='w-14' alt="" />
         <span className="text-xl font-semibold font-sans text-white dark:text-white">Watt Matrix</span> 
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center space-x-6 text-gray-200  font-medium">
          <li><Link to="/">Home</Link></li>
          <li className="relative" ref={ddRef}>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={open}
              className="flex items-center gap-1 rounded-xl px-2 py-2 text-gray-200 hover:bg-[#02396c] hover:text-secondary transition"
            >
              Dropdown
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </button>

            <div
              role="menu"
              className={[
                "absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white shadow-xl",
                "transition transform",
                open
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
                "z-50 overflow-hidden"
              ].join(" ")}
            >
              <Link
              to={"/aboutus"}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-gray-200 bg-[#001a33] hover:bg-[#02396c] hover:text-secondary"
              >
                About Us
              </Link>
              <Link
               to={"/contactus"}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2  text-gray-200 bg-[#001a33] hover:bg-[#02396c] hover:text-secondary"
              >
                Contact Us
              </Link>
              <Link
                to="/termsandconditions"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2  text-gray-200 bg-[#001a33] hover:bg-[#02396c] hover:text-secondary"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                to="/privacy"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2  text-gray-200 bg-[#001a33] hover:bg-[#02396c] hover:text-secondary"
              >
                Privacy Policy
              </Link>
            </div>
          </li>

          {token && (
            <>
              <li><Link to="/dashboard">Main Dashboard</Link></li>
                 <Link to={`/device-settings${gatewayId ? `?gateway=${gatewayId}` : ""}`}>
  Device Settings
</Link>
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
        <div className="hidden md:block text-gray-200  font-medium">
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
          className="md:hidden text-gray-200 "
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
        className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-r  text-gray-200 bg-[#001a33] hover:bg-[#02396c] shadow-lg p-6 flex flex-col space-y-4 z-50 transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-2xl text-gray-200 font-bold mb-4">Menu</h2>
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
