import SEO from '../../components/common/SEO';
import { Link } from 'react-router-dom';
import { Server, Cpu, CheckCircle2, ArrowRight, ShieldCheck, Layers, Cable } from 'lucide-react';

export default function CablingPage() {
  return (
    <div className="bg-white">
      <SEO
        title="Structured Network Cabling & Server Racks | SV Enterprises"
        description="Professional structured CAT6 LAN cabling, fiber optic splicing, patch panel termination, and server rack installation by SV Enterprises in Bangalore."
      />

      {/* Hero */}
      <section className="pt-32 pb-16 hero-bg text-white">
        <div className="container-max section-px">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Physical Infrastructure
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Structured Network Cabling
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Professional CAT6 LAN wiring, fiber optic splicing, patch panel punch-downs, switch configurations, and server rack installations for Bangalore offices and commercial facilities.
            </p>
            <div className="pt-6">
              <Link to="/request-service" className="btn-primary bg-purple-600 hover:bg-purple-700 text-xs py-3 px-6 shadow-purple-600/25">
                <span>Request Site Survey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Capabilities */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label">Infrastructure Standards</span>
            <h2 className="section-title">Reliable Wiring Engineered to Last</h2>
            <p className="section-subtitle mx-auto">
              Messy wires cause packet loss, network drops, and maintenance nightmares. We ensure neat conduits, proper labeling, and certified throughput.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <Cable className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">CAT6 &amp; CAT6A LAN Cabling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gigabit-certified copper twisted pair cabling for desktop workstations, POS terminals, and conference rooms.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <Layers className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Fiber Optic Backbone</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Single-mode and multi-mode fiber runs between building floors, distribution switches, and outdoor campuses with precision fusion splicing.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <Server className="w-8 h-8 text-cyan-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Server Rack &amp; Patch Panels</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                4U to 42U server rack mounting, wire dressing, keystone jack termination, and cable comb organization for neat IT rooms.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <Cpu className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Switch &amp; Router Mounting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Managed and unmanaged PoE switch deployment, VLAN segmentation, and clean power cabling with UPS backups.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <ShieldCheck className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">CCTV RG59 &amp; PoE Wiring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated surveillance cabling runs in separate conduits to eliminate electromagnetic noise and cross-talk.
              </p>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-rose-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Cable Testing &amp; Numbering</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every port is continuity tested, mapped to patch panel numbers, and clearly tagged for immediate troubleshooting.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link to="/request-service" className="btn-primary bg-purple-600 hover:bg-purple-700 text-xs py-3 px-8 rounded-xl shadow-md">
              Schedule Commercial Cabling Survey
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
