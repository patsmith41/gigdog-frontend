// src/app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';

import ViewToggle from '@/components/ui/ViewToggle';
import ConcertGridRowWrapper from '@/components/concerts/ConcertGridRowWrapper';
import PaginationControls from '@/components/ui/PaginationControls';
import {
  ApiConcert,
  ApiNeighborhood,
  ApiShowsResponse,
  NeighborhoodMap,
  ApiFilterVenue,
  ApiFilterGenre
} from '@/types';

// --- Constants ---
const ITEMS_PER_PAGE = 20;

// --- In-page Placeholder Components (FiltersBar & RightSidebarContent) ---
interface FiltersBarProps {
  genres: ApiFilterGenre[];
  venues: ApiFilterVenue[];
}
const FiltersBar: React.FC<FiltersBarProps> = ({ genres, venues }) => (
  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-6 md:mb-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow">
    <select className="p-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-sm min-w-[150px] flex-grow sm:flex-grow-0">
      <option value="">All Genres</option>
      {genres?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
    </select>
    <select className="p-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-sm min-w-[150px] flex-grow sm:flex-grow-0">
      <option value="">All Venues</option>
      {venues?.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
    </select>
    <select className="p-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-sm min-w-[150px] flex-grow sm:flex-grow-0">
      <option value="">All Dates</option>
    </select>
  </div>
);

interface RightSidebarContentProps {
  activeVideoId: string | null;
}
const RightSidebarContent: React.FC<RightSidebarContentProps> = ({ activeVideoId }) => (
  <div className="space-y-6 sticky top-4 md:top-6 lg:top-8"> {/* Adjust top-* to match header height + desired gap */}
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden">
      <div className="aspect-video bg-black">
        {activeVideoId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&modestbranding=1&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-500">
            <p>Select a show to preview</p>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
        <h3 className="font-semibold text-sm truncate">{activeVideoId ? `Previewing Video` : "Now Playing"}</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{activeVideoId ? `ID: ${activeVideoId}` : "No video selected"}</p>
      </div>
    </div>
    <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-md">
      <h3 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-2 text-sm">Featured Artist</h3>
      <div className="h-20 bg-neutral-100 dark:bg-neutral-700 rounded flex items-center justify-center"><p className="text-neutral-400 dark:text-neutral-500 text-xs">Artist Info</p></div>
    </div>
    {/* ... Ad placeholders ... */}
  </div>
);
// --- End In-page Placeholder Components ---

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');
  const [showsData, setShowsData] = useState<ApiShowsResponse | null>(null);
  const [rawNeighborhoods, setRawNeighborhoods] = useState<ApiNeighborhood[]>([]);
  const [rawVenues, setRawVenues] = useState<ApiFilterVenue[]>([]);
  const [rawGenres, setRawGenres] = useState<ApiFilterGenre[]>([]);
  const [neighborhoodMap, setNeighborhoodMap] = useState<NeighborhoodMap>({});
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchShows = useCallback(async (page: number) => {
    if (!API_BASE_URL) { setError("API URL is not configured..."); setIsLoading(false); return; }
    setIsLoading(true); setError(null);
    const queryParams = new URLSearchParams({ page: page.toString(), limit: ITEMS_PER_PAGE.toString() });
    try {
      const response = await fetch(`${API_BASE_URL}/shows?${queryParams.toString()}`);
      if (!response.ok) { const ed = await response.json().catch(()=>({})); throw new Error(ed.error || `API Error: ${response.status}`);}
      const data: ApiShowsResponse = await response.json();
      setShowsData(data);
    } catch (err: any) { setError(err.message); setShowsData(null); } 
    finally { setIsLoading(false); }
  }, [API_BASE_URL]);

  const fetchFilterData = useCallback(async () => { /* ... as before ... */ }, [API_BASE_URL]);
  useEffect(() => { /* ... initial load ... */ }, [fetchFilterData, fetchShows, API_BASE_URL]);
  const concertsWithMappedData = showsData?.shows?.map(c => ({...c, venue: c.venue && c.venue.neighborhood_id ? {...c.venue, neighborhood_name: neighborhoodMap[c.venue.neighborhood_id] || "Unknown"} : c.venue })) || [];
  const handlePlayRequest = useCallback((vid: string | null) => { if (vid) setActiveVideoId(vid); }, []);
  const handlePageChange = (np: number) => { setCurrentPage(np); fetchShows(np); /* ... scroll logic ... */};

  return (
    <div className="flex flex-col text-neutral-900 dark:text-neutral-100">
      <section className="max-w-screen-xl mx-auto w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* ... Title, ViewToggle, FiltersBar ... */}
         <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Upcoming Shows <span className="font-normal text-neutral-500 dark:text-neutral-400">in Atlanta</span>
          </h1>
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        <FiltersBar genres={rawGenres} venues={rawVenues} />
      </section>

      {/* Main 2-Column Content Zone - Overall max-width and centered */}
      <div className="max-w-screen-xl mx-auto w-full px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 pb-12"> {/* Ensure gap for spacing */}
        
        {/* Left Column: Concert List */}
        {/* flex-grow allows it to take space, max-w caps it, min-w-0 for proper flex behavior */}
        <div className="w-full lg:flex-grow min-w-0 order-2 lg:order-1 lg:max-w-3xl xl:max-w-4xl"> {/* <<< TRY THESE MAX-WIDTHS (e.g., 3xl=768px, 4xl=896px) */}
          {/* ... Error, Loading, No Shows, and Concert List Mapping logic ... */}
          {error && ( <div className="p-4 my-4 text-red-700 bg-red-100 rounded">Error...</div> )}
          {isLoading && (!showsData || showsData.shows.length === 0) ? ( <div className="text-center py-20">Loading...</div> )
           : !error && concertsWithMappedData.length === 0 ? ( <div className="text-center py-20">No shows...</div> )
           : ( 
            <>
              <div id="concert-list-container" className={`${ viewMode === 'grid' ? 'bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700' : 'space-y-4 md:space-y-6'}`}>
                {isLoading && showsData && showsData.shows.length > 0 && <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">Updating list...</div>}
                {concertsWithMappedData.map((concert) => (
                  <ConcertGridRowWrapper key={concert.show_id} concert={concert} currentViewMode={viewMode} onPlayRequest={handlePlayRequest} />
                ))}
              </div>
              {showsData && showsData.totalCount > ITEMS_PER_PAGE && (
                <PaginationControls currentPage={currentPage} totalPages={Math.ceil(showsData.totalCount / ITEMS_PER_PAGE)} onPageChange={handlePageChange} />
              )}
            </>
            )
           }
        </div>

        {/* Right Column: Sidebar */}
        {/* Explicit fixed width for lg and xl. flex-shrink-0 is important. */}
        <aside className="w-full lg:w-[420px] xl:w-[480px] lg:flex-shrink-0 order-1 lg:order-2"> {/* <<< TRY THESE FIXED WIDTHS */}
          <RightSidebarContent
            activeVideoId={activeVideoId}
          />
        </aside>
      </div>
    </div>
  );
}