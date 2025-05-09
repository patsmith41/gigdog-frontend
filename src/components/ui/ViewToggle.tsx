// src/components/ui/ViewToggle.tsx (Basic Placeholder)
import React from 'react';

interface ViewToggleProps {
  viewMode: 'grid' | 'cards';
  setViewMode: (mode: 'grid' | 'cards') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        onClick={() => setViewMode('grid')}
        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
          viewMode === 'grid'
            ? 'bg-black text-white dark:bg-gray-700'
            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        Grid View
      </button>
      <button
        type="button"
        onClick={() => setViewMode('cards')}
        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
          viewMode === 'cards'
            ? 'bg-black text-white dark:bg-gray-700'
            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        Card View
      </button>
    </div>
  );
};

export default ViewToggle;