import React from 'react';
import { FiTag } from 'react-icons/fi';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';

export const BuyerOffersPage: React.FC = () => {
  return (
    <BuyerWorkspace
      title="Offers"
      description="Manage active offers, monitor status changes, and follow up on pending negotiations."
      icon={<FiTag aria-hidden="true" />}
    />
  );
};
