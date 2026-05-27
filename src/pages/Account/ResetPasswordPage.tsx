import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import { RolePageShell } from '../../components/RolePageShell';
import axios from 'axios';
import { updatePassword } from '../../services/controllers/profileService';
import './ResetPasswordPage.css';

interface ResetPasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [isSaved, setIsSaved] = useState(false);
  const isFirstLoginReset = searchParams.get('firstLogin') === 'true';

  const validate = () => {
    const nextErrors: ResetPasswordErrors = {};

    if (!currentPassword.trim()) {
      nextErrors.currentPassword = 'Please enter your current password.';
    }

    if (!newPassword.trim()) {
      nextErrors.newPassword = 'Please enter a new password.';
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(newPassword)) {
      nextErrors.newPassword = 'Password must be at least 12 characters with 1 uppercase, 1 number, and 1 special character.';
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Please confirm your new password.';
    } else if (newPassword && confirmPassword !== newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsSaved(false);
    setApiError('');

    if (!validate()) {
      return;
    }
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    updatePassword({
      oldPassword: currentPassword,
      newPassword,
    })
      .then(() => {
        setIsSaved(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        window.localStorage.removeItem('estateverse_force_password_reset');
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            setErrors((prev) => ({ ...prev, currentPassword: 'Current password is incorrect.' }));
            return;
          }
          const apiMessage = typeof error.response?.data?.message === 'string' ? error.response.data.message : null;
          setApiError(apiMessage || 'Unable to update password right now.');
          return;
        }
        setApiError('Unable to update password right now.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <RolePageShell
      title="Reset Password"
      description="Choose a new password to keep your account secure."
      icon={<FiLock aria-hidden="true" />}
    >
      {isFirstLoginReset ? <p className="reset-password-status">Please reset your password to continue using your account.</p> : null}
      <form className="reset-password-form" onSubmit={handleSubmit} noValidate>
        <div className="reset-password-grid">
          <label className="reset-password-field">
            <span>Current Password <span className="reset-password-required">*</span></span>
            <div className="reset-password-input">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  setErrors((prev) => ({ ...prev, currentPassword: undefined }));
                }}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className="reset-password-visibility"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
              >
                {showCurrentPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
              </button>
            </div>
            {errors.currentPassword ? <small className="reset-password-error">{errors.currentPassword}</small> : null}
          </label>

          <label className="reset-password-field">
            <span>New Password <span className="reset-password-required">*</span></span>
            <div className="reset-password-input">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                className="reset-password-visibility"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              >
                {showNewPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
              </button>
            </div>
            {errors.newPassword ? <small className="reset-password-error">{errors.newPassword}</small> : null}
          </label>

          <label className="reset-password-field">
            <span>Confirm Password <span className="reset-password-required">*</span></span>
            <div className="reset-password-input">
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="Re-enter new password"
                required
              />
            </div>
            {errors.confirmPassword ? <small className="reset-password-error">{errors.confirmPassword}</small> : null}
          </label>
        </div>

        <div className="reset-password-actions">
          <button type="submit" className="reset-password-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
          {apiError ? <p className="reset-password-status reset-password-status--error">{apiError}</p> : null}
          {isSaved ? <p className="reset-password-status">Password updated successfully.</p> : null}
        </div>
      </form>
    </RolePageShell>
  );
};
