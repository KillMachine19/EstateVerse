import React from 'react';
import { FiShield } from 'react-icons/fi';
import { AdminShell } from '../../components/AdminComponents/AdminShell';
import './AdminDashboardPage.css';

export const AdminDashboardPage: React.FC = () => {
  return (
    <AdminShell
      title="Admin Dashboard"
      description="Monitor platform activity, user status, and security insights."
      icon={<FiShield aria-hidden="true" />}
    >
      <section className="admin-dashboard-grid">
        <div className="admin-metric-card">
          <p>Active Users</p>
          <h3>1,248</h3>
          <span>+4.2% this week</span>
        </div>
        <div className="admin-metric-card">
          <p>Pending Reviews</p>
          <h3>19</h3>
          <span>3 escalations</span>
        </div>
        <div className="admin-metric-card">
          <p>Flagged Accounts</p>
          <h3>7</h3>
          <span>Needs action</span>
        </div>
      </section>

      <section className="admin-dashboard-panel">
        <h2>Recent Security Events</h2>
        <ul>
          <li>2FA reset requested for user `naddy@gmail.com`</li>
          <li>Password reset for user `finance_admin@estateverse.com`</li>
          <li>New admin login from Mumbai, IN</li>
        </ul>
      </section>
    </AdminShell>
  );
};
