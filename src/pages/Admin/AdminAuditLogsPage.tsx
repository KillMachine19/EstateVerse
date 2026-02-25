import React from 'react';
import { FiActivity } from 'react-icons/fi';
import { AdminShell } from '../../components/AdminComponents/AdminShell';
import './AdminAuditLogsPage.css';

export const AdminAuditLogsPage: React.FC = () => {
  return (
    <AdminShell
      title="Audit Logs"
      description="Track sensitive events, admin actions, and security-critical activity."
      icon={<FiActivity aria-hidden="true" />}
    >
      <section className="admin-audit-panel">
        <div className="admin-audit-header">
          <h2>Recent Events</h2>
          <button type="button">Download</button>
        </div>
        <div className="admin-audit-table">
          <div className="admin-audit-row admin-audit-row--head">
            <span>Event</span>
            <span>Actor</span>
            <span>Time</span>
          </div>
          {[
            { event: 'User access revoked', actor: 'naddy@gmail.com', time: '10 min ago' },
            { event: 'Password reset approved', actor: 'security@estateverse.com', time: '1 hour ago' },
            { event: 'Admin role granted', actor: 'ops@estateverse.com', time: 'Yesterday' },
          ].map((row) => (
            <div key={`${row.event}-${row.actor}`} className="admin-audit-row">
              <span>{row.event}</span>
              <span>{row.actor}</span>
              <span>{row.time}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
};
