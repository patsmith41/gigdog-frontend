import React from 'react';
import Image from 'next/image';

const SurvivalGuide = () => {
  return (
    <>
      <p>A little preparation goes a long way toward having an amazing festival experience. Here are some essential tips from the GigDog team to help you conquer Shaky Knees weekend like a pro.</p>
      <h3>What to Bring (The Essentials)</h3>
      <ul>
        <li><strong>Empty Water Bottle:</strong> Stay hydrated! There are free water refill stations throughout the park. A reusable bottle is a must.</li>
        <li><strong>Sunscreen:</strong> The Georgia sun is no joke, even in May. Apply it before you arrive and reapply throughout the day.</li>
        <li><strong>Portable Phone Charger:</strong> You'll be taking photos, checking the schedule, and meeting up with friends. A dead phone is a festival buzzkill.</li>
        <li><strong>Comfortable Shoes:</strong> You will be walking and standing for miles. Prioritize comfort over style. Your feet will thank you.</li>
      </ul>
      <figure>
        <Image
          src="https://images.unsplash.com/photo-1558645752-5a20b22d8614?q=80&w=1200&auto-format&fit=crop"
          alt="A person applying sunscreen at an outdoor event."
          width={1200}
          height={800}
          className="rounded-lg"
        />
        <figcaption>Sunscreen is non-negotiable for a multi-day outdoor festival.</figcaption>
      </figure>
      <h3>What to Leave at Home</h3>
      <p>Check the official Shaky Knees FAQ for the full list of prohibited items, but a few key things to remember are no outside food or drinks (except your empty water bottle), no professional cameras with detachable lenses, and no large bags or backpacks.</p>
      <blockquote><strong>GigDog Pro Tip:</strong> Pack a small, clear bag. This will speed up your entry through security lines significantly.</blockquote>
    </>
  );
};

export default SurvivalGuide;