import { Card, ErrorState, Skeleton } from '@/shared/ui';
import { useRoomEditor } from '../hooks/useRoomEditor';
import { RoomFormFields } from './RoomFormFields';
import { SubmitButton } from './SubmitButton';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';

interface RoomFormProps {
  roomId: string;
}

export function RoomForm({ roomId }: RoomFormProps) {
  const navigate = useNavigate();
  const { form, onSubmit, isLoading, isError, isSubmitting } = useRoomEditor(roomId);

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <ErrorState 
          title="Room Not Found" 
          description="We couldn't load the details for this room. It may have been deleted." 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900">
          Edit Room
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Update the details, pricing, and availability of this room.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex justify-end pt-6 mt-8 border-t border-slate-100">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <RoomFormFields form={form} />
            <SubmitButton 
              isSubmitting={isSubmitting} 
              isValid={form.formState.isValid}
              onCancel={() => navigate(ROUTES.DASHBOARD.ROOMS)}
            />
          </form>
        )}
      </Card>
    </div>
  );
}
