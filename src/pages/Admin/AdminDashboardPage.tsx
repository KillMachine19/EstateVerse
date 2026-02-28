import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FiShield } from 'react-icons/fi';
import { AdminShell } from '../../components/AdminComponents/AdminShell';
import { getAdminDashboard, type AdminDashboardResponse } from '../../services/controllers';
import './AdminDashboardPage.css';

const prettifyKey = (value: string): string => {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const toMetricEntries = (payload: AdminDashboardResponse | null) => {
  if (!payload) {
    return [];
  }
  return Object.entries(payload)
    .filter(([, value]) => typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean')
    .slice(0, 6);
};

const toEvents = (payload: AdminDashboardResponse | null): string[] => {
  if (!payload) {
    return [];
  }
  const candidates = [payload.recentEvents, payload.securityEvents, payload.events];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const strings = candidate.filter((item): item is string => typeof item === 'string');
      if (strings.length > 0) {
        return strings;
      }
    }
  }
  return [];
};

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getAdminDashboard();
        setData(response);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Failed to load admin dashboard.');
        } else {
          setError('Failed to load admin dashboard.');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const metrics = useMemo(() => toMetricEntries(data), [data]);
  const events = useMemo(() => toEvents(data), [data]);

  return (
    <AdminShell
      title="Admin Dashboard"
      description="Monitor platform activity, user status, and security insights."
      icon={<FiShield aria-hidden="true" />}
    >
      {loading ? <p>Loading dashboard...</p> : null}
      {error ? <p className="property-listing-error">{error}</p> : null}

      <section className="admin-dashboard-grid">
        {!loading && !error && metrics.length > 0
          ? metrics.map(([key, value]) => (
              <div key={key} className="admin-metric-card">
                <p>{prettifyKey(key)}</p>
                <h3>{String(value)}</h3>
                <span>From `/api/admin/dashboard`</span>
              </div>
            ))
          : null}
      </section>

      <section className="admin-dashboard-panel">
        <h2>Recent Security Events</h2>
        <ul>
          {!loading && !error && events.length > 0 ? events.map((event) => <li key={event}>{event}</li>) : null}
          {!loading && !error && events.length === 0 ? <li>No recent events returned by API.</li> : null}
        </ul>
      </section>
    </AdminShell>
  );
};
