import React from 'react';
import { FiUsers } from 'react-icons/fi';
import { AdminShell } from '../../components/AdminComponents/AdminShell';
import './AdminUsersPage.css';

export const AdminUsersPage: React.FC = () => {
  return (
    <AdminShell
      title="User Directory"
      description="Review registered users, their status, and activity snapshots."
      icon={<FiUsers aria-hidden="true" />}
    >
      <section className="admin-users-panel">
        <div className="admin-users-header">
          <h2>All Users</h2>
          <div className="admin-users-actions">
            <input type="search" placeholder="Search user/email" />
            <button type="button">Export</button>
          </div>
        </div>
        <div className="admin-users-table">
          <div className="admin-users-row admin-users-row--head">
            <span>User</span>
            <span>Role</span>
            <span>Status</span>
            <span>Last Active</span>
          </div>
          {[
            { user: 'naddy@gmail.com', role: 'ROLE_ADMIN', status: 'Active', time: '2 hours ago' },
            { user: 'leasing.team@estateverse.com', role: 'ROLE_USER', status: 'Active', time: 'Yesterday' },
            { user: 'ops@estateverse.com', role: 'ROLE_USER', status: 'Pending', time: '3 days ago' },
          ].map((row) => (
            <div key={row.user} className="admin-users-row">
              <span>{row.user}</span>
              <span>{row.role}</span>
              <span className={`admin-users-tag ${row.status === 'Active' ? 'is-active' : ''}`}>{row.status}</span>
              <span>{row.time}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
};
