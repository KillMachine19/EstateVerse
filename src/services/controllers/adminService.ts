import apiClient from '../apiClient';

export type AdminDashboardResponse = Record<string, unknown>;

export const getAdminDashboard = async () => {
  const response = await apiClient.get<AdminDashboardResponse>('/api/admin/dashboard');
  return response.data;
};
