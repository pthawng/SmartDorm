import React from 'react';
import { Card } from '@/shared/ui';
import { CheckCircle2, MessageSquare, CalendarDays, ArrowRight } from 'lucide-react';

const Community = () => {
  return (
    <section className="py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left: Testimonial Cards */}
          <div className="relative space-y-8">
            <Card className="max-w-md p-6 rounded-3xl shadow-premium border-l-4 border-l-primary-500 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-start gap-4">
                    <img src="https://i.pravatar.cc/150?u=sarah" className="w-12 h-12 rounded-full object-cover" alt="Sarah" />
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <h4 className="font-black text-slate-900 leading-none">Sarah Jenkins</h4>
                            <span className="text-[10px] font-bold text-slate-400">@sarah_j • 2h ago</span>
                        </div>
                        <p className="mt-3 text-slate-600 font-medium leading-relaxed">
                            Looking for a roommate at Teal Garden Studios! Anyone interested? I'm a quiet grad student. 🏡
                        </p>
                        <div className="mt-4 flex gap-4 text-slate-400">
                            <span className="text-[10px] font-bold flex items-center gap-1"><MessageSquare size={12}/> 12 Replies</span>
                            <span className="text-[10px] font-bold flex items-center gap-1">❤️ 24</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="max-w-md p-6 rounded-3xl shadow-premium border-l-4 border-l-emerald-500 translate-x-12 lg:translate-x-24 rotate-1 hover:rotate-0 transition-transform duration-500 backdrop-blur-sm bg-white/90">
                <div className="flex items-start gap-4">
                    <img src="https://i.pravatar.cc/150?u=marcus" className="w-12 h-12 rounded-full object-cover" alt="Marcus" />
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <h4 className="font-black text-slate-900 leading-none">Marcus King</h4>
                            <span className="text-[10px] font-bold text-slate-400">@mking_art • 5h ago</span>
                        </div>
                        <p className="mt-3 text-slate-600 font-medium leading-relaxed">
                            Best coffee spots near Cambridge campus? Just moved in yesterday! ☕️
                        </p>
                        <div className="mt-4 flex gap-4 text-slate-400">
                            <span className="text-[10px] font-bold flex items-center gap-1"><MessageSquare size={12}/> 8 Replies</span>
                            <span className="text-[10px] font-bold flex items-center gap-1">❤️ 15</span>
                        </div>
                    </div>
                </div>
            </Card>
          </div>

          {/* Right: Text Content */}
          <div className="space-y-10">
            <div className="space-y-4">
                <h2 className="text-5xl font-black text-slate-950 tracking-tightest leading-tight">
                    Join the student community
                </h2>
                <p className="max-w-lg text-lg text-slate-500 font-medium leading-relaxed">
                    Connect with potential roommates, share tips about local areas, and find events near your new home. SmartDorm is more than just housing.
                </p>
            </div>

            <div className="space-y-6">
                {[
                    { icon: CheckCircle2, text: "Verified student profiles", color: "text-primary-500", bg: "bg-primary-50" },
                    { icon: MessageSquare, text: "Interactive forum & Q&A", color: "text-indigo-500", bg: "bg-indigo-50" },
                    { icon: CalendarDays, text: "Campus event marketplace", color: "text-violet-500", bg: "bg-violet-50" }
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                        <div className={`p-3 rounded-2xl ${item.bg} ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                            <item.icon size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-lg font-black text-slate-800 tracking-tight">{item.text}</span>
                    </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Community;
