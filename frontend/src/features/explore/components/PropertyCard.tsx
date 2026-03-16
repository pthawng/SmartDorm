import React, { useState } from 'react';
import { Heart, MapPin, Wifi, BedDouble, Bath, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ExploreProperty {
  id: string;
  name: string;
  city: string;
  address: string;
  monthly_price: number;
  beds: number;
  baths: number;
  rating: number;
  reviews: number;
  tags: string[];
  imageUrl: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface PropertyCardProps {
  property: ExploreProperty;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-200">
        <img
          src={property.imageUrl}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80`;
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isNew && (
            <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white px-2.5 py-1 rounded-full">NEW</span>
          )}
          {property.isFeatured && (
            <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-white px-2.5 py-1 rounded-full">FEATURED</span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-xl backdrop-blur-sm flex items-center justify-center transition-all ${saved ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-500 hover:text-rose-500'}`}
        >
          <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
          <span className="font-black text-slate-900 text-sm">${property.monthly_price.toLocaleString()}</span>
          <span className="text-slate-400 text-xs font-bold">/mo</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-black text-slate-900 text-[15px] leading-snug group-hover:text-indigo-600 transition-colors">{property.name}</h3>
          <div className="flex items-center gap-1 text-amber-400 flex-shrink-0 ml-2">
            <Star size={13} fill="currentColor" />
            <span className="text-xs font-black text-slate-700">{property.rating}</span>
            <span className="text-xs text-slate-400 font-bold">({property.reviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400 mb-4">
          <MapPin size={12} />
          <span className="text-xs font-bold">{property.address}, {property.city}</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500 mb-4 text-xs font-bold uppercase tracking-tight">
          <div className="flex items-center gap-1.5">
            <BedDouble size={13} />
            <span>{property.beds} Bed{property.beds > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={13} />
            <span>{property.baths} Bath</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi size={13} />
            <span>Fiber</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {property.tags.map((tag, i) => (
            <span key={i} className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-100 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
