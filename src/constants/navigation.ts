import type { UserRole } from '../utils/authRole';

export interface NavItem {
  label: string;
  path: string;
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
  { label: 'Profile', path: '/buyer/profile' },
];

const SELLER_NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/seller/dashboard' },
  { label: 'My Listings', path: '/seller/listings' },
  { label: 'Add Property', path: '/seller/add-property' },
  { label: 'Leads', path: '/seller/leads' },
  { label: 'Analytics', path: '/seller/analytics' },
  { label: 'Messages', path: '/seller/messages' },
  { label: 'Notifications', path: '/seller/notifications' },
  { label: 'Profile', path: '/seller/profile' },
];

export const getSignedInNavigationItems = (role: UserRole | null): NavItem[] => {
  if (role === 'seller') {
    return SELLER_NAVIGATION_ITEMS;
  }

  return BUYER_NAVIGATION_ITEMS;
};

export const getDefaultDashboardPath = (role: UserRole | null): string =>
  role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard';

export const BRAND_NAME = 'EstateVerse';
export const BRAND_TAGLINE = 'Commercial Real Estate Solutions';
