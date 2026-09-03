import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { CheckCircle2, Zap, Wifi, Lock, Server, Wrench, HelpCircle, Phone, AlertCircle } from 'lucide-react';
import { ServiceType } from '@sv/shared';

const serviceOptions = [
  { id: ServiceType.INTERNET, label: 'High-Speed Internet', icon: Zap, color: 'text-blue-600 bg-blue-50' },
  { id: ServiceType.WIFI, label: 'WiFi Installation / Setup', icon: Wifi, color: 'text-cyan-600 bg-cyan-50' },
  { id: ServiceType.CCTV, label: 'CCTV Security System', icon: Lock, color: 'text-emerald-600 bg-emerald-50' },
  { id: ServiceType.CABLING, label: 'Structured Cabling / LAN', icon: Server, color: 'text-purple-600 bg-purple-50' },
  { id: ServiceType.ROUTER, label: 'Router Configuration', icon: Wrench, color: 'text-amber-600 bg-amber-50' },
  { id: ServiceType.OTHER, label: 'Other Network Requirement', icon: HelpCircle, color: 'text-slate-600 bg-slate-100' },
];

export default function RequestServicePage() {
  const [selectedService, setSelectedService] = useState<ServiceType>(ServiceType.INTERNET);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    area: '',
    pincode: '',
    description: '',
    preferredDate: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/service-requests', {
        ...form,
        serviceType: selectedService,
        preferredDate: form.preferredDate ? new Date(form.preferredDate).toISOString() : undefined,
      });
      return res.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Could not submit request. Please call 9620406789.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.location || !form.description) {
      setError('Please fill in your name, phone number, location, and requirement details.');
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="bg-white">
      <SEO
        title="Request Service & Installation | SV Enterprises Bangalore"
        description="Book a new fiber internet connection, WiFi setup, CCTV installation, or network cabling service with SV Enterprises in Bangalore."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-14 hero-bg text-white">
        <div className="container-max section-px text-center">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Service Booking
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Request a Service or Installation
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Tell us what you need and our Bangalore dispatch team will coordinate the site survey or installation.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
              
              {success ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Request Received!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{form.name}</strong>. Your service request for <strong>{selectedService}</strong> has been logged into our operational system. Our team will contact you at <strong>{form.phone}</strong>.
                  </p>
                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <a
                      href="tel:9620406789"
                      className="btn-primary text-xs py-2 px-6"
                    >
                      Call Dispatch: 9620406789
                    </a>
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setForm({
                          name: '',
                          phone: '',
                          email: '',
                          location: '',
                          area: '',
                          pincode: '',
                          description: '',
                          preferredDate: '',
                        });
                      }}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Service Selection */}
                  <div className="mb-6">
                    <label className="sv-label text-sm font-bold text-slate-900 mb-3 block">
                      1. Select Required Service:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {serviceOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedService(opt.id)}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                            selectedService === opt.id
                              ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${opt.color}`}>
                            <opt.icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold text-slate-800">
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact & Location Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="sv-label text-sm font-bold text-slate-900 block">
                      2. Enter Contact &amp; Site Details:
                    </label>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="sv-label">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Kumar"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="sv-input text-xs"
                        />
                      </div>

                      <div>
                        <label className="sv-label">Contact Phone *</label>
                        <input
                          type="tel"
                          required
                          maxLength={15}
                          placeholder="e.g. 9620406789"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="sv-input text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="sv-label">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="e.g. ramesh@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="sv-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="sv-label">Site Address / Landmark *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Flat 302, 3rd Cross near FCI Main Road"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="sv-input text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="sv-label">Area</label>
                        <input
                          type="text"
                          placeholder="e.g. Vijinapura / Dooravani Nagar"
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
                          placeholder="e.g. 560016"
                          value={form.pincode}
                          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                          className="sv-input text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="sv-label">Preferred Date for Visit / Installation</label>
                      <input
                        type="date"
                        value={form.preferredDate}
                        onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                        className="sv-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="sv-label">Problem / Requirement Description *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Describe your requirement in detail (e.g. Need high-speed connection for 3 computers, or need 4 CCTV cameras installed with mobile view)..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="sv-input text-xs"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="btn-primary w-full justify-center py-3 text-xs font-bold"
                      >
                        {mutation.isPending ? 'Sending Request...' : 'Submit Service Request'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

            <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Need immediate assistance? Call our Bangalore desk at <strong>9620406789</strong> / <strong>6302249065</strong></span>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
