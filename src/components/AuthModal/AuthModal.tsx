import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { FiCheckCircle, FiKey, FiMail, FiRadio, FiUser, FiX } from 'react-icons/fi';
import { loginUser, registerUser, shouldForcePasswordReset } from '../../services/controllers/authService';
import {
  extractUserRoleFromSession,
  readStoredUserRole,
  type UserRole,
} from '../../utils/authRole';
import { readStoredAuthToken } from '../../utils/authToken';
import './AuthModal.css';

type AuthMode = 'signin' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (role: UserRole | null, options?: { forcePasswordReset?: boolean }) => Promise<void> | void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMode('signin');
      setAuthError('');
      setAuthSuccess('');
      setIsSubmitting(false);
      setUsername('');
      setPassword('');
      setFullName('');
      setAgreeTerms(false);
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

    const payload = {
      username: isSignUp ? (username.trim() || fullName.trim()) : username.trim(),
      password,
    };

    try {
      setIsSubmitting(true);
      if (isSignUp) {
        if (!agreeTerms) {
          setAuthError('Please agree to the terms and conditions.');
          setIsSubmitting(false);
          return;
        }
        await registerUser(payload);
        setAuthSuccess('Registration successful. You can now sign in.');
        setMode('signin');
      } else {
        const loginResponse = await loginUser(payload);
        const storedToken = readStoredAuthToken();
        if (!storedToken) {
          setAuthError('Login succeeded, but auth token is missing. Please try signing in again.');
          return;
        }
        const resolvedRole = extractUserRoleFromSession(loginResponse) ?? readStoredUserRole();
        await onAuthSuccess(resolvedRole, { forcePasswordReset: shouldForcePasswordReset(loginResponse) });
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
        className={`auth-modal ${isSignUp ? 'auth-modal-signup' : 'auth-modal-signin'}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-heading"
      >
        <button type="button" className="auth-modal-close" onClick={onClose} aria-label="Close authentication popup">
          <FiX aria-hidden="true" />
        </button>

        <div className="auth-page-shell">
          <div className="auth-mode-toggle" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={`auth-mode-option ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => {
                setMode('signin');
                setAuthError('');
                setAuthSuccess('');
              }}
              role="tab"
              aria-selected={mode === 'signin'}
            >
              <span>Sign In</span>
            </button>
            <button
              type="button"
              className={`auth-mode-option ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setMode('signup');
                setAuthError('');
                setAuthSuccess('');
              }}
              role="tab"
              aria-selected={mode === 'signup'}
            >
              <span>Sign Up</span>
            </button>
          </div>

          <div className="auth-content">
            {isSignUp && (
              <aside className="auth-signup-copy">
                <div className="auth-copy-block">
                  <h3>
                    <FiRadio aria-hidden="true" /> Marketing
                  </h3>
                  <p>We&apos;ve built a clear campaign flow for your listings and outreach.</p>
                </div>
                <div className="auth-copy-block">
                  <h3>
                    <FiCheckCircle aria-hidden="true" /> Fully Coded
                  </h3>
                  <p>Production-ready forms, APIs, and secure auth already integrated.</p>
                </div>
                <div className="auth-copy-block">
                  <h3>
                    <FiUser aria-hidden="true" /> Built Audience
                  </h3>
                  <p>Start capturing buyer and seller intent from day one.</p>
                </div>
              </aside>
            )}

            <section className={`auth-panel ${isSignUp ? 'auth-panel-signup' : 'auth-panel-signin'}`}>
              <h2 id="auth-modal-heading" className="auth-modal-title">
                {isSignUp ? 'Register' : 'Welcome Back'}
              </h2>

              <form className="auth-form" onSubmit={onSubmit}>
                {isSignUp && (
                  <label className="auth-field">
                    <span className="auth-label">
                      <FiUser aria-hidden="true" />
                      Full Name
                    </span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </label>
                )}

                <label className="auth-field">
                  <span className="auth-label">
                    {isSignUp ? <FiMail aria-hidden="true" /> : <FiUser aria-hidden="true" />}
                    {isSignUp ? 'Email' : 'Username or Email'}
                  </span>
                  <input
                    type={isSignUp ? 'email' : 'text'}
                    name="username"
                    placeholder={isSignUp ? 'Your Email' : 'Enter your username or email'}
                    autoComplete="username"
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value);
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
                    placeholder={isSignUp ? 'Create Password' : 'Enter your password'}
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
                  <label className="auth-checkbox-row">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(event) => setAgreeTerms(event.target.checked)}
                    />
                    <span>I agree to the terms and conditions.</span>
                  </label>
                )}

                {authError && <p className="auth-error">{authError}</p>}
                {authSuccess && <p className="auth-success">{authSuccess}</p>}

                <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Please wait...' : 'Get Started'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
