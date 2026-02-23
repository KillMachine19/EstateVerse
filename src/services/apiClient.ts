import axios from 'axios';
import type { LeadForm } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Properties
export const getProperties = async () => {
  try {
    const response = await apiClient.get('/api/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getPropertyById = async (id: string) => {
  try {
    const response = await apiClient.get(`/api/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

// Leads
export const submitLead = async (data: LeadForm) => {
  try {
    const response = await apiClient.post('/api/leads', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting lead:', error);
    throw error;
  }
};

// Contact
export const submitContactForm = async (data: LeadForm) => {
  try {
    const response = await apiClient.post('/api/contact', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

export default apiClient;
