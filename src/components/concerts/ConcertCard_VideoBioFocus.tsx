// src/components/concerts/ConcertCard_VideoBioFocus.tsx
import React, { useState } from 'react';
import type { ApiConcert } from '@/types';
import { Dialog } from '@headlessui/react'; // Assuming you'll install this for lightbox
import { PlayCircle, X, MapPin as MapPinIcon, Info, Clock, Users, DollarSign, Palette } from 'lucide-react'; // Palette for genre

// Helper for formatting time (or import from a shared util)
const formatTimeLocal = (timeString: string | null): string => {
  if (!timeString) return 'TBA';
  const parts = timeString.split(':');
  if (parts.length < 2 || isNaN(parseInt(parts[0])) || isNaN(parseInt(parts[1]))) return 'Invalid';
  const date = new Date(); date.setHours(parseInt(parts[0], 10)); date.setMinutes(parseInt(parts[1], 10));
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

interface ConcertCardVideoBioFocusProps {
  concert: ApiConcert;
  onCollapseRequest?: () => void; // To allow collapsing from the card
}

const ConcertCard_VideoBioFocus: React.FC<ConcertCardVideoBioFocusProps> = ({ concert, onCollapseRequest }) => {
  const [videoOpen, setVideoOpen] = useState(false);

  const headliner = concert.headliner;
  const venue = concert.venue;

  if (!headliner || !venue) {
    return <div className="p-4 text-orange-500">Card Error: Missing data.</div>;
  }

  // Data for display (using placeholders for fields not yet in ApiConcert)
  const shortBio = headliner.short_bio || "No short bio available for this artist.";
  const venueFullAddress = venue.venue_full_address_from_api || "Full venue address TBA";
  const genreTags = headliner.genres_array || ["Genre 1", "Genre 2"]; // Placeholder genres
  const doorsTimeDisplay = concert.doors_time ? formatTimeLocal(concert.doors_time) : "TBA";
  const showTimeDisplay = concert.show_time ? formatTimeLocal(concert.show_time) : "TBA"; // Already in compact row, but can repeat
  const ageRestrictionDisplay = concert.age_restriction_text_from_api || "Age info TBA";
  const priceDisplay = concert.price_info?.min ? `$${concert.price_info.min}` : "Price TBA"; // Already in compact row

  const hasVideo = !!headliner.youtube_video_id_1;

  return (
    <>
      <div className="p-4 md:p-6 bg-neutral-50 dark:bg-neutral-850 rounded-b-md"> {/* Matches wrapper for extension feel */}
        
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Left Column: Video Player Trigger & Bio */}
          <div className="md:w-3/5 space-y-3">
            {hasVideo && (
              <button
                onClick={() => setVideoOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-base"
              >
                <PlayCircle size={20} />
                Watch Video Preview
              </button>
            )}
            {!hasVideo && (
                <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 font-semibold rounded-lg text-base">
                    No Video Preview Available
                </div>
            )}

            <div>
              <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">About {headliner.name}</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-h-32 overflow-y-auto styled-scrollbar pr-1">
                {shortBio}
              </p>
            </div>
          </div>

          {/* Right Column: Address, Genres, Other Meta */}
          <div className="md:w-2/5 space-y-3 text-sm">
            <div>
              <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center">
                <MapPinIcon size={16} className="mr-1.5 opacity-70" /> Venue Details
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400">{venue.name}</p> {/* Repeated for context */}
              <p className="text-neutral-500 dark:text-neutral-400">{venueFullAddress}</p>
            </div>

            {genreTags.length > 0 && (
              <div>
                <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center">
                    <Palette size={16} className="mr-1.5 opacity-70"/> Genres
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {genreTags.map((g, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 space-y-1">
                <div className="flex items-center"><Clock size={14} className="mr-1.5 opacity-60" /> Doors: {doorsTimeDisplay}</div>
                {/* Show time is already in compact row, could omit here or repeat */}
                {/* <div className="flex items-center"><Clock size={14} className="mr-1.5 opacity-60" /> Show: {showTimeDisplay}</div> */}
                <div className="flex items-center"><Users size={14} className="mr-1.5 opacity-60" /> {ageRestrictionDisplay}</div>
                {/* Price is already in compact row, could omit or repeat */}
                {/* <div className="flex items-center font-medium"><DollarSign size={14} className="mr-1.5 opacity-60" /> {priceDisplay}</div> */}
            </div>

            {concert.event_info_url && (
                <a
                    href={concert.event_info_url} target="_blank" rel="noopener noreferrer"
                    className="mt-2 w-full inline-flex items-center justify-center px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                    <Info size={16} className="mr-2"/> More Event Info
                </a>
            )}
          </div>
        </div>
      </div>

      {/* Video Lightbox (using Headless UI Dialog) */}
      <Dialog
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" onClick={() => setVideoOpen(false)} />
        <Dialog.Panel className="relative w-full max-w-2xl lg:max-w-3xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${headliner.youtube_video_id_1}?autoplay=1&modestbranding=1&rel=0`}
            title={headliner.name + " video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <button
            onClick={() => setVideoOpen(false)}
            className="absolute top-2 right-2 p-1.5 text-neutral-300 hover:text-white bg-black/40 hover:bg-black/70 rounded-full transition-colors z-10"
            aria-label="Close video player"
          >
            <X className="h-5 w-5" />
          </button>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default ConcertCard_VideoBioFocus;