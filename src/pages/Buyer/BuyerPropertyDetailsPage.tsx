import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiHome, FiUser } from 'react-icons/fi';
import { BuyerWorkspace } from '../../components/BuyerComponents/BuyerWorkspace';
import { PropertyCard } from '../../components/PropertyCard';
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
import {
  sanitizeIndianPhoneLocalInput,
  toIndianE164Phone,
  validateScheduleVisitForm,
  type ScheduleVisitFormErrors,
  type ScheduleVisitFormValues,
} from '../../utils/validation';
import {
  parseListingNumber,
  resolveListingId,
  toPropertyCardFromListing,
} from '../../utils/listings';
import {
  BuyerPropertyImageLightbox,
  BuyerPropertyScheduleTab,
  BuyerPropertyTabsNav,
} from '../../components/BuyerPropertyDetails';
import { ShortlistRemoveModal } from '../../components/ShortlistRemoveModal';
import { AREA_UNIT_LABELS, SQFT_TO_ACRE, SQFT_TO_SQM } from '../../constants/units';
import './BuyerPropertyDetailsPage.css';

const isAlreadyShortlistedError = (err: unknown): boolean => {
  if (!axios.isAxiosError(err)) {
    return false;
  }
  const payload = err.response?.data as { error?: unknown; message?: unknown } | undefined;
  const raw = typeof payload?.error === 'string' ? payload.error : typeof payload?.message === 'string' ? payload.message : '';
  return raw.toLowerCase().includes('already shortlisted');
};

export const BuyerPropertyDetailsPage: React.FC = () => {
  const { propertyId = '' } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingRecord | null>(null);
  const [seller, setSeller] = useState<SellerDetailsResponse | null>(null);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isRemoveShortlistModalOpen, setIsRemoveShortlistModalOpen] = useState(false);
  const [dealerSummaryLoading, setDealerSummaryLoading] = useState(false);
  const [dealerPropertiesCount, setDealerPropertiesCount] = useState<number>(0);
  const [dealerLocalities, setDealerLocalities] = useState<string[]>([]);
  const [areaUnit, setAreaUnit] = useState<'sqft' | 'sqm' | 'acre'>('sqft');
  const [activeTab, setActiveTab] = useState<'details' | 'dealer' | 'schedule'>('details');
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const unitDropdownRef = useRef<HTMLDivElement | null>(null);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectMessage, setConnectMessage] = useState('');
  const [isVisitRequestedPopupOpen, setIsVisitRequestedPopupOpen] = useState(false);
  const [connectForm, setConnectForm] = useState<ScheduleVisitFormValues>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    note: '',
  });
  const [connectErrors, setConnectErrors] = useState<ScheduleVisitFormErrors>({});

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

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!unitDropdownRef.current?.contains(event.target as Node)) {
        console.log('[BuyerPropertyDetails] unit dropdown: outside click -> close');
        setIsUnitDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', onPointerDown);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
    };
  }, []);

  const property = useMemo(() => (listing ? toPropertyCardFromListing(listing) : null), [listing]);
  const displayOfferAreaSqFt = parseListingNumber(listing?.offerAreaSqFt, property?.area ?? 0);
  const displayTotalAreaSqFt = parseListingNumber(listing?.totalAreaSqFt, displayOfferAreaSqFt);
  const convertArea = useCallback((valueSqFt: number): number => {
    if (areaUnit === 'sqm') {
      return valueSqFt * SQFT_TO_SQM;
    }
    if (areaUnit === 'acre') {
      return valueSqFt * SQFT_TO_ACRE;
    }
    return valueSqFt;
  }, [areaUnit]);
  const areaUnitLabel = AREA_UNIT_LABELS[areaUnit];
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

  useEffect(() => {
    if (!isImageLightboxOpen || lightboxImages.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setLightboxIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
    }, 3200);
    return () => window.clearInterval(timer);
  }, [isImageLightboxOpen, lightboxImages.length]);

  useEffect(() => {
    if (!isVisitRequestedPopupOpen) {
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisitRequestedPopupOpen]);
  const onConnectInputChange = useCallback((field: keyof typeof connectForm, value: string) => {
    if (field === 'phone') {
      setConnectForm((prev) => ({ ...prev, phone: sanitizeIndianPhoneLocalInput(value) }));
      setConnectErrors((prev) => ({ ...prev, phone: undefined }));
      setConnectMessage('');
      return;
    }
    setConnectForm((prev) => ({ ...prev, [field]: value }));
    setConnectErrors((prev) => ({ ...prev, [field]: undefined }));
    setConnectMessage('');
  }, []);

  const handleConnectPhoneKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (allowedKeys.includes(event.key)) {
      return;
    }
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleConnectSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (connectLoading) {
      return;
    }

    const normalizedForm: ScheduleVisitFormValues = {
      ...connectForm,
      name: connectForm.name.trim(),
      email: connectForm.email.trim(),
      phone: connectForm.phone.trim(),
      date: connectForm.date.trim(),
      time: connectForm.time.trim(),
      note: connectForm.note.trim(),
    };
    const nextErrors = validateScheduleVisitForm(normalizedForm);

    if (Object.keys(nextErrors).length > 0) {
      setConnectErrors(nextErrors);
      setConnectMessage('Please correct the highlighted fields and try again.');
      return;
    }

    try {
      setConnectLoading(true);
      setConnectMessage('');
      setConnectErrors({});
      const [year, month, day] = normalizedForm.date.split('-');
      const [rawHour, rawMinute] = normalizedForm.time.split(':');
      if (!year || !month || !day || !rawHour || !rawMinute) {
        setConnectErrors({
          date: 'Please select a valid preferred date.',
          time: 'Please select a valid preferred time.',
        });
        setConnectMessage('Preferred date and time are required.');
        return;
      }

      const normalizedPhone = toIndianE164Phone(normalizedForm.phone);
      if (!normalizedPhone) {
        setConnectErrors({ phone: 'Please enter a valid Indian phone number.' });
        setConnectMessage('Please correct the highlighted fields and try again.');
        return;
      }
      const hourNum = Number.parseInt(rawHour, 10);
      const minuteNum = Number.parseInt(rawMinute, 10);
      if (!Number.isFinite(hourNum) || !Number.isFinite(minuteNum)) {
        setConnectErrors({ time: 'Please select a valid preferred time.' });
        setConnectMessage('Preferred date and time are required.');
        return;
      }
      const period = hourNum >= 12 ? 'PM' : 'AM';
      const twelveHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
      const formattedMinute = `${minuteNum}`.padStart(2, '0');
      const prettyTime = `${twelveHour}:${formattedMinute} ${period}`;

      await scheduleCall({
        name: normalizedForm.name,
        email: normalizedForm.email,
        phone: normalizedPhone,
        company: 'Buyer Enquiry',
        dateMonth: month,
        dateDay: day,
        timeHour: `${twelveHour}`.padStart(2, '0'),
        timeMinute: `${minuteNum}`.padStart(2, '0'),
        timePeriod: period,
        time: prettyTime,
        message: normalizedForm.note,
      });

      setConnectMessage('');
      setIsVisitRequestedPopupOpen(true);
      setConnectForm({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        note: '',
      });
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
          setIsRemoveShortlistModalOpen(true);
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

  const handleConfirmRemoveShortlist = useCallback(async () => {
    const targetId = property?.id;
    if (!targetId || shortlistLoading) {
      return;
    }
    try {
      setShortlistLoading(true);
      setMessage('');
      await removeShortlistedPropertyById(targetId);
      setIsShortlisted(false);
      setMessage('Property removed from shortlist.');
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
      setIsRemoveShortlistModalOpen(false);
      setShortlistLoading(false);
    }
  }, [property?.id, shortlistLoading]);

  const handleToggleUnitDropdown: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsUnitDropdownOpen((prev) => {
      const next = !prev;
      console.log('[BuyerPropertyDetails] unit dropdown toggle:', next);
      return next;
    });
  };

  const handleSelectAreaUnit = (unit: 'sqft' | 'sqm' | 'acre', event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    console.log(`[BuyerPropertyDetails] unit selected: ${unit}`);
    setAreaUnit(unit);
    setIsUnitDropdownOpen(false);
  };

  const handleCloseVisitRequestedPopup = () => {
    setIsVisitRequestedPopupOpen(false);
  };

  const handleGoBackToAllProperties = () => {
    setIsVisitRequestedPopupOpen(false);
    navigate('/buyer/search');
  };

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
          <section className="buyer-property-tabs-card">
            <div className="buyer-property-main-card">
              <PropertyCard
                property={property}
                isShortlisted={isShortlisted}
                onToggleShortlist={handleToggleShortlist}
                shortlistLoading={shortlistLoading}
                onImageClick={openImageLightbox}
              />
              <BuyerPropertyTabsNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                areaUnit={areaUnit}
                isUnitDropdownOpen={isUnitDropdownOpen}
                unitDropdownRef={unitDropdownRef}
                onToggleUnitDropdown={handleToggleUnitDropdown}
                onSelectAreaUnit={handleSelectAreaUnit}
              />
              <div className="buyer-property-tabs-body">
                {activeTab === 'details' ? (
                  <article className="buyer-property-details-panel property-card-content">
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
                ) : null}
                {activeTab === 'dealer' ? (
                  <article className="buyer-property-dealer-card is-horizontal">
                    <h3><FiUser aria-hidden="true" /> Dealer Details</h3>
                    {sellerLoading ? <p>Loading dealer details...</p> : null}
                    {!sellerLoading ? (
                      <div className="buyer-property-dealer-horizontal">
                        <div className="buyer-property-dealer-profile-card">
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
                ) : null}
                {activeTab === 'schedule' ? (
                  <BuyerPropertyScheduleTab
                    connectForm={connectForm}
                    connectErrors={connectErrors}
                    connectLoading={connectLoading}
                    onSubmit={handleConnectSubmit}
                    onInputChange={onConnectInputChange}
                    onPhoneKeyDown={handleConnectPhoneKeyDown}
                  />
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <div className="buyer-property-outside-footer">
          <Link to="/buyer/search" className="buyer-property-details-back-link">
            <FiArrowLeft aria-hidden="true" />
            <span>Back to Search</span>
          </Link>
        </div>
        {connectMessage ? <p className="buyer-connect-message">{connectMessage}</p> : null}
      </section>
      {isVisitRequestedPopupOpen ? (
        <div className="sc-overlay buyer-visit-popup-overlay" role="presentation">
          <div
            className="sc-dialog buyer-visit-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="buyer-visit-popup-title"
          >
            <h3 id="buyer-visit-popup-title">Visit Requested</h3>
            <p>Visit has been requested. Wait for seller to respond.</p>
            <div className="buyer-visit-popup-actions">
              <button type="button" className="buyer-visit-popup-btn is-primary" onClick={handleGoBackToAllProperties}>
                Go back to all properties
              </button>
              <button type="button" className="buyer-visit-popup-btn is-secondary" onClick={handleCloseVisitRequestedPopup}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <BuyerPropertyImageLightbox
        isOpen={isImageLightboxOpen}
        images={lightboxImages}
        activeIndex={lightboxIndex}
        onClose={() => setIsImageLightboxOpen(false)}
        onSelectIndex={setLightboxIndex}
        onPrevious={previousLightboxImage}
        onNext={nextLightboxImage}
      />
      <ShortlistRemoveModal
        isOpen={isRemoveShortlistModalOpen}
        onConfirm={() => void handleConfirmRemoveShortlist()}
        onCancel={() => setIsRemoveShortlistModalOpen(false)}
      />
    </BuyerWorkspace>
  );
};
