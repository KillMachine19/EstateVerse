import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';

export const BuyerSearchPropertiesPage: React.FC = () => {
  return (
    <BuyerWorkspace
      title="Search Properties"
      description="Browse available commercial spaces and refine your search with location, budget, and property-type filters."
      icon={<FiSearch aria-hidden="true" />}
    />
  );
};
