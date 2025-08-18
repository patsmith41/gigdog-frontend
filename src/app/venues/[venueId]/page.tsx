// src/app/venues/[venueId]/page.tsx
'use client'; // <-- ADDED: Convert this to a Client Component to use hooks and onClick

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation'; // <-- ADDED: useParams hook
import { MapPin, Globe, ParkingCircle, Utensils, Info, Users } from 'lucide-react';
import { RichShow } from '@/types'; // <-- ADDED: Import our correct type
import { format } from 'date-fns';
import { trackClick } from '@/utils/analytics'; // <-- ADDED: Import tracking utility
import React, { useState, useEffect } from 'react'; // <-- ADDED: useState and useEffect

// The VenueDetails type (no changes)
interface VenueDetails {
    id: string; name: string; city: string; state: string; address: string | null;
    website: string | null; description: string | null; google_place_id: string | null;
    parking_info: string | null; food_options: string | null; venue_tips: string | null;
    capacity: number | null;
}

// The page data type (no changes)
interface VenuePageData {
  venueDetails: VenueDetails;
  upcomingShows: RichShow[];
}

// --- Main Page Component ---
export default function VenuePage() {
  const params = useParams(); // Use the hook to get params in a Client Component
  const venueId = Array.isArray(params.venueId) ? params.venueId[0] : params.venueId;

  // State for data, loading, and errors
  const [data, setData] = useState<VenuePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Data fetching is now done inside a useEffect hook
    const getVenueData = async () => {
      if (!venueId) return;
      setLoading(true);
      setError(null);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!API_BASE_URL) {
        setError("API URL is not configured.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/venues/${venueId}`);
        if (res.status === 404) {
          notFound(); // Trigger 404 page
          return;
        }
        if (!res.ok) throw new Error(`Failed to fetch venue data: ${res.statusText}`);
        const fetchedData = await res.json();
        setData(fetchedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getVenueData();
  }, [venueId]); // Re-run effect if the venueId changes

  // --- RENDER STATES ---
  if (loading) {
    return <div className="text-center text-white py-40">Loading venue details...</div>;
  }
  if (error || !data) {
    return <div className="text-center text-red-400 py-40">Error loading venue: {error || 'Data not found.'}</div>;
  }
  // --- END RENDER STATES ---

  const { venueDetails, upcomingShows } = data;

  return (
    <main className="bg-neutral-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white">
            {venueDetails.name}
          </h1>
          <p className="mt-2 text-lg md:text-xl text-neutral-400">
            {venueDetails.city}, {venueDetails.state}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold border-b border-neutral-700 pb-3 mb-6">Upcoming Shows</h2>
            {upcomingShows.length > 0 ? (
              <div className="space-y-1">
                {upcomingShows.map(concert => (
                  <Link 
                    key={concert.show_id}
                    href={`/shows/${concert.show_id}`}
                    onClick={() => trackClick({
                        linkType: 'show_info_page',
                        targetUrl: `/shows/${concert.show_id}`,
                        sourceComponent: 'VenuePage_ShowList',
                        showId: concert.show_id,
                        artistId: concert.artist_id,
                        venueId: venueDetails.id
                    })}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-neutral-900 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-neutral-400">
                        {format(new Date(concert.show_date.replace(/-/g, '/')), 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-lg font-semibold text-white truncate" title={concert.artist_name}>
                        {concert.artist_name}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {concert.min_price ? (
                        <span className="font-bold text-green-400">${concert.min_price}</span>
                      ) : (
                        <span className="text-sm text-neutral-500">Info</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-neutral-900 rounded-lg border border-neutral-800">
                <p className="text-neutral-400">No upcoming shows are currently listed for this venue.</p>
                <p className="text-sm text-neutral-500 mt-2">Check back soon for updates!</p>
              </div>
            )}
          </div>

          <aside className="space-y-8 lg:sticky top-24 self-start">
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 space-y-4">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-neutral-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">Address</h3>
                  <p className="text-neutral-300">{venueDetails.address || 'Not available'}</p>
                </div>
              </div>
              {venueDetails.website && (
                <div className="flex items-start gap-4">
                  <Globe size={20} className="text-neutral-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white">Website</h3>
                    <a 
                      href={venueDetails.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => trackClick({
                          linkType: 'venue_website',
                          targetUrl: venueDetails.website || '#',
                          sourceComponent: 'VenuePage_Sidebar',
                          venueId: venueDetails.id
                      })}
                      className="text-indigo-400 hover:underline break-all">
                      {venueDetails.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 space-y-6">
               <h3 className="text-lg font-bold text-white">Venue Guide</h3>
               {(venueDetails.parking_info || venueDetails.food_options || venueDetails.venue_tips) ? (
                 <>
                   {venueDetails.parking_info && <GuideSection icon={<ParkingCircle size={20} />} title="Parking" content={venueDetails.parking_info} />}
                   {venueDetails.food_options && <GuideSection icon={<Utensils size={20} />} title="Food & Drink" content={venueDetails.food_options} />}
                   {venueDetails.venue_tips && <GuideSection icon={<Info size={20} />} title="Tips & Info" content={venueDetails.venue_tips} />}
                 </>
               ) : (
                 <p className="text-sm text-neutral-400 italic">Venue guide information coming soon.</p>
               )}
            </div>
            
            {venueDetails.google_place_id && (
              <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 aspect-video">
                <iframe
                  title={`Map of ${venueDetails.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:${venueDetails.google_place_id}`}
                ></iframe>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

// Helper component for the guide sections (remains the same)
const GuideSection = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string | null}) => (
  <div className="flex items-start gap-4">
    <div className="text-neutral-500 mt-1 flex-shrink-0">{icon}</div>
    <div>
      <h4 className="font-semibold text-white">{title}</h4>
      <p className="text-neutral-300 text-sm whitespace-pre-line">
        {content || 'Information coming soon.'}
      </p>
    </div>
  </div>
);