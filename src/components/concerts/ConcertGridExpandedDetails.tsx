// src/components/concerts/ConcertGridExpandedDetails.tsx
import React from 'react';
import { ApiConcert, OpenerMedia } from '@/types';
import { PlayCircleIcon, Info, Ticket as TicketIcon, Users, Clock } from 'lucide-react'; // Use PlayCircleIcon for consistency if you like

// Helper function to format time (can be moved to a utils file)
const formatExpandedTime = (timeString: string | null): string => {
  if (!timeString) return 'TBA';
  try {
    const parts = timeString.split(':');
    if (parts.length < 2) return 'TBA';
    const date = new Date();
    // Assuming timeString is in HH:mm:ss format, adjust if it's just HH:mm
    date.setUTCHours(parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2] || "0", 10));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });
  } catch (e) { return 'TBA'; }
};

interface ConcertGridExpandedDetailsProps {
  concert: ApiConcert;
  onPlayRequest: (videoId: string | null) => void;
}

const ConcertGridExpandedDetails: React.FC<ConcertGridExpandedDetailsProps> = ({ concert, onPlayRequest }) => {
  if (!concert || !concert.headliner || !concert.venue) {
    // This should ideally not happen if ConcertGridRowWrapper vets the concert prop
    return <div className="p-4 text-orange-500">Error: Missing data for expanded details.</div>;
  }

  const { headliner, venue, openers_media, age_restriction, doors_time, show_time, event_info_url, ticket_url } = concert;
  const headlinerBio = headliner.short_bio || "No bio available for this artist.";

  // Text color variables for consistency with ConcertGridRow (or define globally)
  const baseTextColor = "text-neutral-300"; // Adjusted for dark theme details
  const secondaryTextColor = "text-neutral-400";
  const prominentTextColor = "text-neutral-100"; // Was text-white

  return (
    <div className="space-y-4 text-sm"> {/* Main container for expanded details */}
      
      {/* Headliner Bio */}
      <div>
        <h4 className={`font-semibold mb-1 ${prominentTextColor}`}>About {headliner.name}</h4>
        <p className={`${baseTextColor} leading-relaxed text-xs sm:text-sm max-h-32 sm:max-h-40 overflow-y-auto styled-scrollbar pr-1`}>
          {/* Using styled-scrollbar for a custom scrollbar if text overflows, requires CSS in globals.css */}
          {headlinerBio}
        </p>
      </div>

      {/* "More Music" Section */}
      {(headliner.youtube_video_id_2 || (openers_media && openers_media.some(op => op.youtube_id_1))) && (
        <div>
          <h4 className={`font-semibold mb-2 ${prominentTextColor}`}>More Music</h4>
          <div className="space-y-1.5 text-xs sm:text-sm">
            {headliner.youtube_video_id_2 && (
              <button
                onClick={() => onPlayRequest(headliner.youtube_video_id_2)}
                className={`flex items-center gap-1.5 ${secondaryTextColor} hover:text-indigo-400 transition-colors w-full text-left`}
              >
                <PlayCircleIcon size={16} strokeWidth={1.5} />
                <span>{headliner.name} - Video 2</span> {/* Or a more descriptive title if you have one */}
              </button>
            )}
            {openers_media && openers_media.map((opener: OpenerMedia, index: number) => (
              opener.youtube_id_1 ? (
                <button
                  key={`opener-vid-${index}-${opener.name}`}
                  onClick={() => onPlayRequest(opener.youtube_id_1)}
                  className={`flex items-center gap-1.5 ${secondaryTextColor} hover:text-indigo-400 transition-colors w-full text-left`}
                >
                  <PlayCircleIcon size={16} strokeWidth={1.5} />
                  <span>{opener.name}</span>
                </button>
              ) : null
            ))}
          </div>
        </div>
      )}

      {/* Event Details Block (Doors, Show, Age) */}
      {(doors_time || show_time || age_restriction) && (
        <div className="pt-3 border-t border-neutral-700 space-y-1 text-xs sm:text-sm">
          <h4 className={`font-semibold mb-1 ${prominentTextColor}`}>Event Details</h4>
          {doors_time && (
            <div className={`flex items-center ${secondaryTextColor}`}>
              <Clock size={14} className="mr-1.5 opacity-70" />
              Doors: {formatExpandedTime(doors_time)}
            </div>
          )}
          {show_time && ( // Show time might be redundant if clearly in row above, but can be here for completeness
            <div className={`flex items-center ${secondaryTextColor}`}>
              <Clock size={14} className="mr-1.5 opacity-70" />
              Show: {formatExpandedTime(show_time)}
            </div>
          )}
          {age_restriction && (
            <div className={`flex items-center ${secondaryTextColor}`}>
              <Users size={14} className="mr-1.5 opacity-70" />
              Age: {age_restriction}
            </div>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="pt-3 border-t border-neutral-700 flex flex-col sm:flex-row gap-2 sm:gap-3">
        {event_info_url && (
           <a
            href={event_info_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 w-full sm:w-auto px-3 py-2 text-center border border-neutral-600 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-medium rounded-md flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"
          >
            <Info size={16}/> More Info
          </a>
        )}
        {ticket_url && ( // Assuming Ticket button is still desired here
          <a
            href={ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 w-full sm:w-auto px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-center text-xs sm:text-sm font-semibold rounded-md flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"
          >
            <TicketIcon size={16}/> Get Tickets
          </a>
        )}
      </div>
    </div>
  );
};

export default ConcertGridExpandedDetails;