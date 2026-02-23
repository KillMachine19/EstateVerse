import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiChevronDown, FiLogOut, FiMessageCircle, FiUser } from 'react-icons/fi';
import './BuyerHeaderNav.css';

interface BuyerHeaderNavProps {
  onSignOut: () => void;
}

type DropdownKey = 'messages' | 'notifications' | 'profile' | 'logout' | null;

export const BuyerHeaderNav: React.FC<BuyerHeaderNavProps> = ({ onSignOut }) => {
  const navigate = useNavigate();
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
          { label: 'Inbox', to: '/buyer/messages' },
          { label: 'Unread', to: '/buyer/messages' },
        ],
      },
      {
        key: 'notifications' as const,
        label: 'Notifications',
        icon: <FiBell aria-hidden="true" />,
        items: [
          { label: 'All Notifications', to: '/buyer/notifications' },
          { label: 'Priority Alerts', to: '/buyer/notifications' },
        ],
      },
      {
        key: 'profile' as const,
        label: 'Profile',
        icon: <FiUser aria-hidden="true" />,
        items: [
          { label: 'My Profile', to: '/buyer/profile' },
          { label: 'Account Preferences', to: '/buyer/profile' },
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
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="buyer-dropdown">
        <button
          type="button"
          className={`buyer-dropdown-toggle ${openDropdown === 'logout' ? 'is-open' : ''}`}
          onClick={() => setOpenDropdown(openDropdown === 'logout' ? null : 'logout')}
          aria-expanded={openDropdown === 'logout'}
        >
          <span className="buyer-dropdown-icon">
            <FiLogOut aria-hidden="true" />
          </span>
          <span>Logout</span>
          <FiChevronDown className={`buyer-dropdown-chevron ${openDropdown === 'logout' ? 'is-open' : ''}`} aria-hidden="true" />
        </button>

        {openDropdown === 'logout' && (
          <div className="buyer-dropdown-menu">
            <button
              type="button"
              className="buyer-dropdown-item buyer-dropdown-item-button"
              onClick={onSignOut}
            >
              Sign out now
            </button>
            <button
              type="button"
              className="buyer-dropdown-item buyer-dropdown-item-button"
              onClick={() => {
                setOpenDropdown(null);
                navigate('/');
              }}
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
