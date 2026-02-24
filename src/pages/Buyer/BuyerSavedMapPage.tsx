import React from 'react';
import { FiMap } from 'react-icons/fi';
import { BuyerSavedMap } from '../../components/BuyerComponents/BuyerSaved';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';

export const BuyerSavedMapPage: React.FC = () => {
  return (
    <BuyerWorkspace
      title="Saved Properties Map"
      description="View pinned locations of your shortlisted properties across key commercial markets."
      icon={<FiMap aria-hidden="true" />}
    >
      <BuyerSavedMap />
    </BuyerWorkspace>
  );
};
