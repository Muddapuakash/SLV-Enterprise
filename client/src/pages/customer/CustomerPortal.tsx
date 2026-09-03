import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { getSocket } from '../../services/socket';
import {
  Wifi,
  Zap,
  Activity,
  Receipt,
  LifeBuoy,
  PlusCircle,
  Clock,
  ShieldAlert,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bell,
} from 'lucide-react';
import { ConnectionStatus, TicketCategory } from '@sv/shared';

export default function CustomerPortal() {
  const queryClient = useQueryClient();
  const [ticketModal, setTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<TicketCategory>(TicketCategory.INTERNET_NOT_WORKING);
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketError, setTicketError] = useState('');
  const [liveStatusNotice, setLiveStatusNotice] = useState<string | null>(null);

  // Fetch Customer Profile
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: async () => {
      const res = await api.get('/api/customer/profile');
      return res.data.data;
    },
  });

  // Fetch Connection Details & Live Status
  const { data: connectionData } = useQuery({
    queryKey: ['customer-connection'],
    queryFn: async () => {
      const res = await api.get('/api/customer/connection');
      return res.data.data;
    },
  });

  // Fetch Invoices
  const { data: invoicesData } = useQuery({
    queryKey: ['customer-invoices'],
    queryFn: async () => {
      const res = await api.get('/api/customer/invoices');
      return res.data.data;
    },
  });

  // Fetch Tickets
  const { data: ticketsData } = useQuery({
    queryKey: ['customer-tickets'],
    queryFn: async () => {
      const res = await api.get('/api/customer/tickets');
      return res.data.data;
    },
  });

  // Fetch Notifications
  const { data: notifsData } = useQuery({
    queryKey: ['customer-notifications'],
    queryFn: async () => {
      const res = await api.get('/api/customer/notifications');
      return res.data.data;
    },
  });

  // Listen to Socket.IO real-time events
  useEffect(() => {
    const socket = getSocket();

    const handleConnectionStatus = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['customer-connection'] });
      setLiveStatusNotice(`Network status updated to: ${data.status}`);
      setTimeout(() => setLiveStatusNotice(null), 8000);
    };

    const handleJobEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['customer-tickets'] });
    };

    const handleNotification = () => {
      queryClient.invalidateQueries({ queryKey: ['customer-notifications'] });
    };

    socket.on('connection.status.changed', handleConnectionStatus);
    socket.on('job.started', handleJobEvent);
    socket.on('job.completed', handleJobEvent);
    socket.on('ticket.updated', handleJobEvent);
    socket.on('notification.created', handleNotification);

    return () => {
      socket.off('connection.status.changed', handleConnectionStatus);
      socket.off('job.started', handleJobEvent);
      socket.off('job.completed', handleJobEvent);
      socket.off('ticket.updated', handleJobEvent);
      socket.off('notification.created', handleNotification);
    };
  }, [queryClient]);

  // Ticket creation mutation
  const ticketMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/customer/tickets', {
        category: ticketCategory,
        message: ticketMessage,
      });
      return res.data;
    },
    onSuccess: () => {
      setTicketModal(false);
      setTicketMessage('');
      setTicketError('');
      queryClient.invalidateQueries({ queryKey: ['customer-tickets'] });
    },
    onError: (err: any) => {
      setTicketError(err.response?.data?.message || 'Failed to submit ticket');
    },
  });

  const customer = profileData;
  const activeSubscription = customer?.subscriptions?.[0];
  const activePlan = activeSubscription?.plan;
  const connection = connectionData;

  const getStatusBadge = (status?: ConnectionStatus) => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Connected &bull; Active
          </span>
        );
      case ConnectionStatus.DEGRADED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Degraded &bull; High Latency
          </span>
        );
      case ConnectionStatus.DISCONNECTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Connection Issue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            Pending Provisioning
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="My Account Portal | SV Enterprises" />

      {/* Live Notice Banner */}
      {liveStatusNotice && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600 animate-spin" />
            <span>{liveStatusNotice}</span>
          </div>
          <button onClick={() => setLiveStatusNotice(null)} className="text-blue-600 font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Development Status Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Network Monitoring Notice:</strong> Connection diagnostics are currently running via <code>DevelopmentMonitoringAdapter</code>. Simulated test data is displayed for interface validation and does not fake actual physical hardware telemetries.
        </p>
      </div>

      {/* Top Welcome / Customer Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
            {customer?.name ? customer.name.charAt(0).toUpperCase() : 'SV'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">
                {customer?.name || 'Valued Customer'}
              </h1>
              {customer?.customerId && (
                <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-semibold">
                  {customer.customerId}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{customer?.address || 'Bangalore, Karnataka'} &bull; {customer?.pincode}</span>
            </p>
          </div>
        </div>

        <div>
          {getStatusBadge(connection?.status)}
        </div>
      </div>

      {/* 3 Main Highlights: My Plan, Connection Details, Quick Action */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: My Plan */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                Current Broadband Plan
              </span>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>

            <div className="text-2xl font-black text-slate-900">
              {activePlan?.name || 'Standard 100 Mbps'}
            </div>
            <div className="text-blue-700 font-bold text-sm mt-0.5">
              {activePlan?.speed || '100 Mbps Unlimited Fiber'}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Billing:</span>
                <span className="font-semibold text-slate-900">
                  &#8377;{activePlan?.price || '799'} / month
                </span>
              </div>
              <div className="flex justify-between">
                <span>Next Renewal:</span>
                <span className="font-semibold text-slate-900">
                  {customer?.renewalDate
                    ? new Date(customer.renewalDate).toLocaleDateString()
                    : 'Active Subscription'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Connection Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-bold text-cyan-600 tracking-wider">
                Connection Status
              </span>
              <Activity className="w-4 h-4 text-cyan-600" />
            </div>

            <div className="text-lg font-bold text-slate-900">
              {connection?.status === ConnectionStatus.CONNECTED ? 'Normal Fiber Stream' : 'Monitoring Active'}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Terminal IP:</span>
                <span className="font-mono text-slate-800">{connection?.ipAddress || '192.168.1.102 (Dev)'}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Verified:</span>
                <span className="text-slate-800">
                  {connection?.lastChecked
                    ? new Date(connection.lastChecked).toLocaleTimeString()
                    : 'Just now'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Support Action */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 text-cyan-300">
              <span className="text-[10px] uppercase font-bold tracking-wider">
                Support &amp; Technicians
              </span>
              <LifeBuoy className="w-4 h-4" />
            </div>

            <h3 className="text-lg font-bold">Have an Issue?</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Raise a support ticket directly to alert our dispatch desk.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              onClick={() => setTicketModal(true)}
              className="w-full btn-primary bg-cyan-600 hover:bg-cyan-500 text-xs py-2.5 font-bold justify-center"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Raise Support Ticket</span>
            </button>
          </div>
        </div>

      </div>

      {/* Tabs / Two Columns: Recent Invoices & Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Invoices */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Bills &amp; Invoices</h3>
            </div>
            <span className="text-[11px] text-slate-500">Last 5 Statements</span>
          </div>

          {invoicesData && invoicesData.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {invoicesData.map((inv: any) => (
                <div key={inv.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{inv.invoiceNo}</div>
                    <div className="text-[10px] text-slate-500">
                      Due: {new Date(inv.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900">&#8377;{inv.amount}</div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No bills generated yet for this billing cycle.
            </div>
          )}
        </div>

        {/* Support Tickets */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">My Support Tickets</h3>
            </div>
            <button
              onClick={() => setTicketModal(true)}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              + New Ticket
            </button>
          </div>

          {ticketsData && ticketsData.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {ticketsData.map((t: any) => (
                <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-bold text-slate-900">{t.ticketNo}</div>
                    <div className="text-[11px] text-slate-600">{t.category}</div>
                    <div className="text-[10px] text-slate-400">
                      Opened: {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'RESOLVED' || t.status === 'CLOSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No active or historical support tickets.
            </div>
          )}
        </div>

      </div>

      {/* Ticket Modal */}
      {ticketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Support Ticket</h3>
            <p className="text-xs text-slate-500 mb-4">
              Describe your issue for the field technician team.
            </p>

            {ticketError && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {ticketError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="sv-label">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as TicketCategory)}
                  className="sv-input text-xs"
                >
                  <option value={TicketCategory.INTERNET_NOT_WORKING}>Internet Not Working</option>
                  <option value={TicketCategory.SLOW_INTERNET}>Slow Internet Speed</option>
                  <option value={TicketCategory.WIFI_PROBLEM}>WiFi Range / Coverage</option>
                  <option value={TicketCategory.ROUTER_PROBLEM}>Router Configuration</option>
                  <option value={TicketCategory.CCTV_PROBLEM}>CCTV Problem</option>
                  <option value={TicketCategory.RELOCATION}>Relocation</option>
                  <option value={TicketCategory.OTHER}>Other Technical Issue</option>
                </select>
              </div>

              <div>
                <label className="sv-label">Describe the Issue</label>
                <textarea
                  rows={4}
                  placeholder="Explain the problem in detail..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="sv-input text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTicketModal(false)}
                  className="flex-1 py-2 text-xs border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={ticketMutation.isPending || !ticketMessage}
                  onClick={() => ticketMutation.mutate()}
                  className="flex-1 btn-primary justify-center text-xs py-2 font-bold"
                >
                  {ticketMutation.isPending ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
