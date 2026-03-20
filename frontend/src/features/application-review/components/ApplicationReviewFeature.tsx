import { useApplicationReview } from '../hooks/useApplicationReview';
import { ApplicationTable } from './ApplicationTable';
import { ApplicationDetailPanel } from './ApplicationDetailPanel';
import { Badge } from '@/shared/ui';
import { cn } from '@/shared/utils';

/**
 * ApplicationReviewFeature — The Landlord's Inbox.
 * Optimized 30/70 Split View for efficient tenant vetting.
 */
export function ApplicationReviewFeature() {
  const { 
    applications, 
    selectedApplication, 
    selectedId, 
    setSelectedId,
    statusFilter,
    setStatusFilter,
    isLoading,
    handleAction 
  } = useApplicationReview();

  return (
    <div className="flex h-[calc(100vh-theme(spacing.32))] bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* LEFT: Application List (30%) */}
      <aside className="w-80 lg:w-96 flex flex-col border-r border-slate-100 bg-slate-50/30">
        <header className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-black tracking-tight text-slate-900 uppercase">Inbox</h2>
            <Badge variant="info" className="rounded-full px-2 py-0.5 font-bold text-[10px]">
              {applications.length}
            </Badge>
          </div>
          
          {/* Status Quick Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(['ALL', 'PENDING', 'APPROVED'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all",
                  statusFilter === f 
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105" 
                    : "bg-white text-slate-400 border border-slate-100 hover:border-slate-300"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <ApplicationTable 
            applications={applications} 
            selectedId={selectedId} 
            onSelect={setSelectedId} 
          />
        </div>
      </aside>

      {/* RIGHT: Detail View (70%) */}
      <main className="flex-1 flex flex-col bg-white overflow-y-auto relative">
        {selectedApplication ? (
          <ApplicationDetailPanel 
            application={selectedApplication} 
            onAction={handleAction}
            isActionLoading={isLoading}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6 ring-8 ring-slate-50/50">
              <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-display font-black text-slate-300 uppercase tracking-tighter">Select an Application</h3>
            <p className="text-slate-400 mt-2 max-w-xs font-medium italic">Choose a prospective tenant from the list to begin the verification and approval process.</p>
          </div>
        )}
      </main>
    </div>
  );
}
