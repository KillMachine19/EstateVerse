import React from 'react';
import { Link } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import './VerticalNavbar.css';

interface VerticalNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerticalNavbar: React.FC<VerticalNavbarProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <>
      {isOpen && (
        <div className="vertical-navbar-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      <nav className={`vertical-navbar ${isOpen ? 'vertical-navbar-open' : 'vertical-navbar-closed'}`}>
        <div className="vertical-navbar-content">
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={onClose}
              className="vertical-navbar-link"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="vertical-navbar-divider" />

        <div className="vertical-navbar-actions">
          <button className="navbar-btn navbar-btn-primary">Schedule A Call</button>
          <button className="navbar-btn navbar-btn-secondary">Sign In</button>
        </div>
      </nav>
    </>
  );
};
