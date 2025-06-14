// src/components/concerts/ConcertGridRowWrapper.tsx
import React from 'react';
import { ApiConcert, NowPlayingInfo } from '@/types';
import ConcertGridRow from './ConcertGridRow';
import ConcertCard from './ConcertCard';
// REMOVED: No longer need InlineVideoPlayer here

interface ConcertGridRowWrapperProps {
  concert: ApiConcert;
  onPlayRequest: (videoId: string | null, artistInfo?: any) => void;
  isIndividuallyCarded: boolean;
  onToggleCardState: () => void;
  // REMOVED: Mobile-specific props are no longer needed here
  // hasActiveVideo?: boolean;
  activeVideoId?: string | null;
  // nowPlayingInfo?: NowPlayingInfo | null;
  // onCloseVideo?: () => void;
  isDesktop: boolean;
}

const ConcertGridRowWrapper: React.FC<ConcertGridRowWrapperProps> = ({
  concert,
  onPlayRequest,
  isIndividuallyCarded,
  onToggleCardState,
  activeVideoId = null, // We still receive this
  isDesktop
}) => {

  if (isIndividuallyCarded) {
    return (
      <div className="my-2 border border-neutral-700 rounded-xl overflow-hidden shadow-lg bg-neutral-800">
        <ConcertCard
          concert={concert}
          onPlayRequest={onPlayRequest}
          onCollapse={onToggleCardState}
          isIndividuallyToggled={true}
          // CHANGED: The card now determines if its video is active
          activeVideoId={activeVideoId}
          isDesktop={isDesktop}
        />
      </div>
    );
  }

  // Default: Render as a Grid Row (no inline player)
  return (
    <div className={` 
      ${concert.is_featured 
        ? 'bg-yellow-800/30 dark:bg-yellow-700/30 hover:bg-yellow-700/40' 
        : 'hover:bg-neutral-800 dark:hover:bg-neutral-700/60'
      }
      border-b border-neutral-800 dark:border-neutral-750 last:border-b-0
      transition-colors duration-150 
    `}>
      <ConcertGridRow
        concert={concert}
        onPlayRequest={onPlayRequest}
        onToggleExpand={onToggleCardState}
        isExpanded={isIndividuallyCarded}
        isDesktop={isDesktop}
      />
    </div>
  );
};

export default ConcertGridRowWrapper;