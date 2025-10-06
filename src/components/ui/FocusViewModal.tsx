// src/components/ui/FocusViewModal.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ApiConcert, ApiConcertHeadliner, OpenerMedia } from '@/types';
import { X, PlayCircle, Music, MapPin, Users, Ticket, Share2, CalendarPlus, DollarSign } from 'lucide-react';
import { loadYouTubeAPI } from '@/utils/youtubeAPILoader';

interface FocusViewModalProps {
  show: ApiConcert;
  onClose: () => void;
}

type YTPlayer = {
  playVideo: () => void;
  destroy: () => void;
};

const generateCalendarLink = (show: ApiConcert) => {
    if (!show.show_date) return '#'; 
    const artist = show.headliner;
    const title = encodeURIComponent(`${artist.name} at ${show.venue.name}`);
    const [year, month, day] = show.show_date.split('-').map(Number);
    const [hour = 20, minute = 0] = show.show_time ? show.show_time.split(':').map(Number) : [];
    const startTime = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
    const formatDateForGoogle = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDateForGoogle(startTime)}/${formatDateForGoogle(endTime)}&details=${encodeURIComponent(`Get more info and tickets at: ${window.location.origin}/shows/${show.show_id}`)}&location=${encodeURIComponent(show.venue.name + ', ' + show.venue.city)}`;
};

const handleShare = async (show: ApiConcert) => {
    if (!show.show_date) return;
    const artist = show.headliner;
    const shareData = {
        title: `${artist.name} at ${show.venue.name}`,
        text: `Check out ${artist.name} at ${show.venue.name} on ${new Date(show.show_date + 'T00:00:00').toLocaleDateString()}!`,
        url: `${window.location.origin}/shows/${show.show_id}`
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareData.url);
            alert('Show link copied to clipboard!');
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
};

const FocusViewModal: React.FC<FocusViewModalProps> = ({ show, onClose }) => {
  const allArtists = [
      show.headliner,
      ...(show.openers_media || [])
  ];

  const [activeArtist, setActiveArtist] = useState<ApiConcertHeadliner | OpenerMedia>(show.headliner);
  
  // --- STATE 4 vid management ---
  const [player, setPlayer] = useState<YTPlayer | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // state control which video is active
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  

  const playerContainerId = `yt-player-modal-${show.show_id}-${'artist_id' in activeArtist ? activeArtist.artist_id : activeArtist.name}`;
  
  // effect runs when the user switches between Headliner/Opener tabs
  useEffect(() => {
    setActiveArtist(show.headliner);
    // if whole modal changes reset to the headliner's first video
    setCurrentVideoId(show.headliner?.youtube_video_id_1 || null);
  }, [show]);

  // effect will only when the user clicks a tab (Headliner/Opener)
  useEffect(() => {
      // When  active artist changes, make first available video as the default
      const initialVideoId = 
          ('youtube_video_id_1' in activeArtist && activeArtist.youtube_video_id_1) ||
          ('youtube_video_id_2' in activeArtist && activeArtist.youtube_video_id_2) ||
          ('youtube_video_id_3' in activeArtist && activeArtist.youtube_video_id_3) ||
          ('youtube_interview_id' in activeArtist && activeArtist.youtube_interview_id) ||
          null;
      setCurrentVideoId(initialVideoId);
  }, [activeArtist]);


  //  effect is now ONLY responsible for   player lifecycle
  useEffect(() => {
    
    if (player) player.destroy();
    setPlayer(null);
    setIsPlayerReady(false);
    setIsPlaying(false);

    // If no video ID to play .. do nada
    if (!currentVideoId) return;

    const createPlayer = () => {
      if (document.getElementById(playerContainerId)) {
        // @ts-ignore
        const newPlayer = new window.YT.Player(playerContainerId, {
          videoId: currentVideoId,
          attributes: { className: 'yt-iframe' },
          playerVars: { autoplay: 0, controls: 1, modestbranding: 1, rel: 0 },
          events: { 'onReady': () => { setPlayer(newPlayer); setIsPlayerReady(true); } },
        });
      }
    };
    loadYouTubeAPI(createPlayer);
  }, [currentVideoId, playerContainerId]); //  re-runs whenever the video ID changes

  const handlePlay = () => {
    if (player && isPlayerReady) {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const currentArtistImage = 'artist_display_image_url' in activeArtist && activeArtist.artist_display_image_url
  ? activeArtist.artist_display_image_url 
  : ('artist_thumbnail_url' in activeArtist && activeArtist.artist_thumbnail_url) 
  ? activeArtist.artist_thumbnail_url
  : undefined;

  const showDateFormatted = show.show_date ? new Date(show.show_date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }) : (show as any).day_playing || '';
  
  const priceString = show.price_info?.min ? `$${show.price_info.min}` : null;
  const ageString = show.age_restriction && show.age_restriction !== 'Info TBA' ? show.age_restriction : null;

  // ---  PREPARE VIDEO BUTTONS ---
  const availableVideos = [];
  if ('youtube_video_id_1' in activeArtist && activeArtist.youtube_video_id_1) availableVideos.push({ id: activeArtist.youtube_video_id_1, label: 'OFFICIAL' });
  if ('youtube_video_id_2' in activeArtist && activeArtist.youtube_video_id_2) availableVideos.push({ id: activeArtist.youtube_video_id_2, label: 'LIVE' });
  if ('youtube_video_id_3' in activeArtist && activeArtist.youtube_video_id_3) availableVideos.push({ id: activeArtist.youtube_video_id_3, label: 'Live' });
  if ('youtube_interview_id' in activeArtist && activeArtist.youtube_interview_id) availableVideos.push({ id: activeArtist.youtube_interview_id, label: 'Interview' });
 

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white">
      <header className="flex-shrink-0 flex items-start justify-between gap-4 p-4 border-b border-neutral-800">
        <div className="min-w-0">
          <h2 className="text-xl font-bold leading-tight">{show.headliner.name}</h2>
          <p className="text-base text-neutral-400 leading-tight">{show.venue.name}</p>
          <p className="text-sm text-indigo-400 mt-1">{showDateFormatted}</p>
          {(priceString || ageString) && (
            <div className="flex items-center gap-4 mt-2 text-sm font-semibold text-neutral-300">
                {priceString && (
                    <span className="flex items-center gap-1.5"><DollarSign size={14}/> {priceString}</span>
                )}
                {ageString && (
                     <span className="flex items-center gap-1.5"><Users size={14}/> {ageString}</span>
                )}
            </div>
          )}
        </div>
        <button onClick={onClose} className="p-2 -m-2 rounded-full hover:bg-neutral-800 flex-shrink-0" aria-label="Close">
          <X size={24} />
        </button>
      </header>
      
      <div className="flex-grow overflow-y-auto">
        <div className="flex-shrink-0 relative w-full aspect-video bg-black">
          <div id={playerContainerId} className="w-full h-full" />
          {!isPlaying && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              {currentArtistImage ? (
                <img src={currentArtistImage} alt={activeArtist.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500"><Music size={48} /></div>
              )}
              {currentVideoId && isPlayerReady && (
                <>
                  <div className="absolute inset-0 bg-black/40"></div>
                  <button onClick={handlePlay} className="absolute z-20 text-white/80 hover:text-white hover:scale-110 transition-transform" aria-label={`Play video for ${activeArtist.name}`}>
                    <PlayCircle size={80} strokeWidth={1} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        
        {allArtists.length > 1 && (
          <nav className="flex-shrink-0 flex border-b border-neutral-800 bg-neutral-900 overflow-x-auto no-scrollbar">
            {allArtists.map((artist) => (
              <button
                key={'artist_id' in artist ? artist.artist_id : artist.name}
                onClick={() => setActiveArtist(artist)}
                className={`flex-1 px-4 py-3 text-sm font-medium text-center transition-colors whitespace-nowrap ${
                  ('artist_id' in activeArtist && 'artist_id' in artist && activeArtist.artist_id === artist.artist_id) || activeArtist.name === artist.name
                    ? 'border-b-2 border-indigo-500 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {artist.name}
              </button>
            ))}
          </nav>
        )}

        {/* --- NEW: Video Selector Buttons for Mobile --- */}
        {availableVideos.length > 1 && (
          <div className="p-3 border-b border-neutral-800 bg-neutral-900">
            <div className="flex items-center gap-2">
              {availableVideos.map(video => (
                <button
                  key={video.id}
                  onClick={() => setCurrentVideoId(video.id)}
                  className={`flex-1 px-2 py-2 text-xs font-semibold rounded-md transition-colors text-center ${
                    currentVideoId === video.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  {video.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* --- END: Video Selector Buttons --- */}

        <div className="p-4 space-y-4">
          <div className="prose prose-invert text-neutral-300">
            <p>{('short_bio' in activeArtist && activeArtist.short_bio) || "No biography available."}</p>
          </div>
          <div className="border-t border-neutral-800 pt-4 space-y-3 text-sm">
            {'hometown' in activeArtist && activeArtist.hometown && (
              <div className="flex items-start gap-3">
                <Music size={20} className="text-neutral-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">From</h4>
                  <p className="text-neutral-300">{activeArtist.hometown}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="flex-shrink-0 p-3 bg-neutral-950 border-t border-neutral-800">
        <div className="grid grid-cols-3 gap-2 text-center">
            {show.show_date ? (
              <>
                <a href={generateCalendarLink(show)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-neutral-800">
                    <CalendarPlus size={20} />
                    <span className="text-xs mt-1">Add to Cal</span>
                </a>
                <button onClick={() => handleShare(show)} className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-neutral-800">
                    <Share2 size={20} />
                    <span className="text-xs mt-1">Share</span>
                </button>
              </>
            ) : (
              <>
                <div></div>
                <div></div>
              </>
            )}

            {show.ticket_url ? (
                         <a href={show.ticket_url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600">
                         <Ticket size={20} />
                         <span className="text-xs font-semibold mt-1">Get Tickets</span>
                     </a>
            ) : (
                <div></div>
            )}
        </div>
      </footer>
    </div>
  );
};

export default FocusViewModal;