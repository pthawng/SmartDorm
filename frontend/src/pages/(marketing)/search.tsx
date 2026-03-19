import { PropertySearchFeature } from '@/features/property-search/components/PropertySearchFeature';
import { Helmet } from 'react-helmet-async';

/**
 * Search Page — Property Discovery Entry Point.
 * Orchestrates the search feature within the marketing layout.
 */
export default function SearchPage() {
  return (
    <>
      <Helmet>
        <title>Search Rooms | SmartDorm</title>
        <meta name="description" content="Find and book the perfect student or professional room in HCMC, Hanoi, and Da Nang." />
      </Helmet>

      <div className="min-h-screen bg-white">
         <PropertySearchFeature />
      </div>
    </>
  );
}
