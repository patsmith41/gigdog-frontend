// src/components/concerts/InlineVideoPlayer.tsx
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { NowPlayingInfo } from '@/types';

// Helper function for date formatting
const formatDateForPlayer = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
    const dayShort = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${dayShort}, ${monthDay}`;
  } catch (e) { return ''; }
};

interface InlineVideoPlayerProps {
  activeVideoId: string | null;
  nowPlayingInfo: NowPlayingInfo | null;
  onClose: () => void;
  onExpandToCard?: () => void;
}

const InlineVideoPlayer: React.FC<InlineVideoPlayerProps> = ({ 
  activeVideoId, 
  nowPlayingInfo, 
  onClose,
  onExpandToCard 
}) => {
  if (!activeVideoId || !nowPlayingInfo) return null;

  const handleTellFriends = () => {
    if (!nowPlayingInfo) return;
    
    const message = `Check out ${nowPlayingInfo.artistName} playing at ${nowPlayingInfo.venueName}${nowPlayingInfo.showDate ? ` on ${formatDateForPlayer(nowPlayingInfo.showDate)}` : ''}! 🎵${nowPlayingInfo.ticketUrl ? ` Get tickets: ${nowPlayingInfo.ticketUrl}` : ''}`;
    
    // Try Web Share API first (works great on mobile)
    if (navigator.share) {
      navigator.share({
        title: `${nowPlayingInfo.artistName} Live`,
        text: message,
        url: nowPlayingInfo.ticketUrl || window.location.href,
      }).catch((err) => console.log('Share cancelled', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(message).then(() => {
        alert('Copied to clipboard!');
      }).catch(() => {
        // Fallback to old method
        const textArea = document.createElement('textarea');
        textArea.value = message;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Copied to clipboard!');
      });
    }
  };

  return (
    <div className="lg:hidden bg-neutral-800 border-t border-neutral-600 overflow-hidden transition-all duration-300 ease-out">
      
      {/* Header with artist info and close button */}
      <div className="p-4 bg-neutral-900 flex items-center justify-between border-b border-neutral-700">
        <div>
          <h3 className="text-white font-semibold text-lg">
            {nowPlayingInfo.artistName}
          </h3>
          {nowPlayingInfo.venueName && (
            <p className="text-neutral-400 text-sm">
              {nowPlayingInfo.venueName}
              {nowPlayingInfo.showDate && (
                <span> • {formatDateForPlayer(nowPlayingInfo.showDate)}</span>
              )}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-700 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Video Player */}
      <div className="w-full bg-black" style={{ aspectRatio: '16/9' }}>
        <iframe
          key={activeVideoId}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&modestbranding=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-neutral-900 space-y-3">
        <div className="flex gap-3">
          <button
            onClick={handleTellFriends}
            className="flex-1 px-4 py-2.5 bg-transparent text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-600 hover:border-neutral-500 rounded-xl text-sm font-semibold transition-all duration-300"
          >
            Tell Friends
          </button>
          
          {nowPlayingInfo.ticketUrl ? (
            <a 
              href={nowPlayingInfo.ticketUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 bg-pink-500 text-white hover:bg-pink-600 text-center rounded-xl text-sm font-semibold transition-all duration-300"
            >
              Get Tix
            </a>
          ) : (
            <button
              disabled
              className="flex-1 px-4 py-2.5 bg-neutral-700 text-neutral-500 text-center rounded-xl text-sm font-semibold cursor-not-allowed"
            >
              No Tickets
            </button>
          )}
        </div>

        {/* Expand to Full Card Button - for future use */}
        {onExpandToCard && (
          <button
            onClick={onExpandToCard}
            className="w-full px-4 py-2.5 bg-transparent text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-600 hover:border-neutral-500 rounded-xl text-sm font-semibold transition-all duration-300"
          >
            View Full Artist Details
          </button>
        )}
      </div>
    </div>
  );
};

export default InlineVideoPlayer;