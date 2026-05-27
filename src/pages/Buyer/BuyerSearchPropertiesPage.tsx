import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';
import { PropertyCard } from '../../components/PropertyCard';
import { BuyerPropertyImageLightbox } from '../../components/BuyerPropertyDetails';
import { PropertiesFilters } from '../../components/PropertiesFilters';
import { PaginationNav } from '../../components/PaginationNav';
import { ShortlistRemoveModal } from '../../components/ShortlistRemoveModal';
import {
  getAllProperties,
  getShortlistedProperties,
  removeShortlistedPropertyById,
  shortlistPropertyById,
  type ListingRecord,
} from '../../services/controllers';
import { BUYER_SEARCH_PAGE_SIZE, LISTING_AMENITY_SUGGESTIONS } from '../../constants/listings';
import { resolveListingId, toPropertyCardFromListing } from '../../utils/listings';
import '../../components/BuyerComponents/BuyerSaved/BuyerSaved.css';
import '../../components/PropertiesFilters/PropertiesFilters.css';

const isAlreadyShortlistedError = (err: unknown): boolean => {
  if (!axios.isAxiosError(err)) {
    return false;
  }
  const payload = err.response?.data as { error?: unknown; message?: unknown } | undefined;
  const raw = typeof payload?.error === 'string' ? payload.error : typeof payload?.message === 'string' ? payload.message : '';
  return raw.toLowerCase().includes('already shortlisted');
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
  const [pendingRemoveShortlistId, setPendingRemoveShortlistId] = useState<string | null>(null);
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
      const [propertiesResponse, shortlistResponse] = await Promise.all([
        getAllProperties({ page, size: BUYER_SEARCH_PAGE_SIZE }),
        getShortlistedProperties(0, 10).catch(() => ({ content: [] as ListingRecord[] })),
      ]);
      const shortlistIdSet = new Set(
        (shortlistResponse.content ?? []).map((item) => resolveListingId(item)).filter(Boolean)
      );
      const nextItems = (propertiesResponse.content ?? []).map((item) => {
        const id = resolveListingId(item);
        return { ...item, shortlistFlag: Boolean(item.shortlistFlag || (id && shortlistIdSet.has(id))) };
      });
      setItems(nextItems);
      setTotalPages(propertiesResponse.totalPages ?? 0);
      setShortlistedIds(() => {
        const next: Record<string, true> = {};
        nextItems.forEach((item) => {
          const id = resolveListingId(item);
          if (id && item.shortlistFlag) {
            next[id] = true;
          }
        });
        shortlistIdSet.forEach((id) => {
          next[id] = true;
        });
        return next;
      });
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

  const mappedProperties = useMemo(() => items.map((item) => toPropertyCardFromListing(item)), [items]);

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
  const effectiveTotalPages = useMemo(
    () => (totalPages > 0 ? totalPages : filteredProperties.length > 0 ? page + 1 : 0),
    [filteredProperties.length, page, totalPages]
  );

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
    if (shortlistedIds[listingId]) {
      setPendingRemoveShortlistId(listingId);
      return;
    }
    try {
      setShortlistingId(listingId);
      setActionMessage('');
      try {
        await shortlistPropertyById(listingId);
        setShortlistedIds((prev) => ({ ...prev, [listingId]: true }));
        setActionMessage('Property shortlisted.');
      } catch (err) {
        if (isAlreadyShortlistedError(err)) {
          setShortlistedIds((prev) => ({ ...prev, [listingId]: true }));
          setActionMessage('Property is already shortlisted.');
          return;
        }
        throw err;
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

  const handleConfirmRemoveShortlist = useCallback(async () => {
    if (!pendingRemoveShortlistId) {
      return;
    }
    const listingId = pendingRemoveShortlistId;
    try {
      setShortlistingId(listingId);
      setActionMessage('');
      await removeShortlistedPropertyById(listingId);
      setShortlistedIds((prev) => {
        const next = { ...prev };
        delete next[listingId];
        return next;
      });
      setActionMessage('Property removed from shortlist.');
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
      setPendingRemoveShortlistId(null);
      setShortlistingId(null);
    }
  }, [pendingRemoveShortlistId]);

  const handleCancelRemoveShortlist = () => {
    setPendingRemoveShortlistId(null);
  };

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

  return (
    <>
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
          amenitySuggestions={[...LISTING_AMENITY_SUGGESTIONS]}
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
                    onImageClick={openImageLightbox}
                  />
                </Link>
              );
            })}
          </div>
        ) : null}

        <PaginationNav
          className="buyer-saved-pagination"
          page={page}
          totalPages={effectiveTotalPages}
          loading={loading}
          onPageChange={setPage}
        />
        </section>
      </BuyerWorkspace>
      <ShortlistRemoveModal
        isOpen={Boolean(pendingRemoveShortlistId)}
        onConfirm={() => void handleConfirmRemoveShortlist()}
        onCancel={handleCancelRemoveShortlist}
      />
      <BuyerPropertyImageLightbox
        isOpen={isImageLightboxOpen}
        images={lightboxImages}
        activeIndex={lightboxIndex}
        onClose={() => setIsImageLightboxOpen(false)}
        onSelectIndex={setLightboxIndex}
        onPrevious={previousLightboxImage}
        onNext={nextLightboxImage}
      />
    </>
  );
};
