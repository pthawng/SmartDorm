import { cn } from '@/shared/utils/cn';
import { StepConfig } from '../types';

interface StepperProps {
  steps: StepConfig[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
}

export function Stepper({ steps, currentStepIndex, onStepClick }: StepperProps) {
  return (
    <div className="relative flex justify-between w-full max-w-2xl mx-auto mb-12">
      {/* Background Line */}
      <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-10" />
      
      {/* Progress Line */}
      <div 
        className="absolute top-5 left-0 h-0.5 bg-primary-500 transition-all duration-300 -z-10" 
        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        const isClickable = index < currentStepIndex; // Only allow jumping back
        
        return (
          <button 
            key={step.id} 
            type="button"
            onClick={() => isClickable && onStepClick?.(index)}
            disabled={!isClickable}
            className={cn(
              "flex flex-col items-center group transition-all",
              isClickable ? "cursor-pointer" : "cursor-default"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 bg-white",
              isActive ? "border-primary-500 text-primary-600 shadow-lg shadow-primary-100 scale-110" : 
              isCompleted ? "border-primary-500 bg-primary-500 text-white group-hover:bg-primary-600 group-hover:border-primary-600" : 
              "border-slate-200 text-slate-400"
            )}>
              {isCompleted ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={cn(
              "mt-3 text-xs font-bold uppercase tracking-wider transition-colors",
              isActive ? "text-primary-600" : isCompleted ? "text-slate-900 group-hover:text-primary-600" : "text-slate-400"
            )}>
              {step.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
