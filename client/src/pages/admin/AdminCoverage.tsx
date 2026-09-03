import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { MapPin, Plus, Trash2, X, CheckCircle2 } from 'lucide-react';
import { ServiceType } from '@sv/shared';

export default function AdminCoverage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    area: '',
    city: 'Bangalore',
    pincode: '560016',
    serviceType: ServiceType.INTERNET,
    available: true,
    notes: '',
  });

  const [error, setError] = useState('');

  const { data: areas, isLoading } = useQuery({
    queryKey: ['admin-coverage'],
    queryFn: async () => {
      const res = await api.get('/api/admin/coverage');
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/admin/coverage', form);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coverage'] });
      setModalOpen(false);
      setForm({ area: '', city: 'Bangalore', pincode: '560016', serviceType: ServiceType.INTERNET, available: true, notes: '' });
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to add coverage zone');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/admin/coverage/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coverage'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.area || !form.pincode) {
      setError('Area and Pincode are required.');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <SEO title="Network Coverage Areas | Admin Console" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Network Coverage Zones</h1>
          <p className="text-xs text-slate-500">
            Control which Bangalore pincodes and neighborhoods return "Available" on the public coverage checker
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Coverage Area</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-10 skeleton" />)}
          </div>
        ) : !areas || areas.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No coverage areas registered.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Area / Locality</th>
                  <th className="py-3.5 px-4">Pincode</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Service Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {areas.map((a: any) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.area}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {a.pincode}
                    </td>
                    <td className="py-3.5 px-4">{a.city}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {a.serviceType}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          a.available
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {a.available ? 'Live' : 'Planned'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove coverage entry for ${a.area} (${a.pincode})?`)) {
                            deleteMutation.mutate(a.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Add Coverage Area</h3>
            <p className="text-xs text-slate-500 mb-4">
              Expand service feasibility to another Bangalore neighborhood.
            </p>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="sv-label">Area / Colony Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KR Puram"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="sv-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="sv-label">Pincode (6 digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="560036"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="sv-input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="sv-label">Service Type</label>
                  <select
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value as ServiceType })}
                    className="sv-input text-xs"
                  >
                    <option value={ServiceType.INTERNET}>Internet</option>
                    <option value={ServiceType.WIFI}>WiFi</option>
                    <option value={ServiceType.CCTV}>CCTV</option>
                    <option value={ServiceType.CABLING}>Cabling</option>
                  </select>
                </div>
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
                  disabled={createMutation.isPending}
                  className="flex-1 btn-primary justify-center text-xs py-2 font-bold"
                >
                  {createMutation.isPending ? 'Adding...' : 'Add Coverage Zone'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
