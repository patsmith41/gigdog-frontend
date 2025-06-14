import React from 'react';
import { PawPrint, ExternalLink, Music } from 'lucide-react';

interface Artist {
  artist_id: string;
  name: string;
  image_url: string | null;
  is_hometown_show: boolean;
  hometown: string | null;
  long_bio: string | null;
  youtube_video_id_1: string | null;
  youtube_video_id_2: string | null;
  spotify_url: string | null;
}

interface ArtistDetailCardProps {
  artist: Artist;
  isHeadliner?: boolean;
}

export const ArtistDetailCard: React.FC<ArtistDetailCardProps> = ({ artist, isHeadliner = false }) => {
  return (
    <section id={`artist-${artist.artist_id}`} className="py-10 border-b border-neutral-800 last:border-b-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12">
        <div className="lg:col-span-5 mb-8 lg:mb-0">
          <div className="space-y-4 sticky top-24">
            {artist.image_url ? (
              <img 
                src={artist.image_url} 
                alt={`Promotional photo for ${artist.name}`}
                // --- THE FIX IS HERE: Back to aspect-square ---
                className="w-full aspect-square object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
            ) : (
              // --- AND HERE ---
              <div className="w-full aspect-square bg-neutral-800 rounded-lg flex items-center justify-center">
                <Music size={48} className="text-neutral-600" />
              </div>
            )}
            {artist.youtube_video_id_1 && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <div id={`youtube-${artist.youtube_video_id_1}`} className="w-full h-full"></div>
              </div>
            )}
            {artist.youtube_video_id_2 && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <div id={`youtube-${artist.youtube_video_id_2}`} className="w-full h-full"></div>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-4">
            <h2 className={isHeadliner ? "text-4xl md:text-5xl font-bold" : "text-3xl md:text-4xl font-bold"}>{artist.name}</h2>
            {artist.is_hometown_show && (
              <div title="On the Scent: A great local artist!" className="flex-shrink-0 flex items-center gap-1.5 bg-blue-600/30 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full"><PawPrint size={14} /><span>On the Scent</span></div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-300 border-y border-neutral-800 py-3 mb-6">
            {artist.hometown && ( <div className="flex items-center gap-2"><span className="font-bold text-neutral-500">HOMETOWN:</span><span>{artist.hometown}</span></div> )}
            {artist.spotify_url && ( <a href={artist.spotify_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"><span className="font-bold">LISTEN:</span><span>Profile on Spotify</span><ExternalLink size={14} /></a> )}
          </div>
          {artist.long_bio ? (
            <div className="prose prose-invert max-w-none text-neutral-300 text-lg leading-relaxed">{artist.long_bio.split('\n').map((p, i) => <p key={i}>{p}</p>)}</div>
          ) : ( <p className="text-neutral-500 italic">No biography available for this artist.</p> )}
        </div>
      </div>
    </section>
  );
};