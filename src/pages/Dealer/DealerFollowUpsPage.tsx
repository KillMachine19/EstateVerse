import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { DealerWorkspace } from '../../components/DealerComponents';
import './DealerPages.css';

const FOLLOW_UPS = [
  { id: 'FU-440', from: 'Buyer', contact: 'sara@orbital.in', summary: 'Needs revised floor plan for 140 seats.', due: 'Today', priority: 'High' },
  { id: 'FU-441', from: 'Seller', contact: 'owner@greenblock.com', summary: 'Requested buyer profile details before negotiation.', due: 'Tomorrow', priority: 'Medium' },
  { id: 'FU-442', from: 'Buyer', contact: 'amit@tetra.io', summary: 'Asking for parking and lock-in clarification.', due: '2 days', priority: 'High' },
];

export const DealerFollowUpsPage: React.FC = () => {
  return (
    <DealerWorkspace
      title="Follow Ups"
      description="Manage and respond to pending buyer/seller follow-ups so deals do not stall."
      icon={<FiMessageSquare aria-hidden="true" />}
    >
      <section className="dealer-page-panel">
        <table className="dealer-page-table" aria-label="Dealer follow up list">
          <thead>
            <tr>
              <th>Follow Up ID</th>
              <th>From</th>
              <th>Contact</th>
              <th>Summary</th>
              <th>Due</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {FOLLOW_UPS.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.from}</td>
                <td>{item.contact}</td>
                <td>{item.summary}</td>
                <td>{item.due}</td>
                <td>
                  <span className={`dealer-page-status ${item.priority === 'High' ? 'is-warning' : ''}`}>
                    {item.priority}
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
