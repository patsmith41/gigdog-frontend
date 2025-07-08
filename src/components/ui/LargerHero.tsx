// src/components/ui/LargerHero.tsx
'use client';

import React from 'react';
// REMOVED: No longer need to import Music2 since we are removing it.
// import { Music2 } from 'lucide-react';

const LargerHero: React.FC = () => {
  const heroBackgroundImageUrl = '/images/gigdog-hero-main44.jpg'; 

  return (
    <section 
      className="w-full py-12 md:py-40 bg-neutral-900 text-center relative overflow-hidden bg-cover mb-8 md:mb-12"
      style={{ 
        backgroundImage: `url(${heroBackgroundImageUrl})`,
        backgroundPosition: 'center 49%', 
      }}
    >
    

      {/* This div keeps your content on top of the overlay */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- SECTION CHANGED --- */}
        {/* The entire containing div for the logo has been removed. */}
        {/* The title now stands on its own. */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
          
        </h1>
        {/* --- END OF SECTION CHANGE --- */}


        {/* Main Value Prop - Simplified and focused */}
        <h2 className="text-xl md:text-4xl lg:text-3xl font-bold text-white tracking-wide">
        </h2>
      
  
        
      </div>
    </section>
  );
};

export default LargerHero;