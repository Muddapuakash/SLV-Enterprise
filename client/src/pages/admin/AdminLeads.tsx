import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import {
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  X,
  Zap,
} from 'lucide-react';
import { LeadStatus } from '@sv/shared';

export default function AdminLeads() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [updateStatus, setUpdateStatus] = useState<LeadStatus>(LeadStatus.NEW);
  const [updateNotes, setUpdateNotes] = useState('');

  const { data: leadsResponse, isLoading } = useQuery({
    queryKey: ['admin-leads', statusFilter],
    queryFn: async () => {
      const res = await api.get('/api/admin/leads', {
        params: { status: statusFilter || undefined, pageSize: 50 },
      });
      return res.data.data;
    },
  });

  const leads = leadsResponse?.data || [];

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: LeadStatus; notes?: string }) => {
      const res = await api.put(`/api/admin/leads/${id}`, { status, notes });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      setSelectedLead(null);
    },
  });

  const handleOpenEdit = (lead: any) => {
    setSelectedLead(lead);
    setUpdateStatus(lead.status);
    setUpdateNotes(lead.notes || '');
  };

  return (
    <div className="space-y-6">
      <SEO title="Leads & Pipeline | Admin Console" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leads &amp; Enquiries</h1>
          <p className="text-xs text-slate-500">
            Incoming broadband connection requests and customer inquiries
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sv-input text-xs py-1.5 px-3 w-40"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="CONVERTED">Converted</option>
            <option value="LOST">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 skeleton" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No leads recorded under this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Service / Plan</th>
                  <th className="py-3.5 px-4">Area &amp; Pincode</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {lead.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <a href={`tel:${lead.phone}`} className="font-semibold text-blue-600 hover:underline">
                          {lead.phone}
                        </a>
                      </div>
                      {lead.email && <div className="text-[10px] text-slate-400">{lead.email}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {lead.serviceType || 'INTERNET'}
                      </div>
                      {lead.plan && (
                        <div className="text-[10px] text-blue-600">
                          Plan: {lead.plan.name} ({lead.plan.speed})
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{lead.area || 'Bangalore'}</div>
                      <div className="text-[10px] text-slate-400">{lead.pincode}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          lead.status === 'NEW'
                            ? 'bg-purple-100 text-purple-800'
                            : lead.status === 'CONVERTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.status === 'CONTACTED'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'FOLLOW_UP'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(lead)}
                        className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Lead Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Update Lead: {selectedLead.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Phone: <strong>{selectedLead.phone}</strong> &bull; Service: {selectedLead.serviceType}
            </p>

            <div className="space-y-3">
              <div>
                <label className="sv-label">Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as LeadStatus)}
                  className="sv-input text-xs"
                >
                  <option value={LeadStatus.NEW}>NEW</option>
                  <option value={LeadStatus.CONTACTED}>CONTACTED</option>
                  <option value={LeadStatus.FOLLOW_UP}>FOLLOW_UP</option>
                  <option value={LeadStatus.CONVERTED}>CONVERTED</option>
                  <option value={LeadStatus.LOST}>LOST</option>
                </select>
              </div>

              <div>
                <label className="sv-label">Notes &amp; Call Log</label>
                <textarea
                  rows={3}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Notes from customer phone conversation..."
                  className="sv-input text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="flex-1 py-2 text-xs border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updateLeadMutation.isPending}
                  onClick={() =>
                    updateLeadMutation.mutate({
                      id: selectedLead.id,
                      status: updateStatus,
                      notes: updateNotes,
                    })
                  }
                  className="flex-1 btn-primary justify-center text-xs py-2 font-bold"
                >
                  {updateLeadMutation.isPending ? 'Saving...' : 'Update Lead'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
