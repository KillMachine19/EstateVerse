import React from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';

export const BuyerVerificationStatusPage: React.FC = () => {
  return (
    <BuyerWorkspace
      title="Verification Status"
      description="Track your KYC and profile verification progress here."
      icon={<FiCheckSquare aria-hidden="true" />}
    />
  );
};
