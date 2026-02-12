import { motion } from "framer-motion";

const SmoothAuroraButton = ({ children, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative px-6 py-3 rounded-full text-white font-bold overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-30 blur-xl animate-aurora"></span>
      <span className="relative">{children}</span>
    </motion.button>
  );
};

export default SmoothAuroraButton;
