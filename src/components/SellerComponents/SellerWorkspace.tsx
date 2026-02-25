import React from 'react';
import { SellerSidebar } from './SellerSidebar';
import './SellerWorkspace.css';

interface SellerWorkspaceProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const SellerWorkspace: React.FC<SellerWorkspaceProps> = ({ title, description, icon, children }) => {
  return (
    <section className="seller-workspace">
      <div className="seller-workspace-container">
        <SellerSidebar />
        <div className="seller-workspace-main">
          <div className="seller-workspace-card">
            <h1 className="seller-workspace-title">
              {icon ? <span className="seller-workspace-title-icon">{icon}</span> : null}
              <span>{title}</span>
            </h1>
            <p className="seller-workspace-description">{description}</p>
          </div>
          {children ? <div className="seller-workspace-content">{children}</div> : null}
        </div>
      </div>
    </section>
  );
};
