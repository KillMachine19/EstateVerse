import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiBookmark, FiFileText, FiGrid, FiTag } from 'react-icons/fi';
import './BuyerSidebar.css';

const BUYER_SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/buyer/dashboard', icon: <FiGrid aria-hidden="true" /> },
  { label: 'Saved', to: '/buyer/saved', icon: <FiBookmark aria-hidden="true" /> },
  { label: 'Offers', to: '/buyer/offers', icon: <FiTag aria-hidden="true" /> },
  { label: 'Applications', to: '/buyer/applications', icon: <FiFileText aria-hidden="true" /> },
];

export const BuyerSidebar: React.FC = () => {
  return (
    <aside className="buyer-sidebar" aria-label="Buyer workspace navigation">
      <div className="buyer-sidebar-title">Buyer Workspace</div>
      <nav className="buyer-sidebar-nav">
        {BUYER_SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `buyer-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <span className="buyer-sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
