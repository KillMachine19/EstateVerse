import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../Logo';
import { Navigation } from '../Navigation';
import { MobileMenuToggle } from '../MobileMenuToggle';
import { AuthModal } from '../AuthModal';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openAuthModal = () => {
    if (isAuthenticated) {
      return;
    }
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
  };

  const onAuthSuccess = async () => {
    setAuthenticated(true);
    setIsAuthOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/properties');
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

          {!isAuthenticated && (
            <div className="header-auth-desktop">
              <button type="button" className="header-auth-btn" onClick={openAuthModal}>
                Sign In / Sign Up
              </button>
            </div>
          )}

          <div className="header-mobile-toggle">
            <MobileMenuToggle
              isOpen={isMobileMenuOpen}
              onToggle={toggleMobileMenu}
            />
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="header-mobile-nav">
            <Navigation isOpen={isMobileMenuOpen} onClose={closeMobileMenu} isMobile={true} />
            {!isAuthenticated && (
              <button type="button" className="header-auth-btn header-auth-mobile" onClick={openAuthModal}>
                Sign In / Sign Up
              </button>
            )}
          </div>
        )}
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={closeAuthModal} onAuthSuccess={onAuthSuccess} />
    </header>
  );
};
