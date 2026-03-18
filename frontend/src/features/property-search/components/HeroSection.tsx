import { SearchBar } from './SearchBar';

/**
 * Hero Section — full-width gradient with headline and search bar.
 * Pure presentational. Based on Stitch Landing Page design.
 */
export function HeroSection() {
  const handleSearch = (location: string, priceRange: string) => {
    // TODO: Navigate to /search with query params
    console.log('Search:', { location, priceRange });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-violet-500 px-6 py-24 text-center text-white sm:py-32 lg:py-40">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-400/10 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Find Your Perfect Room
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
          SmartDorm connects tenants with verified properties. Browse rooms, sign contracts,
          and manage everything in one place.
        </p>
        <SearchBar onSearch={handleSearch} />
      </div>
    </section>
  );
}
