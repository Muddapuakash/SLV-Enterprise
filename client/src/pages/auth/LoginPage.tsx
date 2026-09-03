import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SEO from '../../components/common/SEO';
import BrandLogo from '../../components/common/BrandLogo';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      const token = localStorage.getItem('sv_access_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'ADMIN') {
          navigate('/admin');
        } else if (payload.role === 'TECHNICIAN') {
          navigate('/technician');
        } else {
          const from = (location.state as any)?.from || '/customer';
          navigate(from);
        }
      } else {
        navigate('/customer');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SEO title="Account Login | SV Enterprises" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <BrandLogo variant="dark" />
        </Link>
        <h2 className="mt-6 text-2xl font-black text-slate-900 tracking-tight">
          Sign In to Your Account
        </h2>
        <p className="mt-2 text-xs text-slate-500">
          Access connection status, invoices, and service requests
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="sv-label">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="sv-input text-xs pl-9"
                />
              </div>
            </div>

            <div>
              <label className="sv-label">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="sv-input text-xs pl-9"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 text-xs font-bold"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Don't have an account?</span>
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
              Register Here &rarr;
            </Link>
          </div>

          <div className="text-center pt-2">
            <Link to="/admin/login" className="text-[11px] text-slate-400 hover:text-slate-600">
              Staff / Admin Console Entrance
            </Link>
          </div>

        </div>

        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Encrypted JWT Authenticated Session</span>
        </div>
      </div>
    </div>
  );
}
