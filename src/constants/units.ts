export const SQM_TO_SQFT = 10.7639;
export const SQFT_TO_SQM = 1 / SQM_TO_SQFT;
export const SQFT_TO_ACRE = 1 / 43_560;

export const AREA_UNIT_LABELS = {
  sqft: 'sq ft',
  sqm: 'sq m',
  acre: 'acre',
} as const;
