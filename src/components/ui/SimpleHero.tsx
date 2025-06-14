// src/components/ui/SimpleHero.tsx
'use client';

import React from 'react';
import { Instagram, Twitter, Music, Video } from 'lucide-react';

const SimpleHero: React.FC = () => {
  return (
    <>
      {/* Social Follow Bar */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-white text-sm sm:text-base font-medium">
              <span className="text-lg">🎵</span>
              <span>Follow @GigDog for daily Atlanta music updates</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/gigdog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <Instagram size={16} />
                <span className="hidden sm:inline">Instagram</span>
              </a>
              <a
                href="https://tiktok.com/@gigdog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <Video size={16} />
                <span className="hidden sm:inline">TikTok</span>
              </a>
              <a
                href="https://twitter.com/gigdog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <Twitter size={16} />
                <span className="hidden sm:inline">Twitter</span>
              </a>
              <div className="text-white text-sm font-medium hidden md:block">
                2.1k followers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Hero Section */}
      <section className="w-full bg-neutral-900 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo Placeholder */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center">
              <Music className="text-neutral-300" size={24} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              GigDog
            </h1>
          </div>

          {/* Main Value Prop */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-4 leading-tight">
            Atlanta's Best Live Music Discovery
          </h2>
          
          <p className="text-base sm:text-lg text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Find your next favorite band before they blow up. We track every venue from 
            The Earl to Aisle 5, featuring local acts and touring artists hitting Atlanta's music scene.
          </p>

          {/* Key Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Updated Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>All Venues</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Video Previews</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              <span>Local Focus</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SimpleHero;