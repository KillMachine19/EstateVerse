import React, { useMemo, useState } from 'react';
import type { Property } from '../../types';
import { PropertyCard } from '../../components/PropertyCard';
import './Properties.css';

type ListingIntent = 'rentLease' | 'buying';

interface PropertyListing extends Property {
  techParkArea: string;
  listingIntents: ListingIntent[];
}

const BUDGET_MIN = 5_000_000; // 50L
const BUDGET_MAX = 1_000_000_000; // 100Cr

const listedProperties: PropertyListing[] = [
  {
    id: 'prop-blr-001',
    title: 'Outer Ring Road Business Hub',
    description: 'Grade A managed office floors with flexible seating plans for scaling technology teams.',
    price: 38_500_000,
    location: 'Bengaluru, Karnataka',
    techParkArea: 'Outer Ring Road',
    area: 18_400,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    amenities: ['24/7 Access', 'Smart Security', 'Dedicated Parking', 'Conference Floors'],
    listingIntents: ['rentLease', 'buying'],
  },
  {
    id: 'prop-blr-002',
    title: 'Whitefield Enterprise Tower',
    description: 'Premium office tower with modern reception, large floor plates, and metro connectivity.',
    price: 46_200_000,
    location: 'Bengaluru, Karnataka',
    techParkArea: 'Whitefield',
    area: 22_100,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Metro Access', 'Visitor Management', 'Backup Power', 'Cafeteria'],
    listingIntents: ['buying'],
  },
  {
    id: 'prop-blr-003',
    title: 'Electronic City Signature Offices',
    description: 'Move-in-ready enterprise office suites in a high-demand IT corridor.',
    price: 29_800_000,
    location: 'Bengaluru, Karnataka',
    techParkArea: 'Electronic City',
    area: 15_750,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Managed Reception', 'Boardrooms', 'LEED Gold', 'High-Speed Internet'],
    listingIntents: ['rentLease'],
  },
  {
    id: 'prop-blr-004',
    title: 'Manyata Tech Park Business Center',
    description: 'Contemporary office campus designed for finance, consulting, and enterprise operations.',
    price: 33_400_000,
    location: 'Bengaluru, Karnataka',
    techParkArea: 'Manyata Tech Park',
    area: 17_400,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Multi-level Parking', 'Business Lounge', 'Fitness Center', 'BMS Enabled'],
    listingIntents: ['rentLease', 'buying'],
  },
];

const techParkAreas = ['All Bengaluru Tech Park Areas', ...new Set(listedProperties.map((p) => p.techParkArea))];

const formatBudget = (value: number): string => {
  if (value >= 10_000_000) {
    return `Rs. ${(value / 10_000_000).toFixed(value % 10_000_000 === 0 ? 0 : 1)} Cr`;
  }
  return `Rs. ${(value / 100_000).toFixed(0)} L`;
};

export const Properties: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechParkArea, setSelectedTechParkArea] = useState(techParkAreas[0]);
  const [minBudget, setMinBudget] = useState(BUDGET_MIN);
  const [maxBudget, setMaxBudget] = useState(BUDGET_MAX);
  const [includeRentLease, setIncludeRentLease] = useState(false);
  const [includeBuying, setIncludeBuying] = useState(false);

  const filteredProperties = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const hasIntentFilter = includeRentLease || includeBuying;

    return listedProperties.filter((property) => {
      const isBudgetMatch = property.price >= minBudget && property.price <= maxBudget;
      const isAreaMatch =
        selectedTechParkArea === techParkAreas[0] || property.techParkArea === selectedTechParkArea;
      const isIntentMatch = !hasIntentFilter
        ? true
        : (includeRentLease && property.listingIntents.includes('rentLease')) ||
          (includeBuying && property.listingIntents.includes('buying'));

      if (!normalizedQuery) {
        return isBudgetMatch && isAreaMatch && isIntentMatch;
      }

      const searchableText = [
        property.title,
        property.description,
        property.location,
        property.techParkArea,
        ...property.amenities,
      ]
        .join(' ')
        .toLowerCase();

      return isBudgetMatch && isAreaMatch && isIntentMatch && searchableText.includes(normalizedQuery);
    });
  }, [includeBuying, includeRentLease, maxBudget, minBudget, searchQuery, selectedTechParkArea]);

  const onMinBudgetChange = (value: number) => {
    setMinBudget(Math.min(value, maxBudget));
  };

  const onMaxBudgetChange = (value: number) => {
    setMaxBudget(Math.max(value, minBudget));
  };

  const minBudgetPercent = ((minBudget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;
  const maxBudgetPercent = ((maxBudget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  return (
    <main className="properties-page">
      <section className="properties-section">
        <section className="properties-filters" aria-label="Search and filters">
          <label className="filter-group filter-search-group">
            <span className="filter-label">Search</span>
            <input
              type="search"
              className="filter-input"
              placeholder="Search by title, amenities, or area"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>

          <div className="filter-group">
            <span className="filter-label">Budget ({formatBudget(minBudget)} - {formatBudget(maxBudget)})</span>
            <div
              className="budget-slider-group"
              style={
                {
                  '--min-budget-percent': `${minBudgetPercent}%`,
                  '--max-budget-percent': `${maxBudgetPercent}%`,
                } as React.CSSProperties
              }
            >
              <div className="budget-slider-track" aria-hidden="true" />
              <input
                type="range"
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={500_000}
                value={minBudget}
                onChange={(event) => onMinBudgetChange(Number(event.target.value))}
                aria-label="Minimum budget"
              />
              <input
                type="range"
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={500_000}
                value={maxBudget}
                onChange={(event) => onMaxBudgetChange(Number(event.target.value))}
                aria-label="Maximum budget"
              />
            </div>
            <p className="budget-range-hint">Range: Rs. 50L to 100 Cr</p>
          </div>

          <label className="filter-group">
            <span className="filter-label">Area</span>
            <select
              className="filter-input"
              value={selectedTechParkArea}
              onChange={(event) => setSelectedTechParkArea(event.target.value)}
            >
              {techParkAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </label>

          <div className="filter-group filter-checkbox-group">
            <span className="filter-label">Listing Type</span>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={includeRentLease}
                onChange={(event) => setIncludeRentLease(event.target.checked)}
              />
              <span>Renting/Leasing</span>
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={includeBuying}
                onChange={(event) => setIncludeBuying(event.target.checked)}
              />
              <span>Buying</span>
            </label>
          </div>
        </section>

        <header className="properties-header">
          <h1 className="properties-title">Available Properties</h1>
          <p className="properties-subtitle">
            Explore curated office spaces across Bengaluru tech parks, ready for your next expansion.
          </p>
        </header>

        <p className="properties-results-count">{filteredProperties.length} properties found</p>

        {filteredProperties.length > 0 ? (
          <div className="properties-grid" aria-label="Property listings">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="properties-empty-state" role="status" aria-live="polite">
            No properties match your current filters.
          </div>
        )}
      </section>
    </main>
  );
};
