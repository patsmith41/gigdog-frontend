// src/content/shaky-knees/JoeyValance.tsx
import React from 'react';
import Image from 'next/image';

const JoeyValanceSpotlight = () => {
  return (
    <>
      {/* Main article text */}
      <p className="lead text-xl">
        Picture this: a 45-year-old wearing a vintage Beastie Boys tee bouncing next to a 19-year-old who discovered Joey Valence & Brae on TikTok. Both screaming every word to "Punk Tactics." Both completely losing their minds.
      </p>
      <p>
        This is what JVB brings to festivals—pure, unfiltered connection across generational lines. While most acts segment audiences by age, these Pennsylvania rebels create something magical: shared chaos.
      </p>

      {/* An engaging image is perfect here */}
      <figure>
        <Image
          src="/images/joey-valance-2.png"
          alt="A high-energy mosh pit at a music festival."
          width={1200}
          height={675}
          className="rounded-lg object-cover w-full aspect-video"
        />
        <figcaption>JVB's sets are cultural summits where Gen X nostalgia collides with Gen Z energy.</figcaption>
      </figure>

      <p>
        Their sets aren't just performances; they're cultural summits where Gen X nostalgia collides with Gen Z energy. The mosh pit becomes a time machine. Your dad's boom-bap meets your little sister's viral dance moves.
      </p>
      <p>
        Festival culture desperately needs this. Not another polished headliner playing it safe, but artists who remember that live music is supposed to be messy, communal, and absolutely unhinged. JVB proves the future of festivals isn't about perfect production—it's about perfect chaos.
      </p>
    </>
  );
};

export default JoeyValanceSpotlight;