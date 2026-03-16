import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/landing/ui/LandingPage';

// Placeholder Pages
const LoginPage = () => <div className="p-8"><h1>Login</h1></div>;
const LandlordDashboard = () => <div className="p-8"><h1>Landlord Dashboard</h1></div>;
const TenantDashboard = () => <div className="p-8"><h1>Tenant Dashboard</h1></div>;
const PropertyList = () => <div className="p-8"><h1>Property Management</h1></div>;
const ContractList = () => <div className="p-8"><h1>Contract Management</h1></div>;
const MaintenanceBoard = () => <div className="p-8"><h1>Maintenance Requests</h1></div>;

import ComponentShowcase from '../pages/ComponentShowcase';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/showcase" element={<ComponentShowcase />} />
      
      {/* Landlord Routes */}
      <Route path="/admin" element={<LandlordDashboard />} />
      <Route path="/admin/properties" element={<PropertyList />} />
      <Route path="/admin/contracts" element={<ContractList />} />
      <Route path="/admin/maintenance" element={<MaintenanceBoard />} />

      {/* Tenant Routes */}
      <Route path="/dashboard" element={<TenantDashboard />} />
    </Routes>
  );
};
