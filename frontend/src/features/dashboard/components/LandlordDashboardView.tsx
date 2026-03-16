import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { TrendingUp, Users, DoorOpen, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight, Clock, UserPlus, Wrench, CreditCard } from 'lucide-react';

const STATS = [
  { label: 'Total Revenue', value: '$24,780', change: '+12.5%', up: true, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Total Tenants', value: '128', change: '+3', up: true, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
  { label: 'Occupied Rooms', value: '96%', change: '-2%', up: false, icon: DoorOpen, color: 'bg-amber-50 text-amber-600' },
  { label: 'Open Issues', value: '5', change: '+2', up: false, icon: AlertTriangle, color: 'bg-rose-50 text-rose-600' },
];

const ACTIVITIES = [
  { icon: CreditCard, color: 'bg-emerald-50 text-emerald-600', title: 'Payment Received', desc: '$850 from Sarah Jenkins for Room 302', time: '12 minutes ago' },
  { icon: UserPlus, color: 'bg-indigo-50 text-indigo-600', title: 'New Tenant Onboarding', desc: 'Michael Ross signed lease for Unit 12B', time: '2 hours ago' },
  { icon: Wrench, color: 'bg-amber-50 text-amber-600', title: 'Maintenance Request', desc: 'AC repair needed in Room 105', time: '5 hours ago' },
  { icon: AlertTriangle, color: 'bg-rose-50 text-rose-600', title: 'Late Payment Alert', desc: 'David G. is 3 days overdue ($600)', time: 'Yesterday' },
];

const PROPERTIES = [
  { name: 'Greenview Suites', address: '4520 Oak Lane', occupancy: 100, color: 'bg-emerald-500' },
  { name: 'Pinecrest Residences', address: '882 High St', occupancy: 85, color: 'bg-indigo-500' },
  { name: 'Urban Hub Apartments', address: '12 Downtown Pl', occupancy: 60, color: 'bg-amber-500' },
];

const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const REVENUE = [18200, 21400, 19800, 22100, 20900, 24780];
const MAX_REV = Math.max(...REVENUE);

export const LandlordDashboardView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="landlord">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-slate-900">Dashboard</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Welcome back. Here's an overview of your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={18} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-slate-900 text-sm">Revenue Overview</h3>
              <p className="text-xs text-slate-400 font-bold mt-0.5">Gross income for the past 6 months</p>
            </div>
            <div className="flex gap-1 bg-slate-50 rounded-lg p-1">
              <button className="px-3 py-1 rounded-md text-xs font-bold bg-white shadow-sm text-slate-900">Monthly</button>
              <button className="px-3 py-1 rounded-md text-xs font-bold text-slate-400">Weekly</button>
            </div>
          </div>
          <div className="flex items-end gap-3 h-48">
            {MONTHS.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative">
                  <div
                    className="w-full bg-indigo-100 rounded-t-lg hover:bg-indigo-200 transition-colors relative group cursor-pointer"
                    style={{ height: `${(REVENUE[i] / MAX_REV) * 160}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md whitespace-nowrap">
                      ${REVENUE[i].toLocaleString()}
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-indigo-600 rounded-t-lg transition-all"
                      style={{ height: `${(REVENUE[i] / MAX_REV) * 100}%`, opacity: 0.8 }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Occupancy */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-black text-slate-900 text-sm mb-1">Occupancy Trend</h3>
          <p className="text-xs text-slate-400 font-bold mb-6">Live tenant distribution</p>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="96, 100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">96%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Occupied</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-indigo-700">98%</p>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Peak (Aug 2023)</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-slate-700">7</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vacant Rooms</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Recent Activity */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-black text-slate-900 text-sm mb-5">Recent Activity</h3>
          <div className="space-y-4">
            {ACTIVITIES.map((act, i) => (
              <div key={i} className="flex items-start gap-4 group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center flex-shrink-0`}>
                  <act.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{act.title}</p>
                  <p className="text-xs text-slate-400 font-bold truncate">{act.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-300 font-bold flex-shrink-0">
                  <Clock size={11} />
                  {act.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Properties */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-slate-900 text-sm">Your Properties</h3>
            <button onClick={() => navigate('/landlord/properties')} className="text-xs font-black text-indigo-600 hover:text-indigo-700">Manage All</button>
          </div>
          <div className="space-y-4">
            {PROPERTIES.map((prop, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl ${prop.color} flex items-center justify-center text-white`}>
                  <TrendingUp size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{prop.name}</p>
                  <p className="text-xs text-slate-400 font-bold">{prop.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{prop.occupancy}%</p>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1">
                    <div className={`h-full rounded-full ${prop.color}`} style={{ width: `${prop.occupancy}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
