import { usePropertySearch } from '../hooks/usePropertySearch';
import { PropertyGrid } from './PropertyGrid';
import { PropertyCard } from './PropertyCard';
import { PropertyListingSkeleton } from './PropertyListingSkeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Search } from 'lucide-react';
import { DiscoveryBar } from './DiscoveryBar';

/**
 * Main Feature Orchestrator for Property Search.
 * Handles Default (Top-tier) vs Search (Filtered) states.
 * Compact Layout: Optimized for discoverability without large hero sections.
 */
export function PropertySearchFeature() {
  const {
    query,
    setQuery,
    filters,
    handleCityChange,
    handlePriceChange,
    properties,
    isLoading,
    isEmpty,
    isDefault,
    resetFilters
  } = usePropertySearch();

  return (
    <div className="space-y-16">
      {/* Compact Discovery Header */}
      <section className="bg-white border-b border-slate-50 pt-12 pb-16 sticky top-0 md:static z-20">
        <div className="max-w-7xl mx-auto px-6">
          <DiscoveryBar 
            query={query}
            setQuery={setQuery}
            filters={filters}
            onCityChange={handleCityChange}
            onPriceSelect={handlePriceChange}
          />
        </div>
      </section>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">

        {/* Dynamic Title */}
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isDefault ? 'Top Tier Properties' : 'Search Results'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isDefault 
                ? 'Wait-listed and featured rooms for the best living experience.' 
                : `Showing ${properties.length} results for your search`}
            </p>
          </div>
          {isDefault && (
             <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 mb-2">Featured Selection</span>
          )}
        </div>

        {/* Content States */}
        {isLoading ? (
          <PropertyListingSkeleton />
        ) : isEmpty ? (
          <EmptyState 
            icon={<Search className="w-8 h-8 text-slate-400" />}
            title="No properties found"
            description="We couldn't find any rooms matching your current filters. Try adjusting your search or resetting all filters."
            action={
              <button 
                onClick={resetFilters}
                className="px-6 py-2 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
              >
                Clear all filters
              </button>
            }
          />
        ) : (
          <PropertyGrid>
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </PropertyGrid>
        )}
      </div>
    </div>
  );
}
