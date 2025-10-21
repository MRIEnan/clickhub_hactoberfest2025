'use client';
import { useState, useRef } from 'react';

export default function MagneticPulseButton() {
  const [pressed, setPressed] = useState(false);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  function handleMagnet(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const { clientX, clientY } = e;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    setMagnet({
      x: dx / 8,
      y: dy / 8,
    });
  }

  function resetMagnet() {
    setMagnet({ x: 0, y: 0 });
  }

  function handlePress() {
    setPressed(true);
    setTimeout(() => setPressed(false), 150); // Fast tap feel
  }

  return (
    <div
      className="relative flex justify-center items-center h-28"
      onMouseMove={handleMagnet}
      onMouseLeave={resetMagnet}
    >
      {/* Magnetic field effect */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-56 h-24 opacity-40 rounded-full blur-2xl bg-gradient-to-tr from-cyan-400 via-indigo-400 to-orange-200 animate-pulse-fast" />
      </div>
      {/* Main Button */}
      <button
        ref={ref}
        className={`
          relative z-10 px-12 py-6 font-bold text-xl text-white rounded-xl outline-none
          bg-gradient-to-br from-cyan-500 via-indigo-900 to-orange-400
          shadow-lg 
          transition-transform duration-150
          focus:outline-blue-400
          ${pressed ? 'animate-pressed' : ''}
        `}
        style={{
          transform: `translate(${magnet.x}px, ${magnet.y}px) scale(${pressed ? 0.97 : 1})`,
        }}
        onMouseDown={handlePress}
        onKeyDown={e => e.key === 'Enter' ? handlePress() : null}
        aria-label="Magnetic Pulse Button"
        tabIndex={0}
      >
        <span>Magnetic Pulse</span>
        {/* Click ripple (subtle) */}
        {pressed && (
          <span className="absolute inset-0 rounded-xl pointer-events-none border-2 border-cyan-400 animate-pulse-ring" />
        )}
      </button>
      <style jsx>{`
        .animate-pulse-fast {
          animation: pulse-fast 1.4s alternate infinite;
        }
        @keyframes pulse-fast {
          0% { opacity: 0.10; }
          90% { opacity: 0.21; }
          100% { opacity: 0.10; }
        }
        .animate-pulse-ring { 
          animation: pulse-ring 0.13s cubic-bezier(.26,1,.38,.89);
        }
        @keyframes pulse-ring {
          0% { opacity:0.45; transform: scale(1);}
          90% { opacity:0.13; transform: scale(1.12);}
          100% { opacity:0; transform: scale(1.19);}
        }
        .animate-pressed {
          animation: pressed 0.13s cubic-bezier(.26,1,.38,.89);
        }
        @keyframes pressed {
          0% { transform: scale(1);}
          60% {transform: scale(0.97);}
          100% {transform: scale(1);}
        }
      `}</style>
    </div>
  );
}


// Magnetic Pulse Edge Button by @Mystify7777