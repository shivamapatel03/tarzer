import React from 'react';

interface PixelHotIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function PixelHotIcon({ className = 'w-4 h-4', ...props }: PixelHotIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={`inline-block flex-shrink-0 pixel-flame-icon ${className}`}
      aria-label="Hot Deal"
      {...props}
    >
      <style>{`
        @keyframes flame1 {
          0%, 33.32% { opacity: 1; display: inline; }
          33.33%, 100% { opacity: 0; display: none; }
        }
        @keyframes flame2 {
          0%, 33.32% { opacity: 0; display: none; }
          33.33%, 66.65% { opacity: 1; display: inline; }
          66.66%, 100% { opacity: 0; display: none; }
        }
        @keyframes flame3 {
          0%, 66.65% { opacity: 0; display: none; }
          66.66%, 100% { opacity: 1; display: inline; }
        }
        .flame-frame-1 { animation: flame1 0.45s infinite steps(1); }
        .flame-frame-2 { animation: flame2 0.45s infinite steps(1); }
        .flame-frame-3 { animation: flame3 0.45s infinite steps(1); }
        .pixel-flame-icon {
          filter: drop-shadow(0 0 3px rgba(255, 106, 0, 0.45));
          transition: filter 0.2s ease;
        }
        .group:hover .pixel-flame-icon,
        .pixel-flame-icon:hover {
          filter: drop-shadow(0 0 6px rgba(255, 106, 0, 0.85));
        }
      `}</style>

      {/* Frame 1: Flame licking left */}
      <g className="flame-frame-1">
        {/* Dark crimson / burnt base & outline */}
        <rect x="6" y="14" width="4" height="1" fill="#C92A00" />
        <rect x="5" y="13" width="1" height="1" fill="#C92A00" />
        <rect x="10" y="13" width="1" height="1" fill="#C92A00" />
        <rect x="4" y="12" width="1" height="1" fill="#C92A00" />
        <rect x="11" y="12" width="1" height="1" fill="#C92A00" />
        <rect x="4" y="11" width="1" height="1" fill="#C92A00" />
        <rect x="11" y="11" width="1" height="1" fill="#C92A00" />
        <rect x="4" y="10" width="1" height="1" fill="#C92A00" />
        <rect x="10" y="10" width="1" height="1" fill="#C92A00" />
        <rect x="5" y="9" width="1" height="1" fill="#C92A00" />
        <rect x="9" y="9" width="1" height="1" fill="#C92A00" />
        <rect x="5" y="8" width="1" height="1" fill="#C92A00" />
        <rect x="8" y="8" width="1" height="1" fill="#C92A00" />
        <rect x="5" y="7" width="1" height="1" fill="#C92A00" />
        <rect x="7" y="7" width="1" height="1" fill="#C92A00" />
        <rect x="5" y="6" width="1" height="1" fill="#C92A00" />
        <rect x="5" y="5" width="1" height="1" fill="#C92A00" />
        <rect x="5" y="4" width="1" height="1" fill="#C92A00" />
        <rect x="5" y="3" width="1" height="1" fill="#C92A00" />
        <rect x="5" y="2" width="1" height="1" fill="#FF5900" />

        {/* Vibrant Orange Body */}
        <rect x="6" y="13" width="4" height="1" fill="#FF5900" />
        <rect x="5" y="12" width="6" height="1" fill="#FF6A00" />
        <rect x="5" y="11" width="6" height="1" fill="#FF6A00" />
        <rect x="5" y="10" width="5" height="1" fill="#FF6A00" />
        <rect x="6" y="9" width="3" height="1" fill="#FF6A00" />
        <rect x="6" y="8" width="2" height="1" fill="#FF6A00" />
        <rect x="6" y="7" width="1" height="1" fill="#FF6A00" />
        <rect x="6" y="6" width="1" height="1" fill="#FF7A00" />
        <rect x="6" y="5" width="1" height="1" fill="#FF7A00" />

        {/* Core Yellow-Orange Heat */}
        <rect x="7" y="12" width="2" height="1" fill="#FFC800" />
        <rect x="6" y="11" width="3" height="1" fill="#FFC800" />
        <rect x="6" y="10" width="3" height="1" fill="#FFC800" />
        <rect x="7" y="9" width="1" height="1" fill="#FFC800" />
        <rect x="7" y="8" width="1" height="1" fill="#FFC800" />

        {/* White-Hot Center Spark */}
        <rect x="7" y="11" width="1" height="1" fill="#FFF6B3" />
        <rect x="7" y="10" width="1" height="1" fill="#FFF6B3" />

        {/* Floating Embers */}
        <rect x="10" y="8" width="1" height="1" fill="#FF6A00" />
        <rect x="11" y="5" width="1" height="1" fill="#FFB800" />
      </g>

      {/* Frame 2: Flame tall & centered */}
      <g className="flame-frame-2">
        {/* Dark crimson / burnt base & outline */}
        <rect x="6" y="14" width="4" height="1" fill="#C92A00" />
        <rect x="5" y="13" width="1" height="1" fill="#C92A00" />
        <rect x="10" y="13" width="1" height="1" fill="#C92A00" />
        <rect x="4" y="12" width="1" height="1" fill="#C92A00" />
        <rect x="11" y="12" width="1" height="1" fill="#C92A00" />
        <rect x="4" y="11" width="1" height="1" fill="#C92A00" />
        <rect x="11" y="11" width="1" height="1" fill="#C92A00" />
        <rect x="4" y="10" width="1" height="1" fill="#C92A00" />
        <rect x="11" y="10" width="1" height="1" fill="#C92A00" />
        <rect x="5" y="9" width="1" height="1" fill="#C92A00" />
        <rect x="10" y="9" width="1" height="1" fill="#C92A00" />
        <rect x="6" y="8" width="1" height="1" fill="#C92A00" />
        <rect x="10" y="8" width="1" height="1" fill="#C92A00" />
        <rect x="6" y="7" width="1" height="1" fill="#C92A00" />
        <rect x="9" y="7" width="1" height="1" fill="#C92A00" />
        <rect x="6" y="6" width="1" height="1" fill="#C92A00" />
        <rect x="9" y="6" width="1" height="1" fill="#C92A00" />
        <rect x="7" y="5" width="1" height="1" fill="#C92A00" />
        <rect x="9" y="5" width="1" height="1" fill="#C92A00" />
        <rect x="7" y="4" width="1" height="1" fill="#FF5900" />
        <rect x="8" y="4" width="1" height="1" fill="#C92A00" />
        <rect x="7" y="3" width="1" height="1" fill="#FF5900" />
        <rect x="8" y="3" width="1" height="1" fill="#C92A00" />
        <rect x="7" y="2" width="1" height="1" fill="#FF6A00" />
        <rect x="7" y="1" width="1" height="1" fill="#FFB800" />

        {/* Vibrant Orange Body */}
        <rect x="6" y="13" width="4" height="1" fill="#FF5900" />
        <rect x="5" y="12" width="6" height="1" fill="#FF6A00" />
        <rect x="5" y="11" width="6" height="1" fill="#FF6A00" />
        <rect x="5" y="10" width="6" height="1" fill="#FF6A00" />
        <rect x="6" y="9" width="4" height="1" fill="#FF6A00" />
        <rect x="7" y="8" width="3" height="1" fill="#FF6A00" />
        <rect x="7" y="7" width="2" height="1" fill="#FF7A00" />
        <rect x="7" y="6" width="2" height="1" fill="#FF7A00" />
        <rect x="8" y="5" width="1" height="1" fill="#FF7A00" />

        {/* Core Yellow-Orange Heat */}
        <rect x="7" y="12" width="2" height="1" fill="#FFC800" />
        <rect x="7" y="11" width="2" height="1" fill="#FFC800" />
        <rect x="7" y="10" width="2" height="1" fill="#FFC800" />
        <rect x="7" y="9" width="2" height="1" fill="#FFC800" />
        <rect x="8" y="8" width="1" height="1" fill="#FFC800" />
        <rect x="8" y="7" width="1" height="1" fill="#FFC800" />

        {/* White-Hot Center Spark */}
        <rect x="7" y="11" width="1" height="1" fill="#FFF6B3" />
        <rect x="8" y="10" width="1" height="1" fill="#FFF6B3" />

        {/* Floating Embers */}
        <rect x="4" y="8" width="1" height="1" fill="#FF6A00" />
        <rect x="11" y="4" width="1" height="1" fill="#FFB800" />
      </g>

      {/* Frame 3: Flame licking right */}
      <g className="flame-frame-3">
        {/* Dark crimson / burnt base & outline */}
        <rect x="6" y="14" width="4" height="1" fill="#C92A00" />
        <rect x="5" y="13" width="1" height="1" fill="#C92A00" />
        <rect x="10" y="13" width="1" height="1" fill="#C92A00" />
        <rect x="4" y="12" width="1" height="1" fill="#C92A00" />
        <rect x="11" y="12" width="1" height="1" fill="#C92A00" />
        <rect x="4" y="11" width="1" height="1" fill="#C92A00" />
        <rect x="11" y="11" width="1" height="1" fill="#C92A00" />
        <rect x="5" y="10" width="1" height="1" fill="#C92A00" />
        <rect x="11" y="10" width="1" height="1" fill="#C92A00" />
        <rect x="6" y="9" width="1" height="1" fill="#C92A00" />
        <rect x="11" y="9" width="1" height="1" fill="#C92A00" />
        <rect x="6" y="8" width="1" height="1" fill="#C92A00" />
        <rect x="10" y="8" width="1" height="1" fill="#C92A00" />
        <rect x="7" y="7" width="1" height="1" fill="#C92A00" />
        <rect x="10" y="7" width="1" height="1" fill="#C92A00" />
        <rect x="7" y="6" width="1" height="1" fill="#C92A00" />
        <rect x="10" y="6" width="1" height="1" fill="#C92A00" />
        <rect x="8" y="5" width="1" height="1" fill="#C92A00" />
        <rect x="10" y="5" width="1" height="1" fill="#C92A00" />
        <rect x="8" y="4" width="1" height="1" fill="#C92A00" />
        <rect x="9" y="4" width="1" height="1" fill="#FF5900" />
        <rect x="9" y="3" width="1" height="1" fill="#FF5900" />
        <rect x="9" y="2" width="1" height="1" fill="#FFB800" />

        {/* Vibrant Orange Body */}
        <rect x="6" y="13" width="4" height="1" fill="#FF5900" />
        <rect x="5" y="12" width="6" height="1" fill="#FF6A00" />
        <rect x="5" y="11" width="6" height="1" fill="#FF6A00" />
        <rect x="6" y="10" width="5" height="1" fill="#FF6A00" />
        <rect x="7" y="9" width="4" height="1" fill="#FF6A00" />
        <rect x="7" y="8" width="3" height="1" fill="#FF6A00" />
        <rect x="8" y="7" width="2" height="1" fill="#FF6A00" />
        <rect x="8" y="6" width="2" height="1" fill="#FF7A00" />
        <rect x="9" y="5" width="1" height="1" fill="#FF7A00" />

        {/* Core Yellow-Orange Heat */}
        <rect x="7" y="12" width="2" height="1" fill="#FFC800" />
        <rect x="7" y="11" width="2" height="1" fill="#FFC800" />
        <rect x="7" y="10" width="2" height="1" fill="#FFC800" />
        <rect x="8" y="9" width="2" height="1" fill="#FFC800" />
        <rect x="8" y="8" width="1" height="1" fill="#FFC800" />
        <rect x="8" y="7" width="1" height="1" fill="#FFC800" />

        {/* White-Hot Center Spark */}
        <rect x="8" y="11" width="1" height="1" fill="#FFF6B3" />
        <rect x="8" y="10" width="1" height="1" fill="#FFF6B3" />

        {/* Floating Embers */}
        <rect x="4" y="7" width="1" height="1" fill="#FF6A00" />
        <rect x="5" y="4" width="1" height="1" fill="#FFB800" />
      </g>
    </svg>
  );
}

export function PixelHotBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[#FF6A00] font-pixel text-[10px] font-bold uppercase tracking-wider leading-none select-none ${className}`}
    >
      <PixelHotIcon className="w-3.5 h-3.5" />
      <span>HOT</span>
    </span>
  );
}

export default PixelHotIcon;
