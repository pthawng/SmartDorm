import { Card, Button } from '@/shared/ui';
import { MapPin, ArrowRight, BedSingle, Bath, Wifi, Users, Waves, Home } from 'lucide-react';
import { Property } from '@/entities/property/model/types';

interface FeaturedPropertiesProps {
  properties: Property[];
  onExplore: () => void;
}

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ properties, onExplore }) => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-20">
          <div>
            <h2 className="text-5xl font-black text-slate-950 tracking-tightest">Featured Properties</h2>
            <p className="mt-4 text-slate-500 text-xl font-medium">Handpicked spaces close to top campuses.</p>
          </div>
          <button 
            className="hidden sm:flex items-center text-primary-500 font-black text-lg group"
            onClick={onExplore}
          >
            View All <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {properties.map((property, idx) => (
            <div key={property.id} className="flex flex-col gap-6">
              <Card className="group border-none shadow-card hover:shadow-premium transition-all duration-500 overflow-hidden rounded-4xl h-full flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                      src={`https://images.unsplash.com/photo-${idx === 0 ? '1486406146926-c627a92ad1ab' : idx === 1 ? '1522708323590-d24dbb6b0267' : '1502672260266-1c1ef2d93688'}?auto=format&fit=crop&w=800&q=80`} 
                      alt={property.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Status Badges from design */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm shadow-black/20 ${
                        idx === 0 ? 'bg-primary-500' : idx === 1 ? 'bg-teal-500' : 'bg-orange-500'
                    }`}>
                        {idx === 0 ? 'Verified' : idx === 1 ? 'All-Inclusive' : 'Popular'}
                    </span>
                  </div>
                  
                  <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </button>
                </div>
                
                <div className="p-8 pt-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-none group-hover:text-primary-500 transition-colors">
                        {property.name}
                    </h3>
                    <div className="text-right">
                        <p className="text-2xl font-black text-primary-500 leading-none">${idx === 0 ? '850' : idx === 1 ? '920' : '780'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">/mo</p>
                    </div>
                  </div>

                  <div className="flex items-center text-slate-400 text-sm font-semibold tracking-tight">
                    <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                    {idx === 0 ? '2 miles from campus • Cambridge' : idx === 1 ? '0.5 miles from campus • Oxford' : 'Shared kitchen • London'}
                  </div>

                  <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-tight">
                        <BedSingle size={14} className="text-slate-400" />
                        <span>{idx === 2 ? '4 Mates' : idx === 1 ? 'Studio' : '2'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-tight">
                        <Bath size={14} className="text-slate-400" />
                        <span>{idx === 2 ? '2 Bath' : '1 Bath'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-tight">
                        {idx === 0 ? <Wifi size={14} /> : idx === 1 ? <ArrowRight size={14} /> : <Waves size={14} />}
                        <span>{idx === 0 ? 'Fiber' : idx === 1 ? 'In-unit' : 'Gym access'}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
