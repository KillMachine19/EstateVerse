import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ShortlistRemoveModal.css';

interface ShortlistRemoveModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ShortlistRemoveModal: React.FC<ShortlistRemoveModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="sc-overlay shortlist-remove-modal-overlay" role="presentation">
      <div className="sc-dialog shortlist-remove-modal" role="dialog" aria-modal="true" aria-labelledby="shortlist-remove-modal-title">
        <h3 id="shortlist-remove-modal-title">Remove From Shortlist?</h3>
        <p>This property will be removed from your shortlist.</p>
        <div className="shortlist-remove-modal-actions">
          <button type="button" className="shortlist-remove-modal-btn is-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="shortlist-remove-modal-btn is-danger" onClick={onConfirm}>
            Remove
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
