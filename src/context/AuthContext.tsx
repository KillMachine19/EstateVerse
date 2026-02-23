import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentSession } from '../services/controllers/authService';

interface AuthContextValue {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  refreshSession: () => Promise<boolean>;
  setAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const setAuthenticated = useCallback((value: boolean) => {
    setIsAuthenticated(value);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      await getCurrentSession();
      setIsAuthenticated(true);
      return true;
    } catch {
      setIsAuthenticated(false);
      return false;
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
    () => ({ isAuthenticated, isAuthLoading, refreshSession, setAuthenticated }),
    [isAuthenticated, isAuthLoading, refreshSession, setAuthenticated]
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
