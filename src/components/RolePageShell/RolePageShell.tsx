import React from 'react';
import './RolePageShell.css';

interface RolePageShellProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const RolePageShell: React.FC<RolePageShellProps> = ({ title, description, children }) => {
  return (
    <section className="role-page-shell">
      <div className="role-page-shell__card">
        <h1 className="role-page-shell__title">{title}</h1>
        <p className="role-page-shell__description">{description}</p>
      </div>
      {children ? <div className="role-page-shell__content">{children}</div> : null}
    </section>
  );
};
