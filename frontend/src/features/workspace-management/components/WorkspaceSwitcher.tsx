import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Plus, 
  Check, 
  Building2, 
  Loader2, 
  X
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { ROUTES } from '@/shared/config/routes';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useAuthStore } from '@/store/authStore';
import { workspaceApi } from '@/services/endpoints/workspace.api';
import { toast } from 'sonner';

interface WorkspaceSwitcherProps {
  onSwitchStart?: () => void;
  onSwitchEnd?: () => void;
}

export function WorkspaceSwitcher({ onSwitchStart, onSwitchEnd }: WorkspaceSwitcherProps) {
  const navigate = useNavigate();
  const { currentWorkspace, memberships, fetchWorkspaces } = useWorkspaceStore();
  const { switchContext } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch workspaces on mount
  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  // Autofocus input when creating
  useEffect(() => {
    if (isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating]);

  const handleSwitch = async (workspaceId: string) => {
    if (workspaceId === currentWorkspace?.id) return;
    
    setIsLoading(true);
    onSwitchStart?.();
    setIsOpen(false);

    try {
      await switchContext(workspaceId);
      toast.success('Workspace switched successfully');
    } catch (error) {
      console.error('Failed to switch workspace:', error);
      toast.error('Failed to switch workspace. Please try again.');
    } finally {
      setIsLoading(false);
      onSwitchEnd?.();
    }
  };

  const handleCreateWorkspace = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newWorkspaceName.trim() || isLoading) return;

    setIsLoading(true);
    onSwitchStart?.();
    
    try {
      const { data } = await workspaceApi.create({ name: newWorkspaceName.trim() });
      const newWorkspace = data.data;
      
      // 1. Refresh list
      await fetchWorkspaces();
      
      // 2. Immediate switch
      await switchContext(newWorkspace.id);
      
      toast.success('Workspace created and switched!');
      setIsCreating(false);
      setNewWorkspaceName('');
      setIsOpen(false);

      navigate(`${ROUTES.DASHBOARD.HOME}?new=true`);
    } catch (error) {
      console.error('Failed to create workspace:', error);
      toast.error('Failed to create workspace. Please try again.');
    } finally {
      setIsLoading(false);
      onSwitchEnd?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateWorkspace();
    if (e.key === 'Escape') {
      setIsCreating(false);
      setNewWorkspaceName('');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-200",
          "hover:bg-slate-100/80 active:scale-95 border border-transparent",
          isOpen ? "bg-slate-100 border-slate-200 shadow-sm" : ""
        )}
      >
        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-white/10 shrink-0">
          <Building2 size={18} />
        </div>
        <div className="flex flex-col items-start min-w-0 pr-1">
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
            {currentWorkspace?.name || 'Select Workspace'}
          </span>
          <span className="text-[10px] text-slate-500 font-medium leading-tight">Landlord</span>
        </div>
        <ChevronDown 
          size={14} 
          className={cn("text-slate-400 transition-transform duration-200", isOpen ? "rotate-180" : "")} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200 ease-out fill-mode-forwards">
          <div className="px-2 py-1.5 mb-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Workspaces</h3>
          </div>

          <div className="space-y-0.5 max-h-[300px] overflow-y-auto custom-scrollbar">
            {memberships.map((m) => {
              const wsId = m.workspace_id;
              const wsName = m.workspace?.name || 'Workspace';
              const isActive = wsId === currentWorkspace?.id;
              
              return (
                <button
                  key={wsId}
                  onClick={() => handleSwitch(wsId)}
                  disabled={isLoading || isActive}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all group",
                    isActive 
                      ? "bg-slate-50 text-indigo-600 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(79,70,229,0.1)]" 
                      : "hover:bg-slate-50 text-slate-700 active:bg-slate-100 border border-transparent"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-colors shadow-sm",
                    isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  )}>
                    <Building2 size={16} />
                  </div>
                  <span className="flex-1 text-sm font-medium truncate">{wsName}</span>
                  {isActive && <Check size={14} className="text-indigo-600" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100">
            {isCreating ? (
              <div className="px-1 py-1 animate-in fade-in slide-in-from-bottom-1 duration-200">
                <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200 ring-4 ring-slate-50 focus-within:ring-indigo-50 focus-within:border-indigo-200 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Workspace name..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-1 placeholder:text-slate-400"
                    disabled={isLoading}
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCreateWorkspace}
                      disabled={!newWorkspaceName.trim() || isLoading}
                      className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all shadow-sm"
                    >
                      {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    </button>
                    <button
                      onClick={() => { setIsCreating(false); setNewWorkspaceName(''); }}
                      className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-slate-50 text-slate-500 transition-all group"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors shadow-sm border border-dashed border-slate-300">
                  <Plus size={16} />
                </div>
                <span className="text-sm font-medium">Create New Workspace</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
