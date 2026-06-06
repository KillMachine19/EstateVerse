import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiBarChart2,
  FiBell,
  FiBookmark,
  FiCheckCircle,
  FiCheckSquare,
  FiFileText,
  FiGrid,
  FiPhoneCall,
  FiShield,
  FiSettings,
  FiMapPin,
  FiMessageSquare,
  FiSearch,
  FiTag,
  FiUserCheck,
  FiUser,
} from 'react-icons/fi';
import { Logo } from '../Logo';
import { Navigation } from '../Navigation';
import { MobileMenuToggle } from '../MobileMenuToggle';
import { AuthModal } from '../AuthModal';
import { useAuth } from '../../context/AuthContext';
import { BuyerHeaderNav } from '../BuyerComponents/BuyerHeaderNav';
import {
  getDefaultDashboardPath,
  getSignedInNavigationItems,
  PUBLIC_NAVIGATION_ITEMS,
} from '../../constants/navigation';
import { readStoredUserRole, type UserRole } from '../../utils/authRole';
import './Header.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userRole, setAuthenticated, setUserRole, clearAuth } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isBuyer = isAuthenticated && userRole === 'buyer';
  const isAdmin = isAuthenticated && userRole === 'admin';
  const isDealer = isAuthenticated && userRole === 'dealer';
  const isHomeRoute = location.pathname === '/';
  const isSolidHeader = !isHomeRoute || isScrolled;

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
    { label: 'Search Properties', path: '/buyer/search', icon: <FiSearch aria-hidden="true" /> },
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
    { label: 'Dealers', path: '/admin/dealers', icon: <FiUserCheck aria-hidden="true" /> },
    { label: 'Create Dealer', path: '/admin/dealers/create', icon: <FiUserCheck aria-hidden="true" /> },
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

  const dealerDesktopNavigationItems = [
    { label: 'Dashboard', path: '/dealer/dashboard', icon: <FiGrid aria-hidden="true" /> },
    { label: 'Applications', path: '/dealer/applications', icon: <FiPhoneCall aria-hidden="true" /> },
    { label: 'Follow Ups', path: '/dealer/follow-ups', icon: <FiMessageSquare aria-hidden="true" /> },
    { label: 'Deal Status', path: '/dealer/deals', icon: <FiTag aria-hidden="true" /> },
    { label: 'Review Properties', path: '/dealer/review-properties', icon: <FiCheckSquare aria-hidden="true" /> },
    { label: 'Dealer Profile', path: '/dealer/profile', icon: <FiUser aria-hidden="true" /> },
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

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onLogoClick = () => {
    setIsMobileMenuOpen(false);
    navigate(isAuthenticated ? getDefaultDashboardPath(userRole) : '/');
  };

  const onAuthSuccess = async (role: UserRole | null, options?: { forcePasswordReset?: boolean }) => {
    setAuthenticated(true);
    const resolvedRole = role ?? readStoredUserRole() ?? 'buyer';

    setUserRole(resolvedRole);
    setIsAuthOpen(false);
    setIsMobileMenuOpen(false);
    if (options?.forcePasswordReset) {
      window.localStorage.setItem('estateverse_force_password_reset', 'true');
    } else {
      window.localStorage.removeItem('estateverse_force_password_reset');
    }
    navigate(options?.forcePasswordReset ? '/reset-password?firstLogin=true' : getDefaultDashboardPath(resolvedRole));
  };

  const onPerspectiveChange = (perspective: 'buyer' | 'seller') => {
    if (!isAuthenticated || userRole === perspective || userRole === 'admin' || userRole === 'dealer') {
      return;
    }

    setUserRole(perspective);
    setIsMobileMenuOpen(false);
    navigate(getDefaultDashboardPath(perspective));
  };

  const onSignOut = () => {
    clearAuth();
    window.localStorage.removeItem('estateverse_force_password_reset');
    setIsAuthOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`header ${isSolidHeader ? 'is-solid is-scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-content">
          <button type="button" className="header-logo-btn" onClick={onLogoClick}>
            <div className="header-logo">
              <Logo showTagline={false} />
            </div>
          </button>

          <div className={`header-nav-desktop ${isBuyer || isDealer ? 'header-nav-buyer' : ''}`}>
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
            ) : isDealer ? (
              <Navigation items={dealerDesktopNavigationItems} isOpen={true} />
            ) : (
              <Navigation items={navigationItems} isOpen={true} />
            )}
          </div>

          <div className="header-auth-desktop">
            {isAuthenticated && !isBuyer && !isAdmin && !isDealer ? (
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
              items={
                isBuyer
                  ? buyerMobileNavigationItems
                  : isAdmin
                    ? adminMobileNavigationItems
                    : isDealer
                      ? dealerDesktopNavigationItems
                      : navigationItems
              }
              isOpen={isMobileMenuOpen}
              onClose={closeMobileMenu}
              isMobile={true}
            />
            <div className="header-mobile-actions">
              {isAuthenticated && !isAdmin && !isDealer ? (
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
