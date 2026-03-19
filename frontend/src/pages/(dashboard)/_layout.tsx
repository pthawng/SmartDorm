import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  // Authentication bypassed temporarily for UI testing
  return (
    <div className="flex-1 w-full animate-in fade-in duration-500">
      <Outlet />
    </div>
  );
}

export default DashboardLayout;
