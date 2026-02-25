import React from 'react';
import { FiSliders } from 'react-icons/fi';
import { AdminShell } from '../../components/AdminComponents/AdminShell';
import './AdminSettingsPage.css';

export const AdminSettingsPage: React.FC = () => {
  return (
    <AdminShell
      title="System Settings"
      description="Configure platform-wide preferences and compliance defaults."
      icon={<FiSliders aria-hidden="true" />}
    >
      <section className="admin-settings-grid">
        <div className="admin-settings-card">
          <h3>Security Defaults</h3>
          <p>Force MFA for admin accounts, set timeout policy, and manage password rules.</p>
          <button type="button">Review</button>
        </div>
        <div className="admin-settings-card">
          <h3>Verification Rules</h3>
          <p>Define KYC checks, audit thresholds, and auto-revocation rules.</p>
          <button type="button">Configure</button>
        </div>
        <div className="admin-settings-card">
          <h3>Communication</h3>
          <p>Set notification templates, escalation emails, and SLA timings.</p>
          <button type="button">Update</button>
        </div>
      </section>
    </AdminShell>
  );
};
