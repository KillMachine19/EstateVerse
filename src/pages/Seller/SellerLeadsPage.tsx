import React from 'react';
import { FiTag } from 'react-icons/fi';
import { SellerWorkspace } from '../../components/SellerComponents';

export const SellerLeadsPage: React.FC = () => {
  return (
    <SellerWorkspace
      title="Leads & Inquiries"
      description="Review incoming inquiries, qualify leads, and prioritize follow-up actions."
      icon={<FiTag aria-hidden="true" />}
    />
  );
};
