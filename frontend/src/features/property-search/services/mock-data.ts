import type { Property } from '../api/propertySearchApi';

/**
 * Mock data for landing page — migrated to the new high-fidelity Property model.
 */
export const MOCK_FEATURED_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'The Modern Loft',
    description: 'Minimalist urban living with optimized space design.',
    city: 'Ho Chi Minh City',
    address: 'District 1, HCMC',
    thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&fit=crop',
    roomsCount: 24,
    price: 3500000,
    rating: 4.8,
    status: 'available',
    featured: true,
  },
  {
    id: '2',
    title: 'City Hub Residences',
    description: 'Prime location for students and young professionals.',
    city: 'Hanoi',
    address: 'Cau Giay, Hanoi',
    thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&fit=crop',
    roomsCount: 36,
    price: 2500000,
    rating: 4.6,
    status: 'available',
    featured: true,
  },
  {
    id: '3',
    title: 'Green Garden Dorm',
    description: 'Eco-friendly dormitory with shared garden spaces.',
    city: 'Da Nang',
    address: 'Son Tra, Da Nang',
    thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&fit=crop',
    roomsCount: 18,
    price: 2000000,
    rating: 4.9,
    status: 'available',
    featured: true,
  },
];

export const STATS = [
  { label: 'Rooms', value: '500+' },
  { label: 'Properties', value: '200+' },
  { label: 'Happy Tenants', value: '1,000+' },
  { label: 'Rating', value: '4.8★' },
];

export const HOW_IT_WORKS_STEPS = [
  {
    title: 'Search',
    description: 'Browse through hundreds of verified dorms and properties filtered by your preference.',
    icon: 'search',
  },
  {
    title: 'Book',
    description: 'Select your stay dates, sign your digital contract securely, and pay your deposit online.',
    icon: 'calendar',
  },
  {
    title: 'Move In',
    description: 'Welcome home! Manage your monthly rent and maintenance requests directly from the app.',
    icon: 'home',
  },
];
