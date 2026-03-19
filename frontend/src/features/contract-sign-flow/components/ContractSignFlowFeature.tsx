import { Button } from '@/shared/ui';
import { Stepper } from './Stepper';
import { ContractFormStep } from './ContractFormStep';
import { RenterInfoStep } from './RenterInfoStep';
import { ReviewStep } from './ReviewStep';
import { useContractSignFlow } from '../hooks/useContractSignFlow';

export function ContractSignFlowFeature() {
  const {
    currentStep,
    steps,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    form,
    onSubmit,
    isSubmitting,
  } = useContractSignFlow();

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard this application? All progress will be lost.')) {
      window.history.back();
    }
  };

  const renderStep = () => {
    switch (currentStep!.id) {
      case 'contract':
        return <ContractFormStep form={form} />;
      case 'renter':
        return <RenterInfoStep form={form} />;
      case 'review':
        return <ReviewStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      <div className="space-y-4">
        <Stepper steps={steps} currentStepIndex={currentStepIndex} onStepClick={goToStep} />
        
        {/* Discrete Progress Bar */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Progress</span>
            <span className="text-xs font-black text-primary-600">{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-700 ease-out shadow-sm shadow-primary-200"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="min-h-[480px] transition-all duration-500">
        <div key={currentStep!.id} className="animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both">
          {renderStep()}
        </div>
      </main>

      <footer className="pt-8 border-t border-slate-100 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={isFirstStep || isSubmitting}
          className="px-8 shadow-sm"
        >
          Back
        </Button>

        <div className="flex gap-4">
          {isLastStep ? (
            <Button
              variant="primary"
              onClick={onSubmit}
              isLoading={isSubmitting}
              className="px-10 shadow-lg shadow-primary-200"
            >
              Submit & Sign Contract
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={nextStep}
              className="px-10 shadow-lg shadow-primary-200 group"
            >
              Next Step
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
