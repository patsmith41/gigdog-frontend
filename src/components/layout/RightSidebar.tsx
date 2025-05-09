// src/components/layout/RightSidebar.tsx
import React from 'react';
import Filters from '@/components/concerts/Filters';
import { ApiNeighborhood } from '@/types';

interface RightSidebarProps {
  neighborhoods: ApiNeighborhood[];
  // TODO: Add props for filter change handlers from page.tsx
  // onFilterChange: (filters: any) => void; 
}

const RightSidebar: React.FC<RightSidebarProps> = ({ neighborhoods }) => {
  return (
    <aside className="w-full md:w-72 lg:w-80 xl:w-96 p-4 md:p-6 
                     sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto 
                     border-l border-neutral-200 dark:border-neutral-700 
                     bg-neutral-50 dark:bg-neutral-900">
      {/* Assuming Header is h-16 (4rem) */}
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
            Refine Shows
          </h2>
          <Filters neighborhoods={neighborhoods} />
        </div>

        <div className="h-60 bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-center p-2">
          <p className="text-neutral-500 dark:text-neutral-400">Ad Space / YouTube Player Area Placeholder</p>
        </div>
        
        <div className="h-40 bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
          <p className="text-neutral-500 dark:text-neutral-400">Future Feature Placeholder</p>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;