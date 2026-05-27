import React from 'react';
import { FiUsers } from 'react-icons/fi';
import { DealerDashboard, DealerWorkspace } from '../../components/DealerComponents';

export const DealerDashboardPage: React.FC = () => {
  return (
    <DealerWorkspace
      title="Dealer Dashboard"
      description="Track calls, broker follow-ups, and property review tasks between buyers and sellers."
      icon={<FiUsers aria-hidden="true" />}
    >
      <DealerDashboard />
    </DealerWorkspace>
  );
};
