// src/app/festivals/shaky-knees-2025/guides/travel/page.tsx
import type { Metadata } from 'next';
import ArticleLayout from '@/components/ui/ArticleLayout';
import ArticleSection from '@/components/ui/ArticleSection';
import { TocLink } from '@/components/ui/TableOfContents';
import { ParkingTips, MartaGuide, } from '@/content/shaky-knees';

export const metadata: Metadata = {
  title: 'Travel & Lodging Guide - Shaky Knees 2025 | GigDog',
};

export default function TravelGuidePage() {
  const articleMeta = {
    title: 'Travel & Lodging Guide',
    subTitle: 'Getting to, from, and staying for Shaky Knees 2025',
    heroImageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto-format&fit=crop',
  };
  const backLink = { href: '/festivals/shaky-knees-2025', label: 'Back to Shaky Knees Lineup' };

  const tocLinks: TocLink[] = [
    { href: '#parking-tips', label: 'Parking Information & Tips' },
    { href: '#marta-guide', label: 'Using MARTA (Public Transit)' },
    { href: '#hotel-guide', label: 'Where to Stay' },
  ];

  return (
    <ArticleLayout meta={articleMeta} backLink={backLink} tocLinks={tocLinks}>
      <ArticleSection id="parking-tips" title="Parking Information & Tips" publishDate="May 1, 2025">
        <ParkingTips />
      </ArticleSection>

      <ArticleSection id="marta-guide" title="Using MARTA (Public Transit)" publishDate="May 1, 2025">
        <MartaGuide />
      </ArticleSection>

      
    </ArticleLayout>
  );
}