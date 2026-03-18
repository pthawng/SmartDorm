import { Input, Select } from '@/shared/ui';
import { ContractStatus } from '@/entities/contract';
import type { ContractFilterStatus } from '../types';

interface ContractFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: ContractFilterStatus;
  onStatusChange: (status: ContractFilterStatus) => void;
}

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Draft', value: ContractStatus.DRAFT },
  { label: 'Active', value: ContractStatus.ACTIVE },
  { label: 'Terminated', value: ContractStatus.TERMINATED },
  { label: 'Expired', value: ContractStatus.EXPIRED },
];

export function ContractFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: ContractFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <Input
          placeholder="Search by renter name or ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ContractFilterStatus)}
        />
      </div>
    </div>
  );
}
