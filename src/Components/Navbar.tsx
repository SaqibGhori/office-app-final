import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = (value: string) => {
    setDropdownOpen(false);
    const params = new URLSearchParams(location.search);
    params.set('option', value);
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
              Dropdown
              <svg className="w-4 h-4" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 rounded shadow z-10">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <button onClick={() => handleSelect('dashboard')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleSelect('settings')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      Settings
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleSelect('earnings')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      Earnings
                    </button>
                  </li>
                </ul>
                <div className="border-t dark:border-gray-600">
                  <button onClick={() => handleSelect('signout')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </li>

          <li>
            <a href="#" className="hover:text-blue-600">Services</a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">Pricing</a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
