// ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  // If children are passed, render them. Else render nested <Outlet />
  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
