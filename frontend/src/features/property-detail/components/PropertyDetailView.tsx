import React, { useState } from 'react';
import { Star, MapPin, Share2, Heart, Shield, Bed, Bath, Move, Wifi, Sliders, Coffee, Wind, Monitor, Lock } from 'lucide-react';
import { Button } from '@/shared/ui';

export const PropertyDetailView: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);

  const amenities = [
    { icon: Wifi, label: 'High-speed WiFi' },
    { icon: Wind, label: 'Air Conditioning' },
    { icon: Coffee, label: 'Fully Equipped Kitchen' },
    { icon: Monitor, label: 'Smart TV' },
    { icon: Sliders, label: 'Adjustable Lighting' },
    { icon: Lock, label: 'Smart Lock' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header / Gallery Section */}
      <div className="bg-white border-b border-slate-100 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Top Breadcrumbs & Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer">Explore</span>
              <span>/</span>
              <span className="hover:text-slate-600 cursor-pointer">Metropolis</span>
              <span>/</span>
              <span className="text-slate-900">Skyline Heights</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-sm font-black hover:bg-slate-100 transition-colors">
                <Share2 size={16} />
                Share
              </button>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-black ${
                  isLiked ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600'
                }`}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                {isLiked ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          <h1 className="text-4xl font-black tracking-tightest text-slate-900 mb-2">
            Premium Studio at Skyline Heights
          </h1>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-1.5">
              <Star size={16} className="text-amber-400" fill="currentColor" />
              <span className="text-sm font-black text-slate-900">4.92</span>
              <span className="text-sm font-bold text-slate-400">(48 Reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-indigo-600" />
              <span className="text-sm font-bold text-slate-600">Downtown District, Metropolis</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <Shield size={14} />
              <span className="text-xs font-black uppercase tracking-widest">Verified Stay</span>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-12 gap-4 h-[500px]">
            <div className="col-span-8 h-full rounded-2xl overflow-hidden shadow-soft group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" 
                alt="Main view"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="col-span-4 flex flex-col gap-4 h-full">
              <div className="flex-1 rounded-2xl overflow-hidden shadow-soft group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80" 
                  alt="Kitchen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden shadow-soft relative group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80" 
                  alt="Living area"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-black text-sm uppercase tracking-widest">View all +12 photos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="col-span-8">
            <div className="flex items-center justify-between pb-8 border-b border-slate-100 mb-8">
              <div className="grid grid-cols-4 gap-8">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Bed size={20} />
                    <span className="text-xl font-black text-slate-900">1</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bedroom</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Bath size={20} />
                    <span className="text-xl font-black text-slate-900">1</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bathroom</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Move size={20} />
                    <span className="text-xl font-black text-slate-900">450</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">sq ft</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Shield size={20} />
                    <span className="text-xl font-black text-slate-900">Smart</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Home</span>
                </div>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-black tracking-tightest text-slate-900 mb-6 uppercase tracking-widest text-sm">About this space</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                Welcome to Skyline Heights, a modern residence designed for students who value comfort and connectivity. 
                Our Premium Studio offers a full en-suite bathroom, a queen-size bed, and a floorplan optimized for both 
                productivity and relaxation. 
                <br /><br />
                Equipped with full smart home integration, you can control your lighting, temperature, and security 
                directly from your smartphone. Located in the heart of Metropolis, you're just minutes away from 
                major university campuses and the vibrant Downtown district.
              </p>
              <button className="text-indigo-600 font-black text-sm hover:underline">Show more</button>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-black tracking-tightest text-slate-900 mb-8 uppercase tracking-widest text-sm">What this place offers</h2>
              <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                {amenities.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-10 h-12 px-8 rounded-xl border-slate-200 text-slate-900 font-black">
                Show all 24 amenities
              </Button>
            </section>
          </div>

          {/* Booking Widget Sidebar */}
          <div className="col-span-4 self-start sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-3xl font-black text-slate-900">$1,250</span>
                  <span className="text-slate-400 font-bold ml-1 text-sm">/ month</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400" fill="currentColor" />
                  <span className="text-sm font-black text-slate-900">4.92</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-indigo-200 hover:bg-white transition-all">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Select Room</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Premium Studio (Unit 402)</span>
                    <Sliders size={14} className="text-slate-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-indigo-200 hover:bg-white transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Check In</p>
                    <span className="text-sm font-bold text-slate-900">01 Sep 2024</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-indigo-200 hover:bg-white transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Check Out</p>
                    <span className="text-sm font-bold text-slate-900">31 Dec 2024</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>$1,250 x 4 months</span>
                  <span className="text-slate-900 font-black">$5,000</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>Service Fee</span>
                  <span className="text-slate-900 font-black">$120</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between">
                  <span className="text-base font-black text-slate-900">Total Due</span>
                  <span className="text-xl font-black text-indigo-600">$5,120</span>
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-black shadow-soft">
                Book Now
              </Button>
              
              <p className="text-center text-xs font-bold text-slate-400 mt-4 leading-relaxed px-4">
                You won't be charged yet. You can cancel for free within 48 hours.
              </p>
            </div>

            <div className="mt-6 bg-amber-50 rounded-2xl border border-amber-100 p-5 flex items-start gap-4">
              <Star size={20} className="text-amber-500 flex-shrink-0" fill="currentColor" />
              <div>
                <p className="text-sm font-black text-amber-900">Limited Availability</p>
                <p className="text-[11px] font-bold text-amber-700 leading-relaxed mt-1">
                  Only 2 units of this type remain for the upcoming semester.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
