// src/content/shaky-knees/SaturdayConflicts.tsx
import React from 'react';
import YoutubeEmbed from '@/components/ui/YoutubeEmbed';

const SaturdayConflicts = () => {
  return (
    <>
      <p>
        It’s the classic festival dilemma: two of your favorite bands are playing on opposite ends of the park at the exact same time. Saturday's schedule is packed with tough choices, but we're here to help you navigate the conflicts.
      </p>

      <h3>The Big Choice: Foo Fighters vs. The Killers</h3>
      <p>
        This is the heartbreaker of the weekend. Both bands are legendary live acts with massive catalogs of hits. You can't go wrong, but here’s how to choose:
      </p>
      <ul>
        <li>
          <strong>For Raw Rock Energy:</strong> Go with Foo Fighters. Dave Grohl is a force of nature, and the band delivers a powerful, no-frills rock and roll show.
        </li>
        <li>
          <strong>For Glamorous Singalongs:</strong> Choose The Killers. Brandon Flowers is a master showman, and their set will be a dazzling spectacle of synth-pop and stadium rock anthems.
        </li>
      </ul>

      <p>
        Still can't decide? Here's a taste of what to expect from a Foo Fighters live show to help you make the call.
      </p>

      <YoutubeEmbed 
        embedId="b_9i4GAu2p4" // A popular live video of "Everlong"
        title="Live performance of Everlong by Foo Fighters"
      />

      <h3>The Undercard Clash: Weezer vs. Hozier</h3>
      <p>
        Another tough choice earlier in the day. If you're in the mood for nostalgic, crunchy guitar pop, Weezer is your best bet. If you want a soulful, poetic experience, you can't miss Hozier's powerful performance.
      </p>
    </>
  );
};

export default SaturdayConflicts;