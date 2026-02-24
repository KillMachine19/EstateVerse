import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, subtext, icon }) => {
  return (
    <article className="buyer-metric-card">
      <div className="buyer-metric-card__icon" aria-hidden="true">
        {icon}
      </div>
      <p className="buyer-metric-card__label">{label}</p>
      <p className="buyer-metric-card__value">{value}</p>
      <p className="buyer-metric-card__subtext">{subtext}</p>
    </article>
  );
};
