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
import { BuyerProfilePage } from '../pages/Buyer/BuyerProfilePage';
import { SellerDashboardPage } from '../pages/Seller/SellerDashboardPage';
import { SellerListingsPage } from '../pages/Seller/SellerListingsPage';
import { SellerAddPropertyPage } from '../pages/Seller/SellerAddPropertyPage';
import { SellerLeadsPage } from '../pages/Seller/SellerLeadsPage';
import { SellerAnalyticsPage } from '../pages/Seller/SellerAnalyticsPage';
import { SellerMessagesPage } from '../pages/Seller/SellerMessagesPage';
import { SellerNotificationsPage } from '../pages/Seller/SellerNotificationsPage';
import { SellerProfilePage } from '../pages/Seller/SellerProfilePage';

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
        path: 'buyer/saved',
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerSavedPage />
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
        element: (
          <RoleProtectedRoute requiredRole="buyer">
            <BuyerProfilePage />
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
        element: (
          <RoleProtectedRoute requiredRole="seller">
            <SellerProfilePage />
          </RoleProtectedRoute>
        ),
      },
    ],
  },
]);
