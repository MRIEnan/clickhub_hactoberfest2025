'use client';

import { useState } from 'react';

export default function Button() {
  const [ripples, setRipples] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    setIsClicked(true);
    const rect = e.target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, size, key: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
    }, 800);

    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <button
      aria-label="Neon Pulse Button"
      onClick={handleClick}
      className={`
        relative px-10 py-4 font-semibold text-white rounded-xl
        bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
        transform transition-all duration-200 ease-in-out
        focus:outline-none
        hover:scale-105 hover:shadow-2xl
        ${isClicked ? 'scale-95' : ''}
        overflow-hidden cursor-pointer glow-button
      `}
    >
      Click Me!
      
      {ripples.map((r) => (
        <span
          key={r.key}
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
          }}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
        />
      ))}

      <style jsx>{`
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { transform: scale(4); opacity: 0; }
        }

        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 15px rgba(255,255,255,0.2),0 0 25px rgba(255,0,255,0.4),0 0 40px rgba(255,0,255,0.3); }
          50% { box-shadow: 0 0 25px rgba(255,255,255,0.3),0 0 45px rgba(255,0,255,0.6),0 0 60px rgba(255,0,255,0.5); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-ripple { animation: ripple 0.8s ease-out; }
        .glow-button { background-size: 200% 200%; animation: gradientShift 3s ease infinite, glowPulse 2s ease-in-out infinite; }
      `}</style>
    </button>
  );
}
