import { Building2, MapPin, ArrowRight, PencilLine } from 'lucide-react';
import { Card, Button } from '@/shared/ui';
import { cn } from '@/shared/utils';

export interface PropertyCardData {
  id: string;
  name: string;
  location: string;
  status: 'draft' | 'published' | 'archived';
  roomCount?: number;
  thumbnailUrl?: string;
}

interface PropertyCardProps {
  property: PropertyCardData;
  onAction?: (action: 'view' | 'edit' | 'setup') => void;
}

export function PropertyCard({ property, onAction }: PropertyCardProps) {
  const isDraft = property.status === 'draft';
  const isPublished = property.status === 'published';

  return (
    <Card className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        {property.thumbnailUrl ? (
          <img 
            src={property.thumbnailUrl} 
            alt={property.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <Building2 className="w-12 h-12 text-slate-300" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={cn(
            "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-md",
            isPublished ? "bg-emerald-500/90 text-white" : "bg-slate-800/80 text-white"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              isPublished ? "bg-emerald-200" : "bg-slate-300"
            )} />
            {property.status}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {property.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-sm font-medium">
            <MapPin size={16} className="text-slate-400 shrink-0" />
            <span className="line-clamp-1">{property.location || 'Location not set'}</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
            {property.roomCount || 0} Rooms
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {isDraft ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onAction?.('setup')}
                className="font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 bg-indigo-50/50"
              >
                Continue Setup
                <PencilLine className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onAction?.('view')}
                className="font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
