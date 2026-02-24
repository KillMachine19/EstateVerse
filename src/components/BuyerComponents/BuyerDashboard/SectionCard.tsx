import React from 'react';

interface SectionCardProps {
  title: string;
  actionText?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, actionText, children }) => {
  return (
    <section className="buyer-dashboard-section">
      <header className="buyer-dashboard-section__header">
        <h2 className="buyer-dashboard-section__title">{title}</h2>
        {actionText ? <button type="button" className="buyer-dashboard-section__action">{actionText}</button> : null}
      </header>
      {children}
    </section>
  );
};
