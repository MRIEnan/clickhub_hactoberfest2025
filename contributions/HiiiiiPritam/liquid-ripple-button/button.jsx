'use client';

import { useRef } from 'react';

export default function LiquidRippleButton() {
  const ref = useRef(null);

  const spawnRipple = (e) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'hip-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  return (
    <div>
      <style>{`
        .hip-ripple-btn {
          position: relative; overflow: hidden;
          background: radial-gradient(120% 200% at -10% -20%, #6ee7f9, transparent 50%),
                      radial-gradient(120% 200% at 120% 140%, #a78bfa, transparent 50%),
                      linear-gradient(135deg, #5b21b6, #0ea5e9);
          color: white; border: 0; border-radius: 12px; font-weight: 700;
          box-shadow: 0 10px 30px rgba(99,102,241,.25), inset 0 1px 0 rgba(255,255,255,.4);
          transition: transform .15s ease, box-shadow .2s ease;
        }
        .hip-ripple-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 34px rgba(99,102,241,.35), inset 0 1px 0 rgba(255,255,255,.5); }
        .hip-ripple-btn:active { transform: translateY(0); }
        .hip-ripple {
          position: absolute; width: 20px; height: 20px; pointer-events: none;
          border-radius: 999px; transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255,255,255,.55) 0%, rgba(255,255,255,.15) 30%, rgba(255,255,255,0) 60%);
          animation: hip-ripple-anim .7s ease-out forwards;
          mix-blend-mode: screen;
        }
        @keyframes hip-ripple-anim {
          0% { opacity: .9; scale: .2; }
          70% { opacity: .35; }
          100% { opacity: 0; scale: 8; }
        }
      `}</style>

      <button
        ref={ref}
        type="button"
        aria-label="Liquid Ripple"
        onClick={spawnRipple}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); spawnRipple(e); }}}
        className="hip-ripple-btn px-6 h-[52px] min-w-[180px]"
      >
        Liquid Ripple
      </button>
    </div>
  );
}

