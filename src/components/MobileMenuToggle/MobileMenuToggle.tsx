import React from 'react';
import './MobileMenuToggle.css';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className="menu-toggle"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <span className="menu-icon">
        {isOpen ? '✕' : '☰'}
      </span>
    </button>
  );
};
