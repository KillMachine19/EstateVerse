import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <h3 className="footer-section-title">EstateVerse</h3>
            <p className="footer-text">Your partner in commercial real estate solutions.</p>
          </div>

          <div>
            <h4 className="footer-section-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Home</a></li>
              <li><a href="#" className="footer-link">Properties</a></li>
              <li><a href="#" className="footer-link">Services</a></li>
              <li><a href="#" className="footer-link">About</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-section-subtitle">Legal</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Disclaimer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-section-subtitle">Contact</h4>
            <p className="footer-text-mb">Email: info@estatevse.com</p>
            <p className="footer-text">Phone: +1 (555) 000-0000</p>
          </div>
        </div>

        <div className="footer-divider">
          <p className="footer-copyright">&copy; {currentYear} EstateVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
