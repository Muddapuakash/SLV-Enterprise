import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { getSocket } from '../../services/socket';
import {
  Wrench,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Calendar,
  FileText,
  User,
  Radio,
} from 'lucide-react';
import { JobStatus } from '@sv/shared';

export default function TechnicianPortal() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('PENDING');
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobNote, setJobNote] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Fetch Technician Profile
  const { data: techProfile } = useQuery({
    queryKey: ['technician-profile'],
    queryFn: async () => {
      const res = await api.get('/api/technician/profile');
      return res.data.data;
    },
  });

  // Fetch Assigned Jobs
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['technician-jobs'],
    queryFn: async () => {
      const res = await api.get('/api/technician/jobs');
      return res.data.data;
    },
  });

  // Listen to live socket events for technician
  useEffect(() => {
    const socket = getSocket();

    const handleTicketAssigned = (ticket: any) => {
      queryClient.invalidateQueries({ queryKey: ['technician-jobs'] });
      setActionNotice(`New job assigned: Ticket ${ticket.ticketNo}`);
      setTimeout(() => setActionNotice(null), 8000);
    };

    socket.on('ticket.assigned', handleTicketAssigned);

    return () => {
      socket.off('ticket.assigned', handleTicketAssigned);
    };
  }, [queryClient]);

  // Update Job Mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: JobStatus; notes?: string }) => {
      const res = await api.put(`/api/technician/jobs/${id}`, { status, notes });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['technician-jobs'] });
      setSelectedJob(null);
      setJobNote('');
      setActionNotice(`Job marked as ${variables.status}. Customer and dispatch notified via Socket.IO.`);
      setTimeout(() => setActionNotice(null), 6000);
    },
  });

  const jobs = jobsData || [];
  const pendingJobs = jobs.filter((j: any) => j.status === 'PENDING' || j.status === 'ACCEPTED');
  const activeJobs = jobs.filter((j: any) => j.status === 'IN_PROGRESS');
  const completedJobs = jobs.filter((j: any) => j.status === 'COMPLETED');

  const displayedJobs =
    activeTab === 'PENDING' ? pendingJobs : activeTab === 'IN_PROGRESS' ? activeJobs : completedJobs;

  return (
    <div className="space-y-6">
      <SEO title="Technician Field Dashboard | SV Enterprises" />

      {/* Live Action Notice */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Technician Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">
                {techProfile?.name || 'Technician'}
              </h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Online &bull; Available
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Specialization: {techProfile?.specialization?.join(', ') || 'Fiber broadband, WiFi, CCTV'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <div className="font-bold text-slate-900">{activeJobs.length} Active</div>
            <div className="text-slate-500">{pendingJobs.length} Pending</div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'PENDING'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Pending / Assigned ({pendingJobs.length})
        </button>

        <button
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          In Progress ({activeJobs.length})
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Completed ({completedJobs.length})
        </button>
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 skeleton" />
          ))}
        </div>
      ) : displayedJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No jobs in this queue</h3>
          <p className="text-xs text-slate-400 mt-1">
            New jobs assigned by dispatch will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedJobs.map((job: any) => {
            const ticket = job.ticket;
            const req = job.serviceRequest;
            const title = ticket ? `Ticket ${ticket.ticketNo}: ${ticket.category}` : req ? `Service: ${req.serviceType}` : 'Field Job';
            const location = req?.location || ticket?.customer?.address || 'Bangalore';
            const customerName = ticket?.guestName || ticket?.customer?.name || req?.name || 'Customer';
            const phone = ticket?.guestPhone || ticket?.customer?.phone || req?.phone;

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{title}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        job.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : job.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{customerName}</span>
                    </div>

                    {phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`tel:${phone}`} className="text-blue-600 font-semibold hover:underline">
                          {phone}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 sm:col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>
                  </div>

                  {ticket?.messages?.[0]?.message && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <strong>Issue:</strong> {ticket.messages[0].message}
                    </div>
                  )}

                  {job.notes && (
                    <div className="text-xs text-slate-500">
                      <strong>Technician Notes:</strong> {job.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  {job.status === 'PENDING' && (
                    <button
                      onClick={() =>
                        updateJobMutation.mutate({ id: job.id, status: JobStatus.IN_PROGRESS })
                      }
                      className="btn-primary text-xs py-2 px-4 justify-center bg-blue-600 hover:bg-blue-500"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Working</span>
                    </button>
                  )}

                  {job.status === 'IN_PROGRESS' && (
                    <>
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="btn-primary text-xs py-2 px-4 justify-center bg-emerald-600 hover:bg-emerald-500"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete Job</span>
                      </button>

                      <button
                        onClick={() => setSelectedJob(job)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Add Work Notes
                      </button>
                    </>
                  )}

                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Call Client</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Work Completion / Notes Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {selectedJob.status === 'IN_PROGRESS' ? 'Complete Job' : 'Update Job'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add technical resolution notes. This will be transmitted to the customer and dispatch log.
            </p>

            <div className="space-y-4">
              <div>
                <label className="sv-label">Resolution Notes</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Re-spliced optic fiber connector at junction box. Signal restored to -18 dBm. Customer verified 100 Mbps speed test."
                  value={jobNote}
                  onChange={(e) => setJobNote(e.target.value)}
                  className="sv-input text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="flex-1 py-2 text-xs border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updateJobMutation.isPending}
                  onClick={() =>
                    updateJobMutation.mutate({
                      id: selectedJob.id,
                      status: JobStatus.COMPLETED,
                      notes: jobNote,
                    })
                  }
                  className="flex-1 btn-primary bg-emerald-600 hover:bg-emerald-500 justify-center text-xs py-2 font-bold"
                >
                  {updateJobMutation.isPending ? 'Updating...' : 'Mark Completed'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
