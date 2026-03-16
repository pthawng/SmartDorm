import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { Search, MapPin, Calendar } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-white pt-24 pb-16 lg:pt-32 lg:pb-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600">New: Summer Student Housing Open</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tightest leading-tightest text-slate-950">
                Find your next <span className="text-primary-500">room</span> with ease
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                Discover the best student dorms and shared living spaces tailored to your lifestyle. Join a vibrant community today.
              </p>
            </div>

            {/* Floating Search Overlay */}
            <div className="relative z-20 max-w-2xl">
                <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl md:rounded-3xl shadow-search border border-slate-100 p-3 gap-2">
                    <div className="flex-1 flex items-center px-4 py-2 gap-3 border-b md:border-b-0 md:border-r border-slate-100 w-full">
                        <MapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
                        <input 
                            type="text" 
                            placeholder="Enter city or university" 
                            className="bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 w-full font-medium"
                        />
                    </div>
                    <div className="flex-1 flex items-center px-4 py-2 gap-3 w-full">
                        <Calendar className="text-slate-400 w-5 h-5 flex-shrink-0" />
                        <input 
                            type="text" 
                            placeholder="Move-in date" 
                            className="bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 w-full font-medium"
                        />
                    </div>
                    <Button 
                        size="lg" 
                        icon={Search} 
                        onClick={() => navigate('/explore')}
                        className="w-full md:w-auto rounded-xl md:rounded-2xl h-12 md:h-14 px-8 shadow-premium"
                    >
                        Search
                    </Button>
                </div>
            </div>
          </div>

          {/* Right Visual Content (Overlapping) */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-4xl overflow-hidden shadow-premium transform lg:rotate-2 hover:rotate-0 transition-transform duration-700 aspect-[4/5] lg:aspect-auto h-[600px]">
                <img 
                    src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80" 
                    alt="Interior Design"
                    className="w-full h-full object-cover"
                />
            </div>
            
            {/* Floating Achievement Badge */}
            <div className="absolute -bottom-10 -left-10 lg:-left-20 z-20 bg-white p-6 rounded-3xl shadow-premium border border-slate-50 flex items-center gap-4 group">
                <div className="flex -space-x-4">
                    <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://i.pravatar.cc/150?u=1" alt="Student" />
                    <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://i.pravatar.cc/150?u=2" alt="Student" />
                    <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://i.pravatar.cc/150?u=3" alt="Student" />
                </div>
                <div>
                    <p className="text-lg font-black text-slate-950 leading-none">500+ Students</p>
                    <p className="text-xs font-bold text-slate-400 tracking-tight">Looking for roommates</p>
                </div>
            </div>

            {/* Decorative Dots */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-30 -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
