import { Button } from '@/shared/ui';

/**
 * CTA Section — dark background call-to-action.
 */
export function CTASection() {
  return (
    <section className="bg-slate-900 px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to find your new home?
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Join thousands of tenants who found their perfect room through SmartDorm.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="gap-2 rounded-xl px-8">
            Get Started
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl border-slate-600 px-8 text-slate-300 hover:bg-slate-800 hover:text-white">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
