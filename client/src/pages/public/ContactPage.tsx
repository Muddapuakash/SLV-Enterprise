import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { getWhatsAppUrl } from '../../services/whatsapp';
import { Phone, Mail, MapPin, MessageCircle, Navigation, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const whatsappUrl = getWhatsAppUrl(
    {},
    'Hello SV Enterprises! I would like to get in touch regarding your connectivity services.'
  );

  const contactMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/leads', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        notes: `Contact Form Message: ${form.message}`,
        source: 'contact_page',
      });
      return res.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setError('');
      setForm({ name: '', phone: '', email: '', message: '' });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to submit. Please call us directly.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setError('Name and Phone number are required.');
      return;
    }
    contactMutation.mutate();
  };

  return (
    <div className="bg-white">
      <SEO
        title="Contact SV Enterprises | Bangalore ISP & Networking Support"
        description="Get in touch with SV Enterprises Bangalore for internet connection, WiFi installation, CCTV security systems, and network cabling inquiries."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-14 hero-bg text-white">
        <div className="container-max section-px text-center">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Direct Assistance
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Contact SV Enterprises
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Need high-speed fiber broadband, CCTV installation, or office network cabling? Reach our Bangalore team directly.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Verified Business Info & Direct Action Buttons */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Official Headquarters
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">SV Enterprises (ISP)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">High Speed Internet &bull; CCTV &bull; Cabling &bull; WiFi</p>
                </div>

                <div className="space-y-4 text-sm text-slate-700 pt-2 border-t border-slate-100">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Office Address:</div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        3rd Cross near FCI Main Road,<br />
                        Vijinapura Dooravani Nagar,<br />
                        Bangalore, Karnataka 560016
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Phone Numbers:</div>
                      <div className="flex flex-col gap-1 text-xs text-slate-600 mt-0.5">
                        <a href="tel:9620406789" className="hover:text-blue-600 font-medium">
                          +91 9620406789 (Primary Helpline)
                        </a>
                        <a href="tel:6302249065" className="hover:text-blue-600 font-medium">
                          +91 6302249065 (Support Desk)
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Official Email:</div>
                      <a
                        href="mailto:sventerprises161718@gmail.com"
                        className="text-xs text-blue-600 hover:underline break-all"
                      >
                        sventerprises161718@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Direct Action Grid */}
                <div className="pt-4 grid grid-cols-2 gap-3 border-t border-slate-100">
                  <a
                    href="tel:9620406789"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="mailto:sventerprises161718@gmail.com"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    <Mail className="w-4 h-4 text-slate-600" />
                    <span>Email Us</span>
                  </a>

                  <a
                    href="https://maps.google.com/?q=Vijinapura+Dooravani+Nagar+Bangalore+560016"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    <Navigation className="w-4 h-4 text-slate-600" />
                    <span>Get Directions</span>
                  </a>
                </div>

              </div>

              {/* Working Hours Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Support &amp; Installation Hours</span>
                </div>
                <p>Monday &ndash; Saturday: 9:00 AM to 8:00 PM</p>
                <p>Sunday: Emergency &amp; Scheduled Technician Dispatches</p>
              </div>

            </div>

            {/* Right: Message / Connection Enquiry Form */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                
                <h3 className="text-xl font-bold text-slate-900 mb-1">Send Us a Message</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Have a question about internet availability, CCTV site inspection, or pricing? Drop your note below.
                </p>

                {success ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="text-base font-bold text-emerald-950">Message Submitted!</h4>
                    <p className="text-xs text-emerald-800">
                      Thank you! Our Bangalore support team will contact you shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="btn-primary text-xs py-2 px-5 mt-2"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                        {error}
                      </div>
                    )}

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="sv-label">Phone Number *</label>
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

                      <div>
                        <label className="sv-label">Email (Optional)</label>
                        <input
                          type="email"
                          placeholder="e.g. name@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="sv-input text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="sv-label">How Can We Help You? *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us about your requirement (e.g. Need 100 Mbps broadband at Dooravani Nagar / Need CCTV installation for 4 cameras)..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="sv-input text-xs"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={contactMutation.isPending}
                        className="btn-primary w-full justify-center py-3 text-xs font-bold"
                      >
                        {contactMutation.isPending ? 'Sending Message...' : 'Submit Inquiry'}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
