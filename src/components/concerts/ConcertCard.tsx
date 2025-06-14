// src/components/concerts/ConcertCard.tsx
import React from 'react';
import { ApiConcert } from '@/types';
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

// Helper functions (no changes)
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

// ADDED: Helper for Add to Calendar
const generateCalendarLink = (concert: ApiConcert) => {
  const title = encodeURIComponent(`${concert.headliner.name} at ${concert.venue.name}`);
  
  // Basic date parsing. Assumes YYYY-MM-DD and HH:mm:ss
  const [year, month, day] = concert.show_date.split('-').map(Number);
  const [hour = 20, minute = 0] = concert.show_time ? concert.show_time.split(':').map(Number) : [];

  // Create start time in YYYYMMDDTHHmmSS format for Google Calendar
  const startTime = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000)); // Assume 2 hour duration

  const formatDateForGoogle = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
  
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDateForGoogle(startTime)}/${formatDateForGoogle(endTime)}&details=${encodeURIComponent(`Get more info and tickets at: ${window.location.origin}/shows/${concert.show_id}`)}&location=${encodeURIComponent(concert.venue.name + ', ' + concert.venue.city)}`;

  return googleCalendarUrl;
}


interface ConcertCardProps {
  concert: ApiConcert;
  onPlayRequest?: (videoId: string | null, artistInfo?: any) => void;
  isIndividuallyToggled?: boolean;
  onCollapse?: () => void;
  activeVideoId?: string | null;
  isDesktop: boolean;
}

const ConcertCard: React.FC<ConcertCardProps> = ({ 
  concert, 
  onPlayRequest, 
  isIndividuallyToggled, 
  onCollapse,
  activeVideoId = null,
  isDesktop
}) => {
  if (!concert || !concert.headliner || !concert.venue) {
    return <div className="p-4 text-red-500 bg-neutral-800 rounded-lg">Error: Missing critical concert data for card.</div>;
  }

  const { dayShort, monthDay } = formatDateForCardOverlay(concert.show_date);
  const showTimeDisplay = formatTimeForCardOverlay(concert.show_time);
  
  const displayImageSrc = concert.headliner.artist_display_image_url;
  const headlinerName = concert.headliner.name || "Unknown Artist";
  
  const venueName = concert.venue.name || "Unknown Venue";
  const venueNeighborhood = concert.venue.neighborhood_name || "";
  const venueCity = concert.venue.city || "";
  const venueState = concert.venue.state || "";
  const mapQuery = encodeURIComponent(`${venueName}, ${venueCity}, ${venueState}`);
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const shortBio = concert.headliner.short_bio || "No short bio available for this artist.";
  
  let priceElement: React.ReactNode;
  if (concert.price_info?.min) {
    priceElement = `$${concert.price_info.min}`;
  } else if (concert.ticket_url && concert.ticket_url.toLowerCase().includes('ticketmaster.com')) {
    priceElement = (
      <a
        href={concert.ticket_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline whitespace-nowrap"
        title="Check Ticketmaster for current prices"
        onClick={(e) => e.stopPropagation()}
      >
        Check TM for prices
      </a>
    );
  } else {
    priceElement = 'N/A';
  }

  const headlinerVideoId1 = concert.headliner.youtube_video_id_1;
  const openersMedia = concert.openers_media || [];

  const openersWithVideos = openersMedia.filter(op => op.youtube_id_1);
  const showOpenersSection = openersWithVideos.length > 0;

  const primaryTextColor = "text-neutral-100";
  const secondaryTextColor = "text-neutral-300";
  const tertiaryTextColor = "text-neutral-400";

  const handlePlay = (videoId: string | null, artistName: string, isHeadliner: boolean = false) => {
    if (videoId && onPlayRequest) {
      onPlayRequest(videoId, { 
        artistName: artistName, 
        showDate: concert.show_date, 
        venueName: venueName, 
        hometown: isHeadliner ? concert.headliner.hometown : undefined,
        showId: concert.show_id,
        ticketUrl: concert.ticket_url
      });
    }
  };

  // ADDED: Share button handler
  const handleShare = async () => {
    const shareData = {
      title: 'GigDog Concert',
      text: `Check out ${concert.headliner.name} at ${concert.venue.name} on ${new Date(concert.show_date + 'T00:00:00').toLocaleDateString()}!`,
      url: `${window.location.origin}/shows/${concert.show_id}`
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('Show shared successfully');
      } else {
        // Fallback for desktop browsers
        await navigator.clipboard.writeText(shareData.url);
        alert('Show link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };


  const allVideoIdsInCard = [
    concert.headliner.youtube_video_id_1,
    ...openersMedia.map(op => op.youtube_id_1)
  ].filter(Boolean);

  const isThisCardPlayingVideo = activeVideoId && allVideoIdsInCard.includes(activeVideoId);
  const shouldShowVideoInCard = !isDesktop && isThisCardPlayingVideo;

  return (
    <div className="bg-neutral-800 rounded-xl shadow-2xl overflow-hidden border border-neutral-700 flex flex-col md:flex-row relative">
      {isIndividuallyToggled && onCollapse && (
        <button
          onClick={onCollapse}
          title="Show compact view"
          className="absolute top-3 right-3 z-30 p-2 text-white hover:text-pink-400 hover:bg-pink-400/10 rounded-full transition-all duration-200 hover:scale-110"
        >
          <Minus size={18} strokeWidth={2.5} />
          <span className="sr-only">Show compact view</span>
        </button>
      )}

      <div className="md:w-[40%] lg:w-[45%] flex-shrink-0 flex flex-col bg-neutral-900">
        <div className="relative w-full">
          <div className="aspect-[4/3] bg-neutral-700 w-full">
            {shouldShowVideoInCard ? (
              <iframe
                key={activeVideoId}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&modestbranding=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : displayImageSrc ? (
              <img src={displayImageSrc} alt={`${headlinerName} main image`} className="w-full h-full object-cover" loading="lazy"/>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-500"><Music2 size={48} /></div>
            )}
          </div>
          
          {!shouldShowVideoInCard && (
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white z-10">
              <div className="font-semibold text-lg sm:text-xl">{dayShort}, {monthDay}</div>
              <div className="text-xs sm:text-sm">{showTimeDisplay}</div>
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4 text-sm space-y-3 border-t border-neutral-700 md:border-t-0 flex-grow">
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

      <div className="flex-grow p-3 sm:p-4 flex flex-col md:border-l border-neutral-700"> 
        <div className="flex items-baseline gap-2 mb-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight" title={headlinerName}>
            {headlinerName}
          </h2>
          {headlinerVideoId1 && onPlayRequest && !(shouldShowVideoInCard && activeVideoId === headlinerVideoId1) && (
            <button 
              onClick={() => handlePlay(headlinerVideoId1, headlinerName, true)}
              title={`Play preview for ${headlinerName}`}
              className="p-0.5 text-neutral-400 hover:text-indigo-400 transition-colors flex-shrink-0"
            >
              <PlayCircleIcon size={22} strokeWidth={1.5} />
              <span className="sr-only">Play Preview</span>
            </button>
          )}
        </div>

        <p className={`text-sm ${secondaryTextColor} leading-relaxed max-h-36 sm:max-h-40 md:max-h-48 lg:max-h-52 xl:max-h-60 overflow-y-auto styled-scrollbar mb-3 pr-1 flex-grow`}>
          {shortBio}
        </p>

        {showOpenersSection && (
          <div className="my-3 py-3 border-t border-b border-neutral-700 text-sm">
            <h4 className="font-medium text-neutral-300 mb-2 text-sm uppercase tracking-wider">
              Opening Acts
            </h4>
            <div className="flex flex-col gap-y-1.5">
              {openersMedia.map((opener) => (
                <div key={opener.name} className="flex items-center gap-2">
                  {opener.youtube_id_1 && onPlayRequest && !(shouldShowVideoInCard && activeVideoId === opener.youtube_id_1) ? (
                    <button onClick={() => handlePlay(opener.youtube_id_1, opener.name)} className="flex items-center gap-2 text-left group">
                      <PlayCircleIcon size={18} strokeWidth={1.5} className="text-neutral-400 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                      <span className={`text-sm font-medium ${primaryTextColor} group-hover:text-indigo-400`}>{opener.name}</span>
                    </button>
                  ) : (
                    <span className={`text-sm font-medium ${primaryTextColor} ml-7`}>{opener.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* --- SECTION CHANGED --- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-auto pt-3">
          {/* ADDED: onClick handler and enabled the button */}
          <a
            href={generateCalendarLink(concert)}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-1 px-3 py-2.5 text-center border border-neutral-700 hover:bg-neutral-700 text-neutral-300 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"
          >
            <CalendarPlus size={16}/> Add to Cal
          </a>

          {/* ADDED: onClick handler and enabled the button */}
          <button
            onClick={handleShare}
            className="col-span-1 px-3 py-2.5 text-center border border-neutral-700 hover:bg-neutral-700 text-neutral-300 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"
          >
            <Share2 size={16}/> Share
          </button>
          
          {/* CHANGED: Styling updated to blue */}
          <a
            href={`/shows/${concert.show_id}`}
            className="col-span-1 px-3 py-2.5 bg-blue-600 text-white hover:bg-blue-700 text-center text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"
          >
            <Info size={16}/> 
            Show Info
          </a>

          {concert.ticket_url && (
            <a
              href={concert.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-1 px-3 py-2.5 bg-pink-500 text-white hover:bg-pink-600 text-center text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"
            >
              <TicketIcon size={16}/> Tickets
            </a>
          )}
        </div>
        {/* --- END OF SECTION CHANGE --- */}

      </div>
    </div>
  );
};

export default ConcertCard;