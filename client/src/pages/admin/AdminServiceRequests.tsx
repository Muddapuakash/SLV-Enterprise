import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { FileText, Phone, MapPin, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminServiceRequests() {
  const { data: requestResponse, isLoading } = useQuery({
    queryKey: ['admin-service-requests'],
    queryFn: async () => {
      const res = await api.get('/api/admin/service-requests');
      return res.data.data;
    },
  });

  const requests = requestResponse?.data || [];

  return (
    <div className="space-y-6">
      <SEO title="Service Requests | Admin Console" />

      <div>
        <h1 className="text-xl font-bold text-slate-900">Service Requests</h1>
        <p className="text-xs text-slate-500">
          Bookings submitted via the public "Request a Service" form
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 skeleton" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No service requests received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Service Required</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Preferred Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {requests.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{r.name}</div>
                      <div className="text-[11px] text-blue-600 font-semibold">{r.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {r.serviceType}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <div>{r.location}</div>
                      <div className="text-[10px] text-slate-400">{r.area} {r.pincode}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm truncate text-slate-600">
                      {r.description}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {r.preferredDate ? new Date(r.preferredDate).toLocaleDateString() : 'Immediate'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
