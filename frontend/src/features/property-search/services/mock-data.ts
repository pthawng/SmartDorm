import type { FeaturedProperty } from '../types';

/**
 * Mock data for landing page — will be replaced by API calls.
 */
export const MOCK_FEATURED_PROPERTIES: FeaturedProperty[] = [
  {
    id: '1',
    name: 'The Modern Loft',
    city: 'Ho Chi Minh City',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    roomCount: 24,
    priceRange: '3.5M - 8M ₫/month',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'City Hub Residences',
    city: 'Hanoi',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    roomCount: 36,
    priceRange: '2.5M - 6M ₫/month',
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Green Garden Dorm',
    city: 'Da Nang',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    roomCount: 18,
    priceRange: '2M - 4.5M ₫/month',
    rating: 4.9,
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
