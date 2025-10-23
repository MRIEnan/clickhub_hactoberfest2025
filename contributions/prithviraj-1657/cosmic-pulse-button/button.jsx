import React, { useState } from 'react';

const CosmicPulseButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    position: 'relative',
    padding: '15px 30px',
    fontSize: '18px',
    color: '#fff',
    background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: isHovered 
      ? '0 0 20px rgba(37, 117, 252, 0.5), 0 0 40px rgba(106, 17, 203, 0.3)'
      : '0 5px 15px rgba(0, 0, 0, 0.2)',
  };

  const pulseStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isHovered ? '200%' : '100%',
    height: isHovered ? '200%' : '100%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
    transition: 'all 0.5s ease',
    pointerEvents: 'none',
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={pulseStyle} />
      Cosmic Pulse
    </button>
  );
};

export default CosmicPulseButton;
