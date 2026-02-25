import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import { SellerWorkspace } from '../../components/SellerComponents';

export const SellerAnalyticsPage: React.FC = () => {
  return (
    <SellerWorkspace
      title="Analytics"
      description="Analyze impressions, engagement, and conversion metrics across your listings."
      icon={<FiBarChart2 aria-hidden="true" />}
    />
  );
};
