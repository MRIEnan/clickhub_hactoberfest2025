'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onItemsPerPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): Array<number | 'ellipsis'> => {
    const pages: Array<number | 'ellipsis'> = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('ellipsis');
      pages.push(totalPages);
      return pages;
    }

    if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    pages.push('ellipsis');
    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
    pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <nav
      className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      {/* Results info */}
      <div className="text-sm text-gray-600">
        Showing {startItem}-{endItem} of {totalItems} items. 
      </div>

      {/* Pagination controls */}
      <ul className="flex items-center gap-2">
        {/* Previous */}
        <li>
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition
              ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
              }`}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>
        </li>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) => {
          if (page === 'ellipsis') {
            return (
              <li key={`ellipsis-${idx}`} className="flex items-center">
                <span className="px-2 py-2 text-gray-400 select-none" aria-hidden="true">
                  …
                </span>
                <span className="sr-only">Skipped pages</span>
              </li>
            );
          }

          const isActive = page === currentPage;

          return (
            <li key={page}>
              <button
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Page ${page}`}
                className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition
                  ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                  }`}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Next */}
        <li>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition
              ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
              }`}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </li>
      </ul>

      {/* Items per page */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <label htmlFor="items-per-page" className="text-gray-600">
          Show:
        </label>
        <select
          id="items-per-page"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
          className="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Items per page"
        >
          <option value={6}>6 per page</option>
          <option value={12}>12 per page</option>
          <option value={24}>24 per page</option>
          <option value={48}>48 per page</option>
        </select>
      </div>
    </nav>
  );
}
