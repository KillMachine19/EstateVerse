import React from 'react';
import './Logo.css';

interface LogoProps {
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ showTagline = false }) => {
  return (
    <div className="logo-container">
      <img className="logo-image" src="/images/naddy-d-baddy-logo.png" alt="Naddy-D-Baddy RealEstate" />
      {showTagline && <p className="logo-tagline">Real Estate</p>}
    </div>
  );
};
