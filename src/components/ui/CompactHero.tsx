// src/components/ui/CompactHero.tsx
'use client';

import React from 'react';
import { Music } from 'lucide-react';

const CompactHero: React.FC = () => {
  return (
    <section className="w-full py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Hero Container */}
        <div className="bg-neutral-800 rounded-xl p-6 md:p-8 text-center shadow-lg">
          {/* Logo + Title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
              <Music className="text-neutral-300" size={20} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              GigDog
            </h1>
          </div>

          {/* Value Prop */}
          <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
            Atlanta's Live Music Discovery
          </h2>
          
          <p className="text-sm md:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Find your next favorite band before they blow up. We track every venue from 
            The Earl to Aisle 5, featuring local acts and touring artists.
          </p>

          {/* Key Benefits - Smaller */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span>Updated Daily</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              <span>All Venues</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              <span>Video Previews</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              <span>Local Focus</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompactHero;