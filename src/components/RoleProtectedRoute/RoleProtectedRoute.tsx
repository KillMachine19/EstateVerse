import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDefaultDashboardPath } from '../../constants/navigation';
import type { UserRole } from '../../utils/authRole';

interface RoleProtectedRouteProps {
  requiredRole?: UserRole;
  children: React.ReactNode;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ requiredRole, children }) => {
  const { isAuthenticated, isAuthLoading, userRole } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <div className="page-content">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  const forceResetPassword = typeof window !== 'undefined' && window.localStorage.getItem('estateverse_force_password_reset') === 'true';
  if (forceResetPassword && location.pathname !== '/reset-password') {
    return <Navigate to="/reset-password?firstLogin=true" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={getDefaultDashboardPath(userRole)} replace />;
  }

  return <>{children}</>;
};
