import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBarChart2,
  FiBell,
  FiBookmark,
  FiFileText,
  FiGrid,
  FiMapPin,
  FiMessageSquare,
  FiSearch,
  FiTag,
  FiUser,
} from 'react-icons/fi';
import { Logo } from '../Logo';
import { Navigation } from '../Navigation';
import { MobileMenuToggle } from '../MobileMenuToggle';
import { AuthModal } from '../AuthModal';
import { useAuth } from '../../context/AuthContext';
import { BuyerHeaderNav } from '../BuyerComponents/BuyerHeaderNav';
import { ThemeToggle } from '../ThemeToggle';
import {
  getDefaultDashboardPath,
  getSignedInNavigationItems,
  PUBLIC_NAVIGATION_ITEMS,
} from '../../constants/navigation';
import { readStoredUserRole, type UserRole } from '../../utils/authRole';
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
    {
      label: 'Dashboard',
      path: '/buyer/dashboard',
      icon: <FiGrid aria-hidden="true" />,
      children: [
        { label: 'Overview', path: '/buyer/dashboard', icon: <FiGrid aria-hidden="true" /> },
        { label: 'Analytics', path: '/buyer/analytics', icon: <FiBarChart2 aria-hidden="true" /> },
      ],
    },
    {
      label: 'Saved',
      path: '/buyer/saved',
      icon: <FiBookmark aria-hidden="true" />,
      children: [
        { label: 'Property List', path: '/buyer/saved', icon: <FiBookmark aria-hidden="true" /> },
        { label: 'Map View', path: '/buyer/saved-map', icon: <FiMapPin aria-hidden="true" /> },
      ],
    },
    { label: 'Search Properties', path: '/properties', icon: <FiSearch aria-hidden="true" /> },
    { label: 'Offers', path: '/buyer/offers', icon: <FiTag aria-hidden="true" /> },
    { label: 'Applications', path: '/buyer/applications', icon: <FiFileText aria-hidden="true" /> },
    { label: 'Messages', path: '/buyer/messages', icon: <FiMessageSquare aria-hidden="true" /> },
    { label: 'Notifications', path: '/buyer/notifications', icon: <FiBell aria-hidden="true" /> },
    { label: 'Profile', path: '/buyer/profile', icon: <FiUser aria-hidden="true" /> },
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

  const onLogoClick = () => {
    setIsMobileMenuOpen(false);
    navigate(isAuthenticated ? getDefaultDashboardPath(userRole) : '/');
  };

  const onAuthSuccess = async (role: UserRole | null) => {
    setAuthenticated(true);
    const resolvedRole = role ?? readStoredUserRole() ?? 'buyer';

    setUserRole(resolvedRole);
    setIsAuthOpen(false);
    setIsMobileMenuOpen(false);
    navigate(getDefaultDashboardPath(resolvedRole));
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
          <button type="button" className="header-logo-btn" onClick={onLogoClick}>
            <div className="header-logo">
              <Logo showTagline={false} />
            </div>
          </button>

          <div className={`header-nav-desktop ${isBuyer ? 'header-nav-buyer' : ''}`}>
            {isBuyer ? (
              <BuyerHeaderNav onSignOut={onSignOut} />
            ) : (
              <Navigation items={navigationItems} isOpen={true} />
            )}
          </div>

          <div className="header-auth-desktop">
            <ThemeToggle className="header-theme-toggle" />
            {!isAuthenticated ? (
              <button type="button" className="header-auth-btn" onClick={openAuthModal}>
                Sign In / Sign Up
              </button>
            ) : !isBuyer ? (
              <button type="button" className="header-auth-btn" onClick={onSignOut}>
                Sign Out
              </button>
            ) : null}
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
            <Navigation
              items={isBuyer ? buyerMobileNavigationItems : navigationItems}
              isOpen={isMobileMenuOpen}
              onClose={closeMobileMenu}
              isMobile={true}
            />
            <div className="header-mobile-actions">
              <ThemeToggle className="header-theme-toggle header-theme-toggle-mobile" />
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
          </div>
        )}
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={closeAuthModal} onAuthSuccess={onAuthSuccess} />
    </header>
  );
};
