'use client';

import { useState } from 'react';

export default function ConfettiCelebrationButton() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setShowConfetti(true);
    setIsClicked(true);
    setTimeout(() => {
      setShowConfetti(false);
      setIsClicked(false);
    }, 2000);
  };

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'][i % 7],
    delay: Math.random() * 0.3,
    duration: 1.5 + Math.random() * 0.5,
    left: Math.random() * 100,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        onKeyDown={e => e.key === 'Enter' ? handleClick() : null}
        className={`
          px-8 py-4 font-bold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300
          ${isClicked 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white transform scale-95' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105'
          }
        `}
        aria-label="Celebrate Hacktoberfest"
        tabIndex={0}
        disabled={showConfetti}
      >
        🎉 Hacktober-flare!
      </button>
      
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {confettiPieces.map(piece => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 opacity-90"
              style={{
                backgroundColor: piece.color,
                left: `${piece.left}%`,
                top: '50%',
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
                transform: `rotate(${piece.rotation}deg)`,
              }}
            />
          ))}
        </div>
      )}
      
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-100px) rotate(180deg) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translateY(150px) rotate(360deg) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
// Confetti Button by @Mystify7777