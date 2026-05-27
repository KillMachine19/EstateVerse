import React from 'react';
import { FiExternalLink, FiMonitor } from 'react-icons/fi';
import { AdminShell } from '../../components/AdminComponents/AdminShell';

const DASHBOARD_URL = (import.meta.env.VITE_ADMIN_DASHBOARD_URL as string | undefined)?.trim() || 'http://localhost:8081';
const AUTH_TOKEN_STORAGE_KEY = 'estateverse_auth_token';
const USER_ROLE_STORAGE_KEY = 'estateverse_user_role';

export const AdminAnalyticsPortalPage: React.FC = () => {
  const buildDashboardUrl = (): string => {
    if (typeof window === 'undefined') {
      return DASHBOARD_URL;
    }

    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    const role = window.localStorage.getItem(USER_ROLE_STORAGE_KEY);
    if (!token) {
      return DASHBOARD_URL;
    }

    const url = new URL(DASHBOARD_URL);
    url.searchParams.set('estateverseToken', token);
    if (role) {
      url.searchParams.set('estateverseRole', role);
    }
    return url.toString();
  };

  const dashboardUrl = buildDashboardUrl();

  return (
    <AdminShell
      title="Advanced Analytics"
      description="Admin-only analytics dashboard integrated with backend metrics."
      icon={<FiMonitor aria-hidden="true" />}
    >
      <div className="property-listing-actions" style={{ marginBottom: '1rem' }}>
        <a href={dashboardUrl} target="_blank" rel="noreferrer" className="property-listing-action-link">
          Open In New Tab
          <FiExternalLink aria-hidden="true" />
        </a>
      </div>

      <div
        style={{
          border: '1px solid #d7ddea',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          backgroundColor: '#fff',
          minHeight: '70vh',
        }}
      >
        <iframe
          src={dashboardUrl}
          title="Admin Analytics Dashboard"
          style={{ width: '100%', height: '70vh', border: '0' }}
          loading="lazy"
        />
      </div>
    </AdminShell>
  );
};
