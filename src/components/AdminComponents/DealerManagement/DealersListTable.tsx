import React from 'react';
import { FiEdit2, FiUserX } from 'react-icons/fi';
import type { DealerRecord } from '../../../services/controllers';

interface DealersListTableProps {
  dealers: DealerRecord[];
  loading: boolean;
  saving: boolean;
  onEdit: (dealer: DealerRecord) => void;
  onRevokeRequest: (dealer: DealerRecord) => void;
}

export const DealersListTable: React.FC<DealersListTableProps> = ({
  dealers,
  loading,
  saving,
  onEdit,
  onRevokeRequest,
}) => {
  return (
    <div className="admin-dealers-table" role="table" aria-label="Dealer directory table">
      <div className="admin-dealers-row admin-dealers-row--head" role="row">
        <span>Dealer</span>
        <span>Status</span>
        <span>Deals</span>
        <span>Action</span>
      </div>
      {dealers.map((dealer) => (
        <div key={dealer.id} className="admin-dealers-row" role="row">
          <span>
            <strong>{dealer.name}</strong>
            <small>{dealer.email}</small>
          </span>
          <span className={`admin-dealer-tag ${dealer.active ? 'is-active' : 'is-revoked'}`}>
            {dealer.active ? 'Active' : 'Revoked'}
          </span>
          <span>{dealer.dealClosedCount}</span>
          <span className="admin-dealers-actions">
            <button
              type="button"
              className="admin-action-icon-btn"
              onClick={() => onEdit(dealer)}
              aria-label={`Edit ${dealer.name}`}
              title="Edit dealer"
            >
              <FiEdit2 aria-hidden="true" />
            </button>
            <button
              type="button"
              className="admin-action-icon-btn admin-action-icon-btn--revoke"
              onClick={() => onRevokeRequest(dealer)}
              aria-label={`Revoke ${dealer.name}`}
              title={dealer.active ? 'Revoke access' : 'Access revoked'}
              disabled={saving || !dealer.active}
            >
              <FiUserX aria-hidden="true" />
            </button>
          </span>
        </div>
      ))}
      {!loading && dealers.length === 0 ? <p>No dealers found.</p> : null}
    </div>
  );
};
