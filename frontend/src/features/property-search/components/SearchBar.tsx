import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/Input';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

/**
 * Stylized search input with premium Airbnb aesthetics.
 */
export function SearchBar({ value, onChange, placeholder = "Search for dorms, areas, or keywords..." }: SearchBarProps) {
  return (
    <div className="relative group max-w-2xl mx-auto">
      <div className="absolute inset-0 bg-primary-500/10 blur-2xl rounded-full scale-90 opacity-0 group-focus-within:opacity-100 transition-all duration-700" />
      <div className="relative flex items-center bg-white rounded-full p-2 pl-6 shadow-xl border border-slate-100 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all">
        <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
        <Input 
          className="border-none bg-transparent shadow-none focus-visible:ring-0 text-lg font-medium placeholder:text-slate-400 w-full ml-4"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button className="ml-2 bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/25 active:scale-95 transition-all">
          Search
        </button>
      </div>
    </div>
  );
}
