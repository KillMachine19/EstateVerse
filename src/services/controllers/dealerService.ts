import apiClient from '../apiClient';

interface DealerApiRecord {
  id?: string;
  email?: string;
  emailId?: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
  verificationStatus?: boolean;
  idProof?: string;
  image?: string | null;
  localities?: string[];
  dealClosedCount?: number;
  aboutTheDealer?: string;
  active?: boolean;
  enabled?: boolean;
}

export interface DealerRecord {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  address: string;
  verificationStatus: boolean;
  idProof: string;
  image: string | null;
  localities: string[];
  dealClosedCount: number;
  aboutTheDealer: string;
  active: boolean;
}

export interface DealerUpsertPayload {
  emailId: string;
  password?: string;
  name: string;
  phoneNumber: string;
  address: string;
  verificationStatus: boolean;
  idProof: string;
  image: string | null;
  localities: string[];
  dealClosedCount: number;
  aboutTheDealer: string;
  forcePasswordReset?: boolean;
}

const normalizeDealer = (payload: DealerApiRecord): DealerRecord => ({
  id: payload.id ?? '',
  email: payload.email ?? payload.emailId ?? '',
  name: payload.name ?? '',
  phoneNumber: payload.phoneNumber ?? '',
  address: payload.address ?? '',
  verificationStatus: Boolean(payload.verificationStatus),
  idProof: payload.idProof ?? '',
  image: payload.image ?? null,
  localities: Array.isArray(payload.localities) ? payload.localities : [],
  dealClosedCount: typeof payload.dealClosedCount === 'number' ? payload.dealClosedCount : 0,
  aboutTheDealer: payload.aboutTheDealer ?? '',
  active: typeof payload.active === 'boolean' ? payload.active : payload.enabled !== false,
});

export const getDealers = async (): Promise<DealerRecord[]> => {
  const response = await apiClient.get<DealerApiRecord[]>('/api/dealers');
  return (response.data ?? []).map((item) => normalizeDealer(item));
};

export const createDealer = async (payload: DealerUpsertPayload): Promise<DealerRecord> => {
  const response = await apiClient.post<DealerApiRecord>('/api/dealers', payload);
  return normalizeDealer(response.data);
};

export const updateDealer = async (dealerId: string, payload: DealerUpsertPayload): Promise<DealerRecord> => {
  const response = await apiClient.put<DealerApiRecord>(`/api/dealers/${dealerId}`, payload);
  return normalizeDealer(response.data);
};

export const revokeDealerAccess = async (dealerId: string): Promise<DealerRecord> => {
  const response = await apiClient.patch<DealerApiRecord>(`/api/admin/access/dealers/${dealerId}/revoke`);
  return normalizeDealer(response.data);
};
