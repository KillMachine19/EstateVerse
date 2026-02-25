import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBarChart2,
  FiBell,
  FiBookmark,
  FiCheckCircle,
  FiFileText,
  FiGrid,
  FiShield,
  FiSettings,
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
  const isAdmin = isAuthenticated && userRole === 'admin';

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
    {
      label: 'Profile',
      path: '/profile',
      icon: <FiUser aria-hidden="true" />,
      children: [
        { label: 'My Profile', path: '/profile', icon: <FiUser aria-hidden="true" /> },
        { label: 'Verification Status', path: '/verification-status', icon: <FiCheckCircle aria-hidden="true" /> },
        { label: 'Reset Password', path: '/reset-password', icon: <FiSettings aria-hidden="true" /> },
      ],
    },
  ];

  const adminMobileNavigationItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid aria-hidden="true" /> },
    { label: 'Revoke Access', path: '/admin/revoke-access', icon: <FiShield aria-hidden="true" /> },
    {
      label: 'Profile',
      path: '/profile',
      icon: <FiUser aria-hidden="true" />,
      children: [
        { label: 'My Profile', path: '/profile', icon: <FiUser aria-hidden="true" /> },
        { label: 'Verification Status', path: '/verification-status', icon: <FiCheckCircle aria-hidden="true" /> },
        { label: 'Reset Password', path: '/reset-password', icon: <FiSettings aria-hidden="true" /> },
      ],
    },
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

  useEffect(() => {
    const handleOpenAuthModal = () => {
      if (!isAuthenticated) {
        setIsAuthOpen(true);
      }
    };
    window.addEventListener('open-auth-modal', handleOpenAuthModal);
    return () => {
      window.removeEventListener('open-auth-modal', handleOpenAuthModal);
    };
  }, [isAuthenticated]);

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

  const onPerspectiveChange = (perspective: 'buyer' | 'seller') => {
    if (!isAuthenticated || userRole === perspective || userRole === 'admin') {
      return;
    }

    setUserRole(perspective);
    setIsMobileMenuOpen(false);
    navigate(getDefaultDashboardPath(perspective));
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
              <>
                <BuyerHeaderNav />
                <div className="header-perspective-toggle" role="group" aria-label="Select viewing perspective">
                  <button
                    type="button"
                    className={`header-perspective-btn ${userRole === 'buyer' ? 'is-active' : ''}`}
                    onClick={() => onPerspectiveChange('buyer')}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    className="header-perspective-btn"
                    onClick={() => onPerspectiveChange('seller')}
                  >
                    Seller
                  </button>
                </div>
              </>
            ) : (
              <Navigation items={navigationItems} isOpen={true} />
            )}
          </div>

          <div className="header-auth-desktop">
            {isAuthenticated && !isBuyer && !isAdmin ? (
              <div className="header-perspective-toggle" role="group" aria-label="Select viewing perspective">
                <button
                  type="button"
                  className={`header-perspective-btn ${userRole === 'buyer' ? 'is-active' : ''}`}
                  onClick={() => onPerspectiveChange('buyer')}
                >
                  Buyer
                </button>
                <button
                  type="button"
                  className={`header-perspective-btn ${userRole === 'seller' ? 'is-active' : ''}`}
                  onClick={() => onPerspectiveChange('seller')}
                >
                  Seller
                </button>
              </div>
            ) : null}
            <ThemeToggle className="header-theme-toggle" />
            {!isAuthenticated ? (
              <button type="button" className="header-auth-btn" onClick={openAuthModal}>
                Sign In / Sign Up
              </button>
            ) : (
              <button type="button" className="header-auth-btn" onClick={onSignOut}>
                Sign Out
              </button>
            )}
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
              items={isBuyer ? buyerMobileNavigationItems : isAdmin ? adminMobileNavigationItems : navigationItems}
              isOpen={isMobileMenuOpen}
              onClose={closeMobileMenu}
              isMobile={true}
            />
            <div className="header-mobile-actions">
              {isAuthenticated && !isAdmin ? (
                <div className="header-perspective-toggle header-perspective-toggle-mobile" role="group" aria-label="Select viewing perspective">
                  <button
                    type="button"
                    className={`header-perspective-btn ${userRole === 'buyer' ? 'is-active' : ''}`}
                    onClick={() => onPerspectiveChange('buyer')}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    className={`header-perspective-btn ${userRole === 'seller' ? 'is-active' : ''}`}
                    onClick={() => onPerspectiveChange('seller')}
                  >
                    Seller
                  </button>
                </div>
              ) : null}
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
