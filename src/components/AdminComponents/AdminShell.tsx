import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import './AdminShell.css';

interface AdminShellProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({ title, description, icon,children }) => {
  return (
    <section className="admin-shell">
      <div className="admin-shell-container">
        <AdminSidebar />
        <div className="admin-shell-main">
          <div className="admin-shell-card">
            <h1 className="admin-shell-title">
              {icon ? <span className="admin-shell-title-icon">{icon}</span> : null}
              <span>{title}</span>
            </h1>
            <p className="admin-shell-description">{description}</p>
          </div>
          {children ? <div className="admin-shell-content">{children}</div> : null}
        </div>
      </div>
    </section>
  );
};
