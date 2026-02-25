import React from 'react';
import './SellerDashboard.css';

const METRICS = [
  { label: 'Active Listings', value: '28', meta: '+3 this month' },
  { label: 'Inbound Leads', value: '214', meta: '42 qualified' },
  { label: 'Average Deal Cycle', value: '32 days', meta: '-4 days QoQ' },
];

const PIPELINE = [
  { stage: 'New Inquiries', count: 58, trend: '+12%' },
  { stage: 'Tours Scheduled', count: 21, trend: '+4%' },
  { stage: 'Negotiations', count: 9, trend: '+1%' },
  { stage: 'Closed', count: 4, trend: '+2%' },
];

const HIGHLIGHTS = [
  {
    title: 'Iconic Tower, BKC',
    status: 'Offer Received',
    detail: 'Client requested revised layout for 180 seats.',
  },
  {
    title: 'Cyber Park Offices',
    status: 'Tour Completed',
    detail: 'Follow-up scheduled for Thursday 3 PM.',
  },
  {
    title: 'Aurum Business Bay',
    status: 'Negotiation',
    detail: 'Counter offer in progress.',
  },
];

export const SellerDashboard: React.FC = () => {
  return (
    <div className="seller-dashboard">
      <section className="seller-metrics">
        {METRICS.map((metric) => (
          <div key={metric.label} className="seller-metric-card">
            <p>{metric.label}</p>
            <h3>{metric.value}</h3>
            <span>{metric.meta}</span>
          </div>
        ))}
      </section>

      <section className="seller-pipeline">
        <div className="seller-section-header">
          <h2>Lead Pipeline</h2>
          <button type="button">View CRM</button>
        </div>
        <div className="seller-pipeline-grid">
          {PIPELINE.map((stage) => (
            <div key={stage.stage} className="seller-pipeline-card">
              <h4>{stage.stage}</h4>
              <p>{stage.count}</p>
              <span>{stage.trend}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="seller-highlights">
        <div className="seller-section-header">
          <h2>Priority Deals</h2>
          <button type="button">See All</button>
        </div>
        <div className="seller-highlights-list">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="seller-highlight-card">
              <div>
                <h3>{item.title}</h3>
                <span>{item.status}</span>
              </div>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
