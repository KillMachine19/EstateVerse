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

  if (normalized === 'admin' || normalized === 'role_admin') {
    return 'buyer';
  }

  if (normalized === 'user' || normalized === 'role_user') {
    return 'seller';
  }

  return null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

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

  return null;
};

export const mapUserRoleToBackendRole = (role: UserRole): BackendRole =>
  role === 'buyer' ? 'ADMIN' : 'USER';

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
