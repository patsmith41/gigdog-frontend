// src/components/concerts/ConcertCard.tsx
'use client';

import React, { useState } from 'react';
import { ApiConcert, ApiConcertHeadliner, OpenerMedia } from '@/types';
import { 
  MapPin, 
  Info, 
  Ticket as TicketIcon, 
  PlayCircleIcon, 
  Music2, 
  Minus,
  Share2, CalendarPlus,
  DollarSign,
  Users
} from 'lucide-react';

// --- Helper functions remain unchanged ---
const formatDateForCardOverlay = (dateString: string): { dayShort: string, monthDay: string } => {
    if (!dateString) return { dayShort: "TBA", monthDay: "" };
    try {
        const date = new Date(`${dateString}T00:00:00Z`);
        const dayShort = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }).toUpperCase();
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
        return { dayShort, monthDay };
    } catch (e) { return { dayShort: 'ERR', monthDay: 'Date' }; }
};
const formatTimeForCardOverlay = (timeString: string | null): string => {
    if (!timeString || timeString.trim() === "") return 'TBA';
    try {
        const parts = timeString.split(':');
        if (parts.length < 2) return 'TBA';
        const date = new Date(); 
        date.setUTCHours(parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2] || "0", 10));
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });
    } catch (e) { return 'TBA'; }
};
const generateCalendarLink = (concert: ApiConcert) => {
  const title = encodeURIComponent(`${concert.headliner.name} at ${concert.venue.name}`);
  const [year, month, day] = concert.show_date.split('-').map(Number);
  const [hour = 20, minute = 0] = concert.show_time ? concert.show_time.split(':').map(Number) : [];
  const startTime = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
  const formatDateForGoogle = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDateForGoogle(startTime)}/${formatDateForGoogle(endTime)}&details=${encodeURIComponent(`Get more info and tickets at: ${window.location.origin}/shows/${concert.show_id}`)}&location=${encodeURIComponent(concert.venue.name + ', ' + concert.venue.city)}`;
}

interface ConcertCardProps {
  concert: ApiConcert;
  onPlayRequest?: (videoId: string | null, artistInfo?: any) => void;
  isIndividuallyToggled?: boolean;
  onCollapse?: () => void;
  activeVideoId?: string | null;
  isDesktop: boolean;
  context?: 'homepage' | 'festival';
}

const ConcertCard: React.FC<ConcertCardProps> = ({ 
  concert, 
  onPlayRequest, 
  isIndividuallyToggled, 
  onCollapse,
  activeVideoId = null,
  isDesktop,
  context = 'homepage'
}) => {
  if (!concert || !concert.headliner || !concert.venue) {
    return <div className="p-4 text-red-500 bg-neutral-800 rounded-lg">Error: Missing critical concert data for card.</div>;
  }

  // --- NEW: State management for the active artist ---
  const allArtists: (ApiConcertHeadliner | OpenerMedia)[] = [
    concert.headliner,
    ...(concert.openers_media || [])
  ];
  const [activeArtist, setActiveArtist] = useState<ApiConcertHeadliner | OpenerMedia>(allArtists[0]);

  // --- All variables are now derived from `activeArtist` or `concert` props ---
  const { dayShort, monthDay } = formatDateForCardOverlay(concert.show_date);
  const showTimeDisplay = formatTimeForCardOverlay(concert.show_time);
  
  // Use active artist for dynamic content
  const displayImageSrc = 'artist_display_image_url' in activeArtist ? activeArtist.artist_display_image_url : null;
  const artistName = activeArtist.name || "Unknown Artist";
  const shortBio = 'short_bio' in activeArtist ? activeArtist.short_bio : "Information not available for this artist.";
  const currentArtistVideoId = 'youtube_video_id_1' in activeArtist ? activeArtist.youtube_video_id_1 : null;

  // Venue and Price info come from the parent `concert` object
  const venueName = concert.venue.name || "Unknown Venue";
  const venueNeighborhood = concert.venue.neighborhood_name || "";
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venueName}, ${concert.venue.city}, ${concert.venue.state}`)}`;
  const priceElement = concert.price_info?.min ? `$${concert.price_info.min}` : 'N/A';
  
  const primaryTextColor = "text-neutral-100";
  const secondaryTextColor = "text-neutral-300";
  const tertiaryTextColor = "text-neutral-400";

  const handlePlay = (videoId: string | null) => {
    if (videoId && onPlayRequest) {
      onPlayRequest(videoId, { 
        artistName: artistName, 
        showDate: concert.show_date, 
        venueName: venueName,
        showId: concert.show_id,
        ticketUrl: concert.ticket_url
      });
    }
  };

  const handleShare = async () => { /* ... (no changes needed here) ... */ };

  return (
    <div className="bg-neutral-800 rounded-xl shadow-2xl overflow-hidden border border-neutral-700 flex flex-col md:flex-row relative">
      {isIndividuallyToggled && onCollapse && (
        <button
          onClick={onCollapse}
          title="Show compact view"
          className="absolute top-3 right-3 z-30 p-2 text-white hover:text-pink-400 hover:bg-pink-400/10 rounded-full transition-all duration-200 hover:scale-110"
        >
          <Minus size={18} strokeWidth={2.5} />
        </button>
      )}

      {/* --- Left Side: Image and Venue Info --- */}
      <div className="md:w-[40%] lg:w-[45%] flex-shrink-0 flex flex-col bg-neutral-900">
        <div className="relative w-full">
          <div className="aspect-[4/3] bg-neutral-700 w-full">
            {displayImageSrc ? (
              <img src={displayImageSrc} alt={`${artistName} main image`} className="w-full h-full object-cover" loading="lazy"/>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-500"><Music2 size={48} /></div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white z-10">
            <div className="font-semibold text-lg sm:text-xl">{dayShort}, {monthDay}</div>
            <div className="text-xs sm:text-sm">{showTimeDisplay}</div>
          </div>
        </div>
        <div className="p-3 sm:p-4 text-sm space-y-3 border-t border-neutral-700 md:border-t-0 flex-grow">
          {/* ... (Venue, Price, Age info - no changes needed here) ... */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start">
              <MapPin size={15} className={`mr-2 mt-1 ${tertiaryTextColor} flex-shrink-0`} />
              <div className="min-w-0">
                <a href={mapLink} target="_blank" rel="noopener noreferrer" className={`font-medium ${secondaryTextColor} hover:underline leading-tight`}>{venueName}</a>
                {venueNeighborhood && <div className={`text-xs ${tertiaryTextColor} leading-tight truncate`}>{venueNeighborhood}</div>}
              </div>
            </div>
            <div className="flex items-center flex-shrink-0">
              <DollarSign size={15} className={`mr-1.5 ${tertiaryTextColor}`} />
              <span className={`${secondaryTextColor} font-medium`}>{priceElement}</span>
            </div>
          </div>
          {concert.age_restriction && concert.age_restriction !== "Info TBA" && (
            <div className="flex items-center"><Users size={15} className={`mr-2 ${tertiaryTextColor}`} /> <span className={`${secondaryTextColor}`}>Age: {concert.age_restriction}</span></div>
          )}
        </div>
      </div>

      {/* --- Right Side: Dynamic Artist Info --- */}
      <div className="flex-grow p-3 sm:p-4 flex flex-col md:border-l border-neutral-700">
        {/* --- NEW: Artist Tabs --- */}
        {allArtists.length > 1 && (
            <div className="flex border-b border-neutral-700 mb-4 -mx-4 -mt-3">
            {allArtists.map((artist) => (
                <button
                key={'artist_id' in artist ? artist.artist_id : artist.name}
                onClick={() => setActiveArtist(artist)}
                className={`flex-1 px-4 py-3 text-sm font-medium text-center transition-colors ${
                    activeArtist.name === artist.name
                    ? 'border-b-2 border-indigo-500 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                >
                {artist.name}
                </button>
            ))}
            </div>
        )}

        <div className="flex items-baseline gap-2 mb-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight" title={artistName}>
            {artistName}
          </h2>
          {currentArtistVideoId && onPlayRequest && (
            <button 
              onClick={() => handlePlay(currentArtistVideoId)}
              title={`Play preview for ${artistName}`}
              className="p-0.5 text-neutral-400 hover:text-indigo-400 transition-colors flex-shrink-0"
            >
              <PlayCircleIcon size={22} strokeWidth={1.5} />
            </button>
          )}
        </div>

        <p className={`text-sm ${secondaryTextColor} leading-relaxed max-h-36 sm:max-h-40 md:max-h-48 lg:max-h-52 xl:max-h-60 overflow-y-auto styled-scrollbar mb-3 pr-1 flex-grow`}>
          {shortBio}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-auto pt-3">
          {/* ... (Action buttons - no changes needed here) ... */}
          {context === 'homepage' && (
            <>
            {concert.show_date && (
                <a href={generateCalendarLink(concert)} target="_blank" rel="noopener noreferrer" className="col-span-1 px-3 py-2.5 text-center border border-neutral-700 hover:bg-neutral-700 text-neutral-300 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"><CalendarPlus size={16}/> Add to Cal</a>
              )}              <button onClick={handleShare} className="col-span-1 px-3 py-2.5 text-center border border-neutral-700 hover:bg-neutral-700 text-neutral-300 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"><Share2 size={16}/> Share</button>
              <a href={`/shows/${concert.show_id}`} className="col-span-1 px-3 py-2.5 bg-blue-600 text-white hover:bg-blue-700 text-center text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"><Info size={16}/> Show Info</a>
              {concert.ticket_url && (<a href={concert.ticket_url} target="_blank" rel="noopener noreferrer" className="col-span-1 px-3 py-2.5 bg-pink-500 text-white hover:bg-pink-600 text-center text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"><TicketIcon size={16}/> Tickets</a>)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConcertCard;