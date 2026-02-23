import React, { useEffect, useRef, useState } from 'react';
import './ScheduleCall.css';
import {
  INDIAN_PHONE_INPUT_PATTERN,
  validateEmailAddress,
  validateName,
  validatePhoneNumber,
  validateTime,
} from '../../utils/validation';

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
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    date: '',
    time: '',
  });
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
    setFieldErrors({
      name: '',
      email: '',
      phone: '',
      company: '',
      date: '',
      time: '',
    });
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
    if (name === 'name' && fieldErrors.name) {
      setFieldErrors((prev) => ({
        ...prev,
        name: value.trim() && !validateName(value) ? 'Please enter a valid name.' : '',
      }));
    }
    if (name === 'email' && fieldErrors.email) {
      setFieldErrors((prev) => ({
        ...prev,
        email: value.trim() && !validateEmailAddress(value) ? 'Please enter a valid email.' : '',
      }));
    }
    if (name === 'phone' && fieldErrors.phone) {
      setFieldErrors((prev) => ({
        ...prev,
        phone: value.trim() && !validatePhoneNumber(value) ? 'Please enter a valid Indian phone number.' : '',
      }));
    }
    if (name === 'company' && fieldErrors.company) {
      setFieldErrors((prev) => ({
        ...prev,
        company: value.trim() ? '' : 'Please enter your company name.',
      }));
    }
    if ((name === 'dateMonth' || name === 'dateDay') && fieldErrors.date) {
      setFieldErrors((prev) => ({
        ...prev,
        date: (name === 'dateMonth' ? value : values.dateMonth) && (name === 'dateDay' ? value : values.dateDay)
          ? ''
          : 'Please select your preferred date.',
      }));
    }
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const daysInSelectedMonth = values.dateMonth
    ? new Date(currentYear, Number(values.dateMonth), 0).getDate()
    : 31;
  const dayOptions = Array.from({ length: daysInSelectedMonth }, (_, i) => String(i + 1).padStart(2, '0'));
  const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const handleTimePartChange = (part: 'timeHour' | 'timeMinute' | 'timePeriod', value: string) => {
    if (error) setError(null);
    setValues((prev) => {
      const next = { ...prev, [part]: value };
      const { timeHour, timeMinute, timePeriod } = next;
      next.time = timeHour && timeMinute && timePeriod ? `${timeHour}:${timeMinute} ${timePeriod}` : '';
      if (fieldErrors.time) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          time: next.time && !validateTime(next.time) ? 'Please select a valid time.' : '',
        }));
      }
      return next;
    });
  };

  const getNameError = () => (!values.name.trim() || !validateName(values.name) ? 'Please enter a valid name.' : '');
  const getEmailError = () =>
    (!values.email.trim() || !validateEmailAddress(values.email) ? 'Please enter a valid email.' : '');
  const getPhoneError = () =>
    (!values.phone.trim() || !validatePhoneNumber(values.phone) ? 'Please enter a valid Indian phone number.' : '');
  const getCompanyError = () => (!values.company.trim() ? 'Please enter your company name.' : '');
  const getDateError = () => (!values.dateMonth || !values.dateDay ? 'Please select your preferred date.' : '');
  const getTimeError = () =>
    (!values.timeHour || !values.timeMinute || !values.timePeriod || !validateTime(values.time)
      ? 'Please select a valid time.'
      : '');

  const validate = () => {
    const nextFieldErrors = {
      name: getNameError(),
      email: getEmailError(),
      phone: getPhoneError(),
      company: getCompanyError(),
      date: getDateError(),
      time: getTimeError(),
    };
    setFieldErrors(nextFieldErrors);

    if (
      nextFieldErrors.name ||
      nextFieldErrors.email ||
      nextFieldErrors.phone ||
      nextFieldErrors.company ||
      nextFieldErrors.date ||
      nextFieldErrors.time
    ) {
      return '__FIELD_ERRORS__';
    }
    return null;
  };

  const handleFieldBlur = (field: 'name' | 'email' | 'phone' | 'company') => {
    const message = field === 'name'
      ? getNameError()
      : field === 'email'
        ? getEmailError()
        : field === 'phone'
          ? getPhoneError()
          : getCompanyError();
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleDateBlur = () => {
    setFieldErrors((prev) => ({ ...prev, date: getDateError() }));
  };

  const handleTimeBlur = () => {
    setFieldErrors((prev) => ({ ...prev, time: getTimeError() }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const err = validate();
    if (err) {
      setError(err === '__FIELD_ERRORS__' ? null : err);
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

      <form className="sc-form" onSubmit={handleSubmit} noValidate>
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
              onBlur={() => handleFieldBlur('name')}
              placeholder="Your name"
              required
            />
            {fieldErrors.name && <span className="sc-field-error">{fieldErrors.name}</span>}
          </label>
          <label className="sc-group">
            <span className="sc-label">Email Address <span className="sc-required">*</span></span>
            <input
              className="sc-control"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('email')}
              placeholder="you@company.com"
              required
            />
            {fieldErrors.email && <span className="sc-field-error">{fieldErrors.email}</span>}
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
              onBlur={() => handleFieldBlur('phone')}
              placeholder="+91 98765 43210"
              pattern={INDIAN_PHONE_INPUT_PATTERN}
              required
            />
            {fieldErrors.phone && <span className="sc-field-error">{fieldErrors.phone}</span>}
          </label>
          <label className="sc-group">
            <span className="sc-label">Company <span className="sc-required">*</span></span>
            <input
              className="sc-control"
              name="company"
              value={values.company}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('company')}
              placeholder="Company name"
              required
            />
            {fieldErrors.company && <span className="sc-field-error">{fieldErrors.company}</span>}
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
              onBlur={handleDateBlur}
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
              onBlur={handleDateBlur}
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
          {fieldErrors.date && <span className="sc-field-error">{fieldErrors.date}</span>}
        </label>

        <label className="sc-group">
          <span className="sc-label">Preferred Time <span className="sc-required">*</span></span>
          <div className="sc-row sc-row-time">
            <select
              className="sc-control sc-time-part"
              name="timeHour"
              value={values.timeHour}
              onChange={(e) => handleTimePartChange('timeHour', e.target.value)}
              onBlur={handleTimeBlur}
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
              onBlur={handleTimeBlur}
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
              onBlur={handleTimeBlur}
              required
            >
              <option value="">AM/PM</option>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          {fieldErrors.time && <span className="sc-field-error">{fieldErrors.time}</span>}
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
