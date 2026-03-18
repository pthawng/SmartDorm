import { Input, Select } from '@/shared/ui';

interface PropertyFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  cityFilter: string;
  onCityChange: (val: string) => void;
  cities: string[];
}

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

export function PropertyFilters({
  search, onSearchChange,
  statusFilter, onStatusChange,
  cityFilter, onCityChange,
  cities,
}: PropertyFiltersProps) {
  const cityOptions = [
    { label: 'All Cities', value: '' },
    ...cities.map(c => ({ label: c, value: c })),
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>
        <Input
          placeholder="Search properties..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        options={STATUS_OPTIONS}
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="sm:w-40"
      />

      <Select
        options={cityOptions}
        value={cityFilter}
        onChange={(e) => onCityChange(e.target.value)}
        className="sm:w-44"
      />
    </div>
  );
}
