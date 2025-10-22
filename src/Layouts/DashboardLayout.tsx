// import React from "react";
// import { useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Navbar from "../Components/Navbar";
// import AdminNavbar from "../Components/AdminNavbar";
// import { Outlet } from "react-router-dom";

// const DashboardLayout: React.FC = () => {
//   const { user , role } = useAuth();
//   const location = useLocation();

//   const showUserNavbar = ["/login", "/register"].includes(location.pathname);
//   const hideNavbar = ["/fileview/export", "/alarm-download"].includes(location.pathname);

//   if (hideNavbar) return <main><Outlet/></main>;

//   return (
//     <>
//       {role === "superadmin" ? (
//         <AdminNavbar />
//       ) : (
//         <Navbar isLoggedIn={!!user || showUserNavbar} />
//       )}
//       <main><Outlet/></main>
//     </>
//   );
// };

// export default DashboardLayout;
