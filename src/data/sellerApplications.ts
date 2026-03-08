export type SellerApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'rescheduled';

export interface SellerApplicationRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  submittedAt: string;
  status: SellerApplicationStatus;
}

export const SELLER_APPLICATIONS: SellerApplicationRecord[] = [
  {
    id: 'app-101',
    propertyId: 'prop-001',
    propertyTitle: 'Aurum Towers - Office 8A',
    buyerName: 'Riya Sharma',
    buyerEmail: 'riya.sharma@example.com',
    buyerPhone: '+91 9876543210',
    preferredDate: '2026-03-10',
    preferredTime: '11:30',
    notes: 'Need to review parking allocation and fit-out options.',
    submittedAt: '2026-03-06T12:30:00.000Z',
    status: 'pending',
  },
  {
    id: 'app-102',
    propertyId: 'prop-014',
    propertyTitle: 'TechPark One - Floor 3',
    buyerName: 'Arjun Mehta',
    buyerEmail: 'arjun.mehta@example.com',
    buyerPhone: '+91 9988776655',
    preferredDate: '2026-03-11',
    preferredTime: '15:00',
    notes: 'Looking for immediate possession and lease terms.',
    submittedAt: '2026-03-06T09:10:00.000Z',
    status: 'pending',
  },
  {
    id: 'app-103',
    propertyId: 'prop-020',
    propertyTitle: 'Crescent Plaza - Suite 204',
    buyerName: 'Neha Patel',
    buyerEmail: 'neha.patel@example.com',
    buyerPhone: '+91 9123456780',
    preferredDate: '2026-03-12',
    preferredTime: '10:15',
    notes: 'Interested in 3-year agreement with renewal option.',
    submittedAt: '2026-03-05T16:50:00.000Z',
    status: 'pending',
  },
];
