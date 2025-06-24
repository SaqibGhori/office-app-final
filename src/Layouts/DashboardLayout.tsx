import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="w-full shadow z-10">
        <Navbar />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar placeholder (uncomment if needed) */}
        {/* 
        <aside className="w-64 bg-gray-800 text-white hidden md:block">
          <Sidebar />
        </aside> 
        */}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
