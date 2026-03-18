interface RoomInfoProps {
  floor: number;
  areaSqm: number;
  description: string | null;
  amenities: string[];
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Queen Bed': (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.027-.396.05-.6.075m-.6-1.5c-.201.026-.402.049-.6.069m1.2-1.5c-.202.025-.403.048-.6.065m2.4 11.25V18.75m-18 0v2.25m1.5-16.5c1.085-.144 1.872-1.086 1.872-2.18v-1.125a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.125c0 1.094.787 2.036 1.872 2.18a48.114 48.114 0 0 0 3.413.387m-4.5 8.006c.194.027.396.05.6.075m.6-1.5c.201.026.402.049.6.069m-1.2-1.5c.202.025.403.048.6.065" />
    </svg>
  ),
  'Desk & Chair': (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  ),
  'Air Conditioning': (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
    </svg>
  ),
  'Large Window': (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 4.5 16.5-1.5a.75.75 0 0 1 .838.805l-1.5 15.75a.75.75 0 0 1-.838.675l-16.5-1.5a.75.75 0 0 1-.605-.826l1.5-12.75A.75.75 0 0 1 3.75 4.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15M3.75 12h16.5" />
    </svg>
  ),
  'Private Bathroom': (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-1.5 10.5a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3l-1.5-10.5m15 0V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v2.25m15 0h-15" />
    </svg>
  ),
  'Wardrobe': (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18M15 3v18M3 5.25v13.5a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18.75V5.25a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 5.25Z" />
    </svg>
  ),
};

function DefaultAmenityIcon() {
  return (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

/**
 * RoomInfo — description, basic specs, and amenities grid.
 */
export function RoomInfo({ floor, areaSqm, description, amenities }: RoomInfoProps) {
  return (
    <div className="space-y-8 mt-6">
      <div className="flex gap-6 border-y border-slate-200 py-4 text-slate-600">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="font-medium">Floor {floor}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25v6a2.25 2.25 0 01-2.25 2.25h-13.5A2.25 2.25 0 014.5 19.5" />
          </svg>
          <span className="font-medium">{areaSqm}m² Area</span>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold text-slate-900">About this room</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {description ?? 'No description available for this room.'}
        </p>
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold text-slate-900">Room Amenities</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {amenities.map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50/80"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                {AMENITY_ICONS[amenity] ?? <DefaultAmenityIcon />}
              </div>
              <span className="text-sm font-medium text-slate-700">{amenity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
