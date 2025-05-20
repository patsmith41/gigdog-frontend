// src/components/concerts/ConcertGridRowWrapper.tsx
import React, { useState, useCallback } from 'react';
import { ApiConcert } from '@/types';
import ConcertGridRow from './ConcertGridRow'; // Import the new component
import ConcertCard from './ConcertCard';     // We'll use this for expanded content

interface ConcertGridRowWrapperProps {
  concert: ApiConcert;
  currentViewMode: 'grid' | 'cards';
  onPlayRequest: (videoId: string | null) => void;
}

const ConcertGridRowWrapper: React.FC<ConcertGridRowWrapperProps> = ({ concert, currentViewMode, onPlayRequest }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // In Card View mode, we render the full ConcertCard directly.
  if (currentViewMode === 'cards') {
    return (
      <div className="my-4 md:my-6"> {/* Add some margin between cards in card view */}
        <ConcertCard 
          concert={concert} 
          onPlayRequest={onPlayRequest} 
          isExpandedView={false} // Explicitly false as it's the primary card view
        />
      </div>
    );
  }

  // In Grid View mode:
  return (
    <div className={`border-b border-neutral-200 dark:border-neutral-700 last:border-b-0 
                    ${concert.is_featured ? 'bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-800/40' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'} 
                    transition-colors duration-150
                  `}>
      <ConcertGridRow 
        concert={concert} 
        onPlayRequest={onPlayRequest}
        onToggleExpand={handleToggleExpand}
        isExpanded={isExpanded}
      />
      
      {/* Expanded content area for Grid View */}
      {isExpanded && (
        <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-700">
          {/* Pass isExpandedView={true} to allow for slightly different styling/layout if needed */}
          <ConcertCard 
            concert={concert} 
            onPlayRequest={onPlayRequest}
            isExpandedView={true} 
          />
        </div>
      )}
    </div>
  );
};

export default ConcertGridRowWrapper;