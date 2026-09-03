import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { Wrench, Plus, Phone, Mail, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminTechnicians() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: 'Fiber Optic, WiFi, CCTV',
  });

  const [error, setError] = useState('');

  const { data: technicians, isLoading } = useQuery({
    queryKey: ['admin-technicians'],
    queryFn: async () => {
      const res = await api.get('/api/admin/technicians');
      return res.data.data;
    },
  });

  const createTechMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        specialization: form.specialization.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await api.post('/api/admin/technicians', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-technicians'] });
      setModalOpen(false);
      setForm({ name: '', email: '', password: '', phone: '', specialization: 'Fiber Optic, WiFi, CCTV' });
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to register technician');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      setError('All fields are required.');
      return;
    }
    createTechMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <SEO title="Technicians Management | Admin Console" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Field Technicians Roster</h1>
          <p className="text-xs text-slate-500">
            Registered ground staff dispatched for fiber splicing, router setups, and CCTV jobs
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technician</span>
        </button>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-44 skeleton" />)
        ) : !technicians || technicians.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            No technicians registered. Click "Add Technician" to create login credentials for your field engineers.
          </div>
        ) : (
          technicians.map((t: any) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.phone}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.user?.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                    Specializations:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {t.specialization?.map((spec: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-right">
                <span className="text-[11px] text-blue-600 font-semibold">
                  Field Portal Ready &bull; /technician
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Technician Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Add Field Technician</h3>
            <p className="text-xs text-slate-500 mb-4">
              Create login credentials for mobile field portal access.
            </p>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="sv-label">Technician Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manjunath R"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="sv-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="sv-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9620406789"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="sv-input text-xs"
                  />
                </div>
                <div>
                  <label className="sv-label">Email Login *</label>
                  <input
                    type="email"
                    required
                    placeholder="tech@sventerprises.in"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="sv-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="sv-label">Account Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="sv-input text-xs"
                />
              </div>

              <div>
                <label className="sv-label">Specializations (Comma separated)</label>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  placeholder="Fiber Optic, WiFi, CCTV..."
                  className="sv-input text-xs"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 text-xs border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTechMutation.isPending}
                  className="flex-1 btn-primary justify-center text-xs py-2 font-bold"
                >
                  {createTechMutation.isPending ? 'Registering...' : 'Save Technician'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
