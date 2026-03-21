import { Building2, Plus, Sparkles, Upload, Users2, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui';

interface EmptyStateCardProps {
  onAddProperty: () => void;
  onInviteTeam?: () => void;
  onImportData?: () => void;
}

export function EmptyStateCard({ 
  onAddProperty,
  onInviteTeam,
  onImportData
}: EmptyStateCardProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6 animate-in fade-in zoom-in-95 duration-700 ease-out bg-white rounded-3xl shadow-sm border border-slate-100">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="relative h-48 w-48 bg-slate-50 rounded-full shadow-2xl shadow-indigo-100/50 flex items-center justify-center border border-white">
          <Building2 size={80} className="text-indigo-600/20 absolute" />
          <Sparkles size={40} className="text-amber-400 absolute -top-2 -right-2 animate-bounce transition-all duration-1000" />
          <div className="h-32 w-32 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-inner">
             <Plus size={48} />
          </div>
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight">
          Welcome to your workspace
        </h2>
        <p className="text-slate-500 font-medium leading-relaxed text-lg">
          You don't have any properties yet. 
          Start by creating your first property to begin your journey.
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-6">
        <Button 
          variant="primary"
          size="lg" 
          onClick={onAddProperty}
          className="px-10 py-7 text-xl font-bold rounded-2xl shadow-xl shadow-indigo-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white border-none"
        >
          <Plus className="mr-2" size={24} />
          Create Property
        </Button>

        <div className="flex items-center gap-8 pt-4">
          <button 
            type="button"
            onClick={onImportData}
            className="flex items-center gap-2 text-slate-600 font-semibold hover:text-indigo-600 transition-colors group"
          >
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
              <Upload size={18} />
            </div>
            <span>Import data</span>
          </button>
          
          <button 
            type="button"
            onClick={onInviteTeam}
            className="flex items-center gap-2 text-slate-600 font-semibold hover:text-indigo-600 transition-colors group"
          >
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
              <Users2 size={18} />
            </div>
            <span>Invite team</span>
            <ArrowRight size={14} className="ml-1 opacity-50 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
