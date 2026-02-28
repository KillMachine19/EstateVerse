import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { PropertyCard } from '../../components/PropertyCard';
import { PropertiesFilters } from '../../components/PropertiesFilters';
import { useAuth } from '../../context/AuthContext';
import { getAllProperties, type ListingRecord } from '../../services/controllers';
import type { Property } from '../../types';
import '../../components/PropertiesFilters/PropertiesFilters.css';
import './Properties.css';

const PAGE_SIZE = 12;
const AMENITY_SUGGESTIONS = [
  'High-Speed WiFi',
  'Fire Exit',
  'Power Backup',
  'Central Air',
  'CCTV Surveillance',
  'Elevator Access',
  '24/7 Security',
  'Parking',
  'Reception Desk',
  'Conference Rooms',
];

const parseNumber = (value: string | undefined, fallback = 0): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const resolveId = (listing: ListingRecord) => listing.propid ?? listing.id ?? '';

const toCardModel = (listing: ListingRecord): Property => {
  const area = parseNumber(listing.offerAreaSqFt ?? listing.totalAreaSqFt, 0);
  const unitPrice = parseNumber(listing.pricePerSqFt, 0);

  return {
    id: resolveId(listing),
    title: listing.projectName ?? 'Untitled Property',
    description: listing.details ?? 'No description available.',
    price: unitPrice * (area > 0 ? area : 1),
    location: listing.location ?? 'N/A',
    area,
    type: 'office',
    image: listing.imageIds?.[0] || 'https://via.placeholder.com/1200x900?text=No+Image',
    amenities: listing.amenities ?? [],
  };
};

export const Properties: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const [items, setItems] = useState<ListingRecord[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(0);
  const [selectedTechParkArea, setSelectedTechParkArea] = useState('All Areas');
  const [includeRentLease, setIncludeRentLease] = useState(false);
  const [includeBuying, setIncludeBuying] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllProperties({ page, size: PAGE_SIZE });
      setItems(response.content ?? []);
      setTotalPages(response.totalPages ?? 0);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Failed to load properties.');
      } else {
        setError('Failed to load properties.');
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  const properties = useMemo(() => items.map(toCardModel), [items]);

  const budgetMin = useMemo(() => {
    if (properties.length === 0) return 0;
    return Math.min(...properties.map((property) => property.price));
  }, [properties]);

  const budgetMax = useMemo(() => {
    if (properties.length === 0) return 0;
    return Math.max(...properties.map((property) => property.price));
  }, [properties]);

  useEffect(() => {
    if (properties.length === 0) {
      setMinBudget(0);
      setMaxBudget(0);
      return;
    }
    setMinBudget((prev) => (prev === 0 ? budgetMin : prev));
    setMaxBudget((prev) => (prev === 0 ? budgetMax : prev));
  }, [budgetMax, budgetMin, properties.length]);

  const techParkAreas = useMemo(() => {
    const all = ['All Areas'];
    const unique = Array.from(new Set(properties.map((property) => property.location).filter(Boolean)));
    return [...all, ...unique];
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    return properties.filter((property) => {
      const isBudgetMatch = property.price >= minBudget && property.price <= maxBudget;
      const isAreaMatch = selectedTechParkArea === 'All Areas' || property.location === selectedTechParkArea;
      const hasIntentFilter = includeRentLease || includeBuying;
      const isIntentMatch = !hasIntentFilter || includeRentLease || includeBuying;
      const hasAmenitiesMatch = selectedAmenities.every((amenity) =>
        property.amenities.some((item) => item.toLowerCase() === amenity.toLowerCase())
      );
      const haystack = [property.title, property.description, property.location, ...property.amenities]
        .join(' ')
        .toLowerCase();
      const isSearchMatch = !normalized || haystack.includes(normalized);
      return isBudgetMatch && isAreaMatch && isIntentMatch && hasAmenitiesMatch && isSearchMatch;
    });
  }, [includeBuying, includeRentLease, maxBudget, minBudget, properties, searchQuery, selectedAmenities, selectedTechParkArea]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]
    );
  };

  const formatBudget = (value: number): string => {
    if (value >= 10_000_000) {
      return `Rs. ${(value / 10_000_000).toFixed(value % 10_000_000 === 0 ? 0 : 1)} Cr`;
    }
    return `Rs. ${(value / 100_000).toFixed(0)} L`;
  };

  const minBudgetPercent = budgetMax > budgetMin ? ((minBudget - budgetMin) / (budgetMax - budgetMin)) * 100 : 0;
  const maxBudgetPercent = budgetMax > budgetMin ? ((maxBudget - budgetMin) / (budgetMax - budgetMin)) * 100 : 100;

  if (isAuthenticated && userRole === 'buyer') {
    return <Navigate to="/buyer/search" replace />;
  }

  return (
    <main className="properties-page">
      <section className="properties-section">
        <PropertiesFilters
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          minBudget={minBudget}
          maxBudget={maxBudget}
          minBudgetPercent={minBudgetPercent}
          maxBudgetPercent={maxBudgetPercent}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          onMinBudgetChange={setMinBudget}
          onMaxBudgetChange={setMaxBudget}
          selectedTechParkArea={selectedTechParkArea}
          techParkAreas={techParkAreas}
          onTechParkAreaChange={setSelectedTechParkArea}
          includeRentLease={includeRentLease}
          includeBuying={includeBuying}
          onIncludeRentLeaseChange={setIncludeRentLease}
          onIncludeBuyingChange={setIncludeBuying}
          formatBudget={formatBudget}
          selectedAmenities={selectedAmenities}
          amenitySuggestions={AMENITY_SUGGESTIONS}
          onToggleAmenity={toggleAmenity}
        />

        <header className="properties-header">
          <h1 className="properties-title">Available Properties</h1>
          <p className="properties-subtitle">Explore verified commercial listings.</p>
        </header>

        {loading ? <p>Loading properties...</p> : null}
        {error ? <p className="property-listing-error">{error}</p> : null}
        {!loading && !error ? (
          <p className="properties-results-count">{filteredProperties.length} properties found</p>
        ) : null}

        {!loading && !error && filteredProperties.length > 0 ? (
          <div className="properties-grid" aria-label="Property listings">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : null}

        {!loading && !error && filteredProperties.length === 0 ? (
          <div className="properties-empty-state" role="status" aria-live="polite">
            No properties found.
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0 || loading}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading || (totalPages > 0 && page + 1 >= totalPages)}
          >
            Next
          </button>
          <span style={{ alignSelf: 'center' }}>
            Page {page + 1}{totalPages > 0 ? ` of ${totalPages}` : ''}
          </span>
        </div>
      </section>
    </main>
  );
};
