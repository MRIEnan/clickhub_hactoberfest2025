'use client';
import { useState } from 'react';

export default function GlowButton() {
  const [clicked, setClicked] = useState(false);

  return (
    <button
      onClick={() => setClicked(!clicked)}
      className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-pink-500/50"
    >
      {clicked ? "Clicked!" : "Click Me ✨"}
    </button>
  );
}
