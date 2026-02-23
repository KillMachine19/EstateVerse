import React, { useState } from 'react';
import { Button } from '../Button';
import { Logo } from '../Logo';
import { Navigation } from '../Navigation';
import { MobileMenuToggle } from '../MobileMenuToggle';
import './Header.css';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-logo">
            <Logo showTagline={false} />
          </div>

          <div className="header-nav-desktop">
            <Navigation isOpen={true} />
          </div>

          <div className="header-actions">
            <Button variant="primary" size="sm">
              Schedule A Call
            </Button>
          </div>

          <div className="header-mobile-toggle">
            <MobileMenuToggle
              isOpen={isMobileMenuOpen}
              onToggle={toggleMobileMenu}
            />
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="header-mobile-nav">
            <Navigation isOpen={true} />
            <div className="header-mobile-nav-btn">
              <Button variant="primary" size="sm" className="w-full">
                Schedule A Call
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
