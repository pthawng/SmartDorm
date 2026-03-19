import { Card, Badge } from '@/shared/ui';

interface RoomInfoProps {
  roomId: string;
  propertyName?: string;
}

export function RoomInfo({ roomId, propertyName = 'SmartDorm Premium' }: RoomInfoProps) {
  return (
    <Card className="p-6 border-slate-200 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
         <span className="text-6xl font-black">{roomId.split('-').pop()}</span>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-3 text-slate-400">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
           </svg>
           <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{propertyName}</span>
        </div>

        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Inventory {roomId.toUpperCase()}</h3>
          <p className="text-slate-500 text-sm italic mt-1 font-medium">Verified accommodation unit fully prepared for occupancy.</p>
        </div>

        <div className="flex gap-4 pt-2">
           <Badge variant="outline" className="text-[10px] font-black bg-white">SECURED ACCESS</Badge>
           <Badge variant="outline" className="text-[10px] font-black bg-white">INSPECTED</Badge>
        </div>
      </div>
    </Card>
  );
}
