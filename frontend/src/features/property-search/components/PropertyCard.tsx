import { Card, CardContent, Badge, Button } from '@/shared/ui';
import type { FeaturedProperty } from '../types';

interface PropertyCardProps {
  property: FeaturedProperty;
  onClick?: (id: string) => void;
}

/**
 * Property Card — displays a single featured property.
 * Pure presentational, props-driven.
 */
export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <Card interactive className="overflow-hidden">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <Badge variant="success" className="absolute right-3 top-3 shadow-sm">
          {property.rating}★
        </Badge>
      </div>

      <CardContent className="p-5">
        <h3 className="text-base font-semibold text-slate-900 font-display">{property.name}</h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
          </svg>
          {property.city}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{property.roomCount} rooms</p>
            <p className="text-sm font-semibold text-primary-700">{property.priceRange}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onClick?.(property.id)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
