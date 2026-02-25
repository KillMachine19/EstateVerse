import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { SellerWorkspace } from '../../components/SellerComponents';

export const SellerMessagesPage: React.FC = () => {
  return (
    <SellerWorkspace
      title="Messages"
      description="Respond to buyer questions and keep deal conversations moving efficiently."
      icon={<FiMessageSquare aria-hidden="true" />}
    />
  );
};
