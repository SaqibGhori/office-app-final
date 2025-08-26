import { Navigate, Outlet } from 'react-router-dom';

export default function SuperProtectedRoute() {
  const token = localStorage.getItem('token');
  return token
    ? <Outlet />
    : <Navigate to="/superadmin/login" replace />;
}
