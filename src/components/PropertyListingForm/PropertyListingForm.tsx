import React, { useMemo, useRef, useState } from 'react';
import { FiImage, FiPlus, FiStar } from 'react-icons/fi';
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
  const [values, setValues] = useState<PropertyListingFormValues>(defaultValues);
  const [saved, setSaved] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState('');
  const [amenityError, setAmenityError] = useState('');
  const [detailsError, setDetailsError] = useState('');
  const [imageError, setImageError] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
  const [modalState, setModalState] = useState<{ title: string; message: string } | null>(null);
  const [areaUnit, setAreaUnit] = useState<'sqft' | 'sqm'>('sqft');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const maxImages = 6;
  const maxImageSizeBytes = 1.5 * 1024 * 1024;
  const SQM_TO_SQFT = 10.7639;
  const amenitySuggestions = [
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
    setValues((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    let hasError = false;
    if (values.images.length === 0) {
      setImageError('Add at least one image.');
      hasError = true;
    }
    if (values.amenities.length === 0) {
      setAmenityError('Add at least one amenity.');
      hasError = true;
    }
    if (wordCount > 150) {
      setDetailsError('Other details can have a maximum of 150 words.');
      hasError = true;
    }
    if (hasError) {
      setSaved(false);
      return;
    }
    setSaved(true);
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

      <div className="property-listing-section-card">
        <label className="property-listing-images">
          <span>Images <span className="property-listing-required">*</span></span>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
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
          <p className="property-listing-helper">Upload up to 6 images. Max 1.5 MB each. Minimum 1 image required.</p>
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
            placeholder="e.g. 5 years"
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
          Publish Listing
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={handleReset}>
          Reset
        </button>
        {saved ? <p>Property listing saved.</p> : null}
      </div>
    </form>
  );
};
