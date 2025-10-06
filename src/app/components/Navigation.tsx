'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useUser } from '../context/UserContext';
import Image from 'next/image';

const NavigationContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, logoutUser } = useUser();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="max-w-6xl mx-auto mb-1 px-4 sm:px-6 lg:px-8">
      <nav className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Image src="/clickhub-icon.svg" alt="ClickHub" width={28} height={28} className="w-7 h-7" />
            <h1 className="text-xl font-bold text-white">ClickHub</h1>
            <span className="text-purple-400 text-sm">2025</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                isActive('/') 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              🏠 Home
            </Link>
            
            <Link
              href="/profile"
              className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                isActive('/profile') 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              👤 Profile
            </Link>
            
            {/* Contribute link removed as requested */}

            {/* Desktop User Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-600">
                <div className="flex items-center space-x-2">
                  <Image
                    src={user!.avatar_url}
                    alt={user!.login}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-purple-500/30"
                  />
                  <div className="text-left">
                    <p className="text-white text-sm font-medium truncate max-w-32">
                      {user!.name || user!.login}
                    </p>
                    <p className="text-gray-400 text-xs">@{user!.login}</p>
                  </div>
                </div>
                <Link
                  href={`/profile?user=${user!.login}`}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  My Profile
                </Link>
                <button
                  onClick={logoutUser}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200 text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                  isActive('/') 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 Home
              </Link>
              
              <Link
                href="/profile"
                className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                  isActive('/profile') 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                👤 Profile
              </Link>
              
              {/* Contribute link removed as requested */}

              {/* Mobile User Section */}
              {isLoggedIn ? (
                <div className="pt-4 mt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <Image
                      src={user!.avatar_url}
                      alt={user!.login}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-purple-500/30"
                    />
                    <div>
                      <p className="text-white text-sm font-medium">{user!.name || user!.login}</p>
                      <p className="text-gray-400 text-xs">@{user!.login}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link
                      href={`/profile?user=${user!.login}`}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-gray-700">
                  <Link
                    href="/login"
                    className="block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200 text-sm font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Search Bar - Only show on profile page */}
        {/* {pathname === '/profile' && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex justify-center">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const username = formData.get('username') as string;
                if (username.trim()) {
                  router.push(`/profile?user=${username.trim()}`);
                }
              }} className="flex bg-gray-700 rounded-lg overflow-hidden border border-gray-600 max-w-md w-full">
                <input
                  name="username"
                  type="text"
                  placeholder="Enter GitHub username"
                  className="flex-1 p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 transition-colors duration-200 text-sm font-medium"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )} */}
      </nav>
    </div>
  );
};

const Navigation = () => {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
        <nav className="bg-gray-800 rounded-lg border border-gray-700 p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/clickhub-icon.svg" alt="ClickHub" width={24} height={24} className="w-6 h-6" />
              <div className="h-6 bg-gray-700 rounded w-32"></div>
            </div>
            <div className="hidden lg:flex items-center space-x-1">
              <div className="h-10 bg-gray-700 rounded w-20"></div>
              <div className="h-10 bg-gray-700 rounded w-20"></div>
              <div className="h-10 bg-gray-700 rounded w-24"></div>
            </div>
            <div className="lg:hidden">
              <div className="h-10 w-10 bg-gray-700 rounded"></div>
            </div>
          </div>
        </nav>
      </div>
    }>
      <NavigationContent />
    </Suspense>
  );
};

export default Navigation;