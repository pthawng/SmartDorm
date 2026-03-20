import { Search, MapPin, Calendar } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (location: string, date: string) => void;
  placeholder?: string;
}

/**
 * High-fidelity Spotlight Search bar. 
 * Dual-field input system with integrated primary action.
 */
export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center bg-white p-2 rounded-3xl sm:rounded-full shadow-2xl border border-slate-100 w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-1000 hover:shadow-primary-500/5 transition-all group/container">
      {/* 1. Location Input */}
      <div className="flex-1 flex items-center px-4 py-3 sm:py-2 sm:border-r border-slate-100 group transition-all">
        <MapPin className="w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
        <div className="flex flex-col ml-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-tight">Location</span>
          <input 
            placeholder="Enter city or university" 
            className="w-full text-sm font-semibold text-slate-900 border-none p-0 focus:ring-0 placeholder:text-slate-300 bg-transparent h-5"
          />
        </div>
      </div>
      
      {/* 2. Date Input (Simplified as text for high-fidelity concept) */}
      <div className="flex-1 flex items-center px-4 py-3 sm:py-2 group transition-all">
        <Calendar className="w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
        <div className="flex flex-col ml-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-tight">Move-in</span>
          <input 
            placeholder="Choose a date" 
            className="w-full text-sm font-semibold text-slate-900 border-none p-0 focus:ring-0 placeholder:text-slate-300 bg-transparent h-5"
          />
        </div>
      </div>

      {/* 3. Global Search CTA */}
      <button 
        onClick={() => onSearch?.('', '')}
        className="w-full sm:w-auto px-10 py-4 bg-primary-600 hover:shadow-lg shadow-primary-500/30 hover:bg-primary-700 text-white rounded-2xl sm:rounded-full font-bold transition-all flex items-center justify-center gap-2 group"
      >
        <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Search
      </button>
    </div>
  );
}
