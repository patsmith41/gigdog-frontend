// src/content/shaky-knees/MartaGuide.tsx
import React from 'react';

const MartaGuide = () => {
  return (
    // The <article> tag has been replaced with a React Fragment <>
    <>
      <p>
        Taking MARTA is by far the most convenient and cost-effective way to get to the festival.
        You'll avoid traffic, parking headaches, and surge pricing on rideshares.
      </p>
      <h3>Key Station Information:</h3>
      <ul>
        <li>
          <strong>Closest Station:</strong> Civic Center Station (Red/Gold Lines)
        </li>
        <li>
          <strong>Walking Distance:</strong> Approximately a 15-minute walk to the main festival entrance.
        </li>
        <li>
          <strong>Fare:</strong> You'll need a Breeze Card or Breeze Ticket. We recommend loading a round-trip fare
          in the morning to avoid long lines at the kiosk after the festival ends.
        </li>
      </ul>
    </>
  );
};

export default MartaGuide;