// src/components/concerts/ConcertGridRowWrapper.tsx
import React from 'react';
import { ApiConcert, NowPlayingInfo } from '@/types';
import ConcertGridRow from './ConcertGridRow';
import ConcertCard from './ConcertCard';

interface ConcertGridRowWrapperProps {
  concert: ApiConcert;
  onShowSelect: () => void;
  onPlayRequest: (videoId: string | null, artistInfo?: any) => void;
  isExpanded: boolean;
  isDesktop: boolean;
}

const ConcertGridRowWrapper: React.FC<ConcertGridRowWrapperProps> = ({
  concert,
  onShowSelect,
  onPlayRequest,
  isExpanded,
  isDesktop,
}) => {

  return (
    <div
      className={`
        ${concert.is_featured ? 'bg-yellow-800/20' : ''}
        border-b border-neutral-800 last:border-b-0
        transition-colors duration-150
      `}
    >
      {/* Conditionally render: if desktop AND expanded, show card; otherwise show grid row */}
      {isExpanded ? (
        <div className="p-4">
          <ConcertCard
            concert={concert}
            onPlayRequest={onPlayRequest}
            isDesktop={isDesktop}
            isIndividuallyToggled={true}
            onCollapse={onShowSelect} 
          />
        </div>
      ) : (
        <ConcertGridRow
          concert={concert}
          onPlayRequest={onPlayRequest}
          onToggleExpand={onShowSelect}
          isExpanded={isExpanded}
          isDesktop={isDesktop}
        />
      )}
    </div>
  );
};

export default ConcertGridRowWrapper;