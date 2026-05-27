import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { DealerWorkspace } from '../../components/DealerComponents';
import './DealerPages.css';

interface DealerProfileForm {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
  verificationStatus: boolean;
  idProof: string;
  image: string;
  localities: string;
  dealClosedCount: number;
  aboutTheDealer: string;
}

const DEFAULT_PROFILE: DealerProfileForm = {
  email: 'broker@estateverse.com',
  password: '************',
  name: 'Rohan Broker',
  phoneNumber: '9876543210',
  address: '54 MG Road, Bengaluru',
  verificationStatus: true,
  idProof: 'PAN',
  image: '',
  localities: 'Whitefield, Bellandur, HSR Layout',
  dealClosedCount: 42,
  aboutTheDealer: 'Commercial leasing broker focused on office spaces for growth-stage teams.',
};

export const DealerProfilePage: React.FC = () => {
  const [formData, setFormData] = useState<DealerProfileForm>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  const updateField = <K extends keyof DealerProfileForm>(field: K, value: DealerProfileForm[K]) => {
    setSaved(false);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DealerWorkspace
      title="Dealer Profile"
      description="View and update broker profile details visible to admins and internal teams."
      icon={<FiUser aria-hidden="true" />}
    >
      <form
        className="dealer-page-panel"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
        <div className="dealer-profile-grid">
          <div className="dealer-profile-field">
            <label htmlFor="dealer-email">Email ID</label>
            <input id="dealer-email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} required />
          </div>

          <div className="dealer-profile-field">
            <label htmlFor="dealer-password">Password</label>
            <input
              id="dealer-password"
              type="password"
              value={formData.password}
              onChange={(event) => updateField('password', event.target.value)}
              required
            />
          </div>

          <div className="dealer-profile-field">
            <label htmlFor="dealer-name">Name</label>
            <input id="dealer-name" value={formData.name} onChange={(event) => updateField('name', event.target.value)} required />
          </div>

          <div className="dealer-profile-field">
            <label htmlFor="dealer-phone">Phone Number</label>
            <input
              id="dealer-phone"
              value={formData.phoneNumber}
              onChange={(event) => updateField('phoneNumber', event.target.value.replace(/\D/g, '').slice(0, 10))}
              required
            />
          </div>

          <div className="dealer-profile-field">
            <label htmlFor="dealer-address">Address</label>
            <input id="dealer-address" value={formData.address} onChange={(event) => updateField('address', event.target.value)} required />
          </div>

          <div className="dealer-profile-field">
            <label htmlFor="dealer-id-proof">ID Proof</label>
            <input id="dealer-id-proof" value={formData.idProof} onChange={(event) => updateField('idProof', event.target.value)} required />
          </div>

          <div className="dealer-profile-field">
            <label htmlFor="dealer-image">Image URL</label>
            <input id="dealer-image" value={formData.image} onChange={(event) => updateField('image', event.target.value)} placeholder="https://..." />
          </div>

          <div className="dealer-profile-field">
            <label htmlFor="dealer-localities">Localities (comma separated)</label>
            <input
              id="dealer-localities"
              value={formData.localities}
              onChange={(event) => updateField('localities', event.target.value)}
              required
            />
          </div>

          <div className="dealer-profile-field">
            <label htmlFor="dealer-closed-count">DealClosedCount</label>
            <input
              id="dealer-closed-count"
              type="number"
              min={0}
              value={formData.dealClosedCount}
              onChange={(event) => updateField('dealClosedCount', Number(event.target.value))}
            />
          </div>

          <div className="dealer-profile-field">
            <label htmlFor="dealer-verified">Verification Status</label>
            <input
              id="dealer-verified"
              type="checkbox"
              checked={formData.verificationStatus}
              onChange={(event) => updateField('verificationStatus', event.target.checked)}
            />
          </div>

          <div className="dealer-profile-field is-full">
            <label htmlFor="dealer-about">AboutTheDealer</label>
            <textarea
              id="dealer-about"
              value={formData.aboutTheDealer}
              onChange={(event) => updateField('aboutTheDealer', event.target.value)}
              required
            />
          </div>
        </div>

        <div className="dealer-page-actions dealer-profile-actions">
          <button type="submit" className="dealer-page-btn is-primary">Save Profile</button>
        </div>
        {saved ? <p className="dealer-inline-note">Dealer profile changes saved.</p> : null}
      </form>
    </DealerWorkspace>
  );
};
