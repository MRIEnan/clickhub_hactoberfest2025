'use client'
import React, { useState, useEffect } from 'react';

const LiquidMorphButton = () => {
    const [hover, setHover] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [particles, setParticles] = useState([]);
    const [ripples, setRipples] = useState([]);

    useEffect(() => {
        if (isClicked) {
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: Date.now() + i,
            angle: (i / 20) * 360,
            delay: i * 0.02
        }));
        setParticles(newParticles);
        
        setTimeout(() => setParticles([]), 1000);
        }
    }, [isClicked]);

    const handleClick = (e) => {
        setIsClicked(!isClicked);
        
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const newRipple = {
        id: Date.now(),
        x,
        y
        };
        
        setRipples(prev => [...prev, newRipple]);
        setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 800);
    };

    return (
        <>
        <style>{`
            @keyframes morphBorder {
            0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
            25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
            50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
            75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
            }
            
            @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            }
            
            @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
            }
            
            @keyframes particle {
            0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) translateX(var(--tx)) translateY(var(--ty)) scale(0);
                opacity: 0;
            }
            }
            
            @keyframes ripple {
            0% {
                width: 0;
                height: 0;
                opacity: 0.8;
            }
            100% {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
            }
            
            @keyframes glow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
            }
            
            .morph-button {
            position: relative;
            padding: 1.2rem 2.4rem; /* reduced from 1.5rem 3rem */
            font-size: 1.3rem;      /* reduced from 1.5rem */
            font-weight: 700;
            color: #fff;
            background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.3) 0%,
                rgba(59, 130, 246, 0.3) 50%,
                rgba(236, 72, 153, 0.3) 100%);
            border: 2px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(20px);
            cursor: pointer;
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            letter-spacing: 2px;
            overflow: hidden;
            animation: morphBorder 8s ease-in-out infinite, float 3s ease-in-out infinite;
            }
            
            .morph-button::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
            );
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
            }
            
            .morph-button::after {
            content: '';
            position: absolute;
            inset: -2px;
            background: linear-gradient(
                45deg,
                #8b5cf6,
                #3b82f6,
                #ec4899,
                #8b5cf6
            );
            background-size: 300% 300%;
            border-radius: inherit;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.5s;
            animation: shimmer 4s infinite;
            filter: blur(10px);
            }
            
            .morph-button:hover {
            transform: scale(1.05) translateY(-5px);
            box-shadow: 
                0 20px 60px rgba(139, 92, 246, 0.6),
                0 0 40px rgba(59, 130, 246, 0.4),
                inset 0 0 20px rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.6);
            }
            
            .morph-button:hover::after {
            opacity: 1;
            }
            
            .morph-button.clicked {
            background: linear-gradient(135deg, 
                rgba(236, 72, 153, 0.4) 0%,
                rgba(139, 92, 246, 0.4) 50%,
                rgba(59, 130, 246, 0.4) 100%);
            animation: morphBorder 2s ease-in-out infinite, float 1.5s ease-in-out infinite;
            }
            
            .particle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(139, 92, 246, 0) 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: particle 0.8s ease-out forwards;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            }
            
            .ripple {
            position: absolute;
            border: 2px solid rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.8s ease-out;
            transform: translate(-50%, -50%);
            }
            
            .ambient-glow {
            position: absolute;
            width: 150%;
            height: 150%;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
            animation: glow 2s ease-in-out infinite;
            pointer-events: none;
            z-index: -1;
            }
        `}</style>
        
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <div className="ambient-glow" />
            <button
            className={`morph-button ${isClicked ? 'clicked' : ''}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={handleClick}
            >
            {particles.map(p => (
                <div
                key={p.id}
                className="particle"
                style={{
                    left: '50%',
                    top: '50%',
                    '--tx': `${Math.cos((p.angle * Math.PI) / 180) * 100}px`,
                    '--ty': `${Math.sin((p.angle * Math.PI) / 180) * 100}px`,
                    animationDelay: `${p.delay}s`
                }}
                />
            ))}
            
            {ripples.map(r => (
                <div
                key={r.id}
                className="ripple"
                style={{
                    left: `${r.x}%`,
                    top: `${r.y}%`
                }}
                />
            ))}
            
            {isClicked ? '✨ MORPHED ✨' : '🌊 LIQUID MORPH'}
            </button>
        </div>
        </>
    );
};

export default LiquidMorphButton;
