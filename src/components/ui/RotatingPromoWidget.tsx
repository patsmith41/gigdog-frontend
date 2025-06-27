// src/components/ui/RotatingPromoWidget.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram } from 'lucide-react';

// --- Reusable Countdown Timer Logic (no changes needed here) ---
const CountdownUnit = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl font-mono font-bold text-white tracking-tighter">{value}</span>
    <span className="text-xs text-neutral-300 uppercase tracking-widest">{label}</span>
  </div>
);

const useCountdown = (targetDate: Date) => {
  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    if (difference <= 0) return null;
    return {
      days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
      hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
      minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
      seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
    };
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (newTimeLeft) { setTimeLeft(newTimeLeft); } 
      else { clearInterval(timer); setTimeLeft(null); }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  return timeLeft;
};

// --- Main Rotating Promo Widget ---
const RotatingPromoWidget = () => {
  const shakyKneesDate = new Date('2025-05-02T12:00:00-04:00');
  const timeLeft = useCountdown(shakyKneesDate);

  // --- NEW: Updated Data for our rotating slides ---
  const promoItems = [
    {
      id: 'shaky-knees',
      content: (
        <>
          <h3 className="font-bold text-xl tracking-tight mb-2">Shaky Knees 2025</h3>
          {timeLeft ? (
            <div className="grid grid-cols-4 gap-2 my-3">
              <CountdownUnit value={timeLeft.days} label="Days" />
              <CountdownUnit value={timeLeft.hours} label="Hours" />
              <CountdownUnit value={timeLeft.minutes} label="Mins" />
              <CountdownUnit value={timeLeft.seconds} label="Secs" />
            </div>
          ) : (
            <div className="my-3"><p className="text-2xl font-bold text-yellow-400 animate-pulse">It's Happening Now!</p></div>
          )}
          <span className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg text-sm">View Lineup & Info</span>
        </>
      ),
      backgroundImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop",
      link: "/festivals/shaky-knees-2025",
    },
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
      link: "#", // Link to the specific show page
    },
    {
      id: 'social-follow',
      content: (
        <>
          <Instagram size={32} className="mx-auto mb-2"/>
          <h3 className="font-bold text-xl tracking-tight">Follow GigDog</h3>
          <p className="text-neutral-300 mb-3 text-sm">Get daily show updates & local music news.</p>
          <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg text-sm">@GigDogATL on Instagram</span>
        </>
      ),
      backgroundImage: "https://images.unsplash.com/photo-1557997148-3475514f27f0?q=80&w=1974&auto=format&fit=crop",
      link: "https://instagram.com", // Your actual Instagram link
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Slower, more deliberate rotation
    const rotationTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % promoItems.length);
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(rotationTimer);
  }, [promoItems.length]);

  return (
    <div className="bg-neutral-800 rounded-xl shadow-md overflow-hidden relative group h-full min-h-[280px]">
      {promoItems.map((item, index) => (
        <Link href={item.link} key={item.id} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 10 : 1 }}>
            <img src={item.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent"></div>
            <div className="relative p-6 text-center text-white flex flex-col justify-center h-full">
              <div className="transition-all duration-500" style={{ opacity: index === currentIndex ? 1 : 0, transform: `translateY(${index === currentIndex ? 0 : '10px'})` }}>
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