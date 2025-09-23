// src/app/page.tsx
import { Suspense } from 'react';
import LargerHero from '@/components/ui/LargerHero';
import HomePageClient from '@/components/pages/HomePageClient';
import { ApiShowsResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ITEMS_PER_PAGE = 20;

// This function runs ON THE SERVER to fetch all necessary initial data
async function fetchInitialData(searchParams: { [key: string]: string | string[] | undefined }) {
  if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined.");
    return { 
      initialShows: null, 
      initialGenres: [], 
      initialVenues: [], 
      dailyBlurb: { headline: 'Configuration Error', blurb: 'The server is not properly configured.' } 
    };
  }

  const showsParams = new URLSearchParams({ page: '1', limit: ITEMS_PER_PAGE.toString() });
  
  const artistSearch = searchParams?.artistSearch;
  if (artistSearch) {
    showsParams.set('artistSearch', artistSearch as string);
  } else {
    // Default to showing shows from today onwards if no search is active
    showsParams.set('startDate', new Date().toISOString().split('T')[0]);
  }

  const showsUrl = `${API_BASE_URL}/shows?${showsParams.toString()}`;
  const genresUrl = `${API_BASE_URL}/parent-genres`;
  const venuesUrl = `${API_BASE_URL}/venues-ga`;
  const blurbUrl = `${API_BASE_URL}/daily-blurb`; // Corrected endpoint path

  try {
    const [showsRes, genresRes, venuesRes, blurbRes] = await Promise.all([
      fetch(showsUrl, { cache: 'no-store' }),
      fetch(genresUrl, { next: { revalidate: 3600 } }),
      fetch(venuesUrl, { next: { revalidate: 3600 } }),
      fetch(blurbUrl, { cache: 'no-store' })
    ]);

    const defaultBlurb = { headline: 'Live Music in Atlanta', blurb: "Discover the best upcoming shows in Atlanta. Check the list below for the latest concert announcements and find your next favorite artist." };

    const initialShows = showsRes.ok ? await showsRes.json() : null;
    const initialGenres = genresRes.ok ? await genresRes.json() : [];
    const initialVenues = venuesRes.ok ? await venuesRes.json() : [];
    const dailyBlurb = blurbRes.ok ? await blurbRes.json() : defaultBlurb;

    return { initialShows, initialGenres, initialVenues, dailyBlurb };

  } catch (error) {
    console.error("Failed to fetch initial page data:", error);
    return { 
      initialShows: null, 
      initialGenres: [], 
      initialVenues: [], 
      dailyBlurb: { headline: 'Error Loading Content', blurb: 'Could not connect to the server to load the daily update.' } 
    };
  }
}

const Loading = () => (
    <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-6 py-12">
        <div className="text-center py-20">
            <p className="text-lg text-neutral-400">Loading shows...</p>
        </div>
    </div>
);

// This is an async Server Component that receives searchParams from the URL
export default async function HomePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Data is fetched ON THE SERVER before any HTML is sent to the browser
  const { initialShows, initialGenres, initialVenues, dailyBlurb } = await fetchInitialData(searchParams);

  // Handle case where critical data (shows) fails to load
  if (!initialShows) {
    return (
        <div className="text-center text-red-400 py-40">
            <p className="text-xl font-semibold">Could Not Load Shows</p>
            <p className="text-neutral-300 mt-2">There was an issue fetching the initial concert data. Please try again later.</p>
        </div>
    );
  }
  
  return (
    <div className="flex flex-col">
      <div className="hidden lg:block"><LargerHero /></div>
      <Suspense fallback={<Loading />}>
        {/* All the fetched data is passed down to the client component as props */}
        <HomePageClient 
            initialShows={initialShows}
            initialGenres={initialGenres}
            initialVenues={initialVenues}
            dailyBlurb={dailyBlurb}
        />
      </Suspense>
    </div>
  );
}