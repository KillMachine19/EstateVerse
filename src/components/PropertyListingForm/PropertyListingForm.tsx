import React, { useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { FiImage, FiPlus, FiStar, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { createListing, uploadListingImages } from '../../services/controllers';
import {
  LISTING_AMENITY_SUGGESTIONS,
  LISTING_MAX_IMAGES,
  LISTING_MAX_IMAGE_SIZE_BYTES,
} from '../../constants/listings';
import { SQM_TO_SQFT } from '../../constants/units';
import './PropertyListingForm.css';

export interface PropertyListingFormValues {
  projectName: string;
  location: string;
  latitude: string;
  longitude: string;
  totalArea: string;
  offerArea: string;
  pricePerSqFt: string;
  amenities: Array<{ id: string; label: string }>;
  roi: string;
  agreementDuration: string;
  details: string;
  images: File[];
}

const defaultValues: PropertyListingFormValues = {
  projectName: '',
  location: '',
  latitude: '',
  longitude: '',
  totalArea: '',
  offerArea: '',
  pricePerSqFt: '',
  amenities: [],
  roi: '',
  agreementDuration: '',
  details: '',
  images: [],
};

export const PropertyListingForm: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<PropertyListingFormValues>(defaultValues);
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitBanner, setSubmitBanner] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState('');
  const [amenityError, setAmenityError] = useState('');
  const [detailsError, setDetailsError] = useState('');
  const [imageError, setImageError] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
  const [modalState, setModalState] = useState<{ title: string; message: string } | null>(null);
  const [areaUnit, setAreaUnit] = useState<'sqft' | 'sqm'>('sqft');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const submitBannerRef = useRef<HTMLDivElement>(null);
  const maxImages = LISTING_MAX_IMAGES;
  const maxImageSizeBytes = LISTING_MAX_IMAGE_SIZE_BYTES;
  const amenitySuggestions = [
    ...LISTING_AMENITY_SUGGESTIONS,
  ];
  const createAmenityId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const wordCount = useMemo(() => {
    const words = values.details.trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [values.details]);

  const toNumber = (value: string) => {
    const next = Number.parseFloat(value);
    return Number.isFinite(next) ? next : null;
  };

  const getConvertedAreas = (value: string) => {
    const numeric = toNumber(value);
    if (numeric === null) {
      return { sqft: '', sqm: '' };
    }
    if (areaUnit === 'sqft') {
      const sqm = numeric / SQM_TO_SQFT;
      return { sqft: numeric.toFixed(2), sqm: sqm.toFixed(2) };
    }
    const sqft = numeric * SQM_TO_SQFT;
    return { sqft: sqft.toFixed(2), sqm: numeric.toFixed(2) };
  };

  const getConvertedPrice = (value: string) => {
    const numeric = toNumber(value);
    if (numeric === null) {
      return { sqft: '', sqm: '' };
    }
    if (areaUnit === 'sqft') {
      const sqm = numeric * SQM_TO_SQFT;
      return { sqft: numeric.toFixed(2), sqm: sqm.toFixed(2) };
    }
    const sqft = numeric / SQM_TO_SQFT;
    return { sqft: sqft.toFixed(2), sqm: numeric.toFixed(2) };
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
    if (!files.length) return;
    const validFiles = files.filter((file) => file.size <= maxImageSizeBytes);
    if (validFiles.length !== files.length) {
      setImageError('Each image must be 1.5 MB or smaller.');
      setModalState({
        title: 'Image too large',
        message: 'One or more images exceed 1.5 MB. Please upload smaller images.',
      });
    } else {
      setImageError('');
    }

    const existingFingerprints = new Set<string>();
    for (const file of values.images) {
      existingFingerprints.add(await getFileFingerprint(file));
    }

    const nextUniqueFiles: File[] = [];
    let skippedDuplicate = false;
    for (const file of validFiles) {
      const fingerprint = await getFileFingerprint(file);
      if (existingFingerprints.has(fingerprint)) {
        skippedDuplicate = true;
        continue;
      }
      existingFingerprints.add(fingerprint);
      nextUniqueFiles.push(file);
    }

    if (skippedDuplicate) {
      setModalState({
        title: 'Duplicate image',
        message: 'Duplicate images were skipped. Please upload unique images only.',
      });
    }

    const nextFiles = [...values.images, ...nextUniqueFiles];
    const cappedFiles = nextFiles.slice(0, maxImages);
    if (nextFiles.length > maxImages) {
      setImageError('You can upload up to 6 images.');
    }
    setValues((prev) => ({ ...prev, images: cappedFiles }));
    if (cappedFiles.length > 0 && mainImageIndex === null) {
      setMainImageIndex(0);
    }
    if (mainImageIndex !== null && mainImageIndex >= cappedFiles.length) {
      setMainImageIndex(0);
    }
    setSaved(false);
    event.target.value = '';
  };

  React.useEffect(() => {
    const nextPreviews = values.images.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return nextPreviews;
    });

    return () => {
      nextPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [values.images]);

  React.useEffect(() => {
    if (submitBanner?.type !== 'error') {
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [submitBanner]);

  const addAmenity = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    if (values.amenities.length >= 10) {
      setAmenityError('Maximum 10 amenities allowed.');
      return;
    }
    if (values.amenities.some((item) => item.label === value)) {
      setAmenityError('Amenity already added.');
      return;
    }
    setValues((prev) => ({ ...prev, amenities: [...prev.amenities, { id: createAmenityId(), label: value }] }));
    setAmenityInput('');
    setAmenityError('');
    setSaved(false);
  };

  const removeAmenity = (id: string) => {
    setValues((prev) => ({ ...prev, amenities: prev.amenities.filter((amenity) => amenity.id !== id) }));
    setSaved(false);
  };

  const handleAmenityKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addAmenity(amenityInput.replace(',', ''));
    }
  };

  const handleDetailsChange = (value: string) => {
    setValues((prev) => ({ ...prev, details: value }));
    setSaved(false);
    const nextWordCount = value.trim().split(/\s+/).filter(Boolean).length;
    if (nextWordCount > 150) {
      setDetailsError('Other details can have a maximum of 150 words.');
    } else {
      setDetailsError('');
    }
  };

  const handleChange = (field: keyof PropertyListingFormValues, value: string) => {
    if (field === 'totalArea' || field === 'offerArea' || field === 'pricePerSqFt') {
      if (!/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }

    if (field === 'roi' || field === 'agreementDuration') {
      if (!/^\d*$/.test(value)) {
        return;
      }
      if (value.length > 2) {
        return;
      }
    }

    setValues((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setValues((prev) => {
      const nextImages = prev.images.filter((_, index) => index !== indexToRemove);
      return { ...prev, images: nextImages };
    });

    setMainImageIndex((prevMainIndex) => {
      if (prevMainIndex === null) {
        return null;
      }
      if (indexToRemove === prevMainIndex) {
        return values.images.length - 1 > 0 ? 0 : null;
      }
      if (indexToRemove < prevMainIndex) {
        return prevMainIndex - 1;
      }
      return prevMainIndex;
    });

    setSaved(false);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setSubmitBanner(null);
    console.log('[PropertyListingForm] Publish clicked', {
      imagesCount: values.images.length,
      mainImageIndex,
      amenitiesCount: values.amenities.length,
      wordCount,
      areaUnit,
    });
    const submitListing = async () => {
      let hasError = false;
      const validationMessages: string[] = [];
      const projectName = values.projectName.trim();
      const location = values.location.trim();
      const totalArea = values.totalArea.trim();
      const offerArea = values.offerArea.trim();
      const pricePerSqFt = values.pricePerSqFt.trim();
      const roi = values.roi.trim();
      const agreementDuration = values.agreementDuration.trim();
      const details = values.details.trim();

      const numericValue = /^\d+(\.\d+)?$/;
      const twoDigitNumber = /^\d{1,2}$/;
      const twoDigitInteger = /^\d{1,2}$/;

      if (!projectName) {
        validationMessages.push('Project Name is required.');
        hasError = true;
      }
      if (!location) {
        validationMessages.push('Location is required.');
        hasError = true;
      }
      if (!totalArea) {
        validationMessages.push('Total Area is required.');
        hasError = true;
      } else if (!numericValue.test(totalArea)) {
        validationMessages.push('Total Area must be numeric.');
        hasError = true;
      }
      if (!offerArea) {
        validationMessages.push('Area on Offer is required.');
        hasError = true;
      } else if (!numericValue.test(offerArea)) {
        validationMessages.push('Area on Offer must be numeric.');
        hasError = true;
      }
      if (!pricePerSqFt) {
        validationMessages.push('Price is required.');
        hasError = true;
      } else if (!numericValue.test(pricePerSqFt)) {
        validationMessages.push('Price must be numeric.');
        hasError = true;
      }
      if (!roi) {
        validationMessages.push('ROI is required.');
        hasError = true;
      } else if (!twoDigitNumber.test(roi)) {
        validationMessages.push('ROI must be numeric and a maximum of 2 digits.');
        hasError = true;
      }
      if (!agreementDuration) {
        validationMessages.push('Agreement Duration is required.');
        hasError = true;
      } else if (!twoDigitInteger.test(agreementDuration)) {
        validationMessages.push('Agreement Duration must be a maximum of 2 digits.');
        hasError = true;
      }
      if (!details) {
        validationMessages.push('Other Details are required.');
        hasError = true;
      }

      if (values.images.length < 1) {
        setImageError('Add at least 1 image.');
        validationMessages.push('Please add at least 1 image to publish.');
        console.log('[PropertyListingForm] Validation failed: at least 1 image is required', {
          imagesCount: values.images.length,
        });
        hasError = true;
      }
      if (values.images.length > maxImages) {
        setImageError('You can upload up to 6 images.');
        validationMessages.push('You can upload up to 6 images.');
        console.log('[PropertyListingForm] Validation failed: maximum image count exceeded', {
          imagesCount: values.images.length,
        });
        hasError = true;
      }
      if (mainImageIndex === null || !values.images[mainImageIndex]) {
        setImageError('Select a main image.');
        validationMessages.push('Please select a main image.');
        console.log('[PropertyListingForm] Validation failed: main image not selected');
        hasError = true;
      }
      if (values.amenities.length === 0) {
        setAmenityError('Add at least one amenity.');
        validationMessages.push('Add at least one amenity.');
        console.log('[PropertyListingForm] Validation failed: no amenities');
        hasError = true;
      }
      if (wordCount > 150) {
        setDetailsError('Other details can have a maximum of 150 words.');
        validationMessages.push('Other details can have a maximum of 150 words.');
        console.log('[PropertyListingForm] Validation failed: details word count exceeded', { wordCount });
        hasError = true;
      }

      const totalAreaNumeric = toNumber(totalArea);
      const offerAreaNumeric = toNumber(offerArea);
      if (totalAreaNumeric !== null && offerAreaNumeric !== null && offerAreaNumeric > totalAreaNumeric) {
        validationMessages.push('Area on Offer cannot exceed Total Area.');
        console.log('[PropertyListingForm] Validation failed: offer area greater than total area', {
          totalAreaNumeric,
          offerAreaNumeric,
        });
        hasError = true;
      }

      if (hasError) {
        setSaved(false);
        setSubmitBanner({
          type: 'error',
          text: validationMessages[0] ?? 'Please fix validation errors before publishing.',
        });
        console.log('[PropertyListingForm] Submission aborted due to validation errors');
        return;
      }

      const areaNumeric = toNumber(values.totalArea);
      const offerNumeric = toNumber(values.offerArea);
      const priceNumeric = toNumber(values.pricePerSqFt);

      if (areaNumeric === null || offerNumeric === null || priceNumeric === null) {
        setSubmitMessage('Area and price must be valid numeric values.');
        setSubmitBanner({ type: 'error', text: 'Area and price must be valid numeric values.' });
        setSaved(false);
        console.log('[PropertyListingForm] Validation failed: non-numeric area/price', {
          totalArea: values.totalArea,
          offerArea: values.offerArea,
          pricePerSqFt: values.pricePerSqFt,
        });
        return;
      }

      const areaSqFt = areaUnit === 'sqft' ? areaNumeric : areaNumeric * SQM_TO_SQFT;
      const areaSqM = areaUnit === 'sqft' ? areaNumeric / SQM_TO_SQFT : areaNumeric;
      const offerSqFt = areaUnit === 'sqft' ? offerNumeric : offerNumeric * SQM_TO_SQFT;
      const offerSqM = areaUnit === 'sqft' ? offerNumeric / SQM_TO_SQFT : offerNumeric;
      const priceSqFt = areaUnit === 'sqft' ? priceNumeric : priceNumeric / SQM_TO_SQFT;
      const priceSqM = areaUnit === 'sqft' ? priceNumeric * SQM_TO_SQFT : priceNumeric;

      try {
        setIsSubmitting(true);
        setSubmitMessage('');
        setSubmitBanner(null);
        console.log('[PropertyListingForm] Uploading images...');
        const selectedMainIndex = mainImageIndex;
        const uploadResponse = await uploadListingImages(values.images);
        console.log('[PropertyListingForm] Upload response', uploadResponse);
        const imageIds = (uploadResponse.imageIds ?? []).slice(0, maxImages);
        const mainImageId = selectedMainIndex !== null ? imageIds[selectedMainIndex] : '';

        if (imageIds.length < 1 || imageIds.length > maxImages || !mainImageId) {
          setSubmitMessage('Image upload failed: backend returned invalid image IDs.');
          setSubmitBanner({ type: 'error', text: 'Image upload failed: backend returned invalid image IDs.' });
          setSaved(false);
          console.log('[PropertyListingForm] Upload validation failed', {
            imageIdsCount: imageIds.length,
            mainImageId,
            selectedMainIndex,
          });
          return;
        }

        console.log('[PropertyListingForm] Creating listing...', {
          projectName: values.projectName,
          imageIdsCount: imageIds.length,
          mainImageId,
        });
        await createListing({
          projectName,
          location,
          latitude: values.latitude,
          longitude: values.longitude,
          totalAreaSqFt: areaSqFt.toFixed(2),
          totalAreaSqM: areaSqM.toFixed(2),
          offerAreaSqFt: offerSqFt.toFixed(2),
          offerAreaSqM: offerSqM.toFixed(2),
          areaUnitSelected: areaUnit,
          pricePerSqFt: priceSqFt.toFixed(2),
          pricePerSqM: priceSqM.toFixed(2),
          priceUnitSelected: areaUnit,
          amenities: values.amenities.map((item) => item.label),
          roiPercent: roi,
          agreementDuration: `${agreementDuration} years`,
          details,
          imageIds,
          mainImageId,
        });
        console.log('[PropertyListingForm] Listing created successfully. Redirecting to /seller/listings');
        setSaved(true);
        setSubmitMessage('Property listing published successfully.');
        setSubmitBanner({ type: 'success', text: 'Property listing published successfully.' });
        navigate('/seller/listings');
      } catch (error) {
        console.error('[PropertyListingForm] Publish failed', error);
        if (axios.isAxiosError(error)) {
          const errorText =
            typeof error.response?.data?.message === 'string'
              ? error.response.data.message
              : 'Failed to publish listing.';
          setSubmitMessage(
            errorText
          );
          setSubmitBanner({ type: 'error', text: errorText });
        } else {
          setSubmitMessage('Failed to publish listing.');
          setSubmitBanner({ type: 'error', text: 'Failed to publish listing.' });
        }
        setSaved(false);
      } finally {
        setIsSubmitting(false);
      }
    };

    void submitListing();
  };

  const handleReset = () => {
    setValues(defaultValues);
    setAmenityInput('');
    setAmenityError('');
    setDetailsError('');
    setImageError('');
    setMainImageIndex(null);
    setModalState(null);
    setSaved(false);
    setIsSubmitting(false);
    setSubmitMessage('');
    setSubmitBanner(null);
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
  };

  return (
    <form className="property-listing-form" onSubmit={handleSubmit}>
      {modalState ? (
        <div className="property-listing-modal" role="dialog" aria-modal="true">
          <div className="property-listing-modal__card">
            <div className="property-listing-modal__header">
              <h3>{modalState.title}</h3>
              <button
                type="button"
                className="property-listing-modal__close"
                onClick={() => setModalState(null)}
                aria-label="Close image size message"
              >
                ×
              </button>
            </div>
            <p>{modalState.message}</p>
            <div className="property-listing-modal__actions">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setModalState(null)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {submitBanner ? (
        <div
          ref={submitBannerRef}
          className={`property-listing-banner ${submitBanner.type === 'error' ? 'is-error' : 'is-success'}`}
          role="alert"
        >
          {submitBanner.text}
        </div>
      ) : null}

      <div className="property-listing-section-card">
        <label className="property-listing-images">
          <span>Images <span className="property-listing-required">*</span></span>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="property-listing-image-input"
          />
          <div className="property-listing-image-grid">
            {Array.from({ length: maxImages }).map((_, index) => {
              const preview = imagePreviews[index];
              if (preview) {
                return (
                  <div
                    key={`preview-${index}`}
                    className={`property-listing-image-slot is-filled ${mainImageIndex === index ? 'is-main' : ''}`}
                  >
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="property-listing-image-remove"
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <FiX aria-hidden="true" />
                    </button>
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
                  aria-label="Add property image"
                >
                  <FiImage aria-hidden="true" />
                  <span>Add Image</span>
                  <FiPlus aria-hidden="true" className="property-listing-image-plus" />
                </button>
              );
            })}
          </div>
          <p className="property-listing-helper">Upload 1 to 6 images. Max 1.5 MB each.</p>
          {imageError ? <small className="property-listing-error">{imageError}</small> : null}
        </label>
      </div>

      <div className="property-listing-grid">
        <label>
          <span>Project Name <span className="property-listing-required">*</span></span>
          <input
            type="text"
            value={values.projectName}
            onChange={(event) => handleChange('projectName', event.target.value)}
            placeholder="Enter project name"
            required
          />
        </label>
        <label>
          <span>Location <span className="property-listing-required">*</span></span>
          <input
            type="text"
            value={values.location}
            onChange={(event) => handleChange('location', event.target.value)}
            placeholder="Full Address"
            required
          />
        </label>
        <label>
          <span>Total Area <span className="property-listing-required">*</span></span>
          <div className="property-listing-input-group">
          <input
            type="text"
            value={values.totalArea}
            onChange={(event) => handleChange('totalArea', event.target.value)}
            placeholder="Total area"
            inputMode="decimal"
            required
          />
            <select
              className="property-listing-input-select"
              value={areaUnit}
              onChange={(event) => setAreaUnit(event.target.value as 'sqft' | 'sqm')}
              aria-label="Select area unit"
            >
              <option value="sqft">sq ft</option>
              <option value="sqm">sq m</option>
            </select>
          </div>
          {values.totalArea ? (
            <small className="property-listing-helper">
              {areaUnit === 'sqft'
                ? `≈ ${getConvertedAreas(values.totalArea).sqm} sq m`
                : `≈ ${getConvertedAreas(values.totalArea).sqft} sq ft`}
            </small>
          ) : null}
        </label>
        <label>
          <span>Area on Offer <span className="property-listing-required">*</span></span>
          <div className="property-listing-input-group">
            <input
              type="text"
              value={values.offerArea}
              onChange={(event) => handleChange('offerArea', event.target.value)}
              placeholder="Available area"
              inputMode="decimal"
              required
            />
            <select
              className="property-listing-input-select"
              value={areaUnit}
              onChange={(event) => setAreaUnit(event.target.value as 'sqft' | 'sqm')}
              aria-label="Select area unit"
            >
              <option value="sqft">sq ft</option>
              <option value="sqm">sq m</option>
            </select>
          </div>
          {values.offerArea ? (
            <small className="property-listing-helper">
              {areaUnit === 'sqft'
                ? `≈ ${getConvertedAreas(values.offerArea).sqm} sq m`
                : `≈ ${getConvertedAreas(values.offerArea).sqft} sq ft`}
            </small>
          ) : null}
        </label>
        <label>
          <span>Price per {areaUnit === 'sqft' ? 'sq ft' : 'sq m'} <span className="property-listing-required">*</span></span>
          <div className="property-listing-input-group">
            <span className="property-listing-input-addon is-prefix">₹</span>
            <input
              type="text"
              value={values.pricePerSqFt}
              onChange={(event) => handleChange('pricePerSqFt', event.target.value)}
              placeholder={`Price per ${areaUnit === 'sqft' ? 'sq ft' : 'sq m'}`}
              inputMode="decimal"
              required
            />
          </div>
          {values.pricePerSqFt ? (
            <small className="property-listing-helper">
              {areaUnit === 'sqft'
                ? `≈ ₹${getConvertedPrice(values.pricePerSqFt).sqm} per sq m`
                : `≈ ₹${getConvertedPrice(values.pricePerSqFt).sqft} per sq ft`}
            </small>
          ) : null}
        </label>
        <label>
          <span>ROI (for investments) <span className="property-listing-required">*</span></span>
          <div className="property-listing-input-group">
          <input
            type="text"
            value={values.roi}
            onChange={(event) => handleChange('roi', event.target.value)}
            placeholder="Expected ROI"
            inputMode="decimal"
            maxLength={2}
            required
          />
            <span className="property-listing-input-addon is-suffix">%</span>
          </div>
        </label>
        <label>
          <span>Agreement Duration <span className="property-listing-required">*</span></span>
          <input
            type="text"
            value={values.agreementDuration}
            onChange={(event) => handleChange('agreementDuration', event.target.value)}
            placeholder="e.g. 5"
            inputMode="numeric"
            maxLength={2}
            required
          />
        </label>
      </div>

      <div className="property-listing-coordinates">
        <label>
          <span>Latitude (optional)</span>
          <input
            type="text"
            value={values.latitude}
            onChange={(event) => handleChange('latitude', event.target.value)}
            placeholder="e.g. 12.9716"
          />
        </label>
        <label>
          <span>Longitude (optional)</span>
          <input
            type="text"
            value={values.longitude}
            onChange={(event) => handleChange('longitude', event.target.value)}
            placeholder="e.g. 77.5946"
          />
        </label>
      </div>

      <div className="property-listing-section-card">
        <div className="property-listing-amenities">
          <span>Additional Amenities <span className="property-listing-required">*</span></span>
          <div className="property-listing-chips">
            {values.amenities.map((amenity) => (
              <div key={amenity.id} className="property-listing-chip">
                <span className="property-listing-chip__label">{amenity.label}</span>
                <button
                  type="button"
                  className="property-listing-chip__remove"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    removeAmenity(amenity.id);
                  }}
                  aria-label={`Remove ${amenity.label}`}
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
              placeholder={values.amenities.length < 10 ? 'Add amenity and press Enter' : 'Max 10 amenities'}
              disabled={values.amenities.length >= 10}
            />
          </div>
          <div className="property-listing-suggestions">
            {amenitySuggestions.map((amenity) => (
              <button
                key={amenity}
                type="button"
                className="property-listing-suggestion"
                onClick={() => addAmenity(amenity)}
                disabled={values.amenities.length >= 10 || values.amenities.some((item) => item.label === amenity)}
              >
                {amenity}
              </button>
            ))}
          </div>
          {amenityError ? <small className="property-listing-error">{amenityError}</small> : null}
        </div>
      </div>

      <label className="property-listing-textarea">
        <span>Other Details <span className="property-listing-required">*</span></span>
        <textarea
          value={values.details}
          onChange={(event) => handleDetailsChange(event.target.value)}
          placeholder="Describe additional highlights or notes."
          rows={4}
          required
        />
        <div className="property-listing-wordcount">
          <span>{wordCount}/150 words</span>
          {detailsError ? <small className="property-listing-error">{detailsError}</small> : null}
        </div>
      </label>

      <div className="property-listing-actions">
        <button type="submit" className="btn btn-primary btn-md">
          {isSubmitting ? 'Publishing...' : 'Publish Listing'}
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={handleReset}>
          Reset
        </button>
        {saved ? <p>Property listing saved.</p> : null}
        {submitMessage ? <p>{submitMessage}</p> : null}
      </div>
    </form>
  );
};
