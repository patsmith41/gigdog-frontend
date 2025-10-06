// src/components/pages/HomePageClient.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CuratedShelf from '@/components/concerts/CuratedShelf';
import ConcertGridRowWrapper from '@/components/concerts/ConcertGridRowWrapper';
import PaginationControls from '@/components/ui/PaginationControls';
import DailyBlurb from '@/components/ui/DailyBlurb';
import { useDebounce } from '@/hooks/useDebounce';
import useMediaQuery from '@/hooks/useMediaQuery';
import RotatingPromoWidget from '@/components/ui/RotatingPromoWidget';
import FocusViewModal from '@/components/ui/FocusViewModal';
import { X, SlidersHorizontal, Search } from 'lucide-react';
import { ApiConcert, ApiShowsResponse, NowPlayingInfo } from '@/types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, nextFriday, isFriday, addDays } from 'date-fns';

const ITEMS_PER_PAGE = 20;

interface FilterValues {
  selectedVenueId: string;
  selectedGenreId: string;
  startDate: string;
  endDate: string;
  artistSearch: string;
}

const formatDateForSidebar = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(
      dateString.includes('T') ? dateString : `${dateString}T00:00:00`
    );
    const dayShort = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return `${dayShort}, ${monthDay}`;
  } catch (e) {
    return '';
  }
};
const formatDateSeparator = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(
      dateString.includes('T') ? dateString : `${dateString}T00:00:00`
    );
    const dayFull = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
    return `${dayFull}, ${monthDay}`;
  } catch (e) {
    return dateString;
  }
};
interface FilterGenre {
  id: string;
  name: string;
  artist_count: number;
}
interface FilterVenue {
  id: string;
  name: string;
}
const FilterBar = ({
  filters,
  onFilterChange,
  onSetDateRange,
  onClearFilters,
  genres,
  venues,
}: {
  filters: FilterValues;
  onFilterChange: (name: keyof FilterValues, value: string) => void;
  onSetDateRange: (range: string) => void;
  onClearFilters: () => void;
  genres: FilterGenre[];
  venues: FilterVenue[];
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const clearFilters = () => {
    onClearFilters();
    setIsMobileFiltersOpen(false);
  };
  return (
    <div className="flex flex-col gap-3 bg-neutral-800/50 p-3 rounded-lg ring-1 ring-neutral-700 mb-4">
      <div className="hidden md:flex flex-col gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search artists..."
            value={filters.artistSearch}
            onChange={(e) => onFilterChange('artistSearch', e.target.value)}
            className="w-full px-3 py-2 pl-9 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-100 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        </div>
        <div id="filter-bar" className="flex flex-row gap-3 items-center">
          <input type="date" aria-label="Start Date" value={filters.startDate} onChange={(e) => onFilterChange('startDate', e.target.value)} className="w-full md:w-auto flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-100 text-sm" />
          <input type="date" aria-label="End Date" value={filters.endDate} onChange={(e) => onFilterChange('endDate', e.target.value)} className="w-full md:w-auto flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-100 text-sm" />
          <select value={filters.selectedVenueId} onChange={(e) => onFilterChange('selectedVenueId', e.target.value)} className="w-full md:w-auto flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Venues</option>
            {venues.map((venue) => (<option key={venue.id} value={venue.id}>{venue.name}</option>))}
          </select>
          <button onClick={clearFilters} className="p-2 text-neutral-400 hover:text-white transition-colors rounded-md hover:bg-neutral-700" aria-label="Clear filters">
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center justify-start gap-2 pt-3 border-t border-neutral-700/50">
            <button onClick={() => onSetDateRange('this_week')} className="flex-none text-sm font-medium text-neutral-300 hover:text-white bg-neutral-700/50 hover:bg-neutral-700 px-3 py-1.5 rounded-md transition-colors">This Week</button>
            <button onClick={() => onSetDateRange('this_weekend')} className="flex-none text-sm font-medium text-neutral-300 hover:text-white bg-neutral-700/50 hover:bg-neutral-700 px-3 py-1.5 rounded-md transition-colors">This Weekend</button>
            <button onClick={() => onSetDateRange('next_week')} className="flex-none text-sm font-medium text-neutral-300 hover:text-white bg-neutral-700/50 hover:bg-neutral-700 px-3 py-1.5 rounded-md transition-colors">Next Week</button>
            <button onClick={() => onSetDateRange('this_month')} className="flex-none text-sm font-medium text-neutral-300 hover:text-white bg-neutral-700/50 hover:bg-neutral-700 px-3 py-1.5 rounded-md transition-colors">This Month</button>
        </div>
      </div>
      <div className="md:hidden flex flex-col gap-3">
        <div className="flex items-center gap-2">
            <div className="flex-grow grid grid-cols-4 gap-2">
                <button onClick={() => onSetDateRange('this_week')} className="text-xs font-medium text-neutral-300 hover:text-white bg-neutral-700/50 hover:bg-neutral-700 px-2 py-2 rounded-md transition-colors">This Week</button>
                <button onClick={() => onSetDateRange('this_weekend')} className="text-xs font-medium text-neutral-300 hover:text-white bg-neutral-700/50 hover:bg-neutral-700 px-2 py-2 rounded-md transition-colors">Weekend</button>
                <button onClick={() => onSetDateRange('next_week')} className="text-xs font-medium text-neutral-300 hover:text-white bg-neutral-700/50 hover:bg-neutral-700 px-2 py-2 rounded-md transition-colors">Next Week</button>
                <button onClick={() => onSetDateRange('this_month')} className="text-xs font-medium text-neutral-300 hover:text-white bg-neutral-700/50 hover:bg-neutral-700 px-2 py-2 rounded-md transition-colors">Month</button>
            </div>
            <button onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)} className={`p-2 rounded-md transition-colors ${isMobileFiltersOpen ? 'bg-indigo-600 text-white' : 'text-neutral-300 bg-neutral-700/50'}`}>
                <SlidersHorizontal size={16} />
            </button>
        </div>
        {isMobileFiltersOpen && (
            <div className="flex flex-col gap-3 pt-3 border-t border-neutral-700/50">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search artists..."
                        value={filters.artistSearch}
                        onChange={(e) => onFilterChange('artistSearch', e.target.value)}
                        className="w-full px-3 py-2 pl-9 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-100 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
                <select value={filters.selectedVenueId} onChange={(e) => onFilterChange('selectedVenueId', e.target.value)} className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">All Venues</option>
                    {venues.map((venue) => (<option key={venue.id} value={venue.id}>{venue.name}</option>))}
                </select>
                <div className="flex items-center gap-2">
                    <input type="date" aria-label="Start Date" value={filters.startDate} onChange={(e) => onFilterChange('startDate', e.target.value)} className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-100 text-sm" />
                    <span className="text-sm text-neutral-400">to</span>
                    <input type="date" aria-label="End Date" value={filters.endDate} onChange={(e) => onFilterChange('endDate', e.target.value)} className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-100 text-sm" />
                </div>
                <button onClick={clearFilters} className="w-full text-sm font-medium text-neutral-400 hover:text-white bg-transparent hover:bg-neutral-700 px-3 py-1.5 rounded-md transition-colors">
                    Clear All Filters
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
const EmailSignupSection = () => (
    <div className="p-5 bg-neutral-800 rounded-xl shadow-md text-center">
      <h3 className="font-semibold text-lg text-white mb-1">
        Atlanta Live Music, In Your Inbox.
      </h3>
      <p className="text-neutral-400 text-sm mb-4">
        Gig Dog weekly for info on shows and local artists.
      </p>
      <form
        className="flex flex-col sm:flex-row items-center gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="your.email@example.com"
          className="w-full sm:flex-grow min-w-0 p-2 border border-neutral-600 rounded bg-neutral-700 text-sm text-neutral-100 placeholder-neutral-400"
          aria-label="Email Address"
        />
        <button
          type="submit"
          className="w-full sm:w-auto flex-shrink-0 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded text-sm font-semibold transition-colors duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
);
interface RightSidebarContentProps {
  activeVideoId: string | null;
  nowPlayingInfo: NowPlayingInfo | null;
  // --- ADDED THIS PROP ---
  handlePlayRequest: (videoId: string | null, infoForPlayer?: NowPlayingInfo) => void;
}
const RightSidebarContent: React.FC<RightSidebarContentProps> = ({
  activeVideoId,
  nowPlayingInfo,
  // --- ACCEPT THIS PROP ---
  handlePlayRequest,
}) => {
  const handleTellFriends = () => {
    if (!nowPlayingInfo) return;
    const message = `Check out ${
      nowPlayingInfo.artistName
    } playing at ${nowPlayingInfo.venueName}${
      nowPlayingInfo.showDate
        ? ` on ${formatDateForSidebar(nowPlayingInfo.showDate)}`
        : ''
    }! 🎵${
      nowPlayingInfo.ticketUrl ? ` Get tickets: ${nowPlayingInfo.ticketUrl}` : ''
    }`;
    if (navigator.share) {
      navigator
        .share({
          title: `${nowPlayingInfo.artistName} Live`,
          text: message,
          url: nowPlayingInfo.ticketUrl || window.location.href,
        })
        .catch(console.log);
    } else {
      navigator.clipboard
        .writeText(message)
        .then(() => alert('Copied to clipboard!'))
        .catch(() => {});
    }
  };
  
  
  const availableVideos = [];
  if (nowPlayingInfo?.videoIds) {
    if (nowPlayingInfo.videoIds.video1) availableVideos.push({ id: nowPlayingInfo.videoIds.video1, label: 'OFFICIAL' });
    if (nowPlayingInfo.videoIds.video2) availableVideos.push({ id: nowPlayingInfo.videoIds.video2, label: 'LIVE' });
    if (nowPlayingInfo.videoIds.live) availableVideos.push({ id: nowPlayingInfo.videoIds.live, label: 'Live' });
    if (nowPlayingInfo.videoIds.interview) availableVideos.push({ id: nowPlayingInfo.videoIds.interview, label: 'Interview' });
  }
  

  return (
    <div className="space-y-6 sticky top-20 md:top-24 p-1">
      <div className="bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-700">
        <div
          className="w-full bg-black flex items-center justify-center text-neutral-500 relative"
          style={{ aspectRatio: '16/10' }}
        >
          {activeVideoId ? (
            <iframe
              key={activeVideoId}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&modestbranding=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-center">
              <p className="text-base text-neutral-400">
                Click any ▶ button to watch artist previews
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Discover new music before you go!
              </p>
            </div>
          </div>
          )}
        </div>
        {activeVideoId && nowPlayingInfo && (
          <div className="p-4 border-t border-neutral-700">
            {/* --- NEW: Video Selector Buttons --- */}
            {availableVideos.length > 1 && (
              <div className="flex items-center gap-2 mb-4">
                {availableVideos.map(video => (
                  <button
                    key={video.id}
                    onClick={() => handlePlayRequest(video.id, nowPlayingInfo)}
                    className={`flex-1 px-2 py-2 text-xs font-semibold rounded-md transition-colors text-center ${
                      activeVideoId === video.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                    }`}
                  >
                    {video.label}
                  </button>
                ))}
              </div>
            )}
            {/* --- END: Video Selector Buttons --- */}
            <div className="space-y-4">
              <p className="text-white text-lg leading-relaxed">
                <span className="font-semibold">{nowPlayingInfo.artistName}</span>
                {nowPlayingInfo.venueName && (
                  <span className="font-light">
                    {' '}
                    is playing{' '}
                    <span className="font-medium">{nowPlayingInfo.venueName}</span>
                  </span>
                )}
                {nowPlayingInfo.showDate && (
                  <span className="font-light">
                    {' '}
                    on{' '}
                    <span className="text-pink-500 font-medium">
                      {formatDateForSidebar(nowPlayingInfo.showDate)}
                    </span>
                  </span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleTellFriends}
                  className="flex-1 px-4 py-2.5 bg-transparent text-neutral-300 hover:bg-neutral-700 hover:text-white border border-white hover:border-neutral-500 rounded-xl text-sm font-semibold transition-all duration-300 ease"
                >
                  Tell Friends
                </button>
                {nowPlayingInfo.ticketUrl ? (
                  <a
                    href={nowPlayingInfo.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 bg-pink-500 text-white hover:bg-pink-600 text-center rounded-xl text-sm font-semibold transition-all duration-300 ease"
                  >
                    Get Tix
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex-1 px-4 py-2.5 bg-neutral-700 text-neutral-500 text-center rounded-xl text-sm font-semibold cursor-not-allowed"
                  >
                    No Tickets
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-6">
        {/*<RotatingPromoWidget />*/}
        <EmailSignupSection />
      </div>
    </div>
  );
};
// End of unchanged sub-components

interface HomePageClientProps {
  initialShows: ApiShowsResponse;
  initialGenres: any[];
  initialVenues: any[];
  dailyBlurb: { headline: string; blurb: string; };
}

export default function HomePageClient({ initialShows, initialGenres, initialVenues, dailyBlurb }: HomePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [showsData, setShowsData] = useState<ApiShowsResponse | null>(initialShows);
  const [genres, setGenres] = useState(initialGenres);
  const [venues, setVenues] = useState(initialVenues);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [itemsInCardState, setItemsInCardState] = useState<Set<string>>(new Set());
  const [selectedShow, setSelectedShow] = useState<ApiConcert | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [nowPlayingInfo, setNowPlayingInfo] = useState<NowPlayingInfo | null>(null);
  
  const currentPage = Number(searchParams.get('page')) || 1;
  const filters: FilterValues = {
    selectedVenueId: searchParams.get('selectedVenueId') || '',
    selectedGenreId: searchParams.get('selectedGenreId') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    artistSearch: searchParams.get('artistSearch') || '',
  };
  
  const isFirstRender = useRef(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const updateUrl = useCallback((newParams: URLSearchParams, isPagination: boolean = false) => {
    const url = `${pathname}?${newParams.toString()}`;
    if (isPagination) {
      router.push(url, { scroll: false });
    } else {
      router.replace(url, { scroll: false });
    }
  }, [router, pathname]);

  const handleFilterChange = (filterName: keyof FilterValues, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(filterName, value);
    } else {
      params.delete(filterName);
    }
    params.delete('page');
    updateUrl(params);
  };
  
  const handleSetDateRange = (range: string) => {
    let startDate = '';
    let endDateValue = '';
    const today = new Date();
    
    if (range === 'this_week') {
        startDate = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        endDateValue = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    } else if (range === 'next_week') {
        const startOfNextWeek = addDays(startOfWeek(today, { weekStartsOn: 1 }), 7);
        endDateValue = format(endOfWeek(startOfNextWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        startDate = format(startOfNextWeek, 'yyyy-MM-dd');
    } else if (range === 'this_weekend') {
        let upcomingFriday = nextFriday(today);
        if (isFriday(today)) upcomingFriday = today;
        const upcomingSunday = addDays(upcomingFriday, 2);
        startDate = format(upcomingFriday, 'yyyy-MM-dd');
        endDateValue = format(upcomingSunday, 'yyyy-MM-dd');
    } else if (range === 'this_month') {
        startDate = format(startOfMonth(today), 'yyyy-MM-dd');
        endDateValue = format(endOfMonth(today), 'yyyy-MM-dd');
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('startDate', startDate);
    params.set('endDate', endDateValue);
    params.delete('page');
    updateUrl(params);
  };
  
  const clearAllFilters = useCallback(() => {
    updateUrl(new URLSearchParams());
  }, [updateUrl]);

  const handlePageChange = (newPage: number) => {
    const mainContentArea = document.getElementById('main-content-area');
    if (mainContentArea) {
        mainContentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const params = new URLSearchParams(searchParams.toString());
    if (newPage > 1) {
      params.set('page', String(newPage));
    } else {
      params.delete('page');
    }
    updateUrl(params, true);
    setItemsInCardState(new Set());
    setSelectedShow(null);
  };

  const handleShowSelect = useCallback((concert: ApiConcert) => {
    if (isDesktop) {
      setItemsInCardState(prev => {
        const next = new Set(prev);
        if (next.has(concert.show_id)) { next.delete(concert.show_id); } 
        else { next.add(concert.show_id); }
        return next;
      });
    } else {
      setSelectedShow(concert);
    }
  }, [isDesktop]);

  const handleCloseModal = () => { setSelectedShow(null); };
  
  // --- UPDATED THIS FUNCTION ---
  const handlePlayRequest = useCallback((videoId: string | null, infoForPlayer?: NowPlayingInfo) => {
    if (videoId && infoForPlayer) {
      // Package all video IDs from the headliner object into the state
      const allVideoIds = {
        video1: infoForPlayer.headliner?.youtube_video_id_1,
        video2: infoForPlayer.headliner?.youtube_video_id_2,
        live: infoForPlayer.headliner?.youtube_video_id_3,
        interview: infoForPlayer.headliner?.youtube_interview_id,
      };

      setActiveVideoId(null); // Quick reset to ensure iframe re-renders
      setTimeout(() => {
        setActiveVideoId(videoId);
        setNowPlayingInfo({ ...infoForPlayer, videoIds: allVideoIds });
      }, 0);
    } else {
      setActiveVideoId(null);
      setNowPlayingInfo(null);
    }
  }, []);
  // --- END OF UPDATE ---
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchShows = async () => {
      if (!API_BASE_URL) { setError("API URL is not configured."); return; }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/shows?${searchParams.toString()}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.details || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setShowsData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShows();
  }, [searchParams, API_BASE_URL]);

  let lastDate = '';

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-6 flex flex-col lg:flex-row gap-6 xl:gap-8 pb-12">
        <main id="main-content-area" className="w-full lg:flex-grow min-w-0 order-2 lg:order-1">
          <DailyBlurb headline={dailyBlurb.headline} blurb={dailyBlurb.blurb} />
          
          <div className="my-4">
            <FilterBar 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onSetDateRange={handleSetDateRange}
                onClearFilters={clearAllFilters}
                genres={genres} 
                venues={venues} 
            />
          </div>
          
          {error && (<div className="p-4 my-4 text-red-300 bg-red-900/50 rounded-md" role="alert"><p className="font-bold">Error:</p><p>{error}</p></div>)}
          
          <div id="concert-list-container" className="bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-700 p-1">
            {isLoading ? (
              <div className="text-center py-20"><p className="text-lg text-neutral-400">Loading shows...</p></div>
            ) : !error && showsData?.shows.length === 0 ? (
              <div className="text-center py-20"><p className="text-lg text-neutral-400">No shows match the current filters.</p></div>
            ) : (
              (showsData?.shows || []).map((concert) => {
                const showDateSeparator = concert.show_date !== lastDate;
                if (showDateSeparator) { lastDate = concert.show_date; }
                return (
                  <React.Fragment key={concert.show_id}>
                    {showDateSeparator && (<div className="bg-neutral-800/50 border-b border-t border-neutral-700 px-4 py-2  top-16 z-10"><h3 className="text-base font-bold text-white uppercase tracking-wide">{formatDateSeparator(concert.show_date)}</h3></div>)}
                    <ConcertGridRowWrapper concert={concert} onShowSelect={() => handleShowSelect(concert)} onPlayRequest={handlePlayRequest} isExpanded={itemsInCardState.has(concert.show_id)} isDesktop={isDesktop} />
                  </React.Fragment>
                );
            }))}
          </div>
          
          {(showsData && showsData.totalCount > ITEMS_PER_PAGE) && (
            <PaginationControls 
              currentPage={currentPage} 
              totalPages={Math.ceil(showsData.totalCount / ITEMS_PER_PAGE)} 
              onPageChange={handlePageChange}
              
            />
          )}
          
          <div className="mt-8 lg:hidden space-y-6">
            <RotatingPromoWidget />
            <EmailSignupSection />
          </div>
        </main>
        
        <aside className="w-full lg:w-[400px] xl:w-[480px] flex-shrink-0 order-1 lg:order-2">
            {/* --- PASS THE HANDLER FUNCTION DOWN --- */}
            {isDesktop && <RightSidebarContent activeVideoId={activeVideoId} nowPlayingInfo={nowPlayingInfo} handlePlayRequest={handlePlayRequest} />}
        </aside>
      </div>
      
      {!isDesktop && selectedShow && (<FocusViewModal show={selectedShow} onClose={handleCloseModal} />)}
    </div>
  );
}