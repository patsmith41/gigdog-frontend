// src/components/concerts/ConcertGridRowWrapper.tsx
import React, { useEffect, useRef } from 'react'; // --- CHANGE 1: Import useEffect and useRef ---
import { ApiConcert, NowPlayingInfo } from '@/types';
import ConcertGridRow from './ConcertGridRow';
import ConcertCard from './ConcertCard';

interface ConcertGridRowWrapperProps {
  concert: ApiConcert;
  onShowSelect: () => void;
  onPlayRequest: (videoId: string | null, artistInfo?: any) => void;
  isExpanded: boolean;
  isDesktop: boolean;
  context?: 'homepage' | 'festival';
}

const ConcertGridRowWrapper: React.FC<ConcertGridRowWrapperProps> = ({
  concert,
  onShowSelect,
  onPlayRequest,
  isExpanded,
  isDesktop,
  context = 'homepage',
}) => {
  // --- CHANGE 2: Add a ref to get a reference to our component's main div ---
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --- CHANGE 3: Add an effect that runs when the card expands ---
  useEffect(() => {
    // We only want to scroll when the card expands on desktop
    if (isExpanded && isDesktop && wrapperRef.current) {
        
        // Add a tiny delay to ensure the card has finished rendering before we scroll
        setTimeout(() => {
            wrapperRef.current?.scrollIntoView({
                behavior: 'smooth', // Makes the scroll animated and not a sudden jump
                block: 'nearest',   // Scrolls the minimum amount to bring the element into view
            });
        }, 100); // 100ms is usually enough for the browser to paint the new content
    }
  }, [isExpanded, isDesktop]); // This effect re-runs only when isExpanded or isDesktop changes

  return (
    // --- CHANGE 4: Attach the ref to the div ---
    <div
      ref={wrapperRef} 
      className={`
        ${concert.is_featured ? 'bg-yellow-800/20' : ''}
        border-b border-neutral-800 last:border-b-0
        transition-all duration-300 ease-in-out
      `}
    >
      {/* The rest of this component's logic remains exactly the same */}
      {isExpanded ? (
        <div className="p-4">
          <ConcertCard
            concert={concert}
            onPlayRequest={onPlayRequest}
            isDesktop={isDesktop}
            isIndividuallyToggled={true}
            onCollapse={onShowSelect} 
            context={context}
          />
        </div>
      ) : (
        <ConcertGridRow
          concert={concert}
          onPlayRequest={onPlayRequest}
          onToggleExpand={onShowSelect}
          isExpanded={isExpanded}
          isDesktop={isDesktop}
          context={context}
        />
      )}
    </div>
  );
};

export default ConcertGridRowWrapper;