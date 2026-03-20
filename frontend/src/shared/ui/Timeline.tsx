import { cn } from '@/shared/utils';

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'CURRENT' | 'PENDING' | 'ERROR';
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function Timeline({ items, orientation = 'vertical', className }: TimelineProps) {
  return (
    <div className={cn(
      "relative",
      orientation === 'horizontal' ? "flex items-start" : "flex flex-col",
      className
    )}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCompleted = item.status === 'COMPLETED';
        const isCurrent = item.status === 'CURRENT';

        return (
          <div key={item.id} className={cn(
            "relative flex-1",
            orientation === 'horizontal' ? "min-w-[200px]" : "pb-10 last:pb-0"
          )}>
            {/* Connector Line */}
            {!isLast && (
              <div className={cn(
                "absolute",
                orientation === 'horizontal' 
                  ? "top-4 left-[calc(1rem+24px)] right-0 h-0.5" 
                  : "top-[2.5rem] left-6 bottom-0 w-0.5",
                isCompleted ? "bg-emerald-500" : "bg-slate-100"
              )} />
            )}

            <div className={cn(
              "flex gap-6",
              orientation === 'horizontal' ? "flex-col items-start px-4" : "flex-row items-start"
            )}>
              {/* Marker */}
              <div className={cn(
                "relative z-10 flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                isCompleted ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" :
                isCurrent ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-110" :
                "bg-slate-50 text-slate-300 border-2 border-slate-100"
              )}>
                 {item.icon ? item.icon : (
                    <span className="font-black text-xs">{index + 1}</span>
                 )}

                 {isCurrent && (
                   <div className="absolute inset-0 bg-slate-900 rounded-2xl animate-ping opacity-20" />
                 )}
              </div>

              {/* Content */}
              <div className={cn("space-y-1", orientation === 'horizontal' ? "mt-4" : "mt-1")}>
                <h4 className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em]",
                  isCurrent ? "text-slate-900" : isCompleted ? "text-emerald-600" : "text-slate-300"
                )}>
                  {item.title}
                </h4>
                <p className={cn(
                  "text-[11px] font-bold italic max-w-[220px]",
                  isCurrent ? "text-slate-600" : "text-slate-400"
                )}>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
