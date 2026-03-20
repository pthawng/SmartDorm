import { useRef } from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Sparkles, Home, ShieldCheck, PieChart, Users, ArrowRight } from 'lucide-react';
import { LandlordFormWizard } from './components/LandlordFormWizard';

export default function BecomeLandlordPage() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    { icon: PieChart, title: "Passive Income", desc: "Earn up to 20% more than traditional renting with our dynamic pricing." },
    { icon: ShieldCheck, title: "Secure Payments", desc: "We guarantee on-time payments through our smart escrow system." },
    { icon: Home, title: "Full Control", desc: "Manage your property details, availability, and house rules anytime." },
    { icon: Users, title: "Verified Community", desc: "Every tenant is background checked and verified for your peace of mind." }
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] selection:bg-sky-100 selection:text-sky-900">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left transition-all duration-700 ease-in-out">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 mb-8">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-sky-700">Host your first room</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
                Earn money by <br />
                <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent italic">renting your space</span>
              </h1>
              
              <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Join 10,000+ verified landlords on SmartDorm and turn your empty rooms into consistent passive income. We handle the paperwork, you handle the keys.
              </p>
              
              <div>
                <Button 
                  onClick={scrollToForm}
                  size="lg" 
                  className="rounded-2xl px-10 h-16 text-lg font-bold shadow-xl shadow-sky-200/50 hover:shadow-sky-300/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Hosting Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative transition-all duration-700 delay-300">
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <img 
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Modern Apartment" 
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -inset-4 bg-sky-100 blur-3xl opacity-30 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Why host on SmartDorm?</h2>
            <div className="h-1.5 w-20 bg-sky-500 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-sky-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 text-sky-600 shadow-sm group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Onboarding Form Section */}
      <section ref={formRef} className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Setup your workspace</h2>
            <p className="text-slate-500">Just a few steps to start your landlord journey.</p>
          </div>
          
          <Card className="p-0 overflow-hidden rounded-[2rem] border-slate-200 shadow-2xl shadow-slate-300/50">
             <LandlordFormWizard />
          </Card>
        </div>
      </section>

      {/* 4. Trust Section */}
      <section className="py-24 border-t border-slate-100 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-slate-400">
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-6 h-6 text-sky-500" />
               <span className="font-bold text-slate-900">10k+ Verified Hosts</span>
            </div>
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-6 h-6 text-sky-500" />
               <span className="font-bold text-slate-900">Secure AES-256 Payments</span>
            </div>
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-6 h-6 text-sky-500" />
               <span className="font-bold text-slate-900">24/7 Support</span>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-sky-100/30 blur-[100px] rounded-full" />
      </section>
    </div>
  );
}
