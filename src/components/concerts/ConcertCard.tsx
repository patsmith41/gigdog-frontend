// src/components/concerts/ConcertCard.tsx
import React from 'react';
import { ApiConcert } from '@/types';
import { CalendarDays, Clock, DollarSign, MapPin, Users, Info, Ticket as TicketIcon, PlayCircle, Music2 } from 'lucide-react';

// Helper functions (as you have them)
const formatDateForCard = (dateString: string): { dayOfWeekShort: string, monthDayTime: string, dayOfMonth: string, monthShort: string } => {
  if (!dateString) return { dayOfWeekShort: "TBA", monthDayTime: "", dayOfMonth: "", monthShort: ""};
  const date = new Date(`${dateString}T00:00:00`);
  return {
    dayOfWeekShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
    monthDayTime: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    dayOfMonth: date.toLocaleDateString('en-US', { day: '2-digit' }),
    monthShort: date.toLocaleDateString('en-US', { month: 'short' }),
  };
};

const formatTimeForCard = (timeString: string | null): string => {
  if (!timeString) return 'TBA';
  const parts = timeString.split(':');
  if (parts.length < 2 || isNaN(parseInt(parts[0])) || isNaN(parseInt(parts[1]))) {
    return 'Invalid Time';
  }
  const [hours, minutes] = parts;
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};


interface ConcertCardProps {
  concert: ApiConcert;
  onPlayRequest?: (videoId: string | null) => void;
  isExpandedView?: boolean;
}

const ConcertCard: React.FC<ConcertCardProps> = ({ concert, onPlayRequest, isExpandedView }) => {
  // Guard clauses
  if (!concert) {
    console.error("ConcertCard: Received undefined or null concert prop.");
    return <div className="p-4 text-red-500">Error: Invalid concert data passed to card.</div>;
  }
  if (!concert.headliner || !concert.venue) {
    return <div className="p-4 text-red-500">Error: Missing critical headliner or venue data for card.</div>;
  }

  const { dayOfWeekShort, monthDayTime } = formatDateForCard(concert.show_date);
  const showTimeDisplay = formatTimeForCard(concert.show_time);
  const doorsTimeDisplay = concert.doors_time ? formatTimeForCard(concert.doors_time) : null;

  // ** CORRECTED IMAGE SOURCE TO USE IMAGEKIT DISPLAY URL **
  const displayImageSrc = concert.headliner.artist_display_image_url; 

  // Placeholder data - these need to come from your API eventually via ApiConcert type
  const headlinerName = concert.headliner.name || "Unknown Artist";
  const openersDisplay = concert.headliner.openers_string || ""; 
  const artistHometownDisplay = concert.headliner.hometown || "Hometown TBA"; 
  const venueName = concert.venue.name || "Unknown Venue";
  const neighborhoodName = concert.venue?.neighborhood_name || "";
  const venueCity = concert.venue?.city || "";
  const venueState = concert.venue?.state || ""; // Still get it from props but not display



  const venueLocationDisplay = `${concert.venue.neighborhood_name ? concert.venue.neighborhood_name + ' - ' : ''}${concert.venue.city}, ${concert.venue.state}`;
  //const genreTags = concert.headliner.genres_array || []; 
  const ageRestrictionDisplay = concert.age_restriction || "Info TBA";
  const shortBio = concert.headliner.short_bio || "No short bio available for this artist.";
  
  const priceMin = concert.price_info?.min;
  //const priceMax = concert.price_info?.max_price_from_api; // Assuming this field in your type
  const currency = concert.price_info?.currency || 'USD';
  const priceDisplay = concert.price_info?.min
  ? `$${concert.price_info.min}${concert.price_info.currency !== 'USD' ? ` ${concert.price_info.currency}` : ''}`
  : "Check Venue";
  

  const headlinerVideoId1 = concert.headliner.youtube_video_id_1;

  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 flex flex-col md:flex-row
                    ${isExpandedView ? "border-t-0 rounded-t-none" : ""} 
                  `}>
      {/* Left Section: Image with Date Overlay */}
      <div className="md:w-1/3 lg:w-5/12 xl:w-1/3 flex-shrink-0 relative"> {/* Proportions like "ConcertCal" card */}
        <div className="aspect-[4/5] sm:aspect-[3/4] md:aspect-auto md:h-full bg-neutral-200 dark:bg-neutral-700"> {/* Adjusted aspect ratio */}
          {displayImageSrc ? (
            <img 
              src={displayImageSrc} 
              alt={`${headlinerName}`} 
              className="w-full h-full object-cover" 
              // Consider adding width/height from ImageKit params if known for CLS
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-500">
              <Music2 size={64} />
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white">
          <div className="text-xl sm:text-2xl font-bold">{dayOfWeekShort}, {monthDayTime}</div>
          <div className="text-sm sm:text-base">{showTimeDisplay}</div>
        </div>
        {concert.headliner.is_hometown_show && (
            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                LOCAL
            </div>
        )}
      </div>

      {/* Right Section: Details */}
      <div className="flex-grow p-4 md:p-5 lg:p-6 flex flex-col justify-between">
        <div> {/* Top part of details */}
        
        {/*
         {genreTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {genreTags.map((genre, index) => (
                <span key={index} className="px-2.5 py-1 text-[11px] sm:text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full font-medium">
                  {genre}
                </span>
              ))}
            </div>
          )}
              */}

          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-1">
            {headlinerName}
          </h2>
          {openersDisplay && ( <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{openersDisplay}</p> )}
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">{artistHometownDisplay}</p>

          <div className="mb-3">
            <div className="flex items-start text-neutral-700 dark:text-neutral-300">
              <MapPin size={18} className="mr-2 mt-0.5 flex-shrink-0 opacity-70" />
              <div>
                <p className="font-semibold">{venueName}</p>
                <p className="text-sm">{neighborhoodName}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{venueLocationDisplay}</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-h-24 overflow-y-auto mb-4 styled-scrollbar">
            {shortBio}
          </p>
        </div>

        <div> {/* Bottom part of details - Meta & Actions */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4 border-t border-neutral-200 dark:border-neutral-700 pt-4">
            {doorsTimeDisplay && ( <div className="flex items-center text-neutral-600 dark:text-neutral-300"><Clock size={14} className="mr-1.5 opacity-70" /> Doors: {doorsTimeDisplay}</div> )}
            <div className="flex items-center text-neutral-600 dark:text-neutral-300"><Clock size={14} className="mr-1.5 opacity-70" /> Show: {showTimeDisplay}</div>
            <div className="flex items-center text-neutral-600 dark:text-neutral-300"><Users size={14} className="mr-1.5 opacity-70" /> {ageRestrictionDisplay}</div>
            <div className="flex items-center text-neutral-600 dark:text-neutral-300 font-medium"><DollarSign size={14} className="mr-1.5 opacity-70" /> {priceDisplay}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {headlinerVideoId1 && onPlayRequest && (
                <button 
                    onClick={() => onPlayRequest(headlinerVideoId1)}
                    className="flex-1 w-full sm:w-auto px-4 py-2.5 bg-neutral-700 hover:bg-neutral-600 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <PlayCircle size={18}/> Play Preview
                </button>
            )}
            <a
              href={concert.event_info_url || '#'}
              target={concert.event_info_url ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`flex-1 w-full sm:w-auto px-4 py-2.5 text-center border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${!concert.event_info_url ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Info size={18}/> More Info
            </a>
            {concert.ticket_url && (
              <a
                href={concert.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-center text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <TicketIcon size={18}/> Get Tickets
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcertCard;