import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PropertyCard } from '../../PropertyCard';
import type { Property } from '../../../types';
import {
  getSellerDetails,
  getShortlistedProperties,
  removeShortlistedPropertyById,
  shortlistPropertyById,
  type ListingRecord,
  type SellerDetailsResponse,
} from '../../../services/controllers';
import './BuyerSaved.css';

const parseNumber = (value: string | undefined, fallback = 0): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const listingId = (item: ListingRecord) => item.propid ?? item.id ?? '';
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

const toPropertyCardModel = (item: ListingRecord): Property => {
  const area = parseNumber(item.offerAreaSqFt ?? item.totalAreaSqFt, 0);
  const unitPrice = parseNumber(item.pricePerSqFt, 0);
  const imageGallery = reorderGalleryByMainImage(item.imageIds ?? [], item.mainImageId);
  return {
    id: listingId(item),
    title: item.projectName ?? 'Untitled Property',
    description: item.details ?? 'No description available.',
    price: unitPrice * (area > 0 ? area : 1),
    location: item.location ?? 'N/A',
    area,
    type: 'office',
    image: imageGallery[0] || 'https://via.placeholder.com/1200x900?text=No+Image',
    imageGallery,
    amenities: item.amenities ?? [],
  };
};

export const BuyerSavedCards: React.FC = () => {
  const [items, setItems] = useState<ListingRecord[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [sellerDetails, setSellerDetails] = useState<Record<string, SellerDetailsResponse>>({});
  const [shortlistLoadingId, setShortlistLoadingId] = useState<string | null>(null);
  const [detailsLoadingId, setDetailsLoadingId] = useState<string | null>(null);
  const [shortlistedState, setShortlistedState] = useState<Record<string, boolean>>({});

  const loadShortlist = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getShortlistedProperties(page, 10);
      setItems(response.content ?? []);
      setTotalPages(response.totalPages ?? 0);
      const nextShortlistedState: Record<string, boolean> = {};
      (response.content ?? []).forEach((item) => {
        const id = listingId(item);
        if (id) {
          nextShortlistedState[id] = true;
        }
      });
      setShortlistedState(nextShortlistedState);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Unable to load shortlisted properties.');
      } else {
        setError('Unable to load shortlisted properties.');
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadShortlist();
  }, [loadShortlist]);

  const properties = useMemo(() => items.map(toPropertyCardModel), [items]);

  const handleToggleShortlist = useCallback(
    async (propertyId: string) => {
      if (!propertyId) {
        return;
      }
      try {
        setShortlistLoadingId(propertyId);
        setActionMessage('');
        if (shortlistedState[propertyId]) {
          await removeShortlistedPropertyById(propertyId);
          setShortlistedState((prev) => ({ ...prev, [propertyId]: false }));
          setActionMessage('Property removed from shortlist.');
        } else {
          await shortlistPropertyById(propertyId);
          setShortlistedState((prev) => ({ ...prev, [propertyId]: true }));
          setActionMessage('Property shortlisted.');
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
        setShortlistLoadingId(null);
      }
    },
    [shortlistedState]
  );

  const handleSellerDetails = useCallback(async (propertyId: string) => {
    if (!propertyId) {
      return;
    }
    try {
      setDetailsLoadingId(propertyId);
      const response = await getSellerDetails(propertyId);
      setSellerDetails((prev) => ({ ...prev, [propertyId]: response }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setActionMessage(
          typeof err.response?.data?.message === 'string'
            ? err.response.data.message
            : 'Unable to fetch seller details.'
        );
      } else {
        setActionMessage('Unable to fetch seller details.');
      }
    } finally {
      setDetailsLoadingId(null);
    }
  }, []);

  return (
    <section className="buyer-saved" aria-label="Saved properties card view">
      {loading ? <p>Loading shortlisted properties...</p> : null}
      {error ? <p className="property-listing-error">{error}</p> : null}
      {actionMessage ? <p>{actionMessage}</p> : null}

      {!loading && !error && properties.length === 0 ? <p>No shortlisted properties found.</p> : null}

      {!loading && !error && properties.length > 0 ? (
        <div className="buyer-saved-grid">
          {properties.map((property) => {
            const details = sellerDetails[property.id];
            return (
              <div key={property.id}>
                <Link to={`/buyer/properties/${property.id}`} className="buyer-property-card-link">
                  <PropertyCard
                    property={property}
                    isShortlisted={Boolean(shortlistedState[property.id])}
                    onToggleShortlist={handleToggleShortlist}
                    shortlistLoading={shortlistLoadingId === property.id}
                  />
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => void handleSellerDetails(property.id)}
                    disabled={detailsLoadingId === property.id}
                  >
                    {detailsLoadingId === property.id ? 'Loading seller...' : 'Get Seller Details'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => void handleToggleShortlist(property.id)}
                    disabled={shortlistLoadingId === property.id}
                  >
                    {shortlistLoadingId === property.id
                      ? 'Updating...'
                      : shortlistedState[property.id]
                        ? 'Remove'
                        : 'Shortlist'}
                  </button>
                </div>
                {details ? (
                  <p style={{ marginTop: '0.45rem', fontSize: '0.85rem' }}>
                    Seller: {details.name || 'N/A'} | {details.email || 'N/A'} | {details.phone || 'N/A'}
                  </p>
                ) : null}
              </div>
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
  );
};
