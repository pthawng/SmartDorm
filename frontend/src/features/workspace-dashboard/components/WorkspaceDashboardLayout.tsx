import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { ErrorState } from '@/shared/ui';
import { DashboardSkeleton } from '@/shared/ui/skeleton/DashboardSkeleton';
import { useWorkspaceStore } from '@/store/workspaceStore';

import { WorkspaceHeader } from './WorkspaceHeader';
import { EmptyStateCard } from './EmptyStateCard';
import { OnboardingChecklist } from './OnboardingChecklist';
import { PropertyCard } from './PropertyCard';
import { DashboardStats } from './DashboardStats';

import { useDashboardOverview } from '@/features/dashboard-overview/hooks';
import { useProperties } from '../hooks/useProperties';

export function WorkspaceDashboardLayout() {
  const navigate = useNavigate();
  const { id: routeWorkspaceId } = useParams<{ id: string }>();
  const { currentWorkspace } = useWorkspaceStore();
  
  // URL priority: Prevents bugs when localStorage has stale 'ws-1' dummy data
  const targetWorkspaceId = routeWorkspaceId || currentWorkspace?.id;

  // Seamless UX: If the user hit /dashboard but hasn't selected a workspace, route them to the switcher
  if (!targetWorkspaceId) {
    return <Navigate to={ROUTES.DASHBOARD.WORKSPACES} replace />;
  }

  const { 
    data: overviewData, 
    isLoading: isLoadingOverview, 
    isError: isErrorOverview, 
    refetch: refetchOverview 
  } = useDashboardOverview(targetWorkspaceId);

  const {
    data: properties,
    isLoading: isLoadingProperties,
    isError: isErrorProperties,
    refetch: refetchProperties
  } = useProperties(targetWorkspaceId);

  const isLoading = isLoadingOverview || isLoadingProperties;
  const isError = isErrorOverview || isErrorProperties;

  const handleRetry = () => {
    refetchOverview();
    refetchProperties();
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !overviewData || !properties) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Failed to load workspace"
          description="We couldn't fetch the latest data for your portfolio. Please try again."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // 3-Tier State Engine Integration
  const hasProperty = properties.length > 0;
  const hasRoom = overviewData.stats.totalRooms > 0;
  
  const isEmpty = !hasProperty;
  const isOnboarding = hasProperty && !hasRoom;
  const isReady = hasProperty && hasRoom;

  // Derive dynamic onboarding state from properties if in onboarding mode
  const hasImage = properties.some(p => !!p.thumbnailUrl);
  const isPublished = properties.some(p => p.status === 'published');

  const handleAddProperty = () => navigate(ROUTES.DASHBOARD.PROPERTY_NEW);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <WorkspaceHeader />

      {isEmpty && (
        <EmptyStateCard 
          onAddProperty={handleAddProperty}
          onImportData={() => console.log('Import Info')}
          onInviteTeam={() => navigate(ROUTES.DASHBOARD.SETTINGS_TEAM)}
        />
      )}

      {isOnboarding && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span className="font-semibold text-amber-900">Complete your first property to start renting</span>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
               {properties.map(p => (
                 <PropertyCard 
                   key={p.id} 
                   property={p} 
                   onAction={(a) => console.log('Action:', a)} 
                 />
               ))}
               
               {/* New Property Slot */}
               <div 
                 onClick={handleAddProperty}
                 className="h-full min-h-[16rem] rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-slate-50 transition-colors cursor-pointer"
               >
                 <span className="text-4xl mb-2">+</span>
                 <span className="font-semibold">Add Property</span>
               </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <OnboardingChecklist 
              state={{ hasProperty, hasRoom, hasImage, isPublished }} 
              className="sticky top-6"
            />
          </div>
        </div>
      )}

      {isReady && (
        <div className="space-y-8">
           <DashboardStats data={{
             totalProperties: properties.length,
             totalRooms: overviewData.stats.totalRooms,
             occupancyRate: overviewData.stats.occupancyRate,
             monthlyRevenue: overviewData.stats.totalRevenue
           }} />
           
           <div>
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold font-display text-slate-900">Your Properties</h2>
               <button 
                 onClick={handleAddProperty}
                 className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
               >
                 + Add Property
               </button>
             </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {properties.map(p => (
                 <PropertyCard 
                   key={p.id} 
                   property={p} 
                   onAction={(a) => console.log('Action:', a)} 
                 />
               ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
