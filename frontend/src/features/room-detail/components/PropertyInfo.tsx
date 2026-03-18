import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';

interface PropertyInfoProps {
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
}

/**
 * PropertyInfo — small link block to jump back to the property.
 */
export function PropertyInfo({ propertyId, propertyName, propertyAddress }: PropertyInfoProps) {
  return (
    <div className="mt-8 rounded-2xl border border-primary-100 bg-primary-50/50 p-5">
      <h3 className="font-display text-sm font-semibold text-slate-900">Located in</h3>
      <div className="mt-3 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm border border-primary-100">
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-slate-900">{propertyName}</p>
          <p className="text-sm text-slate-500 line-clamp-1">{propertyAddress}</p>
          <Link 
            to={ROUTES.PROPERTY_DETAIL(propertyId)}
            className="mt-1 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            View Property Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
