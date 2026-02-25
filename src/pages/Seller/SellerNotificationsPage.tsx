import React from 'react';
import { FiBell } from 'react-icons/fi';
import { SellerWorkspace } from '../../components/SellerComponents';

export const SellerNotificationsPage: React.FC = () => {
  return (
    <SellerWorkspace
      title="Notifications"
      description="Monitor offer alerts, lead activity, and listing reminders in real time."
      icon={<FiBell aria-hidden="true" />}
    />
  );
};
