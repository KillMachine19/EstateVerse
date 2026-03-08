import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { PropertyCard } from '../../PropertyCard';
import { PaginationNav } from '../../PaginationNav';
import { ShortlistRemoveModal } from '../../ShortlistRemoveModal';
import {
  getShortlistedProperties,
  removeShortlistedPropertyById,
  shortlistPropertyById,
  type ListingRecord,
} from '../../../services/controllers';
import { resolveListingId, toPropertyCardFromListing } from '../../../utils/listings';
import './BuyerSaved.css';

export const BuyerSavedCards: React.FC = () => {
  const [items, setItems] = useState<ListingRecord[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [shortlistLoadingId, setShortlistLoadingId] = useState<string | null>(null);
  const [pendingRemoveShortlistId, setPendingRemoveShortlistId] = useState<string | null>(null);
  const [shortlistedState, setShortlistedState] = useState<Record<string, boolean>>({});
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const loadShortlist = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getShortlistedProperties(page, 10);
      setItems(response.content ?? []);
      setTotalPages(response.totalPages ?? 0);
      const nextShortlistedState: Record<string, boolean> = {};
      (response.content ?? []).forEach((item) => {
        const id = resolveListingId(item);
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

  useEffect(() => {
    if (!isImageLightboxOpen || lightboxImages.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setLightboxIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
    }, 3200);
    return () => {
      window.clearInterval(timer);
    };
  }, [isImageLightboxOpen, lightboxImages.length]);

  const properties = useMemo(() => items.map((item) => toPropertyCardFromListing(item)), [items]);
  const effectiveTotalPages = useMemo(
    () => (totalPages > 0 ? totalPages : properties.length > 0 ? page + 1 : 0),
    [page, properties.length, totalPages]
  );

  const openImageLightbox = useCallback((images: string[], index: number) => {
    if (!images.length) {
      return;
    }
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsImageLightboxOpen(true);
  }, []);

  const handleToggleShortlist = useCallback(
    async (propertyId: string) => {
      if (!propertyId) {
        return;
      }
      if (shortlistedState[propertyId]) {
        setPendingRemoveShortlistId(propertyId);
        return;
      }
      try {
        setShortlistLoadingId(propertyId);
        setActionMessage('');
        await shortlistPropertyById(propertyId);
        setShortlistedState((prev) => ({ ...prev, [propertyId]: true }));
        setActionMessage('Property shortlisted.');
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
    [page, shortlistedState]
  );

  const handleConfirmRemoveShortlist = useCallback(async () => {
    if (!pendingRemoveShortlistId) {
      return;
    }
    const propertyId = pendingRemoveShortlistId;
    try {
      setShortlistLoadingId(propertyId);
      setActionMessage('');
      await removeShortlistedPropertyById(propertyId);
      setShortlistedState((prev) => ({ ...prev, [propertyId]: false }));
      let shouldMoveToPreviousPage = false;
      setItems((prev) => {
        const next = prev.filter((item) => resolveListingId(item) !== propertyId);
        shouldMoveToPreviousPage = next.length === 0 && page > 0;
        return next;
      });
      if (shouldMoveToPreviousPage) {
        setPage((prev) => Math.max(prev - 1, 0));
      }
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
      setShortlistLoadingId(null);
    }
  }, [page, pendingRemoveShortlistId]);

  const handleCancelRemoveShortlist = () => {
    setPendingRemoveShortlistId(null);
  };

  return (
    <section className="buyer-saved" aria-label="Saved properties card view">
      {loading ? <p>Loading shortlisted properties...</p> : null}
      {error ? <p className="property-listing-error">{error}</p> : null}
      {actionMessage ? <p>{actionMessage}</p> : null}

      {!loading && !error && properties.length === 0 ? <p>No shortlisted properties found.</p> : null}

      {!loading && !error && properties.length > 0 ? (
        <div className="buyer-saved-panel">
          <div className="buyer-saved-grid">
            {properties.map((property) => (
              <div key={property.id}>
                <Link to={`/buyer/properties/${property.id}`} className="buyer-property-card-link">
                  <PropertyCard
                    property={property}
                    isShortlisted={Boolean(shortlistedState[property.id])}
                    onToggleShortlist={handleToggleShortlist}
                    shortlistLoading={shortlistLoadingId === property.id}
                    onImageClick={openImageLightbox}
                  />
                </Link>
              </div>
            ))}
          </div>

          <PaginationNav
            className="buyer-saved-pagination"
            page={page}
            totalPages={effectiveTotalPages}
            loading={loading}
            onPageChange={setPage}
          />
        </div>
      ) : null}

      {isImageLightboxOpen ? (
        <div className="buyer-saved-lightbox-overlay" role="dialog" aria-modal="true" aria-label="Property gallery">
          <div className="buyer-saved-lightbox">
            <button
              type="button"
              className="buyer-saved-lightbox-close"
              aria-label="Close image viewer"
              onClick={() => setIsImageLightboxOpen(false)}
            >
              <FiX aria-hidden="true" />
            </button>
            <div id="buyerSavedCarousel" className="carousel slide buyer-saved-carousel" data-ride="carousel">
              <ol className="carousel-indicators">
                {lightboxImages.map((image, index) => (
                  <li
                    key={`${image}-${index}`}
                    className={lightboxIndex === index ? 'active' : ''}
                    onClick={() => setLightboxIndex(index)}
                    aria-hidden="true"
                  />
                ))}
              </ol>
              <div className="carousel-inner" role="listbox">
                {lightboxImages.map((image, index) => (
                  <div key={`${image}-${index}`} className={`carousel-item ${lightboxIndex === index ? 'active' : ''}`}>
                    <img className="d-block" src={image} alt={`Property image ${index + 1}`} />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="carousel-control-prev"
                onClick={() => setLightboxIndex((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1))}
                aria-label="Previous image"
              >
                <FiChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                className="carousel-control-next"
                onClick={() => setLightboxIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1))}
                aria-label="Next image"
              >
                <FiChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <ShortlistRemoveModal
        isOpen={Boolean(pendingRemoveShortlistId)}
        onConfirm={() => void handleConfirmRemoveShortlist()}
        onCancel={handleCancelRemoveShortlist}
      />
    </section>
  );
};
