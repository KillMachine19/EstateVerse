import React, { useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { DealerWorkspace } from '../../components/DealerComponents';
import './DealerPages.css';

interface ReviewProperty {
  id: string;
  property: string;
  seller: string;
  locality: string;
  status: 'Pending' | 'Approved' | 'Removed';
}

const INITIAL_REVIEW_QUEUE: ReviewProperty[] = [
  { id: 'PR-201', property: 'Aurum Tower', seller: 'Aurum Estates', locality: 'Whitefield', status: 'Pending' },
  { id: 'PR-202', property: 'GreenBlock Offices', seller: 'GreenBlock Realty', locality: 'HSR Layout', status: 'Pending' },
  { id: 'PR-203', property: 'Lakeside Tech Park', seller: 'Lakeside Corp', locality: 'Bellandur', status: 'Pending' },
];

export const DealerReviewPropertiesPage: React.FC = () => {
  const [items, setItems] = useState<ReviewProperty[]>(INITIAL_REVIEW_QUEUE);

  const updateStatus = (propertyId: string, status: ReviewProperty['status']) => {
    setItems((prev) => prev.map((item) => (item.id === propertyId ? { ...item, status } : item)));
  };

  return (
    <DealerWorkspace
      title="Review Properties"
      description="Approve or remove listed properties as a broker-level quality checkpoint."
      icon={<FiCheckSquare aria-hidden="true" />}
    >
      <section className="dealer-page-panel">
        <table className="dealer-page-table" aria-label="Dealer property review queue">
          <thead>
            <tr>
              <th>Property ID</th>
              <th>Property</th>
              <th>Seller</th>
              <th>Locality</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.property}</td>
                <td>{item.seller}</td>
                <td>{item.locality}</td>
                <td>
                  <span className={`dealer-page-status ${item.status === 'Approved' ? 'is-success' : item.status === 'Pending' ? 'is-warning' : ''}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="dealer-page-actions">
                    <button type="button" className="dealer-page-btn is-primary" onClick={() => updateStatus(item.id, 'Approved')}>
                      Approve
                    </button>
                    <button type="button" className="dealer-page-btn is-danger" onClick={() => updateStatus(item.id, 'Removed')}>
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DealerWorkspace>
  );
};
