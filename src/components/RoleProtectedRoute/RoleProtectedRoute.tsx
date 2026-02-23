import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDefaultDashboardPath } from '../../constants/navigation';
import type { UserRole } from '../../utils/authRole';

interface RoleProtectedRouteProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ requiredRole, children }) => {
  const { isAuthenticated, isAuthLoading, userRole } = useAuth();

  if (isAuthLoading) {
    return <div className="page-content">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to={getDefaultDashboardPath(userRole)} replace />;
  }

  return <>{children}</>;
};
