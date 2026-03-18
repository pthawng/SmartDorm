import { HOW_IT_WORKS_STEPS } from '../services/mock-data';

const ICONS: Record<string, React.ReactNode> = {
  search: (
    <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  calendar: (
    <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
  home: (
    <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
};

const STEP_COLORS = [
  'bg-primary-100 text-primary-600',
  'bg-violet-100 text-violet-600',
  'bg-emerald-100 text-emerald-600',
];

/**
 * How It Works — 3-step horizontal guide.
 */
export function HowItWorks() {
  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            How It Works
          </h2>
          <p className="mt-3 text-base text-slate-500">
            Get started in 3 simple steps.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              {/* Step number + Icon */}
              <div className="relative">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${STEP_COLORS[i]}`}>
                  {ICONS[step.icon]}
                </div>
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white shadow-sm">
                  {i + 1}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-900 font-display">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
