import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/landing/ui/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import CommunityPage from '../pages/community/CommunityPage';
import ExplorePage from '../pages/explore/ExplorePage';
import LandlordDashboardPage from '../pages/admin/LandlordDashboardPage';
import TenantDashboardPage from '../pages/dashboard/TenantDashboardPage';
import PropertyDetailPage from '../pages/property/PropertyDetailPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/property/:id" element={<PropertyDetailPage />} />

      {/* Landlord Routes */}
      <Route path="/landlord" element={<LandlordDashboardPage />} />
      <Route path="/landlord/*" element={<LandlordDashboardPage />} />

      {/* Tenant Routes */}
      <Route path="/tenant" element={<TenantDashboardPage />} />
      <Route path="/tenant/*" element={<TenantDashboardPage />} />
    </Routes>
  );
};
