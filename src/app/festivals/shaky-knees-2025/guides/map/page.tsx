// src/app/festivals/shaky-knees-2025/guides/map/page.tsx
import type { Metadata } from 'next';
import ArticleLayout from '@/components/ui/ArticleLayout';
import ArticleSection from '@/components/ui/ArticleSection';

// You can add table of contents links here later if the map has multiple sections
import { TocLink } from '@/components/ui/TableOfContents';

export const metadata: Metadata = {
  title: 'Festival Map - Shaky Knees 2025 | GigDog',
  description: 'Find your way around Shaky Knees 2025 with the official festival map. Locate stages, food vendors, restrooms, and more.',
};

export default function FestivalMapPage() {
  // --- Page Metadata for the Article Layout ---
  const articleMeta = {
    title: 'Festival Map',
    subTitle: 'Your guide to navigating Shaky Knees 2025',
    // Using a generic festival image as a placeholder hero
    heroImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto-format&fit=crop',
  };

  // --- Link to go back to the main festival page ---
  const backLink = { href: '/festivals/shaky-knees-2025', label: 'Back to Shaky Knees Lineup' };

  // --- Table of Contents (can be expanded later) ---
  const tocLinks: TocLink[] = [
    { href: '#map-placeholder', label: 'Official 2025 Map' },
  ];

  return (
    <ArticleLayout meta={articleMeta} backLink={backLink} tocLinks={tocLinks}>
      <ArticleSection
        id="map-placeholder"
        title="Official 2025 Festival Map"
        publishDate="May 1, 2025"
      >
        <div className="text-center bg-neutral-800 p-8 rounded-lg">
          <p className="text-xl text-neutral-300">
            The official map for Shaky Knees 2025 will be uploaded here as soon as it's released by the festival organizers.
          </p>
          <p className="mt-4 text-neutral-400">
            Check back closer to the festival dates for the full layout, including stage locations, food courts, restrooms, and other points of interest!
          </p>
        </div>
      </ArticleSection>
    </ArticleLayout>
  );
}