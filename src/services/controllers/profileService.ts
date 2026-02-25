import apiClient from '../apiClient';

export interface ProfileResponse {
  id: string;
  username: string;
  enabled: boolean;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
}

export interface ProfileUpdateRequest {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
}

export interface PasswordUpdateRequest {
  oldPassword: string;
  newPassword: string;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.get('/api/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = async (payload: ProfileUpdateRequest): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.put('/api/profile', payload);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const updatePassword = async (payload: PasswordUpdateRequest): Promise<void> => {
  try {
    await apiClient.put('/api/profile/password', payload);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};
