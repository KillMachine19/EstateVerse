import React from 'react';
import type { Property } from '../../types';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
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

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <article className="property-card" aria-label={`Listing: ${property.title}`}>
      <div className="property-card-image-wrap">
        <img
          className="property-card-image"
          src={property.image}
          alt={`${property.title} in ${property.location}`}
          loading="lazy"
        />
        <span className="property-card-chip">{typeLabelMap[property.type]}</span>
      </div>

      <div className="property-card-content">
        <div className="property-card-meta-row">
          <p className="property-card-location">{property.location}</p>
          <p className="property-card-price">{formatPrice(property.price)}</p>
        </div>

        <h3 className="property-card-title">{property.title}</h3>
        <p className="property-card-description">{property.description}</p>

        <div className="property-card-details">
          <span className="property-card-detail">{formatArea(property.area)}</span>
          <span className="property-card-detail-separator" aria-hidden="true">
            •
          </span>
          <span className="property-card-detail">{property.amenities.length} amenities</span>
        </div>

        <ul className="property-card-amenities" aria-label="Property amenities">
          {property.amenities.slice(0, 3).map((amenity) => (
            <li key={amenity} className="property-card-amenity">
              {amenity}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};
