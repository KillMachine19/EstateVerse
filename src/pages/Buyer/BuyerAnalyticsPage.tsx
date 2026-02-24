import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import { BuyerAnalytics } from '../../components/BuyerComponents/BuyerAnalytics';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';

export const BuyerAnalyticsPage: React.FC = () => {
  return (
    <BuyerWorkspace
      title="Buyer Analytics"
      description="Visual analytics view."
      icon={<FiBarChart2 aria-hidden="true" />}
    >
      <BuyerAnalytics />
    </BuyerWorkspace>
  );
};
