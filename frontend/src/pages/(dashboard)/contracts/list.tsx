import { ContractListFeature } from '@/features/contract-list';

/**
 * THIN PAGE — Contract List
 * Displays the list of rental agreements with filtering and search.
 */
export default function ContractListPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ContractListFeature />
    </div>
  );
}
