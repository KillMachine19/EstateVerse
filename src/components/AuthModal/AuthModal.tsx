import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import {
  FiBriefcase,
  FiHome,
  FiKey,
  FiTrendingUp,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { loginUser, registerUser } from '../../services/controllers/authService';
import './AuthModal.css';

type AuthMode = 'signin' | 'signup';
type Role = 'buyer' | 'seller';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => Promise<void> | void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [role, setRole] = useState<Role | null>(null);
  const [roleError, setRoleError] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setMode('signin');
      setRole(null);
      setRoleError(false);
      setAuthError('');
      setAuthSuccess('');
      setIsSubmitting(false);
      setEmail('');
      setPassword('');
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const isSignUp = mode === 'signup';

  const getErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
      const apiMessage = typeof error.response?.data?.message === 'string' ? error.response.data.message : null;
      return apiMessage || fallback;
    }
    return fallback;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setAuthError('');
    setAuthSuccess('');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (isSignUp && !role) {
      setRoleError(true);
      return;
    }

    const payload = {
      username: email.trim(),
      password,
    };

    try {
      setIsSubmitting(true);
      if (isSignUp) {
        await registerUser(payload);
        setAuthSuccess('Registration successful. You can now sign in.');
        setMode('signin');
        setRole(null);
      } else {
        await loginUser(payload);
        await onAuthSuccess();
        return;
      }
    } catch (error) {
      const message = isSignUp
        ? getErrorMessage(error, 'Sign up failed. Please try again.')
        : getErrorMessage(error, 'Login failed. Please check your email and password and try again.');
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="auth-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="auth-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-heading"
      >
        <button type="button" className="auth-modal-close" onClick={onClose} aria-label="Close authentication popup">
          <FiX aria-hidden="true" />
        </button>

        <h2 id="auth-modal-heading" className="auth-modal-title">
          Welcome to EstateVerse
        </h2>

        <div className="auth-mode-toggle" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={`auth-mode-option ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => {
              setMode('signin');
              setRoleError(false);
              setAuthError('');
              setAuthSuccess('');
            }}
            role="tab"
            aria-selected={mode === 'signin'}
          >
            <FiBriefcase aria-hidden="true" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            className={`auth-mode-option ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setMode('signup');
              setRoleError(false);
              setAuthError('');
              setAuthSuccess('');
            }}
            role="tab"
            aria-selected={mode === 'signup'}
          >
            <FiBriefcase aria-hidden="true" />
            <span>Sign Up</span>
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-field">
            <span className="auth-label">
              <FiUser aria-hidden="true" />
              Email
            </span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (authError) {
                  setAuthError('');
                }
              }}
              required
            />
          </label>

          <label className="auth-field">
            <span className="auth-label">
              <FiKey aria-hidden="true" />
              Password
            </span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (authError) {
                  setAuthError('');
                }
              }}
              required
            />
          </label>

          {isSignUp && (
            <div className="role-section">
              <p className="auth-label role-label">Who are you?</p>
              <div className="role-toggle" role="radiogroup" aria-label="Select user role">
                <button
                  type="button"
                  className={`role-option ${role === 'buyer' ? 'active buyer' : ''}`}
                  disabled={isSubmitting}
                  onClick={() => {
                    setRole('buyer');
                    setRoleError(false);
                  }}
                  aria-pressed={role === 'buyer'}
                >
                  <FiHome aria-hidden="true" />
                  Buyer
                </button>
                <button
                  type="button"
                  className={`role-option ${role === 'seller' ? 'active seller' : ''}`}
                  disabled={isSubmitting}
                  onClick={() => {
                    setRole('seller');
                    setRoleError(false);
                  }}
                  aria-pressed={role === 'seller'}
                >
                  <FiTrendingUp aria-hidden="true" />
                  Seller
                </button>
              </div>
              {roleError && <p className="role-error">Please select Buyer or Seller.</p>}
            </div>
          )}

          {authError && <p className="auth-error">{authError}</p>}
          {authSuccess && <p className="auth-success">{authSuccess}</p>}

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};
