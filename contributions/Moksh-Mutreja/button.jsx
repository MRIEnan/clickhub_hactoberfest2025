'use client';

import { useState } from 'react';

export default function SnakeButton() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="relative group inline-block">
      <button 
        onClick={() => setIsClicked(!isClicked)}
        className="snake-border-btn"
      >
        <div className="inner-glow"></div>

        <span className={`snake-border snake-top ${isClicked ? 'active' : ''}`}></span>
        <span className={`snake-border snake-right ${isClicked ? 'active' : ''}`}></span>
        <span className={`snake-border snake-bottom ${isClicked ? 'active' : ''}`}></span>
        <span className={`snake-border snake-left ${isClicked ? 'active' : ''}`}></span>

        <span className="button-text">
          {isClicked ? 'CLICKED!' : 'CLICK ME'}
        </span>

        {isClicked && <span className="ripple-effect"></span>}

        <style jsx>{`
          .snake-border-btn {
            position: relative;
            display: inline-block;
            padding: 14px 40px; /* Matches aurora-btn size */
            border: none;
            font-size: 1.2rem; /* Matches aurora-btn */
            font-weight: 500;
            color: #22d3ee;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 14px; /* Matches aurora-btn radius */
            backdrop-filter: blur(16px);
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
            box-shadow: 0 0 18px rgba(123, 47, 247, 0.6);
            z-index: 1;
          }

          .snake-border-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(123, 47, 247, 0.9);
          }

          .snake-border-btn:active {
            transform: scale(0.95);
          }

          .inner-glow {
            position: absolute;
            top: 0.125rem;
            left: 0.125rem;
            bottom: 0.125rem;
            width: 50%;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
            pointer-events: none;
            transition: opacity 0.7s;
          }

          .snake-border {
            position: absolute;
            background: linear-gradient(to right, transparent, #7b2ff7, #f107a3, #00e0ff, #2bff88, transparent);
            opacity: 0;
            transition: opacity 0.5s;
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
          }

          .snake-top {
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
          }

          .snake-right {
            top: 0;
            right: 0;
            width: 2px;
            height: 100%;
          }

          .snake-bottom {
            bottom: 0;
            right: 0;
            width: 100%;
            height: 2px;
          }

          .snake-left {
            bottom: 0;
            left: 0;
            width: 2px;
            height: 100%;
          }

          .snake-border.active {
            opacity: 1;
          }

          .snake-top.active {
            animation: snake-top 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .snake-right.active {
            animation: snake-right 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            animation-delay: 0.75s;
          }

          .snake-bottom.active {
            animation: snake-bottom 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            animation-delay: 1.5s;
          }

          .snake-left.active {
            animation: snake-left 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            animation-delay: 2.25s;
          }

          .button-text {
            position: relative;
            z-index: 10;
            transition: all 0.3s;
            text-transform: uppercase;
          }

          .ripple-effect {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
            pointer-events: none;
            animation: ripple 0.6s ease-out forwards;
          }

          @keyframes snake-top {
            0% { transform: translateX(-100%); opacity: 0; }
            10%, 90% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
          }

          @keyframes snake-right {
            0% { transform: translateY(-100%); opacity: 0; }
            10%, 90% { opacity: 1; }
            100% { transform: translateY(100%); opacity: 0; }
          }

          @keyframes snake-bottom {
            0% { transform: translateX(100%); opacity: 0; }
            10%, 90% { opacity: 1; }
            100% { transform: translateX(-100%); opacity: 0; }
          }

          @keyframes snake-left {
            0% { transform: translateY(100%); opacity: 0; }
            10%, 90% { opacity: 1; }
            100% { transform: translateY(-100%); opacity: 0; }
          }

          @keyframes ripple {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(2.5); opacity: 0; }
          }
        `}</style>
      </button>
    </div>
  );
}
