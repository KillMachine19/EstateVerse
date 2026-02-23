import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import './Navigation.css';
import { FiChevronDown } from 'react-icons/fi';

interface NavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  isOpen = true, 
  onClose,
  isMobile = false 
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleAccordionItem = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  if (isMobile) {
    return (
      <nav className={`nav-accordion ${isOpen ? 'nav-accordion-open' : ''}`}>
        {NAVIGATION_ITEMS.map((item) => (
          <div key={item.label} className="accordion-item">
            <button
              className="accordion-toggle"
              onClick={() => toggleAccordionItem(item.label)}
              aria-expanded={expandedItems.includes(item.label)}
            >
              <span className="accordion-label">{item.label}</span>
              <span className={`accordion-icon ${expandedItems.includes(item.label) ? 'expanded' : ''}`}>
                <FiChevronDown aria-hidden="true" />
              </span>
            </button>
            <div
              className={`accordion-content ${
                expandedItems.includes(item.label) ? 'expanded' : ''
              }`}
            >
              <Link 
                to={item.path} 
                className="accordion-link"
                onClick={onClose}
              >
                {item.label}
              </Link>
            </div>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className={isOpen ? 'nav-container' : 'nav-hidden'}>
      {NAVIGATION_ITEMS.map((item) => (
        <Link key={item.label} to={item.path} className="nav-link">
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
