import { Button } from '@/shared/ui/Button';
import { Progress } from '@/shared/ui/Progress';
import { useLandlordForm } from '../hooks/useLandlordForm';

// Steps components with correct casing
import { BasicInfoStep } from './steps/BasicInfoStep';
import { PropertyInfoStep } from './steps/PropertyInfoStep';
import { PricingStep } from './steps/PricingStep';
import { ReviewStep } from './steps/ReviewStep';

export function LandlordFormWizard() {
  const { 
    form,
    currentStep, 
    nextStep, 
    prevStep, 
    onSubmit, 
    isSubmitting,
  } = useLandlordForm();

  const progress = (currentStep / 4) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <BasicInfoStep form={form} />;
      case 2: return <PropertyInfoStep form={form} />;
      case 3: return <PricingStep form={form} />;
      case 4: return <ReviewStep form={form} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-[500px]">
      {/* Progress Header */}
      <div className="bg-slate-50/50 p-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Step {currentStep} of 4
          </span>
          <span className="text-xs font-bold text-sky-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-1.5 rounded-full bg-slate-200" />
      </div>

      {/* Form Content */}
      <div className="flex-1 p-8 lg:p-12 transition-all duration-300">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (currentStep < 4) {
              nextStep();
          } else {
              onSubmit(e);
          }
        }}>
          <div className="min-h-[300px]">
            {renderStep()}
          </div>

          {/* Navigation Footer */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className="rounded-xl px-8 h-12 font-bold text-slate-500 hover:text-slate-900 border-slate-200"
            >
              Back
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl px-10 h-12 font-bold shadow-lg shadow-sky-200/50"
            >
              {isSubmitting ? 'Processing...' : currentStep === 4 ? 'Confirm & Register' : 'Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
