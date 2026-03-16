import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyCard, ExploreProperty } from './PropertyCard';
import { FilterSidebar } from './FilterSidebar';
import { Button } from '@/shared/ui';
import { Search, MapPin, Grid3X3, List, SlidersHorizontal } from 'lucide-react';

const MOCK_PROPERTIES: ExploreProperty[] = [
  {
    id: '1',
    name: 'Indigo Heights',
    city: 'Hanoi',
    address: '123 Kim Ma St',
    monthly_price: 650,
    beds: 1,
    baths: 1,
    rating: 4.9,
    reviews: 128,
    tags: ['Utilities Incl.', 'Pet Friendly', 'Near Campus'],
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Teal Garden Studios',
    city: 'Ho Chi Minh City',
    address: '456 Le Loi Blvd',
    monthly_price: 480,
    beds: 1,
    baths: 1,
    rating: 4.7,
    reviews: 95,
    tags: ['Furnished', 'AC', 'Study Room'],
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    isNew: true,
  },
  {
    id: '3',
    name: 'The Quad Living',
    city: 'Da Nang',
    address: '789 Vo Nguyen Giap St',
    monthly_price: 420,
    beds: 2,
    baths: 1,
    rating: 4.8,
    reviews: 74,
    tags: ['Near Beach', 'Gym', 'Social Spaces'],
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Campus View Residences',
    city: 'Hanoi',
    address: '8 Xuan Thuy, Cau Giay',
    monthly_price: 550,
    beds: 1,
    baths: 1,
    rating: 4.6,
    reviews: 61,
    tags: ['Security', 'Cleaning', 'Shared Kitchen'],
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Sakura House',
    city: 'Ho Chi Minh City',
    address: '22 Nguyen Thi Minh Khai',
    monthly_price: 390,
    beds: 1,
    baths: 1,
    rating: 4.5,
    reviews: 48,
    tags: ['Budget Friendly', 'City Center'],
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '6',
    name: 'Mountain View Suites',
    city: 'Da Lat',
    address: '15 Phan Dinh Phung, Ward 2',
    monthly_price: 310,
    beds: 1,
    baths: 1,
    rating: 4.9,
    reviews: 33,
    tags: ['Scenic Views', 'Cool Climate', 'Quiet'],
    imageUrl: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&w=600&q=80',
    isNew: true,
  },
];

export const ExploreView: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = MOCK_PROPERTIES.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">SmartDorm</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate('/')} className="text-sm font-bold text-slate-500 hover:text-slate-900">Home</button>
            <button onClick={() => navigate('/community')} className="text-sm font-bold text-slate-500 hover:text-slate-900">Community</button>
            <button className="text-sm font-bold text-indigo-600">Explore</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-500 hover:text-slate-900">Login</button>
            <Button className="h-9 px-5 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/signup')}>Sign Up</Button>
          </div>
        </div>
      </nav>

      {/* Hero Search Bar */}
      <div className="bg-white border-b border-slate-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">Find your perfect stay</h1>
            <p className="text-slate-500 font-medium mb-6">Discover 200+ student-friendly housing options in your area</p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search city, property name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 h-12 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:shadow-sm transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden h-12 px-4 rounded-xl border border-slate-200 flex items-center gap-2 text-sm font-bold text-slate-600 hover:border-indigo-300"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <Button className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 hidden sm:flex">
                <MapPin size={15} className="mr-1.5" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:col-span-3 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar />
          </div>

          {/* Results */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-bold text-slate-500">
                Showing <span className="text-slate-900 font-black">{filtered.length}</span> properties
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {filtered.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🏠</p>
                <p className="text-slate-500 font-bold">No properties found for "{query}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
