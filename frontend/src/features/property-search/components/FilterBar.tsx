import { Select } from '@/shared/ui/Select';
import { SearchFilters } from '../api/propertySearchApi';
import { X } from 'lucide-react';

interface FilterBarProps {
  filters: SearchFilters;
  onCityChange: (city: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onReset: () => void;
}

const CITY_OPTIONS = [
  { label: 'All Cities', value: '' },
  { label: 'Ho Chi Minh City', value: 'Ho Chi Minh City' },
  { label: 'Ha Noi', value: 'Ha Noi' },
  { label: 'Da Nang', value: 'Da Nang' },
];

const PRICE_OPTIONS = [
  { label: 'Any Price', value: 'any' },
  { label: 'Under 3M', value: 'under-3m' },
  { label: '3M - 5M', value: '3m-5m' },
  { label: 'Above 5M', value: 'above-5m' },
];

/**
 * Faceted filter bar for property discovery.
 */
export function FilterBar({ filters, onCityChange, onPriceChange, onReset }: FilterBarProps) {
  
  const handlePriceSelect = (val: string) => {
    switch (val) {
      case 'under-3m': onPriceChange([0, 3000000]); break;
      case '3m-5m': onPriceChange([3000000, 5000000]); break;
      case 'above-5m': onPriceChange([5000000, 20000000]); break;
      default: onPriceChange([0, 10000000]);
    }
  };

  const getPriceValue = () => {
    if (filters.priceRange?.[1] === 3000000) return 'under-3m';
    if (filters.priceRange?.[0] === 3000000) return '3m-5m';
    if (filters.priceRange?.[0] === 5000000) return 'above-5m';
    return 'any';
  };

  const hasActiveFilters = filters.city || getPriceValue() !== 'any';

  return (
    <div className="flex flex-wrap items-center gap-4 py-8">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Filter By:</span>
        
        <Select 
          options={CITY_OPTIONS} 
          value={filters.city || ''} 
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="Select City"
          className="w-48 bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
        />

        <Select 
          options={PRICE_OPTIONS} 
          value={getPriceValue()} 
          onChange={(e) => handlePriceSelect(e.target.value)}
          placeholder="Price Range"
          className="w-48 bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
        />
      </div>

      {hasActiveFilters && (
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <X className="w-3 h-3" />
          Reset All
        </button>
      )}
    </div>
  );
}
