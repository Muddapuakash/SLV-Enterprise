import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import {
  Users,
  Search,
  Plus,
  Edit2,
  X,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { CustomerStatus } from '@sv/shared';

export default function AdminCustomers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: 'Vijinapura',
    pincode: '560016',
    notes: '',
  });

  const [formError, setFormError] = useState('');

  // Fetch Customers with search
  const { data: customerResponse, isLoading } = useQuery({
    queryKey: ['admin-customers', search],
    queryFn: async () => {
      const res = await api.get('/api/admin/customers', {
        params: { search, page: 1, pageSize: 50 },
      });
      return res.data.data;
    },
  });

  const customers = customerResponse?.data || [];

  // Create Customer Mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await api.post('/api/admin/customers', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      setModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Failed to create customer');
    },
  });

  // Update Customer Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/api/admin/customers/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      setModalOpen(false);
      setEditingCustomer(null);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Failed to update customer');
    },
  });

  const resetForm = () => {
    setForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      area: 'Vijinapura',
      pincode: '560016',
      notes: '',
    });
    setFormError('');
  };

  const handleOpenEdit = (customer: any) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address,
      area: customer.area,
      pincode: customer.pincode,
      notes: customer.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      setFormError('Name, Phone, and Address are required.');
      return;
    }

    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Subscribers & Customers | Admin Console" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-xs text-slate-500">
            View, enroll, and manage subscriber profiles, addresses, and account statuses
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCustomer(null);
            resetForm();
            setModalOpen(true);
          }}
          className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subscriber</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by customer name, phone number, or Customer ID (e.g. SV000001)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 skeleton" />
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No customers found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Customer ID</th>
                  <th className="py-3.5 px-4">Name &amp; Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Active Plan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customers.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {c.customerId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <div>{c.area} ({c.pincode})</div>
                      <div className="text-[10px] text-slate-400 truncate">{c.address}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {c.subscriptions?.[0]?.plan ? (
                        <span className="font-semibold text-slate-800">
                          {c.subscriptions[0].plan.name} ({c.subscriptions[0].plan.speed})
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No plan linked</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'SUSPENDED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingCustomer ? `Edit Subscriber (${editingCustomer.customerId})` : 'Enroll New Customer'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter customer personal details and installation address.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="sv-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="sv-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="sv-label">Phone *</label>
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
                  <label className="sv-label">Email</label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="sv-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="sv-label">Street / Building Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Door No, Floor, Street..."
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="sv-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="sv-label">Area</label>
                  <input
                    type="text"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="sv-input text-xs"
                  />
                </div>
                <div>
                  <label className="sv-label">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="sv-input text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="sv-label">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Special instructions, router serial, etc."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 btn-primary justify-center text-xs py-2 font-bold"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingCustomer
                    ? 'Save Changes'
                    : 'Enroll Subscriber'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
