import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  className = '',
  showSubtitle = true,
}) => {
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Emblem */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
        <div className="w-full h-full bg-slate-950/80 backdrop-blur-sm rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle glowing circuit/wave accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/30 via-transparent to-transparent" />
          
          <svg
            className="w-6 h-6 text-white relative z-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* S-V dynamic fiber wave */}
            <path d="M4 11a9 9 0 0 1 16 0" />
            <path d="M7 14a5 5 0 0 1 10 0" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black text-xl tracking-tight ${isLight ? 'text-white' : 'text-slate-900'}`}>
            SV
          </span>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            ENTERPRISES
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[9px] font-semibold tracking-widest uppercase mt-1 ${
              isLight ? 'text-blue-300/80' : 'text-slate-500'
            }`}
          >
            Broadband &amp; Networking Solutions
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
