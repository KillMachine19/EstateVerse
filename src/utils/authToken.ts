const AUTH_TOKEN_STORAGE_KEY = 'estateverse_auth_token';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getTokenFromObject = (value: Record<string, unknown>): string | null => {
  const direct = value.token ?? value.accessToken ?? value.jwt ?? value.idToken;
  if (typeof direct === 'string' && direct.trim().length > 0) {
    return direct;
  }

  const data = value.data;
  if (isRecord(data)) {
    const nested = data.token ?? data.accessToken ?? data.jwt ?? data.idToken;
    if (typeof nested === 'string' && nested.trim().length > 0) {
      return nested;
    }
  }

  return null;
};

export const extractAuthToken = (payload: unknown): string | null => {
  if (!isRecord(payload)) {
    return null;
  }

  return getTokenFromObject(payload);
};

const decodeBase64Url = (value: string): string | null => {
  try {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return atob(padded);
  } catch {
    return null;
  }
};

export const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  if (typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  const decoded = decodeBase64Url(parts[1]);
  if (!decoded) {
    return null;
  }

  try {
    const parsed = JSON.parse(decoded);
    if (isRecord(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const readStoredAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  return token && token.trim().length > 0 ? token : null;
};

export const persistAuthToken = (token: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (token && token.trim().length > 0) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
};
