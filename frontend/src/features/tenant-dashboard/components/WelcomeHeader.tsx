interface WelcomeHeaderProps {
  name: string;
}

export function WelcomeHeader({ name }: WelcomeHeaderProps) {
  return (
    <div className="space-y-1 animate-in fade-in slide-in-from-top-6 duration-1000">
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
        Welcome home, <span className="text-primary-600">{name}</span>
      </h1>
      <p className="text-slate-400 font-bold uppercase tracking-[0.25em] text-[10px]">
        SmartDorm District 1 • Active Session
      </p>
    </div>
  );
}
