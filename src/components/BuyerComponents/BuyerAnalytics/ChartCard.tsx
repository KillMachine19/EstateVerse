import React from 'react';

interface ChartCardProps {
  category: string;
  title: string;
  stats: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ category, title, stats, children }) => {
  return (
    <article className="buyer-chart-card buyer-chart-card--chart">
      <header className="buyer-chart-card__header">
        <p className="buyer-chart-card__category">{category}</p>
        <h3 className="buyer-chart-card__title">{title}</h3>
      </header>
      <div className="buyer-chart-card__body">{children}</div>
      <footer className="buyer-chart-card__footer">{stats}</footer>
    </article>
  );
};
