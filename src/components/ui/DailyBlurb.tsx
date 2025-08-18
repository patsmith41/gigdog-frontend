// src/components/ui/DailyBlurb.tsx
'use client'; // This entire component is now a client component

import React, { useState } from 'react';

interface DailyBlurbProps {
  headline: string;
  blurb: string;
}

export default function DailyBlurb({ headline, blurb }: DailyBlurbProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If there's no blurb text, don't render anything
  if (!blurb) {
    return null;
  }

  // Split the blurb into a visible snippet and the rest
  const sentences = blurb.match(/[^.!?]+[.!?]+/g) || [blurb];
  const visibleSnippet = sentences.slice(0, 2).join(' ');
  const hiddenContent = sentences.slice(2).join(' ');
  const canExpand = sentences.length > 2;

  return (
    <div className="bg-neutral-800/50 p-4 sm:p-6 rounded-lg ring-1 ring-neutral-700 mb-4">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
        {headline}
      </h2>
      <div className="prose prose-invert max-w-none text-neutral-300">
        <p>
          {visibleSnippet}
          {canExpand && !isExpanded && '...'}
          {isExpanded && <span> {hiddenContent}</span>}
        </p>
      </div>
      {canExpand && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-indigo-400 font-semibold hover:text-indigo-300 mt-2 text-sm"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}