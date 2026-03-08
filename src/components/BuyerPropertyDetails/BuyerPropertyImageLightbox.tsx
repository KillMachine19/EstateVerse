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
        <div id="carouselExampleIndicators" className="carousel slide buyer-lightbox-carousel" data-ride="carousel">
          {images.length > 1 ? (
            <ol className="carousel-indicators">
              {images.map((_, index) => (
                <li
                  key={`indicator-${index}`}
                  data-target="#carouselExampleIndicators"
                  data-slide-to={index}
                  className={index === activeIndex ? 'active' : ''}
                  onClick={() => onSelectIndex(index)}
                />
              ))}
            </ol>
          ) : null}
          <div className="carousel-inner" role="listbox">
            {images.map((image, index) => (
              <div key={image} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
                <img className="d-block" src={image} alt={`Property slide ${index + 1}`} />
              </div>
            ))}
          </div>
          {images.length > 1 ? (
            <>
              <a
                className="carousel-control-prev"
                href="#carouselExampleIndicators"
                role="button"
                data-slide="prev"
                onClick={(event) => {
                  event.preventDefault();
                  onPrevious();
                }}
              >
                <i className="now-ui-icons arrows-1_minimal-left" />
                <FiChevronLeft aria-hidden="true" />
              </a>
              <a
                className="carousel-control-next"
                href="#carouselExampleIndicators"
                role="button"
                data-slide="next"
                onClick={(event) => {
                  event.preventDefault();
                  onNext();
                }}
              >
                <i className="now-ui-icons arrows-1_minimal-right" />
                <FiChevronRight aria-hidden="true" />
              </a>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
