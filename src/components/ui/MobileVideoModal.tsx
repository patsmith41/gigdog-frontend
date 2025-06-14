// src/components/ui/MobileVideoModal.tsx
'use client';

import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { NowPlayingInfo } from '@/types';

// Helper function for date formatting
const formatDateForModal = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
    const dayShort = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${dayShort}, ${monthDay}`;
  } catch (e) { return ''; }
};

interface MobileVideoModalProps {
  activeVideoId: string | null;
  nowPlayingInfo: NowPlayingInfo | null;
  onClose: () => void;
  onExpandToCard?: () => void;
}

const MobileVideoModal: React.FC<MobileVideoModalProps> = ({ 
  activeVideoId, 
  nowPlayingInfo, 
  onClose,
  onExpandToCard 
}) => {
  if (!activeVideoId || !nowPlayingInfo) return null;

  const handleTellFriends = () => {
    if (!nowPlayingInfo) return;
    
    const message = `Check out ${nowPlayingInfo.artistName} playing at ${nowPlayingInfo.venueName}${nowPlayingInfo.showDate ? ` on ${formatDateForModal(nowPlayingInfo.showDate)}` : ''}! 🎵${nowPlayingInfo.ticketUrl ? ` Get tickets: ${nowPlayingInfo.ticketUrl}` : ''}`;
    
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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-20 z-50 lg:hidden">
        <div className="bg-neutral-900 rounded-xl shadow-2xl border border-neutral-700 overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 text-white hover:text-red-400 rounded-full bg-black/50 hover:bg-red-400/10 transition-all duration-200"
          >
            <X size={18} />
          </button>
          
          {/* Grid Row Info */}
          <div className="p-4 border-b border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {nowPlayingInfo.artistName}
                </h3>
                {nowPlayingInfo.venueName && (
                  <p className="text-sm text-neutral-400">
                    {nowPlayingInfo.venueName}
                    {nowPlayingInfo.showDate && (
                      <span> • {formatDateForModal(nowPlayingInfo.showDate)}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
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
          <div className="p-4 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleTellFriends}
                className="flex-1 px-4 py-2.5 bg-transparent text-neutral-300 hover:bg-neutral-700 hover:text-white border border-white hover:border-neutral-500 rounded-xl text-sm font-semibold transition-all duration-300"
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

            {/* Expand to Full Card Button */}
            {onExpandToCard && (
              <button
                onClick={onExpandToCard}
                className="w-full px-4 py-2.5 bg-transparent text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-600 hover:border-neutral-500 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ChevronDown size={16} />
                View Full Details
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileVideoModal;