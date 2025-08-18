// src/components/ui/LargerHero.tsx
'use client';

import React from 'react';

const LargerHero: React.FC = () => {
  const heroImageUrl = '/images/gigdog-hero-main44.jpg'; // The image with the crowd background

  return (
    // This outer section simply adds some vertical spacing around the banner.
    <section className="w-full py-8 px-4">
      {/* 
        This single div IS the hero banner.
        It is simple and directly controls all properties.
      */}
      <div
        className="
          w-full           
          max-w-7xl        
          mx-auto          
          aspect-[5/1]     
          bg-cover         
          bg-center        
          rounded-lg       
          shadow-xl        
        "
        style={{ 
          backgroundImage: `url(${heroImageUrl})`
        }}
        role="img"
        aria-label="A crowd at a concert with the Gig Dog logo."
      >
        {/* This div is intentionally left empty. The background image is the content. */}
      </div>
    </section>
  );
};

export default LargerHero;