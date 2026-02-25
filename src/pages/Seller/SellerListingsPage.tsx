import React from 'react';
import { FiList } from 'react-icons/fi';
import { SellerWorkspace } from '../../components/SellerComponents';

export const SellerListingsPage: React.FC = () => {
  return (
    <SellerWorkspace
      title="My Listings"
      description="Manage all active and archived listings, pricing, and listing visibility."
      icon={<FiList aria-hidden="true" />}
    />
  );
};
