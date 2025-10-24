'use client';

import React, { useState } from 'react';

export default function CosmicLaunchButton({ children = 'LAUNCH', onClick }) {
    const [isPressed, setIsPressed] = useState(false);
    const [ripples, setRipples] = useState([]);

    const handleClick = (e) => {
        setIsPressed(true);

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = { x, y, id: Date.now() };
        setRipples(prev => [...prev, newRipple]);

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 700);

        setTimeout(() => setIsPressed(false), 200);
        if (onClick) onClick(e);
    };

    return (
        <div className="relative inline-block group">
            <div
                className="absolute -inset-2 rounded-2xl opacity-75 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-700"
                style={{
                    background: 'conic-gradient(from 0deg, #ff00ff, #00ffff, #ffdd00, #ff00ff)',
                    animation: 'cosmic 4s linear infinite',
                }}
            />

            <button
                onClick={handleClick}
                className={`relative px-12 py-5 rounded-2xl font-extrabold tracking-wider uppercase text-lg transition-all duration-200 shadow-2xl border-2 overflow-hidden ${
                    isPressed
                        ? 'bg-gray-900 border-indigo-500 scale-95 shadow-inner'
                        : 'bg-gray-950 text-white border-transparent hover:border-cyan-400 hover:text-cyan-300 hover:scale-105 hover:shadow-cyan-500/40'
                }`}
            >
                {ripples.map(r => (
                    <span
                        key={r.id}
                        className="absolute rounded-full bg-white/30"
                        style={{
                            left: r.x,
                            top: r.y,
                            width: 0,
                            height: 0,
                            transform: 'translate(-50%, -50%)',
                            animation: 'ripple 0.7s ease-out',
                        }}
                    />
                ))}

                <span className="relative z-10 flex items-center gap-2">
                    {children}
                    <span className="inline-block group-hover:translate-x-2 transition-transform duration-300">🚀</span>
                </span>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

            <style jsx>{`
                @keyframes cosmic {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes ripple {
                    to {
                        width: 250px;
                        height: 250px;
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}
