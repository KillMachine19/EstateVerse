import React from 'react';
import {
  FiBarChart2,
  FiBell,
  FiBookmark,
  FiCalendar,
  FiCheckCircle,
  FiEye,
  FiFileText,
  FiMessageSquare,
  FiTag,
  FiTrendingUp,
} from 'react-icons/fi';
import { MetricCard } from './MetricCard';
import { SectionCard } from './SectionCard';
import { StatusBadge } from './StatusBadge';
import './BuyerDashboard.css';

const dashboardMetrics = [
  {
    label: 'Saved Properties',
    value: '24',
    subtext: '+3 this week',
    icon: <FiBookmark />,
  },
  {
    label: 'Active Offers',
    value: '6',
    subtext: '2 need follow-up',
    icon: <FiTag />,
  },
  {
    label: 'Applications',
    value: '4',
    subtext: '1 document pending',
    icon: <FiFileText />,
  },
  {
    label: 'Unread Messages',
    value: '8',
    subtext: '5 from last 24 hours',
    icon: <FiMessageSquare />,
  },
  {
    label: 'Properties Viewed',
    value: '112',
    subtext: '+18 this month',
    icon: <FiEye />,
  },
  {
    label: 'Properties Shortlisted',
    value: '19',
    subtext: '7 high-priority picks',
    icon: <FiTrendingUp />,
  },
];

const offers = [
  { property: 'Cyber Park Offices, Gurgaon', amount: '$1.82M', status: 'Submitted', tone: 'info' as const },
  { property: 'Iconic Tower, BKC Mumbai', amount: '$2.14M', status: 'Countered', tone: 'warning' as const },
  { property: 'Tech Plaza, Noida Sector 62', amount: '$940K', status: 'Accepted', tone: 'success' as const },
];

const applications = [
  {
    property: 'Aurum Business Bay, Hyderabad',
    stage: 'Docs Pending',
    due: 'Due in 2 days',
    tone: 'warning' as const,
  },
  {
    property: 'Millenia Block A, Bengaluru',
    stage: 'Under Review',
    due: 'Updated today',
    tone: 'info' as const,
  },
  {
    property: 'Nova Workspace, Pune',
    stage: 'Approved',
    due: 'Completed',
    tone: 'success' as const,
  },
];

const alerts = [
  'Price dropped by 4% on Tower One, Chennai OMR.',
  '3 new listings match your preferred budget and area.',
  'Offer response received for Iconic Tower, BKC Mumbai.',
];

const tasks = [
  'Upload GST and financial proof for Aurum Business Bay.',
  'Schedule a site visit for Cyber Park Offices tomorrow.',
  'Respond to seller counter offer before 5:00 PM.',
];

export const BuyerDashboard: React.FC = () => {
  return (
    <div className="buyer-dashboard">
      <div className="buyer-dashboard-metrics" aria-label="Buyer dashboard summary cards">
        {dashboardMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            subtext={metric.subtext}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="buyer-dashboard-grid">
        <SectionCard title="Offer Pipeline" actionText="View all offers">
          <ul className="buyer-dashboard-list">
            {offers.map((offer) => (
              <li key={offer.property} className="buyer-dashboard-list__item">
                <div>
                  <p className="buyer-dashboard-list__title">{offer.property}</p>
                  <p className="buyer-dashboard-list__meta">Offer Value: {offer.amount}</p>
                </div>
                <StatusBadge label={offer.status} tone={offer.tone} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Application Tracker" actionText="Manage applications">
          <ul className="buyer-dashboard-list">
            {applications.map((application) => (
              <li key={application.property} className="buyer-dashboard-list__item">
                <div>
                  <p className="buyer-dashboard-list__title">{application.property}</p>
                  <p className="buyer-dashboard-list__meta">{application.due}</p>
                </div>
                <StatusBadge label={application.stage} tone={application.tone} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Alerts & Notifications" actionText="Open alerts">
          <ul className="buyer-dashboard-plain-list">
            {alerts.map((alert) => (
              <li key={alert} className="buyer-dashboard-plain-list__item">
                <FiBell aria-hidden="true" />
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Today Tasks" actionText="Open calendar">
          <ul className="buyer-dashboard-plain-list">
            {tasks.map((task) => (
              <li key={task} className="buyer-dashboard-plain-list__item">
                <FiCheckCircle aria-hidden="true" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <section className="buyer-dashboard-insights" aria-label="Buyer quick insights">
        <article className="buyer-dashboard-insights__card">
          <div className="buyer-dashboard-insights__icon" aria-hidden="true">
            <FiBarChart2 />
          </div>
          <div>
            <p className="buyer-dashboard-insights__title">Budget Fit</p>
            <p className="buyer-dashboard-insights__text">
              68% of your shortlisted properties are within your target monthly budget.
            </p>
          </div>
        </article>

        <article className="buyer-dashboard-insights__card">
          <div className="buyer-dashboard-insights__icon" aria-hidden="true">
            <FiCalendar />
          </div>
          <div>
            <p className="buyer-dashboard-insights__title">Upcoming Visits</p>
            <p className="buyer-dashboard-insights__text">
              2 site visits scheduled this week, next one on Wednesday at 11:30 AM.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
};
