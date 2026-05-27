import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiCheckSquare, FiGrid, FiMessageCircle, FiPhoneCall, FiTag, FiUser } from 'react-icons/fi';
import './DealerSidebar.css';

const DEALER_SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/dealer/dashboard', icon: <FiGrid aria-hidden="true" /> },
  { label: 'Applications', to: '/dealer/applications', icon: <FiPhoneCall aria-hidden="true" /> },
  { label: 'Follow Ups', to: '/dealer/follow-ups', icon: <FiMessageCircle aria-hidden="true" /> },
  { label: 'Deal Status', to: '/dealer/deals', icon: <FiTag aria-hidden="true" /> },
  { label: 'Review Properties', to: '/dealer/review-properties', icon: <FiCheckSquare aria-hidden="true" /> },
  { label: 'Profile', to: '/dealer/profile', icon: <FiUser aria-hidden="true" /> },
];

export const DealerSidebar: React.FC = () => {
  return (
    <aside className="dealer-sidebar" aria-label="Dealer workspace navigation">
      <div className="dealer-sidebar-title">Dealer Workspace</div>
      <nav className="dealer-sidebar-nav">
        {DEALER_SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `dealer-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <span className="dealer-sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
