import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText } from 'react-icons/fi';
import { SellerWorkspace } from '../../components/SellerComponents';
import { SELLER_APPLICATIONS } from '../../data/sellerApplications';
import './SellerApplicationsPage.css';

export const SellerApplicationsPage: React.FC = () => {
  const applications = useMemo(
    () => [...SELLER_APPLICATIONS].sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt)),
    []
  );

  return (
    <SellerWorkspace
      title="Applications Received"
      description="Review all buyer applications and respond with accept, reject, or reschedule actions."
      icon={<FiFileText aria-hidden="true" />}
    >
      <section className="seller-applications" aria-label="Seller applications list">
        {applications.length === 0 ? <p>No applications received yet.</p> : null}
        {applications.length > 0 ? (
          <div className="seller-applications-list">
            {applications.map((application) => (
              <Link
                key={application.id}
                to={`/seller/applications/${application.id}`}
                className="seller-application-item"
              >
                <div>
                  <p className="seller-application-item__title">{application.propertyTitle}</p>
                  <p className="seller-application-item__meta">
                    {application.buyerName} | {application.buyerEmail}
                  </p>
                </div>
                <div className="seller-application-item__right">
                  <span>{application.preferredDate} at {application.preferredTime}</span>
                  <strong>{application.status.toUpperCase()}</strong>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </SellerWorkspace>
  );
};
