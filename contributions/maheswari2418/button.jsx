
'use client';

export default function PureGlassButton() {
  return (
    <button className="pure-glass-btn">
      Glassmorphism
      <style jsx>{`
        .pure-glass-btn {
          position: relative;
          padding: 16px 50px;
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255, 255, 255, 0.5);
          border-radius: 25px;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(71, 222, 194, 0.4),
                      0 6px 20px rgba(47, 109, 175, 0.2);
          transition: all 0.3s ease;
        }

        .pure-glass-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            120deg,
            rgba(255,255,255,0.6),
            rgba(255,255,255,0.1),
            rgba(255,255,255,0.6)
          );
          transform: skewX(-20deg);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .pure-glass-btn:hover::before {
          left: 125%;
          transition: all 0.6s ease-in-out;
        }

        .pure-glass-btn:hover {
          background: rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.5),
                      0 8px 25px rgba(200, 200, 200, 0.3);
        }

        .pure-glass-btn:active {
          transform: scale(0.97);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.4),
                      0 4px 15px rgba(200, 200, 200, 0.2);
        }
      `}</style>
    </button>
  );
}
