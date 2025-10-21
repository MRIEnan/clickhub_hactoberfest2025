'use client';

export default function NeonTraceButton() {
  return (
    <div>
      <style>{`
        .hip-neon {
          position: relative; isolation: isolate; border-radius: 12px; overflow: hidden;
          background: #0b1020; color: #e2e8f0; font-weight: 700; letter-spacing: .4px;
          border: 1px solid rgba(99,102,241,.3);
          transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
        }
        .hip-neon:hover {
          border-color: rgba(99,102,241,.6);
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(99,102,241,.24);
        }
        .hip-neon::before {
          content: "";
          position: absolute; inset: -2px; border-radius: 14px; padding: 2px; 
          background: conic-gradient(from 0deg, #00e5ff, #8b5cf6, #ff2cdf, #00e5ff);
          -webkit-mask: 
            linear-gradient(#000 0 0) content-box, 
            linear-gradient(#000 0 0); 
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: hip-spin 2.2s linear infinite paused;
          opacity: .75;
        }
        .hip-neon:hover::before { animation-play-state: running; }
        .hip-neon .hip-inner-glow {
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(100% 60% at 50% 0%, rgba(139,92,246,.25), transparent 60%);
          pointer-events: none;
        }
        @keyframes hip-spin { to { transform: rotate(360deg); } }
      `}</style>

      <button type="button" aria-label="Neon Trace" className="hip-neon w-[200px] h-[52px]">
        <span className="hip-inner-glow" aria-hidden="true" />
        Neon Trace
      </button>
    </div>
  );
}

