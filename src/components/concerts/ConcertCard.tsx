// src/components/concerts/ConcertCard.tsx (Basic Placeholder)
// Note: We'll likely extract the *content* part of this for the wrapper's expansion
import React from 'react';

interface ConcertCardProps {
    concert: any; // Replace 'any' with your actual ApiConcert type later
}

const ConcertCard: React.FC<ConcertCardProps> = ({ concert }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      Card Placeholder for: {concert.headliner?.name || 'Unknown Artist'}
    </div>
  );
};

export default ConcertCard;