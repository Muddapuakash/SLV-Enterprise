import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Suspense, lazy } from 'react';

// Layout
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import TechnicianLayout from './layouts/TechnicianLayout';

// Public pages
import HomePage from './pages/public/HomePage';
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const PlansPage = lazy(() => import('./pages/public/PlansPage'));
const CoveragePage = lazy(() => import('./pages/public/CoveragePage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const SupportPage = lazy(() => import('./pages/public/SupportPage'));
const ProjectsPage = lazy(() => import('./pages/public/ProjectsPage'));
const RequestServicePage = lazy(() => import('./pages/services/RequestServicePage'));
const InternetPage = lazy(() => import('./pages/services/InternetPage'));
const WiFiPage = lazy(() => import('./pages/services/WiFiPage'));
const CCTVPage = lazy(() => import('./pages/services/CCTVPage'));
const CablingPage = lazy(() => import('./pages/services/CablingPage'));

// Auth
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Customer
const CustomerPortal = lazy(() => import('./pages/customer/CustomerPortal'));

// Admin
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const AdminPlans = lazy(() => import('./pages/admin/AdminPlans'));
const AdminTickets = lazy(() => import('./pages/admin/AdminTickets'));
const AdminTechnicians = lazy(() => import('./pages/admin/AdminTechnicians'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminCoverage = lazy(() => import('./pages/admin/AdminCoverage'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminServiceRequests = lazy(() => import('./pages/admin/AdminServiceRequests'));

// Technician
const TechnicianPortal = lazy(() => import('./pages/technician/TechnicianPortal'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-sm text-slate-500">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Public ───────────────────────────────────── */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/coverage" element={<CoveragePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/request-service" element={<RequestServicePage />} />
                <Route path="/services/internet" element={<InternetPage />} />
                <Route path="/services/wifi" element={<WiFiPage />} />
                <Route path="/services/cctv" element={<CCTVPage />} />
                <Route path="/services/cabling" element={<CablingPage />} />
              </Route>

              {/* ── Auth ─────────────────────────────────────── */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ── Customer Portal ───────────────────────────── */}
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<CustomerPortal />} />
              </Route>

              {/* ── Admin ─────────────────────────────────────── */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="plans" element={<AdminPlans />} />
                <Route path="tickets" element={<AdminTickets />} />
                <Route path="service-requests" element={<AdminServiceRequests />} />
                <Route path="technicians" element={<AdminTechnicians />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="coverage" element={<AdminCoverage />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* ── Technician ─────────────────────────────────── */}
              <Route path="/technician" element={<TechnicianLayout />}>
                <Route index element={<TechnicianPortal />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
