import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  // 1. Still checking localStorage → show loading screen
  if (loading) {
    return <div>Loading...</div>; // or spinner component
  }

  // 2. If not logged in → go to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If logged in but role doesn't match → unauthorized page
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. All good → show the protected children
  return <>{children}</>;
};

export default ProtectedRoute;
