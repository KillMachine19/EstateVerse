import React, { useEffect, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiMinus, FiPlus, FiUsers } from 'react-icons/fi';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import type { Property } from '../../types';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
  showShortlistedBuyersCount?: boolean;
  blurImageBackdrop?: boolean;
  isShortlisted?: boolean;
  onToggleShortlist?: (propertyId: string) => void;
  shortlistLoading?: boolean;
  onImageClick?: (images: string[], index: number) => void;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const formatArea = (area: number): string => {
  return `${new Intl.NumberFormat('en-US').format(area)} sq ft`;
};

const typeLabelMap: Record<Property['type'], string> = {
  office: 'Office'
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  showShortlistedBuyersCount = false,
  blurImageBackdrop = false,
  isShortlisted = false,
  onToggleShortlist,
  shortlistLoading = false,
  onImageClick,
}) => {
  const gallery = useMemo(() => {
    const images = property.imageGallery && property.imageGallery.length > 0 ? property.imageGallery : [property.image];
    return images.filter(Boolean);
  }, [property.image, property.imageGallery]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setShowAllAmenities(false);
  }, [property.id]);

  const activeImage = gallery[activeImageIndex] ?? property.image;

  const onPreviousImage: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const onNextImage: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const onToggleAmenities: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowAllAmenities((prev) => !prev);
  };

  const onMainImageClick: React.MouseEventHandler<HTMLImageElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onImageClick?.(gallery, activeImageIndex);
  };

  const onShortlistClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleShortlist?.(property.id);
  };

  const visibleAmenities = showAllAmenities ? property.amenities : property.amenities.slice(0, 5);

  return (
    <article className="property-card" aria-label={`Listing: ${property.title}`}>
      <div className={`property-card-image-wrap ${blurImageBackdrop ? 'is-blur-extended' : ''}`}>
        {blurImageBackdrop ? (
          <div
            className="property-card-image-backdrop"
            style={{ backgroundImage: `url(${activeImage})` }}
            aria-hidden="true"
          />
        ) : null}
        <img
          className={`property-card-image ${blurImageBackdrop ? 'is-contained' : ''}`}
          src={activeImage}
          alt={`${property.title} in ${property.location}`}
          loading="lazy"
          onClick={onMainImageClick}
        />
        <span className="property-card-chip">{typeLabelMap[property.type]}</span>
        {onToggleShortlist ? (
          <button
            type="button"
            className={`property-card-shortlist-btn ${isShortlisted ? 'is-active' : ''}`}
            onClick={onShortlistClick}
            disabled={shortlistLoading}
            aria-label={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
          >
            {isShortlisted ? <BsBookmarkFill aria-hidden="true" /> : <BsBookmark aria-hidden="true" />}
          </button>
        ) : null}
        {gallery.length > 1 ? (
          <div className="property-card-gallery-controls" aria-label="Property gallery controls">
            <button type="button" className="property-card-gallery-btn" onClick={onPreviousImage} aria-label="Previous image">
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button type="button" className="property-card-gallery-btn" onClick={onNextImage} aria-label="Next image">
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="property-card-content">
        <div className="property-card-meta-row">
          <p className="property-card-price">{formatPrice(property.price)}</p>
        </div>

        <h3 className="property-card-title">{property.title}</h3>
        <p className="property-card-description">{property.description}</p>
        <p className="property-card-location">{property.location}</p>

        <div className="property-card-details">
          <span className="property-card-detail">{formatArea(property.area)}</span>
          <span className="property-card-detail-separator" aria-hidden="true">
            •
          </span>
          <span className="property-card-detail">{property.amenities.length} amenities</span>
          {showShortlistedBuyersCount && typeof property.shortlistedBuyersCount === 'number' ? (
            <>
              <span className="property-card-detail-separator" aria-hidden="true">
                •
              </span>
              <span className="property-card-detail property-card-shortlist-detail">
                <FiUsers aria-hidden="true" /> {property.shortlistedBuyersCount} shortlisted
              </span>
            </>
          ) : null}
        </div>

        <ul className="property-card-amenities" aria-label="Property amenities">
          {visibleAmenities.map((amenity) => (
            <li key={amenity} className="property-card-amenity">
              {amenity}
            </li>
          ))}
          {property.amenities.length > 5 ? (
            <li className="property-card-amenity-toggle-wrap">
              <button type="button" className="property-card-amenity-toggle" onClick={onToggleAmenities}>
                {showAllAmenities ? <FiMinus aria-hidden="true" /> : <FiPlus aria-hidden="true" />}
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
};
