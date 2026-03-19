import { ContractSignFlowFeature } from '@/features/contract-sign-flow';

/**
 * THIN PAGE — Contract Application Flow
 * Multi-step process for creating a new lease agreement.
 */
export default function ContractApplyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ContractSignFlowFeature />
    </div>
  );
}
