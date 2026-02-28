import apiClient from '../apiClient';

export const getProperties = async () => {
  try {
    const response = await apiClient.get('/api/listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getPropertyById = async (id: string) => {
  try {
    const response = await apiClient.get(`/api/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};
