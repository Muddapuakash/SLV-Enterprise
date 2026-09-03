import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Zap, Headphones } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { getWhatsAppUrl } from '../../services/whatsapp';

export default function Footer() {
  const whatsappLink = getWhatsAppUrl({}, 'Hello SV Enterprises! I would like to inquire about your internet & networking services.');

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-max section-px pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <BrandLogo variant="light" />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Connecting homes and businesses with high-speed fiber internet, enterprise WiFi, CCTV surveillance, and turnkey networking solutions in Bangalore.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase">
              <Zap className="w-4 h-4" /> Fast. Reliable. Always.
            </div>

            {/* Direct Action Chips */}
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium hover:bg-emerald-900/60 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                WhatsApp Quick Chat
              </a>
              <a
                href="tel:9620406789"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-medium hover:bg-blue-900/60 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                Call +91 96204 06789
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services/internet" className="hover:text-blue-400 transition-colors">
                  High-Speed Internet
                </Link>
              </li>
              <li>
                <Link to="/services/wifi" className="hover:text-blue-400 transition-colors">
                  Enterprise &amp; Home WiFi
                </Link>
              </li>
              <li>
                <Link to="/services/cctv" className="hover:text-blue-400 transition-colors">
                  CCTV Security Systems
                </Link>
              </li>
              <li>
                <Link to="/services/cabling" className="hover:text-blue-400 transition-colors">
                  Structured Network Cabling
                </Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-blue-400 transition-colors">
                  Broadband Tariff Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Support */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Company &amp; Help
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  About SV Enterprises
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-blue-400 transition-colors">
                  Recent Installations
                </Link>
              </li>
              <li>
                <Link to="/coverage" className="hover:text-blue-400 transition-colors">
                  Check Service Coverage
                </Link>
              </li>
              <li>
                <Link to="/request-service" className="hover:text-blue-400 transition-colors">
                  Raise Service Request
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-blue-400 transition-colors">
                  Support &amp; Help Desk
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Customer &amp; Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Bangalore Office
            </h4>
            <div className="space-y-3 text-xs leading-relaxed text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>
                  3rd Cross near FCI Main Road, Vijinapura Dooravani Nagar, Bangalore, Karnataka 560016
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:9620406789" className="hover:text-blue-300">9620406789</a>
                  <a href="tel:6302249065" className="hover:text-blue-300">6302249065</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:sventerprises161718@gmail.com" className="hover:text-blue-300 break-all">
                  sventerprises161718@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} SV Enterprises. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Verified Local ISP
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Headphones className="w-3.5 h-3.5 text-cyan-400" />
              Direct Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
