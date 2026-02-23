import apiClient from '../apiClient';

export interface AuthCredentials {
  username: string;
  password: string;
}

export const registerUser = async (credentials: AuthCredentials) => {
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
