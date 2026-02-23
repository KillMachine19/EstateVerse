import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentSession } from '../services/controllers/authService';
import {
  extractUserRoleFromSession,
  persistUserRole,
  readStoredUserRole,
  type UserRole,
} from '../utils/authRole';

interface AuthContextValue {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  isAuthLoading: boolean;
  refreshSession: () => Promise<{ isAuthenticated: boolean; role: UserRole | null }>;
  setAuthenticated: (value: boolean) => void;
  setUserRole: (role: UserRole | null) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRoleState] = useState<UserRole | null>(readStoredUserRole());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const setAuthenticated = useCallback((value: boolean) => {
    setIsAuthenticated(value);
  }, []);

  const setUserRole = useCallback((role: UserRole | null) => {
    setUserRoleState(role);
    persistUserRole(role);
  }, []);

  const clearAuth = useCallback(() => {
    setIsAuthenticated(false);
    setUserRoleState(null);
    persistUserRole(null);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const session = await getCurrentSession();
      const sessionRole = extractUserRoleFromSession(session) ?? readStoredUserRole();
      setIsAuthenticated(true);
      setUserRoleState(sessionRole);
      persistUserRole(sessionRole);
      return { isAuthenticated: true, role: sessionRole };
    } catch {
      setIsAuthenticated(false);
      setUserRoleState(null);
      persistUserRole(null);
      return { isAuthenticated: false, role: null };
    }
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      setIsAuthLoading(true);
      await refreshSession();
      setIsAuthLoading(false);
    };

    void loadSession();
  }, [refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      userRole,
      isAuthLoading,
      refreshSession,
      setAuthenticated,
      setUserRole,
      clearAuth,
    }),
    [isAuthenticated, userRole, isAuthLoading, refreshSession, setAuthenticated, setUserRole, clearAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
