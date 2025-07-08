// src/components/concerts/ConcertGridRow.tsx
import React from 'react';
import { ApiConcert } from '@/types';
import { ChevronDown, ChevronUp, PlayCircleIcon, Ticket, MapPin, Music } from 'lucide-react';

// Helper functions (no changes needed here)
const formatDateStacked = (dateString: string): { dayShort: string, monthDay: string } => {
  if (!dateString) return { dayShort: 'TBA', monthDay: '' };
  try {
    const date = new Date(parseInt(dateString.split('-')[0]), parseInt(dateString.split('-')[1]) - 1, parseInt(dateString.split('-')[2]));
    const dayShort = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dayShort, monthDay };
  } catch (e) { return { dayShort: 'ERR', monthDay: 'Date' }; }
};

interface ConcertGridRowProps {
  concert: ApiConcert;
  onPlayRequest: (videoId: string | null, artistInfo?: any) => void;
  onToggleExpand: () => void;
  isExpanded: boolean; 
  isDesktop: boolean;
}

const ConcertGridRow: React.FC<ConcertGridRowProps> = ({ concert, onPlayRequest, onToggleExpand, isExpanded, isDesktop }) => {
  if (!concert || !concert.headliner || !concert.venue) {
    return <div className="p-4 text-red-500 border-b border-neutral-700">Error: Missing concert data for row.</div>;
  }

  const imageToUse = concert.headliner.artist_thumbnail_url;
  const headlinerName = concert.headliner.name;
  
  // We can remove these since the handlers are being removed
  // const headlinerVideoId1 = concert.headliner.youtube_video_id_1;
  
  const venueName = concert.venue.name;
  const venueCity = concert.venue.city;
  const venueState = concert.venue.state;

  const primaryTextColor = "text-white";
  const secondaryTextColor = "text-neutral-400";

  // The handlePlay and handleOpenerPlay functions are no longer needed in this component
  // const handleHeadlinerPlay = ...
  // const handleOpenerPlay = ...

  const actionButtonBase = "py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 ease flex items-center justify-center gap-2 border text-sm";
  const ticketButtonStyled = "bg-transparent text-neutral-300 hover:bg-pink-500 hover:text-white border-white hover:border-pink-500";

  const Container = isDesktop ? 'div' : 'button';

  return (
    <Container
      onClick={isDesktop ? undefined : onToggleExpand}
      className={`
        flex w-full relative 
        p-1 md:p-6 lg:p-1
        bg-neutral-900 border border-white rounded-2xl 
        transition-all duration-300 ease-in-out
        hover:bg-neutral-800 hover:-translate-y-1 hover:scale-[1.005] sm:hover:scale-[1.01]
        hover:shadow-lg hover:border-white text-left
        ${concert.is_featured ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-neutral-900' : ''}
        ${!isDesktop ? 'cursor-pointer' : ''}
      `}
    >
      {concert.headliner.is_hometown_show && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-md flex items-center z-10 leading-none">
          <MapPin size={10} className="mr-0.5" />LOCAL
        </div>
      )}
      
      <div className="flex w-full items-center gap-3 sm:gap-4 p-2">
        
        <div className="flex-shrink-0 w-22 h-22 sm:w-28 sm:h-28 lg:w-27 lg:h-27 bg-neutral-700 rounded-2xl overflow-hidden shadow-xl sm:ml-">
          {imageToUse ? (
            <img src={imageToUse} alt={`${headlinerName} thumbnail`} className="w-full h-full object-cover" width={112} height={112} loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500"><Music size={32} /></div>
          )}
        </div>

        <div className="flex-grow min-w-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 md:gap-4">
          
          {/* --- THIS IS THE SIMPLIFIED SECTION --- */}
          <div className="min-w-0 flex-1 sm:max-w-[55%] md:max-w-[50%] lg:max-w-[55%]">
            <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-semibold ${primaryTextColor} leading-tight truncate`} title={headlinerName}>
              {headlinerName}
            </h2>
            
            {concert.openers_media && concert.openers_media.length > 0 && (
              <p className={`text-xs sm:text-sm ${secondaryTextColor} mt-0.5 line-clamp-2 hidden sm:block`} title={concert.openers_media.map(o => o.name).join(', ')}>
                w/ {concert.openers_media.map(o => o.name).join(', ')}
              </p>
            )}
          </div>
          {/* --- END OF SIMPLIFIED SECTION --- */}

          <div className="flex-shrink-0 min-w-0 mt-1 sm:mt-0">
            <div
              className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm"
              title={venueName}
            >
              <MapPin size={14} className={`flex-shrink-0 text-neutral-400`} />
              <span className={`font-normal ${secondaryTextColor} leading-tight truncate max-w-[100px] sm:max-w-[120px] lg:max-w-[150px]`} title={venueName}>
                {venueName}
              </span>
            </div>
          </div>

        </div>

        <div className="flex flex-shrink-0 items-center gap-2 md:gap-3 ml-auto">
          {concert.ticket_url && (
            <a
              href={concert.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Get Tickets"
              className={`${actionButtonBase} ${ticketButtonStyled} hidden lg:flex`}
              onClick={(e) => e.stopPropagation()}
            >
              <Ticket size={18} />
              <span className="hidden sm:inline">Tickets</span>
            </a>
          )}
        </div>
      </div>

      {isDesktop && (
          <button
            onClick={onToggleExpand}
            title={isExpanded ? "Show compact view" : "Show detailed card"}
            className="absolute bottom-2 right-3 p-1.5 rounded-full text-white hover:text-pink-400 hover:bg-pink-400/10 transition-all duration-200 hover:scale-110"
          >
            {isExpanded ? <ChevronUp size={16} strokeWidth={2}/> : <ChevronDown size={16} strokeWidth={2} />}
            <span className="sr-only">{isExpanded ? "Show compact" : "Show card"}</span>
          </button>
      )}
    </Container>
  );
};

export default ConcertGridRow;