import { useState } from 'react';
import { Button } from '@/shared/ui';

interface SearchBarProps {
  onSearch: (location: string, priceRange: string) => void;
}

/**
 * Search Bar — pure presentational. Receives onSearch callback via props.
 */
export function SearchBar({ onSearch }: SearchBarProps) {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');

  return (
    <div className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-3 rounded-2xl bg-white/10 p-2 backdrop-blur-sm sm:flex-row sm:items-center">
      {/* Location */}
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-3">
        <svg className="h-5 w-5 shrink-0 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
        </svg>
        <input
          type="text"
          placeholder="City or location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Price Range */}
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-3">
        <svg className="h-5 w-5 shrink-0 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full cursor-pointer bg-transparent text-sm text-slate-900 outline-none"
        >
          <option value="">Any price</option>
          <option value="0-3">Under 3M ₫</option>
          <option value="3-5">3M - 5M ₫</option>
          <option value="5-8">5M - 8M ₫</option>
          <option value="8+">8M+ ₫</option>
        </select>
      </div>

      {/* Search Button */}
      <Button
        size="lg"
        onClick={() => onSearch(location, priceRange)}
        className="shrink-0 gap-2 rounded-xl bg-white text-primary-700 hover:bg-white/90 shadow-lg"
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        Search
      </Button>
    </div>
  );
}
