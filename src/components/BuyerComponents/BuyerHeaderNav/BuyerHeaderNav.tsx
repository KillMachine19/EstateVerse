import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBell,
  FiChevronDown,
  FiCheckCircle,
  FiMessageCircle,
  FiSettings,
  FiUser,
} from 'react-icons/fi';
import './BuyerHeaderNav.css';

type DropdownKey = 'messages' | 'notifications' | 'profile' | null;

export const BuyerHeaderNav: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    window.addEventListener('mousedown', onPointerDown);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
    };
  }, []);

  const dropdowns = useMemo(
    () => [
      {
        key: 'messages' as const,
        label: 'Messages',
        icon: <FiMessageCircle aria-hidden="true" />,
        items: [
          { label: 'Inbox', to: '/buyer/messages', icon: <FiMessageCircle aria-hidden="true" /> },
          { label: 'Unread', to: '/buyer/messages', icon: <FiBell aria-hidden="true" /> },
        ],
      },
      {
        key: 'notifications' as const,
        label: 'Notifications',
        icon: <FiBell aria-hidden="true" />,
        items: [
          { label: 'All Notifications', to: '/buyer/notifications', icon: <FiBell aria-hidden="true" /> },
          { label: 'Priority Alerts', to: '/buyer/notifications', icon: <FiSettings aria-hidden="true" /> },
        ],
      },
      {
        key: 'profile' as const,
        label: 'Profile',
        icon: <FiUser aria-hidden="true" />,
        items: [
          { label: 'My Profile', to: '/profile', icon: <FiUser aria-hidden="true" /> },
          { label: 'Verification Status', to: '/verification-status', icon: <FiCheckCircle aria-hidden="true" /> },
          { label: 'Reset Password', to: '/reset-password', icon: <FiSettings aria-hidden="true" /> },
        ],
      },
    ],
    []
  );

  return (
    <div className="buyer-header-nav" ref={rootRef}>
      {dropdowns.map((dropdown) => {
        const isOpen = openDropdown === dropdown.key;
        return (
          <div key={dropdown.key} className="buyer-dropdown">
            <button
              type="button"
              className={`buyer-dropdown-toggle ${isOpen ? 'is-open' : ''}`}
              onClick={() => setOpenDropdown(isOpen ? null : dropdown.key)}
              aria-expanded={isOpen}
            >
              <span className="buyer-dropdown-icon">{dropdown.icon}</span>
              <span>{dropdown.label}</span>
              <FiChevronDown className={`buyer-dropdown-chevron ${isOpen ? 'is-open' : ''}`} aria-hidden="true" />
            </button>

            {isOpen && (
              <div className="buyer-dropdown-menu">
                {dropdown.items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="buyer-dropdown-item"
                    onClick={() => setOpenDropdown(null)}
                  >
                    <span className="buyer-dropdown-item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
