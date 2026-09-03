import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { CheckCircle2, Zap, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { PlanDTO } from '@sv/shared';

export default function PlansPage() {
  const [searchParams] = useSearchParams();
  const selectedPlanId = searchParams.get('select');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanDTO | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    pincode: '',
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch plans from backend API
  const { data: plansData, isLoading, error } = useQuery<{ data: PlanDTO[] }>({
    queryKey: ['plans'],
    queryFn: async () => {
      const res = await api.get('/api/plans');
      return res.data;
    },
  });

  const plans = plansData?.data || [];

  // Auto-select plan from URL param if present
  useEffect(() => {
    if (selectedPlanId && plans.length > 0) {
      const found = plans.find((p) => p.id === selectedPlanId);
      if (found) {
        setSelectedPlan(found);
        setModalOpen(true);
      }
    }
  }, [selectedPlanId, plans]);

  // Lead submission mutation
  const leadMutation = useMutation({
    mutationFn: async (data: typeof formData & { planId?: string }) => {
      const res = await api.post('/api/leads', {
        ...data,
        serviceType: 'INTERNET',
      });
      return res.data;
    },
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError('');
    },
    onError: (err: any) => {
      setSubmitError(err.response?.data?.message || 'Failed to submit enquiry. Please call us directly.');
    },
  });

  const handleOpenPlanModal = (plan: PlanDTO) => {
    setSelectedPlan(plan);
    setSubmitSuccess(false);
    setSubmitError('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setSubmitError('Name and Phone are required.');
      return;
    }
    leadMutation.mutate({
      ...formData,
      planId: selectedPlan?.id,
    });
  };

  return (
    <div className="bg-white">
      <SEO
        title="Internet Plans & Tariffs | SV Enterprises Bangalore"
        description="Explore high-speed broadband internet plans in Bangalore by SV Enterprises. Unlimited fiber broadband with low latency and dedicated customer support."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-14 hero-bg text-white">
        <div className="container-max section-px text-center">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Broadband Plans
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            High-Speed Internet Tariffs
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Fast, stable, and truly unlimited fiber broadband plans tailored for residences, work-from-home professionals, and commercial setups.
          </p>
        </div>
      </section>

      {/* Plans Section */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 skeleton" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-red-200 p-8">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">Could not load plans</h3>
              <p className="text-xs text-slate-600 mt-1">Please call 9620406789 for current plan details.</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-sm text-slate-600">No active plans currently listed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`sv-card rounded-2xl p-6 flex flex-col justify-between relative bg-white ${
                    plan.isPopular
                      ? 'border-2 border-blue-600 ring-4 ring-blue-500/10 shadow-lg'
                      : 'border border-slate-200'
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-3 rounded-full shadow-sm">
                      Recommended
                    </span>
                  )}

                  <div>
                    {plan.isSample && (
                      <span className="badge-sample mb-2">Sample Plan</span>
                    )}

                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>

                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold text-blue-700 tracking-tight">
                        {plan.speed}
                      </span>
                    </div>

                    <div className="mt-2 text-2xl font-black text-slate-900">
                      &#8377;{plan.price}
                      <span className="text-xs font-normal text-slate-500">
                        {' '}
                        / {plan.billingCycle?.toLowerCase() || 'month'}
                      </span>
                    </div>

                    <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
                      Free Standard Installation Available
                    </div>

                    <ul className="mt-6 space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
                      {plan.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenPlanModal(plan)}
                      className={`w-full py-3 rounded-xl text-center text-xs font-bold transition-all shadow-sm ${
                        plan.isPopular
                          ? 'btn-primary justify-center'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700'
                      }`}
                    >
                      Get This Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Value Highlights */}
          <div className="mt-16 p-8 rounded-2xl bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 text-center">
              All SV Enterprises Internet Plans Include:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Unlimited Data Usage with No Speed Throttling</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0" />
                <span>Standard Optical Fiber Terminal Setup</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Equal Symmetrical Upload &amp; Download</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
                <span>Prompt Local Field Technician Dispatch</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          PLAN CONNECTION / ENQUIRY MODAL
          ============================================================ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Enquiry Received!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Thank you for choosing SV Enterprises. Our Bangalore team will reach out at <strong>{formData.phone}</strong> shortly to confirm feasibility and schedule installation.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="btn-primary text-xs py-2 px-6"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    New Connection Request
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Get {selectedPlan?.name} ({selectedPlan?.speed})
                  </h3>
                  <p className="text-xs text-slate-500">
                    &#8377;{selectedPlan?.price} / month &bull; Fill your details for connection feasibility.
                  </p>
                </div>

                {submitError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="sv-label">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="sv-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="sv-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      placeholder="e.g. 9620406789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="sv-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="sv-label">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="e.g. user@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="sv-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="sv-label">Installation Address</label>
                    <textarea
                      rows={2}
                      placeholder="Building, Flat No, Street..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="sv-input text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="sv-label">Area</label>
                      <input
                        type="text"
                        placeholder="e.g. Vijinapura"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="sv-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="sv-label">Pincode</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 560016"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="sv-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={leadMutation.isPending}
                      className="btn-primary w-full justify-center text-xs py-3 font-bold"
                    >
                      {leadMutation.isPending ? 'Submitting...' : 'Submit Connection Request'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
