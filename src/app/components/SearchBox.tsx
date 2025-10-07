'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ButtonContribution } from '@/utils/buttonLoader';

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  contributions: ButtonContribution[];
}

export default function SearchBox({ searchTerm, onSearchChange, contributions }: SearchBoxProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listboxId = 'search-suggestions';

  // Extract unique values (memoized)
  const allTags = useMemo(
    () => Array.from(new Set(contributions.flatMap((c) => c.metadata.tags || []))).sort(),
    [contributions]
  );
  const allAuthors = useMemo(
    () => Array.from(new Set(contributions.map((c) => c.metadata.author))).sort(),
    [contributions]
  );
  const allNames = useMemo(
    () => Array.from(new Set(contributions.map((c) => c.metadata.name))).sort(),
    [contributions]
  );

  // Build suggestions
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setOpen(false);
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }
    const q = searchTerm.toLowerCase();
    const tagS = allTags.filter((t) => t.toLowerCase().includes(q)).map((t) => `tag:${t}`);
    const authorS = allAuthors.filter((a) => a.toLowerCase().includes(q)).map((a) => `author:${a}`);
    const nameS = allNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 3);

    const combined = [...nameS, ...tagS.slice(0, 5), ...authorS.slice(0, 3)].slice(0, 8);
    setSuggestions(combined);
    setOpen(combined.length > 0);
    setActiveIndex(combined.length > 0 ? 0 : -1);
  }, [searchTerm, allTags, allAuthors, allNames]);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!inputRef.current) return;
      if (!listRef.current) return;
      const target = e.target as Node;
      if (inputRef.current.contains(target) || listRef.current.contains(target)) return;
      setOpen(false);
      setActiveIndex(-1);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const commitSelection = (value: string) => {
    const cleaned = value.startsWith('tag:') || value.startsWith('author:') ? value.split(':')[1] : value;
    onSearchChange(cleaned);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) commitSelection(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const activeOptionId = activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined;

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id="search"
          placeholder="Search by name, author, description, or tags (e.g., 'gradient', 'neon', 'animation')..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => searchTerm.length > 0 && suggestions.length > 0 && setOpen(true)}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={activeOptionId}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-black shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Suggestions */}
      {open && suggestions.length > 0 && (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          <ul className="py-1">
            {suggestions.map((s, i) => {
              const isTag = s.startsWith('tag:');
              const isAuthor = s.startsWith('author:');
              const label = isTag ? s.split(':')[1] : isAuthor ? s.split(':')[1] : s;

              return (
                <li key={s + i} role="option" id={`${listboxId}-opt-${i}`} aria-selected={i === activeIndex}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => commitSelection(s)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
                      i === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        isTag ? 'bg-blue-500' : isAuthor ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                    />
                    {isTag && (
                      <span className="text-gray-500">
                        Tag: <span className="font-medium text-gray-600">{label}</span>
                      </span>
                    )}
                    {isAuthor && (
                      <span className="text-gray-500">
                        Author: <span className="font-medium text-gray-600">@{label}</span>
                      </span>
                    )}
                    {!isTag && !isAuthor && <span className="font-medium text-gray-800">{label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Tips */}
          <div className="border-t border-gray-100 bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">
              Pro tip: Try tags like “gradient”, “animation”, or “hover”
            </p>
          </div>
        </div>
      )}

      {/* Popular tags */}
      {searchTerm === '' && (
        <div className="mt-2">
          <div className="mb-2 text-xs text-gray-500">Popular tags:</div>
          <div className="flex flex-wrap gap-1">
            {allTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => onSearchChange(tag)}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200"
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
