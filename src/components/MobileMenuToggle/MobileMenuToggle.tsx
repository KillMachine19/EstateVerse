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
      aria-expanded="false"
    >
      <span className="sr-only">Open main menu</span>
      {isOpen ? (
        <svg
          className="menu-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          className="menu-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      )}
    </button>
  );
};
