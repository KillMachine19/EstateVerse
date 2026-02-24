import React from 'react';
import { BuyerSidebar } from '../BuyerSidebar';
import './BuyerWorkspace.css';

interface BuyerWorkspaceProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const BuyerWorkspace: React.FC<BuyerWorkspaceProps> = ({ title, description, icon, children }) => {
  return (
    <section className="buyer-workspace">
      <div className="buyer-workspace-container">
        <BuyerSidebar />
        <div className="buyer-workspace-main">
          <div className="buyer-workspace-card">
            <h1 className="buyer-workspace-title">
              {icon ? <span className="buyer-workspace-title-icon">{icon}</span> : null}
              <span>{title}</span>
            </h1>
            <p className="buyer-workspace-description">{description}</p>
          </div>
          {children ? <div className="buyer-workspace-content">{children}</div> : null}
        </div>
      </div>
    </section>
  );
};
