import React from "react";

export default function LiquidWaveButton() {
  return (
    <button className="relative overflow-hidden px-10 py-3 text-white font-semibold bg-indigo-600 rounded-xl shadow-md group">
      <span className="absolute inset-0 bg-indigo-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
      <span className="relative z-10">Liquid Wave</span>
    </button>
  );
}
