import React from 'react';
import { FiTag } from 'react-icons/fi';
import { DealerWorkspace } from '../../components/DealerComponents';
import './DealerPages.css';

const DEAL_STATUS = [
  { id: 'DEAL-71', property: 'Aurum Tower', buyer: 'Orbital Tech', seller: 'Aurum Estates', stage: 'Negotiation' },
  { id: 'DEAL-72', property: 'GreenBlock Offices', buyer: 'Tetra Systems', seller: 'GreenBlock Realty', stage: 'Documentation' },
  { id: 'DEAL-73', property: 'Lakeside Tech Park', buyer: 'North Labs', seller: 'Lakeside Corp', stage: 'Closed' },
];

export const DealerDealsPage: React.FC = () => {
  return (
    <DealerWorkspace
      title="Deal Status"
      description="Track each brokered deal from negotiation to closure."
      icon={<FiTag aria-hidden="true" />}
    >
      <section className="dealer-page-panel">
        <table className="dealer-page-table" aria-label="Dealer deal status list">
          <thead>
            <tr>
              <th>Deal ID</th>
              <th>Property</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Stage</th>
            </tr>
          </thead>
          <tbody>
            {DEAL_STATUS.map((deal) => (
              <tr key={deal.id}>
                <td>{deal.id}</td>
                <td>{deal.property}</td>
                <td>{deal.buyer}</td>
                <td>{deal.seller}</td>
                <td>
                  <span className={`dealer-page-status ${deal.stage === 'Closed' ? 'is-success' : ''}`}>
                    {deal.stage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DealerWorkspace>
  );
};
