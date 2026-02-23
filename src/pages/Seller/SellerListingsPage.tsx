import React from 'react';
import { RolePageShell } from '../../components/RolePageShell';

export const SellerListingsPage: React.FC = () => {
  return (
    <RolePageShell
      title="My Listings"
      description="Manage all active and archived listings, pricing, and listing visibility."
    />
  );
};
