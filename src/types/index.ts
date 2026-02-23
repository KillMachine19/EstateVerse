// Common types for Commercial Real Estate website

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: number; // in sq ft
  type: 'office' | 'retail' | 'warehouse' | 'industrial';
  image: string;
  amenities: string[];
}

export interface LeadForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

export interface ServiceType {
  id: string;
  title: string;
  description: string;
  icon: string;
}
