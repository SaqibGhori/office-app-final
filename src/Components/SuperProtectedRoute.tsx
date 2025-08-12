import { Navigate, Outlet } from 'react-router-dom';

export default function SuperProtectedRoute() {
  const token = localStorage.getItem('superToken');
  return token
    ? <Outlet />
    : <Navigate to="/superadmin/login" replace />;
}
