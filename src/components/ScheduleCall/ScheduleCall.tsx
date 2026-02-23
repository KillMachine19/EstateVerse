import React, { useEffect, useRef, useState } from 'react';
import './ScheduleCall.css';

interface ScheduleCallProps {
  mode?: 'modal' | 'inline';
  sectionId?: string;
  triggerClassName?: string;
  triggerLabel?: string;
  onTriggerClick?: () => void;
}

export const ScheduleCall: React.FC<ScheduleCallProps> = ({
  mode = 'modal',
  sectionId = 'schedule-call',
  triggerClassName = '',
  triggerLabel = 'Schedule A Call',
  onTriggerClick,
}) => {
  const isInline = mode === 'inline';
  const [open, setOpen] = useState(isInline);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    datetime: '',
    message: '',
  });

  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setError(null);
    setSent(false);
    setValues({ name: '', email: '', phone: '', company: '', datetime: '', message: '' });
  };

  useEffect(() => {
    if (isInline) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', onKey);
      // focus first input
      setTimeout(() => firstInputRef.current?.focus(), 0);
    } else {
      document.removeEventListener('keydown', onKey);
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [isInline, open]);

  useEffect(() => {
    if (isInline) return;

    const handleOpen = () => setOpen(true);
    window.addEventListener('open-schedule-call', handleOpen);
    return () => window.removeEventListener('open-schedule-call', handleOpen);
  }, [isInline]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (error) setError(null);
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!values.name.trim()) return 'Please enter your name.';
    if (!values.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) return 'Please enter a valid email.';
    return null;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSubmitting(true);
    // simulate API call
    await new Promise(res => setTimeout(res, 800));
    setSubmitting(false);
    setSent(true);
    setTimeout(() => {
      if (!isInline) {
        setOpen(false);
      }
      resetForm();
    }, 1000);
  };

  const formBody = (
    <div className={`sc-dialog ${isInline ? 'sc-dialog-inline' : ''}`} onClick={(e) => e.stopPropagation()}>
      <header className="sc-header">
        <div>
          <h3 id="sc-title" className="sc-title">Schedule a Call</h3>
          <p className="sc-subtitle">Tell us what you need and we will confirm shortly.</p>
        </div>
        {!isInline && <button className="sc-close" aria-label="Close" onClick={() => setOpen(false)}>✕</button>}
      </header>

      <form className="sc-form" onSubmit={handleSubmit}>
        {error && <div className="sc-error">{error}</div>}

        <div className="sc-row sc-row-two">
          <label className="sc-group">
            <span className="sc-label">Full Name</span>
            <input
              className="sc-control"
              name="name"
              ref={firstInputRef}
              value={values.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </label>
          <label className="sc-group">
            <span className="sc-label">Email Address</span>
            <input
              className="sc-control"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="you@company.com"
            />
          </label>
        </div>

        <div className="sc-row sc-row-two">
          <label className="sc-group">
            <span className="sc-label">Phone Number</span>
            <input
              className="sc-control"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
          </label>
          <label className="sc-group">
            <span className="sc-label">Company</span>
            <input
              className="sc-control"
              name="company"
              value={values.company}
              onChange={handleChange}
              placeholder="Company name"
            />
          </label>
        </div>

        <label className="sc-group">
          <span className="sc-label">Preferred Date & Time</span>
          <input
            className="sc-control"
            name="datetime"
            type="datetime-local"
            value={values.datetime}
            onChange={handleChange}
          />
        </label>

        <label className="sc-group">
          <span className="sc-label">Message</span>
          <textarea
            className="sc-control sc-control-textarea"
            name="message"
            rows={4}
            value={values.message}
            onChange={handleChange}
            placeholder="Tell us property type, budget, and location preference."
          />
        </label>

        <footer className="sc-actions">
          <button
            type="button"
            className="sc-cancel"
            onClick={() => (isInline ? resetForm() : setOpen(false))}
          >
            {isInline ? 'Reset' : 'Cancel'}
          </button>
          <button type="submit" className="sc-submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Request Call'}
          </button>
        </footer>
      </form>

      {sent && <div className="sc-sent">Request sent ✓</div>}
    </div>
  );

  return (
    <>
      {!isInline && (
        <button
          className={`sc-trigger-btn ${triggerClassName}`}
          onClick={() => {
            onTriggerClick?.();
            setOpen(true);
          }}
          aria-haspopup="dialog"
        >
          {triggerLabel}
        </button>
      )}

      {isInline && (
        <section id={sectionId} className="sc-inline-section" aria-labelledby="sc-title">
          {formBody}
        </section>
      )}

      {!isInline && open && (
        <div
          className="sc-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sc-title"
          onClick={() => setOpen(false)}
        >
          {formBody}
        </div>
      )}
    </>
  );
};

export default ScheduleCall;
