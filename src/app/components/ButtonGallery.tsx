'use client';

import { ButtonContribution } from '@/utils/buttonLoader';
import ButtonShowcase from './ButtonShowcase';
import Pagination from './Pagination';
import SearchBox from './SearchBox';
import ExampleDrawer from './ExampleDrawer';
import { useState, useMemo, useEffect } from 'react';

interface ButtonGalleryProps {
  contributions: ButtonContribution[];
}

export default function ButtonGallery({ contributions }: ButtonGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Separate example buttons from real contributions
  const exampleContributions = useMemo(() => {
    return contributions.filter(contribution => 
      contribution.metadata.author.startsWith('example-')
    );
  }, [contributions]);

  const realContributions = useMemo(() => {
    return contributions.filter(contribution => 
      !contribution.metadata.author.startsWith('example-')
    );
  }, [contributions]);

  const filteredRealContributions = useMemo(() => {
    return realContributions.filter((contribution) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        contribution.metadata.name.toLowerCase().includes(searchLower) ||
        contribution.metadata.author.toLowerCase().includes(searchLower) ||
        contribution.metadata.description?.toLowerCase().includes(searchLower) ||
        contribution.metadata.tags?.some(tag => tag.toLowerCase().includes(searchLower));

      const matchesType = selectedType === 'all' || contribution.metadata.type === selectedType;
      
      const matchesDifficulty = selectedDifficulty === 'all' || contribution.metadata.difficulty === selectedDifficulty;

      return matchesSearch && matchesType && matchesDifficulty;
    });
  }, [realContributions, searchTerm, selectedType, selectedDifficulty]);

  // Pagination logic
  const paginatedContributions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRealContributions.slice(startIndex, endIndex);
  }, [filteredRealContributions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRealContributions.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedDifficulty]);

  const stats = useMemo(() => {
    const typeCount = realContributions.reduce((acc, contribution) => {
      acc[contribution.metadata.type || 'unknown'] = (acc[contribution.metadata.type || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: realContributions.length,
      examples: exampleContributions.length,
      types: typeCount,
    };
  }, [realContributions, exampleContributions]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 dark:bg-gray-800 dark:text-white">
      {/* Minimal Header */}
      <div className="mb-6 mt-2 dark:text-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">
            ClickHub
          </h1>
          <p className="text-gray-400 text-sm dark:text-gray-300">
            Community button designs for Hacktoberfest 2025
          </p>
        </div>
        
        {/* Compact Stats */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 dark:text-gray-300 mb-6">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full dark:bg-blue-600"></div>
            {stats.total} Community
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full dark:bg-yellow-600"></div>
            {stats.examples} Examples
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full dark:bg-green-600"></div>
            {stats.types.react || 0} React
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full dark:bg-purple-600"></div>
            {(stats.types.html || 0) + (stats.types.vanilla || 0)} HTML/JS
          </span>
        </div>
      </div>
      
      {/* Subtle Filters */}
      <div className="mb-6 dark:bg-gray-800">
        <div className="max-w-2xl mx-auto">
          <SearchBox
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            contributions={realContributions}
          />
        </div>
        
        {/* Compact Filter Row */}
        <div className="flex items-center justify-center gap-4 mt-4 dark:bg-gray-800">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-sm px-3 py-1 border border-gray-700 rounded-full text-gray-100 bg-gray-800 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="react">React</option>
            <option value="html">HTML/CSS/JS</option>
            <option value="vanilla">Vanilla JS</option>
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="text-sm px-3 py-1 border border-gray-700 rounded-full text-gray-100 bg-gray-800 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      
      {/* Community Contributions */}
      <div className="mb-12 dark:bg-gray-800">
        {filteredRealContributions.length > 0 && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 text-sm text-gray-300 bg-gray-800 border border-gray-700 px-4 py-2 rounded-full dark:bg-gray-800 dark:text-gray-300">
              <span>{filteredRealContributions.length} buttons found</span>
              {totalPages > 1 && (
                <>
                  <span>•</span>
                  <span>Page {currentPage} of {totalPages}</span>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Community Button Grid */}
        {filteredRealContributions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedContributions.map((contribution, index) => (
                <ButtonShowcase
                  key={`community-${contribution.metadata.author}-${index}`}
                  contribution={contribution}
                />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
              totalItems={filteredRealContributions.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        ) : (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <div className="text-gray-400 text-lg mb-4 dark:text-gray-300">
              {stats.total === 0 
                ? "🚀 Be the first to contribute a button!" 
                : "No buttons found matching your criteria"
              }
            </div>
            <p className="text-gray-500 mb-4 dark:text-gray-300">
              {stats.total === 0 
                ? "Check out the examples above and create your own amazing button design." 
                : "Try adjusting your search terms or filters to see more buttons."
              }
            </p>
            {stats.total === 0 && (
              <a
                href="https://github.com/MRIEnan/clickhub_hactoberfest2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700"
              >
                Start Contributing →
              </a>
            )}
          </div>
        )}
      </div>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl text-center" id="contribute">
        <h2 className="text-xl font-bold mb-3">
          Ready to Contribute?
        </h2>
        <p className="text-sm mb-4 opacity-90">
          Join Hacktoberfest 2025 with @MRIEnan and add your button design!
        </p>
        <a
          href="https://github.com/MRIEnan/clickhub_hactoberfest2025"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
        >
          Get Started →
        </a>
      </div>
      
      {/* Example Templates Drawer */}
      <ExampleDrawer examples={exampleContributions} />
    </div>
  );
}