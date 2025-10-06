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
          // --- 1. THE CONTAINER IS NOW RESPONSIVE ---
          // It's a flex column (list) by default, and becomes a grid on medium screens and up.
          <div className="flex flex-col space-y-2 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4 md:space-y-0">
            {venues.map((venue) => (
              <Link
                key={venue.id}
                href={`/venues/${venue.id}`}
                // --- 2. THE LINK STYLING IS NOW RESPONSIVE ---
                // Default: List item style (horizontal, left-aligned)
                // md:*: Box style (vertical, centered)
                className="group flex items-center text-left p-4 bg-neutral-900 rounded-lg border border-neutral-800 hover:bg-neutral-800 transition-colors duration-200 md:flex-col md:items-center md:justify-center md:text-center md:p-6 md:hover:border-indigo-500 md:transform md:hover:-translate-y-1"
              >
                {/* --- 3. THE ICON IS NOW RESPONSIVE --- */}
                {/* It has different size and margins for mobile vs. desktop */}
                <Building className="text-neutral-500 group-hover:text-indigo-400 transition-colors w-6 h-6 mr-4 flex-shrink-0 md:w-8 md:h-8 md:mr-0 md:mb-3" />
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