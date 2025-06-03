import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles = [],
  adminOnly = false 
}) => {
  const { currentUser, isAdmin, isAuthenticated, isLoading, isDemoMode } = useAuth();
  const location = useLocation();

  // In demo mode, all routes are accessible
  if (isDemoMode) {
    return <Outlet />;
  }

  // Show loading state while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-tour-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user has required role
  const hasRequiredRole = adminOnly 
    ? isAdmin 
    : (allowedRoles.length === 0 || (currentUser && allowedRoles.includes(currentUser.role)));

  if (!hasRequiredRole) {
    // User is authenticated but doesn't have the required role
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  // User is authenticated and has the required role
  return <Outlet />;
};

export default ProtectedRoute;
