import { useState, useRef, useCallback, useEffect } from 'react';
import {
  MessageCircle, X, Send, Minimize2, Bot, User,
  Wifi, CreditCard, MapPin, Phone, Wrench, RotateCcw,
} from 'lucide-react';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface QuickReply {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

// ──────────────────────────────────────────────
// Bot Knowledge Base
// ──────────────────────────────────────────────
const FAQ: Record<string, { text: string; followUps?: string[] }> = {
  plans: {
    text: `📶 Here are our current broadband plans:\n\n• **Basic** — 50 Mbps @ ₹499/month\n• **Standard** — 100 Mbps @ ₹799/month ⭐ Most Popular\n• **Premium** — 200 Mbps @ ₹1,199/month\n• **Ultra** — 500 Mbps @ ₹1,999/month\n\nAll plans include free installation and unlimited data. Visit our Plans page for details!`,
    followUps: ['coverage', 'request', 'contact'],
  },
  coverage: {
    text: `📍 We currently serve the following areas in Bangalore:\n\n• Vijinapura (Pincode: 560016)\n• Dooravani Nagar (Pincode: 560016)\n• KR Puram (surrounding areas)\n\nUse our Coverage Checker to see exact availability at your address.`,
    followUps: ['plans', 'request', 'contact'],
  },
  internet: {
    text: `🔧 For internet issues, try these steps:\n\n1. **Restart your router** — unplug for 30 seconds, then plug back in\n2. **Check all cables** are firmly connected\n3. **Wait 2 minutes** for the router to fully reconnect\n4. If the issue persists, check if the lights on your router are normal\n\nStill not working? Our technicians are available 24/7!`,
    followUps: ['ticket', 'contact', 'reboot'],
  },
  slow: {
    text: `🐢 Slow internet? Here's what to try:\n\n1. Connect your device **directly via ethernet cable** to rule out WiFi interference\n2. **Restart your router** (unplug 30 sec)\n3. Check if **multiple devices** are streaming/downloading simultaneously\n4. Run a speed test at **fast.com** and note the result\n5. If speeds are consistently below your plan speed, raise a ticket — we'll investigate!`,
    followUps: ['ticket', 'plans', 'contact'],
  },
  wifi: {
    text: `📡 WiFi problems? Here's how to improve it:\n\n1. Place your router in a **central, elevated location**\n2. Keep it away from **microwaves, cordless phones** and thick walls\n3. Make sure no one has **changed your WiFi password**\n4. Try **restarting the router** — unplug for 30 seconds\n5. For large homes/offices, we offer **WiFi mesh extension** services!\n\nWant us to optimize your WiFi setup?`,
    followUps: ['request', 'ticket', 'contact'],
  },
  cctv: {
    text: `📷 Our CCTV services include:\n\n• IP Camera installation (indoor & outdoor)\n• NVR/DVR setup with remote viewing\n• Night vision cameras\n• Cloud & local storage solutions\n• Free site survey before installation\n• Annual maintenance packages\n\nWe handle everything — supply, installation & configuration!`,
    followUps: ['request', 'contact'],
  },
  billing: {
    text: `💳 Billing & payments:\n\n• Payments are due **monthly** as per your plan cycle\n• We accept **online transfers, UPI, and cash**\n• WhatsApp us your payment screenshot for instant confirmation\n• For billing queries, contact us directly:\n  📞 9620406789 or 6302249065\n  📧 sventerprises161718@gmail.com`,
    followUps: ['contact', 'plans'],
  },
  contact: {
    text: `📞 Reach us anytime:\n\n• **Phone/WhatsApp**: 9620406789\n• **Alt Number**: 6302249065\n• **Email**: sventerprises161718@gmail.com\n• **Address**: 3rd Cross near FCI Main Road, Vijinapura Dooravani Nagar, Bangalore 560016\n• **Hours**: 9 AM – 9 PM (Support: 24/7 for outages)`,
    followUps: ['plans', 'coverage'],
  },
  ticket: {
    text: `🎫 To raise a support ticket:\n\n1. Visit our **Support page** from the navigation menu\n2. Select your issue category\n3. Describe the problem\n4. Submit — you'll get a ticket ID instantly (e.g. SV-TKT-000001)\n\nOr call us directly at **9620406789** for urgent issues and we'll dispatch a technician!`,
    followUps: ['contact', 'internet'],
  },
  request: {
    text: `📝 To request a new connection or service:\n\n1. Go to **"Get Connected"** or **"Request Service"** on our website\n2. Fill in your details and preferred service\n3. We'll call you within **24 hours** to confirm\n\nAlternatively, WhatsApp or call us at **9620406789** for immediate assistance!`,
    followUps: ['plans', 'coverage', 'contact'],
  },
  reboot: {
    text: `🔄 How to properly restart your router:\n\n1. **Unplug** the power cable from your router\n2. Wait **30 full seconds** (not just 5!)\n3. **Plug back in** and wait 2 minutes for the connection to re-establish\n4. Check the **online/internet light** — it should be solid green or blue\n\nIf lights are blinking red or orange, there may be a line issue — call us at 9620406789!`,
    followUps: ['internet', 'ticket', 'contact'],
  },
};

const QUICK_REPLIES: QuickReply[] = [
  { label: 'View Plans', value: 'plans', icon: <CreditCard size={12} /> },
  { label: 'Check Coverage', value: 'coverage', icon: <MapPin size={12} /> },
  { label: 'Internet Issues', value: 'internet', icon: <Wifi size={12} /> },
  { label: 'Slow Speed', value: 'slow', icon: <Wifi size={12} /> },
  { label: 'WiFi Help', value: 'wifi', icon: <Wifi size={12} /> },
  { label: 'CCTV Info', value: 'cctv', icon: <Wrench size={12} /> },
  { label: 'Billing', value: 'billing', icon: <CreditCard size={12} /> },
  { label: 'Contact Us', value: 'contact', icon: <Phone size={12} /> },
  { label: 'Raise Ticket', value: 'ticket', icon: <Wrench size={12} /> },
  { label: 'New Connection', value: 'request', icon: <Wifi size={12} /> },
  { label: 'Restart Router', value: 'reboot', icon: <RotateCcw size={12} /> },
];

// ──────────────────────────────────────────────
// Bot Response Logic
// ──────────────────────────────────────────────
function getBotResponse(input: string): { text: string; followUps?: string[] } {
  const text = input.toLowerCase();

  for (const [key, val] of Object.entries(FAQ)) {
    if (text.includes(key)) return val;
  }

  if (text.match(/slow|speed|fast|mbps/)) return FAQ.slow;
  if (text.match(/wifi|wi-fi|wireless|signal|router/)) return FAQ.wifi;
  if (text.match(/internet|connection|connect|not working|down|outage/)) return FAQ.internet;
  if (text.match(/plan|price|cost|rate|package|monthly/)) return FAQ.plans;
  if (text.match(/area|pincode|location|serve|available/)) return FAQ.coverage;
  if (text.match(/cctv|camera|surveillance|security/)) return FAQ.cctv;
  if (text.match(/bill|payment|pay|invoice|due/)) return FAQ.billing;
  if (text.match(/call|contact|phone|email|address|whatsapp/)) return FAQ.contact;
  if (text.match(/ticket|complaint|issue|problem|support/)) return FAQ.ticket;
  if (text.match(/new|install|connection|register/)) return FAQ.request;
  if (text.match(/restart|reboot|reset|power/)) return FAQ.reboot;
  if (text.match(/hello|hi|hey|helo|good/)) {
    return {
      text: `👋 Hello! I'm **SVBot**, your SV Enterprises assistant.\n\nI can help you with:\n• Broadband plans & pricing\n• Coverage check\n• Internet troubleshooting\n• CCTV inquiries\n• Billing questions\n• Raising support tickets\n\nWhat can I help you with today?`,
      followUps: ['plans', 'internet', 'contact'],
    };
  }

  return {
    text: `🤔 I didn't quite get that. You can ask me about:\n\n• "View plans" — broadband packages\n• "Check coverage" — is your area covered?\n• "Internet issues" — troubleshooting help\n• "Contact us" — phone numbers & address\n• "Raise ticket" — log a complaint\n\nOr tap one of the quick replies below!`,
    followUps: ['plans', 'internet', 'contact'],
  };
}

function formatText(text: string): React.ReactNode {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────
export default function HelpChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      from: 'bot',
      text: `👋 Hi there! I'm **SVBot**, your SV Enterprises assistant.\n\nI can help with plans, coverage, internet issues, CCTV, billing and more.\n\nWhat can I help you with today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentFollowUps, setCurrentFollowUps] = useState<string[]>([
    'plans', 'internet', 'contact', 'coverage',
  ]);

  // Drag state
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  // ── Mouse drag ──
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: position.x, py: position.y };
  }, [position]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      const newX = Math.max(8, dragStart.current.px + (e.clientX - dragStart.current.mx));
      const newY = Math.max(8, dragStart.current.py - (e.clientY - dragStart.current.my));
      setPosition({ x: newX, y: newY });
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging]);

  // ── Touch drag ──
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    setDragging(true);
    dragStart.current = { mx: t.clientX, my: t.clientY, px: position.x, py: position.y };
  }, [position]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: TouchEvent) => {
      if (!dragStart.current) return;
      const t = e.touches[0];
      const newX = Math.max(8, dragStart.current.px + (t.clientX - dragStart.current.mx));
      const newY = Math.max(8, dragStart.current.py - (t.clientY - dragStart.current.my));
      setPosition({ x: newX, y: newY });
    };
    const onUp = () => setDragging(false);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onUp); };
  }, [dragging]);

  // ── Send ──
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(), from: 'user', text: text.trim(), timestamp: new Date(),
    }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const { text: botText, followUps } = getBotResponse(text);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), from: 'bot', text: botText, timestamp: new Date(),
      }]);
      setCurrentFollowUps(followUps || ['plans', 'internet', 'contact']);
      setIsTyping(false);
    }, 900 + Math.random() * 500);
  }, []);

  const handleQuickReply = useCallback((value: string) => {
    const reply = QUICK_REPLIES.find(q => q.value === value);
    if (reply) sendMessage(reply.label);
  }, [sendMessage]);

  const followUpReplies = QUICK_REPLIES.filter(q => currentFollowUps.includes(q.value));

  const btnStyle: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'white', padding: '4px', opacity: 0.8, lineHeight: '1',
    display: 'flex', alignItems: 'center',
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        bottom: `${position.y}px`,
        zIndex: 9999,
        userSelect: 'none',
      }}
    >
      {/* ── Chat Panel ── */}
      {open && (
        <div style={{
          position: 'absolute',
          bottom: '72px',
          left: 0,
          width: '340px',
          maxWidth: 'calc(100vw - 32px)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#0f1c35',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: minimized ? '56px' : '500px',
          transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}>

          {/* Header / Drag Handle */}
          <div
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: dragging ? 'grabbing' : 'grab',
              flexShrink: 0,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Bot size={20} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '14px', fontFamily: 'Inter,sans-serif' }}>SVBot</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontFamily: 'Inter,sans-serif' }}>
                {isTyping ? '✍️ Typing...' : '🟢 Online — SV Enterprises Support'}
              </div>
            </div>
            <button onClick={() => setMinimized(m => !m)} style={btnStyle} title={minimized ? 'Restore' : 'Minimize'}>
              <Minimize2 size={16} />
            </button>
            <button onClick={() => setOpen(false)} style={btnStyle} title="Close">
              <X size={18} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '16px 12px 8px',
                display: 'flex', flexDirection: 'column', gap: '10px',
                scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent',
              }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{
                    display: 'flex', gap: '8px', alignItems: 'flex-end',
                    flexDirection: msg.from === 'user' ? 'row-reverse' : 'row',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: msg.from === 'bot'
                        ? 'linear-gradient(135deg,#1e40af,#0ea5e9)'
                        : 'rgba(255,255,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {msg.from === 'bot'
                        ? <Bot size={14} color="white" />
                        : <User size={14} color="rgba(255,255,255,0.8)" />}
                    </div>
                    <div style={{
                      maxWidth: '80%', padding: '10px 12px',
                      borderRadius: msg.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: msg.from === 'user'
                        ? 'linear-gradient(135deg,#1e40af,#3b82f6)'
                        : 'rgba(255,255,255,0.06)',
                      border: msg.from === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      fontSize: '12.5px', lineHeight: 1.65,
                      color: msg.from === 'user' ? 'white' : '#e2e8f0',
                      fontFamily: 'Inter,sans-serif', wordBreak: 'break-word',
                    }}>
                      {formatText(msg.text)}
                    </div>
                  </div>
                ))}

                {/* Typing dots */}
                {isTyping && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#1e40af,#0ea5e9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Bot size={14} color="white" />
                    </div>
                    <div style={{
                      padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', gap: '4px', alignItems: 'center',
                    }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: 6, height: 6, borderRadius: '50%', background: '#60a5fa',
                          animation: 'svbotDot 1.2s infinite', animationDelay: `${i * 0.2}s`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div style={{
                padding: '6px 12px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                {followUpReplies.map(r => (
                  <button key={r.value} onClick={() => handleQuickReply(r.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '4px 10px', borderRadius: '20px',
                      border: '1px solid rgba(96,165,250,0.35)',
                      background: 'rgba(96,165,250,0.08)',
                      color: '#93c5fd', fontSize: '11px',
                      fontFamily: 'Inter,sans-serif', cursor: 'pointer',
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(96,165,250,0.2)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(96,165,250,0.7)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(96,165,250,0.08)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(96,165,250,0.35)';
                    }}
                  >
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div style={{
                padding: '8px 12px 12px', display: 'flex', gap: '8px', alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, padding: '9px 12px', borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.06)', color: 'white',
                    fontSize: '13px', fontFamily: 'Inter,sans-serif',
                    outline: 'none', caretColor: '#60a5fa',
                  }}
                />
                <button onClick={() => sendMessage(input)} disabled={!input.trim()}
                  style={{
                    width: 36, height: 36, borderRadius: '50%', border: 'none', flexShrink: 0,
                    background: input.trim()
                      ? 'linear-gradient(135deg,#1e40af,#0ea5e9)'
                      : 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: input.trim() ? 'pointer' : 'default', transition: 'background 0.2s',
                  }}
                >
                  <Send size={15} color={input.trim() ? 'white' : 'rgba(255,255,255,0.3)'} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── FAB Button ── */}
      <button
        onClick={() => { setOpen(o => !o); setMinimized(false); }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        title={open ? 'Close Chat' : 'Chat with SVBot'}
        style={{
          width: 56, height: 56, borderRadius: '50%', border: 'none',
          background: open
            ? 'linear-gradient(135deg,#1e3a8a,#075985)'
            : 'linear-gradient(135deg,#1e40af,#0ea5e9)',
          boxShadow: '0 6px 24px rgba(30,64,175,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: dragging ? 'grabbing' : 'pointer',
          transition: 'background 0.2s, transform 0.15s',
          transform: open ? 'scale(0.95)' : 'scale(1)',
          position: 'relative',
        }}
        onMouseEnter={e => { if (!dragging) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = open ? 'scale(0.95)' : 'scale(1)'; }}
      >
        {open ? <X size={22} color="white" /> : <MessageCircle size={22} color="white" />}
        {!open && (
          <span style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            border: '2px solid rgba(96,165,250,0.45)',
            animation: 'svbotPulse 2.5s infinite',
          }} />
        )}
      </button>

      {/* Keyframe animations */}
      <style>{`
        @keyframes svbotPulse {
          0%   { transform: scale(1);   opacity: 1; }
          70%  { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes svbotDot {
          0%, 60%, 100% { transform: translateY(0);   opacity: 0.4; }
          30%            { transform: translateY(-5px); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
