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
    dateMonth: '',
    dateDay: '',
    timeHour: '',
    timeMinute: '',
    timePeriod: '',
    time: '',
    message: '',
  });
  const currentYear = new Date().getFullYear();
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setError(null);
    setSent(false);
    setValues({
      name: '',
      email: '',
      phone: '',
      company: '',
      dateMonth: '',
      dateDay: '',
      timeHour: '',
      timeMinute: '',
      timePeriod: '',
      time: '',
      message: '',
    });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (error) setError(null);
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const daysInSelectedMonth = values.dateMonth
    ? new Date(currentYear, Number(values.dateMonth), 0).getDate()
    : 31;
  const dayOptions = Array.from({ length: daysInSelectedMonth }, (_, i) => String(i + 1).padStart(2, '0'));
  const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const isValidIndianPhone = (phone: string) => {
    const normalized = phone.replace(/\s|-/g, '');
    return /^(\+91)?[6-9]\d{9}$/.test(normalized);
  };

  const handleTimePartChange = (part: 'timeHour' | 'timeMinute' | 'timePeriod', value: string) => {
    if (error) setError(null);
    setValues((prev) => {
      const next = { ...prev, [part]: value };
      const { timeHour, timeMinute, timePeriod } = next;
      next.time = timeHour && timeMinute && timePeriod ? `${timeHour}:${timeMinute} ${timePeriod}` : '';
      return next;
    });
  };

  const validate = () => {
    if (!values.name.trim()) return 'Please enter your name.';
    if (!values.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) return 'Please enter a valid email.';
    if (!values.phone.trim() || !isValidIndianPhone(values.phone)) return 'Please enter a valid Indian phone number.';
    if (!values.company.trim()) return 'Please enter your company name.';
    if (!values.dateMonth || !values.dateDay) return 'Please select your preferred date.';
    if (!values.timeHour || !values.timeMinute || !values.timePeriod) return 'Please select your preferred time.';
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
            <span className="sc-label">Full Name <span className="sc-required">*</span></span>
            <input
              className="sc-control"
              name="name"
              ref={firstInputRef}
              value={values.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </label>
          <label className="sc-group">
            <span className="sc-label">Email Address <span className="sc-required">*</span></span>
            <input
              className="sc-control"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
            />
          </label>
        </div>

        <div className="sc-row sc-row-two">
          <label className="sc-group">
            <span className="sc-label">Phone Number <span className="sc-required">*</span></span>
            <input
              className="sc-control"
              name="phone"
              type="tel"
              inputMode="numeric"
              value={values.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              pattern="^(\+91)?[6-9]\d{9}$"
              required
            />
          </label>
          <label className="sc-group">
            <span className="sc-label">Company <span className="sc-required">*</span></span>
            <input
              className="sc-control"
              name="company"
              value={values.company}
              onChange={handleChange}
              placeholder="Company name"
              required
            />
          </label>
        </div>

        <label className="sc-group">
          <span className="sc-label">Preferred Date <span className="sc-required">*</span></span>
          <div className="sc-row sc-row-two">
            <select
              className="sc-control"
              name="dateMonth"
              value={values.dateMonth}
              onChange={handleChange}
              required
            >
              <option value="">Select month</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <select
              className="sc-control"
              name="dateDay"
              value={values.dateDay}
              onChange={handleChange}
              required
            >
              <option value="">Select day</option>
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="sc-group">
          <span className="sc-label">Preferred Time <span className="sc-required">*</span></span>
          <div className="sc-row sc-row-time">
            <select
              className="sc-control sc-time-part"
              name="timeHour"
              value={values.timeHour}
              onChange={(e) => handleTimePartChange('timeHour', e.target.value)}
              required
            >
              <option value="">Hour</option>
              {hourOptions.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <select
              className="sc-control sc-time-part"
              name="timeMinute"
              value={values.timeMinute}
              onChange={(e) => handleTimePartChange('timeMinute', e.target.value)}
              required
            >
              <option value="">Minute</option>
              {minuteOptions.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
            <select
              className="sc-control sc-time-part"
              name="timePeriod"
              value={values.timePeriod}
              onChange={(e) => handleTimePartChange('timePeriod', e.target.value)}
              required
            >
              <option value="">AM/PM</option>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
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
