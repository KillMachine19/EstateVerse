import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../Logo';
import { Navigation } from '../Navigation';
import { MobileMenuToggle } from '../MobileMenuToggle';
import { AuthModal } from '../AuthModal';
import { useAuth } from '../../context/AuthContext';
import { BuyerHeaderNav } from '../BuyerHeaderNav';
import {
  getDefaultDashboardPath,
  getSignedInNavigationItems,
  PUBLIC_NAVIGATION_ITEMS,
} from '../../constants/navigation';
import type { UserRole } from '../../utils/authRole';
import './Header.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, setAuthenticated, setUserRole, clearAuth } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const isBuyer = isAuthenticated && userRole === 'buyer';

  const navigationItems = isAuthenticated
    ? getSignedInNavigationItems(userRole)
    : PUBLIC_NAVIGATION_ITEMS;

  const buyerMobileNavigationItems = [
    { label: 'Dashboard', path: '/buyer/dashboard' },
    { label: 'Saved', path: '/buyer/saved' },
    { label: 'Offers', path: '/buyer/offers' },
    { label: 'Applications', path: '/buyer/applications' },
    { label: 'Messages', path: '/buyer/messages' },
    { label: 'Notifications', path: '/buyer/notifications' },
    { label: 'Profile', path: '/buyer/profile' },
  ];

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

  const onAuthSuccess = async (role: UserRole | null) => {
    setAuthenticated(true);
    setUserRole(role);
    setIsAuthOpen(false);
    setIsMobileMenuOpen(false);
    navigate(getDefaultDashboardPath(role));
  };

  const onSignOut = () => {
    clearAuth();
    setIsAuthOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-logo">
            <Logo showTagline={false} />
          </div>

          <div className={`header-nav-desktop ${isBuyer ? 'header-nav-buyer' : ''}`}>
            {isBuyer ? (
              <BuyerHeaderNav onSignOut={onSignOut} />
            ) : (
              <Navigation items={navigationItems} isOpen={true} />
            )}
          </div>

          {!isAuthenticated ? (
            <div className="header-auth-desktop">
              <button type="button" className="header-auth-btn" onClick={openAuthModal}>
                Sign In / Sign Up
              </button>
            </div>
          ) : !isBuyer ? (
            <div className="header-auth-desktop">
              <button type="button" className="header-auth-btn" onClick={onSignOut}>
                Sign Out
              </button>
            </div>
          ) : null}

          <div className="header-mobile-toggle">
            <MobileMenuToggle
              isOpen={isMobileMenuOpen}
              onToggle={toggleMobileMenu}
            />
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="header-mobile-nav">
            <Navigation
              items={isBuyer ? buyerMobileNavigationItems : navigationItems}
              isOpen={isMobileMenuOpen}
              onClose={closeMobileMenu}
              isMobile={true}
            />
            {!isAuthenticated ? (
              <button type="button" className="header-auth-btn header-auth-mobile" onClick={openAuthModal}>
                Sign In / Sign Up
              </button>
            ) : (
              <button type="button" className="header-auth-btn header-auth-mobile" onClick={onSignOut}>
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={closeAuthModal} onAuthSuccess={onAuthSuccess} />
    </header>
  );
};
