import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';
import { SellerDashboard } from '../../components/SellerComponents';
import { SellerWorkspace } from '../../components/SellerComponents';

export const SellerDashboardPage: React.FC = () => {
  return (
    <SellerWorkspace
      title="Seller Dashboard"
      description="Get a snapshot of listing performance, incoming leads, and activity trends."
      icon={<FiTrendingUp aria-hidden="true" />}
    >
      <SellerDashboard />
    </SellerWorkspace>
  );
};
