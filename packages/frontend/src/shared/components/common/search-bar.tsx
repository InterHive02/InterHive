import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/use-debounce';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onResultClick?: (result: any) => void;
  results?: any[];
  renderResult?: (result: any) => React.ReactNode;
  className?: string;
  debounceDelay?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  onResultClick,
  results = [],
  renderResult,
  className = '',
  debounceDelay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, debounceDelay);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsLoading(true);
      onSearch(debouncedQuery);
      setIsLoading(false);
    }
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleResultClick = (result: any) => {
    onResultClick?.(result);
    setIsFocused(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none dark:text-white dark:placeholder-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isFocused && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="p-1">
              {results.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {renderResult ? renderResult(result) : (
                    <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {typeof result === 'string' ? result : JSON.stringify(result)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">No results found</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Try adjusting your search terms
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
