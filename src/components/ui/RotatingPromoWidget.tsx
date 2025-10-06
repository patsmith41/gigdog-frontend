// src/components/ui/RotatingPromoWidget.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram } from 'lucide-react';

// --- Main Rotating Promo Widget ---
const RotatingPromoWidget = () => {
  // The promoItems array now only contains evergreen (non-time-sensitive) content.
  const promoItems = [
    {
      id: 'on-the-scent',
      content: (
        <>
          <h3 className="font-semibold text-lg uppercase tracking-wider text-blue-300">On The Scent Pick</h3>
          <p className="font-bold text-3xl my-1">Valley Maker</p>
          <p className="text-neutral-200 mb-3">Playing at The Earl</p>
          <span className="inline-block px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-lg text-sm">See Show</span>
        </>
      ),
      backgroundImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop",
      link: "#", // FUTURE: Link to the specific show page
    },
    {
      id: 'social-follow',
      content: (
        <>
          <Instagram size={32} className="mx-auto mb-2"/>
          <h3 className="font-bold text-xl tracking-tight">Follow GigDog</h3>
          <p className="text-neutral-300 mb-3 text-sm">Get daily show updates & local music news.</p>
          <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg text-sm">@GigDog_atl on Instagram</span>
        </>
      ),
      backgroundImage: "https://images.unsplash.com/photo-1557997148-3475514f27f0?q=80&w=1974&auto=format&fit=crop",
      link: "https://www.instagram.com/gigdog_atl/", // Your actual Instagram link
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Slower, more deliberate rotation for better user experience
    const rotationTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % promoItems.length);
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(rotationTimer);
  }, [promoItems.length]);

  return (
    <div className="bg-neutral-800 rounded-xl shadow-md overflow-hidden relative group h-full min-h-[280px]">
      {promoItems.map((item, index) => (
        <Link 
          href={item.link} 
          key={item.id} 
          className="absolute inset-0 transition-opacity duration-1000" 
          style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 10 : 1 }}
        >
            <img src={item.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent"></div>
            <div className="relative p-6 text-center text-white flex flex-col justify-center h-full">
              <div 
                className="transition-all duration-500" 
                style={{ opacity: index === currentIndex ? 1 : 0, transform: `translateY(${index === currentIndex ? 0 : '10px'})` }}
              >
                {item.content}
              </div>
            </div>
        </Link>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {promoItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RotatingPromoWidget;