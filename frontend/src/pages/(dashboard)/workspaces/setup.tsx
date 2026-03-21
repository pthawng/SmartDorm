import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Progress } from '@/shared/ui/Progress';
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLandlordForm } from '../../(auth)/become-landlord/hooks/useLandlordForm';
import { PricingStep } from '../../(auth)/become-landlord/components/steps/PricingStep';
import { ReviewStep } from '../../(auth)/become-landlord/components/steps/ReviewStep';

export default function LandlordSetupPage() {
  const { 
    form,
    currentStep,
    nextStep,
    prevStep,
    isSubmitting,
    onSubmit,
  } = useLandlordForm();

  // On this dedicated page, we only handle Step 3 and 4
  const effectiveStep = Math.max(currentStep, 3);
  const progress = ((effectiveStep - 2) / 2) * 100;

  const renderStep = () => {
    switch (effectiveStep) {
      case 3: return <PricingStep form={form} />;
      case 4: return <ReviewStep form={form} />;
      default: return <PricingStep form={form} />;
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveStep === 3) {
      await nextStep();
    } else {
      await onSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 mb-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Phase 2: Property Setup</span>
             </div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Complete your Listing</h1>
             <p className="text-slate-500 max-w-md lead-relaxed">
               Your workspace is ready! Now let me help you set up the pricing and amenities for your first property.
             </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Setup Progress</div>
             <div className="flex items-center gap-4 w-48">
                <Progress value={progress} className="h-2 rounded-full bg-slate-200" />
                <span className="text-xs font-black text-sky-600 w-8 text-right">{Math.round(progress)}%</span>
             </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
              <Card className="p-0 overflow-hidden rounded-[2.5rem] border-slate-200 shadow-2xl shadow-slate-200/50 bg-white">
                <form onSubmit={handleNext} className="p-8 md:p-12">
                  <div className="min-h-[400px]">
                    {renderStep()}
                  </div>

                  {/* Footer */}
                  <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      disabled={effectiveStep === 3 || isSubmitting}
                      className="rounded-xl px-6 h-12 font-bold text-slate-400 hover:text-slate-900"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-2xl px-10 h-14 font-black shadow-xl shadow-sky-200/50 text-base"
                    >
                      {isSubmitting ? (
                        'Publishing...'
                      ) : effectiveStep === 4 ? (
                        <>
                          Publish Property
                          <CheckCircle2 className="ml-2 w-5 h-5" />
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-6">
              <Card className="p-8 rounded-[2rem] bg-indigo-600 text-white border-0 shadow-xl shadow-indigo-200/50 overflow-hidden relative">
                 <div className="relative z-10">
                   <h3 className="text-lg font-bold mb-4">Why complete this?</h3>
                   <ul className="space-y-4">
                      <li className="flex gap-3 text-sm">
                         <div className="w-5 h-5 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
                            <span className="text-[10px] font-bold">1</span>
                         </div>
                         <p className="text-indigo-100">Verified properties get <span className="text-white font-bold underline decoration-indigo-400">3x more bookings</span> on average.</p>
                      </li>
                      <li className="flex gap-3 text-sm">
                         <div className="w-5 h-5 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
                            <span className="text-[10px] font-bold">2</span>
                         </div>
                         <p className="text-indigo-100">Setting amenities helps tenants find your space faster.</p>
                      </li>
                   </ul>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              </Card>

              <div className="p-8 rounded-[2rem] border border-dashed border-slate-300">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Need help?</h4>
                 <p className="text-xs text-slate-500 leading-relaxed mb-4">
                   Our support team is available 24/7 to help you set up your first property.
                 </p>
                 <Button variant="outline" className="w-full rounded-xl h-10 text-xs font-bold border-slate-200 text-slate-600">
                    Contact Support
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
