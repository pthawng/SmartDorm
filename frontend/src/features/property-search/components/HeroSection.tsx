import { SearchBar } from './SearchBar';
import { Badge } from '@/shared/ui/Badge';
import { StatusDot } from '@/shared/ui/StatusDot';

/**
 * High-fidelity Hero Section — split layout with premium visuals.
 * Mirrors the clean, airy, and modern aesthetic of the user's design reference.
 */
export function HeroSection() {
  const handleSearch = (location: string, date: string) => {
    // TODO: Navigate to /search with query params
    console.log('Search:', { location, date });
  };

  return (
    <section className="relative overflow-hidden bg-white px-6 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24">
          
          {/* 1. Content Column */}
          <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            {/* Pulsing Announcement Badge */}
            <div className="flex justify-start">
              <Badge variant="info" className="pl-1 pr-3 py-1 gap-2 border-primary-100 bg-primary-50/50 text-primary-700">
                <StatusDot status="info" pulse className="scale-75" />
                <span className="text-[10px] uppercase font-black tracking-widest">New: Summer student housing open</span>
              </Badge>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Find your next <br />
              <span className="text-primary-600">room</span> with ease
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
              Discover the best student dorms and shared living spaces tailored to your lifestyle. Join a vibrant community today.
            </p>

            <div className="pt-4">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* 2. Visual Column */}
          <div className="relative lg:h-[600px] w-full animate-in fade-in zoom-in-95 duration-1000 delay-300">
            {/* Main Visual Asset */}
            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary-900/10 border-8 border-white group">
              <img 
                src="/assets/images/hero-room.png" 
                alt="Modern Student Dorm" 
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
            </div>

            {/* Floating Student Stats Card */}
            <div className="absolute -bottom-6 -left-6 sm:bottom-8 sm:-left-12 bg-white p-4 sm:p-6 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4 animate-bounce-subtle z-20">
              <div className="flex -space-x-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 ring-2 ring-primary-500/10">JD</div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-600 ring-2 ring-primary-500/10">SC</div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-primary-500/10">AZ</div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-black text-slate-900">500+ People</span>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400">Looking for roommates</span>
              </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -z-10 -right-20 -top-20 h-96 w-96 rounded-full bg-primary-100/50 blur-3xl opacity-50" />
            <div className="absolute -z-10 -left-20 -bottom-20 h-96 w-96 rounded-full bg-violet-100/50 blur-3xl opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
}
