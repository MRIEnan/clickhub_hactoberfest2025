import React, { useState } from 'react';

export default function AnimatedButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-8">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white mb-12">
          Beautiful Animated Button
        </h1>
        
        <button
          className="relative px-12 py-6 text-xl font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full shadow-2xl overflow-hidden transition-all duration-300 transform hover:scale-110 hover:shadow-pink-500/50 focus:outline-none focus:ring-4 focus:ring-purple-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          style={{
            boxShadow: isHovered
              ? '0 0 40px rgba(236, 72, 153, 0.6), 0 0 80px rgba(168, 85, 247, 0.4)'
              : '0 20px 40px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Animated background gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          />

          {/* Shimmer effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 ${
                isHovered ? 'animate-shimmer' : ''
              }`}
              style={{
                animation: isHovered ? 'shimmer 1.5s infinite' : 'none',
              }}
            />
          </div>

          {/* Ripple effects */}
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute bg-white rounded-full opacity-75 animate-ripple"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: '20px',
                height: '20px',
                transform: 'translate(-50%, -50%)',
                animation: 'ripple 0.6s ease-out',
              }}
            />
          ))}

          {/* Button text */}
          <span className="relative z-10 flex items-center gap-3">
            Click Me
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isHovered ? 'translate-x-2' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>

          {/* Floating particles */}
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: '0',
                    animation: `float ${1 + Math.random()}s ease-in infinite`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </>
          )}
        </button>

        <p className="text-gray-300 text-sm mt-8">
          Hover and click to see the magic ✨
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        @keyframes ripple {
          0% {
            width: 20px;
            height: 20px;
            opacity: 0.75;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) translateX(${Math.random() * 40 - 20}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}