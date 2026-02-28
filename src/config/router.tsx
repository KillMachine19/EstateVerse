import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Root } from '../layout/Root';
import { Home } from '../pages/Home/Home';
import { Properties } from '../pages/Properties/Properties';
import { Services } from '../pages/Services/Services';
import { About } from '../pages/About/About';
import { Contact } from '../pages/Contact/Contact';
import { RoleProtectedRoute } from '../components/RoleProtectedRoute';
import { BuyerDashboardPage } from '../pages/Buyer/BuyerDashboardPage';
import { BuyerSearchPropertiesPage } from '../pages/Buyer/BuyerSearchPropertiesPage';
import { BuyerSavedPage } from '../pages/Buyer/BuyerSavedPage';
import { BuyerOffersPage } from '../pages/Buyer/BuyerOffersPage';
import { BuyerApplicationsPage } from '../pages/Buyer/BuyerApplicationsPage';
import { BuyerMessagesPage } from '../pages/Buyer/BuyerMessagesPage';
import { BuyerNotificationsPage } from '../pages/Buyer/BuyerNotificationsPage';
import { ProfilePage } from '../pages/Account/ProfilePage';
import { BuyerAnalyticsPage } from '../pages/Buyer/BuyerAnalyticsPage';
import { BuyerSavedMapPage } from '../pages/Buyer/BuyerSavedMapPage';
import { BuyerPropertyDetailsPage } from '../pages/Buyer/BuyerPropertyDetailsPage';
import { VerificationStatusPage } from '../pages/Account/VerificationStatusPage';
import { SellerDashboardPage } from '../pages/Seller/SellerDashboardPage';
import { SellerListingsPage } from '../pages/Seller/SellerListingsPage';
import { SellerListingManagePage } from '../pages/Seller/SellerListingManagePage';
import { SellerAddPropertyPage } from '../pages/Seller/SellerAddPropertyPage';
import { SellerLeadsPage } from '../pages/Seller/SellerLeadsPage';
import { SellerAnalyticsPage } from '../pages/Seller/SellerAnalyticsPage';
import { SellerMessagesPage } from '../pages/Seller/SellerMessagesPage';
import { SellerNotificationsPage } from '../pages/Seller/SellerNotificationsPage';
import { ResetPasswordPage } from '../pages/Account/ResetPasswordPage';
import { AdminDashboardPage } from '../pages/Admin/AdminDashboardPage';
import { AdminRevokeAccessPage } from '../pages/Admin/AdminRevokeAccessPage';
import { AdminUsersPage } from '../pages/Admin/AdminUsersPage';
import { AdminAuditLogsPage } from '../pages/Admin/AdminAuditLogsPage';
import { AdminSettingsPage } from '../pages/Admin/AdminSettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'properties',
        element: <Properties />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'dashboard',
        element: <Navigate to="/buyer/dashboard" replace />,
      },
      {
        path: 'buyer/dashboard',
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerDashboardPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'buyer/search',
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerSearchPropertiesPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'buyer/properties/:propertyId',
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerPropertyDetailsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'buyer/saved',
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerSavedPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'buyer/saved-map',
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerSavedMapPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'buyer/offers',
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerOffersPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'buyer/applications',
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerApplicationsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'buyer/messages',
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerMessagesPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'buyer/notifications',
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerNotificationsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'buyer/profile',
        element: <Navigate to="/profile" replace />,
      },
      {
        path: 'profile',
        element: (
          <RoleProtectedRoute>
            <ProfilePage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'buyer/verification-status',
        element: <Navigate to="/verification-status" replace />,
      },
      {
        path: 'verification-status',
        element: (
          <RoleProtectedRoute>
            <VerificationStatusPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <RoleProtectedRoute>
            <ResetPasswordPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'buyer/analytics',
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerAnalyticsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'admin/dashboard',
        element: (
          <RoleProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <RoleProtectedRoute requiredRole="admin">
            <AdminUsersPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'admin/audit-logs',
        element: (
          <RoleProtectedRoute requiredRole="admin">
            <AdminAuditLogsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'admin/revoke-access',
        element: (
          <RoleProtectedRoute requiredRole="admin">
            <AdminRevokeAccessPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'admin/settings',
        element: (
          <RoleProtectedRoute requiredRole="admin">
            <AdminSettingsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'seller/dashboard',
        element: (
          <RoleProtectedRoute requiredRole="seller">
            <SellerDashboardPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'seller/listings',
        element: (
          <RoleProtectedRoute requiredRole="seller">
            <SellerListingsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'seller/listings/:propertyId',
        element: (
          <RoleProtectedRoute requiredRole="seller">
            <SellerListingManagePage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'seller/add-property',
        element: (
          <RoleProtectedRoute requiredRole="seller">
            <SellerAddPropertyPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'seller/leads',
        element: (
          <RoleProtectedRoute requiredRole="seller">
            <SellerLeadsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'seller/analytics',
        element: (
          <RoleProtectedRoute requiredRole="seller">
            <SellerAnalyticsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'seller/messages',
        element: (
          <RoleProtectedRoute requiredRole="seller">
            <SellerMessagesPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'seller/notifications',
        element: (
          <RoleProtectedRoute requiredRole="seller">
            <SellerNotificationsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'seller/profile',
        element: <Navigate to="/profile" replace />,
      },
    ],
  },
]);
