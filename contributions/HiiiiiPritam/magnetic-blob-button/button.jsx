'use client';

import { useRef } from 'react';

export default function MagneticBlobButton() {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--x', '50%');
    el.style.setProperty('--y', '50%');
  };

  return (
    <div>
      <style>{`
        .hip-magnetic {
          position: relative; isolation: isolate; overflow: hidden; border-radius: 14px;
          background: #0f172a; color: #e2e8f0; border: 1px solid rgba(148,163,184,.25);
          transition: border-color .2s ease, transform .15s ease;
        }
        .hip-magnetic:hover { border-color: rgba(168,85,247,.5); transform: translateY(-1px); }
        .hip-magnetic .hip-blob {
          position: absolute; inset: -60%;
          background: radial-gradient(240px 240px at var(--x, 50%) var(--y, 50%), rgba(168,85,247,.55), rgba(14,165,233,.45) 30%, rgba(14,165,233,0) 60%);
          filter: blur(32px) saturate(1.15);
          opacity: .55; transition: opacity .2s ease;
        }
        .hip-magnetic:hover .hip-blob { opacity: .7; }
        .hip-magnetic .hip-content { position: relative; z-index: 1; }
        .hip-magnetic:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(168,85,247,.4); }
      `}</style>

      <button
        ref={ref}
        type="button"
        aria-label="Magnetic Blob"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onKeyDown={(e) => { if (e.key === 'Tab') { /* allow */ } }}
        className="hip-magnetic w-[200px] h-[56px] font-semibold tracking-wide"
      >
        <span className="hip-blob" aria-hidden="true" />
        <span className="hip-content">Magnetic Blob</span>
      </button>
    </div>
  );
}

