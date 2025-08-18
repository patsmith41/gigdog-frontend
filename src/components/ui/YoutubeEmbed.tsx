// src/components/ui/YoutubeEmbed.tsx
import React from 'react';

interface YoutubeEmbedProps {
  embedId: string; // The 11-character ID from the YouTube URL
  title: string;   // A descriptive title for accessibility
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ embedId, title }) => (
  <div className="relative overflow-hidden w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
    <iframe
      className="absolute top-0 left-0 bottom-0 right-0 w-full h-full"
      width="853"
      height="480"
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
    />
  </div>
);

export default YoutubeEmbed;