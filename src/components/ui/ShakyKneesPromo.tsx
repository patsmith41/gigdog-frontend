// src/components/ui/ShakyKneesPromo.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Helper component for a single countdown unit (e.g., Days, Hours)
const CountdownUnit = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl lg:text-4xl font-mono font-bold text-white tracking-tighter">
      {value}
    </span>
    <span className="text-xs text-neutral-300 uppercase tracking-widest">{label}</span>
  </div>
);

const ShakyKneesPromo = () => {
  // Set the target date for Shaky Knees 2025. Let's use May 2nd, 2025.
  // The format is 'YYYY-MM-DDTHH:mm:ss-TIMEZONE_OFFSET'
  const targetDate = new Date('2025-05-02T12:00:00-04:00'); // May 2, 2025, 12:00 PM EDT

  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft = { days: '00', hours: '00', minutes: '00', seconds: '00' };

    if (difference > 0) {
      timeLeft = {
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isFestivalTime, setIsFestivalTime] = useState(+new Date() >= +targetDate);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (+new Date() >= +targetDate) {
        setIsFestivalTime(true);
        clearInterval(timer);
      }
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-neutral-800 rounded-xl shadow-md overflow-hidden relative group">
      <Link href="/festivals/shaky-knees-2025" className="block">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop"
          alt="Shaky Knees festival crowd"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent"></div>

        <div className="relative p-6 text-center text-white flex flex-col justify-center h-full min-h-[280px]">
          <h3 className="font-bold text-2xl tracking-tight mb-2">Shaky Knees 2025</h3>
          
          {isFestivalTime ? (
            <div className="my-4">
              <p className="text-3xl font-bold text-yellow-400 animate-pulse">It's Happening Now!</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 my-4">
              <CountdownUnit value={timeLeft.days} label="Days" />
              <CountdownUnit value={timeLeft.hours} label="Hours" />
              <CountdownUnit value={timeLeft.minutes} label="Mins" />
              <CountdownUnit value={timeLeft.seconds} label="Secs" />
            </div>
          )}

          <div className="mt-auto">
            <span className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg transition-transform duration-300 group-hover:bg-indigo-500 group-hover:scale-105">
              View Lineup & Info
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ShakyKneesPromo;