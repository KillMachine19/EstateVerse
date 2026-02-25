import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiList, FiShield, FiSliders } from 'react-icons/fi';
import './AdminSidebar.css';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: <FiGrid aria-hidden="true" /> },
  { label: 'User Directory', to: '/admin/users', icon: <FiList aria-hidden="true" /> },
  { label: 'Audit Logs', to: '/admin/audit-logs', icon: <FiList aria-hidden="true" /> },
  { label: 'Revoke Access', to: '/admin/revoke-access', icon: <FiShield aria-hidden="true" /> },
  { label: 'System Settings', to: '/admin/settings', icon: <FiSliders aria-hidden="true" /> },
];

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      <div className="admin-sidebar-title">Admin Console</div>
      <nav className="admin-sidebar-nav">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `admin-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <span className="admin-sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
