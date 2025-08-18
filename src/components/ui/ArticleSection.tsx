// src/components/ui/ArticleSection.tsx
'use client';

import React from 'react';
import { Share2 } from 'lucide-react';

interface ArticleSectionProps {
  id: string;
  title: string;
  publishDate: string;
  children: React.ReactNode;
}

const ArticleSection: React.FC<ArticleSectionProps> = ({ id, title, publishDate, children }) => {
  
  const handleShare = async () => { /* ... (no changes to this function) ... */ };

  return (
    <article id={id} className="py-8 border-b-2 border-neutral-800 last:border-b-0">
      {/* Article Header (no changes here) */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <p className="text-sm text-neutral-400 mt-1">Published: {publishDate}</p>
        </div>
        <button onClick={handleShare} /* ... */ >
          <Share2 size={16} />
          <span className="text-sm font-semibold hidden sm:inline">Share</span>
        </button>
      </div>

      {/* --- THIS IS THE FIX --- */}
      {/* The 'prose' class is now here, correctly wrapping your content components */}
      <div className="prose prose-invert prose-lg max-w-none text-neutral-300 leading-relaxed space-y-6 mt-6">
        {children}
      </div>
      {/* --- END OF FIX --- */}
    </article>
  );
};

export default ArticleSection;