'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '../context/UserContext';
import Image from 'next/image';

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { loginUser, isLoading, user, isLoggedIn } = useUser();

  // Get redirect path from URL params
  const redirectTo = searchParams?.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && !showSuccessModal) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, router, redirectTo, showSuccessModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setError('');
    const success = await loginUser(username.trim());
    
    if (success) {
      setShowSuccessModal(true);
      // Auto redirect after showing success
      setTimeout(() => {
        setShowSuccessModal(false);
        router.push(redirectTo === '/login' ? '/' : redirectTo);
      }, 2000);
    } else {
      setError('GitHub user not found. Please check the username and try again.');
    }
  };

  if (showSuccessModal && user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Success Modal */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to ClickHub!</h2>
              <p className="text-gray-400">Successfully signed in</p>
            </div>

            {/* User Info */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <Image
                  src={user.avatar_url}
                  alt={user.login}
                  width={60}
                  height={60}
                  className="w-15 h-15 rounded-full border-2 border-purple-500/30"
                />
                <div className="text-left">
                  <h3 className="text-white font-semibold">{user.name || user.login}</h3>
                  <p className="text-gray-400 text-sm">@{user.login}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>{user.followers} followers</span>
                    <span>{user.public_repos} repos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-400">
              Redirecting you to your destination...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pb-4">
      <div className="max-w-md w-full">
        {/* Login Form */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="text-3xl">🖱️</div>
              <h1 className="text-2xl font-bold text-white">ClickHub</h1>
              <span className="text-purple-400">2025</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Sign In to Your Account</h2>
            <p className="text-gray-400">
              Connect your GitHub account to access personalized features
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="github-username" className="block text-sm font-medium text-gray-300 mb-2">
                GitHub Username
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  {/* User icon */}
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 17a7 7 0 1114 0v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="github-username"
                  type="text"
                  placeholder="Enter your GitHub username"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                  autoComplete="username"
                  aria-describedby="username-help"
                />
              </div>
              <div id="username-help" className="mt-2 text-xs text-gray-400">
                Only your public GitHub info is used. Example: <span className="text-gray-300">octocat</span>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setUsername('octocat')}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-xs"
                  aria-label="Fill demo username"
                >
                  Use demo username
                </button>
                <a
                  href="https://github.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-xs"
                >
                  Create a GitHub account
                </a>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
              disabled={isLoading || !username.trim()}
              aria-busy={isLoading ? 'true' : 'false'}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  {/* GitHub mark */}
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.2-.01-.86-.01-1.56-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 012 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.45.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  Sign In with GitHub
                </>
              )}
            </button>
            <p className="mt-3 text-[11px] text-gray-500 text-center">
              We fetch public data from GitHub. You may hit GitHub rate limits occasionally; please try again in a minute.
            </p>
          </form>

          {/* Info Section */}
          <div className="mt-8 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-purple-400 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-purple-300 text-sm font-medium mb-1">Why sign in?</p>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li>• View your button contributions</li>
                  <li>• Quick access to your profile</li>
                  <li>• Personalized experience</li>
                  <li>• Join Hacktoberfest 2025!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 animate-pulse">
            <div className="text-center mb-8">
              <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-64 mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;