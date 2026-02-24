import React from 'react';
import { FiFileText } from 'react-icons/fi';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';

export const BuyerApplicationsPage: React.FC = () => {
  return (
    <BuyerWorkspace
      title="Applications"
      description="Track submitted applications and stay updated on approvals or required actions."
      icon={<FiFileText aria-hidden="true" />}
    />
  );
};
