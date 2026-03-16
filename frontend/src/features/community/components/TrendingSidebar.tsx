import React from 'react';
import { TrendingUp, Calendar, MapPin } from 'lucide-react';

const trends = [
  { tag: '#DormBBQ2024', posts: '1.2k posts' },
  { tag: '#StudyGroupFinals', posts: '856 posts' },
  { tag: '#LaundryHack', posts: '432 posts' },
];

const events = [
  { name: 'Pancake Breakfast', location: 'Lounge A', time: '9:00 AM', color: 'bg-amber-100 text-amber-700' },
  { name: 'Yoga Night', location: 'Rooftop Garden', time: '6:30 PM', color: 'bg-emerald-100 text-emerald-700' },
];

const rules = [
  'Keep common areas clean. Return all borrowed equipment.',
  'Quiet hours are 10 PM to 7 AM every day.',
  'Respect your roommates and neighbors. No bullying.',
];

export const TrendingSidebar: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Trending Topics */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-indigo-600" />
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Trending</h3>
        </div>
        <div className="space-y-3">
          {trends.map((trend, i) => (
            <button key={i} className="w-full text-left group">
              <p className="font-black text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{trend.tag}</p>
              <p className="text-xs text-slate-400 font-bold">{trend.posts}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-indigo-600" />
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Upcoming Events</h3>
        </div>
        <div className="space-y-3">
          {events.map((event, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl ${event.color} flex flex-col items-center justify-center flex-shrink-0`}>
                <MapPin size={14} />
              </div>
              <div>
                <p className="font-black text-slate-900 text-sm">{event.name}</p>
                <p className="text-xs text-slate-400 font-bold">{event.location} • {event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Rules */}
      <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5">
        <h3 className="font-black text-indigo-900 text-sm uppercase tracking-widest mb-4">Community Rules</h3>
        <ol className="space-y-2.5">
          {rules.map((rule, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-xs text-indigo-800 font-bold leading-relaxed">{rule}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-slate-400">
        {['Privacy', 'Terms', 'Contact', 'Campus Map'].map(link => (
          <a key={link} href="#" className="hover:text-slate-600 transition-colors">{link}</a>
        ))}
        <span className="w-full text-[10px] text-slate-300 mt-1">© 2024 SmartDorm UI</span>
      </div>
    </div>
  );
};
