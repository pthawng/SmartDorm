import { ApplicationReviewFeature } from '@/features/application-review';

export default function ApplicationsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="px-4 md:px-0">
        <h1 className="text-4xl font-display font-black tracking-tighter text-slate-900 uppercase">Application Inbox</h1>
        <p className="text-slate-500 font-medium mt-1">Review and manage tenant requests for your building portfolio.</p>
      </header>

      <ApplicationReviewFeature />
    </div>
  );
}
