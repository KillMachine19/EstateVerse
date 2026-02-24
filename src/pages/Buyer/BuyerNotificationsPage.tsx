import React from 'react';
import { FiBell } from 'react-icons/fi';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';

export const BuyerNotificationsPage: React.FC = () => {
  return (
    <BuyerWorkspace
      title="Notifications"
      description="Stay informed about listing updates, offer responses, and application events."
      icon={<FiBell aria-hidden="true" />}
    />
  );
};
