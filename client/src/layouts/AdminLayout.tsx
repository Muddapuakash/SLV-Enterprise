import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Zap,
  LifeBuoy,
  Wrench,
  FolderKanban,
  MapPin,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  FileText,
  Radio,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import BrandLogo from '../components/common/BrandLogo';
import { getSocket } from '../services/socket';

const adminLinks = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Leads & Enquiries', to: '/admin/leads', icon: UserCheck },
  { label: 'Internet Plans', to: '/admin/plans', icon: Zap },
  { label: 'Support Tickets', to: '/admin/tickets', icon: LifeBuoy },
  { label: 'Service Requests', to: '/admin/service-requests', icon: FileText },
  { label: 'Technicians', to: '/admin/technicians', icon: Wrench },
  { label: 'Projects & Gallery', to: '/admin/projects', icon: FolderKanban },
  { label: 'Coverage Areas', to: '/admin/coverage', icon: MapPin },
  { label: 'Business Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      navigate('/admin/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, user, navigate, location]);

  useEffect(() => {
    const socket = getSocket();
    const handleNotification = () => {
      setNotificationCount((prev) => prev + 1);
    };

    socket.on('notification.created', handleNotification);
    socket.on('ticket.created', handleNotification);

    return () => {
      socket.off('notification.created', handleNotification);
      socket.off('ticket.created', handleNotification);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/admin" className="flex items-center gap-2">
            <BrandLogo variant="light" showSubtitle={false} />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Management Panel
          </div>
          {adminLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Live Network Pill & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Network Engine:</span>
            <span className="text-emerald-400 font-semibold ml-auto">Active</span>
          </div>

          <button
            onClick={() => logout().then(() => navigate('/admin/login'))}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="text-xs text-blue-600 hover:underline hidden sm:inline-block"
            >
              View Public Website &rarr;
            </Link>

            <div className="relative">
              <button
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 relative"
                onClick={() => setNotificationCount(0)}
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-800">{user?.email}</div>
                <div className="text-[10px] text-slate-500">Super Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
