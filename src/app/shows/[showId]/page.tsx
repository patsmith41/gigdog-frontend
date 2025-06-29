'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Ticket, MapPin, Globe } from 'lucide-react';
import { ArtistDetailCard } from '@/components/shows/ArtistDetailCard';

// The full data structure interface
interface ShowDetailData {
  show_id: string; show_date: string; show_time: string | null; doors_time: string | null;
  age_restriction: string | null; ticket_url: string | null; price_info: { min: number | null };
  venue: { name: string; address: string | null; city: string; state: string; website: string | null; google_place_id: string | null;  latitude: number | null;      // <-- ADD THIS LINE
  longitude: number | null; };
  artists: Array<{
    artist_id: string; name: string; image_url: string | null; is_hometown_show: boolean;
    hometown: string | null; is_headliner: boolean; long_bio: string | null; 
    youtube_video_id_1: string | null; youtube_video_id_2: string | null;
    spotify_url: string | null;
  }>;
}

// Helper functions
const formatDateForShow = (dateString: string): string => {
  if (!dateString) return 'TBA';
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTimeForShow = (timeString: string | null): string => {
  if (!timeString) return '';
  const date = new Date();
  const parts = timeString.split(':');
  date.setHours(parseInt(parts[0], 10)); date.setMinutes(parseInt(parts[1], 10));
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export default function ShowDetailPage() {
  const params = useParams();
  let showId: string | undefined;
  if (Array.isArray(params.showId)) { showId = params.showId[0]; } 
  else if (typeof params.showId === 'string') { showId = params.showId; }

  const [showData, setShowData] = useState<ShowDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const playersRef = useRef<any[]>([]);
  const youtubeApiLoaded = useRef(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // useEffect for YouTube API loading
  useEffect(() => {
    if (window.YT && window.YT.Player) { youtubeApiLoaded.current = true; return; }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onload = () => {
        (window as any).onYouTubeIframeAPIReady = () => { youtubeApiLoaded.current = true; };
        if (window.YT) (window as any).onYouTubeIframeAPIReady();
      };
      document.head.appendChild(script);
    }
  }, []);

  // useEffect for data fetching
  useEffect(() => {
    const fetchShowData = async () => {
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      if (!showId) { setLoading(true); return; }
      if (!uuidRegex.test(showId)) {
        setError("Invalid Show ID format.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/shows/${showId}`);
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || `Server error: ${response.status}`);
        }
        const data = await response.json();
        setShowData(data);
      } catch (err: any) {
        setError(err.message);
      } 
      finally {
        setLoading(false);
      }
    };
    fetchShowData();
  }, [API_BASE_URL, showId]);

  // useEffect for YouTube player initialization
  useEffect(() => {
    if (!showData || !youtubeApiLoaded.current || !window.YT || !window.YT.Player) return;
    
    playersRef.current.forEach(p => { if (p && typeof p.destroy === 'function') p.destroy(); });
    playersRef.current = [];

    showData.artists.forEach(artist => {
      const videoIds = [artist.youtube_video_id_1, artist.youtube_video_id_2].filter(Boolean);
      videoIds.forEach(videoId => {
        const playerId = `youtube-${videoId}`;
        const container = document.getElementById(playerId);
        if (container && !(container as any).ytPlayer) {
          const player = new window.YT.Player(playerId, {
            videoId: videoId,
            playerVars: { modestbranding: 1, rel: 0 },
            events: {
              'onStateChange': (event: any) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  playersRef.current.forEach(p => {
                    if (p.getIframe().id !== playerId && typeof p.getPlayerState === 'function' && p.getPlayerState() === window.YT.PlayerState.PLAYING) {
                      p.pauseVideo();
                    }
                  });
                }
              }
            }
          });
          playersRef.current.push(player);
          (container as any).ytPlayer = player;
        }
      });
    });
    return () => {
      playersRef.current.forEach(p => { if (p && typeof p.destroy === 'function') p.destroy(); });
    };
  }, [showData]);

  const handleScrollToArtist = (e: React.MouseEvent, artistId: string | undefined) => {
    e.preventDefault();
    if (!artistId) return;
    const element = document.getElementById(`artist-${artistId}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Loading...</div>;
  }
  if (error || !showData) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-center"><div><p className="text-red-400 mb-4">{error || "Show not found."}</p><Link href="/" className="underline">Go Home</Link></div></div>;
  }

  const headliner = showData.artists.find(a => a.is_headliner);
  const openers = showData.artists.filter(a => !a.is_headliner);
  const sortedArtists = [headliner, ...openers].filter(Boolean) as ShowDetailData['artists'];

  return (
    <div className="bg-neutral-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={18} /> Back to All Shows
          </Link>
        </div>
        
        <header className="py-10 md:py-16 border-b-2 border-neutral-800">
  {/* The main container is now a simple vertical stack on all screen sizes */}
  <div className="flex flex-col gap-8">
    {/* This single div now holds both the text and the button */}
    <div className="text-center md:text-left">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
        {headliner?.name}
      </h1>
      {openers.length > 0 && (
        <p className="text-xl md:text-2xl text-neutral-400 mt-2">
          with {openers.map(o => o.name).join(', ')}
        </p>
      )}
      <div className="mt-4 text-lg text-neutral-300">
        <p>
          <span>{formatDateForShow(showData.show_date)}</span>
          <span className="mx-2 text-neutral-600">•</span>
          <span>at {showData.venue.name}</span>
        </p>
      </div>

      {/* The "Buy Tickets" button is now here, with a top margin for spacing */}
      {showData.ticket_url && (
        <div className="mt-8">
          <a href={showData.ticket_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-lg font-bold px-10 py-4 rounded-lg transition-colors shadow-lg">
            <Ticket size={22} /> Buy Tickets
          </a>
        </div>
      )}
    </div>
  </div>
</header>

        <main className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-2 mb-4">Full Lineup</h2>
            {sortedArtists.map(artist => (
                <ArtistDetailCard 
                  key={artist.artist_id} 
                  artist={artist}
                  isHeadliner={artist.is_headliner}
                />
            ))}
        </main>
        
        <footer className="py-16 mt-8 border-t border-neutral-800">
          <div className="space-y-4 mb-8">
            <h2 className="text-3xl font-bold">Venue: {showData.venue.name}</h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-neutral-300">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-neutral-400" />
                <div>
                  <p>{showData.venue.address}, {showData.venue.city}, {showData.venue.state}</p>
                </div>
              </div>
              {showData.venue.website && (
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-neutral-400" />
                  <a href={showData.venue.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* --- UPDATED: Map-Only Container --- */}
          <div className="flex flex-col md:flex-row gap-2 w-full h-[500px] md:h-96">
            
            {/* 
              Street View Pane (Temporarily Removed)
              
              <div className="w-full md:w-3/5 h-1/2 md:h-full bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                {(showData.venue.latitude && showData.venue.longitude) ? (
                  <iframe
                    title={`Street View of ${showData.venue.name}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/streetview?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&location=${showData.venue.latitude},${showData.venue.longitude}`}
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500">
                    <p>Street View not available</p>
                  </div>
                )}
              </div> 
            */}

            {/* Map Pane (Now takes up the full width) */}
            <div className="w-full h-full bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
              {showData.venue.google_place_id ? (
                <iframe
                  title={`Map of ${showData.venue.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:${showData.venue.google_place_id}`}
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500">
                  <p>Map not available</p>
                </div>
              )}
            </div>

          </div>
        </footer>
      </div>
    </div>
  );
}