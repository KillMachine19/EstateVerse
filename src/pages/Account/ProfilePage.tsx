import React, { useEffect, useMemo, useState } from 'react';
import { FiSave, FiUpload, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { RolePageShell } from '../../components/RolePageShell';
import { validateEmailAddress, validateName } from '../../utils/validation';
import axios from 'axios';
import { getProfile, updateProfile } from '../../services/controllers/profileService';
import './ProfilePage.css';

interface BuyerProfileForm {
  name: string;
  contactNumber: string;
  email: string;
  city: string;
  image: File | null;
}

interface BuyerProfileErrors {
  name?: string;
  contactNumber?: string;
  email?: string;
}

const defaultProfileForm: BuyerProfileForm = {
  name: '',
  contactNumber: '',
  email: '',
  city: '',
  image: null,
};

export const ProfilePage: React.FC = () => {
  const [formData, setFormData] = useState<BuyerProfileForm>(defaultProfileForm);
  const [formErrors, setFormErrors] = useState<BuyerProfileErrors>({});
  const [isSaved, setIsSaved] = useState(false);
  const [isVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  useEffect(() => {
    if (!formData.image) {
      setImagePreviewUrl('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setImagePreviewUrl(result);
    };
    reader.onerror = () => {
      setImagePreviewUrl('');
    };
    reader.readAsDataURL(formData.image);
  }, [formData.image]);

  const handleFieldChange = (field: Exclude<keyof BuyerProfileForm, 'image'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsSaved(false);
  };

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, image: file }));
    setIsSaved(false);
  };

  const getNameError = () => {
    if (!formData.name.trim()) {
      return 'Please enter your name.';
    }

    if (!validateName(formData.name)) {
      return 'Please enter a valid name.';
    }

    return '';
  };

  const getEmailError = () => {
    if (!formData.email.trim()) {
      return 'Please enter your email.';
    }

    if (!validateEmailAddress(formData.email)) {
      return 'Please enter a valid email.';
    }

    return '';
  };

  const getPhoneError = () => {
    if (!formData.contactNumber.trim()) {
      return 'Please enter your contact number.';
    }

    if (!/^\d{10}$/.test(formData.contactNumber)) {
      return 'Enter a valid contact number.';
    }

    return '';
  };

  const hasProfileData = useMemo(
    () => Boolean(formData.name || formData.email || formData.contactNumber || formData.city),
    [formData.name, formData.email, formData.contactNumber, formData.city]
  );

  const validateForm = () => {
    const nextErrors: BuyerProfileErrors = {};

    const nameError = getNameError();
    if (nameError) {
      nextErrors.name = nameError;
    }

    const phoneError = getPhoneError();
    if (phoneError) {
      nextErrors.contactNumber = phoneError;
    }

    const emailError = getEmailError();
    if (emailError) {
      nextErrors.email = emailError;
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setApiError('');
    setIsSaved(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await updateProfile({
        name: formData.name.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.contactNumber.trim() || null,
        city: formData.city.trim() || null,
      });
      setFormData((prev) => ({
        ...prev,
        name: updated.name ?? '',
        email: updated.email ?? '',
        contactNumber: updated.phone ?? '',
        city: updated.city ?? '',
      }));
      setIsSaved(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiMessage = typeof error.response?.data?.message === 'string' ? error.response.data.message : null;
        setApiError(apiMessage || 'Unable to update profile right now.');
      } else {
        setApiError('Unable to update profile right now.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        if (!isMounted) return;
        setFormData({
          name: profile.name ?? '',
          contactNumber: profile.phone ?? '',
          email: profile.email ?? '',
          city: profile.city ?? '',
          image: null,
        });
      } catch (error) {
        if (!isMounted) return;
        if (axios.isAxiosError(error)) {
          const apiMessage = typeof error.response?.data?.message === 'string' ? error.response.data.message : null;
          setApiError(apiMessage || 'Unable to load profile right now.');
        } else {
          setApiError('Unable to load profile right now.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <RolePageShell
      title="Profile"
      description="Manage your account details, profile picture, and verification status."
    >
      <form className="profile-form" onSubmit={handleSubmit} noValidate>
        <section className="profile-avatar-section">
          <div className="profile-avatar" aria-live="polite">
            {imagePreviewUrl ? (
              <img
                className="profile-avatar-image"
                src={imagePreviewUrl}
                alt="Profile picture preview"
              />
            ) : (
              <span className="profile-avatar-placeholder" aria-hidden="true">
                <FiUser />
              </span>
            )}
          </div>
          <label className="profile-upload profile-upload--avatar">
            <span className="profile-upload-label">Profile Picture</span>
            <input id="buyer-profile-image" type="file" accept="image/*" onChange={handleImageChange} />
            <span className="profile-upload-button">
              <FiUpload aria-hidden="true" />
              <span>Choose Image</span>
            </span>
          </label>
        </section>

        <div className="profile-grid">
          <label className="profile-field">
            <span>Name <span className="profile-required">*</span></span>
            <input
              type="text"
              value={formData.name}
              onChange={(event) => handleFieldChange('name', event.target.value)}
              onBlur={() => {
                setFormErrors((prev) => ({
                  ...prev,
                  name: getNameError() || undefined,
                }));
              }}
              placeholder="Enter full name"
              required
              disabled={isLoading || isSubmitting}
            />
            {formErrors.name ? <small className="profile-field-error">{formErrors.name}</small> : null}
          </label>

          <label className="profile-field">
            <span>Contact Number <span className="profile-required">*</span></span>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(event) => {
                const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 10);
                handleFieldChange('contactNumber', digitsOnly);
              }}
              onBlur={() => {
                setFormErrors((prev) => ({
                  ...prev,
                  contactNumber: getPhoneError() || undefined,
                }));
              }}
              placeholder="Enter phone number"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              required
              disabled={isLoading || isSubmitting}
            />
            {formErrors.contactNumber ? (
              <small className="profile-field-error">{formErrors.contactNumber}</small>
            ) : null}
          </label>

          <label className="profile-field">
            <span>Email ID <span className="profile-required">*</span></span>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => handleFieldChange('email', event.target.value)}
              onBlur={() => {
                setFormErrors((prev) => ({
                  ...prev,
                  email: getEmailError() || undefined,
                }));
              }}
              placeholder="Enter email address"
              required
              disabled={isLoading || isSubmitting}
            />
            {formErrors.email ? <small className="profile-field-error">{formErrors.email}</small> : null}
          </label>

          <label className="profile-field">
            <span>Location (City)</span>
            <input
              type="text"
              value={formData.city}
              onChange={(event) => handleFieldChange('city', event.target.value)}
              placeholder="Enter city"
              required
              disabled={isLoading || isSubmitting}
            />
          </label>
        </div>

        <section className="profile-panel profile-panel--verification">
          <h2>Verification Status</h2>
          <p className="profile-help">
            Status:{' '}
            <span className={`profile-verification ${isVerified ? 'is-verified' : 'is-unverified'}`}>
              {isVerified ? 'Verified' : 'Not Verified'}
            </span>
          </p>
          {!isVerified ? (
            <Link className="profile-verify-link" to="/verification-status">
              Go to Verification Status Page
            </Link>
          ) : null}
        </section>

        <div className="profile-actions">
          <button type="submit" className="profile-save" disabled={isLoading || isSubmitting || !hasProfileData}>
            <FiSave aria-hidden="true" />
            <span>{isSubmitting ? 'Saving...' : 'Save Profile'}</span>
          </button>
          {apiError ? <p className="profile-status profile-status--error">{apiError}</p> : null}
          {isSaved ? <p className="profile-status">Profile details saved successfully.</p> : null}
        </div>
      </form>
    </RolePageShell>
  );
};
