import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui';

interface FilterSidebarProps {
  onFilterChange?: (filters: Record<string, unknown>) => void;
}

const cities = ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Can Tho', 'Hue'];
const amenities = ['WiFi', 'Air Conditioning', 'Parking', 'Laundry', 'Gym', 'Security'];
const roomTypes = ['Studio', 'Single Room', 'Double Room', 'Shared Dorm'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleApply = () => {
    onFilterChange?.({ priceRange, selectedCity, selectedAmenities, selectedType });
  };

  const handleReset = () => {
    setPriceRange([0, 2000]);
    setSelectedCity('');
    setSelectedAmenities([]);
    setSelectedType('');
    onFilterChange?.({});
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal size={16} className="text-indigo-600" />
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Filters</h3>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Price Range / Month</label>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-sm font-black text-slate-700 border border-slate-100">
            ${priceRange[0]}
          </div>
          <span className="text-slate-300 font-bold text-xs">—</span>
          <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-sm font-black text-slate-700 border border-slate-100">
            ${priceRange[1]}
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={5000}
          step={100}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full h-1.5 bg-indigo-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      {/* City */}
      <div className="mb-6">
        <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-3">City</label>
        <div className="space-y-2">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city === selectedCity ? '' : city)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all border ${
                selectedCity === city
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'text-slate-500 border-transparent hover:bg-slate-50'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Room Type */}
      <div className="mb-6">
        <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Room Type</label>
        <div className="grid grid-cols-2 gap-2">
          {roomTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type === selectedType ? '' : type)}
              className={`px-2 py-2 rounded-lg text-xs font-bold text-center transition-all border ${
                selectedType === type
                  ? 'bg-indigo-600 text-white border-transparent'
                  : 'text-slate-500 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {amenities.map(amenity => (
            <button
              key={amenity}
              onClick={() => toggleAmenity(amenity)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedAmenities.includes(amenity)
                  ? 'bg-indigo-600 text-white border-transparent'
                  : 'text-slate-500 border-slate-100 hover:border-indigo-200'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleApply} className="flex-1 h-10 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-700">
          Apply
        </Button>
        <button
          onClick={handleReset}
          className="px-4 h-10 rounded-lg text-sm font-bold text-slate-500 border border-slate-100 hover:border-slate-200 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
