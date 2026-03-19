import { MOCK_FEATURED_PROPERTIES } from '../services/mock-data';
import { PropertyCard } from './PropertyCard';

export function FeaturedProperties() {
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
          />
        ))}
      </div>
    </section>
  );
}
