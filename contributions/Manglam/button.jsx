// button.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * BoldSpaceRocketButton - single-file React + Tailwind button component
 *
 * Usage:
 *   <BoldSpaceRocketButton label="Launch" size="md" onClick={() => console.log('launched')} />
 *
 * Props:
 *  - label: string | node (default "Ignite")
 *  - size: "sm" | "md" | "lg" (default "md")
 *  - onClick: function
 *  - className: additional classes
 *
 * Features:
 *  - Tailwind utility classes + internal CSS animations
 *  - Rocket SVG with animated flame
 *  - Bold click animation: rocket liftoff, flame boost, shockwave, confetti/stars burst, glow/pulse
 *  - Keyboard support (Enter/Space)
 *  - Self-contained: no external assets
 */

export default function BoldSpaceRocketButton({
  label = "Ignite",
  size = "md",
  onClick,
  className = "",
  ...rest
}) {
  const root = useRef(null);
  const burstContainer = useRef(null);
  const rippleContainer = useRef(null);
  const [isActive, setIsActive] = useState(false); // during physical mouse down
  const [isLaunching, setIsLaunching] = useState(false); // full launch animation running

  // size map
  const sizes = {
    sm: { pad: "px-3 py-2", text: "text-sm", icon: "w-4 h-4", rocketScale: 0.85 },
    md: { pad: "px-5 py-3", text: "text-base", icon: "w-5 h-5", rocketScale: 1 },
    lg: { pad: "px-6 py-4", text: "text-lg", icon: "w-6 h-6", rocketScale: 1.12 },
  };
  const s = sizes[size] || sizes.md;

  // Utility: create ephemeral DOM elements (stars/confetti)
  function spawnBurst(options = {}) {
    const el = burstContainer.current;
    if (!el) return;
    const {
      count = 18,
      centerX = el.clientWidth / 2,
      centerY = el.clientHeight / 2,
      spread = 1.1,
    } = options;

    for (let i = 0; i < count; i++) {
      const part = document.createElement("span");
      const sizePx = Math.round(Math.random() * 8) + 4;
      const hue = Math.floor(200 + Math.random() * 120); // bluish-purple to pinkish
      const light = Math.floor(60 + Math.random() * 20);
      const color = `hsl(${hue} 90% ${light}%)`;
      part.style.position = "absolute";
      part.style.width = `${sizePx}px`;
      part.style.height = `${sizePx}px`;
      part.style.left = `${centerX - sizePx / 2}px`;
      part.style.top = `${centerY - sizePx / 2}px`;
      part.style.borderRadius = `${Math.random() > 0.5 ? "50%" : "15%"}`;
      part.style.background = color;
      part.style.pointerEvents = "none";
      part.style.zIndex = 60;
      part.style.filter = "drop-shadow(0 4px 10px rgba(0,0,0,0.35))";
      // random vector
      const angle = Math.random() * Math.PI * 2;
      const dist = (20 + Math.random() * 80) * spread;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - (Math.random() * 20); // favour upwards
      // apply animation via transition
      part.style.opacity = "1";
      part.style.transform = "translate(0px,0px) scale(1)";
      part.style.transition = `transform 700ms cubic-bezier(.12,.9,.22,1), opacity 700ms linear`;
      el.appendChild(part);

      // trigger transform on next tick
      requestAnimationFrame(() => {
        part.style.transform = `translate(${dx}px, ${dy}px) scale(${0.3 + Math.random() * 0.9}) rotate(${Math.random() * 720}deg)`;
        part.style.opacity = "0";
      });

      // cleanup
      setTimeout(() => {
        try {
          part.remove();
        } catch (e) {}
      }, 900 + Math.random() * 300);
    }
  }

  // create a radial shockwave ripple (large ring)
  function spawnShockwave({ x, y } = {}) {
    const el = rippleContainer.current;
    if (!el) return;
    const r = document.createElement("span");
    r.style.position = "absolute";
    r.style.left = `${x - 8}px`;
    r.style.top = `${y - 8}px`;
    r.style.width = "16px";
    r.style.height = "16px";
    r.style.borderRadius = "9999px";
    r.style.border = "2px solid rgba(255,255,255,0.85)";
    r.style.boxShadow = "0 8px 30px rgba(99,102,241,0.28)";
    r.style.pointerEvents = "none";
    r.style.opacity = "0.9";
    r.style.transform = "scale(0)";
    r.style.zIndex = 50;
    r.style.transition = "transform 550ms cubic-bezier(.17,.9,.32,1), opacity 550ms linear";
    el.appendChild(r);
    requestAnimationFrame(() => {
      r.style.transform = "scale(18)";
      r.style.opacity = "0";
    });
    setTimeout(() => r.remove(), 700);
  }

  // small ripple at pointer location (subtle)
  function smallRipple(e) {
    const el = rippleContainer.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dot = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 0.14;
    dot.style.position = "absolute";
    dot.style.left = `${x - size / 2}px`;
    dot.style.top = `${y - size / 2}px`;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.borderRadius = "9999px";
    dot.style.background = "rgba(255,255,255,0.18)";
    dot.style.pointerEvents = "none";
    dot.style.zIndex = 55;
    dot.style.transform = "scale(0)";
    dot.style.transition = "transform 520ms cubic-bezier(.12,.9,.22,1), opacity 520ms linear";
    el.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.transform = "scale(1)";
      dot.style.opacity = "0";
    });
    setTimeout(() => dot.remove(), 600);
  }

  // handle the bold click action
  function triggerLaunch(e) {
    // prevent overlapping launches
    if (isLaunching) return;
    setIsLaunching(true);
    // visual immediate reactions
    setIsActive(true);
    // spawn local star/confetti burst around the pointer
    if (e && e.clientX != null) {
      const rect = root.current.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      spawnBurst({ count: 22, centerX: localX, centerY: localY, spread: 1.4 });
      spawnShockwave({ x: localX, y: localY });
    } else {
      // center burst
      const rect = root.current.getBoundingClientRect();
      spawnBurst({ count: 22, centerX: rect.width / 2, centerY: rect.height / 2, spread: 1.2 });
      spawnShockwave({ x: rect.width / 2, y: rect.height / 2 });
    }
    smallRipple(e || { clientX: root.current.getBoundingClientRect().left + root.current.offsetWidth / 2, clientY: root.current.getBoundingClientRect().top + root.current.offsetHeight / 2 });

    // call user callback
    if (onClick) {
      try {
        onClick(e);
      } catch (err) {
        // swallow
        console.error(err);
      }
    }

    // After short duration revert states
    setTimeout(() => {
      setIsActive(false);
    }, 520);

    // total launch animation length (longer to show celebration)
    setTimeout(() => {
      setIsLaunching(false);
    }, 1200);
  }

  // keyboard support
  function onKeyDown(e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!isActive) {
        setIsActive(true);
      }
    }
  }
  function onKeyUp(e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setIsActive(false);
      triggerLaunch();
    }
  }

  // pointer handlers
  function onPointerDown(e) {
    setIsActive(true);
  }
  function onPointerUp(e) {
    setIsActive(false);
    triggerLaunch(e.nativeEvent || e);
  }

  // cleanup on unmount (just in case)
  useEffect(() => {
    return () => {
      if (burstContainer.current) burstContainer.current.innerHTML = "";
      if (rippleContainer.current) rippleContainer.current.innerHTML = "";
    };
  }, []);

  // label accessible text
  const ariaLabel = typeof label === "string" ? label : "Launch";

  return (
    <>
      {/* Internal CSS for animations (keeps Tailwind focused on layout) */}
      <style>{`
/* motion helpers */
@keyframes flame-flicker {
  0% { transform: scaleY(1) translateY(0); opacity: 0.9; filter: blur(0px); }
  40% { transform: scaleY(1.18) translateY(3px); opacity: 1; filter: blur(.6px); }
  100% { transform: scaleY(1) translateY(0); opacity: 0.9; filter: blur(0px); }
}
@keyframes rocket-lift {
  0% { transform: translateY(0) scale(1) rotate(0deg); }
  40% { transform: translateY(-22px) scale(1.02) rotate(-1deg); }
  100% { transform: translateY(-44px) scale(0.98) rotate(-2deg); }
}
@keyframes rocket-tilt {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(-3deg); }
  100% { transform: rotate(0deg); }
}
@keyframes glowPulse {
  0% { box-shadow: 0 6px 20px rgba(99,102,241,0.16), 0 0 0 0 rgba(99,102,241,0.0); }
  50% { box-shadow: 0 18px 40px rgba(99,102,241,0.22), 0 0 0 10px rgba(99,102,241,0.06); }
  100% { box-shadow: 0 6px 20px rgba(99,102,241,0.16), 0 0 0 0 rgba(99,102,241,0.0); }
}
`}</style>

      <div
        ref={root}
        role="button"
        tabIndex={0}
        aria-pressed={isActive || isLaunching}
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setIsActive(false)}
        onPointerLeave={() => setIsActive(false)}
        className={`relative inline-flex items-center rounded-full select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/20 ${s.pad} ${className}`}
        {...rest}
        style={{
          transformStyle: "preserve-3d",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* Background band + glow */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full transition-all duration-350 ease-out"
          style={{
            background: isLaunching
              ? "radial-gradient(120% 80% at 50% 20%, rgba(99,102,241,0.14), rgba(168,85,247,0.04) 35%, transparent 55%)"
              : "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))",
            boxShadow: isLaunching ? "0 24px 70px rgba(99,102,241,0.18)" : "0 10px 28px rgba(2,6,23,0.35)",
            transform: isActive ? "translateY(1px) scale(0.995)" : "translateY(0) scale(1)",
          }}
        />

        {/* orbit rim */}
        <span
          aria-hidden
          className="absolute -inset-1 rounded-full pointer-events-none"
          style={{
            border: "1px solid rgba(255,255,255,0.05)",
            mixBlendMode: "overlay",
            transition: "transform 260ms ease, opacity 260ms ease",
            opacity: isLaunching ? 0.95 : 1,
            transform: isLaunching ? "scale(1.02)" : "scale(1)",
          }}
        />

        {/* left rocket */}
        <span
          aria-hidden
          className="relative z-10 flex items-center justify-center mr-3"
          style={{
            transform: isLaunching ? `translateY(-40px) scale(${s.rocketScale * 0.98}) rotate(-2deg)` : `translateY(${isActive ? -4 : 0}px) scale(${s.rocketScale})`,
            transition: isLaunching ? "transform 780ms cubic-bezier(.08,.9,.22,1)" : "transform 220ms cubic-bezier(.2,.9,.3,1)",
          }}
        >
          <svg
            className={`${s.icon} block`}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <linearGradient id="rocketGrad" x1="0" x2="1">
                <stop offset="0" stopColor="#7dd3fc" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
              <linearGradient id="flameGrad" x1="0" x2="1">
                <stop offset="0" stopColor="#ffc857" />
                <stop offset="1" stopColor="#ff6b6b" />
              </linearGradient>
            </defs>
            <g transform="translate(6 4) scale(0.9)">
              <path d="M20 2c6 0 14 6 14 14 0 8-2 18-8 24s-16 6-24 2C2 38 2 20 10 10S14 2 20 2z" fill="url(#rocketGrad)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
              <circle cx="18" cy="12" r="3.2" fill="rgba(255,255,255,0.95)"/>
              {/* flame - outer and inner */}
              <g transform="translate(12 30)">
                <path
                  d="M0 0 C3 6 9 10 12 0 C9 4 4 4 0 0 z"
                  fill="url(#flameGrad)"
                  style={{
                    transformOrigin: "center",
                    animation: isLaunching ? "flame-flicker 220ms linear infinite" : "flame-flicker 420ms linear infinite",
                    filter: isLaunching ? "blur(0.6px) saturate(1.15)" : "blur(0px) saturate(1)",
                    opacity: isLaunching ? 1 : 0.92,
                  }}
                />
                <path d="M6 0 C6 6 9 9 12 0" fill="rgba(255,255,255,0.06)" opacity="0.92" />
              </g>
            </g>
          </svg>
        </span>

        {/* label */}
        <span
          className={`relative z-20 font-bold tracking-wide ${s.text} text-white`}
          style={{
            textShadow: "0 2px 10px rgba(0,0,0,0.45)",
            transform: isLaunching ? "translateY(-18px) scale(1.02)" : isActive ? "translateY(-2px) scale(1.005)" : "translateY(0) scale(1)",
            transition: isLaunching ? "transform 680ms cubic-bezier(.08,.9,.22,1)" : "transform 200ms cubic-bezier(.2,.9,.3,1)",
          }}
        >
          {label}
        </span>

        {/* right decorative trail */}
        <span aria-hidden className="hidden sm:inline-flex items-center gap-2 ml-3 z-10">
          <svg width="18" height="6" viewBox="0 0 18 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M0 3c3-2 7-2 10-1s5 3 8 2" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="h-2 w-2 rounded-full bg-white/80 blur-sm" />
        </span>

        {/* particle container (stars/confetti) */}
        <span
          ref={burstContainer}
          aria-hidden
          className="absolute inset-0 z-40 pointer-events-none"
        />

        {/* ripple/shockwave container */}
        <span
          ref={rippleContainer}
          aria-hidden
          className="absolute inset-0 z-30 pointer-events-none"
        />
      </div>
    </>
  );
}
