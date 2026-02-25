import React from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { PropertyListingForm } from '../../components/PropertyListingForm';
import { SellerWorkspace } from '../../components/SellerComponents';

export const SellerAddPropertyPage: React.FC = () => {
  return (
    <SellerWorkspace
      title="Add Property"
      description="Create a new listing with property details, media, and commercial highlights."
      icon={<FiPlusCircle aria-hidden="true" />}
    >
      <PropertyListingForm />
    </SellerWorkspace>
  );
};
