import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiHome, FiPhoneCall, FiUser, FiX } from 'react-icons/fi';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';
import { PropertyCard } from '../../components/PropertyCard';
import type { Property } from '../../types';
import {
  getAllProperties,
  getSellerDetails,
  getListingByIdAuth,
  getShortlistedProperties,
  removeShortlistedPropertyById,
  shortlistPropertyById,
  type ListingRecord,
  type SellerDetailsResponse,
} from '../../services/controllers';
import { scheduleCall } from '../../services/controllers/callsService';
import './BuyerPropertyDetailsPage.css';

const parseNumber = (value: string | undefined, fallback = 0): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const SQFT_TO_SQM = 0.092903;
const SQFT_TO_ACRE = 1 / 43_560;

const isAlreadyShortlistedError = (err: unknown): boolean => {
  if (!axios.isAxiosError(err)) {
    return false;
  }
  const payload = err.response?.data as { error?: unknown; message?: unknown } | undefined;
  const raw = typeof payload?.error === 'string' ? payload.error : typeof payload?.message === 'string' ? payload.message : '';
  return raw.toLowerCase().includes('already shortlisted');
};

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

const resolveListingId = (listing: ListingRecord): string => listing.propid ?? listing.id ?? '';

const toPropertyCardModel = (listing: ListingRecord): Property => {
  const imageGallery = reorderGalleryByMainImage(listing.imageIds ?? [], listing.mainImageId);
  const area = parseNumber(listing.offerAreaSqFt ?? listing.totalAreaSqFt, 0);
  const unitPrice = parseNumber(listing.pricePerSqFt, 0);

  return {
    id: resolveListingId(listing),
    title: listing.projectName ?? 'Untitled Property',
    description: listing.details ?? 'No description available.',
    price: unitPrice * (area > 0 ? area : 1),
    location: listing.location ?? 'N/A',
    area,
    type: 'office',
    image: imageGallery[0] || 'https://via.placeholder.com/1200x900?text=No+Image',
    imageGallery,
    amenities: listing.amenities ?? [],
  };
};

export const BuyerPropertyDetailsPage: React.FC = () => {
  const { propertyId = '' } = useParams();
  const [listing, setListing] = useState<ListingRecord | null>(null);
  const [seller, setSeller] = useState<SellerDetailsResponse | null>(null);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [dealerSummaryLoading, setDealerSummaryLoading] = useState(false);
  const [dealerPropertiesCount, setDealerPropertiesCount] = useState<number>(0);
  const [dealerLocalities, setDealerLocalities] = useState<string[]>([]);
  const [areaUnit, setAreaUnit] = useState<'sqft' | 'sqm' | 'acre'>('sqft');
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectMessage, setConnectMessage] = useState('');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectForm, setConnectForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    note: '',
  });

  const loadListing = useCallback(async () => {
    if (!propertyId) {
      return;
    }
    try {
      setLoading(true);
      setError('');
      const [listingResponse, sellerResponse] = await Promise.all([
        getListingByIdAuth(propertyId),
        (async () => {
          try {
            setSellerLoading(true);
            return await getSellerDetails(propertyId);
          } finally {
            setSellerLoading(false);
          }
        })(),
      ]);
      setListing(listingResponse);
      setSeller(sellerResponse);
      const shortlistStatus = await getShortlistedProperties(0, 10)
        .then((response) => (response.content ?? []).some((item) => resolveListingId(item) === propertyId))
        .catch(() => Boolean(listingResponse.shortlistFlag));
      setIsShortlisted(shortlistStatus || Boolean(listingResponse.shortlistFlag));

      if (sellerResponse?.name || sellerResponse?.email) {
        try {
          setDealerSummaryLoading(true);
          const firstPage = await getAllProperties({ page: 0, size: 100 });
          const allListings = [...(firstPage.content ?? [])];
          const totalPages = firstPage.totalPages ?? 0;

          if (totalPages > 1) {
            const extraPages = Array.from({ length: totalPages - 1 }, (_, index) => index + 1);
            const remaining = await Promise.all(extraPages.map((pageNumber) => getAllProperties({ page: pageNumber, size: 100 })));
            remaining.forEach((pageData) => {
              allListings.push(...(pageData.content ?? []));
            });
          }

          const sellerIdentity = `${sellerResponse.name ?? ''}|${sellerResponse.email ?? ''}`.toLowerCase();
          const tagged = await Promise.all(
            allListings.map(async (candidate) => {
              const candidateId = resolveListingId(candidate);
              if (!candidateId) {
                return null;
              }
              try {
                const candidateSeller = await getSellerDetails(candidateId);
                const candidateIdentity = `${candidateSeller.name ?? ''}|${candidateSeller.email ?? ''}`.toLowerCase();
                if (candidateIdentity && candidateIdentity === sellerIdentity) {
                  return candidate;
                }
              } catch {
                return null;
              }
              return null;
            })
          );

          const dealerListings = tagged.filter((item): item is ListingRecord => Boolean(item));
          const localities = Array.from(new Set(dealerListings.map((item) => item.location?.trim()).filter(Boolean))) as string[];
          setDealerPropertiesCount(dealerListings.length || 1);
          setDealerLocalities(localities);
        } catch {
          setDealerPropertiesCount(1);
          setDealerLocalities(sellerResponse.city ? [sellerResponse.city] : []);
        } finally {
          setDealerSummaryLoading(false);
        }
      } else {
        setDealerPropertiesCount(1);
        setDealerLocalities([]);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Unable to load property details.'
        );
      } else {
        setError('Unable to load property details.');
      }
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    void loadListing();
  }, [loadListing]);

  const property = useMemo(() => (listing ? toPropertyCardModel(listing) : null), [listing]);
  const displayOfferAreaSqFt = parseNumber(listing?.offerAreaSqFt, property?.area ?? 0);
  const displayTotalAreaSqFt = parseNumber(listing?.totalAreaSqFt, displayOfferAreaSqFt);
  const convertArea = useCallback((valueSqFt: number): number => {
    if (areaUnit === 'sqm') {
      return valueSqFt * SQFT_TO_SQM;
    }
    if (areaUnit === 'acre') {
      return valueSqFt * SQFT_TO_ACRE;
    }
    return valueSqFt;
  }, [areaUnit]);
  const areaUnitLabel = areaUnit === 'sqft' ? 'sq ft' : areaUnit === 'sqm' ? 'sq m' : 'acre';
  const formattedOfferArea = convertArea(displayOfferAreaSqFt).toLocaleString('en-US', {
    maximumFractionDigits: areaUnit === 'acre' ? 4 : 2,
  });
  const formattedTotalArea = convertArea(displayTotalAreaSqFt).toLocaleString('en-US', {
    maximumFractionDigits: areaUnit === 'acre' ? 4 : 2,
  });

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
  const onConnectInputChange = (field: keyof typeof connectForm, value: string) => {
    setConnectForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleConnectSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (connectLoading) {
      return;
    }

    const name = connectForm.name.trim();
    const email = connectForm.email.trim();
    const phone = connectForm.phone.trim();
    const note = connectForm.note.trim() || `Interested in ${listing?.projectName ?? 'this property'}.`;

    if (!name || !email || !phone || !connectForm.date || !connectForm.time) {
      setConnectMessage('Please fill name, email, phone, preferred date, and preferred time.');
      return;
    }

    try {
      setConnectLoading(true);
      setConnectMessage('');
      const [, month, day] = connectForm.date.split('-');
      const [rawHour, rawMinute] = connectForm.time.split(':');
      const hourNum = Number.parseInt(rawHour, 10);
      const minuteNum = Number.parseInt(rawMinute, 10);
      const period = hourNum >= 12 ? 'PM' : 'AM';
      const twelveHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
      const formattedMinute = `${minuteNum}`.padStart(2, '0');
      const prettyTime = `${twelveHour}:${formattedMinute} ${period}`;

      await scheduleCall({
        name,
        email,
        phone,
        company: 'Buyer Enquiry',
        dateMonth: month,
        dateDay: day,
        timeHour: `${twelveHour}`.padStart(2, '0'),
        timeMinute: `${minuteNum}`.padStart(2, '0'),
        timePeriod: period,
        time: prettyTime,
        message: note,
      });

      setConnectMessage('Request sent successfully. Dealer team will connect with you soon.');
      setConnectForm((prev) => ({ ...prev, note: '' }));
      setIsConnectModalOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setConnectMessage(
          typeof err.response?.data?.message === 'string'
            ? err.response.data.message
            : 'Unable to submit your request right now.'
        );
      } else {
        setConnectMessage('Unable to submit your request right now.');
      }
    } finally {
      setConnectLoading(false);
    }
  };

  const handleToggleShortlist = useCallback(
    async (targetId: string) => {
      if (!targetId || shortlistLoading) {
        return;
      }
      try {
        setShortlistLoading(true);
        setMessage('');
        if (isShortlisted) {
          await removeShortlistedPropertyById(targetId);
          setIsShortlisted(false);
          setMessage('Property removed from shortlist.');
        } else {
          try {
            await shortlistPropertyById(targetId);
            setIsShortlisted(true);
            setMessage('Property shortlisted.');
          } catch (err) {
            if (isAlreadyShortlistedError(err)) {
              await removeShortlistedPropertyById(targetId);
              setIsShortlisted(false);
              setMessage('Property removed from shortlist.');
              return;
            }
            throw err;
          }
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setMessage(
            typeof err.response?.data?.message === 'string'
              ? err.response.data.message
              : 'Unable to update shortlist.'
          );
        } else {
          setMessage('Unable to update shortlist.');
        }
      } finally {
        setShortlistLoading(false);
      }
    },
    [isShortlisted, shortlistLoading]
  );

  return (
    <BuyerWorkspace
      title="Property Details"
      description="View full listing details and manage your shortlist from a single screen."
      icon={<FiHome aria-hidden="true" />}
    >
      <section className="buyer-property-details">
        {loading ? <p>Loading property details...</p> : null}
        {error ? <p className="property-listing-error">{error}</p> : null}
        {message ? <p>{message}</p> : null}

        {!loading && !error && property ? (
          <>
            <div className="buyer-property-unit-row">
              <label htmlFor="buyer-area-unit">Area Unit</label>
              <select
                id="buyer-area-unit"
                value={areaUnit}
                onChange={(event) => setAreaUnit(event.target.value as 'sqft' | 'sqm' | 'acre')}
              >
                <option value="sqft">Sq ft</option>
                <option value="sqm">Sq m</option>
                <option value="acre">Acre</option>
              </select>
            </div>
            <div className="buyer-property-details-grid">
              <PropertyCard
                property={property}
                isShortlisted={isShortlisted}
                onToggleShortlist={handleToggleShortlist}
                shortlistLoading={shortlistLoading}
                onImageClick={openImageLightbox}
              />
              <div className="buyer-property-details-side">
                <article className="buyer-property-details-panel">
                  <h2>{property.title}</h2>
                  <p>{property.description}</p>
                  <ul>
                    <li><strong>Location:</strong> {property.location}</li>
                    <li><strong>Area on Offer:</strong> {formattedOfferArea} {areaUnitLabel}</li>
                    <li><strong>Total Area:</strong> {formattedTotalArea} {areaUnitLabel}</li>
                    <li><strong>Price / sq ft:</strong> {listing?.pricePerSqFt ?? 'N/A'}</li>
                    <li><strong>ROI:</strong> {listing?.roiPercent ?? 'N/A'}%</li>
                    <li><strong>Agreement Duration:</strong> {listing?.agreementDuration ?? 'N/A'}</li>
                  </ul>
                </article>
              </div>
            </div>
            <article className="buyer-property-dealer-card is-horizontal">
              <h3><FiUser aria-hidden="true" /> Dealer Details</h3>
              {sellerLoading ? <p>Loading dealer details...</p> : null}
              {!sellerLoading ? (
                <div className="buyer-property-dealer-horizontal">
                  <img
                    className="buyer-property-dealer-avatar"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(seller?.name || 'Dealer')}&background=0ea5e9&color=fff&size=128`}
                    alt={`${seller?.name || 'Dealer'} profile`}
                    loading="lazy"
                  />
                  <div className="buyer-property-dealer-col">
                    <p><strong>Name:</strong> {seller?.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {seller?.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {seller?.phone || 'N/A'}</p>
                  </div>
                  <div className="buyer-property-dealer-col">
                    <p><strong>Properties Listed:</strong> {dealerSummaryLoading ? 'Loading...' : dealerPropertiesCount}</p>
                    <p>
                      <strong>Localities:</strong>{' '}
                      {dealerSummaryLoading
                        ? 'Loading...'
                        : dealerLocalities.length > 0
                          ? dealerLocalities.join(', ')
                          : (seller?.city || 'N/A')}
                    </p>
                    <p className="buyer-property-dealer-about">
                      <strong>About {seller?.name || 'the dealer'}:</strong>{' '}
                      {seller?.name || 'This dealer'} specializes in commercial properties and supports site visits,
                      negotiation guidance, and end-to-end transaction support.
                    </p>
                  </div>
                </div>
              ) : null}
            </article>
          </>
        ) : null}

        <div className="buyer-property-details-footer">
          <div className="buyer-property-details-footer-actions">
            <button
              type="button"
              className="btn btn-primary buyer-launch-modal-btn"
              onClick={() => {
                setConnectMessage('');
                setIsConnectModalOpen(true);
              }}
            >
              <FiPhoneCall aria-hidden="true" />
              <span>Schedule Site Visit</span>
            </button>
          </div>
          <div className="buyer-property-details-back-wrap">
            <Link to="/buyer/search" className="buyer-property-details-back-link">
              <FiArrowLeft aria-hidden="true" />
              <span>Back to Search</span>
            </Link>
          </div>
          {connectMessage ? <p className="buyer-connect-message">{connectMessage}</p> : null}
        </div>
      </section>

      {isConnectModalOpen ? (
        <div className="buyer-connect-modal-overlay modal fade show" onClick={() => setIsConnectModalOpen(false)} role="presentation">
          <div className="modal-dialog" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal-content buyer-connect-modal-content">
              <div className="modal-header buyer-connect-modal-header">
                <h4 className="buyer-connect-modal-title">Schedule A Call</h4>
                <button type="button" className="buyer-connect-modal-close close" onClick={() => setIsConnectModalOpen(false)}>
                  <FiX aria-hidden="true" />
                </button>
              </div>
              <form className="modal-body buyer-connect-form" onSubmit={handleConnectSubmit}>
                <input className="form-control" type="text" placeholder="Your Name" value={connectForm.name} onChange={(e) => onConnectInputChange('name', e.target.value)} />
                <input className="form-control" type="email" placeholder="Email" value={connectForm.email} onChange={(e) => onConnectInputChange('email', e.target.value)} />
                <input className="form-control" type="tel" placeholder="Phone" value={connectForm.phone} onChange={(e) => onConnectInputChange('phone', e.target.value)} />
                <div className="buyer-connect-form-row">
                  <input className="form-control datepicker" type="date" value={connectForm.date} onChange={(e) => onConnectInputChange('date', e.target.value)} />
                  <input className="form-control datepicker" type="time" value={connectForm.time} onChange={(e) => onConnectInputChange('time', e.target.value)} />
                </div>
                <textarea className="form-control" placeholder="Message" rows={3} value={connectForm.note} onChange={(e) => onConnectInputChange('note', e.target.value)} />
                <div className="modal-footer buyer-connect-modal-footer">
                  <button type="button" className="btn btn-outline btn-sm buyer-modal-btn" onClick={() => setIsConnectModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm buyer-modal-btn" disabled={connectLoading}>
                    {connectLoading ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
      {isImageLightboxOpen ? (
        <div className="buyer-image-lightbox-overlay" onClick={() => setIsImageLightboxOpen(false)} role="presentation">
          <div className="buyer-image-lightbox" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className="buyer-image-lightbox-close" onClick={() => setIsImageLightboxOpen(false)}>
              <FiX aria-hidden="true" />
            </button>
            <img src={lightboxImages[lightboxIndex]} alt={`Property preview ${lightboxIndex + 1}`} />
            {lightboxImages.length > 1 ? (
              <div className="buyer-image-lightbox-controls">
                <button type="button" onClick={previousLightboxImage} aria-label="Previous image">
                  <FiChevronLeft aria-hidden="true" />
                </button>
                <span>{lightboxIndex + 1} / {lightboxImages.length}</span>
                <button type="button" onClick={nextLightboxImage} aria-label="Next image">
                  <FiChevronRight aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </BuyerWorkspace>
  );
};
