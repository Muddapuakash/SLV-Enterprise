import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import {
  LifeBuoy,
  Wifi,
  Zap,
  Lock,
  Wrench,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  Phone,
  Copy,
  Check,
} from 'lucide-react';
import { TicketCategory } from '@sv/shared';

const categories = [
  { id: TicketCategory.INTERNET_NOT_WORKING, label: 'Internet Not Working', icon: Zap, color: 'text-rose-600 bg-rose-50' },
  { id: TicketCategory.SLOW_INTERNET, label: 'Slow Internet', icon: Wifi, color: 'text-amber-600 bg-amber-50' },
  { id: TicketCategory.WIFI_PROBLEM, label: 'WiFi Problem', icon: Wifi, color: 'text-blue-600 bg-blue-50' },
  { id: TicketCategory.ROUTER_PROBLEM, label: 'Router Problem', icon: Wrench, color: 'text-indigo-600 bg-indigo-50' },
  { id: TicketCategory.CCTV_PROBLEM, label: 'CCTV Problem', icon: Lock, color: 'text-purple-600 bg-purple-50' },
  { id: TicketCategory.NEW_CONNECTION, label: 'New Connection', icon: PlusCircle, color: 'text-emerald-600 bg-emerald-50' },
  { id: TicketCategory.RELOCATION, label: 'Relocation Request', icon: RotateCcw, color: 'text-cyan-600 bg-cyan-50' },
  { id: TicketCategory.OTHER, label: 'Other General Inquiry', icon: HelpCircle, color: 'text-slate-600 bg-slate-100' },
];

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory>(TicketCategory.INTERNET_NOT_WORKING);
  const [form, setForm] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    message: '',
  });

  const [ticketResult, setTicketResult] = useState<{ ticketNo: string; id: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const ticketMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/tickets', {
        ...form,
        category: selectedCategory,
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      setTicketResult(data);
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Could not register ticket. Please call 9620406789.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName || !form.guestPhone || !form.message) {
      setError('Please fill in your name, phone number, and issue details.');
      return;
    }
    ticketMutation.mutate();
  };

  const copyTicket = () => {
    if (ticketResult?.ticketNo) {
      navigator.clipboard.writeText(ticketResult.ticketNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white">
      <SEO
        title="Support & Helpdesk | SV Enterprises Bangalore"
        description="Raise a technical support ticket for broadband, WiFi, or CCTV problems with SV Enterprises Bangalore. Prompt field technician dispatch."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-14 hero-bg text-white">
        <div className="container-max section-px text-center">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Help Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            How Can We Help You?
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Report a connectivity issue or service requirement. Our dispatch engineers track each ticket in real-time.
          </p>
        </div>
      </section>

      {/* Main Support Form */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          
          <div className="max-w-3xl mx-auto">
            
            {ticketResult ? (
              <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-md text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Ticket Successfully Registered
                </span>
                
                <h3 className="text-2xl font-black text-slate-900">
                  Your Support Ticket Number
                </h3>

                {/* Ticket Badge Box */}
                <div className="inline-flex items-center gap-3 p-4 bg-slate-900 text-white rounded-xl shadow-inner font-mono text-xl sm:text-2xl font-bold">
                  <span>{ticketResult.ticketNo}</span>
                  <button
                    onClick={copyTicket}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-sans text-slate-300 transition-colors flex items-center gap-1.5"
                    title="Copy Ticket ID"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
                  Our technical dispatch desk has received your ticket and alerted the technician for your area. We will contact you at <strong>{form.guestPhone}</strong>.
                </p>

                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <a
                    href="tel:9620406789"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Dispatch: 9620406789</span>
                  </a>
                  <button
                    onClick={() => {
                      setTicketResult(null);
                      setForm({ guestName: '', guestPhone: '', guestEmail: '', message: '' });
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    Raise Another Ticket
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
                
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    1. Select the Issue Category
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          selectedCategory === cat.id
                            ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${cat.color}`}>
                          <cat.icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-slate-800 leading-snug">
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 pt-2 border-t border-slate-100">
                    2. Provide Your Contact Details
                  </h3>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="sv-label">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={form.guestName}
                        onChange={(e) => setForm({ ...form, guestName: e.target.value })}
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
                        value={form.guestPhone}
                        onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                        className="sv-input text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="sv-label">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={form.guestEmail}
                      onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                      className="sv-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="sv-label">Describe the Problem *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please explain the issue (e.g. Red light on router / No WiFi signal in back room / CCTV feed not visible on phone app)..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="sv-input text-xs"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={ticketMutation.isPending}
                      className="btn-primary w-full justify-center py-3 text-xs font-bold"
                    >
                      {ticketMutation.isPending ? 'Generating Ticket...' : 'Submit Support Ticket'}
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* Helpline Banner */}
            <div className="mt-8 p-6 rounded-2xl bg-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <LifeBuoy className="w-8 h-8 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">Urgent Network Emergency?</h4>
                  <p className="text-xs text-slate-400">Directly contact our local Bangalore dispatch desk</p>
                </div>
              </div>
              <a
                href="tel:9620406789"
                className="btn-primary bg-blue-600 hover:bg-blue-500 text-xs py-2.5 px-5 shrink-0"
              >
                Call 9620406789
              </a>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
