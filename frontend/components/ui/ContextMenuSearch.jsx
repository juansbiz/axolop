/**
 * Context Menu Search Component
 *
 * Auto-shows search input when menu has 10+ items.
 * Features fuzzy matching, type-ahead filtering, highlighted results.
 * Supports dark mode.
 */

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Fuzzy match algorithm
 * Tolerates typos by checking if all query characters appear in order
 */
function fuzzyMatch(text, query) {
  if (!query) return true;

  text = text.toLowerCase();
  query = query.toLowerCase();

  let queryIndex = 0;
  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === query.length;
}

/**
 * Highlight matching text in search results
 */
function highlightMatch(text, query) {
  if (!query) return text;

  const parts = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let lastIndex = 0;
  let queryIndex = 0;

  for (let i = 0; i < text.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      // Add text before match
      if (i > lastIndex) {
        parts.push({ text: text.slice(lastIndex, i), highlight: false });
      }

      // Add matched character
      parts.push({ text: text[i], highlight: true });
      lastIndex = i + 1;
      queryIndex++;
    }
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  return parts;
}

export function ContextMenuSearch({ items, onFilter }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus search input
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Filter items based on query
    const filtered = items.filter(item => {
      // Skip dividers and headers
      if (item.type === 'divider' || item.type === 'header') {
        return true;
      }

      // Search in label and description
      const searchText = `${item.label} ${item.description || ''}`;
      return fuzzyMatch(searchText, query);
    });

    onFilter(filtered);
  }, [query, items, onFilter]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="p-2 border-b border-gray-200/60 dark:border-gray-700/30">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            // Prevent menu from closing on Escape
            if (e.key === 'Escape' && query) {
              e.stopPropagation();
              handleClear();
            }
          }}
          placeholder="Search..."
          aria-label="Search menu items"
          className={cn(
            "w-full pl-9 pr-9 py-1.5 text-sm",
            "bg-gray-50 border border-gray-200",
            "rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
            "placeholder:text-gray-400",
            // Dark mode
            "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200",
            "dark:placeholder:text-gray-500",
            "dark:focus:ring-[#101010]/50 dark:focus:border-[#101010]/60"
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700",
              "transition-colors"
            )}
          >
            <X className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Highlighted Search Result Component
 */
export function SearchResultItem({ label, query }) {
  const parts = highlightMatch(label, query);

  return (
    <span>
      {parts.map((part, index) => (
        <span
          key={index}
          className={cn(
            part.highlight && "bg-yellow-200 text-gray-900 font-semibold dark:bg-yellow-600/40 dark:text-yellow-200"
          )}
        >
          {part.text}
        </span>
      ))}
    </span>
  );
}

/**
 * No Results State
 */
export function NoSearchResults({ query }) {
  return (
    <div className="px-3 py-8 text-center">
      <Search className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No results for "{query}"
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        Try a different search term
      </p>
    </div>
  );
}

export default ContextMenuSearch;
