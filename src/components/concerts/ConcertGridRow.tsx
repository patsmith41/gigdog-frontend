// src/components/concerts/ConcertGridRow.tsx
'use client';

import React from 'react';
import { ApiConcert, FestivalArtist } from '@/types';
import { ChevronDown, ChevronUp, Clock, MapPin, Ticket, DollarSign, Music } from 'lucide-react';
import Link from 'next/link';
import { trackClick } from '@/utils/analytics';
import { format as formatDateFns } from 'date-fns';

// Reusable helper component for clean, readable festival info
const FestivalInfo = ({ stageName, startTime, endTime }: { stageName?: string | null; startTime?: string | null, endTime?: string | null }) => {
    
    const formatTime = (timeString: string | null | undefined): string => {
        if (!timeString) return '';
        try {
            const date = new Date(timeString);
            if (isNaN(date.getTime())) return '';
            return formatDateFns(date, 'h:mm a'); // e.g., "7:30 PM"
        } catch (e) {
            return '';
        }
    };
    
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);
    let timeDisplay = formattedStartTime;
    if (formattedStartTime && formattedEndTime) {
        timeDisplay = `${formattedStartTime} - ${formattedEndTime}`;
    }

    // --- THIS IS THE UPDATED JSX FOR THE COMPONENT ---
    return (
        // On small screens (mobile), it's a column. On 'sm' and up, it becomes a row.
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-end sm:gap-4 text-left sm:text-right flex-shrink-0 min-w-0">
            {stageName && (
                // The stage name will now appear first on desktop due to flex order.
                <div className="text-sm sm:text-base font-semibold text-indigo-400">
                    <span>{stageName}</span>
                </div>
            )}
            {timeDisplay && (
                // The time will appear second on desktop.
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-300 mt-0.5 sm:mt-0">
                    <Clock size={12} />
                    <span>{timeDisplay}</span>
                </div>
            )}
        </div>
    );
};
// --- END OF UPDATED JSX ---

interface ConcertGridRowProps {
  concert: ApiConcert | FestivalArtist;
  onPlayRequest: (videoId: string | null, artistInfo?: any) => void;
  onToggleExpand: () => void;
  isExpanded: boolean; 
  isDesktop: boolean;
  context?: 'homepage' | 'festival';
}

const ConcertGridRow: React.FC<ConcertGridRowProps> = ({ concert, onToggleExpand, isExpanded, isDesktop, context = 'homepage' }) => {
  if (!concert || !concert.headliner || !concert.venue) {
    return <div className="p-4 text-red-500 border-b border-neutral-700">Error: Missing concert data.</div>;
  }

  const imageToUse = concert.headliner.artist_thumbnail_url;
  const headlinerName = concert.headliner.name;
  const venueName = concert.venue.name;

  const primaryTextColor = "text-white";
  const secondaryTextColor = "text-neutral-400";
  const actionButtonBase = "py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 ease flex items-center justify-center gap-2 border text-sm";
  const ticketButtonStyled = "bg-transparent text-neutral-300 hover:bg-pink-500 hover:text-white border-white hover:border-pink-500";
  const Container = isDesktop ? 'div' : 'button';

  return (
    <Container
      onClick={isDesktop ? undefined : () => {
        trackClick({ linkType: 'show_info_page', targetUrl: `/shows/${concert.show_id}`, sourceComponent: 'ConcertGridRow', showId: concert.show_id, artistId: concert.headliner.artist_id, venueId: concert.venue.venue_id });
        onToggleExpand();
      }}
      className={`flex w-full relative p-1 md:p-6 lg:p-1 bg-neutral-900 border border-white rounded-2xl transition-all duration-300 ease-in-out hover:bg-neutral-800 hover:-translate-y-1 hover:scale-[1.005] sm:hover:scale-[1.01] hover:shadow-lg hover:border-white text-left ${concert.is_featured ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-neutral-900' : ''} ${!isDesktop ? 'cursor-pointer' : ''}`}
    >
      {concert.is_hometown_show && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-md flex items-center z-10 leading-none">
          <MapPin size={10} className="mr-0.5" />LOCAL
        </div>
      )}
      <div className="flex w-full items-center gap-3 sm:gap-4 p-2">
        <div className="flex-shrink-0 w-22 h-22 sm:w-28 sm:h-28 lg:w-27 lg:h-27 bg-neutral-700 rounded-2xl overflow-hidden shadow-xl">
          {imageToUse ? (
            <img src={imageToUse} alt={`${headlinerName} thumbnail`} className="w-full h-full object-cover" width={112} height={112} loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500"><Music size={32} /></div>
          )}
        </div>
        <div className="flex-grow min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0 flex-1">
                <h2 className={`text-base sm:text-lg md:text-xl font-semibold ${primaryTextColor} leading-tight truncate`} title={headlinerName}>
                    {headlinerName}
                </h2>
                {concert.openers_media && concert.openers_media.length > 0 && (
                    <p className={`text-xs sm:text-sm ${secondaryTextColor} mt-0.5 line-clamp-2 hidden sm:block`} title={concert.openers_media.map(o => o.name).join(', ')}>
                        w/ {concert.openers_media.map(o => o.name).join(', ')}
                    </p>
                )}
            </div>
            {context === 'festival' ? (
                <FestivalInfo 
                    stageName={(concert as FestivalArtist).stage_name} 
                    startTime={(concert as FestivalArtist).start_time} 
                    endTime={(concert as FestivalArtist).end_time}
                />
            ) : (
                <div className="flex-shrink-0 min-w-0 flex items-center gap-x-4 gap-y-1 mt-1 sm:mt-0">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm" title={venueName}>
                        <Link href={`/venues/${concert.venue.venue_id}`} className="hover:underline" onClick={(e) => { e.stopPropagation(); trackClick({ linkType: 'venue_website', targetUrl: `/venues/${concert.venue.venue_id}`, sourceComponent: 'ConcertGridRow', showId: concert.show_id, venueId: concert.venue.venue_id }); }}>
                          <span className={`font-normal ${secondaryTextColor} leading-tight truncate max-w-[100px] sm:max-w-[120px] lg:max-w-[150px]`} title={venueName}>
                              {venueName}
                          </span>
                        </Link>
                    </div>
                     {/* {concert.price_info?.min && (
                        <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-base font-normal text-green-400">
                            <DollarSign size={14}/><span>{concert.price_info.min}</span>
                        </div>
                    )} */}
                </div>
            )}
        </div>
        <div className="flex flex-col sm:flex-row flex-shrink-0 items-center gap-2 md:gap-3 ml-auto">
             {/* {concert.price_info?.min && context !== 'festival' && (
                <div className="flex sm:hidden items-center gap-1.5 text-xs font-semibold text-green-400 pr-1">
                    <span>${concert.price_info.min}</span>
                </div>
            )} */}
            {concert.ticket_url && context !== 'festival' && (
                <a href={concert.ticket_url} target="_blank" rel="noopener noreferrer" title="Get Tickets" className={`${actionButtonBase} ${ticketButtonStyled} hidden lg:flex`} onClick={(e) => { e.stopPropagation(); trackClick({ linkType: 'ticket_url', targetUrl: concert.ticket_url || '#', sourceComponent: 'ConcertGridRow', showId: concert.show_id, artistId: concert.headliner.artist_id, venueId: concert.venue.venue_id }); }}>
                  <Ticket size={18} />
                  <span className="hidden sm:inline">Tickets</span>
                </a>
            )}
        </div>
      </div>
      {isDesktop && (
          <button onClick={onToggleExpand} title={isExpanded ? "Show compact view" : "Show detailed card"} className="absolute bottom-2 right-3 p-1.5 rounded-full text-white hover:text-pink-400 hover:bg-pink-400/10 transition-all duration-200 hover:scale-110">
            {isExpanded ? <ChevronUp size={16} strokeWidth={2}/> : <ChevronDown size={16} strokeWidth={2} />}
            <span className="sr-only">{isExpanded ? "Show compact" : "Show card"}</span>
          </button>
      )}
    </Container>
  );
};

export default ConcertGridRow;