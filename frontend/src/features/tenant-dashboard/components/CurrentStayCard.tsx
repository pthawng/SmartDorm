import { Card, Badge } from '@/shared/ui';
import { StayInfo } from '../types';
import { MapPin, Calendar, Layout } from 'lucide-react';

interface CurrentStayCardProps {
  stay: StayInfo;
}

/**
 * Airbnb-style 'Stay Hero' — immersive property showcase.
 * Features background imagery, large-format metadata, and status badges.
 */
export function CurrentStayCard({ stay }: CurrentStayCardProps) {
  return (
    <Card className="relative p-0 overflow-hidden border-none shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] group bg-white">
      {/* Immersive Background */}
      <div className="relative h-[400px] md:h-[450px] w-full overflow-hidden">
        <img 
          src={stay.imageUrl} 
          alt={stay.propertyName} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
        />
        {/* Designer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        {/* Floating Status */}
        <div className="absolute top-8 right-8">
          <Badge className="bg-emerald-500 text-white border-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/40 ring-4 ring-white/10 backdrop-blur-md">
            Active Stay
          </Badge>
        </div>

        {/* Hero Content (Overlay) */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/90 px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">
            {stay.roomNumber}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {stay.propertyName}
            </h2>
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium tracking-tight truncate max-w-xl">
                {stay.address}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Metadata Section */}
      <div className="bg-white p-8 md:p-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-wrap items-center gap-8 md:gap-12">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Lease Term</span>
            </div>
            <p className="text-sm font-black text-slate-900 tracking-wider">
              {stay.startDate} — {stay.endDate}
            </p>
          </div>
          
          <div className="hidden sm:block w-px h-10 bg-slate-100" />

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-300">
              <Layout className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Amenity Suite</span>
            </div>
            <p className="text-sm font-black text-slate-900 tracking-wider">
              SmartDorm Pro Access
            </p>
          </div>
        </div>

        <button className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
          View Contract
        </button>
      </div>
    </Card>
  );
}
