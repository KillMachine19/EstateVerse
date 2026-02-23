import React from 'react';
import { Button } from '../Button';
import './HeroSection.css';

export const HeroSection: React.FC = () => {
  const openScheduleCallPopup = () => {
    window.dispatchEvent(new Event('open-schedule-call'));
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-grid">
          <div>
            <h2 className="hero-title">Premium Commercial Real Estate Solutions</h2>
            <p className="hero-description">
              Discover exceptional office spaces, retail locations, and warehouses tailored to your business needs. Connect with expert advisors who understand your goals.
            </p>
            <div className="hero-buttons">
              <Button variant="primary" size="lg">
                Explore Properties
              </Button>
              <Button variant="primary" size="lg" onClick={openScheduleCallPopup}>
                Schedule Expert Call
              </Button>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="/images/hero-office.jpg"
              alt="Premium commercial office interior"
              className="hero-image-img"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                // show placeholder by toggling a data attribute on parent
                const parent = target.closest('.hero-image');
                if (parent) parent.setAttribute('data-image-failed', 'true');
              }}
            />
          </div>
        </div>

        <div className="hero-stats-grid">
          <div className="hero-stat-card">
            <p className="hero-stat-number">500+</p>
            <p className="hero-stat-label">Properties Listed</p>
          </div>
          <div className="hero-stat-card">
            <p className="hero-stat-number">1000+</p>
            <p className="hero-stat-label">Happy Clients</p>
          </div>
          <div className="hero-stat-card">
            <p className="hero-stat-number">20+</p>
            <p className="hero-stat-label">Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};
