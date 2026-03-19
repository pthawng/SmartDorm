import { Search } from 'lucide-react';
import { Select } from '@/shared/ui/Select';
import { Input } from '@/shared/ui/Input';
import { SearchFilters } from '../api/propertySearchApi';

interface DiscoveryBarProps {
  query: string;
  setQuery: (val: string) => void;
  filters: SearchFilters;
  onCityChange: (city: string) => void;
  onPriceSelect: (range: [number, number]) => void;
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
 * Premium, inline 'Discovery Bar' — combines search and faceted filtering.
 * Features high-elevation pill design with vertical dividers.
 */
export function DiscoveryBar({ 
  query, 
  setQuery, 
  filters, 
  onCityChange, 
  onPriceSelect 
}: DiscoveryBarProps) {

  const handlePriceSelect = (val: string) => {
    switch (val) {
      case 'under-3m': onPriceSelect([0, 3000000]); break;
      case '3m-5m':   onPriceSelect([3000000, 5000000]); break;
      case 'above-5m': onPriceSelect([5000000, 20000000]); break;
      default:         onPriceSelect([0, 20000000]);
    }
  };

  const getPriceValue = () => {
    if (filters.priceRange?.[1] === 3000000) return 'under-3m';
    if (filters.priceRange?.[0] === 3000000) return '3m-5m';
    if (filters.priceRange?.[0] === 5000000) return 'above-5m';
    return 'any';
  };

  return (
    <div className="relative group max-w-5xl mx-auto">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full scale-95 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
      
      {/* Main Pill Container */}
      <div className="relative flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-3xl md:rounded-full p-2 shadow-2xl border border-slate-100/50 backdrop-blur-xl transition-all duration-300">
        
        {/* 1. Search Section */}
        <div className="flex-1 flex items-center pl-4 md:pl-6">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <Input 
            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-md font-semibold placeholder:text-slate-400 w-full ml-3"
            placeholder="Where are you looking?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Vertical Divider (Desktop) */}
        <div className="hidden md:block w-px h-8 bg-slate-100 mx-2" />
        
        {/* 2. City Filter */}
        <div className="flex-1 px-2 md:px-0">
          <Select 
            options={CITY_OPTIONS} 
            value={filters.city || ''} 
            onChange={(e) => onCityChange(e.target.value)}
            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-bold text-slate-700 hover:bg-slate-50 md:rounded-full transition-colors"
            placeholder="City"
          />
        </div>

        {/* Vertical Divider (Desktop) */}
        <div className="hidden md:block w-px h-8 bg-slate-100 mx-2" />

        {/* 3. Price Filter */}
        <div className="flex-1 px-2 md:px-0">
          <Select 
            options={PRICE_OPTIONS} 
            value={getPriceValue()} 
            onChange={(e) => handlePriceSelect(e.target.value)}
            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-bold text-slate-700 hover:bg-slate-50 md:rounded-full transition-colors"
            placeholder="Price"
          />
        </div>

        {/* 4. Search Action */}
        <div className="p-1 md:pl-4">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-2xl md:rounded-full font-black uppercase tracking-[0.15em] text-[10px] hover:bg-primary-700 shadow-xl shadow-primary-500/25 active:scale-95 transition-all">
             Search
          </button>
        </div>
      </div>
    </div>
  );
}
