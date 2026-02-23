import apiClient from '../apiClient';
import type { LeadForm } from '../../types';

export const submitContactForm = async (data: LeadForm) => {
  try {
    const response = await apiClient.post('/api/contact', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};
