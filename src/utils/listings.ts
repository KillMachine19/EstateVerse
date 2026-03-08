import type { ListingRecord } from '../services/controllers';
import type { Property } from '../types';

const DEFAULT_IMAGE = 'https://via.placeholder.com/1200x900?text=No+Image';

export const parseListingNumber = (value: string | undefined, fallback = 0): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const resolveListingId = (listing: Pick<ListingRecord, 'id' | 'propid'>): string =>
  listing.propid ?? listing.id ?? '';

export const normalizeListingImageId = (value: string | undefined): string => {
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

export const reorderListingGalleryByMainImage = (
  images: string[] | undefined,
  mainImageId: string | undefined
): string[] => {
  const nextImages = images ?? [];
  if (!nextImages.length) {
    return nextImages;
  }
  const normalizedMain = normalizeListingImageId(mainImageId);
  if (!normalizedMain) {
    return nextImages;
  }
  const mainIndex = nextImages.findIndex((image) => normalizeListingImageId(image) === normalizedMain);
  if (mainIndex <= 0) {
    return nextImages;
  }
  const reordered = [...nextImages];
  const [mainImage] = reordered.splice(mainIndex, 1);
  reordered.unshift(mainImage);
  return reordered;
};

export const toPropertyCardFromListing = (
  listing: ListingRecord,
  options?: { shortlistedBuyersCount?: number; fallbackImage?: string }
): Property => {
  const imageGallery = reorderListingGalleryByMainImage(listing.imageIds ?? [], listing.mainImageId);
  const area = parseListingNumber(listing.offerAreaSqFt ?? listing.totalAreaSqFt, 0);
  const unitPrice = parseListingNumber(listing.pricePerSqFt, 0);

  return {
    id: resolveListingId(listing),
    title: listing.projectName ?? 'Untitled Property',
    description: listing.details ?? 'No description available.',
    price: unitPrice * (area > 0 ? area : 1),
    location: listing.location ?? 'N/A',
    area,
    type: 'office',
    image: imageGallery[0] || options?.fallbackImage || DEFAULT_IMAGE,
    imageGallery,
    amenities: listing.amenities ?? [],
    shortlistedBuyersCount: options?.shortlistedBuyersCount,
  };
};
