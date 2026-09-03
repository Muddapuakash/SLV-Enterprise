import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { Link } from 'react-router-dom';
import {
  Users,
  Activity,
  LifeBuoy,
  Wrench,
  UserCheck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/api/admin/dashboard');
      return res.data.data;
    },
  });

  const stats = dashboardData?.stats || {
    totalCustomers: 0,
    activeConnections: 0,
    openTickets: 0,
    pendingJobs: 0,
    newLeads: 0,
  };

  const recentTickets = dashboardData?.recentTickets || [];
  const recentLeads = dashboardData?.recentLeads || [];

  return (
    <div className="space-y-8">
      <SEO title="Admin Operations Dashboard | SV Enterprises" />

      {/* Header with quick system telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            ISP Operations Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time subscriber status, field dispatches, and incoming connection requests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            Socket.IO Telemetry Active
          </span>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Subscribers</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalCustomers}</div>
          <div className="text-[10px] text-slate-400">Active customer accounts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Links</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.activeConnections}</div>
          <div className="text-[10px] text-slate-400">Online subscriber terminals</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Open Tickets</span>
            <LifeBuoy className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.openTickets}</div>
          <div className="text-[10px] text-slate-400">Requiring dispatch / action</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Field Jobs</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.pendingJobs}</div>
          <div className="text-[10px] text-slate-400">Scheduled / in-progress</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">New Enquiries</span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.newLeads}</div>
          <div className="text-[10px] text-slate-400">Awaiting contact</div>
        </div>

      </div>

      {/* Grid of Two Activity Streams: Recent Enquiries & Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Enquiries &amp; Leads</h3>
              <p className="text-[11px] text-slate-500">Prospective subscribers from public forms</p>
            </div>
            <Link to="/admin/leads" className="text-xs text-blue-600 font-bold hover:underline">
              View All &rarr;
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No recent enquiries logged.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead: any) => (
                <div key={lead.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{lead.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {lead.phone} &bull; {lead.serviceType || 'Internet'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        lead.status === 'NEW'
                          ? 'bg-purple-100 text-purple-800'
                          : lead.status === 'CONVERTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {lead.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Support Tickets */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Support Desk Pipeline</h3>
              <p className="text-[11px] text-slate-500">Customer issues reported</p>
            </div>
            <Link to="/admin/tickets" className="text-xs text-blue-600 font-bold hover:underline">
              Manage Tickets &rarr;
            </Link>
          </div>

          {recentTickets.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No active support tickets.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTickets.map((t: any) => (
                <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-bold text-slate-900">{t.ticketNo}</div>
                    <div className="text-[11px] text-slate-600">{t.category}</div>
                    <div className="text-[10px] text-slate-400">By: {t.guestName || 'Registered Customer'}</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'RESOLVED' || t.status === 'CLOSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {t.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Operational Quick Actions Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Central Operations Management</h4>
            <p className="text-xs text-slate-400">
              Configure broadband plans, manage field technician rosters, and review coverage expansion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/customers"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
          >
            Manage Customers
          </Link>
          <Link
            to="/admin/plans"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
          >
            Manage Plans
          </Link>
        </div>
      </div>

    </div>
  );
}
