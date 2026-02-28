import React, { useEffect, useMemo, useState } from 'react';
import { FiArrowUp, FiPlus } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './FloatingPageActions.css';

const SCROLL_THRESHOLD = 260;
const FOOTER_START_THRESHOLD = 220;

export const FloatingPageActions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [isNearFooterStart, setIsNearFooterStart] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);

  useEffect(() => {
    const updateState = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const viewportBottom = scrollTop + window.innerHeight;
      const pageBottom = doc.scrollHeight;
      setIsVisible(scrollTop > SCROLL_THRESHOLD);
      setIsNearBottom(pageBottom - viewportBottom <= FOOTER_START_THRESHOLD);

      const footer = document.querySelector('.footer');
      if (footer instanceof HTMLElement) {
        const footerRect = footer.getBoundingClientRect();
        const footerDistanceFromViewportBottom = footerRect.top - window.innerHeight;
        setIsNearFooterStart(footerDistanceFromViewportBottom <= FOOTER_START_THRESHOLD);
        const overlap = Math.max(0, window.innerHeight - footerRect.top);
        setFooterOffset(overlap > 0 ? overlap + 16 : 0);
      } else {
        setIsNearFooterStart(false);
        setFooterOffset(0);
      }
    };

    updateState();
    window.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);
    return () => {
      window.removeEventListener('scroll', updateState);
      window.removeEventListener('resize', updateState);
    };
  }, [location.pathname, location.search]);

  const showAddPropertyAction = useMemo(
    () => isVisible && userRole === 'seller' && (isNearBottom || isNearFooterStart),
    [isNearBottom, isNearFooterStart, isVisible, userRole]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <div className="floating-page-actions" aria-label="Page quick actions" style={{ bottom: `${18 + footerOffset}px` }}>
      {showAddPropertyAction ? (
        <button
          type="button"
          className="floating-page-action-btn is-secondary"
          onClick={() => navigate('/seller/add-property')}
          aria-label="Add new property"
        >
          <FiPlus aria-hidden="true" />
          <span className="floating-page-action-tooltip">Add Property</span>
        </button>
      ) : null}

      <button
        type="button"
        className="floating-page-action-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Move to top"
      >
        <FiArrowUp aria-hidden="true" />
        <span className="floating-page-action-tooltip">Move To Top</span>
      </button>
    </div>
  );
};
