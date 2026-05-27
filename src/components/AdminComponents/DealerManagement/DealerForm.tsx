import React from 'react';
import { DEALER_ID_PROOF_OPTIONS, type DealerFormValues } from './types';
import { DealerAvatarUpload } from './DealerAvatarUpload';

interface DealerFormProps {
  values: DealerFormValues;
  onChange: <K extends keyof DealerFormValues>(key: K, value: DealerFormValues[K]) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  submitLabel: string;
  showPassword?: boolean;
}

export const DealerForm: React.FC<DealerFormProps> = ({
  values,
  onChange,
  onSubmit,
  submitting,
  submitLabel,
  showPassword = false,
}) => {
  return (
    <form className="admin-dealer-form" onSubmit={onSubmit}>
      <div className="admin-dealer-form-grid">
        <div className="is-full">
          <DealerAvatarUpload image={values.image} onImageChange={(value) => onChange('image', value)} />
        </div>

        <label>
          <span>Email ID</span>
          <input
            className="form-control"
            type="email"
            value={values.email}
            onChange={(event) => onChange('email', event.target.value)}
            required
          />
        </label>

        {showPassword ? (
          <label>
            <span>Password</span>
            <input
              className="form-control"
              type="password"
              value={values.password}
              onChange={(event) => onChange('password', event.target.value)}
              required
            />
          </label>
        ) : null}

        <label>
          <span>Name</span>
          <input className="form-control" value={values.name} onChange={(event) => onChange('name', event.target.value)} required />
        </label>

        <label>
          <span>Phone Number</span>
          <input
            className="form-control"
            value={values.phoneNumber}
            onChange={(event) => onChange('phoneNumber', event.target.value.replace(/\D/g, '').slice(0, 10))}
            required
          />
        </label>

        <label>
          <span>Address</span>
          <input className="form-control" value={values.address} onChange={(event) => onChange('address', event.target.value)} required />
        </label>

        <label>
          <span>ID Proof</span>
          <select
            className="form-control"
            value={values.idProof}
            onChange={(event) => onChange('idProof', event.target.value as DealerFormValues['idProof'])}
            required
          >
            {DEALER_ID_PROOF_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Localities (comma separated)</span>
          <input
            className="form-control"
            value={values.localities}
            onChange={(event) => onChange('localities', event.target.value)}
            required
          />
        </label>

        <label>
          <span>DealClosedCount</span>
          <input
            className="form-control"
            type="number"
            min={0}
            value={values.dealClosedCount}
            onChange={(event) => onChange('dealClosedCount', Number(event.target.value))}
          />
        </label>

        <label className="admin-checkbox-field">
          <input
            type="checkbox"
            checked={values.verificationStatus}
            onChange={(event) => onChange('verificationStatus', event.target.checked)}
          />
          <span>Verification Status</span>
        </label>

        <label className="is-full">
          <span>About The Dealer</span>
          <textarea
            className="form-control"
            value={values.aboutTheDealer}
            onChange={(event) => onChange('aboutTheDealer', event.target.value)}
            required
          />
        </label>
      </div>

      <div className="admin-dealer-form-actions">
        <button type="submit" className="btn btn-primary btn-round" disabled={submitting}>
          {submitting ? 'Please wait...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
