import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import { BUYER_SAVED_PROPERTIES } from '../../../data/buyerSavedProperties';
import './BuyerSaved.css';

const latMin = 8;
const latMax = 37;
const lngMin = 68;
const lngMax = 97;

const getPinPosition = (latitude: number, longitude: number) => {
  const y = ((latMax - latitude) / (latMax - latMin)) * 100;
  const x = ((longitude - lngMin) / (lngMax - lngMin)) * 100;
  return {
    top: `${Math.min(Math.max(y, 8), 92)}%`,
    left: `${Math.min(Math.max(x, 6), 94)}%`,
  };
};

export const BuyerSavedMap: React.FC = () => {
  return (
    <section className="buyer-saved-map" aria-label="Saved property locations map">
      <div className="buyer-saved-map-board">
        <div className="buyer-saved-map-grid" aria-hidden="true" />
        {BUYER_SAVED_PROPERTIES.map((property) => (
          <button
            type="button"
            key={property.id}
            className="buyer-saved-map-pin"
            style={getPinPosition(property.latitude, property.longitude)}
            aria-label={`${property.title} at ${property.location}`}
            title={`${property.title} (${property.city})`}
          >
            <FiMapPin aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="buyer-saved-map-list">
        <h3 className="buyer-saved-map-list-title">Pinned Saved Properties</h3>
        <ul className="buyer-saved-map-items">
          {BUYER_SAVED_PROPERTIES.map((property) => (
            <li key={property.id} className="buyer-saved-map-item">
              <span className="buyer-saved-map-item-city">{property.city}</span>
              <span className="buyer-saved-map-item-name">{property.title}</span>
              <span className="buyer-saved-map-item-location">{property.location}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
