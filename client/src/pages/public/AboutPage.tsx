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
              <div className="flex items-center gap-2">
                <span className="section-label">Who We Are</span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  ISP &amp; Network Solutions Dealer
                </span>
              </div>
              <h2 className="section-title">Your Trusted Broadband &amp; Network Infrastructure Partner</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                SV Enterprises is a commercial business operating as a high-speed Internet Service Provider (ISP) and specialized network solutions dealer based in Bengaluru. We specialize in high-speed fiber broadband, CCTV camera networking, office LAN setup, and structural network cabling.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Through our strategic broadband partnerships with India&apos;s leading providers like <strong>Hathway</strong> and <strong>Excitel</strong>, we deliver robust, high-throughput internet connectivity. Beyond broadband, our field engineers execute complex network infrastructure projects — including precision fiber-optic splicing, chamber installations, enterprise routing &amp; switches, and complete surveillance setups with CCTV, DVR, and NVR systems.
              </p>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Official Bengaluru Headquarters:</span>
                    <p className="text-slate-700 font-medium mt-0.5">
                      Krishnamurti Building, No. 127, 3rd Cross, near FCI Main Road, Vijinapura, Dooravani Nagar, Bengaluru, Karnataka &ndash; 560016
                    </p>
                    <p className="text-blue-800 font-semibold mt-1">
                      📍 Landmark: Directly opposite FCI Godown (Food Corporation of India) &amp; in close proximity to Balamurli Temple.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-xl space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Core Credentials</span>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-1">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    Verified Dealer &amp; Operator
                  </h3>
                </div>
                <ul className="space-y-4 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Authorized ISP Partnerships:</strong> Official partnerships with Hathway and Excitel for high-speed fiber internet distribution.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Network Infrastructure:</strong> Premium routing, enterprise switches, fiber-optic fusion splicing, and chamber installations.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Surveillance Deployments:</strong> Complete CCTV, DVR, and NVR security systems with mobile live-stream monitoring.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Rapid Physical Ground Support:</strong> On-call field technicians in Vijinapura, Dooravani Nagar &amp; Bengaluru East.</span>
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
            <h2 className="section-title">End-to-End Technology &amp; Network Services</h2>
            <p className="section-subtitle mx-auto">
              Our service portfolio covers the complete connectivity, security, and infrastructure lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="sv-card p-6 bg-white rounded-2xl border border-slate-200">
              <Zap className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Fiber Broadband (FTTH)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-speed fiber broadband in partnership with Hathway and Excitel. Symmetrical speeds, low latency, and unlimited data.
              </p>
            </div>

            <div className="sv-card p-6 bg-white rounded-2xl border border-slate-200">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">CCTV, DVR &amp; NVR Systems</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Surveillance system installations involving HD IP cameras, DVR/NVR storage configurations, and remote mobile viewing.
              </p>
            </div>

            <div className="sv-card p-6 bg-white rounded-2xl border border-slate-200">
              <Users className="w-8 h-8 text-cyan-600 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Office LAN &amp; WiFi Setup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enterprise WiFi access points, mesh networks, VLAN configurations, and full-premise coverage for offices and businesses.
              </p>
            </div>

            <div className="sv-card p-6 bg-white rounded-2xl border border-slate-200">
              <Target className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Cabling &amp; Splicing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                CAT6 structured cabling, fiber-optic fusion splicing, chamber installations, server racks, and routing switch infrastructure.
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
