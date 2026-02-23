import React from 'react';
import './FeaturesSection.css';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Expert Consultants',
      description: 'Work with seasoned professionals who have decades of industry experience.',
      icon: '👥',
    },
    {
      title: 'Prime Locations',
      description: 'Access to the most desirable commercial properties in key markets.',
      icon: '📍',
    },
    {
      title: 'Market Insights',
      description: 'Data-driven analysis to help you make informed investment decisions.',
      icon: '📊',
    },
    {
      title: 'Custom Solutions',
      description: 'Tailored packages designed specifically for your business requirements.',
      icon: '⚙️',
    },
    {
      title: 'Fast Transactions',
      description: 'Streamlined processes to get you into your ideal space quickly.',
      icon: '⚡',
    },
    {
      title: '24/7 Support',
      description: 'Always available to answer your questions and provide guidance.',
      icon: '🔄',
    },
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-heading">Why Choose EstateVerse?</h2>
          <p className="features-description">
            We provide comprehensive commercial real estate solutions backed by expertise, integrity, and a commitment to your success.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <p className="feature-icon">{feature.icon}</p>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
