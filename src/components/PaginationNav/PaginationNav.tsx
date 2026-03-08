import React, { useMemo } from 'react';
import './PaginationNav.css';

interface PaginationNavProps {
  page: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (nextPage: number) => void;
  className?: string;
  ariaLabel?: string;
}

export const PaginationNav: React.FC<PaginationNavProps> = ({
  page,
  totalPages,
  loading = false,
  onPageChange,
  className = '',
  ariaLabel = 'Page navigation example',
}) => {
  const pageNumbers = useMemo(
    () => Array.from({ length: Math.max(0, totalPages) }, (_, index) => index),
    [totalPages]
  );

  const isPrevDisabled = page === 0 || loading;
  const isNextDisabled = loading || (totalPages > 0 && page + 1 >= totalPages);

  return (
    <nav className={`pagination-nav ${className}`.trim()} aria-label={ariaLabel}>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${isPrevDisabled ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(Math.max(page - 1, 0))}
            disabled={isPrevDisabled}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(pageNumber)}
              disabled={loading}
              aria-current={page === pageNumber ? 'page' : undefined}
            >
              {pageNumber + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${isNextDisabled ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(page + 1)}
            disabled={isNextDisabled}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};
