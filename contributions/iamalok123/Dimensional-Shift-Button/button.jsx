'use client';

import React, { useState } from 'react';

const DimensionalShiftButton = ({ children = 'ENTER PORTAL', onClick }) => {
  const [shifting, setShifting] = useState(false);

  const handleClick = (e) => {
    setShifting(true);
    setTimeout(() => setShifting(false), 800);
    if (onClick) onClick(e);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className={`relative px-12 py-5 font-extrabold text-lg rounded-2xl overflow-hidden text-white transition-all duration-300 focus:outline-none ${
          shifting ? 'scale-105 shadow-portal' : 'hover:scale-105'
        }`}
        style={{
          background: 'linear-gradient(135deg, #7f00ff 0%, #00e5ff 100%)',
          boxShadow: shifting
            ? '0 0 40px rgba(127,0,255,0.7), 0 0 80px rgba(0,229,255,0.6)'
            : '0 6px 20px rgba(127,0,255,0.4)',
        }}
      >
        {/* Portal expanding ring */}
        {shifting && (
          <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-warp" />
        )}

        {/* Warp lines */}
        {shifting &&
          [...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute bg-gradient-to-t from-fuchsia-500 to-cyan-400 opacity-60"
              style={{
                width: '2px',
                height: '40px',
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 30}deg) translateY(-50%)`,
                animation: 'warp-lines 0.8s ease-out forwards',
              }}
            />
          ))}

        {/* Button content */}
        <span className="relative z-10 flex items-center gap-3 tracking-wider">
          <span className="text-xl animate-spin-slow">🌀</span>
          {children}
          <span className="text-xl animate-spin-slow-rev">🌀</span>
        </span>

        {/* Shimmer beam */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-flow" />

        <style jsx>{`
          @keyframes warp {
            0% {
              transform: scale(0.8);
              opacity: 0.7;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }

          @keyframes warp-lines {
            0% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) scale(0.3);
              opacity: 0;
            }
          }

          @keyframes flow {
            0% {
              transform: translateX(-200%) skewX(-12deg);
            }
            100% {
              transform: translateX(200%) skewX(-12deg);
            }
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes spin-slow-rev {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }

          .animate-warp {
            animation: warp 0.8s ease-out forwards;
          }

          .animate-flow {
            animation: flow 3s linear infinite;
          }

          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }

          .animate-spin-slow-rev {
            animation: spin-slow-rev 3s linear infinite;
          }

          .shadow-portal {
            box-shadow: 0 0 40px rgba(127, 0, 255, 0.7),
              0 0 80px rgba(0, 229, 255, 0.6);
          }
        `}</style>
      </button>
    </div>
  );
};

export default DimensionalShiftButton;
