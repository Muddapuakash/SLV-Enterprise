import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { Plus, Edit2, Trash2, X, CheckCircle2, Zap, AlertCircle } from 'lucide-react';
import { BillingCycle } from '@sv/shared';

export default function AdminPlans() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: '',
    speed: '',
    price: 799,
    billingCycle: BillingCycle.MONTHLY,
    features: 'Unlimited Data, Free Router, Priority Support',
    isPopular: false,
    isSample: false,
    sortOrder: 0,
  });

  const [error, setError] = useState('');

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const res = await api.get('/api/admin/plans');
      return res.data.data;
    },
  });

  const plans = plansData || [];

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/api/admin/plans', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      setModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save plan');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await api.put(`/api/admin/plans/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      setModalOpen(false);
      setEditingPlan(null);
      resetForm();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update plan');
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/admin/plans/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
    },
  });

  const resetForm = () => {
    setForm({
      name: '',
      speed: '',
      price: 799,
      billingCycle: BillingCycle.MONTHLY,
      features: 'Unlimited Data, Free Router, Priority Support',
      isPopular: false,
      isSample: false,
      sortOrder: 0,
    });
    setError('');
  };

  const handleOpenEdit = (plan: any) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      speed: plan.speed,
      price: plan.price,
      billingCycle: plan.billingCycle,
      features: plan.features?.join(', ') || '',
      isPopular: plan.isPopular,
      isSample: plan.isSample,
      sortOrder: plan.sortOrder || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.speed || !form.price) {
      setError('Name, Speed, and Price are required.');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      sortOrder: Number(form.sortOrder),
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
    };

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Internet Plans Management | Admin Console" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Broadband Plan Tariffs</h1>
          <p className="text-xs text-slate-500">
            Define tariffs displayed to public customers on the website and pricing page
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPlan(null);
            resetForm();
            setModalOpen(true);
          }}
          className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-64 skeleton" />)
        ) : plans.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            No broadband plans configured. Click "Create New Plan" above.
          </div>
        ) : (
          plans.map((plan: any) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-6 border shadow-xs flex flex-col justify-between relative ${
                plan.isActive ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base text-slate-900">{plan.name}</span>
                  <div className="flex gap-1.5">
                    {plan.isSample && <span className="badge-sample">Sample</span>}
                    {plan.isPopular && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-2xl font-black text-blue-700 tracking-tight">
                  {plan.speed}
                </div>
                <div className="text-sm font-bold text-slate-700 mt-1">
                  &#8377;{plan.price} <span className="text-xs font-normal text-slate-400">/ {plan.billingCycle?.toLowerCase()}</span>
                </div>

                <ul className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  {plan.features?.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Order: {plan.sortOrder}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(plan)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    title="Edit Plan"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Deactivate plan "${plan.name}"?`)) {
                        deactivateMutation.mutate(plan.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Deactivate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Plan Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create Broadband Plan'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure name, speed, price, and feature bullet points.
            </p>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="sv-label">Plan Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Standard"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="sv-input text-xs"
                  />
                </div>
                <div>
                  <label className="sv-label">Speed *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100 Mbps"
                    value={form.speed}
                    onChange={(e) => setForm({ ...form, speed: e.target.value })}
                    className="sv-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="sv-label">Price (&#8377;) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="sv-input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="sv-label">Billing Cycle</label>
                  <select
                    value={form.billingCycle}
                    onChange={(e) => setForm({ ...form, billingCycle: e.target.value as BillingCycle })}
                    className="sv-input text-xs"
                  >
                    <option value={BillingCycle.MONTHLY}>Monthly</option>
                    <option value={BillingCycle.QUARTERLY}>Quarterly</option>
                    <option value={BillingCycle.ANNUAL}>Annual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="sv-label">Features (Comma separated)</label>
                <textarea
                  rows={2}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="Unlimited Data, Free Installation, Priority Support..."
                  className="sv-input text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Mark as Most Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isSample}
                    onChange={(e) => setForm({ ...form, isSample: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Label as Sample Plan</span>
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
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 btn-primary justify-center text-xs py-2 font-bold"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
