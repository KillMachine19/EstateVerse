import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FiSave, FiUpload, FiUser, FiUserCheck, FiX } from 'react-icons/fi';
import { AdminShell } from '../../components/AdminComponents/AdminShell';
import { DealersListTable, type DealerFormValues, type DealerIdProof } from '../../components/AdminComponents/DealerManagement';
import { getDealers, revokeDealerAccess, updateDealer, type DealerRecord } from '../../services/controllers';
import '../Account/ProfilePage.css';
import './AdminCreateDealerPage.css';
import './AdminDealersPage.css';

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

const normalizeIdProof = (value: string): DealerIdProof => {
  const normalized = value.trim().toUpperCase();
  if (normalized === 'PAN') return 'PAN';
  if (normalized === 'DL' || normalized === 'DRIVING_LICENSE') return 'DL';
  return 'AADHAR';
};

const toEditForm = (dealer: DealerRecord): DealerFormValues => ({
  email: dealer.email,
  password: '',
  name: dealer.name,
  phoneNumber: dealer.phoneNumber,
  address: dealer.address,
  verificationStatus: dealer.verificationStatus,
  idProof: normalizeIdProof(dealer.idProof),
  image: dealer.image ?? '',
  localities: dealer.localities.join(', '),
  dealClosedCount: dealer.dealClosedCount,
  aboutTheDealer: dealer.aboutTheDealer,
});

const validateEditForm = (form: DealerFormValues, localities: string[]): string => {
  if (!form.name.trim()) return 'Name is required.';
  if (!form.email.trim()) return 'Email is required.';
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Please enter a valid email.';
  if (!form.password.trim()) return 'Password is required.';
  if (!form.phoneNumber.trim() || !/^\d{10}$/.test(form.phoneNumber.trim())) return 'Phone number must be 10 digits.';
  if (!form.address.trim()) return 'Address is required.';
  if (!form.aboutTheDealer.trim()) return 'About The Dealer is required.';
  if (localities.length === 0) return 'Please add at least one locality.';
  return '';
};

export const AdminDealersPage: React.FC = () => {
  const [dealers, setDealers] = useState<DealerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<DealerFormValues | null>(null);
  const [editImagePreviewUrl, setEditImagePreviewUrl] = useState('');
  const [editLocalityInput, setEditLocalityInput] = useState('');
  const [editLocalities, setEditLocalities] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [dealerToRevoke, setDealerToRevoke] = useState<DealerRecord | null>(null);

  const loadDealers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getDealers();
      setDealers(response);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiMessage = typeof err.response?.data?.message === 'string' ? err.response.data.message : null;
        setError(apiMessage || 'Failed to load dealers.');
      } else {
        setError('Failed to load dealers.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDealers();
  }, []);

  const filteredDealers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return dealers;
    }
    return dealers.filter((dealer) => {
      const haystack = `${dealer.name} ${dealer.email} ${dealer.phoneNumber}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [dealers, searchQuery]);

  const selectedDealer = useMemo(
    () => dealers.find((dealer) => dealer.id === selectedDealerId) ?? null,
    [dealers, selectedDealerId]
  );

  const openEdit = (dealer: DealerRecord) => {
    const nextForm = toEditForm(dealer);
    setSelectedDealerId(dealer.id);
    setEditForm(nextForm);
    setEditImagePreviewUrl(nextForm.image);
    setEditLocalities(dealer.localities);
    setEditLocalityInput('');
    setError('');
    setSuccess('');
  };

  const updateEditField = <K extends keyof DealerFormValues>(key: K, value: DealerFormValues[K]) => {
    setEditForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setError('');
    setSuccess('');
  };

  const saveDealer: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!selectedDealer || !editForm) return;

    const validationMessage = validateEditForm(editForm, editLocalities);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const updated = await updateDealer(selectedDealer.id, {
        emailId: editForm.email.trim(),
        password: editForm.password,
        name: editForm.name.trim(),
        phoneNumber: editForm.phoneNumber.trim(),
        address: editForm.address.trim(),
        verificationStatus: editForm.verificationStatus,
        idProof: editForm.idProof,
        image: editForm.image || null,
        localities: editLocalities,
        dealClosedCount: selectedDealer.dealClosedCount,
        aboutTheDealer: editForm.aboutTheDealer.trim(),
      });
      setDealers((prev) => prev.map((dealer) => (dealer.id === updated.id ? updated : dealer)));
      const nextForm = toEditForm(updated);
      setEditForm(nextForm);
      setEditImagePreviewUrl(nextForm.image);
      setEditLocalities(updated.localities);
      setSuccess('Dealer updated successfully.');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiMessage = typeof err.response?.data?.message === 'string' ? err.response.data.message : null;
        setError(apiMessage || 'Failed to update dealer.');
      } else {
        setError('Failed to update dealer.');
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmRevokeDealer = async () => {
    if (!dealerToRevoke) {
      return;
    }
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const updated = await revokeDealerAccess(dealerToRevoke.id);
      setDealers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      if (selectedDealerId === updated.id) {
        const nextForm = toEditForm(updated);
        setEditForm(nextForm);
        setEditImagePreviewUrl(nextForm.image);
        setEditLocalities(updated.localities);
      }
      setSuccess(`Dealer ${dealerToRevoke.name} access revoked.`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiMessage = typeof err.response?.data?.message === 'string' ? err.response.data.message : null;
        setError(apiMessage || 'Failed to update dealer access.');
      } else {
        setError('Failed to update dealer access.');
      }
    } finally {
      setSaving(false);
      setDealerToRevoke(null);
    }
  };

  return (
    <AdminShell
      title="Dealer Management"
      description="View dealers, edit dealer profiles, and revoke dealer access."
      icon={<FiUserCheck aria-hidden="true" />}
    >
      {dealerToRevoke ? (
        <div className="admin-modal-overlay" role="presentation" onClick={() => setDealerToRevoke(null)}>
          <div className="admin-modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h3>Revoke Dealer Access</h3>
            <p>Are you sure you want to revoke access for <strong>{dealerToRevoke.name}</strong>?</p>
            <div className="admin-modal-actions">
              <button type="button" className="btn btn-outline btn-round" onClick={() => setDealerToRevoke(null)} disabled={saving}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger btn-round" onClick={() => void confirmRevokeDealer()} disabled={saving}>
                {saving ? 'Revoking...' : 'Revoke Access'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="admin-dealers-layout">
        <div className="admin-dealers-list card">
          <div className="admin-dealers-list-head">
            <h2>Dealers</h2>
            {loading ? <span>Loading...</span> : <span>{filteredDealers.length} total</span>}
          </div>
          <div className="admin-dealers-search">
            <input
              type="search"
              className="form-control"
              placeholder="Search by dealer name, email, or phone"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <DealersListTable
            dealers={filteredDealers}
            loading={loading}
            saving={saving}
            onEdit={openEdit}
            onRevokeRequest={setDealerToRevoke}
          />
        </div>

        <div className="admin-dealers-edit card">
          <h2>Edit Dealer</h2>
          {!selectedDealer || !editForm ? <p>Select a dealer to edit profile fields.</p> : null}
          {selectedDealer && editForm ? (
            <form className="profile-form" onSubmit={saveDealer} noValidate>
              <section className="profile-avatar-section">
                <div className="profile-avatar" aria-live="polite">
                  {editImagePreviewUrl ? (
                    <img className="profile-avatar-image" src={editImagePreviewUrl} alt="Dealer avatar preview" />
                  ) : (
                    <span className="profile-avatar-placeholder" aria-hidden="true">
                      <FiUser />
                    </span>
                  )}
                </div>
                <label className="profile-upload profile-upload--avatar">
                  <input
                    id="dealer-edit-profile-image"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const result = typeof reader.result === 'string' ? reader.result : '';
                        setEditImagePreviewUrl(result);
                        updateEditField('image', result);
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
                  <input value={editForm.name} onChange={(event) => updateEditField('name', event.target.value)} required disabled={saving} />
                </label>

                <label className="profile-field">
                  <span>Email ID <span className="profile-required">*</span></span>
                  <input type="email" value={editForm.email} onChange={(event) => updateEditField('email', event.target.value)} required disabled={saving} />
                </label>

                <label className="profile-field">
                  <span>Password <span className="profile-required">*</span></span>
                  <input type="password" value={editForm.password} onChange={(event) => updateEditField('password', event.target.value)} required disabled={saving} />
                </label>

                <label className="profile-field">
                  <span>Phone Number <span className="profile-required">*</span></span>
                  <input
                    value={editForm.phoneNumber}
                    onChange={(event) => updateEditField('phoneNumber', event.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    disabled={saving}
                  />
                </label>

                <label className="profile-field">
                  <span>Address <span className="profile-required">*</span></span>
                  <input value={editForm.address} onChange={(event) => updateEditField('address', event.target.value)} required disabled={saving} />
                </label>

                <label className="profile-field">
                  <span>ID Proof <span className="profile-required">*</span></span>
                  <select
                    value={editForm.idProof}
                    onChange={(event) => updateEditField('idProof', event.target.value as DealerFormValues['idProof'])}
                    required
                    disabled={saving}
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
                      {editLocalities.map((locality) => (
                        <div key={locality} className="dealer-locality-chip">
                          <span>{locality}</span>
                          <button
                            type="button"
                            onClick={() => setEditLocalities((prev) => prev.filter((item) => item !== locality))}
                            aria-label={`Remove ${locality}`}
                            disabled={saving}
                          >
                            <FiX aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                      <input
                        value={editLocalityInput}
                        onChange={(event) => setEditLocalityInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ',') {
                            event.preventDefault();
                            const value = editLocalityInput.replace(',', '').trim();
                            if (!value || editLocalities.some((item) => item.toLowerCase() === value.toLowerCase())) {
                              return;
                            }
                            setEditLocalities((prev) => [...prev, value]);
                            setEditLocalityInput('');
                          }
                        }}
                        placeholder={editLocalities.length < 10 ? 'Add locality and press Enter' : 'Max 10 localities'}
                        disabled={saving || editLocalities.length >= 10}
                      />
                    </div>
                    <div className="dealer-locality-suggestions">
                      {BENGALURU_LOCALITY_SUGGESTIONS.map((locality) => (
                        <button
                          key={locality}
                          type="button"
                          className="dealer-locality-suggestion"
                          onClick={() => {
                            if (editLocalities.some((item) => item.toLowerCase() === locality.toLowerCase())) {
                              return;
                            }
                            setEditLocalities((prev) => [...prev, locality]);
                          }}
                          disabled={saving || editLocalities.length >= 10 || editLocalities.some((item) => item.toLowerCase() === locality.toLowerCase())}
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
                    value={editForm.aboutTheDealer}
                    onChange={(event) => updateEditField('aboutTheDealer', event.target.value)}
                    required
                    disabled={saving}
                  />
                </label>
              </div>

              <section className="profile-panel profile-panel--verification">
                <h2>Verification Status</h2>
                <label className="admin-checkbox-field">
                  <input
                    type="checkbox"
                    checked={editForm.verificationStatus}
                    onChange={(event) => updateEditField('verificationStatus', event.target.checked)}
                    disabled={saving}
                  />
                  <span>{editForm.verificationStatus ? 'Verified' : 'Not Verified'}</span>
                </label>
              </section>

              <div className="profile-actions">
                <button type="submit" className="profile-save" disabled={saving}>
                  <FiSave aria-hidden="true" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </section>
      {error ? <p className="admin-dealer-feedback is-error">{error}</p> : null}
      {success ? <p className="admin-dealer-feedback is-success">{success}</p> : null}
    </AdminShell>
  );
};
