import SEO from '../../components/common/SEO';
import { ShieldCheck, Zap, Users, Target, HeartHandshake, MapPin, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <SEO
        title="About Us | SV Enterprises — Internet & Networking Solutions"
        description="Learn about SV Enterprises, a dedicated local internet service provider and technology infrastructure specialist based in Bangalore."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-16 hero-bg text-white relative">
        <div className="container-max section-px">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              About SV Enterprises
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Connecting People. <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Powering Possibilities.
              </span>
            </h1>
            <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-2xl">
              SV Enterprises is a dedicated connectivity and technology service provider based in Bangalore, delivering high-speed broadband, WiFi optimization, CCTV security systems, and structured networking infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section-py bg-white">
        <div className="container-max section-px">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <span className="section-label">Who We Are</span>
              <h2 className="section-title">Your Local Connectivity &amp; Networking Partner</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Operating out of Vijinapura, Dooravani Nagar in Bangalore, SV Enterprises was established to deliver genuine high-speed internet and complete networking solutions to residences, retail shops, and commercial offices.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Unlike distant national call centers where service requests get lost in ticketing queues, our team works directly on the ground. We handle everything from fiber line pulls to in-home WiFi configuration, CCTV camera deployments, and enterprise server rack cabling.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Headquartered in Bangalore:</span>
                  3rd Cross near FCI Main Road, Vijinapura Dooravani Nagar, Bangalore, Karnataka 560016
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-xl space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  Verified Business Philosophy
                </h3>
                <ul className="space-y-4 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Prompt Physical Support:</strong> When your connection needs attention, our local field technicians resolve it on-site.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Transparent Solutions:</strong> Honest plan recommendations matching your actual bandwidth needs without hidden conditions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>End-to-End Execution:</strong> From core cabling to end-device connectivity, everything is handled by our team.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-label">What We Do</span>
            <h2 className="section-title">End-to-End Technology Services</h2>
            <p className="section-subtitle mx-auto">
              Our service portfolio covers the entire connectivity lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="sv-card p-6 bg-white rounded-2xl border border-slate-100">
              <Zap className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Broadband &amp; Fiber Internet</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Delivering high-throughput fiber optic broadband to residential apartments, independent homes, and corporate offices with low latency.
              </p>
            </div>

            <div className="sv-card p-6 bg-white rounded-2xl border border-slate-100">
              <Users className="w-8 h-8 text-cyan-600 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">WiFi &amp; Local Area Networks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full-premise WiFi planning, dual-band and mesh router setups, access point installations, and network performance tuning.
              </p>
            </div>

            <div className="sv-card p-6 bg-white rounded-2xl border border-slate-100">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">CCTV &amp; Infrastructure Cabling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Commercial and residential security camera installations with NVR storage, alongside structured CAT6 and optical fiber cabling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach & Our Commitment */}
      <section className="section-py bg-white">
        <div className="container-max section-px">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            <div className="p-8 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Approach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We believe reliable internet isn't just about megabits — it's about properly laid cables, correctly positioned access points, clean router configurations, and prompt technician attendance when issues arise. Every installation is treated as a lasting relationship.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-cyan-50/60 border border-cyan-100 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Commitment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To provide verified, dependable service with zero deceptive marketing. What we quote is what you receive. Whenever you need support, you talk to real technicians who know the Bangalore neighborhood infrastructure.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link to="/contact" className="btn-primary text-sm py-3 px-8 rounded-xl">
              Connect With Our Team
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
