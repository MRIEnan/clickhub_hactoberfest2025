'use client';
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function button({ text = "Click me", onClick }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      backgroundPosition: ["0% 0%", "200% 0%"],
      transition: {
        repeat: Infinity,
        duration: 2.5,
        ease: "linear",
      },
    });
  }, [controls]);

  const handleHoverStart = () => controls.stop();
  const handleHoverEnd = () => {
    controls.start({
      backgroundPosition: ["0% 0%", "200% 0%"],
      transition: {
        repeat: Infinity,
        duration: 2.5,
        ease: "linear",
      },
    });
  };

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="relative px-10 py-4 text-xl font-semibold text-white rounded-full bg-black overflow-hidden"
    >
      {/* moving glowing light border */}
      <motion.span
        animate={controls}
        className="absolute inset-0 rounded-full p-[2px] bg-[linear-gradient(90deg,transparent,#ffffff,transparent)] bg-[length:200%_100%]"
      >
        {/* inner dark fill to mask center */}
        <span className="absolute inset-[2px] rounded-full bg-black" />
      </motion.span>

      <span className="relative z-10">{text}</span>
    </motion.button>
  );
}