// src/app/festivals/shaky-knees-2025/guides/food-guide/page.tsx
import type { Metadata } from 'next';
import ArticleLayout from '@/components/ui/ArticleLayout';
import ArticleSection from '@/components/ui/ArticleSection';
import { TocLink } from '@/components/ui/TableOfContents';

import { InsideTheFestEats } from '@/content/shaky-knees';

export const metadata: Metadata = {
  title: 'Food & Drink Guide - Shaky Knees 2025 | GigDog',
};

export default function FoodGuidePage() {
  const articleMeta = {
    title: 'Food & Drink Guide',
    subTitle: 'The best eats for your festival weekend',
    heroImageUrl: 'https://images.unsplash.com/photo-1623351933582-70b393555a2b?q=80&w=1200&auto-format&fit=crop',
  };
  const backLink = { href: '/festivals/shaky-knees-2025', label: 'Back to Shaky Knees Lineup' };

  const tocLinks: TocLink[] = [
    { href: '#inside-the-fest', label: 'Best Eats Inside The Festival' },
  ];

  return (
    <ArticleLayout meta={articleMeta} backLink={backLink} tocLinks={tocLinks}>
      <ArticleSection
        id="inside-the-fest"
        title="Best Eats Inside The Festival"
        publishDate="May 1, 2025"
      >
        <InsideTheFestEats />
      </ArticleSection>
    </ArticleLayout>
  );
}