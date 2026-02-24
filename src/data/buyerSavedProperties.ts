import type { Property } from '../types';

export interface SavedProperty extends Property {
  latitude: number;
  longitude: number;
  city: string;
}

export const BUYER_SAVED_PROPERTIES: SavedProperty[] = [
  {
    id: 'saved-blr-orr',
    title: 'Outer Ring Road Business Hub',
    description: 'Grade A managed office floors with flexible seating plans for scaling technology teams.',
    price: 38500000,
    location: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    area: 18400,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    amenities: ['24/7 Access', 'Smart Security', 'Dedicated Parking', 'Conference Floors'],
  },
  {
    id: 'saved-hyd-bay',
    title: 'Aurum Business Bay',
    description: 'Contemporary office block with executive reception and high-speed business connectivity.',
    price: 31200000,
    location: 'Hyderabad, Telangana',
    city: 'Hyderabad',
    latitude: 17.385,
    longitude: 78.4867,
    area: 16200,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Visitor Parking', 'Business Lounge', 'Cafeteria', 'Backup Power'],
  },
  {
    id: 'saved-mum-bkc',
    title: 'Iconic Tower, BKC',
    description: 'Premium commercial address with panoramic city views and enterprise-grade facilities.',
    price: 62100000,
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    latitude: 19.076,
    longitude: 72.8777,
    area: 24100,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Metro Access', 'Conference Suites', 'Valet Parking', 'Smart Access Control'],
  },
  {
    id: 'saved-del-gur',
    title: 'Cyber Park Offices',
    description: 'Large floor plate office property ideal for multi-team and headquarters occupancy.',
    price: 44500000,
    location: 'Gurugram, Haryana',
    city: 'Gurugram',
    latitude: 28.4595,
    longitude: 77.0266,
    area: 20300,
    type: 'office',
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Transit Connectivity', 'Food Court', 'Security Control Room', 'Meeting Pods'],
  },
];
