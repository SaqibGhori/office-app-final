import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [gateways, setGateways] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch gateways from API
  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const res = await axios.get<string[]>("http://localhost:3000/api/gateways");
        setGateways(res.data);
      } catch (error) {
        console.error("Failed to fetch gateways:", error);
      }
    };

    fetchGateways();
  }, []);

  const handleSelectGateway = (gateway: string) => {
    setDropdownOpen(false);
    const params = new URLSearchParams(location.search);
    params.set('gateway', gateway);
    navigate({ search: params.toString() });
  };

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
          <span className="text-2xl font-semibold dark:text-white">Flowbite</span>
        </div>

        <ul className="flex items-center space-x-6 text-gray-900 dark:text-white font-medium">
          <li>
            <a href="#" className="hover:text-blue-600">Home</a>
          </li>

          <li className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 hover:text-blue-600"
            >
              Select Gateway
              <svg className="w-4 h-4" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-700 rounded shadow z-10 max-h-64 overflow-y-auto">
                {gateways.length > 0 ? (
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    {gateways.map((gateway) => (
                      <li key={gateway}>
                        <button
                          onClick={() => handleSelectGateway(gateway)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          {gateway}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-gray-500 dark:text-gray-300">No gateways found</div>
                )}
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
