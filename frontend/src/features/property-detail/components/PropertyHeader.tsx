import { Link } from 'react-router-dom';
import { Badge } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import type { PropertyDetail } from '../types';

interface PropertyHeaderProps {
  property: PropertyDetail;
}

/**
 * PropertyHeader — hero image, name, address, rating, and amenity tags.
 */
export function PropertyHeader({ property }: PropertyHeaderProps) {
  return (
    <div>
      {/* Breadcrumb — uses Link for SPA navigation */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <Link to={ROUTES.HOME} className="transition-colors hover:text-primary-600">Home</Link>
        <span className="text-slate-300">/</span>
        <Link to={ROUTES.SEARCH} className="transition-colors hover:text-primary-600">Properties</Link>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-900">{property.name}</span>
      </nav>

      {/* Hero image */}
      <div className="relative h-72 w-full overflow-hidden rounded-2xl sm:h-96">
        <img
          src={property.imageUrl}
          alt={property.name}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Property info */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display sm:text-3xl">
            {property.name}
          </h1>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
            </svg>
            {property.address}, {property.city}
          </div>
        </div>
        <Badge variant="success" className="self-start px-3 py-1 text-sm">
          {property.rating}★ Rating
        </Badge>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="info">{property.totalRooms} Rooms</Badge>
        {property.amenities.slice(0, 4).map((a) => (
          <Badge key={a} variant="neutral">{a}</Badge>
        ))}
      </div>
    </div>
  );
}
