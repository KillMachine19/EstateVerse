import React from 'react';
import { FiGrid } from 'react-icons/fi';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';
import { BuyerDashboard } from '../../components/BuyerComponents/BuyerDashboard';

export const BuyerDashboardPage: React.FC = () => {
  return (
    <BuyerWorkspace
      title="Buyer Dashboard"
      description="Track your saved properties, latest offers, and application milestones from one place."
      icon={<FiGrid aria-hidden="true" />}
    >
      <BuyerDashboard />
    </BuyerWorkspace>
  );
};
