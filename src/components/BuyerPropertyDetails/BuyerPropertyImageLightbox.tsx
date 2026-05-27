import React from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

interface BuyerPropertyImageLightboxProps {
  isOpen: boolean;
  images: string[];
  activeIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const BuyerPropertyImageLightbox: React.FC<BuyerPropertyImageLightboxProps> = ({
  isOpen,
  images,
  activeIndex,
  onClose,
  onSelectIndex,
  onPrevious,
  onNext,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="buyer-image-lightbox-overlay" onClick={onClose} role="presentation">
      <div className="buyer-image-lightbox" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button
          type="button"
          className="buyer-image-lightbox-close"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClose();
          }}
        >
          <FiX aria-hidden="true" />
        </button>
        <div className="carousel slide buyer-lightbox-carousel">
          {images.length > 1 ? (
            <ol className="carousel-indicators">
              {images.map((_, index) => (
                <li
                  key={`indicator-${index}`}
                  className={index === activeIndex ? 'active' : ''}
                  onClick={() => onSelectIndex(index)}
                />
              ))}
            </ol>
          ) : null}
          <div className="carousel-inner" role="listbox">
            {images[activeIndex] ? (
              <div className="carousel-item active">
                <img className="d-block" src={images[activeIndex]} alt={`Property slide ${activeIndex + 1}`} />
              </div>
            ) : null}
          </div>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="carousel-control-prev"
                onClick={(event) => {
                  event.preventDefault();
                  onPrevious();
                }}
                aria-label="Previous image"
              >
                <i className="now-ui-icons arrows-1_minimal-left" />
                <FiChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                className="carousel-control-next"
                onClick={(event) => {
                  event.preventDefault();
                  onNext();
                }}
                aria-label="Next image"
              >
                <i className="now-ui-icons arrows-1_minimal-right" />
                <FiChevronRight aria-hidden="true" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
