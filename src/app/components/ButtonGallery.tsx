'use client';

import { useState, useMemo, useEffect } from 'react';
import { ButtonContribution } from '@/utils/buttonLoader';
import ButtonShowcase from './ButtonShowcase';
import Pagination from './Pagination';
import SearchBox from './SearchBox';
import ExampleDrawer from './ExampleDrawer';

// Optional: Uncomment if using Framer Motion reveal effects
// import { motion } from 'framer-motion';

interface ButtonGalleryProps {
  contributions: ButtonContribution[];
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'react', label: 'React ⚛️' },
  { value: 'html', label: 'HTML/CSS/JS 🌐' },
  { value: 'vanilla', label: 'Vanilla JS 🍦' },
] as const;

const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner 🌱' },
  { value: 'intermediate', label: 'Intermediate 🚀' },
  { value: 'advanced', label: 'Advanced 🧠' },
] as const;

export default function ButtonGallery({ contributions }: ButtonGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Separate example buttons from real contributions
  const exampleContributions = useMemo(
    () => contributions.filter((c) => c.metadata.author.startsWith('example-')),
    [contributions]
  );
  const realContributions = useMemo(
    () => contributions.filter((c) => !c.metadata.author.startsWith('example-')),
    [contributions]
  );

  // Filtering
  const filteredRealContributions = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return realContributions.filter((c) => {
      const matchesSearch =
        searchTerm === '' ||
        c.metadata.name.toLowerCase().includes(q) ||
        c.metadata.author.toLowerCase().includes(q) ||
        c.metadata.description?.toLowerCase().includes(q) ||
        c.metadata.tags?.some((t) => t.toLowerCase().includes(q));

      const matchesType = selectedType === 'all' || c.metadata.type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || c.metadata.difficulty === selectedDifficulty;

      return matchesSearch && matchesType && matchesDifficulty;
    });
  }, [realContributions, searchTerm, selectedType, selectedDifficulty]);

  // Pagination
  const paginatedContributions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredRealContributions.slice(start, end);
  }, [filteredRealContributions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRealContributions.length / itemsPerPage);

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedDifficulty]);

  // Stats
  const stats = useMemo(() => {
    const typeCount = realContributions.reduce((acc, c) => {
      acc[c.metadata.type || 'unknown'] = (acc[c.metadata.type || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return {
      total: realContributions.length,
      examples: exampleContributions.length,
      types: typeCount,
    };
  }, [realContributions, exampleContributions]);

  // Chip component
  const Chip = ({
    active,
    children,
    onClick,
  }: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm transition
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${
          active
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm ring-1 ring-blue-500/30'
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
        }`}
    >
      {children}
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 mt-6 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
            ClickHub Buttons
          </span>
          <span className="ml-2 align-middle">✨</span>
        </h1>
        <p className="text-sm text-gray-600">
          Community button designs for Hacktoberfest 2025 — discover, filter, and get inspired!
        </p>

        {/* Stats row */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 transition hover:shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
            {stats.total} Community
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 transition hover:shadow-sm">
            <span className="h-2 w-2 animate-ping rounded-full bg-yellow-500" />
            {stats.examples} Examples
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 transition hover:shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {stats.types.react || 0} React
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 transition hover:shadow-sm">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            {(stats.types.html || 0) + (stats.types.vanilla || 0)} HTML/JS
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="mx-auto max-w-2xl">
          <SearchBox searchTerm={searchTerm} onSearchChange={setSearchTerm} contributions={realContributions} />
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col items-center gap-3">
          {/* Mobile selects */}
          <div className="flex w-full max-w-2xl items-center justify-center gap-3 sm:hidden">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-black transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-black transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DIFFICULTY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop chips */}
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-gray-500">Type</span>
              {TYPE_OPTIONS.map((o) => (
                <Chip key={o.value} active={selectedType === o.value} onClick={() => setSelectedType(o.value)}>
                  {o.label}
                </Chip>
              ))}
            </div>
            <div className="mx-2 h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-gray-500">Level</span>
              {DIFFICULTY_OPTIONS.map((o) => (
                <Chip key={o.value} active={selectedDifficulty === o.value} onClick={() => setSelectedDifficulty(o.value)}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Community Contributions */}
      <div className="mb-12">
        {filteredRealContributions.length > 0 && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm text-gray-600 ring-1 ring-gray-200">
              <span>🔎 {filteredRealContributions.length} buttons found</span>
              {totalPages > 1 && (
                <>
                  <span>•</span>
                  <span>Page {currentPage} of {totalPages}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Grid */}
        {filteredRealContributions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedContributions.map((contribution, index) => {
                // const MotionCard = motion ? motion.div : 'div';
                return (
                  // <MotionCard key={`community-${contribution.metadata.author}-${index}`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.3, ease: 'easeOut' }} className="group h-full">
                  <div key={`community-${contribution.metadata.author}-${index}`} className="group h-full">
                    <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-blue-500/20">
                      <div className="transition duration-300 group-hover:[transform:perspective(800px)_rotateX(1deg)]">
                        <ButtonShowcase contribution={contribution} />
                      </div>
                    </div>
                  </div>
                  // </MotionCard>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(n) => {
                  setItemsPerPage(n);
                  setCurrentPage(1);
                }}
                totalItems={filteredRealContributions.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow ring-1 ring-gray-200">
              <span className="animate-bounce text-xl">🧪</span>
            </div>
            <div className="mb-2 text-lg text-gray-700">
              {stats.total === 0 ? 'Be the first to contribute a button!' : 'No buttons match the filters'}
            </div>
            <p className="mb-4 text-gray-500">
              {stats.total === 0
                ? 'Kickstart the gallery with a unique design — the stage is yours.'
                : 'Try adjusting search terms or filters to discover more designs.'}
            </p>
            {stats.total === 0 && (
              <a
                href="https://github.com/MRIEnan/clickhub_hactoberfest2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start Contributing →
              </a>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <div
        id="contribute"
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center text-white"
      >
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(600px_200px_at_10%_-20%,white,transparent_60%)]" />
        <h2 className="relative z-10 mb-3 text-xl font-extrabold">
          Ready to Contribute? <span className="ml-1">💡</span>
        </h2>
        <p className="relative z-10 mb-5 text-sm opacity-90">
          Join Hacktoberfest 2025 with @MRIEnan and add your button!
        </p>
        <a
          href="https://github.com/MRIEnan/clickhub_hactoberfest2025"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-gray-100"
        >
          Get Started
          <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
        </a>
      </div>

      {/* Example Templates Drawer */}
      <ExampleDrawer examples={exampleContributions} />
    </div>
  );
}
