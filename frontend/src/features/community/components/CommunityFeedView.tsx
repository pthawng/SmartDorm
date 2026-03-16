import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCard } from './PostCard';
import { TrendingSidebar } from './TrendingSidebar';
import { Button } from '@/shared/ui';
import { PenSquare, Search, Bell, Home, Users, MapPin, Settings } from 'lucide-react';

const MOCK_POSTS = [
  {
    id: '1',
    author: 'Alex Rodriguez',
    role: 'Building 4 Manager',
    timeAgo: '2 hours ago',
    category: 'Announcements',
    title: 'Annual Dorm BBQ this Saturday!',
    content: "Get ready for our biggest social event of the semester! We'll have free food, music, and games. Don't forget to bring your own drinks. Food will be provided by the committee. See you there!",
    likes: 84,
    comments: 23,
    avatarColor: 'bg-indigo-500',
    avatarInitials: 'AR',
    isPinned: true,
  },
  {
    id: '2',
    author: 'Sarah Chen',
    role: 'Room 4B',
    timeAgo: '5 hours ago',
    category: 'General',
    content: 'Does anyone have a spare physics textbook (University Physics 15th Ed) I could borrow for the weekend? Happy to trade for coffee! ☕️',
    likes: 12,
    comments: 8,
    avatarColor: 'bg-rose-400',
    avatarInitials: 'SC',
  },
  {
    id: '3',
    author: 'Jordan Peterson',
    role: 'Floor 3 Resident',
    timeAgo: '1 day ago',
    category: 'Study Groups',
    title: 'CS Study Session in Lounge A',
    content: "Working on the Algorithms assignment. We'll be there until midnight. Everyone is welcome to join!",
    likes: 45,
    comments: 17,
    avatarColor: 'bg-emerald-500',
    avatarInitials: 'JP',
  },
  {
    id: '4',
    author: 'Ming Li',
    role: 'Room 2A',
    timeAgo: '2 days ago',
    category: 'Marketplace',
    content: 'Selling my portable fan and desk lamp. Both in great condition. DM me for pricing. Moving out next week so need to clear everything quickly!',
    likes: 7,
    comments: 5,
    avatarColor: 'bg-amber-500',
    avatarInitials: 'ML',
  },
];

const NAV_LINKS = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Users, label: 'Community', path: '/community', active: true },
  { icon: MapPin, label: 'Explore', path: '/explore' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const CommunityFeedView: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'announcements' | 'study' | 'marketplace'>('all');
  const [postContent, setPostContent] = useState('');

  const tabOptions = [
    { key: 'all', label: 'All Posts' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'study', label: 'Study Groups' },
    { key: 'marketplace', label: 'Marketplace' },
  ] as const;

  const filteredPosts = activeTab === 'all'
    ? MOCK_POSTS
    : MOCK_POSTS.filter(p => p.category.toLowerCase().replace(' ', '') === activeTab);

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
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ icon: Icon, label, path, active }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
              <Search size={16} />
            </button>
            <button className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-black cursor-pointer">
              AR
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FEED (center) */}
          <div className="lg:col-span-8">
            {/* Create Post */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                  AR
                </div>
                <input
                  type="text"
                  placeholder="Share something with your community..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="flex-1 text-sm text-slate-500 font-medium outline-none placeholder:text-slate-300 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 focus:border-indigo-300 focus:bg-white transition-all"
                />
              </div>
              {postContent.length > 0 && (
                <div className="mt-3 flex justify-end">
                  <Button className="h-9 px-6 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-700">
                    <PenSquare size={13} className="mr-1.5" />
                    Post
                  </Button>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-xl border border-slate-100 p-1 mb-6">
              {tabOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                    activeTab === key ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};
