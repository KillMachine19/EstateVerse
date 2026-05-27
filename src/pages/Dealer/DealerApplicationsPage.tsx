import React from 'react';
import { FiPhoneCall } from 'react-icons/fi';
import { DealerWorkspace } from '../../components/DealerComponents';
import './DealerPages.css';

const CALL_SCHEDULED_APPLICATIONS = [
  { id: 'APP-901', buyer: 'sara@orbital.in', seller: 'leasing@aurum.com', property: 'Aurum Tower', slot: '11 Mar, 11:00 AM' },
  { id: 'APP-902', buyer: 'amit@tetra.io', seller: 'owner@greenblock.com', property: 'GreenBlock Offices', slot: '11 Mar, 4:30 PM' },
  { id: 'APP-903', buyer: 'ops@northlabs.com', seller: 'sales@lakeside.biz', property: 'Lakeside Tech Park', slot: '12 Mar, 10:00 AM' },
];

export const DealerApplicationsPage: React.FC = () => {
  return (
    <DealerWorkspace
      title="Applications (Call Scheduled)"
      description="View applications where calls have been scheduled and prepare next-step coordination."
      icon={<FiPhoneCall aria-hidden="true" />}
    >
      <section className="dealer-page-panel">
        <table className="dealer-page-table" aria-label="Dealer call scheduled applications">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Property</th>
              <th>Call Slot</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {CALL_SCHEDULED_APPLICATIONS.map((application) => (
              <tr key={application.id}>
                <td>{application.id}</td>
                <td>{application.buyer}</td>
                <td>{application.seller}</td>
                <td>{application.property}</td>
                <td>{application.slot}</td>
                <td><span className="dealer-page-status">Call Scheduled</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DealerWorkspace>
  );
};
