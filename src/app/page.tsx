// src/app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ViewToggle from '@/components/ui/ViewToggle';
import ConcertGridRowWrapper from '@/components/concerts/ConcertGridRowWrapper';
import { ApiConcert, ApiNeighborhood, ApiShowsResponse, NeighborhoodMap } from '@/types'; // Using your existing types path

// --- Placeholder Components (to be created/fleshed out) ---

// FiltersBar: Renders horizontal filter dropdowns
interface FiltersBarProps {
  // We'll pass actual data and handlers later
  // genres: any[]; 
  // venues: any[];
  // onFilterChange: (filterType: string, value: string) => void;
}
const FiltersBar: React.FC<FiltersBarProps> = () => (
  <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
    {/* Placeholder Dropdowns - these will become real components */}
    <select className="p-2 border rounded bg-white dark:bg-neutral-800 text-sm min-w-[120px]">
      <option>All Genres</option>
    </select>
    <select className="p-2 border rounded bg-white dark:bg-neutral-800 text-sm min-w-[120px]">
      <option>All Venues</option>
    </select>
    <select className="p-2 border rounded bg-white dark:bg-neutral-800 text-sm min-w-[120px]">
      <option>All Dates</option>
    </select>
    {/* Add more filters like price if needed */}
  </div>
);

// RightSidebarContent: Placeholder for the content within the right sidebar
interface RightSidebarContentProps {
  activeVideoId: string | null;
}
const RightSidebarContent: React.FC<RightSidebarContentProps> = ({ activeVideoId }) => (
  <div className="space-y-6 sticky top-4">
    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
      {activeVideoId ? (
        // Basic IFrame for now - will be replaced by YouTubePlayer.tsx
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      ) : (
        <p className="text-white">YouTube Player</p>
      )}
    </div>
    <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
      <h3 className="font-semibold text-sm mb-1">Now Playing</h3>
      <p className="text-xs text-neutral-600 dark:text-neutral-400">
        {activeVideoId ? `Video ID: ${activeVideoId}` : "Select a show to play preview"}
      </p>
    </div>
    <div className="h-40 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center text-center p-2">
      <p className="text-neutral-500 dark:text-neutral-400">Featured Artist Placeholder</p>
    </div>
    <div className="h-60 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center text-center p-2">
      <p className="text-neutral-500 dark:text-neutral-400">Ad Space (300x250)</p>
    </div>
    <div className="h-96 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center text-center p-2">
      <p className="text-neutral-500 dark:text-neutral-400">Ad Space (300x600)</p>
    </div>
  </div>
);
// --- End Placeholder Components ---


export default function HomePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');
  const [showsData, setShowsData] = useState<ApiShowsResponse | null>(null);
  // const [rawNeighborhoods, setRawNeighborhoods] = useState<ApiNeighborhood[]>([]); // For filters later
  // const [rawVenues, setRawVenues] = useState<any[]>([]); // For filters later
  // const [rawGenres, setRawGenres] = useState<any[]>([]); // For filters later
  const [neighborhoodMap, setNeighborhoodMap] = useState<NeighborhoodMap>({});
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Placeholder for actual filter state that will be managed here
  // const [activeFilters, setActiveFilters] = useState({ /* ... */ });

  const fetchShows = useCallback(async () => {
    if (!API_BASE_URL) {
      setError("API URL is not configured.");
      setIsLoading(false);
      return;
    }
    // setIsLoading(true); // Set before Promise.all
    setError(null);
    console.log('Fetching concerts...');
    try {
      // TODO: Add actual filter query params from activeFilters state
      const response = await fetch(`${API_BASE_URL}/shows`); 
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }
      const data: ApiShowsResponse = await response.json();
      setShowsData(data);
    } catch (err: any) {
      setError(err.message);
      setShowsData(null);
    }
  }, [API_BASE_URL /*, activeFilters */]); // Add activeFilters when implemented

  const fetchAuxiliaryData = useCallback(async () => { // For neighborhoods, venues, genres
    if (!API_BASE_URL) return;
    try {
      // Fetch Neighborhoods
      const neighResponse = await fetch(`${API_BASE_URL}/neighborhoods`);
      if (neighResponse.ok) {
        const neighData: ApiNeighborhood[] = await neighResponse.json();
        // setRawNeighborhoods(neighData); // For passing to FiltersBar
        const map: NeighborhoodMap = {};
        neighData.forEach(n => { if (n.id && n.name) map[n.id] = n.name; });
        setNeighborhoodMap(map);
      } else {
        console.error('Failed to fetch neighborhoods');
      }
      // TODO: Fetch Venues for "All Venues" filter
      // const venueResponse = await fetch(`${API_BASE_URL}/venues`);
      // if (venueResponse.ok) setRawVenues(await venueResponse.json());
      
      // TODO: Fetch Genres for "All Genres" filter
      // const genreResponse = await fetch(`${API_BASE_URL}/genres`);
      // if (genreResponse.ok) setRawGenres(await genreResponse.json());

    } catch (err) {
      console.error("Error fetching auxiliary filter data:", err);
      // Optionally set a partial error state
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    const initialLoad = async () => {
      if (!API_BASE_URL) {
        setError("API URL is not configured (NEXT_PUBLIC_API_BASE_URL)");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      await Promise.all([
        fetchAuxiliaryData(),
        fetchShows()
      ]);
      setIsLoading(false);
    };
    initialLoad();
  }, [fetchShows, fetchAuxiliaryData, API_BASE_URL]);

  // Update this when activeFilters state is implemented
  // useEffect(() => {
  //   if (!isLoading) { // Avoid fetch on initial load if already done
  //     fetchShows();
  //   }
  // }, [activeFilters, fetchShows, isLoading]);


  const concertsWithMappedData = showsData?.shows?.map(concert => ({
    ...concert,
    venue: concert.venue && concert.venue.neighborhood_id
      ? {
          ...concert.venue,
          neighborhood_name: neighborhoodMap[concert.venue.neighborhood_id] || "Unknown"
        }
      : concert.venue,
  })) || [];

  const handlePlayShowInSidebar = (videoId: string | null) => {
    if (videoId) {
      console.log("Setting active video in sidebar:", videoId);
      setActiveVideoId(videoId);
    }
  };
  
  // TODO: handleFilterChange function to update activeFilters state

  return (
    <div className="flex flex-col text-neutral-900 dark:text-neutral-100">
      {/* Section for "Upcoming Shows" title, View Toggle, and Filters Bar */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Upcoming Shows <span className="text-neutral-500 dark:text-neutral-400">in Atlanta</span>
          </h1>
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        <FiltersBar 
          // Pass props when ready:
          // genres={rawGenres} 
          // venues={rawVenues}
          // onFilterChange={handleFilterChange} 
        />
      </section>

      {/* Main 2-Column Content Zone */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 xl:gap-8 pb-12">
        {/* Left Column: Concert List (Adjusted width based on "ConcertCal") */}
        <div className="w-full lg:flex-grow min-w-0"> {/* flex-grow to take most space, min-w-0 for flex child */}
          {error && (
            <div className="p-4 my-4 text-red-700 bg-red-100 border border-red-400 rounded dark:bg-red-900 dark:text-red-200 dark:border-red-700" role="alert">
              <p className="font-bold">Error:</p>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-lg text-neutral-500 dark:text-neutral-400">Loading shows...</p>
            </div>
          ) : !error && concertsWithMappedData.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-neutral-500 dark:text-neutral-400">No shows match your criteria.</p>
            </div>
          ) : (
            <div className={`${
                viewMode === 'grid' ? 'bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-700' 
                                    : 'space-y-4 md:space-y-6' // For card view
            }`}>
              {/* If grid, we might have a header div here if we bring it back, otherwise, just rows */}
              {/* For now, ConcertGridRowWrapper handles its own top/bottom borders if it's a grid row */}
              {concertsWithMappedData.map((concert) => (
                <ConcertGridRowWrapper 
                  key={concert.show_id} 
                  concert={concert} 
                  currentViewMode={viewMode}
                  onPlayRequest={handlePlayShowInSidebar} // Pass the handler
                />
              ))}
            </div>
          )}
          {/* TODO: Pagination */}
        </div>

        {/* Right Column: Sidebar (Fixed width example like "ConcertCal") */}
        <aside className="w-full lg:w-[340px] xl:w-[360px] flex-shrink-0"> {/* Fixed width for sidebar */}
          <RightSidebarContent 
            activeVideoId={activeVideoId}
          />
        </aside>
      </div>
    </div>
  );
}