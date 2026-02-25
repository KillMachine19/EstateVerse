import apiClient from '../apiClient';

export interface ScheduleCallPayload {
  name: string;
  email: string;
  phone: string;
  company: string;
  dateMonth: string;
  dateDay: string;
  timeHour: string;
  timeMinute: string;
  timePeriod: string;
  time: string;
  message: string;
}

export const scheduleCall = async (payload: ScheduleCallPayload) => {
  try {
    const response = await apiClient.post('/api/calls', payload);
    return response.data;
  } catch (error) {
    console.error('Error scheduling call:', error);
    throw error;
  }
};

export const listCalls = async () => {
  try {
    const response = await apiClient.get('/api/calls');
    return response.data;
  } catch (error) {
    console.error('Error fetching calls:', error);
    throw error;
  }
};

export const getCallById = async (id: string) => {
  try {
    const response = await apiClient.get(`/api/calls/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching call by id:', error);
    throw error;
  }
};
