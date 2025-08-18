// src/content/shaky-knees/FridayGems.tsx

"use client";
import React from 'react';
import Image from 'next/image';

const FridayGems = () => {
  return (
    <>
      <p>
        The headliners get all the attention, but the magic of a festival often happens earlier in the day when you discover your new favorite band by chance. Here are a few must-see acts on Friday before the sun goes down.
      </p>

      <h3>Arcade Fire (Ponce de Leon Stage @ 4:00 PM)</h3>
      <p>
        While they're a household name now, catching Arcade Fire in the daylight is a rare treat. Expect a high-energy set packed with anthems that will have the whole crowd singing along. Their legendary live show is the perfect way to kick your festival weekend into high gear.
      </p>
      
      <figure>
        <Image
          src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1200&auto-format&fit=crop"
          alt="A vibrant festival crowd with hands in the air during a daytime set."
          width={1200}
          height={675}
          className="rounded-lg object-cover w-full aspect-video"
        />
        <figcaption>Daytime sets are your best chance to find a new favorite band.</figcaption>
      </figure>

      <h3>Young the Giant (Piedmont Stage @ 2:30 PM)</h3>
      <p>
        Known for their polished indie-rock sound and Sameer Gadhia's incredible vocals, Young the Giant is a can't-miss act. Their music is perfect for a sunny afternoon, with songs that are both danceable and deeply felt.
      </p>

      <blockquote>
        <strong>GigDog Pro Tip:</strong> The Piedmont Stage can get crowded quickly. Arrive at least 15-20 minutes before this set starts to get a good spot with clear sound.
      </blockquote>
    </>
  );
};

export default FridayGems;