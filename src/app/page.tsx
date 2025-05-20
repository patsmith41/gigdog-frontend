// src/app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';

import ViewToggle from '@/components/ui/ViewToggle';
import ConcertGridRowWrapper from '@/components/concerts/ConcertGridRowWrapper';
import PaginationControls from '@/components/ui/PaginationControls'; // Import PaginationControls
import {
  ApiConcert,
  ApiNeighborhood,
  ApiShowsResponse,
  NeighborhoodMap,
  ApiVenue, // For venue filter
  ApiGenre  // For genre filter
} from '@/types';

// --- Constants ---
const ITEMS_PER_PAGE = 20; // Or your preferred number

// --- In-page Placeholder Components (These will be moved to their own files later) ---

// FiltersBar: Renders horizontal filter dropdowns
interface FiltersBarProps {
  genres: ApiGenre[];
  venues: ApiVenue[];
  // TODO: Add props for selected date filter values and all filter change handlers
  // onFilterChange: (filterType: string, value: string) => void;
}
const FiltersBar: React.FC<FiltersBarProps> = ({ genres, venues }) => (
  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-6 md:mb-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow">
    <select
      className="p-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-sm min-w-[150px] flex-grow sm:flex-grow-0"
      // onChange={(e) => onFilterChange('genre', e.target.value)}
    >
      <option value="">All Genres</option>
      {genres?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
    </select>
    <select
      className="p-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-sm min-w-[150px] flex-grow sm:flex-grow-0"
      // onChange={(e) => onFilterChange('venue', e.target.value)}
    >
      <option value="">All Venues</option>
      {venues?.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
    </select>
    <select
      className="p-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-sm min-w-[150px] flex-grow sm:flex-grow-0"
      // onChange={(e) => onFilterChange('date', e.target.value)}
    >
      <option value="">All Dates</option>
      {/* TODO: Populate date options (e.g., Today, Tomorrow, This Weekend) */}
    </select>
    {/* TODO: Add Price filter if desired based on "ConcertCal" grid */}
    {/* TODO: Add Sort By dropdown */}
  </div>
);

// RightSidebarContent: Content for the right sidebar
interface RightSidebarContentProps {
  activeVideoId: string | null;
  // TODO: Pass data for active concert's title/artist for "Now Playing"
  // activeConcertTitle?: string | null;
}
const RightSidebarContent: React.FC<RightSidebarContentProps> = ({ activeVideoId }) => (
  <div className="space-y-6 sticky top-4 md:top-6 lg:top-8"> {/* Sticky relative to its parent's padding */}
    {/* YouTube Player Area */}
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
      {/* "Now Playing" Info - TODO: Make dynamic */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
        <h3 className="font-semibold text-sm truncate">
          {activeVideoId ? `Previewing Video` : "Now Playing"}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {activeVideoId ? `ID: ${activeVideoId}` : "No video selected"}
        </p>
      </div>
    </div>

    {/* Featured Artist Placeholder */}
    <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-md">
      <h3 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-2 text-sm">Featured Artist</h3>
      <div className="h-20 bg-neutral-100 dark:bg-neutral-700 rounded flex items-center justify-center">
        <p className="text-neutral-400 dark:text-neutral-500 text-xs">Artist Info</p>
      </div>
    </div>

    {/* Ad Placeholders */}
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-md text-center">
      <div className="p-1 text-xs text-neutral-400 dark:text-neutral-500 border-b border-neutral-200 dark:border-neutral-700">ADVERTISEMENT</div>
      <div className="h-[250px] bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center m-2 rounded">
        <p className="text-neutral-500 dark:text-neutral-400">Ad Space (300x250)</p>
      </div>
    </div>
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-md text-center">
      <div className="p-1 text-xs text-neutral-400 dark:text-neutral-500 border-b border-neutral-200 dark:border-neutral-700">ADVERTISEMENT</div>
      <div className="h-[600px] bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center m-2 rounded">
        <p className="text-neutral-500 dark:text-neutral-400">Ad Space (300x600)</p>
      </div>
    </div>
  </div>
);
// --- End In-page Placeholder Components ---


export default function HomePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');
  const [showsData, setShowsData] = useState<ApiShowsResponse | null>(null);
  const [rawNeighborhoods, setRawNeighborhoods] = useState<ApiNeighborhood[]>([]);
  const [rawVenues, setRawVenues] = useState<ApiVenue[]>([]);
  const [rawGenres, setRawGenres] = useState<ApiGenre[]>([]);
  const [neighborhoodMap, setNeighborhoodMap] = useState<NeighborhoodMap>({});
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // TODO: Define activeFilters state and incorporate into fetchShows
  // const [activeFilters, setActiveFilters] = useState({ /* startDate, endDate, venueId, etc. */ });

  const fetchShows = useCallback(async (page: number) => { // Accepts page number
    if (!API_BASE_URL) {
      setError("API URL is not configured. Set NEXT_PUBLIC_API_BASE_URL in .env.local");
      setIsLoading(false); return;
    }
    setIsLoading(true);
    setError(null);
    console.log(`Fetching concerts for page ${page}, limit ${ITEMS_PER_PAGE}...`);
    try {
      // TODO: Add other activeFilters to the query string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        // ...append other filters from activeFilters state here
      });
      const response = await fetch(`${API_BASE_URL}/shows?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
        throw new Error(errorData.error || `API error fetching shows: ${response.status}`);
      }
      const data: ApiShowsResponse = await response.json();
      console.log('API Shows Response:', data);
      setShowsData(data); // Replace current showsData with the new page's data
    } catch (err: any) {
      setError(err.message);
      setShowsData(null); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL /*, activeFilters */]); // Add activeFilters if it's used in queryParams

  const fetchFilterData = useCallback(async () => {
    if (!API_BASE_URL) return;
    // This function remains largely the same
    console.log('Fetching filter data (neighborhoods, venues, genres)...');
    try {
      const [neighResponse, venueResponse, genreResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/neighborhoods`),
        fetch(`${API_BASE_URL}/venues`),
        fetch(`${API_BASE_URL}/genres`)
      ]);

      if (neighResponse.ok) {
        const neighData: ApiNeighborhood[] = await neighResponse.json();
        setRawNeighborhoods(neighData);
        const map: NeighborhoodMap = {};
        neighData.forEach(n => { if (n.id && n.name) map[n.id] = n.name; });
        setNeighborhoodMap(map);
      } else { console.error('Failed to fetch neighborhoods'); }

      if (venueResponse.ok) {
        const venueData: ApiVenue[] = await venueResponse.json();
        setRawVenues(venueData);
      } else { console.error('Failed to fetch venues'); }

      if (genreResponse.ok) {
        const genreData: ApiGenre[] = await genreResponse.json();
        setRawGenres(genreData);
      } else { console.warn('Failed to fetch genres - /api/genres endpoint might be needed.'); }

    } catch (err) {
      console.error("Error fetching auxiliary filter data:", err);
      setError(prev => prev ? `${prev}\nFailed to load some filter options.` : 'Failed to load some filter options.');
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    // Initial data load for page 1 and filter data
    if (!API_BASE_URL) {
      setError("API URL is not configured (NEXT_PUBLIC_API_BASE_URL)");
      setIsLoading(false); return;
    }
    const loadInitialData = async () => {
      setIsLoading(true); // Set loading before async operations
      await Promise.all([
        fetchFilterData(),
        fetchShows(1) // Fetch page 1 on initial load
      ]);
      // setIsLoading(false); // isLoading is set to false inside fetchShows
    };
    loadInitialData();
  }, [fetchFilterData, fetchShows, API_BASE_URL]); // Dependencies for initial load

  // TODO: Implement handleFilterChange to reset currentPage to 1 and call fetchShows(1, newFilters)


  const concertsWithMappedData = showsData?.shows?.map(concert => ({
    ...concert,
    venue: concert.venue && concert.venue.neighborhood_id
      ? { ...concert.venue, neighborhood_name: neighborhoodMap[concert.venue.neighborhood_id] || "Unknown" }
      : concert.venue,
  })) || [];

  const handlePlayRequest = useCallback((videoId: string | null) => {
    if (videoId) {
      console.log("HomePage: Setting active video in sidebar:", videoId);
      setActiveVideoId(videoId);
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchShows(newPage);
    // Scroll to the top of the concert list container
    const concertListElement = document.getElementById('concert-list-container');
    if (concertListElement) {
      // Get header height to offset scroll
      const headerElement = document.querySelector('header'); // Assuming your header has a <header> tag
      const headerHeight = headerElement ? headerElement.offsetHeight : 0;
      const elementPosition = concertListElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 20; // 20px buffer

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col text-neutral-900 dark:text-neutral-100">
      {/* Section for "Upcoming Shows" title, View Toggle, and Filters Bar */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Upcoming Shows <span className="font-normal text-neutral-500 dark:text-neutral-400">in Atlanta</span>
          </h1>
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        <FiltersBar
          genres={rawGenres}
          venues={rawVenues}
          // onFilterChange={handleFilterChange}
        />
      </section>

      {/* Main 2-Column Content Zone */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 xl:gap-8 pb-12">
        {/* Left Column: Concert List */}
        <div className="w-full lg:flex-grow min-w-0 order-2 lg:order-1">
          {error && (
            <div className="p-4 my-4 text-red-700 bg-red-100 border border-red-400 rounded dark:bg-red-900 dark:text-red-200 dark:border-red-700" role="alert">
              <p className="font-bold">Error:</p>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {isLoading && (!showsData || showsData.shows.length === 0) ? ( // Show main loading only if no data yet
            <div className="text-center py-20">
              <p className="text-lg text-neutral-500 dark:text-neutral-400">Loading shows...</p>
            </div>
          ) : !error && concertsWithMappedData.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-neutral-500 dark:text-neutral-400">No shows match your criteria.</p>
            </div>
          ) : (
            <>
              <div
                id="concert-list-container" // Added ID for scrolling
                className={`${
                  viewMode === 'grid' ? 'bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700'
                                      : 'space-y-4 md:space-y-6'
                }`}
              >
                {isLoading && <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">Updating list...</div>} {/* Loading indicator for page changes */}
                {concertsWithMappedData.map((concert) => (
                  <ConcertGridRowWrapper
                    key={concert.show_id}
                    concert={concert}
                    currentViewMode={viewMode}
                    onPlayRequest={handlePlayRequest}
                  />
                ))}
              </div>

              {showsData && showsData.totalCount > ITEMS_PER_PAGE && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={Math.ceil(showsData.totalCount / ITEMS_PER_PAGE)}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <aside className="w-full lg:w-[340px] xl:w-[360px] flex-shrink-0 order-1 lg:order-2">
          <RightSidebarContent
            activeVideoId={activeVideoId}
          />
        </aside>
      </div>
    </div>
  );
}