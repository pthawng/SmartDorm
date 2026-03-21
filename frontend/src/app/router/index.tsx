/**
 * Application Router — central route definition.
 * Uses React Router v6+ with lazy-loading for code splitting.
 */

import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import { GuestRoute } from '@/shared/ui/guest-route';
import { ProtectedRoute } from '@/shared/ui/protected-route';

// ── Layouts ──────────────────────────────────────────────────
const RootLayout      = lazy(() => import('@/app/layout/root-layout').then(m => ({ default: m.RootLayout })));
const MarketingLayout = lazy(() => import('@/pages/(marketing)/_layout'));
const DashboardLayout = lazy(() => import('@/pages/(dashboard)/_layout'));

// ── Marketing Pages ──────────────────────────────────────────
const LandingPage     = lazy(() => import('@/pages/(marketing)/landing'));
const SearchPage      = lazy(() => import('@/pages/(marketing)/search'));
const PropertyDetail  = lazy(() => import('@/pages/(marketing)/property-detail'));
const RoomDetail      = lazy(() => import('@/pages/(marketing)/room-detail'));

// ── Auth Pages ───────────────────────────────────────────────
const LoginPage       = lazy(() => import('@/pages/(auth)/login'));
const RegisterPage    = lazy(() => import('@/pages/(auth)/register'));
const BecomeLandlordPage = lazy(() => import('@/pages/(auth)/become-landlord'));

// ── Dashboard Pages ──────────────────────────────────────────
const DashboardHome       = lazy(() => import('@/pages/(dashboard)/home'));
const TenantHome          = lazy(() => import('@/pages/(dashboard)/tenant-home'));
const WorkspacesPage      = lazy(() => import('@/pages/(dashboard)/workspaces'));
const LandlordSetupPage = lazy(() => import('@/pages/(dashboard)/workspaces/setup'));
const PropertyListPage    = lazy(() => import('@/pages/(dashboard)/properties/list'));
const RoomListPage        = lazy(() => import('@/pages/(dashboard)/rooms/list'));
const RoomEditPage        = lazy(() => import('@/pages/(dashboard)/rooms/edit'));
const ContractListPage    = lazy(() => import('@/pages/(dashboard)/contracts/list'));
const ContractApplyPage   = lazy(() => import('@/pages/(dashboard)/contracts/apply'));
const ContractCreatePage  = lazy(() => import('@/pages/(dashboard)/contracts/create'));
const PayDepositPage     = lazy(() => import('@/pages/(dashboard)/contracts/pay-deposit'));
const ContractConfirmPage = lazy(() => import('@/pages/(dashboard)/contracts/confirm'));
const ContractReviewPage  = lazy(() => import('@/pages/(dashboard)/contracts/review'));
const InvoiceListPage     = lazy(() => import('@/pages/(dashboard)/invoices/list'));
const InvoiceDetailPage   = lazy(() => import('@/pages/(dashboard)/invoices/detail.tsx'));
const InvoicePayPage      = lazy(() => import('@/pages/(dashboard)/invoices/pay.tsx'));
const MaintenanceListPage   = lazy(() => import('@/pages/(dashboard)/maintenance/list'));
const MaintenanceNewPage    = lazy(() => import('@/pages/(dashboard)/maintenance/new'));
const MaintenanceDetailPage = lazy(() => import('@/pages/(dashboard)/maintenance/detail'));
const SettingsProfilePage   = lazy(() => import('@/pages/(dashboard)/settings/profile'));
const SettingsWorkspacePage = lazy(() => import('@/pages/(dashboard)/settings/workspace'));
const SettingsTeamPage      = lazy(() => import('@/pages/(dashboard)/settings/team'));
const RenterListPage    = lazy(() => import('@/pages/(dashboard)/renters/list'));
const RenterDetailPage  = lazy(() => import('@/pages/(dashboard)/renters/detail'));
const MessagesPage      = lazy(() => import('@/pages/(dashboard)/messages'));
const ApplicationsPage  = lazy(() => import('@/pages/(dashboard)/applications/list'));

// ── Error Page ───────────────────────────────────────────────
const NotFoundPage = lazy(() => import('@/pages/not-found'));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Marketing (Public)
      {
        element: <MarketingLayout />,
        children: [
          { path: '/',               element: <LandingPage /> },
          { path: '/search',         element: <SearchPage /> },
          { path: '/properties/:id', element: <PropertyDetail /> },
          { path: '/rooms/:id',      element: <RoomDetail /> },
        ],
      },

      // Auth
      { 
        path: '/login',    
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ) 
      },
      { 
        path: '/register', 
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ) 
      },
      { 
        path: '/become-landlord', 
        element: (
          <ProtectedRoute>
            <BecomeLandlordPage />
          </ProtectedRoute>
        ) 
      },

      // Dashboard (Authenticated)
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true,                   element: <DashboardHome /> },
          { path: 'tenant',               element: <TenantHome /> },
          { path: 'workspaces',           element: <WorkspacesPage /> },
          { path: 'workspaces/setup',     element: <LandlordSetupPage /> },
          { path: 'properties',           element: <PropertyListPage /> },
          { path: 'rooms',                element: <RoomListPage /> },
          { path: 'rooms/:id/edit',       element: <RoomEditPage /> },
          { path: 'contracts',            element: <ContractListPage /> },
          { path: 'contracts/new',        element: <ContractApplyPage /> },
          { path: 'contracts/issue',      element: <ContractCreatePage /> },
          { path: 'contracts/:id/pay-deposit', element: <PayDepositPage /> },
          { path: 'contracts/:id/confirm', element: <ContractConfirmPage /> },
          { path: 'contracts/:id/review', element: <ContractReviewPage /> },
          { path: 'invoices',             element: <InvoiceListPage /> },
          { path: 'invoices/:id',         element: <InvoiceDetailPage /> },
          { path: 'invoices/:id/pay',     element: <InvoicePayPage /> },
          { path: 'maintenance',          element: <MaintenanceListPage /> },
          { path: 'maintenance/new',      element: <MaintenanceNewPage /> },
          { path: 'maintenance/:id',      element: <MaintenanceDetailPage /> },
          { path: 'settings/profile',     element: <SettingsProfilePage /> },
          { path: 'settings/workspace',   element: <SettingsWorkspacePage /> },
          { path: 'settings/team',        element: <SettingsTeamPage /> },
          { path: 'renters',              element: <RenterListPage /> },
          { path: 'renters/:id',          element: <RenterDetailPage /> },
          { path: 'messages',             element: <MessagesPage /> },
          { path: 'applications',         element: <ApplicationsPage /> },
        ],
      },
      {
        path: '/workspaces/:id',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardHome /> },
        ],
      },

      // Catch-all
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
