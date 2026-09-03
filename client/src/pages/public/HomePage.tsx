import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { getWhatsAppUrl } from '../../services/whatsapp';
import {
  Wifi,
  ShieldCheck,
  Zap,
  Server,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
  Clock,
  Radio,
  Building2,
  Lock,
  ChevronRight,
  HardDrive,
  Cpu,
  Search,
} from 'lucide-react';
import { PlanDTO } from '@sv/shared';

export default function HomePage() {
  const navigate = useNavigate();
  const [quickPincode, setQuickPincode] = useState('');

  // Fetch plans dynamically from backend API
  const { data: plansData, isLoading: plansLoading } = useQuery<{ data: PlanDTO[] }>({
    queryKey: ['plans'],
    queryFn: async () => {
      const res = await api.get('/api/plans');
      return res.data;
    },
  });

  const plans = plansData?.data?.slice(0, 4) || [];
  const whatsappUrl = getWhatsAppUrl(
    {},
    'Hello SV Enterprises! I would like to inquire about getting internet connection for my home/office.'
  );

  const handleCoverageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPincode.trim()) {
      navigate(`/coverage?pincode=${quickPincode.trim()}`);
    } else {
      navigate('/coverage');
    }
  };

  return (
    <div className="bg-white">
      <SEO
        title="SV Enterprises | High Speed Internet & Network Solutions Bangalore"
        description="Fast Internet and reliable connection in Bangalore. High-speed broadband, WiFi setup, CCTV surveillance systems, and structured network cabling by SV Enterprises."
      />

      {/* ============================================================
          HERO SECTION with Subtle Fiber/Network Animated Elements
          ============================================================ */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden hero-bg text-white">
        {/* Background Network Graphic Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <pattern id="networkGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="#60A5FA" />
              <path d="M 30 0 L 30 60 M 0 30 L 60 30" stroke="rgba(96, 165, 250, 0.07)" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#networkGrid)" />

            {/* Subtle animated connection lines */}
            <path
              d="M 100 200 Q 400 150 700 350 T 1300 250"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeDasharray="8 8"
              className="network-line"
            />
            <path
              d="M 200 450 Q 600 300 1000 400 T 1400 150"
              fill="none"
              stroke="#818CF8"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              className="network-line"
            />
            <circle cx="700" cy="350" r="4" fill="#38BDF8" className="network-node" />
            <circle cx="1000" cy="400" r="4" fill="#818CF8" className="network-node" />
          </svg>
        </div>

        {/* Ambient Radial Glow */}
        <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container-max section-px relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Brand Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Stay Connected &bull; Stay Ahead</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Fast Internet. <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
                  Reliable Connections.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Connecting homes and businesses with high-speed internet, WiFi, CCTV surveillance, and professional networking solutions in Bangalore.
              </p>

              {/* Tagline Strip */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-cyan-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> High Speed Internet
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Reliable Connection
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Better Experience
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/request-service"
                  className="btn-primary bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 text-base flex items-center gap-2"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Get Connected</span>
                </Link>

                <Link
                  to="/services/internet"
                  className="px-6 py-3.5 rounded-xl border border-white/25 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Location Badge */}
              <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>Serving Vijinapura, Dooravani Nagar &amp; surrounding Bangalore areas</span>
              </div>
            </div>

            {/* Right Visual Representation (Fiber / WiFi / CCTV / Infrastructure) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-br from-slate-900/90 to-blue-950/80 border border-blue-500/30 p-6 backdrop-blur-xl shadow-2xl">
                
                {/* Tech Badge Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      SV Network Ecosystem
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                    Fiber &bull; LAN &bull; WiFi &bull; CCTV
                  </span>
                </div>

                {/* 4 Infrastructure Nodes */}
                <div className="grid grid-cols-2 gap-3.5 my-5">
                  {/* Node 1: Fiber Internet */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white">Fiber Broadband</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">High-speed FTTH connectivity</div>
                  </div>

                  {/* Node 2: WiFi Solutions */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white">Smart WiFi</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Full-home / office coverage</div>
                  </div>

                  {/* Node 3: CCTV Security */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white">CCTV Systems</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">IP cameras &amp; monitoring</div>
                  </div>

                  {/* Node 4: Structured Cabling */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
                      <Server className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white">Network Cabling</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">CAT6, fiber &amp; rack setup</div>
                  </div>
                </div>

                {/* Instant Coverage Checker Mini-Widget */}
                <form onSubmit={handleCoverageSubmit} className="pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Check Service in Your Area</span>
                    <span className="text-blue-400">Pincode Check</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. 560016"
                        maxLength={6}
                        value={quickPincode}
                        onChange={(e) => setQuickPincode(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shrink-0"
                    >
                      Check
                    </button>
                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          TRUST STRIP (Immediately Below Hero)
          ============================================================ */}
      <section className="bg-slate-900 border-y border-slate-800 py-6 text-white relative z-20">
        <div className="container-max section-px">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">High-Speed Connectivity</div>
                <div className="text-xs text-slate-400">Fast fiber broadband</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Professional Installation</div>
                <div className="text-xs text-slate-400">Trained local technicians</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Reliable Support</div>
                <div className="text-xs text-slate-400">Direct phone &amp; WhatsApp</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Quality Equipment</div>
                <div className="text-xs text-slate-400">Certified routers &amp; cameras</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICES SECTION — 4 Main Cards
          ============================================================ */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label">Our Core Services</span>
            <h2 className="section-title">Complete Connectivity &amp; Security Solutions</h2>
            <p className="section-subtitle mx-auto">
              From residential high-speed internet to turnkey commercial network infrastructure, SV Enterprises handles installation, configuration, and ongoing support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: INTERNET */}
            <div className="sv-card p-6 flex flex-col justify-between bg-white rounded-2xl group border border-slate-100">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">High-Speed Internet</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reliable broadband connectivity for homes, offices and businesses with symmetrical speeds and uninterrupted browsing.
                </p>
                <ul className="text-xs text-slate-500 space-y-1.5 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> FTTH Fiber Technology
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Low Latency Gaming &amp; Calls
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Quick Local Setup
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  to="/services/internet"
                  className="flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700"
                >
                  <span>Explore Internet</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2: WIFI */}
            <div className="sv-card p-6 flex flex-col justify-between bg-white rounded-2xl group border border-slate-100">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Wifi className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">WiFi Solutions</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Professional WiFi installation, dual-band router configuration, and coverage optimization eliminating all dead zones.
                </p>
                <ul className="text-xs text-slate-500 space-y-1.5 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" /> Router Configuration
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" /> Access Point Deployment
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" /> Mesh Coverage Expansion
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  to="/services/wifi"
                  className="flex items-center justify-between text-xs font-bold text-cyan-700 group-hover:text-cyan-800"
                >
                  <span>Explore WiFi</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 3: CCTV */}
            <div className="sv-card p-6 flex flex-col justify-between bg-white rounded-2xl group border border-slate-100">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">CCTV Security</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete CCTV installation, IP camera configuration, NVR recording, and mobile remote monitoring solutions.
                </p>
                <ul className="text-xs text-slate-500 space-y-1.5 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> High-Definition IP Cameras
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Remote Mobile Monitoring
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Maintenance &amp; Upgrades
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  to="/services/cctv"
                  className="flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800"
                >
                  <span>Explore CCTV</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 4: CABLING */}
            <div className="sv-card p-6 flex flex-col justify-between bg-white rounded-2xl group border border-slate-100">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Network Cabling</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Professional structured LAN cabling, fiber optic splicing, patch panel termination, and server rack management.
                </p>
                <ul className="text-xs text-slate-500 space-y-1.5 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" /> CAT6 &amp; Fiber Deployments
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" /> Switch &amp; Rack Installation
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" /> Cable Organization &amp; Testing
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  to="/services/cabling"
                  className="flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-800"
                >
                  <span>Explore Cabling</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          INTERNET SECTION — "Internet That Keeps You Connected"
          ============================================================ */}
      <section className="section-py bg-white">
        <div className="container-max section-px">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="section-label">Broadband Tariff Preview</span>
              <h2 className="section-title">Internet That Keeps You Connected</h2>
              <p className="section-subtitle">
                High-speed fiber connectivity designed for home streaming, remote work, online learning, and uninterrupted business operations.
              </p>
            </div>
            <div>
              <Link to="/plans" className="btn-outline text-sm py-2.5 px-5">
                <span>View All Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Key Advantages Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Zap className="w-5 h-5 text-blue-600 mb-2" />
              <div className="text-sm font-bold text-slate-900">High Speed</div>
              <div className="text-xs text-slate-500">Fast downloads &amp; uploads</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Radio className="w-5 h-5 text-cyan-600 mb-2" />
              <div className="text-sm font-bold text-slate-900">Reliable Network</div>
              <div className="text-xs text-slate-500">Consistent uptime &amp; stability</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Cpu className="w-5 h-5 text-emerald-600 mb-2" />
              <div className="text-sm font-bold text-slate-900">Low Latency</div>
              <div className="text-xs text-slate-500">Smooth video calls &amp; gaming</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Wrench className="w-5 h-5 text-purple-600 mb-2" />
              <div className="text-sm font-bold text-slate-900">Professional Support</div>
              <div className="text-xs text-slate-500">Local technicians on standby</div>
            </div>
          </div>

          {/* Dynamic Plans Preview (from backend DB) */}
          {plansLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 skeleton" />
              ))}
            </div>
          ) : plans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`sv-card rounded-2xl p-6 flex flex-col justify-between relative ${
                    plan.isPopular
                      ? 'border-2 border-blue-600 ring-4 ring-blue-500/10'
                      : 'border border-slate-200'
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-3 rounded-full shadow-sm">
                      Most Popular
                    </span>
                  )}

                  <div>
                    {plan.isSample && (
                      <span className="badge-sample mb-2">Sample Plan</span>
                    )}

                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-blue-700 tracking-tight">
                        {plan.speed}
                      </span>
                    </div>

                    <div className="mt-2 text-2xl font-black text-slate-900">
                      &#8377;{plan.price}
                      <span className="text-xs font-normal text-slate-500"> / month</span>
                    </div>

                    <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                      {plan.features?.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      to={`/plans?select=${plan.id}`}
                      className={`w-full py-2.5 rounded-lg text-center text-xs font-bold transition-all block ${
                        plan.isPopular
                          ? 'btn-primary'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700'
                      }`}
                    >
                      Get This Plan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-600">
                Plans are being configured in the catalog.
              </p>
              <Link to="/contact" className="btn-primary mt-3 text-xs">
                Contact For Custom Plan
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* ============================================================
          WHY CHOOSE US — 4 Feature Cards
          ============================================================ */}
      <section className="section-py bg-slate-900 text-white relative overflow-hidden">
        <div className="container-max section-px relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 border border-blue-400/30">
              Why SV Enterprises
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Built on Speed, Reliability &amp; Direct Support
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              We are a dedicated local connectivity partner focused on prompt physical installation, reliable hardware, and direct technician support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Reliable Connectivity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optical fiber infrastructure engineered for sustained throughput, minimal packet drop, and high availability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Professional Installation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Neat structured cabling, clean router termination, and signal optimization performed by trained professionals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Fast Support</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct helpline access and rapid dispatch of field technicians without getting stuck in automated phone loops.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <HardDrive className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">End-to-End Solutions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single vendor for all your connectivity needs: Internet, WiFi, CCTV security, and structured Ethernet cabling.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          BUSINESS SERVICES SECTION — "Solutions for Businesses"
          ============================================================ */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-navy-950 text-white rounded-3xl p-8 sm:p-12 border border-blue-900/50 relative overflow-hidden shadow-2xl">
            
            <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-block bg-blue-500/30 text-blue-300 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-blue-400/30">
                  Commercial &amp; Enterprise
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Solutions for Businesses
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                  Keep your office operations productive with high-speed dedicated connectivity, secure enterprise WiFi, CCTV camera monitoring, and structured LAN cabling.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Business Internet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Dedicated Connectivity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Office WiFi Deployment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Network Infrastructure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>CCTV Surveillance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Structured Cabling &amp; Racks</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="btn-white text-blue-900 font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-md"
                  >
                    Talk to Our Team
                  </Link>
                  <a
                    href="tel:9620406789"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/25 hover:border-white/50 text-white text-sm font-semibold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>9620406789</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-cyan-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Commercial Site Survey</h4>
                      <p className="text-[11px] text-slate-400">Bangalore Offices &amp; Facilities</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our team inspects your building layout, evaluates WiFi coverage needs, designs structured cabling routes, and recommends the right hardware.
                  </p>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-cyan-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span>Fast on-site assessment for commercial spaces</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA SECTION
          ============================================================ */}
      <section className="section-py bg-white text-center">
        <div className="container-max section-px">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="section-label">Get Connected Today</span>
            <h2 className="section-title">Ready for Better Internet &amp; Networking?</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Connect with SV Enterprises for broadband, WiFi setup, CCTV, or cabling in Bangalore. Our local team is ready to assist you.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/request-service" className="btn-primary text-sm py-3 px-7 rounded-xl">
                <span>Request Connection</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/coverage" className="btn-outline text-sm py-3 px-6 rounded-xl">
                <span>Check Coverage</span>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
