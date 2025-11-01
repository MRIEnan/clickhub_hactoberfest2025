'use client';
import React, { useState } from 'react';

type MyCustomButtonProps = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function MyCustomButtonV4({ children = '✨ ZEPHYRA ✨', onClick }: MyCustomButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPressed(true);
    setTimeout(() => setPressed(false), 150);
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative px-12 py-5 font-bold text-white text-xl rounded-3xl transition-transform duration-200
        ${hovered ? 'scale-105 shadow-2xl' : 'shadow-lg'}
        ${pressed ? 'scale-95' : ''}
      `}
      style={{
  backgroundImage: hovered
    ? 'linear-gradient(270deg, #ff6fcf, #6a0dad, #00f0ff, #ff6fcf)'
    : 'linear-gradient(270deg, #6a0dad, #ff6fcf, #00f0ff, #6a0dad)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '600% 600%',
  animation: 'gradientMove 5s ease infinite',
  boxShadow: hovered
    ? '0 10px 30px rgba(255,111,207,0.7), 0 0 20px rgba(0,240,255,0.7)'
    : '0 6px 15px rgba(106,13,173,0.5)',
  textShadow: '0 0 10px rgba(255,255,255,0.7)',
}}

    >
      <span className="relative z-10 flex items-center gap-2 justify-center">
        <span className="animate-pulse">🚀</span>
        {children}
        <span className={`inline-block transition-opacity ${hovered ? 'opacity-100 animate-ping' : 'opacity-0'}`}>✨</span>
      </span>

      {/* Glow */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(255,111,207,0.5) 0%, transparent 70%)',
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Sparkle lines */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute h-px bg-white opacity-40"
          style={{
            width: '100%',
            top: `${25 + i * 25}%`,
            left: 0,
            animation: `sparkMove 2s linear infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes sparkMove {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </button>
  );
}
