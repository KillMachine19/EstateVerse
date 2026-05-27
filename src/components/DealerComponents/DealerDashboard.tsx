import React from 'react';
import './DealerDashboard.css';

const METRICS = [
  { label: 'Scheduled Calls', value: '26', meta: '8 today' },
  { label: 'Active Follow Ups', value: '19', meta: 'Buyer and seller threads' },
  { label: 'Deals Closed', value: '42', meta: '+5 this quarter' },
];

const PIPELINE = [
  { stage: 'Call Scheduled', count: 14 },
  { stage: 'Negotiation', count: 8 },
  { stage: 'Documentation', count: 4 },
  { stage: 'Closed', count: 2 },
];

const REVIEW_QUEUE = [
  'Aurum Tower, Whitefield - pending compliance review',
  'GreenBlock Offices, HSR - awaiting owner clarification',
  'Lakeside Tech Park, Bannerghatta - final verification needed',
];

export const DealerDashboard: React.FC = () => {
  return (
    <div className="dealer-dashboard">
      <section className="dealer-metrics">
        {METRICS.map((metric) => (
          <div key={metric.label} className="dealer-metric-card">
            <p>{metric.label}</p>
            <h3>{metric.value}</h3>
            <span>{metric.meta}</span>
          </div>
        ))}
      </section>

      <section className="dealer-panel">
        <h2>Deal Funnel</h2>
        <div className="dealer-funnel-grid">
          {PIPELINE.map((entry) => (
            <article key={entry.stage} className="dealer-funnel-card">
              <h3>{entry.stage}</h3>
              <p>{entry.count}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dealer-panel">
        <h2>Property Review Queue</h2>
        <ul className="dealer-queue-list">
          {REVIEW_QUEUE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};
