import React from 'react';
import type { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import './Properties.css';

const listedProperties: Property[] = [
  {
    id: 'prop-blr-001',
    title: 'Outer Ring Road Business Hub',
    description: 'Grade A managed office floors with flexible seating plans for scaling technology teams.',
    price: 38500000,
    location: 'Bengaluru, Karnataka',
    area: 18400,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    amenities: ['24/7 Access', 'Smart Security', 'Dedicated Parking', 'Conference Floors'],
  },
  {
    id: 'prop-gur-002',
    title: 'Cyber City Corporate Plaza',
    description: 'Premium office tower with modern reception, large floor plates, and metro connectivity.',
    price: 46200000,
    location: 'Gurugram, Haryana',
    area: 22100,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Metro Access', 'Visitor Management', 'Backup Power', 'Cafeteria'],
  },
  {
    id: 'prop-hyd-003',
    title: 'HITEC City Signature Offices',
    description: 'Move-in-ready enterprise office suites in a high-demand IT corridor.',
    price: 29800000,
    location: 'Hyderabad, Telangana',
    area: 15750,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Managed Reception', 'Boardrooms', 'LEED Gold', 'High-Speed Internet'],
  },
  {
    id: 'prop-pun-004',
    title: 'Baner Financial District Center',
    description: 'Contemporary office campus designed for finance, consulting, and enterprise operations.',
    price: 33400000,
    location: 'Pune, Maharashtra',
    area: 17400,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Multi-level Parking', 'Business Lounge', 'Fitness Center', 'BMS Enabled'],
  },
];

export const Properties: React.FC = () => {
  return (
    <main className="properties-page">
      <section className="properties-section">
        <header className="properties-header">
          <h1 className="properties-title">Available Properties</h1>
          <p className="properties-subtitle">
            Explore curated office spaces across key Indian business markets, ready for your next expansion.
          </p>
        </header>

        <div className="properties-grid" aria-label="Property listings">
          {listedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </main>
  );
};
