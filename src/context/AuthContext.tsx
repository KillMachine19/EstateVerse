import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setApiAuthToken } from '../services/apiClient';
import {
  persistUserRole,
  readStoredUserRole,
  type UserRole,
} from '../utils/authRole';
import { readStoredAuthToken } from '../utils/authToken';

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
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(readStoredAuthToken()));
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
    setApiAuthToken(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const storedRole = readStoredUserRole();
    const hasPersistedToken = Boolean(readStoredAuthToken());

    if (hasPersistedToken) {
      setIsAuthenticated(true);
      setUserRoleState(storedRole);
      return { isAuthenticated: true, role: storedRole };
    }

    setIsAuthenticated(false);
    setUserRoleState(null);
    persistUserRole(null);
    setApiAuthToken(null);
    return { isAuthenticated: false, role: null };
  }, []);

  useEffect(() => {
    const storedRole = readStoredUserRole();
    const hasPersistedToken = Boolean(readStoredAuthToken());
    setIsAuthenticated(hasPersistedToken || Boolean(storedRole));
    setUserRoleState(storedRole);
    setIsAuthLoading(false);
  }, []);

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
