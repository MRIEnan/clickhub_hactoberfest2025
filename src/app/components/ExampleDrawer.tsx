'use client';

import { useEffect, useRef, useState } from 'react';
import { ButtonContribution } from '@/utils/buttonLoader';
import ButtonShowcase from './ButtonShowcase';

interface ExampleDrawerProps {
  examples: ButtonContribution[];
}

export default function ExampleDrawer({ examples }: ExampleDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Body scroll lock
  useEffect(() => {
    const prev = document.documentElement.style.overflowY;
    if (isOpen) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = prev || '';
    }
    return () => {
      document.documentElement.style.overflowY = prev || '';
    };
  }, [isOpen]);

  // Basic focus management: focus close button when opening, return to opener on close
  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus();
    } else {
      openBtnRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Click outside to close
  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawerRef.current) return;
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  return (
    <>
      {/* Toggle button */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <button
          ref={openBtnRef}
          onClick={() => setIsOpen((v) => !v)}
          className={`group relative rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl transition-all duration-300
            bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600
            ${isOpen ? 'rotate-0' : 'hover:-translate-y-0.5'}
          `}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="example-drawer"
        >
          <div className="relative z-10 flex items-center gap-2">
            <span className="text-base">{isOpen ? '✕' : '📚'}</span>
            <span>{isOpen ? 'Close' : 'Examples'}</span>
          </div>

          {/* Glow ring when closed */}
          {!isOpen && (
            <span className="pointer-events-none absolute inset-0 -z-0 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 opacity-20 blur-md" />
          )}

          {/* Soft pulse when closed */}
          {!isOpen && (
            <span className="pointer-events-none absolute inset-0 -z-10 rounded-xl ring-2 ring-amber-400/0 transition group-hover:ring-amber-400/30" />
          )}
        </button>
      </div>

      {/* Overlay */}
      <div
        role="presentation"
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onOverlayClick}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside
        id="example-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="example-drawer-title"
        className={`fixed right-0 top-0 z-[55] h-full w-full max-w-2xl transform bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="example-drawer-title" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  📚 Example Templates
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Get started with these curated button designs
                </p>
              </div>
              <button
                ref={closeBtnRef}
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                aria-label="Close examples drawer"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {examples.map((example, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <ButtonShowcase contribution={example} />
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">🚀 Getting Started</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Copy code from these examples</li>
                <li>• Tweak colors, timing, and easing</li>
                <li>• Add hover and press micro-interactions</li>
                <li>• Submit via GitHub for Hacktoberfest</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6">
            <a
              href="https://github.com/MRIEnan/clickhub_hactoberfest2025"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-medium text-white transition-colors hover:from-blue-700 hover:to-purple-700"
            >
              🚀 Start Contributing
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
