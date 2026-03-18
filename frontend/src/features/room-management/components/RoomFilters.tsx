import { Input, Select } from '@/shared/ui';

interface RoomFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  propertyFilter: string;
  onPropertyChange: (val: string) => void;
  properties: { id: string; name: string }[];
}

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Occupied', value: 'OCCUPIED' },
  { label: 'Maintenance', value: 'MAINTENANCE' },
];

export function RoomFilters({
  search, onSearchChange,
  statusFilter, onStatusChange,
  propertyFilter, onPropertyChange,
  properties,
}: RoomFiltersProps) {
  const propertyOptions = [
    { label: 'All Properties', value: '' },
    ...properties.map(p => ({ label: p.name, value: p.id })),
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
          placeholder="Search by room number..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        options={propertyOptions}
        value={propertyFilter}
        onChange={(e) => onPropertyChange(e.target.value)}
        className="sm:w-48"
      />

      <Select
        options={STATUS_OPTIONS}
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="sm:w-40"
      />
    </div>
  );
}
