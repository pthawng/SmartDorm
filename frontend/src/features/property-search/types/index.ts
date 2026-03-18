/**
 * Property Search feature — types.
 */

export interface PropertySearchFilters {
  location: string;
  minPrice: number;
  maxPrice: number;
}

export interface FeaturedProperty {
  id: string;
  name: string;
  city: string;
  imageUrl: string;
  roomCount: number;
  priceRange: string;
  rating: number;
}
