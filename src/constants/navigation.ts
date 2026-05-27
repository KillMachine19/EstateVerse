import type { ReactNode } from 'react';
import type { UserRole } from '../utils/authRole';

export interface NavItem {
  label: string;
  path: string;
  icon?: ReactNode;
  children?: NavItem[];
}

export const PUBLIC_NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Properties', path: '/properties' },
  { label: 'Services', path: '/services' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const BUYER_NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/buyer/dashboard' },
  { label: 'Search Properties', path: '/buyer/search' },
  { label: 'Saved', path: '/buyer/saved' },
  { label: 'Offers', path: '/buyer/offers' },
  { label: 'Applications', path: '/buyer/applications' },
  { label: 'Messages', path: '/buyer/messages' },
  { label: 'Notifications', path: '/buyer/notifications' },
  { label: 'Profile', path: '/profile' },
];

const SELLER_NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/seller/dashboard' },
  { label: 'My Listings', path: '/seller/listings' },
  { label: 'Add Property', path: '/seller/add-property' },
  { label: 'Leads', path: '/seller/leads' },
  { label: 'Applications', path: '/seller/applications' },
  { label: 'Analytics', path: '/seller/analytics' },
  { label: 'Messages', path: '/seller/messages' },
  { label: 'Notifications', path: '/seller/notifications' },
  { label: 'Profile', path: '/profile' },
];

const ADMIN_NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Analytics', path: '/admin/analytics' },
  { label: 'Dealers', path: '/admin/dealers' },
  { label: 'Create Dealer', path: '/admin/dealers/create' },
  { label: 'User Directory', path: '/admin/users' },
  { label: 'Audit Logs', path: '/admin/audit-logs' },
  { label: 'Revoke Access', path: '/admin/revoke-access' },
  { label: 'System Settings', path: '/admin/settings' },
  { label: 'Profile', path: '/profile' },
];

const DEALER_NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dealer/dashboard' },
  { label: 'Applications', path: '/dealer/applications' },
  { label: 'Follow Ups', path: '/dealer/follow-ups' },
  { label: 'Deal Status', path: '/dealer/deals' },
  { label: 'Review Properties', path: '/dealer/review-properties' },
  { label: 'Profile', path: '/dealer/profile' },
];

export const getSignedInNavigationItems = (role: UserRole | null): NavItem[] => {
  if (role === 'admin') {
    return ADMIN_NAVIGATION_ITEMS;
  }
  if (role === 'seller') {
    return SELLER_NAVIGATION_ITEMS;
  }
  if (role === 'dealer') {
    return DEALER_NAVIGATION_ITEMS;
  }

  return BUYER_NAVIGATION_ITEMS;
};

export const getDefaultDashboardPath = (role: UserRole | null): string => {
  if (role === 'admin') {
    return '/admin/dashboard';
  }
  if (role === 'seller') {
    return '/seller/dashboard';
  }
  if (role === 'dealer') {
    return '/dealer/dashboard';
  }
  return '/buyer/dashboard';
};

export const BRAND_NAME = 'EstateVerse';
export const BRAND_TAGLINE = 'Commercial Real Estate Solutions';
