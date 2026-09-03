import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SEO from '../../components/common/SEO';
import BrandLogo from '../../components/common/BrandLogo';
import { Lock, Mail, AlertCircle, Shield, Info } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@sventerprises.in');
  const [password, setPassword] = useState('Admin@SV2024!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      const token = localStorage.getItem('sv_access_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'ADMIN') {
          setError('Access denied: This account does not possess administrative privileges.');
          setLoading(false);
          return;
        }
      }
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SEO title="Staff & Admin Console | SV Enterprises" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <BrandLogo variant="light" />
        </Link>
        <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
          <Shield className="w-3.5 h-3.5" />
          <span>Operational Control Center</span>
        </div>
        <h2 className="mt-2 text-2xl font-black text-white tracking-tight">
          Admin Portal Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 rounded-2xl shadow-2xl space-y-5">
          
          {/* Default Seed Info Callout */}
          <div className="p-3.5 rounded-xl bg-blue-950/70 border border-blue-500/30 text-xs text-blue-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <Info className="w-4 h-4" />
              <span>Initial Administrator Credentials</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Email: <code>admin@sventerprises.in</code><br />
              Password: <code>Admin@SV2024!</code>
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 text-rose-300 text-xs border border-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="sv-label text-slate-300">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="sv-input bg-slate-950 border-slate-700 text-white text-xs pl-9 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="sv-label text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="sv-input bg-slate-950 border-slate-700 text-white text-xs pl-9 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500"
              >
                {loading ? 'Authenticating...' : 'Enter Admin Console'}
              </button>
            </div>
          </form>

          <div className="pt-2 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-slate-300">
              &larr; Return to Public Website
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
