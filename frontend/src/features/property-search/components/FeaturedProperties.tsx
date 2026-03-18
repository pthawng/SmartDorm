import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { MOCK_FEATURED_PROPERTIES } from '../services/mock-data';
import { PropertyCard } from './PropertyCard';

/**
 * Featured Properties grid — 3 cards in a row.
 */
export function FeaturedProperties() {
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    // TODO: navigate to /properties/:id
    console.log('Navigate to property:', id);
    navigate(ROUTES.PROPERTY_DETAIL(id));

  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
          Featured Properties
        </h2>
        <p className="mt-3 text-base text-slate-500">
          Explore our top-rated properties across the country.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_FEATURED_PROPERTIES.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={handleViewDetails}
          />
        ))}
      </div>
    </section>
  );
}
