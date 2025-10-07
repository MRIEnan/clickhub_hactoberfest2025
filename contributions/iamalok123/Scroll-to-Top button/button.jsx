'use client';
import React, { useEffect, useState } from 'react';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(true);

  // Scroll smoothly to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl shadow-lg transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-0'
      } hover:scale-110 hover:shadow-purple-400/70 animate-bounce-once`}
    >
      ⬆
      <style jsx>{`
        @keyframes bounce-once {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce-once:hover {
          animation: bounce-once 0.6s ease;
        }

        button::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.4) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        button:hover::after {
          opacity: 1;
        }
      `}</style>
    </button>
  );
};

export default ScrollToTopButton;
