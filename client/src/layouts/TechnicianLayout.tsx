import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { LogOut, Wrench, Home } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

export default function TechnicianLayout() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== 'TECHNICIAN' && user?.role !== 'ADMIN'))) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Technician Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <BrandLogo variant="light" showSubtitle={false} />
            </Link>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/30 border border-blue-500/40 rounded-full text-xs text-blue-300 font-semibold">
              <Wrench className="w-3.5 h-3.5" />
              Field Technician App
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs text-slate-300 hover:text-white hidden sm:flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-800"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>

            <span className="text-xs text-slate-400 hidden sm:inline">
              {user?.email}
            </span>

            <button
              onClick={() => logout().then(() => navigate('/login'))}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        SV Enterprises Operations &bull; Dispatch Support: 9620406789
      </footer>
    </div>
  );
}
