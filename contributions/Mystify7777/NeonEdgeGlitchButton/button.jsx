'use client';
import { useState, useCallback, useMemo } from 'react';

export default function NeonEdgeGlitchButton({ theme = 'cyber' }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState([]);

  const themes = useMemo(
    () => ({
      cyber: {
        gradient: 'from-cyan-400 via-blue-900 to-purple-500',
        gradientPressed: 'from-cyan-600 via-blue-950 to-purple-700',
        borderA: 'border-cyan-400',
        borderB: 'border-purple-400',
        textGradient: 'from-cyan-200 via-white to-purple-300',
        glitchColor: 'bg-cyan-300/30',
      },
      sunset: {
        gradient: 'from-orange-400 via-pink-600 to-purple-600',
        gradientPressed: 'from-orange-500 via-pink-700 to-purple-700',
        borderA: 'border-pink-400',
        borderB: 'border-orange-400',
        textGradient: 'from-yellow-200 via-white to-pink-300',
        glitchColor: 'bg-orange-300/30',
      },
      frost: {
        gradient: 'from-sky-300 via-indigo-900 to-blue-400',
        gradientPressed: 'from-sky-400 via-indigo-950 to-blue-500',
        borderA: 'border-sky-300',
        borderB: 'border-indigo-300',
        textGradient: 'from-blue-100 via-white to-sky-200',
        glitchColor: 'bg-sky-200/30',
      },
    }),
    []
  );

  const t = themes[theme] || themes.cyber;

  const handleDown = useCallback((e) => {
    setPressed(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setPressed(false);
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 500);
  }, []);

  return (
    <div className="relative flex items-center justify-center h-24">
      <button
        className={`
          relative px-12 py-5 font-bold text-xl text-white rounded-xl outline-none overflow-hidden
          bg-gradient-to-br ${pressed ? t.gradientPressed : t.gradient}
          transition-all duration-300
          ${
            pressed
              ? 'translate-y-[4px] scale-95 shadow-[0_2px_10px_rgba(0,0,0,0.6)]'
              : hovered
              ? 'translate-y-[-4px] scale-[1.03] shadow-[0_12px_30px_rgba(0,0,0,0.35)]'
              : 'shadow-[0_6px_20px_rgba(0,0,0,0.4)]'
          }
          focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:ring-offset-2
        `}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={handleDown}
        onKeyDown={(e) => e.key === 'Enter' && handleDown(e)}
        aria-label="Neon Edge Glitch Button"
      >
        {/* Corners */}
        <div
          className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${t.borderA} rounded-tl-md`} />
          <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${t.borderB} rounded-tr-md`} />
          <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${t.borderB} rounded-bl-md`} />
          <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${t.borderA} rounded-br-md`} />
        </div>

        {/* Glitch Lines */}
        {hovered && (
          <div className="absolute inset-0 overflow-hidden rounded-xl z-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`absolute left-0 w-full h-[2px] ${t.glitchColor} animate-glitch-line`}
                style={{
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Ripple */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute block bg-white/20 rounded-full animate-ripple"
            style={{
              top: r.y - 50,
              left: r.x - 50,
              width: 100,
              height: 100,
            }}
          />
        ))}

        {/* Text */}
        <span
          className={`relative z-20 bg-clip-text text-transparent bg-gradient-to-r ${t.textGradient}`}
        >
          Neon Glitch
        </span>
      </button>

      {/* Styles */}
      <style jsx global>{`
        @keyframes glitchLine {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateX(0%); opacity: 0.8; }
          90% { transform: translateX(100%); opacity: 0; }
        }
        .animate-glitch-line {
          animation: glitchLine 0.7s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.25); }
        }
        .animate-glowPulse {
          animation: glowPulse 2.4s ease-in-out infinite;
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(3); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-glitch-line,
          .animate-glowPulse,
          .animate-ripple {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
