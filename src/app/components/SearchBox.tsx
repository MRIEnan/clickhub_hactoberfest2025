'use client';

import { ButtonContribution } from '@/utils/buttonLoader';
import { useState, useRef, useEffect, useMemo } from 'react';

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  contributions: ButtonContribution[];
}

export default function SearchBox({ searchTerm, onSearchChange, contributions }: SearchBoxProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  // Extract all unique tags from contributions (memoized to prevent infinite re-renders)
  const allTags = useMemo(() => 
    Array.from(
      new Set(
        contributions.flatMap(c => c.metadata.tags || [])
      )
    ).sort(),
    [contributions]
  );

  // Extract all unique author names (memoized to prevent infinite re-renders)
  const allAuthors = useMemo(() => 
    Array.from(
      new Set(
        contributions.map(c => c.metadata.author)
      )
    ).sort(),
    [contributions]
  );

  // Extract all unique button names (memoized to prevent infinite re-renders)
  const allNames = useMemo(() => 
    Array.from(
      new Set(
        contributions.map(c => c.metadata.name)
      )
    ).sort(),
    [contributions]
  );

  useEffect(() => {
    if (searchTerm.length > 0) {
      const searchLower = searchTerm.toLowerCase();
      const tagSuggestions = allTags
        .filter(tag => tag.toLowerCase().includes(searchLower))
        .map(tag => `tag:${tag}`);
      
      const authorSuggestions = allAuthors
        .filter(author => author.toLowerCase().includes(searchLower))
        .map(author => `author:${author}`);
      
      const nameSuggestions = allNames
        .filter(name => name.toLowerCase().includes(searchLower))
        .slice(0, 3);

      const combinedSuggestions = [
        ...nameSuggestions,
        ...tagSuggestions.slice(0, 5),
        ...authorSuggestions.slice(0, 3)
      ].slice(0, 8);

      setSuggestions(combinedSuggestions);
      setShowSuggestions(combinedSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [searchTerm, allTags, allAuthors, allNames]);

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion.startsWith('tag:') || suggestion.startsWith('author:') 
      ? suggestion.split(':')[1] 
      : suggestion
    );
    setShowSuggestions(false);
    searchRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative dark:bg-gray-900 dark:text-gray-100">
      <div className="relative dark:border-gray-700 dark:bg-gray-800">
        <input
          ref={searchRef}
          type="text"
          id="search"
          placeholder="Search by name, author, description, or tags (e.g., 'gradient', 'neon', 'animation')..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
          className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400 dark:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto dark:bg-gray-900 dark:text-gray-100">
          <div className="py-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2 text-left hover:bg-gray-700 focus:bg-gray-700 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
              >
                <div className="flex items-center">
                  {suggestion.startsWith('tag:') && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  )}
                  {suggestion.startsWith('author:') && (
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  )}
                  {!suggestion.startsWith('tag:') && !suggestion.startsWith('author:') && (
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  )}
                  <span className="text-sm">
                    {suggestion.startsWith('tag:') && (
                      <>
                        <span className="text-gray-500 dark:text-gray-400">Tag:</span>{' '}
                        <span className="font-medium text-gray-500 dark:text-gray-400">{suggestion.split(':')[1]}</span>
                      </>
                    )}
                    {suggestion.startsWith('author:') && (
                      <>
                        <span className="text-gray-500 dark:text-gray-400">Author:</span>{' '}
                        <span className="font-medium text-gray-500 dark:text-gray-400">@{suggestion.split(':')[1]}</span>
                      </>
                    )}
                    {!suggestion.startsWith('tag:') && !suggestion.startsWith('author:') && (
                      <span className="font-medium">{suggestion}</span>
                    )}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Quick search tips */}
          <div className="border-t border-gray-700 px-3 py-2 bg-gray-800 dark:bg-gray-900">
            <div className="text-xs text-gray-400 dark:text-gray-200">
              💡 Pro tip: Try searching for specific tags like &ldquo;gradient&rdquo;, &ldquo;animation&rdquo;, or &ldquo;hover&rdquo;
            </div>
          </div>
        </div>
      )}

      {/* Popular tags */}
      {searchTerm === '' && (
        <div className="mt-2">
          <div className="text-xs text-gray-400 dark:text-gray-200 mb-2">Popular tags:</div>
          <div className="flex flex-wrap gap-1">
            {allTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => onSearchChange(tag)}
                className="px-2 py-1 text-xs bg-gray-800 dark:bg-gray-900 text-gray-200 dark:text-gray-100 rounded-full border border-gray-700 dark:border-gray-700 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}