import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiList } from 'react-icons/fi';
import { SellerWorkspace } from '../../components/SellerComponents';
import { PropertyCard } from '../../components/PropertyCard';
import { PropertiesFilters } from '../../components/PropertiesFilters';
import { BuyerPropertyImageLightbox } from '../../components/BuyerPropertyDetails';
import type { Property } from '../../types';
import {
  getBuyersWhoShortlistedPropertyById,
  getListedProperties,
  type ListingRecord,
} from '../../services/controllers';
import { LISTING_AMENITY_SUGGESTIONS } from '../../constants/listings';
import { resolveListingId, toPropertyCardFromListing } from '../../utils/listings';
import '../Properties/Properties.css';
import '../../components/PropertiesFilters/PropertiesFilters.css';
import './SellerListingsPage.css';

type ListingIntent = 'rentLease' | 'buying';

const toPropertyCardModel = (listing: ListingRecord, shortlistedBuyersCount: number): Property => {
  return {
    ...toPropertyCardFromListing(listing, { shortlistedBuyersCount }),
    shortlistedBuyersCount,
  };
};

interface SellerListingCard extends Property {
  listingIntents: ListingIntent[];
  techParkArea: string;
}

export const SellerListingsPage: React.FC = () => {
  const [items, setItems] = useState<ListingRecord[]>([]);
  const [buyerCounts, setBuyerCounts] = useState<Record<string, number>>({});
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadListedProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getListedProperties();
      const listings = response ?? [];
      setItems(listings);

      const countEntries = await Promise.all(
        listings.map(async (listing) => {
          const id = resolveListingId(listing);
          if (!id) {
            return ['', 0] as const;
          }
          try {
            const buyers = await getBuyersWhoShortlistedPropertyById(id);
            return [id, buyers.length] as const;
          } catch {
            return [id, 0] as const;
          }
        })
      );

      const nextCounts: Record<string, number> = {};
      countEntries.forEach(([id, count]) => {
        if (id) {
          nextCounts[id] = count;
        }
      });
      setBuyerCounts(nextCounts);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Failed to load listed properties.');
      } else {
        setError('Failed to load listed properties.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadListedProperties();
  }, [loadListedProperties]);

  const mappedProperties = useMemo<SellerListingCard[]>(() => {
    return items.map((listing) => {
      const id = resolveListingId(listing);
      const base = toPropertyCardModel(listing, buyerCounts[id] ?? 0);
      return {
        ...base,
        // API currently doesn't expose explicit listing intent; keep both active for seller-side filtering UX.
        listingIntents: ['rentLease', 'buying'],
        techParkArea: listing.location ?? 'Unknown Area',
      };
    });
  }, [buyerCounts, items]);

  const budgetMin = useMemo(() => {
    if (mappedProperties.length === 0) {
      return 0;
    }
    return Math.min(...mappedProperties.map((property) => property.price));
  }, [mappedProperties]);

  const budgetMax = useMemo(() => {
    if (mappedProperties.length === 0) {
      return 0;
    }
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
    const unique = Array.from(new Set(mappedProperties.map((property) => property.techParkArea).filter(Boolean)));
    return [...all, ...unique];
  }, [mappedProperties]);

  const filteredProperties = useMemo<SellerListingCard[]>(() => {
    const normalized = searchQuery.trim().toLowerCase();
    return mappedProperties.filter((property) => {
      const isBudgetMatch = property.price >= minBudget && property.price <= maxBudget;
      const isAreaMatch = selectedTechParkArea === 'All Areas' || property.techParkArea === selectedTechParkArea;
      const hasIntentFilter = includeRentLease || includeBuying;
      const isIntentMatch = !hasIntentFilter
        ? true
        : (includeRentLease && property.listingIntents.includes('rentLease')) ||
          (includeBuying && property.listingIntents.includes('buying'));
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
    <SellerWorkspace
      title="My Listings"
      description="Manage all active and archived listings, pricing, and listing visibility."
      icon={<FiList aria-hidden="true" />}
      wide
    >
      <main className="properties-page seller-listings-page">
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
            <h1 className="properties-title">My Listings</h1>
            <p className="properties-subtitle">Open a listing card to edit, update, or delete the property.</p>
          </header>

          {loading ? <p>Loading listed properties...</p> : null}
          {error ? <p className="property-listing-error">{error}</p> : null}

          {!loading && !error ? (
            <p className="properties-results-count">{filteredProperties.length} properties found</p>
          ) : null}

          {!loading && !error && filteredProperties.length > 0 ? (
            <div className="properties-grid" aria-label="Seller property listings">
              {filteredProperties.map((property) => (
                <Link key={property.id} to={`/seller/listings/${property.id}`} className="seller-listings-card-link">
                  <PropertyCard property={property} showShortlistedBuyersCount blurImageBackdrop onImageClick={openImageLightbox} />
                </Link>
              ))}
            </div>
          ) : null}

          {!loading && !error && filteredProperties.length === 0 ? (
            <div className="properties-empty-state" role="status" aria-live="polite">
              No listed properties found.
            </div>
          ) : null}
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
    </SellerWorkspace>
  );
};
