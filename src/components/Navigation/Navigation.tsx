import React from 'react';
import { Link } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import './Navigation.css';

interface NavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isOpen = true }) => {
  return (
    <nav className={isOpen ? 'nav-container' : 'nav-hidden'}>
      {NAVIGATION_ITEMS.map((item) => (
        <Link key={item.label} to={item.path} className="nav-link">
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
