'use client';

import { useState } from 'react';

export default function AwesomeClickButton() {
  const [clicked, setClicked] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setClicked(true);
    setCount(count + 1);
    setTimeout(() => setClicked(false), 300); // brief bounce effect
  };

  return (
    <button
      onClick={handleClick}
      className={`
        px-8 py-4 
        font-bold text-white 
        rounded-xl 
        transition-all duration-300 
        transform 
        ${clicked ? 'scale-110 shadow-lg' : 'shadow-md'} 
        bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
        hover:from-pink-500 hover:via-red-500 hover:to-yellow-500
      `}
    >
      {clicked ? 'Clicked! 🎉' : 'Click Me!'} {count > 0 && `(${count})`}
    </button>
  );
}
