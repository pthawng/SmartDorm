import { Search, Command } from 'lucide-react';

export function HeaderSearch() {
  return (
    <div className="hidden md:flex items-center gap-3 px-4 h-10 w-64 bg-slate-50 border border-slate-200 rounded-xl group hover:border-primary-200 hover:bg-white transition-all duration-300 cursor-text">
      <Search className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" strokeWidth={2.5} />
      <input 
        type="text" 
        placeholder="Quick Search..." 
        className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest text-slate-600 placeholder:text-slate-400 w-full"
      />
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-sm">
        <Command className="w-2.5 h-2.5 text-slate-400" />
        <span className="text-[8px] font-black text-slate-400">K</span>
      </div>
    </div>
  );
}
