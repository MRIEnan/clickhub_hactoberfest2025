import React from "react";

export default function NeonPulseButton() {
  return (
    <button className="relative px-8 py-3 text-lg font-bold text-white bg-transparent border-2 border-cyan-400 rounded-lg overflow-hidden group">
      <span className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-100 blur-lg transition duration-500"></span>
      <span className="relative z-10 group-hover:text-black transition duration-500">
        Neon Pulse
      </span>
    </button>
  );
}
