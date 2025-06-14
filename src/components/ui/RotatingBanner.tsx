// src/components/ui/RotatingHero.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Music, ExternalLink, Instagram, Twitter } from 'lucide-react';

interface HeroItem {
  id: string;
  type: 'urgent' | 'article' | 'featured' | 'social';
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  link: string;
  buttonText: string;
  emoji?: string;
}

// Sample hero data - you'll replace this with real data
const heroItems: HeroItem[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Tonight: The Body + Malevich',
    subtitle: 'The Earl - Last chance for tickets',
    description: 'Don\'t miss this legendary doom metal show in Little Five Points',
    imageUrl: '/api/placeholder/400/300',
    link: '/shows/the-body-earl',
    buttonText: 'Get Tickets Now',
    emoji: '🔥'
  },
  {
    id: '2',
    type: 'article',
    title: 'Why The Earl is Atlanta\'s Hidden Gem',
    subtitle: 'Inside the venue that\'s launching careers',
    description: 'From intimate acoustic sets to raging punk shows, discover what makes this venue special',
    imageUrl: '/api/placeholder/400/300',
    link: '/blog/the-earl-hidden-gem',
    buttonText: 'Read Article',
    emoji: '📰'
  },
  {
    id: '3',
    type: 'featured',
    title: 'River Tiber at Aisle 5',
    subtitle: 'Tickets on sale Friday, June 6th',
    description: 'Electronic soul meets indie R&B in Little Five Points',
    imageUrl: '/api/placeholder/400/300',
    link: '/shows/river-tiber',
    buttonText: 'Set Reminder',
    emoji: '⚡'
  },
  {
    id: '4',
    type: 'social',
    title: 'Join 2.1k Music Fans',
    subtitle: 'Follow @GigDog for daily Atlanta music updates',
    description: 'Behind-the-scenes content, exclusive interviews, and first dibs on tickets',
    imageUrl: '/api/placeholder/400/300',
    link: 'https://instagram.com/gigdog',
    buttonText: 'Follow Now',
    emoji: '📱'
  }
];

const RotatingHero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === heroItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000); // 6 seconds per hero

    return () => clearInterval(interval);
  }, [isHovered]);

  const currentItem = heroItems[currentIndex];

  const handleHeroClick = () => {
    if (currentItem.link.startsWith('http')) {
      window.open(currentItem.link, '_blank', 'noopener noreferrer');
    } else {
      console.log('Navigate to:', currentItem.link);
    }
  };

  const getHeroStyles = () => {
    switch (currentItem.type) {
      case 'urgent':
        return 'from-red-900/90 via-red-800/80 to-red-900/90';
      case 'article':
        return 'from-indigo-900/90 via-indigo-800/80 to-indigo-900/90';
      case 'featured':
        return 'from-pink-900/90 via-pink-800/80 to-pink-900/90';
      case 'social':
        return 'from-purple-900/90 via-purple-800/80 to-purple-900/90';
      default:
        return 'from-neutral-900/90 via-neutral-800/80 to-neutral-900/90';
    }
  };

  const getSocialIcon = () => {
    if (currentItem.type === 'social') {
      if (currentItem.link.includes('instagram')) return <Instagram size={20} />;
      if (currentItem.link.includes('twitter')) return <Twitter size={20} />;
    }
    return null;
  };

  return (
    <section className="w-full bg-neutral-900 py-16 md:py-24 relative overflow-hidden">
      {/* Background Image */}
      {currentItem.imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${currentItem.imageUrl})` }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ${getHeroStyles()}`} />
      
      {/* Content */}
      <div 
        className="relative w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Emoji/Icon */}
        <div className="mb-4">
          {currentItem.emoji && (
            <span className="text-4xl md:text-5xl">{currentItem.emoji}</span>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            {currentItem.title}
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-200 mb-6 font-medium">
            {currentItem.subtitle}
          </p>
          
          {currentItem.description && (
            <p className="text-base md:text-lg text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {currentItem.description}
            </p>
          )}

          {/* CTA Button */}
          <button
            onClick={handleHeroClick}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 font-bold text-lg rounded-xl hover:bg-neutral-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            {getSocialIcon()}
            {currentItem.buttonText}
            {currentItem.link.startsWith('http') && <ExternalLink size={20} />}
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          {heroItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300 hover:scale-125
                ${index === currentIndex 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RotatingHero;