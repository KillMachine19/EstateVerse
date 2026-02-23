import React from 'react';
import './Logo.css';

interface LogoProps {
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ showTagline = false }) => {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <span className="logo-icon-text">EV</span>
      </div>
      <div>
        <h1 className="logo-brand">EstateVerse</h1>
        {showTagline && <p className="logo-tagline">Commercial Real Estate</p>}
      </div>
    </div>
  );
};
