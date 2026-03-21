import { Badge, Card } from '@/shared/ui';
import type { SelectionRoom } from '../types';

const MOCK_ROOMS: SelectionRoom[] = [
  { id: 'room-101', number: '101', type: 'Studio', price: 4500000, status: 'AVAILABLE' },
  { id: 'room-102', number: '102', type: 'Studio', price: 4500000, status: 'AVAILABLE' },
  { id: 'room-201', number: '201', type: '1-Bedroom', price: 5500000, status: 'AVAILABLE' },
  { id: 'room-202', number: '202', type: '1-Bedroom', price: 5500000, status: 'AVAILABLE' },
  { id: 'room-301', number: '301', type: 'Penthouse', price: 8500000, status: 'AVAILABLE' },
];

interface RoomSelectorProps {
  onSelect: (room: SelectionRoom) => void;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function RoomSelector({ onSelect }: RoomSelectorProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tighter">Inventory Selection</h3>
        <p className="text-slate-500 font-medium">Choose an available room to begin the lease issuance protocol.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ROOMS.map(room => (
          <button 
            key={room.id}
            onClick={() => onSelect(room)}
            className="text-left group transition-all active:scale-[0.98]"
          >
            <Card className="p-6 border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100 transition-all flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-emerald-600 transition-colors">
                  <span className="font-black text-xs uppercase">{room.number}</span>
                </div>
                <Badge variant="success" className="rounded-full px-2 py-0.5 font-bold text-[9px] uppercase tracking-widest bg-emerald-50 text-emerald-600 border-none">
                  {room.status}
                </Badge>
              </div>
              
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{room.type}</p>
                <p className="text-xl font-black text-slate-900 tabular-nums">
                  {vndFormatter.format(room.price)}
                  <span className="text-[10px] text-slate-400 font-bold lowercase ml-1">/mo</span>
                </p>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
