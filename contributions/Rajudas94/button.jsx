'use client';				// Tells Next.js that this component runs in the browser (client-side)
import { useState } from 'react';	// useState lets us track and update state (like whether the button was clicked)


export default function Button() {
  // Track if the button is clicked
  const [clicked, setClicked] = useState(false);	

  // When the button is clicked
  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1200); // reset sparkle effect after 0.8s so it can run again
  };
  
  // create an array of sparkles 
  const sparkles = Array.from({ length: 15 }); 

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className="relative px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-700 rounded-full transition-all duration-300 hover:ring-4 hover:ring-pink-400/70 hover:ring-offset-2 hover:scale-105 focus:outline-none overflow-hidden shadow-lg"
      >
        Twinkle Magic ✨	{ /* button text */ }
        
	{ /* sparkles appear only when clicked */ }
        {clicked &&
          sparkles.map((_, i) => {
            const x = Math.random() * 90;	// random x position inside button 
            const y = Math.random() * 90;	// random y position inside button 
            const delay = Math.random() * 0.5;  // delay value, for delay between sparkles 
            return (
              <span
                key={i}
                // Small round white circles
                className="absolute w-2 h-2 bg-white rounded-full opacity-0"
                style={{
                  top: `${y}%`,
                  left: `${x}%`,
                  animation: `twinkle 1.2s ease-out ${delay}s forwards`,
                }}
              ></span>
            );
          })}
      </button>

      {/* This part defines how each sparkle behaves over time from the moment it appears to when it disappears */}
      <style jsx>{`
        @keyframes twinkle {
          
          0% { transform: scale(0.5); opacity: 0; }	/* start small and invisible */
          
          25% { transform: scale(1.3); opacity: 1; }	/* grow and get bright */
          
          50% { opacity: 0.7; }				/* dim */
          
          75% { opacity: 1; }				/* flicker */
          
          100% { transform: scale(0); opacity: 0; }	/* disappear */
        }
      `}</style>
    </div>
  );
}

