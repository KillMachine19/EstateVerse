export type DealerIdProof = 'AADHAR' | 'PAN' | 'DL';

export interface DealerFormValues {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
  verificationStatus: boolean;
  idProof: DealerIdProof;
  image: string;
  localities: string;
  dealClosedCount: number;
  aboutTheDealer: string;
}

export const DEALER_ID_PROOF_OPTIONS: Array<{ value: DealerIdProof; label: string }> = [
  { value: 'AADHAR', label: 'Aadhar' },
  { value: 'PAN', label: 'PAN' },
  { value: 'DL', label: 'Driving License' },
];

export const INITIAL_DEALER_FORM: DealerFormValues = {
  email: '',
  password: '',
  name: '',
  phoneNumber: '',
  address: '',
  verificationStatus: false,
  idProof: 'AADHAR',
  image: '',
  localities: '',
  dealClosedCount: 0,
  aboutTheDealer: '',
};
