import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { CreditCard, Wrench, FileText, Clock, Calendar, ChevronRight, Gift, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui';

const ACTIVITIES = [
  { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600', title: 'Rent Paid Successfully', desc: 'Your September rent payment was processed.', time: '2 days ago' },
  { icon: Wrench, color: 'bg-amber-50 text-amber-600', title: 'Maintenance Scheduled', desc: 'Sink repair scheduled for Friday at 2:00 PM.', time: '5 days ago' },
  { icon: FileText, color: 'bg-indigo-50 text-indigo-600', title: 'Building Notice', desc: 'Scheduled window cleaning on October 5th.', time: '1 week ago' },
];

export const TenantDashboardView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="tenant">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-slate-900">
          Welcome back, Alex 👋
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Everything looks good with your stay at Indigo Residences.
        </p>
      </div>

      {/* Unit Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black tracking-tight">Unit 402 - Premium Studio</h2>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={13} className="text-indigo-200" />
                <p className="text-sm font-bold text-indigo-100">Agreement ends Dec 31, 2024</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Monthly Rent</p>
              <p className="text-2xl font-black">$1,250<span className="text-sm text-indigo-200">.00</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard size={18} />
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
          </div>
          <p className="font-black text-slate-900 text-sm">Upcoming Payment</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">$1,250<span className="text-sm text-slate-400">.00</span></p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Due Oct 1, 2024</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench size={18} />
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
          </div>
          <p className="font-black text-slate-900 text-sm">Maintenance</p>
          <p className="text-2xl font-black text-amber-600 mt-1">1</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Request Open</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
          </div>
          <p className="font-black text-slate-900 text-sm">Utilities</p>
          <p className="text-sm font-bold text-indigo-600 mt-3 hover:underline">View Statement →</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-slate-900 text-sm">Recent Activity</h3>
          <button className="text-xs font-black text-indigo-600 hover:text-indigo-700">View all</button>
        </div>
        <div className="space-y-4">
          {ACTIVITIES.map((act, i) => (
            <div key={i} className="flex items-start gap-4 group cursor-pointer">
              <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center flex-shrink-0`}>
                <act.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{act.title}</p>
                <p className="text-xs text-slate-400 font-bold">{act.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-300 font-bold flex-shrink-0">
                <Clock size={11} />
                {act.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <HelpCircle size={18} />
          </div>
          <h3 className="font-black text-slate-900 text-sm mb-1">Support Center</h3>
          <p className="text-xs text-slate-400 font-bold mb-4">How can we help you today?</p>
          <Button className="h-9 px-5 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-700">Contact Support</Button>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200 p-6 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4">
            <Gift size={18} />
          </div>
          <h3 className="font-black text-slate-900 text-sm mb-1">Refer a friend</h3>
          <p className="text-xs text-slate-500 font-bold mb-4">Refer a friend to SmartDorm and get $100 off your next rent payment.</p>
          <Button className="h-9 px-5 rounded-lg text-xs bg-amber-500 hover:bg-amber-600">Share Invite</Button>
        </div>
      </div>

      <div className="mt-10 text-center text-[11px] text-slate-300 font-bold">
        © 2023 SmartDorm Management. All rights reserved.
      </div>
    </DashboardLayout>
  );
};
