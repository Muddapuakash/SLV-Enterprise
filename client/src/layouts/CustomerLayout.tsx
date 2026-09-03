import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { LogOut, Home } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

export default function CustomerLayout() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Customer Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/">
              <BrandLogo variant="dark" />
            </Link>
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Customer Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <Home className="w-4 h-4" />
              Main Website
            </Link>

            <span className="text-xs text-slate-600 hidden sm:inline-block font-medium">
              {user?.email}
            </span>

            <button
              onClick={() => logout().then(() => navigate('/login'))}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Customer Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        SV Enterprises ISP Customer Service: 9620406789 / 6302249065 &bull; sventerprises161718@gmail.com
      </footer>
    </div>
  );
}
