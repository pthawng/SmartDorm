import { RoomForm } from '@/features/room-management/components/RoomForm';
import { useParams } from 'react-router-dom';

/**
 * THIN PAGE — Room Editor
 * Displays the room form for editing or creating.
 * Handles the URL params to pass the ID to the feature component.
 */
export default function RoomEditPage() {
  const { id } = useParams<{ id: string }>();
  
  // If we are on an edit route but no ID, this shouldn't happen normally, 
  // but we handle it just in case.
  if (!id) {
    return (
      <div className="flex justify-center items-center h-full p-12 text-slate-500">
        Room ID is missing
      </div>
    );
  }

  return <RoomForm roomId={id} />;
}
