import React from 'react';
import { Search, Video, Key } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="py-32 bg-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-4 mb-24">
            <h2 className="text-5xl font-black tracking-tightest">How it works</h2>
            <p className="text-slate-400 text-lg font-medium tracking-tight">Three simple steps to finding your perfect student home.</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-32">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-slate-800 to-transparent -z-0"></div>

          {[
            { 
                icon: Search, 
                title: "Search & Filter", 
                desc: "Use our advanced filters to find rooms by price, distance, or amenities.",
                bg: "bg-primary-500/10",
                color: "text-primary-400",
                shadow: "shadow-primary-500/20"
            },
            { 
                icon: Video, 
                title: "Virtual Tours", 
                desc: "Take a 3D tour or book a live video call with the landlord or current tenant.",
                bg: "bg-teal-500/10",
                color: "text-teal-400",
                shadow: "shadow-teal-500/20"
            },
            { 
                icon: Key, 
                title: "Secure Booking", 
                desc: "Reserve your room with an integrated digital contract and secure deposit.",
                bg: "bg-slate-800",
                color: "text-white",
                shadow: "shadow-white/5"
            }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-8 group">
                <div className={`w-24 h-24 rounded-4xl ${item.bg} flex items-center justify-center ${item.color} shadow-2xl ${item.shadow} group-hover:scale-110 transition-all duration-500 border border-white/5`}>
                    <item.icon size={36} strokeWidth={2.5} />
                </div>
                <div className="space-y-4">
                    <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                    <p className="max-w-xs text-slate-500 font-medium leading-relaxed">
                        {item.desc}
                    </p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
