import React from 'react';

type StatusTone = 'neutral' | 'info' | 'success' | 'warning';

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, tone = 'neutral' }) => {
  return <span className={`buyer-status-badge buyer-status-badge--${tone}`}>{label}</span>;
};
