interface WelcomeHeaderProps {
  name: string;
}

export function WelcomeHeader({ name }: WelcomeHeaderProps) {
  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-top-6 duration-1000">
      <div className="flex items-center gap-3">
         <span className="h-px w-8 bg-primary-500/30" />
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-600">Active Tenant Session</span>
      </div>
      <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight drop-shadow-sm">
        Welcome home, <br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">{name}</span>
      </h1>
      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] pl-1">
        Personalized Experience Dashboard
      </p>
    </div>
  );
}
