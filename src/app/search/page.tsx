'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ButtonShowcase from '../components/ButtonShowcase';
import { useUser } from '../context/UserContext';

interface GithubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  blog: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  created_at: string;
  public_gists: number;
}

interface ButtonContribution {
  metadata: {
    name: string;
    author: string;
    description: string;
    type: 'react' | 'html' | 'vanilla';
    tags?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  html?: string;
  css?: string;
  js?: string;
  reactCode?: string;
  folderPath: string;
  importPath?: string;
}

const SearchContent = () => {
  const searchParams = useSearchParams();
  const usernameParam = searchParams?.get('user');
  const { user, isLoggedIn } = useUser();
  
  const [userData, setUserData] = useState<GithubUser | null>(null);
  const [userContributions, setUserContributions] = useState<ButtonContribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [buttonsPerPage] = useState(6); // Show 6 buttons per page

  

  const [username, setUsername] = useState('');

  const fetchUserData = async (user: string) => {
    setLoading(true);
    try {
      setError('');
      
      // Fetch GitHub user data
      const userRes = await fetch(`https://api.github.com/users/${user}`);
      if (!userRes.ok) throw new Error('User not found');
      const userData: GithubUser = await userRes.json();
      setUserData(userData);

      // Fetch user's button contributions
      const contributionsRes = await fetch('/api/contributions');
      if (contributionsRes.ok) {
        const allContributions: ButtonContribution[] = await contributionsRes.json();
        const userContribs = allContributions.filter(
          contrib => contrib.metadata.author.toLowerCase() === user.toLowerCase()
        );
        setUserContributions(userContribs);
        resetPagination(); // Reset to first page when new user is loaded
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setUserData(null);
      setUserContributions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Priority: URL param first, then logged-in user
    const targetUser = usernameParam || (isLoggedIn ? user?.login : null);
    if (targetUser) {
      fetchUserData(targetUser);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameParam, isLoggedIn, user]);



  // Pagination logic
  const totalPages = Math.ceil(userContributions.length / buttonsPerPage);
  const startIndex = (currentPage - 1) * buttonsPerPage;
  const endIndex = startIndex + buttonsPerPage;
  const currentButtons = userContributions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to buttons section
    const buttonsSection = document.getElementById('buttons-section');
    if (buttonsSection) {
      buttonsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      fetchUserData(username.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const handleFetchUser = () => {
    if(!username || username && username.length <= 0){
      setError('Please enter a GitHub username');
    } else {
      fetchUserData(username.trim());
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid justify-center mb-2 w-full">
          <div className="flex bg-gray-800 rounded-lg overflow-hidden border border-gray-700 max-w-md w-full">
            <input
              type="text"
              placeholder="Enter GitHub username"
              className="flex-1 p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
            <button
              onClick={handleFetchUser}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-3 transition-colors duration-200 text-sm font-medium"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
          <div>
            {error && (
              <p className="text-red-400 text-center text-sm rounded-lg p-1 max-w-md mx-auto">
                {error} 
              </p>
            )}
          </div>
        </div>

        {userData && (
          <>
            
            {/* User Profile Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-700 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={userData.avatar_url}
                    alt={userData.name || userData.login}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full border-4 border-purple-500/30"
                  />
                </div>
                
                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {userData.name || userData.login}
                  </h2>
                  <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
                    <p className="text-purple-400 text-lg mb-4">@{userData.login}</p>
                  </a>
                  
                  {userData.bio && (
                    <p className="text-gray-300 mb-4 max-w-2xl">{userData.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400 mb-6">
                    {userData.location && (
                      <span className="flex items-center">
                        📍 {userData.location}
                      </span>
                    )}
                    {userData.blog && (
                      <a 
                        href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-purple-400 transition-colors"
                      >
                        🔗 Website
                      </a>
                    )}
                    <span>📅 Joined {new Date(userData.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{userData.followers}</div>
                      <div className="text-gray-400 text-sm">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{userData.following}</div>
                      <div className="text-gray-400 text-sm">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{userData.public_repos}</div>
                      <div className="text-gray-400 text-sm">Repositories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{userContributions.length}</div>
                      <div className="text-gray-400 text-sm">Button Contributions</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-3">
                  <a
                    href={userData.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium text-center"
                  >
                    View GitHub Profile
                  </a>
                </div>
              </div>
            </div>

            {/* Button Contributions Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Button Contributions ({userContributions.length})
                </h3>
                
                {userContributions.length > 0 && (
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>
                      React: {userContributions.filter(c => c.metadata.type === 'react').length}
                    </span>
                    <span>
                      HTML/CSS: {userContributions.filter(c => c.metadata.type === 'html' || c.metadata.type === 'vanilla').length}
                    </span>
                  </div>
                )}
              </div>

              {userContributions.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentButtons.map((contribution, index) => (
                      <ButtonShowcase
                        key={`${contribution.metadata.author}-${contribution.metadata.name}-${index}`}
                        contribution={contribution}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                          let page;
                          if (totalPages <= 7) {
                            page = i + 1;
                          } else if (currentPage <= 4) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 3) {
                            page = totalPages - 6 + i;
                          } else {
                            page = currentPage - 3 + i;
                          }
                          return page;
                        }).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-md transition-colors ${
                              currentPage === page
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                  
                  {/* Pagination Info */}
                  <div className="text-center text-gray-400 mt-4">
                    Showing {currentButtons.length} of {userContributions.length} buttons
                    {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <h4 className="text-xl font-semibold text-gray-300 mb-2">
                    No button contributions yet
                  </h4>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    {userData.login} hasn&apos;t contributed any buttons to ClickHub yet. 
                    Encourage them to join Hacktoberfest 2025!
                  </p>
                  <a
                    href="https://github.com/MRIEnan/clickhub_hactoberfest2025/blob/main/CONTRIBUTING.md"
                    target="_blank"
                    className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Learn How to Contribute
                  </a>
                </div>
              )}
            </div>
          </>
        )}

        {!userData && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👤</div>
            {!isLoggedIn ? (
              <>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Welcome to ClickHub Profiles
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Sign in with your GitHub account to view your contributions, or use the search bar to explore any GitHub user&apos;s button contributions.
                </p>
                <Link
                  href="/login?redirect=/search"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 font-medium inline-block text-center"
                >
                  Sign In with GitHub
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Enter a GitHub username to view their profile
                </h3>
                <p className="text-gray-400">
                  Use the search bar above to explore any GitHub user&apos;s button contributions to ClickHub
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-6">Contributor Profile</h1>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
