import React from 'react';
import { BuyerSidebar } from '../BuyerSidebar';
import './BuyerWorkspace.css';

interface BuyerWorkspaceProps {
  title: string;
  description: string;
}

export const BuyerWorkspace: React.FC<BuyerWorkspaceProps> = ({ title, description }) => {
  return (
    <section className="buyer-workspace">
      <div className="buyer-workspace-container">
        <BuyerSidebar />
        <div className="buyer-workspace-main">
          <div className="buyer-workspace-card">
            <h1 className="buyer-workspace-title">{title}</h1>
            <p className="buyer-workspace-description">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
