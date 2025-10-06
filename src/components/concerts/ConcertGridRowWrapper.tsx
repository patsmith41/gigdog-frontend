// src/components/concerts/ConcertGridRowWrapper.tsx
import React, { useEffect, useRef } from 'react'; 
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
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
   
    if (isExpanded && isDesktop && wrapperRef.current) {
        
        // lil baby  delay so card has finished rendering before we scroll
        setTimeout(() => {
            wrapperRef.current?.scrollIntoView({
                behavior: 'smooth', 
                block: 'nearest',   
            });
        }, 100); 
    }
  }, [isExpanded, isDesktop]); //  effect re-runs only when isExpanded or isDesktop changes

  return (
    
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