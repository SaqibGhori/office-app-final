import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  // const { logout } = useAuth();
  // const navigate   = useNavigate();

  // const handleLogout = () => {
  //   logout();
  //   navigate('/login', { replace: true });
  // };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
       <header className="">
       {/* <Navbar /> */}
       {/* <button
         onClick={handleLogout}
         className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
       >
         Logout
       </button> */}
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
