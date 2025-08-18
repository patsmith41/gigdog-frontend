// Updated src/components/concerts/Filters.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ApiNeighborhood } from '@/types';
import { ListFilter, CalendarDays, DollarSign, MapPin, ArrowDownUp, Search, Music, ChevronDown } from 'lucide-react';

interface Genre {
  id: string;
  name: string;
  artist_count: number;
}

interface FilterValues {
  startDate: string;
  endDate: string;
  artistSearch: string;
  maxPrice: number;
  neighborhoodId: string;
  sortBy: string;
  selectedGenres: string[]; // NEW: Array of selected genre IDs
}

interface FiltersProps {
  neighborhoods: ApiNeighborhood[];
  genres: Genre[]; // NEW: Parent genres for filtering
  currentFilters: FilterValues;
  onFilterChange: (filterName: keyof FilterValues, value: string | number | string[]) => void;
}

const Filters: React.FC<FiltersProps> = ({ neighborhoods, genres, currentFilters, onFilterChange }) => {
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (filterName: keyof FilterValues, value: string | number | string[]) => {
    onFilterChange(filterName, value);
  };

  // Handle genre selection
  const handleGenreToggle = (genreId: string) => {
    const currentSelected = currentFilters.selectedGenres || [];
    const newSelected = currentSelected.includes(genreId)
      ? currentSelected.filter(id => id !== genreId)
      : [...currentSelected, genreId];
    
    handleInputChange('selectedGenres', newSelected);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
        setIsGenreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedGenreCount = currentFilters.selectedGenres?.length || 0;

  return (
    <div className="p-4 space-y-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
      {/* Artist Search */}
      <div>
        <label htmlFor="artist-search" className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          <Search size={16} className="mr-2 opacity-70" />
          Search Artists
        </label>
        <input
          type="text"
          id="artist-search"
          value={currentFilters.artistSearch}
          onChange={(e) => handleInputChange('artistSearch', e.target.value)}
          placeholder="Search by artist name..."
          className="block w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
        />
      </div>

      {/* NEW: Genre Filter */}
      <div className="relative" ref={genreDropdownRef}>
        <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          <Music size={16} className="mr-2 opacity-70" />
          Genres {selectedGenreCount > 0 && <span className="ml-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded">({selectedGenreCount})</span>}
        </label>
        <button
          onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
          className="w-full flex items-center justify-between p-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
        >
          <span>
            {selectedGenreCount === 0 
              ? "Select genres..." 
              : `${selectedGenreCount} genre${selectedGenreCount === 1 ? '' : 's'} selected`
            }
          </span>
          <ChevronDown size={16} className={`transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isGenreDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {genres.map(genre => (
              <label
                key={genre.id}
                className="flex items-center px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={currentFilters.selectedGenres?.includes(genre.id) || false}
                  onChange={() => handleGenreToggle(genre.id)}
                  className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-neutral-300 rounded"
                />
                <span className="text-sm text-neutral-900 dark:text-neutral-100 flex-1">
                  {genre.name}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  ({genre.artist_count})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            <CalendarDays size={16} className="mr-2 opacity-70" />
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={currentFilters.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="block w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            <CalendarDays size={16} className="mr-2 opacity-70" />
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={currentFilters.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="block w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      {/* Max Price */}
      <div>
        <label htmlFor="max-price" className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          <DollarSign size={16} className="mr-2 opacity-70" />
          Max Price: ${currentFilters.maxPrice || 'Any'}
        </label>
        <input
          type="range"
          id="max-price"
          min="0"
          max="200"
          step="5"
          value={currentFilters.maxPrice}
          onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value))}
          className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          <span>Free</span>
          <span>$200+</span>
        </div>
      </div>

      {/* Neighborhood */}
      <div>
        <label htmlFor="neighborhood" className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          <MapPin size={16} className="mr-2 opacity-70" />
          Neighborhood
        </label>
        <select
          id="neighborhood"
          value={currentFilters.neighborhoodId}
          onChange={(e) => handleInputChange('neighborhoodId', e.target.value)}
          className="block w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
        >
          <option value="">All neighborhoods</option>
          {neighborhoods.map(neighborhood => (
            <option key={neighborhood.id} value={neighborhood.id}>
              {neighborhood.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label htmlFor="sort-by" className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          <ArrowDownUp size={16} className="mr-2 opacity-70" />
          Sort By
        </label>
        <select
          id="sort-by"
          value={currentFilters.sortBy}
          onChange={(e) => handleInputChange('sortBy', e.target.value)}
          className="block w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
        >
          <option value="date_asc">Date (Soonest)</option>
          <option value="price_asc">Price (Low to High)</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            onFilterChange('startDate', '');
            onFilterChange('endDate', '');
            onFilterChange('artistSearch', '');
            onFilterChange('maxPrice', 0);
            onFilterChange('neighborhoodId', '');
            onFilterChange('selectedGenres', []); // NEW: Clear selected genres
            onFilterChange('sortBy', 'date_asc');
          }}
          className="w-full px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;