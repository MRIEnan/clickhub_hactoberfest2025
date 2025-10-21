"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      try {
        setVisible(window.scrollY > 300);
      } catch (e) {
        // guard for SSR environments where window may be undefined
        setVisible(false);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      aria-label="Scroll to top"
      title="Scroll to top"
      onClick={handleClick}
      className="fixed bottom-22 right-6 z-50 inline-flex items-center justify-center rounded-full bg-blue-600 p-3 text-white shadow-lg transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path transform="rotate(180 10 10)" fillRule="evenodd" d="M3.293 9.293a1 1 0 011.414 0L10 14.586V3a1 1 0 112 0v11.586l5.293-5.293a1 1 0 111.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  );
}
