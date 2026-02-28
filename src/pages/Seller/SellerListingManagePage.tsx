import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiEdit3, FiImage, FiPlus, FiStar, FiX } from 'react-icons/fi';
import { SellerWorkspace } from '../../components/SellerComponents';
import { PropertyCard } from '../../components/PropertyCard';
import type { Property } from '../../types';
import {
  deletePropertyById,
  getBuyerDetailsById,
  getBuyersWhoShortlistedPropertyById,
  getListingByIdAuth,
  type BuyerRecord,
  type ListingRecord,
  uploadListingImages,
  updateProperty,
} from '../../services/controllers';
import '../../components/PropertyListingForm/PropertyListingForm.css';
import './SellerListingManagePage.css';

const SQM_TO_SQFT = 10.7639;
const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE_BYTES = 1.5 * 1024 * 1024;
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

interface EditDraft {
  projectName: string;
  location: string;
  latitude: string;
  longitude: string;
  totalAreaSqFt: string;
  offerAreaSqFt: string;
  pricePerSqFt: string;
  roiPercent: string;
  agreementDuration: string;
  details: string;
  amenities: string[];
}

const parseNumber = (value: string | undefined, fallback = 0): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const resolveId = (listing: ListingRecord) => listing.propid ?? listing.id ?? '';

const parseAgreementDigits = (value: string | undefined): string => {
  if (!value) {
    return '';
  }
  return value.replace(/\D/g, '').slice(0, 2);
};

const isNonUrlImageId = (value: string): boolean => !/^https?:\/\//i.test(value);
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
const normalizeImageId = (value: string | undefined): string => {
  if (!value) {
    return '';
  }
  if (isNonUrlImageId(value)) {
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
const resolveImagePreviewSource = (value: string): string => {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return `/api/uploads/${value}`;
};

const toPropertyCardModel = (listing: ListingRecord, shortlistedBuyersCount: number): Property => {
  const area = parseNumber(listing.offerAreaSqFt ?? listing.totalAreaSqFt, 0);
  const unitPrice = parseNumber(listing.pricePerSqFt, 0);
  const imageGallery = reorderGalleryByMainImage(listing.imageIds ?? [], listing.mainImageId);

  return {
    id: resolveId(listing),
    title: listing.projectName ?? 'Untitled Property',
    description: listing.details ?? 'No description available.',
    price: unitPrice * (area > 0 ? area : 1),
    location: listing.location ?? 'N/A',
    area,
    type: 'office',
    image: imageGallery[0] || 'https://via.placeholder.com/1200x900?text=No+Image',
    imageGallery,
    amenities: listing.amenities ?? [],
    shortlistedBuyersCount,
  };
};

export const SellerListingManagePage: React.FC = () => {
  const { propertyId = '' } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState<ListingRecord | null>(null);
  const [buyers, setBuyers] = useState<BuyerRecord[]>([]);
  const [buyerDetailsById, setBuyerDetailsById] = useState<Record<string, BuyerRecord>>({});

  const [draft, setDraft] = useState<EditDraft>({
    projectName: '',
    location: '',
    latitude: '',
    longitude: '',
    totalAreaSqFt: '',
    offerAreaSqFt: '',
    pricePerSqFt: '',
    roiPercent: '',
    agreementDuration: '',
    details: '',
    amenities: [],
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [amenityError, setAmenityError] = useState('');
  const [detailsError, setDetailsError] = useState('');
  const [imageError, setImageError] = useState('');

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [buyersLoading, setBuyersLoading] = useState(false);
  const [buyerDetailsLoadingId, setBuyerDetailsLoadingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const pageContent = document.querySelector('.page-content');
    if (pageContent instanceof HTMLElement) {
      pageContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const loadData = useCallback(async () => {
    if (!propertyId) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      const [listingResponse, buyersResponse] = await Promise.all([
        getListingByIdAuth(propertyId),
        getBuyersWhoShortlistedPropertyById(propertyId),
      ]);

      setListing(listingResponse);
      setBuyers(buyersResponse ?? []);
      setDraft({
        projectName: listingResponse.projectName ?? '',
        location: listingResponse.location ?? '',
        latitude: listingResponse.latitude ?? '',
        longitude: listingResponse.longitude ?? '',
        totalAreaSqFt: listingResponse.totalAreaSqFt ?? '',
        offerAreaSqFt: listingResponse.offerAreaSqFt ?? '',
        pricePerSqFt: listingResponse.pricePerSqFt ?? '',
        roiPercent: listingResponse.roiPercent ?? '',
        agreementDuration: parseAgreementDigits(listingResponse.agreementDuration),
        details: listingResponse.details ?? '',
        amenities: listingResponse.amenities ?? [],
      });

      setNewImages([]);
      const existingImages = listingResponse.imageIds ?? [];
      const normalizedMainImageId = normalizeImageId(listingResponse.mainImageId);
      const existingMainIndex = existingImages.findIndex((imageId) => normalizeImageId(imageId) === normalizedMainImageId);
      if (existingMainIndex >= 0) {
        setMainImageIndex(existingMainIndex);
      } else if (existingImages.length > 0) {
        setMainImageIndex(0);
      } else {
        setMainImageIndex(null);
      }
      setImageError('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Failed to load listing details.');
      } else {
        setError('Failed to load listing details.');
      }
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    const previews = newImages.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return previews;
    });

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  useEffect(() => {
    if (banner || error || message) {
      scrollToTop();
    }
  }, [banner, error, message, scrollToTop]);

  const mappedCard = useMemo(() => {
    if (!listing) {
      return null;
    }

    return toPropertyCardModel(
      {
        ...listing,
        projectName: draft.projectName,
        location: draft.location,
        details: draft.details,
        offerAreaSqFt: draft.offerAreaSqFt,
        pricePerSqFt: draft.pricePerSqFt,
        amenities: draft.amenities,
      },
      buyers.length
    );
  }, [buyers.length, draft, listing]);

  const gridImageSources = useMemo(() => {
    if (newImagePreviews.length > 0) {
      return newImagePreviews;
    }
    return (listing?.imageIds ?? []).map(resolveImagePreviewSource);
  }, [listing?.imageIds, newImagePreviews]);

  const handleDraftChange = (field: keyof EditDraft, value: string) => {
    if (field === 'totalAreaSqFt' || field === 'offerAreaSqFt' || field === 'pricePerSqFt') {
      if (!/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }

    if (field === 'roiPercent' || field === 'agreementDuration') {
      if (!/^\d*$/.test(value)) {
        return;
      }
      if (value.length > 2) {
        return;
      }
    }

    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const addAmenity = (rawValue: string) => {
    const value = rawValue.trim();
    if (!value) {
      return;
    }

    if (draft.amenities.length >= 10) {
      setAmenityError('Maximum 10 amenities allowed.');
      return;
    }

    if (draft.amenities.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setAmenityError('Amenity already added.');
      return;
    }

    setDraft((prev) => ({ ...prev, amenities: [...prev.amenities, value] }));
    setAmenityInput('');
    setAmenityError('');
  };

  const removeAmenity = (indexToRemove: number) => {
    setDraft((prev) => ({ ...prev, amenities: prev.amenities.filter((_, index) => index !== indexToRemove) }));
    setAmenityError('');
  };

  const handleAmenityKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addAmenity(amenityInput.replace(',', ''));
    }
  };

  const getFileFingerprint = async (file: File) => {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    }
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    const validFiles = files.filter((file) => file.size <= MAX_IMAGE_SIZE_BYTES);
    if (validFiles.length !== files.length) {
      setImageError('Each image must be 1.5 MB or smaller.');
    } else {
      setImageError('');
    }

    const existingFingerprints = new Set<string>();
    for (const file of newImages) {
      existingFingerprints.add(await getFileFingerprint(file));
    }

    const nextUniqueFiles: File[] = [];
    for (const file of validFiles) {
      const fingerprint = await getFileFingerprint(file);
      if (existingFingerprints.has(fingerprint)) {
        continue;
      }
      existingFingerprints.add(fingerprint);
      nextUniqueFiles.push(file);
    }

    const nextFiles = [...newImages, ...nextUniqueFiles];
    const cappedFiles = nextFiles.slice(0, MAX_IMAGES);
    if (nextFiles.length > MAX_IMAGES) {
      setImageError('You can upload up to 6 images.');
    }

    setNewImages(cappedFiles);
    if (cappedFiles.length > 0 && mainImageIndex === null) {
      setMainImageIndex(0);
    }
    if (mainImageIndex !== null && mainImageIndex >= cappedFiles.length) {
      setMainImageIndex(0);
    }

    event.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setMainImageIndex((prevMainIndex) => {
      if (prevMainIndex === null) {
        return null;
      }
      if (indexToRemove === prevMainIndex) {
        return newImages.length - 1 > 0 ? 0 : null;
      }
      if (indexToRemove < prevMainIndex) {
        return prevMainIndex - 1;
      }
      return prevMainIndex;
    });
  };

  const validateDraft = (): string | null => {
    const numericValue = /^\d+(\.\d+)?$/;

    if (!draft.projectName.trim()) return 'Project Name is required.';
    if (!draft.location.trim()) return 'Location is required.';
    if (!draft.totalAreaSqFt.trim()) return 'Total Area is required.';
    if (!draft.offerAreaSqFt.trim()) return 'Area on Offer is required.';
    if (!draft.pricePerSqFt.trim()) return 'Price is required.';
    if (!draft.roiPercent.trim()) return 'ROI is required.';
    if (!draft.agreementDuration.trim()) return 'Agreement Duration is required.';
    if (!draft.details.trim()) return 'Details are required.';
    if (draft.amenities.length === 0) return 'Add at least one amenity.';

    if (!numericValue.test(draft.totalAreaSqFt)) return 'Total Area must be numeric.';
    if (!numericValue.test(draft.offerAreaSqFt)) return 'Area on Offer must be numeric.';
    if (!numericValue.test(draft.pricePerSqFt)) return 'Price must be numeric.';

    const totalArea = parseNumber(draft.totalAreaSqFt, NaN);
    const offerArea = parseNumber(draft.offerAreaSqFt, NaN);
    const price = parseNumber(draft.pricePerSqFt, NaN);

    if (!Number.isFinite(totalArea) || !Number.isFinite(offerArea) || !Number.isFinite(price)) {
      return 'Total Area, Area on Offer and Price must be numeric values.';
    }

    if (offerArea > totalArea) {
      return 'Area on Offer cannot exceed Total Area.';
    }

    if (!/^\d{1,2}$/.test(draft.roiPercent)) {
      return 'ROI must be numeric and a maximum of 2 digits.';
    }

    if (!/^\d{1,2}$/.test(draft.agreementDuration)) {
      return 'Agreement Duration must be numeric and a maximum of 2 digits.';
    }

    const detailWordCount = draft.details.trim().split(/\s+/).filter(Boolean).length;
    if (detailWordCount > 150) {
      return 'Other details can have a maximum of 150 words.';
    }

    if (newImages.length > 0) {
      if (newImages.length !== MAX_IMAGES) {
        return 'Please upload exactly 6 replacement images for update.';
      }
      if (mainImageIndex === null || !newImages[mainImageIndex]) {
        return 'Please select a main image from uploaded replacement images.';
      }
    } else if (listing) {
      const existingImageIds = (listing.imageIds ?? []).map(normalizeImageId).filter(Boolean);
      const existingMainImageId = normalizeImageId(listing.mainImageId);
      if (existingImageIds.length !== MAX_IMAGES || !existingMainImageId || !existingImageIds.includes(existingMainImageId)) {
        return 'Please upload 6 images and select a main image before updating this property.';
      }
    }

    return null;
  };

  const handleUpdate = useCallback(async () => {
    if (!listing) {
      return;
    }

    const validationError = validateDraft();
    if (validationError) {
      setBanner({ type: 'error', text: validationError });
      setMessage('');
      return;
    }

    const id = resolveId(listing);
    const totalAreaSqFt = parseNumber(draft.totalAreaSqFt, 0);
    const offerAreaSqFt = parseNumber(draft.offerAreaSqFt, 0);
    const pricePerSqFt = parseNumber(draft.pricePerSqFt, 0);
    const amenities = draft.amenities;

    let imageIds: string[] = [];
    let mainImageId = '';

    try {
      setUpdating(true);
      setBanner(null);
      setMessage('');

      if (newImages.length > 0) {
        const uploadResponse = await uploadListingImages(newImages);
        imageIds = (uploadResponse.imageIds ?? []).slice(0, MAX_IMAGES);
        mainImageId = mainImageIndex !== null ? imageIds[mainImageIndex] ?? '' : '';
      } else {
        const existingImages = listing.imageIds ?? [];
        imageIds = existingImages.map(normalizeImageId).filter(Boolean).slice(0, MAX_IMAGES);
        const selectedExistingImage = mainImageIndex !== null ? existingImages[mainImageIndex] ?? '' : '';
        const selectedExistingId = normalizeImageId(selectedExistingImage);
        mainImageId = selectedExistingId || normalizeImageId(listing.mainImageId);
      }

      if (imageIds.length !== MAX_IMAGES || !mainImageId || !imageIds.includes(mainImageId)) {
        setBanner({ type: 'error', text: 'mainImageId must exist in imageIds. Upload 6 valid images and select a main image.' });
        return;
      }

      await updateProperty(id, {
        projectName: draft.projectName,
        location: draft.location,
        latitude: draft.latitude,
        longitude: draft.longitude,
        totalAreaSqFt: totalAreaSqFt.toFixed(2),
        totalAreaSqM: (totalAreaSqFt / SQM_TO_SQFT).toFixed(2),
        offerAreaSqFt: offerAreaSqFt.toFixed(2),
        offerAreaSqM: (offerAreaSqFt / SQM_TO_SQFT).toFixed(2),
        areaUnitSelected: 'sqft',
        pricePerSqFt: pricePerSqFt.toFixed(2),
        pricePerSqM: (pricePerSqFt * SQM_TO_SQFT).toFixed(2),
        priceUnitSelected: 'sqft',
        amenities,
        roiPercent: draft.roiPercent,
        agreementDuration: `${draft.agreementDuration} years`,
        details: draft.details,
        imageIds,
        mainImageId,
      });

      setBanner({ type: 'success', text: 'Property updated successfully.' });
      setNewImages([]);
      setMainImageIndex(null);
      await loadData();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setBanner({
          type: 'error',
          text: typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Failed to update property.',
        });
      } else {
        setBanner({ type: 'error', text: 'Failed to update property.' });
      }
    } finally {
      setUpdating(false);
    }
  }, [draft, listing, loadData, mainImageIndex, newImages]);

  const handleDelete = useCallback(async () => {
    if (!listing) {
      return;
    }

    const id = resolveId(listing);
    try {
      setDeleting(true);
      setBanner(null);
      setMessage('');
      await deletePropertyById(id);
      navigate('/seller/listings');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setBanner({
          type: 'error',
          text: typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Failed to delete property.',
        });
      } else {
        setBanner({ type: 'error', text: 'Failed to delete property.' });
      }
    } finally {
      setDeleting(false);
    }
  }, [listing, navigate]);

  const handleRefreshBuyers = useCallback(async () => {
    if (!propertyId) {
      return;
    }

    try {
      setBuyersLoading(true);
      const response = await getBuyersWhoShortlistedPropertyById(propertyId);
      setBuyers(response ?? []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Failed to load shortlisted buyers.');
      } else {
        setMessage('Failed to load shortlisted buyers.');
      }
    } finally {
      setBuyersLoading(false);
    }
  }, [propertyId]);

  const handleBuyerDetails = useCallback(async (buyerId: string) => {
    if (!buyerId) {
      return;
    }

    try {
      setBuyerDetailsLoadingId(buyerId);
      const response = await getBuyerDetailsById(buyerId);
      setBuyerDetailsById((prev) => ({ ...prev, [buyerId]: response }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(typeof err.response?.data?.message === 'string' ? err.response.data.message : 'Failed to load buyer details.');
      } else {
        setMessage('Failed to load buyer details.');
      }
    } finally {
      setBuyerDetailsLoadingId(null);
    }
  }, []);

  return (
    <SellerWorkspace
      title="Manage Listing"
      description="Edit complete listing details, track shortlisted buyers, or remove this listing."
      icon={<FiEdit3 aria-hidden="true" />}
      wide
    >
      <section className="seller-listing-manage-page">
        {loading ? <p>Loading listing...</p> : null}
        {error ? <p className="property-listing-error">{error}</p> : null}
        {banner ? (
          <p className={`seller-listing-manage-message ${banner.type === 'error' ? 'is-error' : 'is-success'}`}>{banner.text}</p>
        ) : null}
        {message ? <p className="seller-listing-manage-message">{message}</p> : null}

        {mappedCard ? (
          <div className="seller-listing-manage-shell">
            <div className="seller-listing-manage-layout">
              <PropertyCard property={mappedCard} showShortlistedBuyersCount blurImageBackdrop />

              <form
                className="property-listing-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleUpdate();
                }}
              >
                <div className="property-listing-grid">
                  <label>
                    <span>Project Name <span className="property-listing-required">*</span></span>
                    <input type="text" value={draft.projectName} onChange={(event) => handleDraftChange('projectName', event.target.value)} required />
                  </label>
                  <label>
                    <span>Location <span className="property-listing-required">*</span></span>
                    <input type="text" value={draft.location} onChange={(event) => handleDraftChange('location', event.target.value)} required />
                  </label>
                  <label>
                    <span>Total Area (sq ft) <span className="property-listing-required">*</span></span>
                    <input type="text" value={draft.totalAreaSqFt} onChange={(event) => handleDraftChange('totalAreaSqFt', event.target.value)} inputMode="decimal" required />
                  </label>
                  <label>
                    <span>Area on Offer (sq ft) <span className="property-listing-required">*</span></span>
                    <input type="text" value={draft.offerAreaSqFt} onChange={(event) => handleDraftChange('offerAreaSqFt', event.target.value)} inputMode="decimal" required />
                  </label>
                  <label>
                    <span>Price Per SqFt <span className="property-listing-required">*</span></span>
                    <input type="text" value={draft.pricePerSqFt} onChange={(event) => handleDraftChange('pricePerSqFt', event.target.value)} inputMode="decimal" required />
                  </label>
                  <label>
                    <span>ROI (%) <span className="property-listing-required">*</span></span>
                    <input type="text" value={draft.roiPercent} onChange={(event) => handleDraftChange('roiPercent', event.target.value)} inputMode="numeric" maxLength={2} required />
                  </label>
                  <label>
                    <span>Agreement Duration (years) <span className="property-listing-required">*</span></span>
                    <input type="text" value={draft.agreementDuration} onChange={(event) => handleDraftChange('agreementDuration', event.target.value)} inputMode="numeric" maxLength={2} required />
                  </label>
                  <label>
                    <span>Latitude</span>
                    <input type="text" value={draft.latitude} onChange={(event) => handleDraftChange('latitude', event.target.value)} />
                  </label>
                  <label>
                    <span>Longitude</span>
                    <input type="text" value={draft.longitude} onChange={(event) => handleDraftChange('longitude', event.target.value)} />
                  </label>
                </div>

                <div className="property-listing-section-card">
                  <label className="property-listing-images">
                    <span>Update Images (Upload Exactly 6) <span className="property-listing-required">*</span></span>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="property-listing-image-input"
                    />
                    <div className="property-listing-image-grid">
                      {Array.from({ length: MAX_IMAGES }).map((_, index) => {
                        const preview = gridImageSources[index];
                        const showingNewUploads = newImagePreviews.length > 0;
                        if (preview) {
                          return (
                            <div key={`preview-${index}`} className={`property-listing-image-slot is-filled ${mainImageIndex === index ? 'is-main' : ''}`}>
                              <img src={preview} alt={`Replacement preview ${index + 1}`} />
                              {showingNewUploads ? (
                                <button
                                  type="button"
                                  className="property-listing-image-remove"
                                  onClick={() => handleRemoveImage(index)}
                                  aria-label={`Remove replacement image ${index + 1}`}
                                >
                                  <FiX aria-hidden="true" />
                                </button>
                              ) : null}
                              <button
                                type="button"
                                className="property-listing-image-main"
                                onClick={() => setMainImageIndex(index)}
                                aria-label="Set as main image"
                              >
                                <FiStar aria-hidden="true" />
                              </button>
                            </div>
                          );
                        }
                        return (
                          <button
                            type="button"
                            key={`placeholder-${index}`}
                            className="property-listing-image-slot is-empty"
                            onClick={() => imageInputRef.current?.click()}
                            aria-label="Add replacement image"
                          >
                            <FiImage aria-hidden="true" />
                            <span>Add Image</span>
                            <FiPlus aria-hidden="true" className="property-listing-image-plus" />
                          </button>
                        );
                      })}
                    </div>
                    <p className="property-listing-helper">
                      Existing images are shown here. Upload 6 new images only when you want to replace them.
                    </p>
                    {imageError ? <small className="property-listing-error">{imageError}</small> : null}
                  </label>
                </div>

                <div className="property-listing-section-card">
                  <div className="property-listing-amenities">
                    <span>Amenities <span className="property-listing-required">*</span></span>
                    <div className="property-listing-chips">
                      {draft.amenities.map((amenity, index) => (
                        <div key={`${amenity}-${index}`} className="property-listing-chip">
                          <span className="property-listing-chip__label">{amenity}</span>
                          <button
                            type="button"
                            className="property-listing-chip__remove"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              removeAmenity(index);
                            }}
                            aria-label={`Remove ${amenity}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        value={amenityInput}
                        onChange={(event) => {
                          setAmenityInput(event.target.value);
                          setAmenityError('');
                        }}
                        onKeyDown={handleAmenityKeyDown}
                        placeholder={draft.amenities.length < 10 ? 'Add amenity and press Enter' : 'Max 10 amenities'}
                        disabled={draft.amenities.length >= 10}
                      />
                    </div>
                    <div className="property-listing-suggestions">
                      {AMENITY_SUGGESTIONS.map((amenity) => (
                        <button
                          key={amenity}
                          type="button"
                          className="property-listing-suggestion"
                          onClick={() => addAmenity(amenity)}
                          disabled={draft.amenities.length >= 10 || draft.amenities.some((item) => item.toLowerCase() === amenity.toLowerCase())}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                    {amenityError ? <small className="property-listing-error">{amenityError}</small> : null}
                  </div>
                </div>

                <label className="property-listing-textarea">
                  <span>Details <span className="property-listing-required">*</span></span>
                  <textarea
                    value={draft.details}
                    onChange={(event) => {
                      handleDraftChange('details', event.target.value);
                      const count = event.target.value.trim().split(/\s+/).filter(Boolean).length;
                      setDetailsError(count > 150 ? 'Other details can have a maximum of 150 words.' : '');
                    }}
                    rows={4}
                    required
                  />
                  <div className="property-listing-wordcount">
                    <span>{draft.details.trim().split(/\s+/).filter(Boolean).length}/150 words</span>
                    {detailsError ? <small className="property-listing-error">{detailsError}</small> : null}
                  </div>
                </label>

                <div className="property-listing-actions">
                  <button type="submit" className="btn btn-primary btn-sm" disabled={updating}>
                    {updating ? 'Updating...' : 'Update Property'}
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => void handleDelete()} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete Property'}
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => void handleRefreshBuyers()} disabled={buyersLoading}>
                    {buyersLoading ? 'Refreshing...' : 'Refresh Shortlisted Buyers'}
                  </button>
                </div>

                {buyers.length > 0 ? (
                  <div className="seller-listing-manage-buyers">
                    <p>Shortlisted Buyers ({buyers.length})</p>
                    {buyers.map((buyer, index) => {
                      const buyerId = buyer.id ?? '';
                      const details = buyerDetailsById[buyerId];
                      return (
                        <div key={buyerId || `${buyer.username ?? 'buyer'}-${index}`} className="seller-listing-manage-buyer-item">
                          <span>{buyer.name || buyer.username || buyerId}</span>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => void handleBuyerDetails(buyerId)}
                            disabled={buyerDetailsLoadingId === buyerId}
                          >
                            {buyerDetailsLoadingId === buyerId ? 'Loading...' : 'Buyer Details'}
                          </button>
                          {details ? <small>{details.email || 'N/A'} | {details.phone || 'N/A'} | {details.city || 'N/A'}</small> : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </form>
            </div>

            <div className="seller-listing-manage-bottom">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate('/seller/listings')}>
                <FiArrowLeft aria-hidden="true" /> Back To Listings
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </SellerWorkspace>
  );
};
