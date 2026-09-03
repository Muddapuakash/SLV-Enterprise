import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { Lock, Video, ShieldCheck, HardDrive, Smartphone, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CCTVPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    cameraCount: 4,
    preferredDate: '',
    message: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const cctvMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/cctv-enquiry', {
        name: form.name,
        phone: form.phone,
        location: form.location,
        cameraCount: Number(form.cameraCount),
        preferredDate: form.preferredDate,
        message: form.message,
      });
      return res.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Could not register site visit. Please call 9620406789.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.location) {
      setError('Please provide your name, phone number, and site location.');
      return;
    }
    cctvMutation.mutate();
  };

  return (
    <div className="bg-white">
      <SEO
        title="CCTV Installation & Surveillance Solutions | SV Enterprises Bangalore"
        description="Professional CCTV security camera installation, IP camera setup, NVR recording, and mobile remote monitoring by SV Enterprises in Bangalore."
      />

      {/* Hero */}
      <section className="pt-32 pb-16 hero-bg text-white">
        <div className="container-max section-px">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Surveillance &amp; Security
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              CCTV Camera Installation &amp; Maintenance
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Complete surveillance solutions for apartments, individual houses, retail shops, and commercial facilities. Crystal clear recording and secure remote mobile monitoring.
            </p>
            <div className="pt-6">
              <a href="#site-visit" className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-xs py-3 px-6 shadow-emerald-600/20">
                Request CCTV Site Visit
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core CCTV Solutions */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label">Turnkey Solutions</span>
            <h2 className="section-title">Reliable Surveillance Tailored to Your Site</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <Video className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">High-Definition IP Cameras</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Crisp 2MP to 4K PoE (Power over Ethernet) IP cameras with infrared night vision and wide dynamic range for day and night clarity.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <Lock className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Analog &amp; HD-TVI Systems</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cost-effective analog camera setups and upgrade paths over existing coaxial cabling for budget-conscious properties.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <HardDrive className="w-8 h-8 text-cyan-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">NVR / DVR Storage Setup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Network Video Recorders with surveillance-rated hard drives configured for continuous or motion-triggered 24/7 video retention.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <Smartphone className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Secure Remote Monitoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live viewing configured on your iOS or Android phone with encrypted peer-to-peer tunnels. No credentials exposed or unauthorized third-party feeds.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <ShieldCheck className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Neat Conduit Cabling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Proper PVC casing, weather-proof junction boxes, and concealed wiring to safeguard lines against vandalism, weather, and wear.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <Wrench className="w-8 h-8 text-rose-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Maintenance &amp; Repairs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Camera realignment, power supply replacements, lens cleaning, DVR troubleshooting, and storage capacity upgrades.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CCTV Site Visit Form */}
      <section id="site-visit" className="section-py bg-white">
        <div className="container-max section-px">
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10">
            
            <div className="mb-6 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                Free Site Assessment
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Request CCTV Site Visit
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Our technician will inspect your premises in Bangalore and propose the optimal camera placements.
              </p>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Site Visit Requested!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  We have received your CCTV request for {form.cameraCount} cameras. Our team will call you to confirm technician arrival.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="btn-primary text-xs py-2 px-5 mt-3"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
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

                  <div>
                    <label className="sv-label">Number of Cameras (Est.)</label>
                    <select
                      value={form.cameraCount}
                      onChange={(e) => setForm({ ...form, cameraCount: Number(e.target.value) })}
                      className="sv-input text-xs"
                    >
                      <option value={2}>2 Cameras (Small Shop / House)</option>
                      <option value={4}>4 Cameras (Standard Home / Office)</option>
                      <option value={8}>8 Cameras (Apartment / Store)</option>
                      <option value={16}>16+ Cameras (Commercial Facility)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="sv-label">Installation Location / Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vijinapura, near FCI Main Road"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="sv-input text-xs"
                  />
                </div>

                <div>
                  <label className="sv-label">Preferred Date for Visit</label>
                  <input
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    className="sv-input text-xs"
                  />
                </div>

                <div>
                  <label className="sv-label">Additional Requirements (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Any specific instructions (e.g. Need night-vision for parking area, mobile view on 2 phones)..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="sv-input text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={cctvMutation.isPending}
                    className="btn-primary bg-emerald-600 hover:bg-emerald-700 w-full justify-center py-3 text-xs font-bold"
                  >
                    {cctvMutation.isPending ? 'Submitting...' : 'Book Free Site Survey'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>

    </div>
  );
}
