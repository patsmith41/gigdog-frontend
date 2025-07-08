// src/components/ui/NewsBox.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  isExternal?: boolean;
}

const NewsBox: React.FC = () => {
  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });

  // Sample news items - you can replace this with API data later
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Top Shows of the Week',
      url: '/articles/top-shows-this-week'
    },
    {
      id: '2', 
      title: 'Interview with Atlanta\'s Jim Jon',
      url: '/articles/jim-jon-interview'
    },
    {
      id: '3',
      title: 'New Venue Spotlight: The Masquerade',
      url: '/articles/masquerade-spotlight'
    },
    {
      id: '4',
      title: 'Local Band Roundup: 5 Acts to Watch',
      url: '/articles/local-bands-roundup'
    },
    {
      id: '5',
      title: 'Festival Season Preview',
      url: '/articles/festival-season-preview'
    }
  ];

  return (
    <div className="bg-neutral-800 rounded-xl p-6 shadow-lg">
      {/* Header with Date */}
      <div className="mb-4 pb-4 border-b border-neutral-700">
        <h2 className="text-lg font-semibold text-white mb-1">
          News & Info
        </h2>
        <p className="text-sm text-neutral-400">
          {formattedDate}
        </p>
      </div>

      {/* News Items List */}
      <div className="space-y-3">
        {newsItems.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            className="block text-sm text-neutral-300 hover:text-white hover:bg-neutral-700 px-3 py-2 rounded-lg transition-colors duration-200"
            {...(item.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {item.title}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-700">
        <Link 
          href="/articles"
          className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          View all articles →
        </Link>
      </div>
    </div>
  );
};

export default NewsBox;