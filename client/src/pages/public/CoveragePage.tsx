import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { CheckCircle2, XCircle, MapPin, Search, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { CoverageCheckResult } from '@sv/shared';

export default function CoveragePage() {
  const [searchParams] = useSearchParams();
  const initialPincode = searchParams.get('pincode') || '';

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    area: '',
    pincode: initialPincode,
  });

  const [result, setResult] = useState<CoverageCheckResult | null>(null);
  const [checked, setChecked] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);

  // Coverage check mutation
  const checkMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/coverage/check', {
        pincode: form.pincode,
        area: form.area,
      });
      return res.data.data as CoverageCheckResult;
    },
    onSuccess: async (data) => {
      setResult(data);
      setChecked(true);

      // If user provided name & phone, save lead in DB
      if (form.name && form.phone) {
        try {
          await api.post('/api/leads', {
            name: form.name,
            phone: form.phone,
            address: form.address,
            area: form.area,
            pincode: form.pincode,
            notes: `Coverage Checked for Pincode ${form.pincode}. Available: ${data.available}`,
          });
          setLeadSaved(true);
        } catch {
          // ignore background lead save failure
        }
      }
    },
  });

  // Auto-run if pincode provided via query string
  useEffect(() => {
    if (initialPincode && initialPincode.length === 6) {
      checkMutation.mutate();
    }
  }, [initialPincode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pincode || form.pincode.length !== 6) return;
    checkMutation.mutate();
  };

  return (
    <div className="bg-white">
      <SEO
        title="Check Coverage & Availability | SV Enterprises Bangalore"
        description="Verify high-speed fiber internet and WiFi availability in your Bangalore neighborhood with SV Enterprises."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-14 hero-bg text-white">
        <div className="container-max section-px text-center">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Network Reach
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Check Availability in Your Area
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Enter your Bangalore pincode and address details below to verify if SV Enterprises fiber internet is live on your street.
          </p>
        </div>
      </section>

      {/* Checker Section */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="sv-label">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Suresh Gowda"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="sv-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="sv-label">Phone Number</label>
                    <input
                      type="tel"
                      maxLength={15}
                      placeholder="e.g. 9620406789"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="sv-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="sv-label">Installation Address / Street</label>
                  <input
                    type="text"
                    placeholder="e.g. 3rd Cross near FCI Main Road"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="sv-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="sv-label">Area / Locality</label>
                    <input
                      type="text"
                      placeholder="e.g. Vijinapura, Dooravani Nagar"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      className="sv-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="sv-label">6-Digit Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 560016"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      className="sv-input text-xs font-mono font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={checkMutation.isPending}
                    className="btn-primary w-full justify-center py-3 text-sm font-bold flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>{checkMutation.isPending ? 'Verifying Feasibility...' : 'Check Coverage'}</span>
                  </button>
                </div>
              </form>

              {/* Coverage Result Card */}
              {checked && result && (
                <div className="mt-8 pt-8 border-t border-slate-100 animate-fade-in">
                  {result.available ? (
                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold">Good News! Service is Available</h4>
                          <p className="text-xs text-emerald-700">
                            SV Enterprises high-speed network covers pincode <strong>{form.pincode}</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 text-xs space-y-1">
                        <div className="font-semibold text-emerald-950">Services ready for installation:</div>
                        <ul className="list-disc list-inside text-emerald-800 space-y-0.5">
                          <li>FTTH High-Speed Fiber Broadband</li>
                          <li>Dual-band WiFi Setup &amp; Router Configuration</li>
                          <li>CCTV Security Systems &amp; Remote Viewing</li>
                          <li>Structured Ethernet Cabling</li>
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <Link to="/plans" className="btn-primary text-xs py-2 px-5">
                          View Available Plans &rarr;
                        </Link>
                        <Link to="/request-service" className="btn-outline text-xs py-2 px-5">
                          Request Installation
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                          <XCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold">Currently Expanding to This Area</h4>
                          <p className="text-xs text-amber-800">
                            We do not currently have an active distribution point at pincode <strong>{form.pincode}</strong>.
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-amber-800 leading-relaxed">
                        We are continuously laying fiber lines across Bangalore. If you left your phone number above, our dispatch desk has noted your interest and will reach out when fiber nodes reach your road.
                      </p>

                      <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-amber-900">
                        <Phone className="w-4 h-4 text-amber-700" />
                        <span>Have a commercial or custom fiber requirement? Call 9620406789.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Active Core Hubs Info */}
            <div className="mt-10 p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Primary Operational Hubs:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                SV Enterprises maintains direct fiber trunk connections in <strong>Vijinapura, Dooravani Nagar, FCI Main Road, and surrounding Bangalore East neighborhoods (Pincode 560016)</strong>.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
