import axios from 'axios';
import { persistAuthToken, readStoredAuthToken } from '../utils/authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const applyBearerToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
};

export const setApiAuthToken = (token: string | null) => {
  applyBearerToken(token);
  persistAuthToken(token);
};

const hydratedToken = readStoredAuthToken();
applyBearerToken(hydratedToken);

export default apiClient;
