import apiClient from '../apiClient';
import { setApiAuthToken } from '../apiClient';
import type { BackendRole } from '../../utils/authRole';
import { decodeJwtPayload, extractAuthToken } from '../../utils/authToken';

export interface AuthCredentials {
  username: string;
  password: string;
}

export type RegisterCredentials = AuthCredentials | (AuthCredentials & { role: BackendRole });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const asBoolean = (value: unknown): boolean | null => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }
  return null;
};

export const shouldForcePasswordReset = (payload: unknown): boolean => {
  if (!isRecord(payload)) {
    return false;
  }

  const directValues = [
    payload.mustResetPassword,
    payload.passwordResetRequired,
    payload.forcePasswordReset,
    payload.firstLogin,
  ];
  for (const value of directValues) {
    const booleanValue = asBoolean(value);
    if (booleanValue !== null) {
      return booleanValue;
    }
  }

  const data = isRecord(payload.data) ? payload.data : null;
  if (data) {
    const nestedValues = [
      data.mustResetPassword,
      data.passwordResetRequired,
      data.forcePasswordReset,
      data.firstLogin,
    ];
    for (const value of nestedValues) {
      const booleanValue = asBoolean(value);
      if (booleanValue !== null) {
        return booleanValue;
      }
    }
  }

  const token = extractAuthToken(payload);
  if (!token) {
    return false;
  }
  const jwtPayload = decodeJwtPayload(token);
  if (!jwtPayload) {
    return false;
  }

  const jwtValues = [
    jwtPayload.mustResetPassword,
    jwtPayload.passwordResetRequired,
    jwtPayload.forcePasswordReset,
    jwtPayload.firstLogin,
  ];
  for (const value of jwtValues) {
    const booleanValue = asBoolean(value);
    if (booleanValue !== null) {
      return booleanValue;
    }
  }

  return false;
};

export const registerUser = async (credentials: RegisterCredentials) => {
  try {
    const response = await apiClient.post('/api/auth/register', credentials);
    const token = extractAuthToken(response.data);
    if (token) {
      setApiAuthToken(token);
    }
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials: AuthCredentials) => {
  try {
    const response = await apiClient.post('/api/auth/login', credentials);
    const token = extractAuthToken(response.data);
    if (token) {
      setApiAuthToken(token);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getCurrentSession = async () => {
  try {
    const response = await apiClient.get('/api/auth/me');
    const token = extractAuthToken(response.data);
    if (token) {
      setApiAuthToken(token);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
};
