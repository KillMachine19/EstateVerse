import React, { useState } from 'react';
import axios from 'axios';
import { FiSave, FiUpload, FiUser, FiUserPlus, FiX } from 'react-icons/fi';
import { AdminShell } from '../../components/AdminComponents/AdminShell';
import { INITIAL_DEALER_FORM, type DealerFormValues } from '../../components/AdminComponents/DealerManagement';
import { createDealer } from '../../services/controllers';
import '../Account/ProfilePage.css';
import './AdminDealersPage.css';
import './AdminCreateDealerPage.css';

const BENGALURU_LOCALITY_SUGGESTIONS = [
  'Whitefield',
  'Indiranagar',
  'Koramangala',
  'HSR Layout',
  'Electronic City',
  'Sarjapur Road',
  'Bellandur',
  'Marathahalli',
  'MG Road',
  'Jayanagar',
];

export const AdminCreateDealerPage: React.FC = () => {
  const [formData, setFormData] = useState<DealerFormValues>(INITIAL_DEALER_FORM);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [localityInput, setLocalityInput] = useState('');
  const [localities, setLocalities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = <K extends keyof DealerFormValues>(key: K, value: DealerFormValues[K]) => {
    setError('');
    setSuccess('');
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (localities.length === 0) {
      setError('Please add at least one locality.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await createDealer({
        emailId: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        verificationStatus: formData.verificationStatus,
        idProof: formData.idProof,
        image: formData.image || null,
        localities,
        aboutTheDealer: formData.aboutTheDealer.trim(),
        dealClosedCount: 0,
        forcePasswordReset: true,
      });
      setSuccess('Dealer created successfully. They will be prompted to reset password on first login.');
      setFormData(INITIAL_DEALER_FORM);
      setImagePreviewUrl('');
      setLocalities([]);
      setLocalityInput('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiMessage = typeof err.response?.data?.message === 'string' ? err.response.data.message : null;
        setError(apiMessage || 'Failed to create dealer profile.');
      } else {
        setError('Failed to create dealer profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell
      title="Create Dealer"
      description="Create a new dealer profile. Admin sets initial password and the dealer must reset it on first login."
      icon={<FiUserPlus aria-hidden="true" />}
    >
      <section className="admin-dealers-edit card">
        <form className="profile-form" onSubmit={onSubmit} noValidate>
          <section className="profile-avatar-section">
            <div className="profile-avatar" aria-live="polite">
              {imagePreviewUrl ? (
                <img className="profile-avatar-image" src={imagePreviewUrl} alt="Dealer avatar preview" />
              ) : (
                <span className="profile-avatar-placeholder" aria-hidden="true">
                  <FiUser />
                </span>
              )}
            </div>
            <label className="profile-upload profile-upload--avatar">
              <input
                id="dealer-profile-image"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = typeof reader.result === 'string' ? reader.result : '';
                    setImagePreviewUrl(result);
                    updateField('image', result);
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <span className="profile-upload-button">
                <FiUpload aria-hidden="true" />
                <span>Choose Image</span>
              </span>
            </label>
          </section>

          <div className="profile-grid dealer-create-grid">
            <label className="profile-field">
              <span>Name <span className="profile-required">*</span></span>
              <input value={formData.name} onChange={(event) => updateField('name', event.target.value)} required disabled={loading} />
            </label>

            <label className="profile-field">
              <span>Email ID <span className="profile-required">*</span></span>
              <input type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} required disabled={loading} />
            </label>

            <label className="profile-field">
              <span>Password <span className="profile-required">*</span></span>
              <input type="password" value={formData.password} onChange={(event) => updateField('password', event.target.value)} required disabled={loading} />
            </label>

            <label className="profile-field">
              <span>Phone Number <span className="profile-required">*</span></span>
              <input
                value={formData.phoneNumber}
                onChange={(event) => updateField('phoneNumber', event.target.value.replace(/\D/g, '').slice(0, 10))}
                required
                disabled={loading}
              />
            </label>

            <label className="profile-field">
              <span>Address <span className="profile-required">*</span></span>
              <input value={formData.address} onChange={(event) => updateField('address', event.target.value)} required disabled={loading} />
            </label>

            <label className="profile-field">
              <span>ID Proof <span className="profile-required">*</span></span>
              <select
                value={formData.idProof}
                onChange={(event) => updateField('idProof', event.target.value as DealerFormValues['idProof'])}
                required
                disabled={loading}
              >
                <option value="AADHAR">Aadhar</option>
                <option value="PAN">PAN</option>
                <option value="DL">Driving License</option>
              </select>
            </label>

            <label className="profile-field">
              <span>Localities <span className="profile-required">*</span></span>
              <div className="dealer-localities-field">
                <div className="dealer-locality-chips">
                  {localities.map((locality) => (
                    <div key={locality} className="dealer-locality-chip">
                      <span>{locality}</span>
                      <button
                        type="button"
                        onClick={() => setLocalities((prev) => prev.filter((item) => item !== locality))}
                        aria-label={`Remove ${locality}`}
                        disabled={loading}
                      >
                        <FiX aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  <input
                    value={localityInput}
                    onChange={(event) => setLocalityInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ',') {
                        event.preventDefault();
                        const value = localityInput.replace(',', '').trim();
                        if (!value || localities.some((item) => item.toLowerCase() === value.toLowerCase())) {
                          return;
                        }
                        setLocalities((prev) => [...prev, value]);
                        setLocalityInput('');
                      }
                    }}
                    placeholder={localities.length < 10 ? 'Add locality and press Enter' : 'Max 10 localities'}
                    disabled={loading || localities.length >= 10}
                  />
                </div>
                <div className="dealer-locality-suggestions">
                  {BENGALURU_LOCALITY_SUGGESTIONS.map((locality) => (
                    <button
                      key={locality}
                      type="button"
                      className="dealer-locality-suggestion"
                      onClick={() => {
                        if (localities.some((item) => item.toLowerCase() === locality.toLowerCase())) {
                          return;
                        }
                        setLocalities((prev) => [...prev, locality]);
                      }}
                      disabled={loading || localities.length >= 10 || localities.some((item) => item.toLowerCase() === locality.toLowerCase())}
                    >
                      {locality}
                    </button>
                  ))}
                </div>
              </div>
            </label>

            <label className="profile-field dealer-create-full-width">
              <span>About The Dealer <span className="profile-required">*</span></span>
              <textarea
                value={formData.aboutTheDealer}
                onChange={(event) => updateField('aboutTheDealer', event.target.value)}
                required
                disabled={loading}
              />
            </label>
          </div>

          <section className="profile-panel profile-panel--verification">
            <h2>Verification Status</h2>
            <label className="admin-checkbox-field">
              <input
                type="checkbox"
                checked={formData.verificationStatus}
                onChange={(event) => updateField('verificationStatus', event.target.checked)}
                disabled={loading}
              />
              <span>{formData.verificationStatus ? 'Verified' : 'Not Verified'}</span>
            </label>
          </section>

          <div className="profile-actions">
            <button type="submit" className="profile-save" disabled={loading}>
              <FiSave aria-hidden="true" />
              <span>{loading ? 'Creating...' : 'Create Dealer'}</span>
            </button>
          </div>
        </form>
        {error ? <p className="admin-dealer-feedback is-error">{error}</p> : null}
        {success ? <p className="admin-dealer-feedback is-success">{success}</p> : null}
      </section>
    </AdminShell>
  );
};
