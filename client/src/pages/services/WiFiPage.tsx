import SEO from '../../components/common/SEO';
import { Link } from 'react-router-dom';
import { Wifi, Router as RouterIcon, Smartphone, Laptop, CheckCircle2, ArrowRight, Zap, Radio, Sliders } from 'lucide-react';

export default function WiFiPage() {
  return (
    <div className="bg-white">
      <SEO
        title="WiFi Installation & Coverage Optimization | SV Enterprises"
        description="Eliminate WiFi dead zones with professional router configuration, mesh access point installation, and home/office WiFi optimization by SV Enterprises Bangalore."
      />

      {/* Hero */}
      <section className="pt-32 pb-16 hero-bg text-white">
        <div className="container-max section-px">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Wireless Networking
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              WiFi Installation &amp; Optimization
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              From dead-spot elimination in multi-story homes to seamless roaming in commercial offices, we configure high-performance wireless networks.
            </p>
            <div className="pt-6">
              <Link to="/request-service" className="btn-primary text-xs py-3 px-6">
                <span>Request WiFi Installation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Flow: Router -> WiFi -> Devices */}
      <section className="py-12 bg-slate-900 text-white border-b border-slate-800">
        <div className="container-max section-px">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest">
              Seamless Architecture
            </span>
            <h2 className="text-xl font-bold mt-1">
              How We Engineer Your Wireless Coverage
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-4xl mx-auto">
            {/* Step 1: Fiber Router */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex-1 text-center space-y-3 w-full">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <RouterIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">1. Dual-Band Router</h3>
              <p className="text-xs text-slate-400">
                Correctly positioned gigabit router with channel interference scanning.
              </p>
            </div>

            <div className="hidden md:flex text-cyan-400">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>

            {/* Step 2: WiFi Wave / Access Points */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/40 flex-1 text-center space-y-3 w-full shadow-lg shadow-cyan-500/10">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <Wifi className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white">2. Mesh &amp; AP Signal</h3>
              <p className="text-xs text-slate-400">
                Amplified 2.4GHz / 5GHz beamforming covering all corners without dead zones.
              </p>
            </div>

            <div className="hidden md:flex text-cyan-400">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>

            {/* Step 3: End Devices */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex-1 text-center space-y-3 w-full">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">3. Connected Devices</h3>
              <p className="text-xs text-slate-400">
                Smartphones, laptops, smart TVs, and IoT gadgets connected at max speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-label">WiFi Capabilities</span>
            <h2 className="section-title">Complete Wireless Coverage Solutions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <Radio className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Home WiFi Optimization</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Full-house signal mapping, eliminating concrete wall dampening, and setting up dual-band SSIDs for smart TVs and gaming setups.
              </p>
              <ul className="space-y-1 text-xs text-slate-500">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Multi-floor mesh expansion</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Fast roaming between rooms</li>
              </ul>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <Sliders className="w-8 h-8 text-cyan-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Office &amp; Commercial WiFi</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Enterprise ceiling-mounted access points capable of supporting 50+ concurrent client laptops, isolated guest WiFi, and bandwidth shaping.
              </p>
              <ul className="space-y-1 text-xs text-slate-500">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" /> Guest network separation</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" /> High concurrency stability</li>
              </ul>
            </div>

            <div className="sv-card bg-white p-6 rounded-2xl border border-slate-200">
              <Zap className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Router Setup &amp; Security</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Firmware upgrades, WPA3 encryption, port forwarding, DNS tuning, and resolving IP conflicts for stable continuous connection.
              </p>
              <ul className="space-y-1 text-xs text-slate-500">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> WPA2/WPA3 security hardening</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Clean cable routing</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/request-service" className="btn-primary text-xs py-3 px-8 rounded-xl">
              Request WiFi Installation / Survey
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
