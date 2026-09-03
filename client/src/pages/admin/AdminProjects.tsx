import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { FolderKanban, Plus, Trash2, X, CheckCircle2, MapPin } from 'lucide-react';
import { ServiceType } from '@sv/shared';

export default function AdminProjects() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    location: 'Bangalore',
    service: ServiceType.CABLING,
    description: '',
    isSample: false,
  });

  const [error, setError] = useState('');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const res = await api.get('/api/admin/projects');
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/admin/projects', form);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setModalOpen(false);
      setForm({ title: '', location: 'Bangalore', service: ServiceType.CABLING, description: '', isSample: false });
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create project entry');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/admin/projects/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError('Title and description are required.');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <SEO title="Portfolio & Installations | Admin Console" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Portfolio &amp; Project Gallery</h1>
          <p className="text-xs text-slate-500">
            Showcase real or sample customer installations to build trust on the public website
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project Showcase</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-48 skeleton" />)
        ) : !projects || projects.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            No projects listed. Click "Add Project Showcase" to post your field installations.
          </div>
        ) : (
          projects.map((p: any) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {p.service}
                  </span>
                  {p.isSample && <span className="badge-sample">Sample Content</span>}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{p.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Active Showcase</span>
                <button
                  onClick={() => {
                    if (confirm(`Delete project "${p.title}"?`)) {
                      deleteMutation.mutate(p.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
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

            <h3 className="text-base font-bold text-slate-900 mb-1">Add Project Showcase</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter title, location, and description of the work executed.
            </p>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="sv-label">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office Fiber &amp; LAN Cabling"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="sv-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="sv-label">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="sv-input text-xs"
                  />
                </div>
                <div>
                  <label className="sv-label">Service Type</label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value as ServiceType })}
                    className="sv-input text-xs"
                  >
                    <option value={ServiceType.INTERNET}>Internet</option>
                    <option value={ServiceType.WIFI}>WiFi</option>
                    <option value={ServiceType.CCTV}>CCTV</option>
                    <option value={ServiceType.CABLING}>Cabling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="sv-label">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain scope of work, number of nodes or cameras, hardware used..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="sv-input text-xs"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={form.isSample}
                    onChange={(e) => setForm({ ...form, isSample: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Mark as Sample / Demo entry (displays sample badge)</span>
                </label>
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
                  {createMutation.isPending ? 'Publishing...' : 'Publish Project'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
