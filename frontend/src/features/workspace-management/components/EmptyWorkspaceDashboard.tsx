import { Building2, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui';

interface EmptyWorkspaceDashboardProps {
  isJustCreated?: boolean;
  onAddProperty?: () => void;
}

export function EmptyWorkspaceDashboard({ 
  isJustCreated = false, 
  onAddProperty 
}: EmptyWorkspaceDashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-in fade-in zoom-in-95 duration-700 ease-out">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="relative h-48 w-48 bg-white rounded-full shadow-2xl shadow-indigo-100 flex items-center justify-center border border-slate-50">
          <Building2 size={80} className="text-indigo-600/20 absolute" />
          <Sparkles size={40} className="text-amber-400 absolute -top-2 -right-2 animate-bounce transition-all duration-1000" />
          <div className="h- w-32 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 shadow-inner">
             <Plus size={48} />
          </div>
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">
          {isJustCreated ? "Your workspace is ready 🎉" : "No properties yet"}
        </h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          {isJustCreated 
            ? "Workspace created successfully! Start by adding your first property to begin managing your rental business." 
            : "This workspace is currently empty. Add your first property to start tracking contracts and occupancy."}
        </p>
      </div>

      <div className="mt-10">
        <Button 
          variant="primary"
          size="lg" 
          onClick={onAddProperty}
          className="px-8 py-6 text-lg font-bold rounded-2xl shadow-xl shadow-indigo-200/50 hover:shadow-2xl transition-all"
        >
          <Plus className="mr-2" size={20} />
          Add Your First Property
        </Button>
      </div>
    </div>
  );
}
