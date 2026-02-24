import React from 'react';
import { FiBookmark } from 'react-icons/fi';
import { BuyerSavedCards } from '../../components/BuyerComponents/BuyerSaved';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';

export const BuyerSavedPage: React.FC = () => {
  return (
    <BuyerWorkspace
      title="Saved Properties"
      description="Review shortlisted properties and compare details before taking your next step."
      icon={<FiBookmark aria-hidden="true" />}
    >
      <BuyerSavedCards />
    </BuyerWorkspace>
  );
};
