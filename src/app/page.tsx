// src/app/page.tsx
import { Suspense } from 'react';
import LargerHero from '@/components/ui/LargerHero';
import HomePageClient from '../components/pages/HomePageClient'; // Import the new client component

// This is a simple placeholder for the loading UI
const Loading = () => {
    return (
        <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-6 py-12">
            <div className="text-center py-20">
                <p className="text-lg text-neutral-400">Loading shows...</p>
            </div>
        </div>
    );
};

export default function HomePage() {
  // This is now a Server Component. It contains NO hooks.
  // Its only job is to render the layout and the client component inside a Suspense boundary.
  return (
    <div className="flex flex-col">
      <div className="hidden lg:block"><LargerHero /></div>
      
      <Suspense fallback={<Loading />}>
        <HomePageClient />
      </Suspense>
    </div>
  );
}