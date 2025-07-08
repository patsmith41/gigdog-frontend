// src/components/ui/BrandHero.tsx
'use client';

import React from 'react';
import { Music } from 'lucide-react';

const BrandHero: React.FC = () => {
  return (
    <div className="flex flex-col justify-center h-full min-h-[300px] lg:min-h-[400px]">
      {/* Logo + Brand Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center">
          <Music className="text-neutral-300" size={24} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          GigDog
        </h1>
      </div>

      {/* Tagline */}
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
        Atlanta's Live Music Discovery
      </h2>
      
      {/* Description */}
      <p className="text-base md:text-lg text-neutral-300 max-w-2xl leading-relaxed mb-6">
        Find your next favorite band before they blow up. We track every venue from 
        The Earl to Aisle 5, featuring local acts and touring artists.
      </p>

      {/* Key Benefits */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Updated Daily</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>All Venues</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          <span>Video Previews</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          <span>Local Focus</span>
        </div>
      </div>
    </div>
  );
};

export default BrandHero;