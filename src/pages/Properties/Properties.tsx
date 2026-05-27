import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { PropertyCard } from '../../components/PropertyCard';
import { BuyerPropertyImageLightbox } from '../../components/BuyerPropertyDetails';
import { PropertiesFilters } from '../../components/PropertiesFilters';
import { PaginationNav } from '../../components/PaginationNav';
import { useAuth } from '../../context/AuthContext';
import { getAllProperties, type ListingRecord } from '../../services/controllers';
import { LISTING_AMENITY_SUGGESTIONS, PUBLIC_PROPERTIES_PAGE_SIZE } from '../../constants/listings';
import { toPropertyCardFromListing } from '../../utils/listings';
import '../../components/PropertiesFilters/PropertiesFilters.css';
import './Properties.css';

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
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllProperties({ page, size: PUBLIC_PROPERTIES_PAGE_SIZE });
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

  const properties = useMemo(() => items.map((item) => toPropertyCardFromListing(item)), [items]);

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
  const effectiveTotalPages = useMemo(
    () => (totalPages > 0 ? totalPages : filteredProperties.length > 0 ? page + 1 : 0),
    [filteredProperties.length, page, totalPages]
  );

  const openImageLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsImageLightboxOpen(true);
  };

  const previousLightboxImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
  };

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
    return <Navigate to="/buyer/dashboard" replace />;
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
          amenitySuggestions={[...LISTING_AMENITY_SUGGESTIONS]}
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
              <PropertyCard key={property.id} property={property} onImageClick={openImageLightbox} />
            ))}
          </div>
        ) : null}

        {!loading && !error && filteredProperties.length === 0 ? (
          <div className="properties-empty-state" role="status" aria-live="polite">
            No properties found.
          </div>
        ) : null}

        <PaginationNav
          className="properties-pagination"
          page={page}
          totalPages={effectiveTotalPages}
          loading={loading}
          onPageChange={setPage}
        />
      </section>
      <BuyerPropertyImageLightbox
        isOpen={isImageLightboxOpen}
        images={lightboxImages}
        activeIndex={lightboxIndex}
        onClose={() => setIsImageLightboxOpen(false)}
        onSelectIndex={setLightboxIndex}
        onPrevious={previousLightboxImage}
        onNext={nextLightboxImage}
      />
    </main>
  );
};
