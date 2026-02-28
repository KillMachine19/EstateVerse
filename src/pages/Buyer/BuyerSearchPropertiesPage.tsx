import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';
import { PropertyCard } from '../../components/PropertyCard';
import { PropertiesFilters } from '../../components/PropertiesFilters';
import type { Property } from '../../types';
import {
  getAllProperties,
  removeShortlistedPropertyById,
  shortlistPropertyById,
  type ListingRecord,
} from '../../services/controllers';
import '../../components/BuyerComponents/BuyerSaved/BuyerSaved.css';
import '../../components/PropertiesFilters/PropertiesFilters.css';

const DEFAULT_PAGE_SIZE = 8;
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

const isAlreadyShortlistedError = (err: unknown): boolean => {
  if (!axios.isAxiosError(err)) {
    return false;
  }
  const payload = err.response?.data as { error?: unknown; message?: unknown } | undefined;
  const raw = typeof payload?.error === 'string' ? payload.error : typeof payload?.message === 'string' ? payload.message : '';
  return raw.toLowerCase().includes('already shortlisted');
};

const resolveListingId = (listing: ListingRecord): string => listing.propid ?? listing.id ?? '';
const normalizeImageId = (value: string | undefined): string => {
  if (!value) {
    return '';
  }
  if (!/^https?:\/\//i.test(value)) {
    return value;
  }
  try {
    const url = new URL(value, window.location.origin);
    const parts = url.pathname.split('/').filter(Boolean);
    const uploadsIndex = parts.findIndex((part) => part === 'uploads');
    if (uploadsIndex >= 0 && parts[uploadsIndex + 1]) {
      return parts[uploadsIndex + 1];
    }
    return '';
  } catch {
    return '';
  }
};

const reorderGalleryByMainImage = (images: string[], mainImageId: string | undefined): string[] => {
  if (!images.length) {
    return images;
  }
  const normalizedMain = normalizeImageId(mainImageId);
  if (!normalizedMain) {
    return images;
  }
  const mainIndex = images.findIndex((image) => normalizeImageId(image) === normalizedMain);
  if (mainIndex <= 0) {
    return images;
  }
  const next = [...images];
  const [mainImage] = next.splice(mainIndex, 1);
  next.unshift(mainImage);
  return next;
};

const toPropertyCardModel = (listing: ListingRecord): Property => {
  const imageGallery = reorderGalleryByMainImage(listing.imageIds ?? [], listing.mainImageId);
  const parsedArea = parseNumber(listing.offerAreaSqFt ?? listing.totalAreaSqFt, 0);
  const parsedPrice = parseNumber(listing.pricePerSqFt, 0) * (parsedArea > 0 ? parsedArea : 1);
  return {
    id: resolveListingId(listing),
    title: listing.projectName ?? 'Untitled Property',
    description: listing.details ?? 'No description available.',
    price: parsedPrice,
    location: listing.location ?? 'N/A',
    area: parsedArea,
    type: 'office',
    image: imageGallery[0] || 'https://via.placeholder.com/1200x900?text=No+Image',
    imageGallery,
    amenities: listing.amenities ?? [],
  };
};

export const BuyerSearchPropertiesPage: React.FC = () => {
  const [items, setItems] = useState<ListingRecord[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [shortlistingId, setShortlistingId] = useState<string | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<Record<string, true>>({});
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
      const propertiesResponse = await getAllProperties({ page, size: DEFAULT_PAGE_SIZE });
      setItems(propertiesResponse.content ?? []);
      setTotalPages(propertiesResponse.totalPages ?? 0);
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

  const mappedProperties = useMemo(() => items.map(toPropertyCardModel), [items]);

  const budgetMin = useMemo(() => {
    if (mappedProperties.length === 0) return 0;
    return Math.min(...mappedProperties.map((property) => property.price));
  }, [mappedProperties]);

  const budgetMax = useMemo(() => {
    if (mappedProperties.length === 0) return 0;
    return Math.max(...mappedProperties.map((property) => property.price));
  }, [mappedProperties]);

  useEffect(() => {
    if (mappedProperties.length === 0) {
      setMinBudget(0);
      setMaxBudget(0);
      return;
    }
    setMinBudget((prev) => (prev === 0 ? budgetMin : prev));
    setMaxBudget((prev) => (prev === 0 ? budgetMax : prev));
  }, [budgetMax, budgetMin, mappedProperties.length]);

  const techParkAreas = useMemo(() => {
    const all = ['All Areas'];
    const unique = Array.from(new Set(mappedProperties.map((property) => property.location).filter(Boolean)));
    return [...all, ...unique];
  }, [mappedProperties]);

  const filteredProperties = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    return mappedProperties.filter((property) => {
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
  }, [includeBuying, includeRentLease, mappedProperties, maxBudget, minBudget, searchQuery, selectedAmenities, selectedTechParkArea]);

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

  const handleToggleShortlist = useCallback(async (listingId: string) => {
    if (!listingId) {
      return;
    }
    try {
      setShortlistingId(listingId);
      setActionMessage('');
      if (shortlistedIds[listingId]) {
        await removeShortlistedPropertyById(listingId);
        setShortlistedIds((prev) => {
          const next = { ...prev };
          delete next[listingId];
          return next;
        });
        setActionMessage('Property removed from shortlist.');
      } else {
        try {
          await shortlistPropertyById(listingId);
          setShortlistedIds((prev) => ({ ...prev, [listingId]: true }));
          setActionMessage('Property shortlisted.');
        } catch (err) {
          if (isAlreadyShortlistedError(err)) {
            await removeShortlistedPropertyById(listingId);
            setShortlistedIds((prev) => {
              const next = { ...prev };
              delete next[listingId];
              return next;
            });
            setActionMessage('Property removed from shortlist.');
            return;
          }
          throw err;
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          typeof err.response?.data?.message === 'string'
            ? err.response.data.message
            : 'Unable to update shortlist.'
        );
      } else {
        setActionMessage('Unable to update shortlist.');
      }
    } finally {
      setShortlistingId(null);
    }
  }, [shortlistedIds]);

  return (
    <BuyerWorkspace
      title="Search Properties"
      description="Browse available commercial spaces and refine your search with location, budget, and property-type filters."
      icon={<FiSearch aria-hidden="true" />}
    >
      <section className="buyer-saved" aria-live="polite">
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

        {loading ? <p>Loading properties...</p> : null}
        {error ? <p className="property-listing-error">{error}</p> : null}
        {actionMessage ? <p>{actionMessage}</p> : null}

        {!loading && !error && filteredProperties.length === 0 ? <p>No properties found.</p> : null}

        {!loading && !error && filteredProperties.length > 0 ? (
          <div className="buyer-saved-grid">
            {filteredProperties.map((property) => {
              return (
                <Link key={property.id} to={`/buyer/properties/${property.id}`} className="buyer-property-card-link">
                  <PropertyCard
                    property={property}
                    isShortlisted={Boolean(shortlistedIds[property.id])}
                    onToggleShortlist={handleToggleShortlist}
                    shortlistLoading={shortlistingId === property.id}
                  />
                </Link>
              );
            })}
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0 || loading}>
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
    </BuyerWorkspace>
  );
};
