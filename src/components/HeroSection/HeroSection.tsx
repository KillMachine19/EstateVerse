import React from 'react';
import { Button } from '../Button';
import './HeroSection.css';

export const HeroSection: React.FC = () => {
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
              <Button variant="primary" size="lg">
                Schedule Expert Call
              </Button>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-image-text">
              <p className="hero-image-placeholder">Property Image</p>
              <p className="hero-image-subtext">(Placeholder for hero image)</p>
            </div>
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
