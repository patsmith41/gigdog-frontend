// src/components/concerts/ConcertCard.tsx
'use client';

import React, { useState } from 'react';
import { ApiConcert, ApiConcertHeadliner, OpenerMedia, FestivalArtist, NowPlayingInfo } from '@/types';
import { 
  MapPin, Info, Ticket as TicketIcon, PlayCircleIcon, Music2, Minus,
  Share2, CalendarPlus, DollarSign, Users, Music, Instagram
} from 'lucide-react';
import Link from 'next/link';
import { trackClick } from '@/utils/analytics';
import { format as formatDateFns } from 'date-fns';
import Image from 'next/image';

// --- (HELPER FUNCTIONS) ---
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
  if (!concert.show_date) return '#';
  const title = encodeURIComponent(`${concert.headliner.name} at ${concert.venue.name}`);
  const [year, month, day] = concert.show_date.split('-').map(Number);
  const [hour = 20, minute = 0] = concert.show_time ? concert.show_time.split(':').map(Number) : [];
  const startTime = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
  const formatDateForGoogle = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDateForGoogle(startTime)}/${formatDateForGoogle(endTime)}&details=${encodeURIComponent(`Get more info and tickets at: ${window.location.origin}/shows/${concert.show_id}`)}&location=${encodeURIComponent(concert.venue.name + ', ' + concert.venue.city)}`;
};
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.85-.38-6.75-1.77-1.26-.91-2.2-2.14-2.73-3.56s-.76-2.99-.76-4.5v-4.04c.57.02 1.14-.02 1.71-.02.02 4.73.01 9.46-.02 14.19.03 2.02 1.88 3.64 3.89 3.66 2.03.02 3.8-.87 4.54-2.82.09-.24.13-.5.17-.76.01-4.26.01-8.52.01-12.78-.01-.6-.11-1.19-.24-1.77-1.11-5.11-5.71-8.59-10.95-8.59-.01.02-.02.01-.02.01H.01V4.23c1.38.01 2.75-.04 4.13.02 1.13.05 2.25.32 3.3.76.6.26 1.18.59 1.72.98.09-2.2.03-4.4-.04-6.6z" />
    </svg>
);
const ArtistSocials = ({ artist, concert }: { artist: ApiConcertHeadliner | OpenerMedia, concert: ApiConcert | FestivalArtist }) => {
    const artistAsHeadliner = artist as ApiConcertHeadliner;
    const socialLinkClass = "flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors";

    return (
        <div className="p-3 sm:p-4 text-sm space-y-3 border-t border-neutral-700 md:border-t-0 flex-grow flex flex-col justify-center">
            {artistAsHeadliner.spotify_url && (
                <a href={artistAsHeadliner.spotify_url} target="_blank" rel="noopener noreferrer" className={socialLinkClass} onClick={() => trackClick({ linkType: 'artist_spotify', targetUrl: artistAsHeadliner.spotify_url!, sourceComponent: 'ConcertCard', showId: concert.show_id, artistId: artistAsHeadliner.artist_id })}>
                    <Music size={16} className="text-green-500" />
                    <span>Listen on Spotify</span>
                </a>
            )}
            {artistAsHeadliner.instagram_url && (
                <a href={artistAsHeadliner.instagram_url} target="_blank" rel="noopener noreferrer" className={socialLinkClass} onClick={() => trackClick({ linkType: 'artist_instagram', targetUrl: artistAsHeadliner.instagram_url!, sourceComponent: 'ConcertCard', showId: concert.show_id, artistId: artistAsHeadliner.artist_id })}>
                    <Instagram size={16} className="text-pink-500" />
                    <span>Follow on Instagram</span>
                </a>
            )}
            {artistAsHeadliner.tiktok_url && (
                 <a href={artistAsHeadliner.tiktok_url} target="_blank" rel="noopener noreferrer" className={socialLinkClass}>
                    <TikTokIcon className="w-4 h-4 text-cyan-400" />
                    <span>Watch on TikTok</span>
                </a>
            )}
        </div>
    );
};
// --- (End of HELPER FUNCTIONS) ---


interface ConcertCardProps {
  concert: ApiConcert | FestivalArtist;
  onPlayRequest?: (videoId: string | null, artistInfo?: NowPlayingInfo) => void;
  isIndividuallyToggled?: boolean;
  onCollapse?: () => void;
  activeVideoId?: string | null;
  isDesktop: boolean;
  context?: 'homepage' | 'festival';
}

const ConcertCard: React.FC<ConcertCardProps> = ({ 
  concert, onPlayRequest, isIndividuallyToggled, onCollapse,
  activeVideoId = null, isDesktop, context = 'homepage'
}) => {
  if (!concert || !concert.headliner || !concert.venue) {
    return <div className="p-4 text-red-500 bg-neutral-800 rounded-lg">Error: Missing critical concert data.</div>;
  }

  const allArtists: (ApiConcertHeadliner | OpenerMedia)[] = [concert.headliner, ...(concert.openers_media || [])];
  const [activeArtist, setActiveArtist] = useState<ApiConcertHeadliner | OpenerMedia>(allArtists[0]);
  
  const displayImageSrc = 'artist_display_image_url' in activeArtist ? activeArtist.artist_display_image_url : null;
  const artistName = activeArtist.name || "Unknown Artist";
  const shortBio = 'short_bio' in activeArtist ? activeArtist.short_bio : "Information not available for this artist.";
  const currentArtistVideoId = 'youtube_video_id_1' in activeArtist ? activeArtist.youtube_video_id_1 : null;

  const handlePlay = (videoId: string | null) => {
    if (videoId && onPlayRequest) {
        
        // pass the entire headliner object so the parent has all video IDs
        onPlayRequest(videoId, { 
            artistName: artistName, 
            showDate: concert.show_date, 
            venueName: concert.venue.name, 
            showId: concert.show_id, 
            ticketUrl: concert.ticket_url,
            headliner: concert.headliner // Pass the full headliner object
        });
        
    }
  };

  const handleShare = async () => {};

  const formatFestivalTimeRange = (start?: string | null, end?: string | null) => {
    const format = (timeStr: string) => formatDateFns(new Date(timeStr), 'h:mm a');
    try {
      if (start && end) return `${format(start)} - ${format(end)}`;
      if (start) return format(start);
    } catch { return 'Time TBA'; }
    return 'Time TBA';
  };

  return (
    <div className="bg-neutral-800 rounded-xl shadow-2xl overflow-hidden border border-neutral-700 flex flex-col md:flex-row relative">
      {isIndividuallyToggled && onCollapse && (
        <button onClick={onCollapse} title="Show compact view" className="absolute top-3 right-3 z-30 p-2 text-white hover:text-pink-400 hover:bg-pink-400/10 rounded-full transition-all duration-200 hover:scale-110">
          <Minus size={18} strokeWidth={2.5} />
        </button>
      )}

      <div className="md:w-[40%] lg:w-[45%] flex-shrink-0 flex flex-col bg-neutral-900">
        <div className="relative w-full">
        <div className="aspect-[4/3] bg-neutral-700 w-full relative">
          {displayImageSrc ? (
            <Image 
              src={displayImageSrc} 
              alt={`${artistName} main image`} 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500"><Music2 size={48} /></div>
          )}
        </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white z-10">
            {context === 'festival' ? (
                <>
                    <div className="font-semibold text-lg sm:text-xl">
                        {(concert as FestivalArtist).day_playing}
                    </div>
                    <div className="text-xs sm:text-sm">
                        {formatFestivalTimeRange((concert as FestivalArtist).start_time, (concert as FestivalArtist).end_time)}
                    </div>
                </>
            ) : (
                <>
                    <div className="font-semibold text-lg sm:text-xl">
                        {formatDateForCardOverlay(concert.show_date).dayShort}, {formatDateForCardOverlay(concert.show_date).monthDay}
                    </div>
                    <div className="text-xs sm:text-sm">
                        {formatTimeForCardOverlay(concert.show_time)}
                    </div>
                </>
            )}
          </div>
        </div>
        {context === 'festival' ? (
            <ArtistSocials artist={activeArtist} concert={concert} />
        ) : (
            <div className="p-3 sm:p-4 text-sm space-y-3 border-t border-neutral-700 md:border-t-0 flex-grow">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start">
                  <MapPin size={15} className="mr-2 mt-1 text-neutral-400 flex-shrink-0" />
                  <div className="min-w-0">
                  <Link href={`/venues/${concert.venue.venue_id}`} className="font-medium text-neutral-300 hover:underline leading-tight">
                      {concert.venue.name}
                    </Link>
                    {concert.venue.neighborhood_name && <div className="text-xs text-neutral-400 leading-tight truncate">{concert.venue.neighborhood_name}</div>}
                  </div>
                </div>
                <div className="flex items-center flex-shrink-0">
                  <DollarSign size={15} className="mr-1.5 text-neutral-400" />
                  <span className="text-neutral-300 font-medium">
                    {concert.price_info?.min ? (
                      `$${concert.price_info.min}`
                    ) : concert.ticket_url ? (
                      <a
                        href={concert.ticket_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick({
                            linkType: 'ticket_url',
                            targetUrl: concert.ticket_url || '#',
                            sourceComponent: 'ConcertCard_CheckPrice',
                            showId: concert.show_id,
                            artistId: concert.headliner.artist_id,
                            venueId: concert.venue.venue_id
                        })}
                        className="text-indigo-400 hover:underline"
                      >
                        Check Price
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </span>
                </div>
              </div>
              {concert.age_restriction && concert.age_restriction !== "Info TBA" && (
                <div className="flex items-center"><Users size={15} className="mr-2 text-neutral-400" /> <span className="text-neutral-300">Age: {concert.age_restriction}</span></div>
              )}
            </div>
        )}
      </div>

      <div className="flex-grow p-3 sm:p-4 flex flex-col md:border-l border-neutral-700">
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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight" title={artistName}>{artistName}</h2>
          {currentArtistVideoId && onPlayRequest && (
            <button onClick={() => handlePlay(currentArtistVideoId)} title={`Play preview for ${artistName}`} className="p-0.5 text-neutral-400 hover:text-indigo-400 transition-colors flex-shrink-0">
              <PlayCircleIcon size={22} strokeWidth={1.5} />
            </button>
          )}
        </div>
        <p className={`text-sm text-neutral-300 leading-relaxed max-h-36 sm:max-h-40 md:max-h-48 lg:max-h-52 xl:max-h-60 overflow-y-auto styled-scrollbar mb-3 pr-1 flex-grow`}>
          {shortBio}
        </p>

        <div className={`grid ${context !== 'festival' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1'} gap-2 mt-auto pt-3`}>
          
          {context !== 'festival' && (
            <a 
              href={generateCalendarLink(concert as ApiConcert)} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackClick({
                linkType: 'add_to_calendar',
                targetUrl: 'google_calendar',
                sourceComponent: 'ConcertCard',
                showId: concert.show_id,
                artistId: concert.headliner.artist_id,
                venueId: concert.venue.venue_id
              })}
              className="col-span-1 px-3 py-2.5 text-center border border-neutral-700 hover:bg-neutral-700 text-neutral-300 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors">
              <CalendarPlus size={16}/> Add to Cal
            </a>
          )}
          
          {context !== 'festival' && (
            <button 
              onClick={() => {
                handleShare();
                trackClick({
                  linkType: 'share_show',
                  targetUrl: 'native_share_dialog',
                  sourceComponent: 'ConcertCard',
                  showId: concert.show_id,
                  artistId: concert.headliner.artist_id,
                  venueId: concert.venue.venue_id
                });
              }} 
              className="col-span-1 px-3 py-2.5 text-center border border-neutral-700 hover:bg-neutral-700 text-neutral-300 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors">
              <Share2 size={16}/> Share
            </button>
          )}
          
          {context !== 'festival' && (
            <Link 
              href={`/shows/${concert.show_id}`}
              onClick={() => trackClick({
                linkType: 'show_info_page',
                targetUrl: `/shows/${concert.show_id}`,
                sourceComponent: 'ConcertCard',
                showId: concert.show_id,
                artistId: concert.headliner.artist_id,
                venueId: concert.venue.venue_id
              })}
              className="col-span-1 px-3 py-2.5 bg-blue-600 text-white hover:bg-blue-700 text-center text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors">
              <Info size={16}/> Show Info
            </Link>
          )}
          
          {concert.ticket_url && (
            <a 
              href={concert.ticket_url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackClick({
                linkType: 'ticket_url',
                targetUrl: concert.ticket_url || '#',
                sourceComponent: 'ConcertCard',
                showId: concert.show_id,
                artistId: concert.headliner.artist_id,
                venueId: concert.venue.venue_id
              })}
              className="col-span-1 px-3 py-2.5 bg-pink-500 text-white hover:bg-pink-600 text-center text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors">
              <TicketIcon size={16}/> Tickets
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConcertCard;