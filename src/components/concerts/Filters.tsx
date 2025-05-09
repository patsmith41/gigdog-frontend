// src/components/concerts/Filters.tsx
import React from 'react';
import { ApiNeighborhood } from '@/types';
import { ListFilter, CalendarDays, DollarSign, MapPin, ArrowDownUp } from 'lucide-react';


interface FiltersProps {
  neighborhoods: ApiNeighborhood[];
  // TODO: Add props for filter values and onChange handlers from page.tsx
  // currentFilters: { startDate?: string; endDate?: string; maxPrice?: number; neighborhoodId?: string; sortBy?: string };
  // onFilterChange: (filterName: string, value: any) => void;
}

const Filters: React.FC<FiltersProps> = ({ neighborhoods /*, currentFilters, onFilterChange */ }) => {
  // Placeholder function for handling changes - to be implemented in page.tsx
  const handleInputChange = (filterName: string, value: any) => {
    // console.log(`Filter changed: ${filterName}, Value: ${value}`);
    // onFilterChange(filterName, value); // This would call a prop function
  };

  return (
    <div className="p-1 space-y-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
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
            // value={currentFilters?.startDate || ''}
            // onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="p-2 border border-neutral-300 dark:border-neutral-600 rounded w-full bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm" 
            placeholder="Start Date" 
          />
          <input 
            type="date" 
            id="date-range-end" 
            // value={currentFilters?.endDate || ''}
            // onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="p-2 border border-neutral-300 dark:border-neutral-600 rounded w-full bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm" 
            placeholder="End Date" 
          />
        </div>
      </div>

      {/* Max Price */}
      <div>
        <label htmlFor="price-slider" className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          <DollarSign size={16} className="mr-2 opacity-70" />
          Max Price
          {/* TODO: Display current price value: e.g., $${currentFilters?.maxPrice || 'Any'} */}
        </label>
        <input 
          type="range" 
          id="price-slider" 
          min="0" max="200" step="5" 
          // value={currentFilters?.maxPrice || 0}
          // onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value))}
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
          // value={currentFilters?.neighborhoodId || ''}
          // onChange={(e) => handleInputChange('neighborhoodId', e.target.value)}
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
          // value={currentFilters?.sortBy || 'date_asc'}
          // onChange={(e) => handleInputChange('sortBy', e.target.value)}
          className="block w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
        >
          <option value="date_asc">Date (Soonest)</option>
          <option value="price_asc">Price (Low to High)</option>
          {/* Add more sort options: popularity, recently_added etc. */}
        </select>
      </div>

      {/* Apply Filters Button (optional, or apply on change) */}
      {/* <button 
        // onClick={applyFilters}
        className="w-full mt-6 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
      >
        Apply Filters
      </button> */}
    </div>
  );
};

export default Filters;