import React, { useEffect, useMemo, useState } from 'react';
import { FiSave, FiUpload, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';
import { validateEmailAddress, validateName, validatePhoneNumber } from '../../utils/validation';
import './BuyerProfilePage.css';

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

export const BuyerProfilePage: React.FC = () => {
  const [formData, setFormData] = useState<BuyerProfileForm>(defaultProfileForm);
  const [formErrors, setFormErrors] = useState<BuyerProfileErrors>({});
  const [isSaved, setIsSaved] = useState(false);
  const [isVerified] = useState(false);

  const imagePreviewUrl = useMemo(() => {
    if (!formData.image) {
      return '';
    }

    return URL.createObjectURL(formData.image);
  }, [formData.image]);

  useEffect(() => {
    if (!imagePreviewUrl) {
      return undefined;
    }

    return () => {
      URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

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

  const validateForm = () => {
    const nextErrors: BuyerProfileErrors = {};

    const nameError = getNameError();
    if (nameError) {
      nextErrors.name = nameError;
    }

    if (formData.contactNumber.trim().length > 0 && !validatePhoneNumber(formData.contactNumber)) {
      nextErrors.contactNumber = 'Enter a valid contact number.';
    }

    const emailError = getEmailError();
    if (emailError) {
      nextErrors.email = emailError;
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setIsSaved(false);
      return;
    }

    setIsSaved(true);
  };

  return (
    <BuyerWorkspace
      title="Buyer Profile"
      description="Add buyer details, target city, and your vertical focus to personalize opportunities."
      icon={<FiUser aria-hidden="true" />}
    >
      <form className="buyer-profile-form" onSubmit={handleSubmit} noValidate>
        <section className="buyer-profile-avatar-section">
          <div className="buyer-profile-avatar" aria-live="polite">
            {imagePreviewUrl ? (
              <img src={imagePreviewUrl} alt="Buyer profile picture preview" />
            ) : (
              <span className="buyer-profile-avatar-placeholder" aria-hidden="true">
                <FiUser />
              </span>
            )}
          </div>
          <label className="buyer-profile-upload buyer-profile-upload--avatar">
            <span className="buyer-profile-upload-label">Profile Picture</span>
            <input id="buyer-profile-image" type="file" accept="image/*" onChange={handleImageChange} />
            <span className="buyer-profile-upload-button">
              <FiUpload aria-hidden="true" />
              <span>Choose Image</span>
            </span>
          </label>
        </section>

        <div className="buyer-profile-grid">
          <label className="buyer-profile-field">
            <span>Name <span className="buyer-profile-required">*</span></span>
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
            />
            {formErrors.name ? <small className="buyer-profile-field-error">{formErrors.name}</small> : null}
          </label>

          <label className="buyer-profile-field">
            <span>Contact Number</span>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(event) => handleFieldChange('contactNumber', event.target.value)}
              onBlur={() => {
                if (!formData.contactNumber) {
                  return;
                }
                setFormErrors((prev) => ({
                  ...prev,
                  contactNumber: validatePhoneNumber(formData.contactNumber) ? undefined : 'Enter a valid contact number.',
                }));
              }}
              placeholder="Enter phone number"
            />
            {formErrors.contactNumber ? (
              <small className="buyer-profile-field-error">{formErrors.contactNumber}</small>
            ) : null}
          </label>

          <label className="buyer-profile-field">
            <span>Email ID <span className="buyer-profile-required">*</span></span>
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
            />
            {formErrors.email ? <small className="buyer-profile-field-error">{formErrors.email}</small> : null}
          </label>

          <label className="buyer-profile-field">
            <span>Location (City)</span>
            <input
              type="text"
              value={formData.city}
              onChange={(event) => handleFieldChange('city', event.target.value)}
              placeholder="Enter city"
              required
            />
          </label>
        </div>

        <section className="buyer-profile-panel buyer-profile-panel--verification">
          <h2>Verification Status</h2>
          <p className="buyer-profile-help">
            Status:{' '}
            <span className={`buyer-profile-verification ${isVerified ? 'is-verified' : 'is-unverified'}`}>
              {isVerified ? 'Verified' : 'Not Verified'}
            </span>
          </p>
          {!isVerified ? (
            <Link className="buyer-profile-verify-link" to="/buyer/verification-status">
              Go to Verification Status Page
            </Link>
          ) : null}
        </section>

        <div className="buyer-profile-actions">
          <button type="submit" className="buyer-profile-save">
            <FiSave aria-hidden="true" />
            <span>Save Profile</span>
          </button>
          {isSaved ? <p className="buyer-profile-status">Profile details saved successfully.</p> : null}
        </div>
      </form>
    </BuyerWorkspace>
  );
};
