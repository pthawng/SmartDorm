import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function LandlordCTA() {
  return (
    <div className="relative group">
      <Link to="/become-landlord">
        <button 
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-sky-200 hover:bg-sky-50 transition-all duration-300 group/btn"
        >
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white border border-slate-200 group-hover/btn:border-sky-300 group-hover/btn:bg-sky-500 transition-all shadow-sm">
             <Sparkles className="w-2.5 h-2.5 text-slate-400 group-hover/btn:text-white transition-colors" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 group-hover/btn:text-sky-700 transition-colors pr-1">Landlord</span>
        </button>
      </Link>

      {/* Tooltip / Popover Bubble */}
      <div className="absolute top-full right-0 mt-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50">
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-premium relative">
          {/* Notch */}
          <div className="absolute -top-1.5 right-6 w-3 h-3 bg-slate-900 rotate-45" />
          
          <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-1">Passive Income</p>
          <p className="text-xs font-medium text-slate-200 leading-relaxed">
            Start earning from your property. List your room in minutes!
          </p>
          
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
             <span className="text-[9px] font-bold text-slate-400">Join 500+ Owners</span>
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="h-4 w-4 rounded-full border border-slate-800 bg-slate-700 flex items-center justify-center text-[6px] font-bold">U</div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
