import { decodeJwtPayload, extractAuthToken } from './authToken';

export type UserRole = 'buyer' | 'seller';
export type BackendRole = 'ADMIN' | 'USER';

export const USER_ROLE_STORAGE_KEY = 'estateverse_user_role';

export const normalizeUserRole = (value: unknown): UserRole | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'buyer' || normalized === 'seller') {
    return normalized;
  }

  if (normalized === 'role_buyer') {
    return 'buyer';
  }

  if (normalized === 'role_seller') {
    return 'seller';
  }

  return null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseAuthorityTokens = (value: unknown): string[] => {
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => parseAuthorityTokens(entry))
      .filter(Boolean);
  }

  if (isRecord(value)) {
    return parseAuthorityTokens(value.authority ?? value.role ?? value.roles);
  }

  return [];
};

const roleFromAuthorities = (authorities: string[]): UserRole | null => {
  for (const authority of authorities) {
    const normalized = authority.trim().toLowerCase();
    if (normalized === 'buyer' || normalized === 'role_buyer') {
      return 'buyer';
    }

    if (normalized === 'seller' || normalized === 'role_seller') {
      return 'seller';
    }
  }

  return null;
};

export const extractUserRoleFromSession = (session: unknown): UserRole | null => {
  if (!isRecord(session)) {
    return null;
  }

  const directRole = normalizeUserRole(session.role);
  if (directRole) {
    return directRole;
  }

  const user = isRecord(session.user) ? session.user : null;
  const userRole = normalizeUserRole(user?.role);
  if (userRole) {
    return userRole;
  }

  const data = isRecord(session.data) ? session.data : null;
  const dataRole = normalizeUserRole(data?.role);
  if (dataRole) {
    return dataRole;
  }

  const authorities = Array.isArray(session.authorities) ? session.authorities : [];
  for (const authority of authorities) {
    const authorityRole = normalizeUserRole(authority);
    if (authorityRole) {
      return authorityRole;
    }

    if (isRecord(authority)) {
      const authorityNameRole = normalizeUserRole(authority.authority);
      if (authorityNameRole) {
        return authorityNameRole;
      }
    }
  }

  const roles = Array.isArray(session.roles) ? session.roles : [];
  for (const role of roles) {
    const parsedRole = normalizeUserRole(role);
    if (parsedRole) {
      return parsedRole;
    }
  }

  const authorityRole = roleFromAuthorities([
    ...parseAuthorityTokens(session.roles),
    ...parseAuthorityTokens(session.authorities),
    ...parseAuthorityTokens(session.scope),
    ...parseAuthorityTokens(session.scopes),
  ]);
  if (authorityRole) {
    return authorityRole;
  }

  const token = extractAuthToken(session);
  if (token) {
    const jwtPayload = decodeJwtPayload(token);
    if (jwtPayload) {
      const jwtRole = roleFromAuthorities([
        ...parseAuthorityTokens(jwtPayload.role),
        ...parseAuthorityTokens(jwtPayload.roles),
        ...parseAuthorityTokens(jwtPayload.authorities),
        ...parseAuthorityTokens(jwtPayload.scope),
        ...parseAuthorityTokens(jwtPayload.scp),
      ]);
      if (jwtRole) {
        return jwtRole;
      }
    }
  }

  return null;
};

export const mapUserRoleToBackendRole = (_role: UserRole): BackendRole => 'USER';

export const readStoredUserRole = (): UserRole | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return normalizeUserRole(window.localStorage.getItem(USER_ROLE_STORAGE_KEY));
};

export const persistUserRole = (role: UserRole | null): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (role) {
    window.localStorage.setItem(USER_ROLE_STORAGE_KEY, role);
    return;
  }

  window.localStorage.removeItem(USER_ROLE_STORAGE_KEY);
};
