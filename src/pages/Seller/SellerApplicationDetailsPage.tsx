import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCalendar, FiFileText } from 'react-icons/fi';
import { SellerWorkspace } from '../../components/SellerComponents';
import { SELLER_APPLICATIONS } from '../../data/sellerApplications';
import './SellerApplicationDetailsPage.css';

type DecisionMode = 'accept' | 'reject' | 'reschedule';

const REJECTION_REASONS = [
  'Budget mismatch',
  'Property unavailable',
  'Incomplete buyer profile',
  'Timeline mismatch',
  'Other',
];

export const SellerApplicationDetailsPage: React.FC = () => {
  const { applicationId = '' } = useParams();
  const application = useMemo(
    () => SELLER_APPLICATIONS.find((item) => item.id === applicationId) ?? null,
    [applicationId]
  );
  const [decisionMode, setDecisionMode] = useState<DecisionMode>('accept');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const scopedWindow = window as Window & { $?: any };
    const jq = scopedWindow.$;
    if (!jq || typeof jq !== 'function') {
      return;
    }
    if (typeof jq.fn?.datepicker !== 'function') {
      return;
    }

    jq('.seller-application-date-picker').each(function initDatePicker(this: HTMLElement) {
      jq(this)
        .datepicker({
          templates: {
            leftArrow: '<i class="now-ui-icons arrows-1_minimal-left"></i>',
            rightArrow: '<i class="now-ui-icons arrows-1_minimal-right"></i>',
          },
        })
        .on('show', function onShow(this: HTMLElement) {
          jq('.datepicker').addClass('open');
          const datepickerColor = jq(this).data('datepicker-color');
          if (datepickerColor) {
            jq('.datepicker').addClass(`datepicker-${datepickerColor}`);
          }
        })
        .on('hide', () => {
          jq('.datepicker').removeClass('open');
        });
    });

    return () => {
      if (typeof jq.fn?.datepicker === 'function') {
        jq('.seller-application-date-picker').datepicker('destroy');
      }
    };
  }, []);

  const handleAccept = () => {
    setActionMessage('Application accepted. Buyer will be notified.');
  };

  const handleReject = () => {
    if (!rejectionReason) {
      setActionMessage('Please choose a rejection reason.');
      return;
    }
    setActionMessage(`Application rejected. Reason: ${rejectionReason}.`);
  };

  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) {
      setActionMessage('Please choose both reschedule date and time.');
      return;
    }
    setActionMessage(`Visit rescheduled to ${rescheduleDate} at ${rescheduleTime}.`);
  };

  if (!application) {
    return (
      <SellerWorkspace
        title="Application Details"
        description="Review applicant details and respond with your decision."
        icon={<FiFileText aria-hidden="true" />}
      >
        <section className="seller-application-details">
          <p>Application not found.</p>
          <Link to="/seller/applications" className="seller-application-back-link">
            Back to applications
          </Link>
        </section>
      </SellerWorkspace>
    );
  }

  return (
    <SellerWorkspace
      title="Application Details"
      description="Review applicant details and respond with your decision."
      icon={<FiFileText aria-hidden="true" />}
    >
      <section className="seller-application-details">
        <div className="seller-application-details-card">
          <h2>{application.propertyTitle}</h2>
          <p><strong>Buyer:</strong> {application.buyerName}</p>
          <p><strong>Email:</strong> {application.buyerEmail}</p>
          <p><strong>Phone:</strong> {application.buyerPhone}</p>
          <p><strong>Preferred Slot:</strong> {application.preferredDate} at {application.preferredTime}</p>
          <p><strong>Notes:</strong> {application.notes}</p>
        </div>

        <div className="seller-application-details-card">
          <h3><FiCalendar aria-hidden="true" /> Respond To Application</h3>
          <div className="seller-application-decision-tabs" role="tablist" aria-label="Decision options">
            <button
              type="button"
              className={`seller-application-decision-tab ${decisionMode === 'accept' ? 'is-active' : ''}`}
              onClick={() => setDecisionMode('accept')}
            >
              Accept
            </button>
            <button
              type="button"
              className={`seller-application-decision-tab ${decisionMode === 'reject' ? 'is-active' : ''}`}
              onClick={() => setDecisionMode('reject')}
            >
              Reject
            </button>
            <button
              type="button"
              className={`seller-application-decision-tab ${decisionMode === 'reschedule' ? 'is-active' : ''}`}
              onClick={() => setDecisionMode('reschedule')}
            >
              Reschedule
            </button>
          </div>

          {decisionMode === 'reject' ? (
            <div className="seller-application-panel">
              <label htmlFor="seller-reject-reason" className="seller-application-label">Reason To Reject</label>
              <select
                id="seller-reject-reason"
                className="form-control seller-application-control"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
              >
                <option value="">Select reason</option>
                {REJECTION_REASONS.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
          ) : null}

          {decisionMode === 'reschedule' ? (
            <div className="seller-application-panel seller-application-panel--grid">
              <div className="form-group">
                <input
                  type="date"
                  className="form-control date-picker seller-application-control seller-application-date-picker"
                  value={rescheduleDate}
                  onChange={(event) => setRescheduleDate(event.target.value)}
                  data-datepicker-color="primary"
                />
              </div>
              <div className="form-group">
                <input
                  type="time"
                  className="form-control seller-application-control"
                  value={rescheduleTime}
                  onChange={(event) => setRescheduleTime(event.target.value)}
                />
              </div>
            </div>
          ) : null}

          <div className="seller-application-actions">
            {decisionMode === 'accept' ? (
              <button type="button" className="btn btn-primary" onClick={handleAccept}>
                Accept Application
              </button>
            ) : null}
            {decisionMode === 'reject' ? (
              <button type="button" className="btn btn-outline" onClick={handleReject}>
                Reject Application
              </button>
            ) : null}
            {decisionMode === 'reschedule' ? (
              <button type="button" className="btn btn-primary" onClick={handleReschedule}>
                Confirm Reschedule
              </button>
            ) : null}
          </div>
          {actionMessage ? <p className="seller-application-action-message">{actionMessage}</p> : null}
        </div>
      </section>
    </SellerWorkspace>
  );
};
