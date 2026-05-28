import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiBookmark, FiChevronDown, FiFileText, FiGrid, FiList, FiMapPin, FiPieChart, FiSearch, FiTag } from 'react-icons/fi';
import './BuyerSidebar.css';

const BUYER_SIDEBAR_ITEMS = [
  { label: 'Search Properties', to: '/buyer/search', icon: <FiSearch aria-hidden="true" /> },
  { label: 'Offers', to: '/buyer/offers', icon: <FiTag aria-hidden="true" /> },
  { label: 'Applications', to: '/buyer/applications', icon: <FiFileText aria-hidden="true" /> },
];

export const BuyerSidebar: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = useMemo(
    () => location.pathname.startsWith('/buyer/dashboard') ,
    [location.pathname]
  );
  const isSavedRoute = useMemo(
    () => location.pathname.startsWith('/buyer/saved'),
    [location.pathname]
  );
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(isDashboardRoute);
  const [isSavedExpanded, setIsSavedExpanded] = useState(isSavedRoute);

  useEffect(() => {
    if (isDashboardRoute) {
      setIsDashboardExpanded(true);
    }
  }, [isDashboardRoute]);

  useEffect(() => {
    if (isSavedRoute) {
      setIsSavedExpanded(true);
    }
  }, [isSavedRoute]);

  return (
    <aside className="buyer-sidebar" aria-label="Buyer workspace navigation">
      <div className="buyer-sidebar-title">Buyer Workspace</div>
      <nav className="buyer-sidebar-nav">
        <div className="buyer-sidebar-accordion">
          <button
            type="button"
            className={`buyer-sidebar-accordion__toggle ${isDashboardRoute ? 'is-active' : ''}`}
            onClick={() => setIsDashboardExpanded((prev) => !prev)}
            aria-expanded={isDashboardExpanded}
          >
            <span className="buyer-sidebar-icon">
              <FiGrid aria-hidden="true" />
            </span>
            <span>Dashboard</span>
            <FiChevronDown
              className={`buyer-sidebar-accordion__chevron ${isDashboardExpanded ? 'is-expanded' : ''}`}
              aria-hidden="true"
            />
          </button>

          {isDashboardExpanded && (
            <div className="buyer-sidebar-accordion__panel">
              <NavLink
                to="/buyer/dashboard"
                className={({ isActive }) => `buyer-sidebar-sublink ${isActive ? 'is-active' : ''}`}
              >
                <span className="buyer-sidebar-sublink__icon">
                  <FiGrid aria-hidden="true" />
                </span>
                Overview
              </NavLink>
            </div>
          )}
        </div>

        <div className="buyer-sidebar-accordion">
          <button
            type="button"
            className={`buyer-sidebar-accordion__toggle ${isSavedRoute ? 'is-active' : ''}`}
            onClick={() => setIsSavedExpanded((prev) => !prev)}
            aria-expanded={isSavedExpanded}
          >
            <span className="buyer-sidebar-icon">
              <FiBookmark aria-hidden="true" />
            </span>
            <span>Saved</span>
            <FiChevronDown
              className={`buyer-sidebar-accordion__chevron ${isSavedExpanded ? 'is-expanded' : ''}`}
              aria-hidden="true"
            />
          </button>

          {isSavedExpanded && (
            <div className="buyer-sidebar-accordion__panel">
              <NavLink
                to="/buyer/saved"
                className={({ isActive }) => `buyer-sidebar-sublink ${isActive ? 'is-active' : ''}`}
              >
                <span className="buyer-sidebar-sublink__icon">
                  <FiList aria-hidden="true" />
                </span>
                Property List
              </NavLink>
              <NavLink
                to="/buyer/saved-map"
                className={({ isActive }) => `buyer-sidebar-sublink ${isActive ? 'is-active' : ''}`}
              >
                <span className="buyer-sidebar-sublink__icon">
                  <FiMapPin aria-hidden="true" />
                </span>
                Map View
              </NavLink>
            </div>
          )}
        </div>

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
