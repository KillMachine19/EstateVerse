import React from 'react';
import { FiPhoneCall } from 'react-icons/fi';
import type { ScheduleVisitFormErrors, ScheduleVisitFormValues } from '../../utils/validation';

interface BuyerPropertyScheduleTabProps {
  connectForm: ScheduleVisitFormValues;
  connectErrors: ScheduleVisitFormErrors;
  connectLoading: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onInputChange: (field: keyof ScheduleVisitFormValues, value: string) => void;
  onPhoneKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

export const BuyerPropertyScheduleTab: React.FC<BuyerPropertyScheduleTabProps> = ({
  connectForm,
  connectErrors,
  connectLoading,
  onSubmit,
  onInputChange,
  onPhoneKeyDown,
}) => {
  return (
    <article className="buyer-property-schedule-tab">
      <h3><FiPhoneCall aria-hidden="true" /> Schedule A Call</h3>
      <form onSubmit={onSubmit} noValidate>
        <div className="buyer-schedule-input-card">
          <div className="buyer-connect-form">
            <div className="buyer-connect-field">
              <label htmlFor="buyer-connect-name" className="buyer-connect-label">Your Name *</label>
              <input
                id="buyer-connect-name"
                className={`form-control ${connectErrors.name ? 'is-invalid' : ''}`}
                type="text"
                placeholder="Your Name"
                value={connectForm.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                required
              />
              {connectErrors.name ? <p className="buyer-connect-error">{connectErrors.name}</p> : null}
            </div>
            <div className="buyer-connect-field">
              <label htmlFor="buyer-connect-email" className="buyer-connect-label">Email *</label>
              <input
                id="buyer-connect-email"
                className={`form-control ${connectErrors.email ? 'is-invalid' : ''}`}
                type="email"
                placeholder="name@example.com"
                value={connectForm.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                required
              />
              {connectErrors.email ? <p className="buyer-connect-error">{connectErrors.email}</p> : null}
            </div>
            <div className="buyer-connect-field">
              <label htmlFor="buyer-connect-phone" className="buyer-connect-label">Phone (India) *</label>
              <input
                id="buyer-connect-phone"
                className={`form-control ${connectErrors.phone ? 'is-invalid' : ''}`}
                type="tel"
                inputMode="numeric"
                pattern="[6-9]\d{9}"
                maxLength={10}
                placeholder="9876543210"
                value={connectForm.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                onKeyDown={onPhoneKeyDown}
                required
              />
              {connectErrors.phone ? <p className="buyer-connect-error">{connectErrors.phone}</p> : null}
            </div>
            <div className="buyer-connect-form-row">
              <div className="buyer-connect-field">
                <label htmlFor="buyer-connect-date" className="buyer-connect-label">Preferred Date *</label>
                <input
                  id="buyer-connect-date"
                  className={`form-control ${connectErrors.date ? 'is-invalid' : ''}`}
                  type="date"
                  value={connectForm.date}
                  onChange={(e) => onInputChange('date', e.target.value)}
                  required
                />
                {connectErrors.date ? <p className="buyer-connect-error">{connectErrors.date}</p> : null}
              </div>
              <div className="buyer-connect-field">
                <label htmlFor="buyer-connect-time" className="buyer-connect-label">Preferred Time *</label>
                <input
                  id="buyer-connect-time"
                  className={`form-control ${connectErrors.time ? 'is-invalid' : ''}`}
                  type="time"
                  value={connectForm.time}
                  onChange={(e) => onInputChange('time', e.target.value)}
                  required
                />
                {connectErrors.time ? <p className="buyer-connect-error">{connectErrors.time}</p> : null}
              </div>
            </div>
            <div className="buyer-connect-field">
              <label htmlFor="buyer-connect-note" className="buyer-connect-label">Message *</label>
              <textarea
                id="buyer-connect-note"
                className={`form-control ${connectErrors.note ? 'is-invalid' : ''}`}
                placeholder="Please share your requirements"
                rows={3}
                value={connectForm.note}
                onChange={(e) => onInputChange('note', e.target.value)}
                required
              />
              {connectErrors.note ? <p className="buyer-connect-error">{connectErrors.note}</p> : null}
            </div>
          </div>
        </div>
        <div className="buyer-schedule-submit-row">
          <button type="submit" className="btn btn-primary buyer-launch-modal-btn" disabled={connectLoading}>
            {connectLoading ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </form>
    </article>
  );
};
