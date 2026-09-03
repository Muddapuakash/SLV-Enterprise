import SEO from '../../components/common/SEO';
import { Link } from 'react-router-dom';
import { Zap, CheckCircle2, ShieldCheck, ArrowRight, Activity, Download, Upload } from 'lucide-react';
import { getWhatsAppUrl } from '../../services/whatsapp';

export default function InternetPage() {
  const whatsappUrl = getWhatsAppUrl({}, 'Hello SV Enterprises! I want to get high-speed fiber internet.');

  return (
    <div className="bg-white">
      <SEO
        title="High-Speed Fiber Internet | SV Enterprises Bangalore"
        description="Reliable FTTH broadband internet connectivity for homes and businesses across Bangalore. Symmetrical speeds, low latency, and direct technician support."
      />

      {/* Hero */}
      <section className="pt-32 pb-16 hero-bg text-white">
        <div className="container-max section-px">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Broadband Services
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              High-Speed Fiber Internet
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Engineered for seamless 4K streaming, remote work videoconferencing, lag-free online gaming, and uninterrupted commercial workflows.
            </p>
            <div className="pt-6 flex flex-wrap gap-4">
              <Link to="/plans" className="btn-primary text-xs py-3 px-6">
                <span>View Broadband Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/request-service" className="btn-outline text-xs py-3 px-6 bg-white/5 text-white border-white/30 hover:bg-white/15">
                <span>Request Connection</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-label">Why Choose Our Fiber</span>
            <h2 className="section-title">Built on Modern FTTH Architecture</h2>
            <p className="section-subtitle mx-auto">
              Pure optical fiber straight to your premises ensures immunity to electrical interference and consistent throughput.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Symmetrical Speeds</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enjoy matched download and upload capabilities — essential for large cloud backups, video calls, and responsive browsing.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Ultra-Low Latency</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optimized routing paths minimize ping jitter, delivering smooth connections for Microsoft Teams, Zoom, and real-time platforms.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Local Physical Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When physical wire maintenance is needed, our Bangalore technicians are already stationed in the area for rapid resolution.
              </p>
            </div>
          </div>

          {/* Quick Comparison Card */}
          <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Internet Use Cases We Support:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-700">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Apartments &amp; Homes</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Work-From-Home Professionals</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Offices &amp; Commercial Spaces</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Retail Stores &amp; Clinics</span>
              </div>
            </div>
          </div>

          {/* Action Strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/plans" className="btn-primary text-xs py-3 px-6">
              View All Internet Plans
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold"
            >
              Ask on WhatsApp
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}
