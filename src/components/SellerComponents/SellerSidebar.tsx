import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiChevronDown,
  FiFileText,
  FiGrid,
  FiList,
  FiMessageSquare,
  FiPieChart,
  FiPlusCircle,
  FiTag,
} from 'react-icons/fi';
import './SellerSidebar.css';

const SELLER_SIDEBAR_ITEMS = [
  { label: 'Leads', to: '/seller/leads', icon: <FiTag aria-hidden="true" /> },
  { label: 'Applications', to: '/seller/applications', icon: <FiFileText aria-hidden="true" /> },
  { label: 'Messages', to: '/seller/messages', icon: <FiMessageSquare aria-hidden="true" /> },
  { label: 'Notifications', to: '/seller/notifications', icon: <FiFileText aria-hidden="true" /> },
];

export const SellerSidebar: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = useMemo(
    () => location.pathname.startsWith('/seller/dashboard') || location.pathname.startsWith('/seller/analytics'),
    [location.pathname]
  );
  const isListingsRoute = useMemo(
    () => location.pathname.startsWith('/seller/listings') || location.pathname.startsWith('/seller/add-property'),
    [location.pathname]
  );
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(isDashboardRoute);
  const [isListingsExpanded, setIsListingsExpanded] = useState(isListingsRoute);

  useEffect(() => {
    if (isDashboardRoute) setIsDashboardExpanded(true);
  }, [isDashboardRoute]);

  useEffect(() => {
    if (isListingsRoute) setIsListingsExpanded(true);
  }, [isListingsRoute]);

  return (
    <aside className="seller-sidebar" aria-label="Seller workspace navigation">
      <div className="seller-sidebar-title">Seller Workspace</div>
      <nav className="seller-sidebar-nav">
        <div className="seller-sidebar-accordion">
          <button
            type="button"
            className={`seller-sidebar-accordion__toggle ${isDashboardRoute ? 'is-active' : ''}`}
            onClick={() => setIsDashboardExpanded((prev) => !prev)}
            aria-expanded={isDashboardExpanded}
          >
            <span className="seller-sidebar-icon">
              <FiGrid aria-hidden="true" />
            </span>
            <span>Dashboard</span>
            <FiChevronDown
              className={`seller-sidebar-accordion__chevron ${isDashboardExpanded ? 'is-expanded' : ''}`}
              aria-hidden="true"
            />
          </button>

          {isDashboardExpanded && (
            <div className="seller-sidebar-accordion__panel">
              <NavLink
                to="/seller/dashboard"
                className={({ isActive }) => `seller-sidebar-sublink ${isActive ? 'is-active' : ''}`}
              >
                <span className="seller-sidebar-sublink__icon">
                  <FiGrid aria-hidden="true" />
                </span>
                Overview
              </NavLink>
              <NavLink
                to="/seller/analytics"
                className={({ isActive }) => `seller-sidebar-sublink ${isActive ? 'is-active' : ''}`}
              >
                <span className="seller-sidebar-sublink__icon">
                  <FiPieChart aria-hidden="true" />
                </span>
                Analytics
              </NavLink>
            </div>
          )}
        </div>

        <div className="seller-sidebar-accordion">
          <button
            type="button"
            className={`seller-sidebar-accordion__toggle ${isListingsRoute ? 'is-active' : ''}`}
            onClick={() => setIsListingsExpanded((prev) => !prev)}
            aria-expanded={isListingsExpanded}
          >
            <span className="seller-sidebar-icon">
              <FiList aria-hidden="true" />
            </span>
            <span>Listings</span>
            <FiChevronDown
              className={`seller-sidebar-accordion__chevron ${isListingsExpanded ? 'is-expanded' : ''}`}
              aria-hidden="true"
            />
          </button>

          {isListingsExpanded && (
            <div className="seller-sidebar-accordion__panel">
              <NavLink
                to="/seller/listings"
                className={({ isActive }) => `seller-sidebar-sublink ${isActive ? 'is-active' : ''}`}
              >
                <span className="seller-sidebar-sublink__icon">
                  <FiList aria-hidden="true" />
                </span>
                My Listings
              </NavLink>
              <NavLink
                to="/seller/add-property"
                className={({ isActive }) => `seller-sidebar-sublink ${isActive ? 'is-active' : ''}`}
              >
                <span className="seller-sidebar-sublink__icon">
                  <FiPlusCircle aria-hidden="true" />
                </span>
                Add Property
              </NavLink>
            </div>
          )}
        </div>

        {SELLER_SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `seller-sidebar-link ${isActive ? 'is-active' : ''}`}
          >
            <span className="seller-sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
