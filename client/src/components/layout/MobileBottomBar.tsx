import { Phone, MessageCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getWhatsAppUrl } from '../../services/whatsapp';

export default function MobileBottomBar() {
  const whatsappUrl = getWhatsAppUrl({}, 'Hello SV Enterprises! I would like to get high-speed internet.');

  return (
    <div className="mobile-bottom-bar bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2 md:hidden">
      {/* Call Now */}
      <a
        href="tel:9620406789"
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors shadow-sm"
      >
        <Phone className="w-3.5 h-3.5 text-blue-600" />
        <span>Call</span>
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-colors shadow-sm"
      >
        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>WhatsApp</span>
      </a>

      {/* Get Connected */}
      <Link
        to="/request-service"
        className="flex-[1.4] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
      >
        <Zap className="w-3.5 h-3.5 fill-current" />
        <span>Get Connected</span>
      </Link>
    </div>
  );
}
