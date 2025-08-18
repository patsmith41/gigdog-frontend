// src/app/festivals/shaky-knees-2025/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import { ApiConcert, NowPlayingInfo, FestivalPageData, FestivalArtist } from '@/types';
import { List, Music } from 'lucide-react';

// Reusable components
import FestivalGuide from '@/components/ui/FestivalGuide'; 
import ConcertGridRowWrapper from '@/components/concerts/ConcertGridRowWrapper';
import RotatingPromoWidget from '@/components/ui/RotatingPromoWidget';
import FocusViewModal from '@/components/ui/FocusViewModal';

// --- (FestivalHero component is unchanged) ---
interface FestivalHeroProps {
  name: string;
  dates: string;
  location: string;
  heroImageUrl: string;
}
const FestivalHero: React.FC<FestivalHeroProps> = ({ name, dates, location, heroImageUrl }) => (
    <section 
      className="w-full py-12 md:py-16 bg-neutral-800 text-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroImageUrl})` }}
    >
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">{name}</h1>
        <h2 className="text-xl md:text-2xl font-light text-neutral-300 mt-2">{dates} | {location}</h2>
      </div>
    </section>
);

// --- (EmailSignupSection component is unchanged) ---
const EmailSignupSection = () => (
    <div className="p-5 bg-neutral-800 rounded-xl shadow-md text-center h-full flex flex-col justify-center">
      <h3 className="font-semibold text-lg text-white mb-1">
        Get the latest Shaky News
      </h3>
      <p className="text-neutral-400 text-sm mb-4">
        Inside info delivered to your inbox.
      </p>
      <form className="flex flex-col sm:flex-row items-center gap-2" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="email" 
          placeholder="your.email@example.com"
          className="w-full sm:flex-grow min-w-0 p-2 border border-neutral-600 rounded bg-neutral-700 text-sm text-neutral-100 placeholder-neutral-500"
          aria-label="Email Address"
        />
        <button type="submit" className="w-full sm:w-auto flex-shrink-0 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded text-sm font-semibold transition-colors duration-300">
          Subscribe
        </button>
      </form>
  </div>
);

// --- (FestivalSidebar component is modified to REMOVE the EmailSignupSection) ---
interface FestivalSidebarProps {
  activeVideoId: string | null;
  nowPlayingInfo: NowPlayingInfo | null;
}
const FestivalSidebar: React.FC<FestivalSidebarProps> = ({ activeVideoId, nowPlayingInfo }) => {
    return (
        <div className="space-y-6 sticky top-20 md:top-24 p-1">
          <div className="bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-700">
            <div className="w-full bg-black flex items-center justify-center text-neutral-500 relative" style={{ aspectRatio: '16/9' }}>
              {activeVideoId ? ( <iframe key={activeVideoId} width="100%" height="100%" src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&modestbranding=1&rel=0`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0"></iframe> ) : ( 
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="text-center">
                    <p className="text-base text-neutral-400">
                      Click any ▶ button to watch artist previews
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      
                    </p>
                  </div>
                </div> )}
            </div>
            {activeVideoId && nowPlayingInfo && (
              <div className="p-4 border-t border-neutral-700">
                <div className="space-y-4"><p className="text-white text-lg leading-relaxed">Now Playing: <span className="font-semibold">{nowPlayingInfo.artistName}</span></p><p className="text-neutral-400 text-sm mt-1">Playing on the {nowPlayingInfo.venueName}</p></div>
              </div>
            )}
          </div>
          {/* --- CHANGE: EmailSignupSection is no longer here --- */}
          <div className="space-y-6">
            <RotatingPromoWidget />
          </div>
        </div>
    );
};


// --- Main Page Component ---
export default function ShakyKneesPage() {
  const [festivalData, setFestivalData] = useState<FestivalPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState('All');
  const [itemsInCardState, setItemsInCardState] = useState<Set<string>>(new Set());
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [nowPlayingInfo, setNowPlayingInfo] = useState<NowPlayingInfo | null>(null);
  const [sortBy, setSortBy] = useState<'time' | 'stage'>('time');
  const [selectedShow, setSelectedShow] = useState<ApiConcert | null>(null);
  
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    // (useEffect for fetching data is unchanged)
    const fetchFestivalData = async () => {
      if (!API_BASE_URL) { setError("API URL is not configured."); setIsLoading(false); return; }
      setIsLoading(true); setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/festivals/Shaky Knees/2025`);
        if (!response.ok) { const errorBody = await response.json().catch(() => ({error: "Failed to parse error response."})); throw new Error(errorBody.error || 'Failed to fetch festival data from API.'); }
        const data: FestivalPageData = await response.json();
        setFestivalData(data);
      } catch (err: any) { console.error("Error fetching festival data:", err); setError(err.message); } finally { setIsLoading(false); }
    };
    fetchFestivalData();
  }, [API_BASE_URL]);

  const filteredLineup = useMemo(() => {
    // (useMemo for filtering lineup is unchanged)
    const lineup = festivalData?.lineup.filter(artist => { if (activeDay === 'All') return true; return artist.day_playing === activeDay; }) || [];
    return lineup.sort((a, b) => { if (sortBy === 'time') { const timeA = a.start_time ? new Date(a.start_time).getTime() : Infinity; const timeB = b.start_time ? new Date(b.start_time).getTime() : Infinity; if (timeA !== timeB) return timeA - timeB; return (a.stage_name || '').localeCompare(b.stage_name || ''); } else { const stageA = a.stage_name || 'ZZZ'; const stageB = b.stage_name || 'ZZZ'; if (stageA !== stageB) return stageA.localeCompare(stageB); const timeA = a.start_time ? new Date(a.start_time).getTime() : Infinity; const timeB = b.start_time ? new Date(b.start_time).getTime() : Infinity; return timeA - timeB; } });
  }, [festivalData, activeDay, sortBy]);

  const handleShowSelect = useCallback((concert: ApiConcert) => { /* (unchanged) */ if (isDesktop) { setItemsInCardState(prev => { const next = new Set(prev); if (next.has(concert.show_id)) { next.delete(concert.show_id); } else { next.add(concert.show_id); } return next; }); } else { setSelectedShow(concert); } }, [isDesktop]);
  const handlePlayRequest = useCallback(( videoId: string | null, infoForPlayer?: NowPlayingInfo) => { /* (unchanged) */ if (videoId && infoForPlayer) { setActiveVideoId(null); setTimeout(() => { setActiveVideoId(videoId); setNowPlayingInfo(infoForPlayer); }, 0); } else { setActiveVideoId(null); setNowPlayingInfo(null); } }, []);
  const handleCloseModal = () => { setSelectedShow(null); };

  if (isLoading) { return <div className="text-center text-white text-2xl py-40">Loading Shaky Knees 2025 Guide...</div>; }
  if (error) { return <div className="text-center text-red-400 text-2xl py-40"><p>Error loading festival data:</p><p className="text-lg mt-2">{error}</p></div>; }
  if (!festivalData) { return <div className="text-center text-white text-2xl py-40">No festival data found.</div> }

  return (
    <div className="flex flex-col">
      <FestivalHero name={festivalData.name} dates={festivalData.dates} location={festivalData.location} heroImageUrl={festivalData.heroImageUrl}/>

      {/* --- THIS IS THE NEW LAYOUT FOR THE GUIDES + EMAIL SIGNUP --- */}
      <div className="my-8 md:my-12">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* Guide takes up 2/3 of the space on desktop */}
                <div className="lg:col-span-2">
                    <FestivalGuide />
                </div>
                {/* Email signup takes up 1/3, and is hidden on mobile */}
                <div className="hidden lg:block">
                    <EmailSignupSection />
                </div>
            </div>
        </div>
      </div>
      {/* --- END OF NEW LAYOUT --- */}

      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-6 flex flex-col lg:flex-row gap-6 xl:gap-8 pb-12">
        <div className="w-full lg:flex-grow min-w-0 order-2 lg:order-1">
          <div className="flex justify-center items-center gap-2 md:gap-4 mb-8 p-2 bg-neutral-800 rounded-full sticky top-4 z-20">
            {['All', 'Friday', 'Saturday', 'Sunday'].map(day => ( <button key={day} onClick={() => setActiveDay(day)} className={`px-4 md:px-6 py-2 text-sm md:text-base font-semibold rounded-full transition-colors duration-200 ${ activeDay === day ? 'bg-white text-black' : 'bg-transparent text-neutral-300 hover:bg-neutral-700' }`}>{day === 'All' ? 'All Days' : day}</button>))}
          </div>
          <div className="flex items-center justify-end gap-4 mb-4 px-2">
            <span className="text-sm font-medium text-neutral-400">Sort by:</span>
            <div className="flex items-center p-1 bg-neutral-800 rounded-lg">
              <button onClick={() => setSortBy('time')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${sortBy === 'time' ? 'bg-indigo-600 text-white' : 'text-neutral-300 hover:bg-neutral-700'}`}><List size={14} /> Time</button>
              <button onClick={() => setSortBy('stage')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${sortBy === 'stage' ? 'bg-indigo-600 text-white' : 'text-neutral-300 hover:bg-neutral-700'}`}><Music size={14} /> Stage</button>
            </div>
          </div>
          <div className="bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-700 p-1">
            {filteredLineup.length > 0 ? ( filteredLineup.map((concert) => ( <ConcertGridRowWrapper key={concert.show_id} concert={concert} onPlayRequest={handlePlayRequest} isExpanded={itemsInCardState.has(concert.show_id)} onShowSelect={() => handleShowSelect(concert)} isDesktop={isDesktop} context="festival"/>)) ) : ( <div className="text-center py-20 px-4"><p className="text-lg text-neutral-400">No artists scheduled for this day yet.</p><p className="text-sm text-neutral-500 mt-1">Check back soon for lineup updates!</p></div> )}
          </div>

          {/* This is the Email Signup section for MOBILE view */}
          <div className="mt-8 lg:hidden">
            <EmailSignupSection />
          </div>

        </div>
        <aside className="w-full lg:w-[400px] xl:w-[480px] flex-shrink-0 order-1 lg:order-2">
          {isDesktop && ( <FestivalSidebar activeVideoId={activeVideoId} nowPlayingInfo={nowPlayingInfo} /> )}
        </aside>
      </div>
      
      {!isDesktop && selectedShow && ( <FocusViewModal show={selectedShow} onClose={handleCloseModal} /> )}
    </div>
  );
}