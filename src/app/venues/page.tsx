// src/app/venues/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Venues | GigDog',
  description: 'Browse all live music venues in Atlanta covered by GigDog.',
};

interface Venue {
  id: string;
  name: string;
}

// Fetch data directly on the server
async function getVenues(): Promise<Venue[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!API_BASE_URL) {
    console.error("API URL is not configured.");
    return [];
  }
  try {
    const res = await fetch(`${API_BASE_URL}/venues-ga`, {
      // Use cache revalidation to keep the list fresh
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch venues');
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching venues:", error);
    return []; // Return an empty array on error
  }
}

export default async function VenuesPage() {
  const venues = await getVenues();

  return (
    <main className="bg-neutral-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white">
            All Venues
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
            Discover your next favorite spot for live music in Atlanta.
          </p>
        </header>

        {venues && venues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {venues.map((venue) => (
              <Link
                key={venue.id}
                href={`/venues/${venue.id}`} // This links to your EXISTING [venueId] page
                className="group flex flex-col items-center justify-center text-center p-6 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-indigo-500 hover:bg-indigo-900/20 transform hover:-translate-y-1 transition-all duration-200"
              >
                <Building size={32} className="text-neutral-500 group-hover:text-indigo-400 mb-3 transition-colors" />
                <h2 className="font-semibold text-lg text-neutral-100 group-hover:text-white leading-tight">
                  {venue.name}
                </h2>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-neutral-900 rounded-lg border border-neutral-800">
            <p className="text-neutral-400">Could not load venues at this time.</p>
            <p className="text-sm text-neutral-500 mt-2">Please check back later.</p>
          </div>
        )}
      </div>
    </main>
  );
}