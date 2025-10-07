'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import Image from 'next/image';
import { useUser } from '../context/UserContext';
import { HomeIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

type NavItem = {
  href: string;
  label: string;
  Icon: React.ElementType<React.ComponentProps<'svg'>>;
};

const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: 'Home', Icon: HomeIcon },
  { href: '/search', label: 'Profile', Icon: UserCircleIcon },
];

function NavigationContent() {
  const pathname = usePathname();
  const { user, isLoggedIn, logoutUser } = useUser();
  const [open, setOpen] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  const activeMap = useMemo(
    () => Object.fromEntries(NAV_ITEMS.map((n) => [n.href, isActive(n.href)])),
    [isActive]
  ) as Record<string, boolean>;

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="bg-gray-900/80 backdrop-blur border-b border-gray-800">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Brand */}
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-purple-500/70 px-1"
            >
              <div className="h-6 w-6 rounded bg-gradient-to-br from-purple-500 to-indigo-500" />
              <span className="text-white font-semibold tracking-tight">ClickHub</span>
              <span className="text-xs text-purple-300">2025</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map(({ href, label, Icon }) => {
                const active = activeMap[href];
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                      active
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        active
                          ? 'text-purple-400'
                          : 'text-gray-400 group-hover:text-purple-300'
                      }`}
                    />
                    <span>{label}</span>
                    {active && (
                      <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded bg-purple-500" />
                    )}
                  </Link>
                );
              })}

              {/* Right side */}
              {isLoggedIn ? (
                <div className="ml-4 pl-4 border-l border-gray-800 flex items-center gap-3">
                  <Link
                    href={`/profile?user=${user!.login}`}
                    className="hidden xl:flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition"
                  >
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={logoutUser}
                    className="rounded-md bg-red-600 px-3 py-2 text-xs text-white hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                  <Image
                    src={user!.avatar_url}
                    alt={user!.login}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border border-purple-500/30"
                  />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-4 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-controls="mobile-menu"
              aria-expanded={open}
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-purple-500/70"
            >
              {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* ✅ Mobile Menu (Fixed visibility + smooth open/close) */}
        <div
          id="mobile-menu"
          className={`lg:hidden bg-gray-900 border-t border-gray-800 transition-all duration-300 ease-in-out ${
            open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="px-4 sm:px-6 lg:px-8 py-3 space-y-2">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
              const active = activeMap[href];
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm transition ${
                    active
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              );
            })}

            {/* External Link */}
            <a
              href="https://github.com/MRIEnan/clickhub_hactoberfest2025/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition"
              onClick={() => setOpen(false)}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current text-gray-400"
                aria-hidden="true"
              >
                <path d="M12 .5a11.5 11.5 0 00-3.63 22.41c.57.1.78-.25.78-.55v-2.07c-3.18.69-3.85-1.37-3.85-1.37-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.68 1.24 3.33.95.1-.75.4-1.24.73-1.52-2.54-.29-5.22-1.27-5.22-5.64 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.17a10.9 10.9 0 015.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.77.11 3.06.73.8 1.18 1.82 1.18 3.07 0 4.38-2.69 5.35-5.24 5.64.41.36.77 1.07.77 2.16v3.2c0 .31.2.66.79.55A11.5 11.5 0 0012 .5z" />
              </svg>
              <span>Contribute</span>
            </a>

            {isLoggedIn ? (
              <div className="pt-3 mt-3 border-t border-gray-800 space-y-2">
                <Link
                  href={`/profile?user=${user!.login}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md bg-purple-600 px-3 py-3 text-center text-sm text-white hover:bg-purple-700 transition"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    logoutUser();
                    setOpen(false);
                  }}
                  className="w-full rounded-md bg-red-600 px-3 py-3 text-sm text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-3 mt-3 border-t border-gray-800">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-md bg-purple-600 px-3 py-3 text-center text-sm font-medium text-white hover:bg-purple-700 transition"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function Navigation() {
  return (
    <Suspense
      fallback={
        <div className="w-full border-b border-gray-800 bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center animate-pulse">
            <div className="h-6 w-6 rounded bg-gray-700 mr-2" />
            <div className="h-5 w-28 rounded bg-gray-700" />
          </div>
        </div>
      }
    >
      <NavigationContent />
    </Suspense>
  );
}
