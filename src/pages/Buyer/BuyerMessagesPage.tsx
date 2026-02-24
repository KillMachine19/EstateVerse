import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';

export const BuyerMessagesPage: React.FC = () => {
  return (
    <BuyerWorkspace
      title="Messages"
      description="Collaborate with sellers and agents through organized conversation threads."
      icon={<FiMessageSquare aria-hidden="true" />}
    />
  );
};
