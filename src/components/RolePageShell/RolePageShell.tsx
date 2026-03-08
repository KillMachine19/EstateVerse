import React from 'react';
import { BuyerSidebar } from '../BuyerComponents/BuyerSidebar';
import { AdminSidebar } from '../AdminComponents';
import { SellerSidebar } from '../SellerComponents';
import { useAuth } from '../../context/AuthContext';
import './RolePageShell.css';

interface RolePageShellProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const RolePageShell: React.FC<RolePageShellProps> = ({ title, description, icon, children }) => {
  const { userRole, isAuthenticated } = useAuth();

  const roleSidebar = !isAuthenticated
    ? null
    : userRole === 'admin'
      ? <AdminSidebar />
      : userRole === 'seller'
        ? <SellerSidebar />
        : <BuyerSidebar />;

  return (
    <section className="role-page-shell">
      <div className={`role-page-shell__container ${roleSidebar ? 'has-sidebar' : ''}`}>
        {roleSidebar}
        <div className="role-page-shell__main">
          <div className="role-page-shell__card">
            <h1 className="role-page-shell__title">
              {icon ? <span className="role-page-shell__title-icon">{icon}</span> : null}
              <span>{title}</span>
            </h1>
            <p className="role-page-shell__description">{description}</p>
          </div>
          {children ? <div className="role-page-shell__content">{children}</div> : null}
        </div>
      </div>
    </section>
  );
};
