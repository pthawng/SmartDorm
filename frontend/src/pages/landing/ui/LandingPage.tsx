import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero, FeaturedProperties, Community, HowItWorks } from '@/features/property-search/components';
import { Button } from '@/shared/ui';
import { Property } from '@/entities/property/model/types';
import axiosClient from '@/shared/api/axiosClient';

const LandingPage = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking API call for Featured Properties
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const mockData: Property[] = [
          {
            id: '1',
            workspace_id: 'ws-1',
            name: 'Indigo Heights',
            address: '123 Kim Ma St',
            city: 'Hanoi',
            description: 'Premium student accommodation with high-tech amenities and 24/7 security.',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            workspace_id: 'ws-1',
            name: 'Teal Garden Studios',
            address: '456 Le Loi Blvd',
            city: 'Ho Chi Minh City',
            description: 'Modern studio apartments designed for focused studying and vibrant socializing.',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            workspace_id: 'ws-2',
            name: 'The Quad Living',
            address: '789 Vo Nguyen Giap St',
            city: 'Da Nang',
            description: 'Balanced living near the beach, perfect for students who love the outdoors.',
            created_at: new Date().toISOString()
          }
        ];
        
        setFeaturedProperties(mockData);
      } catch (error) {
        console.error("Failed to fetch featured properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleExplore = () => {
    navigate('/explore');
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary-500 selection:text-white">
      {/* Navigation - High Fidelity */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-primary-500 rounded-xl shadow-premium flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
                </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-primary-500 transition-colors">
              SmartDorm
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[13px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#" className="text-primary-500">Home</a>
            <a href="#" className="hover:text-primary-500 transition-colors">Explore</a>
            <a href="#" className="hover:text-primary-500 transition-colors">Community</a>
          </div>
          <div className="flex items-center gap-8">
            <button 
                onClick={() => navigate('/login')}
                className="text-sm font-black text-slate-900 hover:text-primary-500 transition-colors tracking-tight"
            >
                Login
            </button>
            <Button size="md" className="hidden sm:inline-flex shadow-premium px-8">
                Sign Up
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Hero />
        
        {loading ? (
            <div className="flex justify-center py-32">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        ) : (
            <FeaturedProperties 
                properties={featuredProperties} 
                onExplore={handleExplore}
            />
        )}

        <Community />
        <HowItWorks />
        
        {/* Pixel-Perfect Footer (Screenshot 5) */}
        <footer className="bg-white text-slate-900 pt-32 pb-12 border-t border-slate-100 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
                    <div className="md:col-span-5 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
                              </svg>
                            </div>
                            <span className="text-2xl font-black tracking-tighter">SmartDorm</span>
                        </div>
                        <div className="space-y-2 text-slate-400 font-bold text-lg leading-relaxed">
                            <p>Making student living easy, safe, and communal.</p>
                            <p>The modern way to find and book your next dorm.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:bg-indigo-50 transition-all shadow-sm">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.543 6.498C22 8.249 22 12 22 12s0 3.751-.457 5.502c-.254.943-.997 1.687-1.94 1.94C17.85 20 12 20 12 20s-5.85 0-7.603-.558c-.943-.253-1.686-1.012-1.94-1.94C2 15.751 2 12 2 12s0-3.751.457-5.502c.254-.943.997-1.687 1.94-1.94C6.15 4 12 4 12 4s5.85 0 7.603.558c.943.253 1.686 1.012 1.94 1.94z"/></svg>
                            </button>
                            <button className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:bg-indigo-50 transition-all shadow-sm">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                            </button>
                        </div>
                    </div>
                    <div className="md:col-span-3 space-y-8">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Explore</h4>
                        <div className="space-y-4 text-[15px] font-bold text-slate-400">
                            <a href="#" className="block hover:text-primary-500">Find a Room</a>
                            <a href="#" className="block hover:text-primary-500">Student Deals</a>
                            <a href="#" className="block hover:text-primary-500">Safety Tips</a>
                            <a href="#" className="block hover:text-primary-500">Landlords</a>
                        </div>
                    </div>
                    <div className="md:col-span-4 space-y-8">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Support</h4>
                        <div className="space-y-4 text-[15px] font-bold text-slate-400">
                            <a href="#" className="block hover:text-primary-500">Help Center</a>
                            <a href="#" className="block hover:text-primary-500">Contact Us</a>
                            <a href="#" className="block hover:text-primary-500">Privacy Policy</a>
                            <a href="#" className="block hover:text-primary-500">Terms of Service</a>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-sm font-bold text-slate-300">© 2024 SmartDorm Technologies Inc. All rights reserved.</p>
                    <div className="text-sm font-bold text-slate-300 italic">
                        Built for students, by students.
                    </div>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
