import React from 'react';
import { PropertyCard } from '../../PropertyCard';
import { BUYER_SAVED_PROPERTIES } from '../../../data/buyerSavedProperties';
import './BuyerSaved.css';

export const BuyerSavedCards: React.FC = () => {
  return (
    <section className="buyer-saved" aria-label="Saved properties card view">
      <div className="buyer-saved-grid">
        {BUYER_SAVED_PROPERTIES.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};
