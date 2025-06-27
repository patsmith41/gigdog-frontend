// src/components/concerts/Filters.tsx
import React from 'react';
import { ApiNeighborhood } from '@/types';
import { ListFilter, CalendarDays, DollarSign, MapPin, ArrowDownUp, Search } from 'lucide-react';

interface FilterValues {
  startDate: string;
  endDate: string;
  artistSearch: string;
  maxPrice: number;
  neighborhoodId: string;
  sortBy: string;
}

interface FiltersProps {
  neighborhoods: ApiNeighborhood[];
  currentFilters: FilterValues;
  onFilterChange: (filterName: keyof FilterValues, value: string | number) => void;
}

const Filters: React.FC<FiltersProps> = ({ neighborhoods, currentFilters, onFilterChange }) => {
  const handleInputChange = (filterName: keyof FilterValues, value: string | number) => {
    onFilterChange(filterName, value);
  };

  return (
    <div className="p-4 space-y-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
      {/* Artist Search - NEW! */}
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
          className="p-2 border border-neutral-300 dark:border-neutral-600 rounded w-full bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm" 
          placeholder="Artist name..." 
        />
      </div>

      {/* Date Range */}
      <div>
        <label htmlFor="date-range-start" className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          <CalendarDays size={16} className="mr-2 opacity-70" />
          Date Range
        </label>
        <div className="flex space-x-2">
          <input 
            type="date" 
            id="date-range-start" 
            value={currentFilters.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="p-2 border border-neutral-300 dark:border-neutral-600 rounded w-full bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm" 
            placeholder="Start Date" 
          />
          <input 
            type="date" 
            id="date-range-end" 
            value={currentFilters.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="p-2 border border-neutral-300 dark:border-neutral-600 rounded w-full bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm" 
            placeholder="End Date" 
          />
        </div>
      </div>

      {/* Max Price */}
      <div>
        <label htmlFor="price-slider" className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          <DollarSign size={16} className="mr-2 opacity-70" />
          Max Price: ${currentFilters.maxPrice > 0 ? currentFilters.maxPrice : 'Any'}
        </label>
        <input 
          type="range" 
          id="price-slider" 
          min="0" max="200" step="5" 
          value={currentFilters.maxPrice}
          onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value))}
          className="w-full h-2 bg-neutral-300 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
        />
      </div>

      {/* Neighborhood */}
      <div>
        <label htmlFor="neighborhood-filter" className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          <MapPin size={16} className="mr-2 opacity-70" />
          Neighborhood
        </label>
        <select
          id="neighborhood-filter"
          value={currentFilters.neighborhoodId}
          onChange={(e) => handleInputChange('neighborhoodId', e.target.value)}
          className="block w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
        >
          <option value="">All Neighborhoods</option>
          {neighborhoods && neighborhoods.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
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