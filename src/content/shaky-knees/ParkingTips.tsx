// src/content/shaky-knees/ParkingTips.tsx
import React from 'react';
import Image from 'next/image'; // <-- 1. IMPORT NEXT.JS IMAGE

const ParkingTips = () => {
  return (
    <>
      <p>
        There is no official festival parking designated by Shaky Knees. Parking in the neighborhoods
        surrounding Central Park is extremely limited and not recommended. If you must drive, your best
        bet is to use a paid parking deck and walk.
      </p>
      
      {/* 2. ADD AN IMAGE WHEREVER YOU WANT */}
      <figure>
        <Image
          src="https://images.unsplash.com/photo-1642272022879-18dc6abc8f26?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="A multi-level parking garage"
          width={1200}
          height={675}
          className="rounded-lg object-cover w-full aspect-video"
        />
        <figcaption>Reserve parking in advance to avoid stress on the day of the show.</figcaption>
      </figure>

      <blockquote>
        <strong>GigDog Pro Tip:</strong> Reserve a spot in a nearby parking deck in advance using an app
        like SpotHero to guarantee your space and avoid surge pricing.
      </blockquote>
      <h3>Recommended Parking Decks:</h3>
      <ul>
        <li><strong>Peachtree Center Garage:</strong> A larger garage with a moderate walk. Often has event parking rates.</li>
        <li><strong>Courtland Street Garage:</strong> Closer, but fills up very quickly.</li>
      </ul>
    </>
  );
};

export default ParkingTips;