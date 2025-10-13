import { useState, useMemo } from "react";
import "./style.css";

export default function Button() {
  const [clicked, setClicked] = useState(false);

  // Stable sparkle positions
  const sparkPositions = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      size: 1 + Math.random() * 3 + "px",
      delay: Math.random() * 1.5 + "s",
      duration: 0.8 + Math.random() * 1 + "s",
    }));
  }, []);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative px-20 py-8 font-extrabold text-white text-3xl
        rounded-3xl transition-all duration-500
        cursor-pointer overflow-hidden
        shadow-[0_0_30px_rgba(255,0,255,0.6)]
        hover:shadow-[0_0_50px_rgba(255,0,255,0.9)]
        transform hover:scale-110 hover:-rotate-2
        border-2 border-white
        bg-[linear-gradient(270deg,#ff00ff,#00ffff,#ff00ff)]
        animate-gradient
      `}
    >
      {/* Inner Neon Glow Layer */}
      <span className="
        absolute inset-0 rounded-3xl
        opacity-60 blur-3xl
        bg-[linear-gradient(270deg,#ff00ff,#00ffff,#ff00ff)]
        animate-gradient
        pointer-events-none
      "></span>

      {/* Animated Gradient Border */}
      <span className="
        absolute -inset-1 rounded-3xl
        opacity-70 blur-xl
        border border-transparent
        bg-[linear-gradient(270deg,#ff00ff,#00ffff,#ff00ff)]
        animate-gradient
      "></span>

      {/* Sparkles */}
      <span className="absolute inset-0 pointer-events-none">
        {sparkPositions.map((pos, i) => (
          <span
            key={i}
            className="absolute bg-white rounded-full opacity-0 animate-twinkle"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.size,
              height: pos.size,
              animationDelay: pos.delay,
              animationDuration: pos.duration,
            }}
          />
        ))}
      </span>

      {/* Button Text */}
      <span className="
        relative z-10 text-center drop-shadow-[0_0_30px_white]
        animate-textGlow
      ">
        Hover & Click Me
      </span>

      {/* Ripple on Click */}
      {clicked && (
        <span className="absolute inset-0 rounded-3xl bg-white/20 animate-ripple"></span>
      )}

      {/* Inner Pulse */}
      <span className="absolute inset-0 rounded-3xl bg-white/5 animate-ping pointer-events-none"></span>
    </button>
  );
}
