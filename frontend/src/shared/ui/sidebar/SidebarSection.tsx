import { ReactNode } from 'react';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="space-y-1 py-3 px-1">
      <h3 className="px-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400/80">
        {title}
      </h3>
      <div className="space-y-0.5 mt-2">{children}</div>
    </div>
  );
}
