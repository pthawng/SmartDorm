import { MapPin, Star } from 'lucide-react';
import { type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../api/propertySearchApi';
import { Card, CardContent } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

interface PropertyCardProps {
  property: Property;
}

/**
 * High-fidelity Property Card — logic-pure UI.
 * Features Airbnb-inspired design with soft shadows and premium typography.
 */
export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <Card 
      className="group overflow-hidden rounded-[2rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-white"
      onClick={handleNavigate}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={property.thumbnail} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <Badge className="bg-primary-600 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg">
              Featured
            </Badge>
          )}
          <Badge className={cn(
             "border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg",
             property.status === 'available' ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
          )}>
            {property.status}
          </Badge>
        </div>
        
        {/* Favorite Button Placeholder */}
        <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-rose-500 transition-all shadow-sm border border-white/30">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span className="text-sm font-bold text-slate-900">{property.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 min-w-0">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium truncate">{property.city}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full px-5 border-slate-200 hover:border-primary-600 hover:text-primary-600 transition-all font-bold shrink-0"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              handleNavigate();
            }}
          >
            View
          </Button>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100/60 mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-primary-600 tracking-tight">
                {new Intl.NumberFormat('vi-VN').format(property.price)}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">vnđ/mo</span>
            </div>
          </div>
          
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100/50 flex flex-col items-center justify-center shrink-0">
            <span className="text-xs font-black text-slate-900 leading-none">
              {property.roomsCount}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Rooms</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Utility to handle dynamic classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
