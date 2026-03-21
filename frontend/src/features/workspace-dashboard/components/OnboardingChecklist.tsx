import { CheckCircle2, Circle } from 'lucide-react';
import { ProgressBar } from '@/shared/ui/progress/ProgressBar';
import { Card } from '@/shared/ui/Card';
import { cn } from '@/shared/utils';

export interface OnboardingState {
  hasProperty: boolean;
  hasRoom: boolean;
  hasImage: boolean;
  isPublished: boolean;
}

interface OnboardingChecklistProps {
  state: OnboardingState;
  className?: string;
}

export function OnboardingChecklist({ state, className }: OnboardingChecklistProps) {
  const steps = [
    { id: 'property', label: 'Create your first property', isComplete: state.hasProperty },
    { id: 'room', label: 'Add at least 1 room', isComplete: state.hasRoom },
    { id: 'image', label: 'Upload property images', isComplete: state.hasImage },
    { id: 'publish', label: 'Publish your listing', isComplete: state.isPublished },
  ];

  const completedCount = steps.filter(s => s.isComplete).length;
  const progressPercentage = Math.round((completedCount / steps.length) * 100);

  return (
    <Card className={cn("p-6 border-slate-200 bg-white rounded-3xl shadow-sm", className)}>
      <h3 className="text-lg font-bold font-display text-slate-900 mb-2">Setup Guide</h3>
      <p className="text-sm text-slate-500 font-medium mb-6 flex items-center justify-between">
        <span>{progressPercentage}% complete</span>
        <span className="text-slate-400">{completedCount} of {steps.length} steps</span>
      </p>

      <ProgressBar 
        value={progressPercentage} 
        className="h-2 mb-8 bg-slate-100" 
        indicatorClassName="bg-emerald-500" 
      />

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isNextAction = !step.isComplete && (index === 0 || steps[index - 1]?.isComplete);
          
          return (
            <div 
              key={step.id} 
              className={cn(
                "flex items-center gap-3 transition-colors duration-300",
                step.isComplete ? "text-emerald-700" : isNextAction ? "text-slate-900" : "text-slate-400"
              )}
            >
              {step.isComplete ? (
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
              ) : (
                <Circle size={20} className={cn(
                  "shrink-0",
                  isNextAction ? "text-indigo-400 stroke-2" : "text-slate-300"
                )} />
              )}
              <span className={cn(
                "text-sm font-semibold",
                step.isComplete && "line-through opacity-70"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
