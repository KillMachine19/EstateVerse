import apiClient from '../apiClient';
import type { LeadForm } from '../../types';

export const submitLead = async (data: LeadForm) => {
  try {
    const response = await apiClient.post('/api/leads', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting lead:', error);
    throw error;
  }
};
