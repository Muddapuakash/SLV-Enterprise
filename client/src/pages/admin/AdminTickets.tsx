import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import {
  LifeBuoy,
  User,
  Phone,
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { TicketStatus, TicketPriority } from '@sv/shared';

export default function AdminTickets() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [assignModal, setAssignModal] = useState<any | null>(null);
  const [selectedTechId, setSelectedTechId] = useState('');

  // Fetch Tickets
  const { data: ticketResponse, isLoading } = useQuery({
    queryKey: ['admin-tickets', statusFilter],
    queryFn: async () => {
      const res = await api.get('/api/admin/tickets', {
        params: { status: statusFilter || undefined, pageSize: 50 },
      });
      return res.data.data;
    },
  });

  // Fetch Technicians list for assignment
  const { data: techResponse } = useQuery({
    queryKey: ['admin-technicians-list'],
    queryFn: async () => {
      const res = await api.get('/api/admin/technicians');
      return res.data.data;
    },
  });

  const tickets = ticketResponse?.data || [];
  const technicians = techResponse || [];

  // Assign Ticket Mutation
  const assignMutation = useMutation({
    mutationFn: async ({ ticketId, technicianId }: { ticketId: string; technicianId: string }) => {
      // 1. Update ticket to ASSIGNED
      const res = await api.put(`/api/admin/tickets/${ticketId}`, {
        status: TicketStatus.ASSIGNED,
        assignedTo: technicianId,
      });

      // 2. Create or link a Job for the technician
      await api.post('/api/admin/jobs', {
        ticketId,
        technicianId,
        status: 'PENDING',
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      setAssignModal(null);
      setSelectedTechId('');
    },
  });

  // Status Change Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TicketStatus }) => {
      const res = await api.put(`/api/admin/tickets/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    },
  });

  return (
    <div className="space-y-6">
      <SEO title="Support Tickets & Dispatch | Admin Console" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Support Ticket Queue</h1>
          <p className="text-xs text-slate-500">
            Assign incoming subscriber and guest support requests to field technicians
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sv-input text-xs py-1.5 px-3 w-40"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 skeleton" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No tickets found under this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Ticket No</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Issue Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tickets.map((t: any) => {
                  const customerName = t.guestName || t.customer?.name || 'Registered Customer';
                  const phone = t.guestPhone || t.customer?.phone || 'N/A';

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {t.ticketNo}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{customerName}</div>
                        <div className="text-[10px] text-slate-400">{phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {t.category}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.priority === 'CRITICAL' || t.priority === 'HIGH'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.status === 'RESOLVED' || t.status === 'CLOSED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'IN_PROGRESS'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : t.status === 'ASSIGNED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {t.status === 'OPEN' && (
                          <button
                            onClick={() => {
                              setAssignModal(t);
                              setSelectedTechId(technicians[0]?.id || '');
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                          >
                            Assign Tech
                          </button>
                        )}

                        {t.status !== 'RESOLVED' && t.status !== 'CLOSED' && (
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({ id: t.id, status: TicketStatus.RESOLVED })
                            }
                            className="px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors font-semibold"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Technician Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setAssignModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Assign Technician to {assignModal.ticketNo}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Category: {assignModal.category} &bull; The selected technician will be alerted immediately.
            </p>

            {technicians.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 text-amber-900 text-xs">
                No active technicians found. Please add a technician in the Technicians tab first.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="sv-label">Select Field Technician</label>
                  <select
                    value={selectedTechId}
                    onChange={(e) => setSelectedTechId(e.target.value)}
                    className="sv-input text-xs"
                  >
                    {technicians.map((tech: any) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name} ({tech.phone}) — {tech.specialization?.join(', ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAssignModal(null)}
                    className="flex-1 py-2 text-xs border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={assignMutation.isPending || !selectedTechId}
                    onClick={() =>
                      assignMutation.mutate({
                        ticketId: assignModal.id,
                        technicianId: selectedTechId,
                      })
                    }
                    className="flex-1 btn-primary justify-center text-xs py-2 font-bold"
                  >
                    {assignMutation.isPending ? 'Dispatching...' : 'Confirm Assignment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
