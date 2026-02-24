import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { NavItem } from '../../constants/navigation';
import './Navigation.css';
import { FiChevronDown } from 'react-icons/fi';

interface NavigationProps {
  items: NavItem[];
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  items,
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
        {items.map((item) => (
          <div key={item.label} className="accordion-item">
            <button
              className="accordion-toggle"
              onClick={() => toggleAccordionItem(item.label)}
              aria-expanded={expandedItems.includes(item.label)}
            >
              <span className="accordion-label">
                {item.icon ? <span className="accordion-item-icon">{item.icon}</span> : null}
                <span>{item.label}</span>
              </span>
              <span className={`accordion-icon ${expandedItems.includes(item.label) ? 'expanded' : ''}`}>
                <FiChevronDown aria-hidden="true" />
              </span>
            </button>
            <div
              className={`accordion-content ${
                expandedItems.includes(item.label) ? 'expanded' : ''
              }`}
            >
              {item.children && item.children.length > 0 ? (
                item.children.map((child) => (
                  <NavLink
                    key={`${item.label}-${child.label}`}
                    to={child.path}
                    className="accordion-link"
                    onClick={onClose}
                  >
                    {child.icon ? <span className="accordion-item-icon">{child.icon}</span> : null}
                    <span>{child.label}</span>
                  </NavLink>
                ))
              ) : (
                <NavLink
                  to={item.path}
                  className="accordion-link"
                  onClick={onClose}
                >
                  {item.label}
                </NavLink>
              )}
            </div>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className={isOpen ? 'nav-container' : 'nav-hidden'}>
      {items.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
