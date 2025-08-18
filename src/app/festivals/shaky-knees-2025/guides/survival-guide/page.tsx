import React from 'react';
import type { Metadata } from 'next';
import ArticleLayout from '@/components/ui/ArticleLayout';
import ArticleSection from '@/components/ui/ArticleSection';
import { TocLink } from '@/components/ui/TableOfContents';
import { SurvivalGuide as SurvivalGuideContent } from '@/content/shaky-knees';

export const metadata: Metadata = { title: 'Survival Guide - Shaky Knees 2025 | GigDog' };

export default function SurvivalGuidePage() {
  const articleMeta = {
    title: 'Shaky Knees Survival Guide',
    subTitle: 'Pro tips for a great festival weekend',
    heroImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto-format&fit=crop',
  };
  const backLink = { href: '/festivals/shaky-knees-2025', label: 'Back to Shaky Knees Lineup' };
  const tocLinks: TocLink[] = [{ href: '#essentials', label: 'What to Bring & What to Leave' }];

  return (
    <ArticleLayout meta={articleMeta} backLink={backLink} tocLinks={tocLinks}>
      <ArticleSection id="essentials" title="The Essentials" publishDate="April 15, 2025">
        <SurvivalGuideContent />
      </ArticleSection>
    </ArticleLayout>
  );
}