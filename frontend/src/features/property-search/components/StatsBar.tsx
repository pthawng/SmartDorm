import { STATS } from '../services/mock-data';

/**
 * Stats Bar — horizontal glassmorphism strip showing key platform numbers.
 */
export function StatsBar() {
  return (
    <section className="-mt-8 relative z-10 mx-auto max-w-5xl px-6">
      <div className="glass rounded-2xl shadow-premium">
        <div className="grid grid-cols-2 divide-slate-200/50 sm:grid-cols-4 sm:divide-x">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center gap-1 px-6 py-6">
              <span className="text-2xl font-bold text-primary-700 font-display lg:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
