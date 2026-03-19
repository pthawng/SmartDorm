export interface Property {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  city: string;
  address: string;
  rating: number;
  roomsCount: number;
  featured?: boolean;
  status: 'available' | 'full' | 'maintenance';
}

export interface SearchFilters {
  city?: string;
  priceRange?: [number, number];
  status?: string;
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Emerald Heights Residence',
    description: 'Modern living in the heart of the city with panoramic views.',
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    price: 3500000,
    city: 'Ho Chi Minh City',
    address: '123 District 1, HCMC',
    rating: 4.8,
    roomsCount: 24,
    featured: true,
    status: 'available'
  },
  {
    id: 'prop-2',
    title: 'The Modern Loft',
    description: 'Spacious loft with minimalist design and high ceilings.',
    thumbnail: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800',
    price: 4200000,
    city: 'Ho Chi Minh City',
    address: '456 District 3, HCMC',
    rating: 4.9,
    roomsCount: 12,
    featured: true,
    status: 'available'
  },
  {
    id: 'prop-3',
    title: 'Serene Garden Studios',
    description: 'Quiet apartments surrounded by lush greenery and peace.',
    thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    price: 2800000,
    city: 'Ha Noi',
    address: '789 Hoan Kiem, Ha Noi',
    rating: 4.7,
    roomsCount: 40,
    featured: false,
    status: 'available'
  },
  {
    id: 'prop-4',
    title: 'Urban Core Apartments',
    description: 'Perfect for professionals wanting to be in the center of action.',
    thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    price: 3800000,
    city: 'Da Nang',
    address: '101 Hai Chau, Da Nang',
    rating: 4.6,
    roomsCount: 32,
    featured: false,
    status: 'full'
  },
  {
    id: 'prop-5',
    title: 'Bayside Premium Suites',
    description: 'Luxury suites with breathtaking ocean views and pool.',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    price: 5500000,
    city: 'Da Nang',
    address: '202 Son Tra, Da Nang',
    rating: 5.0,
    roomsCount: 18,
    featured: true,
    status: 'available'
  }
];

export const propertySearchApi = {
  getProperties: async (params: { query?: string; featured?: boolean; city?: string; priceMin?: number; priceMax?: number }): Promise<Property[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let filtered = [...MOCK_PROPERTIES];

    if (params.featured) {
      filtered = filtered.filter(p => p.featured);
    }

    if (params.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    if (params.city) {
      filtered = filtered.filter(p => p.city === params.city);
    }

    if (params.priceMin !== undefined) {
      filtered = filtered.filter(p => p.price >= params.priceMin!);
    }

    if (params.priceMax !== undefined) {
      filtered = filtered.filter(p => p.price <= params.priceMax!);
    }

    return filtered;
  }
};
