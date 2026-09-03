import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Wifi, ChevronDown, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import BrandLogo from '../common/BrandLogo';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Services', to: '#',
    children: [
      { label: 'Internet', to: '/services/internet' },
      { label: 'WiFi Solutions', to: '/services/wifi' },
      { label: 'CCTV Security', to: '/services/cctv' },
      { label: 'Network Cabling', to: '/services/cabling' },
    ],
  },
  { label: 'Internet Plans', to: '/plans' },
  { label: 'Coverage', to: '/coverage' },
  { label: 'Projects', to: '/projects' },
  { label: 'Support', to: '/support' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const portalLink = user?.role === 'ADMIN'
    ? '/admin'
    : user?.role === 'TECHNICIAN'
    ? '/technician'
    : '/customer';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max section-px">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <BrandLogo variant={isScrolled ? 'dark' : 'light'} />
          </Link>

          {/* ── Desktop Nav ───────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isScrolled ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50' : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}>
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {servicesOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
                      {link.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setServicesOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isScrolled
                        ? isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                        : isActive
                        ? 'text-white bg-white/15'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          {/* ── Right CTAs ────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={portalLink} className="btn-outline text-sm py-2 px-4">
                My Portal
              </Link>
            ) : (
              <Link
                to="/login"
                className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
                }`}
              >
                Login
              </Link>
            )}
            <Link to="/request-service" className="btn-primary text-sm py-2 px-4">
              Get Connected
            </Link>
          </div>

          {/* ── Mobile Toggle ─────────────────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl animate-fade-in">
          <div className="section-px py-4 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">
                    {link.label}
                  </div>
                  {link.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      onClick={() => setMobileOpen(false)}
                      className="block px-5 py-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/request-service"
                onClick={() => setMobileOpen(false)}
                className="btn-primary text-center text-sm"
              >
                Get Connected
              </Link>
              <a
                href="tel:9620406789"
                className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <Phone className="w-4 h-4" />
                Call 9620406789
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
