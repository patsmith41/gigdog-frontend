// src/app/festivals/shaky-knees-2025/guides/music/page.tsx
import type { Metadata } from 'next';
import ArticleLayout from '@/components/ui/ArticleLayout';
import ArticleSection from '@/components/ui/ArticleSection';

// --- THIS IS THE FIX ---
// Instead of importing each file, we import from the folder's index.ts
import { FridayGems, SaturdayConflicts, JoeyValanceSpotlight } from '@/content/shaky-knees';
// --- END OF FIX ---

export const metadata: Metadata = {
  title: 'Music Guide & Features - Shaky Knees 2025 | GigDog',
};

export default function MusicGuidePage() {
  const articleMeta = {
    title: 'Music Guide & Features',
    subTitle: "Your guide to the sounds of Shaky Knees",
    heroImageUrl: 'https://images.unsplash.com/photo-1549401009-39f3a8b2e5b8?q=80&w=1200&auto-format&fit=crop',
  };
  const backLink = { href: '/festivals/shaky-knees-2025', label: 'Back to Shaky Knees Lineup' };

  // NOTE: You are missing the tocLinks definition here. Let's add it.
  const tocLinks = [
    { href: '#friday-gems', label: "Friday's Hidden Gems" },
    { href: '#saturday-conflicts', label: "Navigating Saturday's Schedule Conflicts" },
  ];

  return (
    <ArticleLayout meta={articleMeta} backLink={backLink} tocLinks={tocLinks}>

<ArticleSection
        id="jvb-spotlight" // This ID must match the href in tocLinks
        title="Artist Spotlight: The Future of Festival Culture"
        publishDate="August 9, 2025" // Update with the date
      >
        <JoeyValanceSpotlight />
      </ArticleSection>

      <ArticleSection
        id="friday-gems"
        title="Friday's Hidden Gems"
        publishDate="May 1, 2025"
      >
        <FridayGems />
      </ArticleSection>
      <ArticleSection
        id="saturday-conflicts"
        title="Navigating Saturday's Schedule Conflicts"
        publishDate="May 2, 2025"
      >
        <SaturdayConflicts />
      </ArticleSection>
    </ArticleLayout>
  );
}