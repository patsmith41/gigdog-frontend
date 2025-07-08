// src/app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import LargerHero from '@/components/ui/LargerHero';
import CuratedShelf from '@/components/concerts/CuratedShelf';
import ConcertGridRowWrapper from '@/components/concerts/ConcertGridRowWrapper';
import PaginationControls from '@/components/ui/PaginationControls';
import { useDebounce } from '@/hooks/useDebounce';
import { Search } from 'lucide-react';
import {
  ApiConcert,
  ApiNeighborhood,
  ApiShowsResponse,
  NeighborhoodMap,
  ApiFilterVenue,
  ApiFilterGenre,
  NowPlayingInfo,
} from '@/types';
import useMediaQuery from '@/hooks/useMediaQuery';
import RotatingPromoWidget from '@/components/ui/RotatingPromoWidget';
import FocusViewModal from '@/components/ui/FocusViewModal';

const ITEMS_PER_PAGE = 20;

interface FilterValues {
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

interface SimpleFilterBarProps {
  filters: FilterValues;
  onFilterChange: (filterName: keyof FilterValues, value: string) => void;
  resultCount?: number;
  totalCount?: number;
}

const SimpleFilterBar: React.FC<SimpleFilterBarProps> = ({
  filters,
  onFilterChange,
  resultCount,
  totalCount,
}) => {
  return (
    <div id="filter-bar" className="mb-2 md:mb-3">
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search artists or venues..."
            value={filters.artistSearch}
            onChange={(e) => onFilterChange('artistSearch', e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-neutral-100 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className="w-32 md:w-36 px-2 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className="w-32 md:w-36 px-2 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={() => {
              onFilterChange('startDate', '');
              onFilterChange('endDate', '');
              onFilterChange('artistSearch', '');
            }}
            className="px-2 py-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
      {resultCount !== undefined && totalCount !== undefined && (
        <div className="hidden md:block mt-1">
          <p className="text-xs text-neutral-500">
            {resultCount} of {totalCount} shows
          </p>
        </div>
      )}
    </div>
  );
};

const EmailSignupSection = () => (
    <div className="p-5 bg-neutral-800 rounded-xl shadow-md text-center">
      <h3 className="font-semibold text-lg text-white mb-1">
        Weekend Picks, In Your Inbox.
      </h3>
      <p className="text-neutral-400 text-sm mb-4">
        Get our top 3 concert picks delivered every Friday.
      </p>
      <form
        className="flex flex-col sm:flex-row items-center gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="your.email@example.com"
          className="w-full sm:flex-grow min-w-0 p-2 border border-neutral-600 rounded bg-neutral-700 text-sm text-neutral-100 placeholder-neutral-500"
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
}

const RightSidebarContent: React.FC<RightSidebarContentProps> = ({
  activeVideoId,
  nowPlayingInfo,
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
        <RotatingPromoWidget />
        <EmailSignupSection />
      </div>
    </div>
  );
};


export default function HomePage() {
  const [showsData, setShowsData] = useState<ApiShowsResponse | null>(null);
  const [itemsInCardState, setItemsInCardState] = useState<Set<string>>(new Set());
  const [selectedShow, setSelectedShow] = useState<ApiConcert | null>(null);
  const [neighborhoodMap, setNeighborhoodMap] = useState<NeighborhoodMap>({});
  
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [nowPlayingInfo, setNowPlayingInfo] = useState<NowPlayingInfo | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterValues>({
    startDate: '',
    endDate: '',
    artistSearch: '',
  });

  const debouncedArtistSearch = useDebounce(filters.artistSearch, 300);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const fetchShows = useCallback(async (page: number) => {
    if (!API_BASE_URL) {
      setError("API URL is not configured.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString()
      });
      if (filters.startDate) queryParams.set('startDate', filters.startDate);
      if (filters.endDate) queryParams.set('endDate', filters.endDate);
      if (debouncedArtistSearch) queryParams.set('artistSearch', debouncedArtistSearch);
      const response = await fetch(`${API_BASE_URL}/shows?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setShowsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, filters.startDate, filters.endDate, debouncedArtistSearch]);
  
  const handleFilterChange = (filterName: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };
  
  const fetchFilterData = useCallback(async () => {
    if (!API_BASE_URL) return;
    try {
      const [neighborhoodsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/neighborhoods`),
      ]);
      if (neighborhoodsResponse.ok) {
        const neighborhoods: ApiNeighborhood[] = await neighborhoodsResponse.json();
        const map: NeighborhoodMap = {};
        neighborhoods.forEach(n => {
          if (n.id) map[n.id] = n.name;
        });
        setNeighborhoodMap(map);
      }
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  }, [API_BASE_URL]);
  
  useEffect(() => {
    if (API_BASE_URL) {
      fetchShows(currentPage);
      if(currentPage === 1) {
        fetchFilterData();
      }
    }
  }, [API_BASE_URL, currentPage, fetchShows, fetchFilterData]);

  const concertsWithMappedData = showsData?.shows?.map(concert => ({
    ...concert,
    venue: concert.venue && concert.venue.neighborhood_id && neighborhoodMap[concert.venue.neighborhood_id]
      ? { ...concert.venue, neighborhood_name: neighborhoodMap[concert.venue.neighborhood_id] }
      : { ...concert.venue, neighborhood_name: concert.venue?.neighborhood_name || "N/A" },
  })) || [];

  const handleShowSelect = useCallback((concert: ApiConcert) => {
    if (isDesktop) {
      setItemsInCardState(prev => {
        const next = new Set(prev);
        if (next.has(concert.show_id)) {
          next.delete(concert.show_id);
        } else {
          next.add(concert.show_id);
        }
        return next;
      });
    } else {
      setSelectedShow(concert);
    }
  }, [isDesktop]);
  
  const handleCloseModal = () => {
    setSelectedShow(null);
  };
  
  const handlePlayRequest = useCallback((videoId: string | null, infoForPlayer?: NowPlayingInfo) => {
    if (videoId && infoForPlayer) {
      setActiveVideoId(null);
      setTimeout(() => {
        setActiveVideoId(videoId);
        setNowPlayingInfo(infoForPlayer);
      }, 0);
    } else {
      setActiveVideoId(null);
      setNowPlayingInfo(null);
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setItemsInCardState(new Set());
    setSelectedShow(null);
    const filterElement = document.getElementById('filter-bar');
    if (filterElement) {
      filterElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  let lastDate = '';

  return (
    <div className="flex flex-col">
    <div className="hidden lg:block">
      <LargerHero />
    </div>
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-6 flex flex-col lg:flex-row gap-6 xl:gap-8 pb-12 -mt-4 md:mt-0">
      <div className="w-full lg:flex-grow min-w-0 order-2 lg:order-1">
        {error && (
          <div className="p-4 my-4 text-red-700 bg-red-100 border-red-400 rounded dark:bg-red-900 dark:text-red-200 dark:border-red-700" role="alert">
            <p className="font-bold">Error:</p> <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        )}
          <SimpleFilterBar 
            filters={filters}
            onFilterChange={handleFilterChange}
            resultCount={showsData?.shows?.length}
            totalCount={showsData?.totalCount}
          />
          {isLoading && concertsWithMappedData.length === 0 ? (
            <div className="text-center py-20"><p className="text-lg text-neutral-500 dark:text-neutral-400">Loading shows...</p></div>
          ) : !error && concertsWithMappedData.length === 0 ? (
            <div className="text-center py-20"><p className="text-lg text-neutral-500 dark:text-neutral-400">No shows match criteria.</p></div>
          ) : (
            <>
              <div id="concert-list-container" className="bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-700 p-1">
                {(isLoading && showsData && showsData.shows.length > 0) && <div className="p-4 text-center text-neutral-400">Updating list...</div>}
                
                {concertsWithMappedData.map((concert) => {
                  const showDateSeparator = concert.show_date !== lastDate;
                  if (showDateSeparator) {
                    lastDate = concert.show_date;
                  }
                  return (
                    <React.Fragment key={concert.show_id}>
                      {showDateSeparator && (
                        <div className="bg-neutral-800 border-b border-t border-neutral-700 px-4 py-2">
                          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            {formatDateSeparator(concert.show_date)}
                          </h3>
                        </div>
                      )}
                      <ConcertGridRowWrapper 
                        concert={concert} 
                        onShowSelect={() => handleShowSelect(concert)}
                        onPlayRequest={handlePlayRequest}
                        isExpanded={itemsInCardState.has(concert.show_id)}
                        isDesktop={isDesktop}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
              {(showsData && showsData.totalCount > ITEMS_PER_PAGE) && (
                <PaginationControls currentPage={currentPage} totalPages={Math.ceil(showsData.totalCount / ITEMS_PER_PAGE)} onPageChange={handlePageChange} />
              )}
            </>
          )}
          <div className="mt-8 lg:hidden space-y-6">
            <RotatingPromoWidget />
            <EmailSignupSection />
          </div>
        </div>
        <aside className="w-full lg:w-[400px] xl:w-[480px] flex-shrink-0 order-1 lg:order-2">
          {isDesktop && (
            <RightSidebarContent activeVideoId={activeVideoId} nowPlayingInfo={nowPlayingInfo} />
          )}
        </aside>
      </div>
      {!isDesktop && selectedShow && (
        <FocusViewModal
          show={selectedShow}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}