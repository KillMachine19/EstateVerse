import React from 'react';
import { FiUserX } from 'react-icons/fi';
import { AdminShell } from '../../components/AdminComponents/AdminShell';
import './AdminRevokeAccessPage.css';

export const AdminRevokeAccessPage: React.FC = () => {
  return (
    <AdminShell
      title="Revoke User Access"
      description="Review users that need to be suspended or re-verified. Actions will be wired later."
      icon={<FiUserX aria-hidden="true" />}
    >
      <section className="admin-revoke-panel">
        <div className="admin-revoke-header">
          <h2>Pending Actions</h2>
          <button type="button" className="admin-revoke-filter">Filter</button>
        </div>
        <div className="admin-revoke-table">
          <div className="admin-revoke-row admin-revoke-row--head">
            <span>User</span>
            <span>Reason</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {['naddy@gmail.com', 'leasing.team@estateverse.com', 'ops@estateverse.com'].map((user) => (
            <div key={user} className="admin-revoke-row">
              <span>{user}</span>
              <span>Verification failed</span>
              <span className="admin-revoke-tag">Review</span>
              <button type="button" className="admin-revoke-button">Revoke</button>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
};
