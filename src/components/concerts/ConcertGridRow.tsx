// src/components/concerts/ConcertGridRow.tsx
import React from 'react';
import { ApiConcert } from '@/types';
import { ChevronDown, ChevronUp, PlayCircle, Ticket, MapPin, Music } from 'lucide-react'; // Ensure Music is imported

// Helper functions (as you have them)
const formatDate = (dateString: string): { dayOfWeek: string, monthDay: string } => {
  if (!dateString) return { dayOfWeek: 'TBA', monthDay: '' }; // Added fallback for invalid dateString
  const date = new Date(`${dateString}T00:00:00`);
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { dayOfWeek, monthDay };
};

const formatTime = (timeString: string | null): string => {
  if (!timeString) return 'TBA'; // Changed from '' to 'TBA' for clarity
  const parts = timeString.split(':');
  if (parts.length < 2 || isNaN(parseInt(parts[0])) || isNaN(parseInt(parts[1]))) {
    return 'Invalid Time'; // Handle malformed time string
  }
  const [hours, minutes] = parts;
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

interface ConcertGridRowProps {
  concert: ApiConcert;
  onPlayRequest: (videoId: string) => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
  isZebraStriped?: boolean; // For alternating row colors (if wrapper handles bg, this might not be needed here)
}

const ConcertGridRow: React.FC<ConcertGridRowProps> = ({ concert, onPlayRequest, onToggleExpand, isExpanded, isZebraStriped }) => {
  // Guard clause
  if (!concert) {
    console.error("ConcertGridRow: Received undefined or null concert prop.");
    return <div className="p-4 text-red-500 border-b border-red-300">Error: Invalid concert data passed to row.</div>;
  }
  
  // ===== START DEBUG LOGS =====
  console.log(`--------------------------------`);
  console.log(`ConcertGridRow for show_id: ${concert.show_id}, Artist: ${concert.headliner?.name}`);
  console.log(`Raw concert.headliner object:`, concert.headliner); 
  if (concert.headliner) {
    console.log(`concert.headliner.artist_thumbnail_url (ImageKit):`, concert.headliner.artist_thumbnail_url);
    console.log(`concert.headliner.image_url (Old raw/combined):`, concert.headliner.image_url); // Log the old one too
  } else {
    console.log(`concert.headliner is null or undefined for show_id: ${concert.show_id}`);
  }
  // ===== END DEBUG LOGS =====

  // Defensive access for all potentially nullable parent objects
  const headlinerName = concert.headliner?.name || 'Unknown Artist';
  const venueName = concert.venue?.name || 'Unknown Venue';
  const priceMin = concert.price_info?.min;
  const currency = concert.price_info?.currency || 'USD';
  // Assuming max_price_from_api would be part of price_info if it exists
  const priceMax = concert.price_info?.max_price_from_api; // Replace with actual field if you add it

  const { dayOfWeek, monthDay } = formatDate(concert.show_date);
  const displayTime = formatTime(concert.show_time);

  // ** USE THE IMAGEKIT THUMBNAIL URL FROM THE HEADLINER OBJECT **
  const imageToUse = concert.headliner?.artist_thumbnail_url; // THIS IS THE KEY CHANGE

  const openersString = concert.headliner?.openers_string || "";
  const isHometown = concert.headliner?.is_hometown_show || false;
  const youtubeVideoId1 = concert.headliner?.youtube_video_id_1;

  const priceDisplay = priceMin ? `$${priceMin}${priceMax && priceMin !== priceMax ? `-$${priceMax}` : ''}${currency !== 'USD' ? ` ${currency}` : ''}` : 'N/A';


  return (
    <div 
      className={`flex items-center gap-3 sm:gap-4 px-3 py-3 sm:px-4 sm:py-4 text-sm relative
                  ${isZebraStriped ? 'bg-neutral-50 dark:bg-neutral-850' : 'bg-white dark:bg-neutral-900'}
                  ${concert.is_featured ? 'border-l-4 border-indigo-500' : ''}
                  ${isExpanded ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}
                  transition-colors duration-150`}
    >
      {isHometown && (
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 transform -rotate-90 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-md flex items-center z-10">
          <MapPin size={10} className="mr-0.5" />
          LOCAL
        </div>
      )}

      <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-neutral-200 dark:bg-neutral-700 rounded overflow-hidden">
        {imageToUse ? ( // Check if imageToUse (ImageKit URL) is truthy
          <img 
            src={imageToUse} 
            alt={`${headlinerName}`} 
            className="w-full h-full object-cover" 
            width={64} // Match sm:w-16, adjust if w-12/w-20 is primary
            height={64}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-500">
            <Music size={24} /> {/* Fallback Icon */}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 w-20 sm:w-24 text-center sm:text-left">
        <div className="font-semibold text-neutral-800 dark:text-neutral-200">{dayOfWeek} {monthDay}</div>
        <div className="text-neutral-600 dark:text-neutral-400">{displayTime}</div>
      </div>

      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white truncate">
          {headlinerName}
        </h3>
        {openersString && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {openersString}
          </p>
        )}
        <p className="text-neutral-700 dark:text-neutral-300 truncate">
          {venueName}
        </p>
      </div>
      
      <div className="flex-shrink-0 w-20 sm:w-24 text-right font-medium text-neutral-800 dark:text-neutral-200">
        {priceDisplay}
      </div>

      <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
        {youtubeVideoId1 && (
          <button
            onClick={() => onPlayRequest(youtubeVideoId1)}
            title="Play Video Preview"
            className="p-1.5 sm:p-2 text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <PlayCircle size={20} />
            <span className="sr-only">Play Video</span>
          </button>
        )}

        {concert.ticket_url && (
          <a
            href={concert.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            title="Get Tickets"
            className="p-1.5 sm:p-2 text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1 text-xs sm:text-sm transition-colors"
          >
            <Ticket size={16} />
            <span className="hidden sm:inline">Tickets</span>
          </a>
        )}

        <button
          onClick={onToggleExpand}
          title={isExpanded ? "Collapse details" : "Expand details"}
          className="p-1.5 sm:p-2 text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <span className="sr-only">{isExpanded ? "Collapse" : "Expand"}</span>
        </button>
      </div>
    </div>
  );
};

export default ConcertGridRow;