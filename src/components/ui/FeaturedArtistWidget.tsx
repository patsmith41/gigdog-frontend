// src/components/ui/FeaturedArtistWidget.tsx
import React from 'react';
import Link from 'next/link';

interface FeaturedArtistWidgetProps {
  // We can make these props more dynamic later
}

const FeaturedArtistWidget: React.FC<FeaturedArtistWidgetProps> = () => {
  // For now, the content is hardcoded. Later, this could come from an API.
  const title = "Featured Artist";
  const subtitle = "Noah Kahan";
  const description = "Playing at State Farm Arena";
  const backgroundImageUrl = "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=1964&auto=format&fit=crop";
  const link = "#"; // Placeholder link
  const buttonText = "See Show Details";

  return (
    <div className="bg-neutral-900 rounded-xl shadow-md overflow-hidden relative group h-full">
      <Link href={link} className="block">
        <img
          src={backgroundImageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
        <div className="relative p-6 text-white flex flex-col h-full min-h-[200px] text-center justify-end">
          <div className="space-y-1">
              <h3 className="font-semibold text-lg uppercase tracking-wider text-teal-300">
                {title}
              </h3>
              <p className="font-bold text-4xl">
                {subtitle}
              </p>
              <p className="text-neutral-200">{description}</p>
          </div>
          <div className="mt-4">
            <span className="inline-block px-5 py-2.5 bg-teal-500 text-white font-semibold rounded-lg shadow-lg text-sm transition-transform duration-300 group-hover:bg-teal-400 group-hover:scale-105">
              {buttonText}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedArtistWidget;