'use client';

import { useRef, useState } from 'react';

export default function AuroraPrismButton() {
  const btnRef = useRef(null);
  const [pressed, setPressed] = useState(false);

  return (
    <div className="[--size:190px]">
      <style>{`
        .hip-aurora {
          --ring: 0 0% 100% / .18;
          --shine: 255 255 255 / .6;
          position: relative;
          isolation: isolate;
          background: radial-gradient(120% 160% at 0% 0%, hsl(266 100% 64% / .9), transparent 56%),
                      radial-gradient(120% 160% at 100% 100%, hsl(192 100% 50% / .9), transparent 54%),
                      linear-gradient(120deg, hsl(332 94% 61% / .85), hsl(198 100% 60% / .85), hsl(137 85% 55% / .85));
          box-shadow: 0 0 0 1px hsl(var(--ring)), 0 12px 30px hsl(270 100% 60% / .35), inset 0 1px 0 hsl(var(--shine));
          transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
          -webkit-backdrop-filter: blur(6px);
          backdrop-filter: blur(6px);
        }
        .hip-aurora::before {
          content: "";
          position: absolute; inset: 0; z-index: -1; border-radius: inherit;
          background: conic-gradient(from 0deg at 50% 50%, hsl(280 100% 60%), hsl(200 100% 60%), hsl(140 80% 60%), hsl(340 100% 60%), hsl(280 100% 60%));
          filter: blur(18px) saturate(1.2);
          opacity: .55;
          animation: hip-rotate 8s linear infinite;
        }
        .hip-aurora::after {
          content: "";
          position: absolute; inset: 1px; border-radius: inherit;
          background: linear-gradient( to bottom right, hsl(0 0% 100% / .20), hsl(0 0% 100% / .04) );
          mask: linear-gradient(white, transparent 40%);
          pointer-events: none;
        }
        @keyframes hip-rotate { to { transform: rotate(360deg); } }
        .hip-aurora:active { transform: translateY(1px) scale(.99); filter: saturate(1.05); }
        .hip-focus { box-shadow: 0 0 0 3px hsl(270 100% 60% / .35), 0 0 0 6px hsl(270 100% 60% / .18); }
      `}</style>

      <button
        ref={btnRef}
        type="button"
        aria-pressed={pressed}
        onClick={() => setPressed(p => !p)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setPressed(p => !p);
          }
        }}
        className="hip-aurora relative w-[200px] h-[56px] rounded-xl text-white font-semibold tracking-wide overflow-hidden"
      >
        <span className="relative z-10 drop-shadow-sm">
          {pressed ? 'Aurora Active' : 'Aurora Prism'}
        </span>
      </button>
    </div>
  );
}

