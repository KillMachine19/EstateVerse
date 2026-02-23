import apiClient from '../apiClient';
import type { BackendRole } from '../../utils/authRole';

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  role: BackendRole;
}

export const registerUser = async (credentials: RegisterCredentials) => {
  try {
    const response = await apiClient.post('/api/auth/register', credentials);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials: AuthCredentials) => {
  try {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getCurrentSession = async () => {
  try {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
};
