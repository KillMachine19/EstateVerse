import React from 'react';
import { DealerSidebar } from './DealerSidebar';
import './DealerWorkspace.css';

interface DealerWorkspaceProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  wide?: boolean;
}

export const DealerWorkspace: React.FC<DealerWorkspaceProps> = ({ title, description, icon, children, wide = false }) => {
  return (
    <section className="dealer-workspace">
      <div className={`dealer-workspace-container ${wide ? 'is-wide' : ''}`}>
        <DealerSidebar />
        <div className="dealer-workspace-main">
          <div className="dealer-workspace-card">
            <h1 className="dealer-workspace-title">
              {icon ? <span className="dealer-workspace-title-icon">{icon}</span> : null}
              <span>{title}</span>
            </h1>
            <p className="dealer-workspace-description">{description}</p>
          </div>
          {children ? <div className="dealer-workspace-content">{children}</div> : null}
        </div>
      </div>
    </section>
  );
};
