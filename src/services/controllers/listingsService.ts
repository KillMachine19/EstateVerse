import apiClient from '../apiClient';

export interface PageableResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ListingRecord {
  id?: string;
  propid?: string;
  projectName?: string;
  details?: string;
  location?: string;
  totalAreaSqFt?: string;
  totalAreaSqM?: string;
  offerAreaSqFt?: string;
  offerAreaSqM?: string;
  areaUnitSelected?: 'sqft' | 'sqm';
  pricePerSqFt?: string;
  pricePerSqM?: string;
  priceUnitSelected?: 'sqft' | 'sqm';
  roiPercent?: string;
  agreementDuration?: string;
  imageIds?: string[];
  mainImageId?: string;
  amenities?: string[];
  latitude?: string;
  longitude?: string;
  shortlistFlag?: boolean;
}

export interface SellerDetailsResponse {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
}

export interface BuyerRecord {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
}

export interface PropertyUpdatePayload {
  projectName: string;
  location: string;
  latitude: string;
  longitude: string;
  totalAreaSqFt: string;
  totalAreaSqM: string;
  offerAreaSqFt: string;
  offerAreaSqM: string;
  areaUnitSelected: 'sqft' | 'sqm';
  pricePerSqFt: string;
  pricePerSqM: string;
  priceUnitSelected: 'sqft' | 'sqm';
  amenities: string[];
  roiPercent: string;
  agreementDuration: string;
  details: string;
  imageIds: string[];
  mainImageId: string;
}

export interface CreateListingPayload extends PropertyUpdatePayload {}

export interface PublicPropertiesQuery {
  page?: number;
  size?: number;
}

const resolveShortlistFlag = (payload: unknown): boolean | undefined => {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }
  const source = payload as Record<string, unknown>;
  const raw = source.shortlistFlag ?? source.isShortlisted ?? source.shortlisted;
  return typeof raw === 'boolean' ? raw : undefined;
};

const toPageable = <T>(payload: unknown, fallbackPage: number, fallbackSize: number): PageableResponse<T> => {
  if (Array.isArray(payload)) {
    return {
      content: payload as T[],
      number: fallbackPage,
      size: fallbackSize,
      totalElements: payload.length,
      totalPages: payload.length > 0 ? 1 : 0,
      first: fallbackPage === 0,
      last: true,
    };
  }

  if (typeof payload === 'object' && payload !== null) {
    const obj = payload as Partial<PageableResponse<T>>;
    if (Array.isArray(obj.content)) {
      return {
        content: obj.content,
        number: typeof obj.number === 'number' ? obj.number : fallbackPage,
        size: typeof obj.size === 'number' ? obj.size : fallbackSize,
        totalElements: typeof obj.totalElements === 'number' ? obj.totalElements : obj.content.length,
        totalPages: typeof obj.totalPages === 'number' ? obj.totalPages : (obj.content.length > 0 ? 1 : 0),
        first: typeof obj.first === 'boolean' ? obj.first : fallbackPage === 0,
        last: typeof obj.last === 'boolean' ? obj.last : true,
      };
    }
  }

  return {
    content: [],
    number: fallbackPage,
    size: fallbackSize,
    totalElements: 0,
    totalPages: 0,
    first: fallbackPage === 0,
    last: true,
  };
};

export const getAllProperties = async (query: PublicPropertiesQuery = {}) => {
  const { page = 0, size = 10 } = query;
  try {
    const response = await apiClient.get('/api/listings', {
      params: { page, size },
    });
    return toPageable<ListingRecord>(response.data, page, size);
  } catch {
    // Some deployments expose /api/listings without pagination query support.
    const fallbackResponse = await apiClient.get('/api/listings');
    return toPageable<ListingRecord>(fallbackResponse.data, page, size);
  }
};

export const shortlistPropertyById = async (propertyId: string): Promise<void> => {
  await apiClient.post(`/api/shortlist/${propertyId}`);
};

export const getShortlistedProperties = async (page = 0, size = 10) => {
  const safeSize = Math.min(size, 10);
  const response = await apiClient.get('/api/shortlist', {
    params: { page, size: safeSize },
  });
  return toPageable<ListingRecord>(response.data, page, safeSize);
};

export const removeShortlistedPropertyById = async (propertyId: string): Promise<void> => {
  await apiClient.delete(`/api/shortlist/${propertyId}`);
};

export const getSellerDetails = async (propertyId: string) => {
  const response = await apiClient.get<SellerDetailsResponse>(`/api/listings/${propertyId}/seller-details`);
  return response.data;
};

export const getListingByIdAuth = async (propertyId: string) => {
  const response = await apiClient.get<ListingRecord>(`/api/listings/${propertyId}`);
  const shortlistFlag = resolveShortlistFlag(response.data);
  return shortlistFlag === undefined ? response.data : { ...response.data, shortlistFlag };
};

export const getListedProperties = async () => {
  const response = await apiClient.get<ListingRecord[]>('/api/seller/listed-properties');
  return response.data;
};

export const updateProperty = async (propertyId: string, payload: PropertyUpdatePayload) => {
  const response = await apiClient.put<ListingRecord>(`/api/seller/properties/${propertyId}`, payload);
  return response.data;
};

export const deletePropertyById = async (propertyId: string): Promise<void> => {
  await apiClient.delete(`/api/seller/properties/${propertyId}`);
};

export const getBuyersWhoShortlistedPropertyById = async (propertyId: string) => {
  const response = await apiClient.get<BuyerRecord[]>(`/api/seller/properties/${propertyId}/shortlisted-buyers`);
  return response.data;
};

export const getBuyerDetailsById = async (buyerId: string) => {
  const response = await apiClient.get<BuyerRecord>(`/api/seller/buyers/${buyerId}`);
  return response.data;
};

export const uploadListingImages = async (images: File[]) => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await apiClient.post<{ imageIds: string[] }>('/api/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const createListing = async (payload: CreateListingPayload) => {
  const response = await apiClient.post<ListingRecord>('/api/listings', payload);
  return response.data;
};
