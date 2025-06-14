// src/components/concerts/CuratedShelf.tsx
'use client';

// ... (imports and component logic remain the same) ...
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArticleCard from '../ui/ArticleCard';

interface CuratedArticle {
  id: string;
  badge: string;
  headline: string;
  subheadline: string;
  backgroundImageUrl: string;
  link: string;
}

const CuratedShelf: React.FC = () => {
  // ... (all your state and functions for scrolling are unchanged) ...
  const [articles, setArticles] = useState<CuratedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchArticles = async () => {
      if (!API_BASE_URL) {
        console.error("API base URL is not configured.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/curated-articles`); 
        if (!response.ok) throw new Error('Failed to fetch curated content');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching curated articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [API_BASE_URL]);
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const newHasOverflow = scrollWidth > clientWidth;
      
      setHasOverflow(newHasOverflow);
      if (newHasOverflow) {
        setIsAtStart(scrollLeft < 5);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
      } else {
        setIsAtStart(true);
        setIsAtEnd(true);
      }
    };

    const observer = new ResizeObserver(checkScrollState);
    observer.observe(container);

    checkScrollState();
    container.addEventListener('scroll', checkScrollState, { passive: true });
    
    return () => {
        container.removeEventListener('scroll', checkScrollState);
        observer.disconnect();
    }
  }, [articles, isLoading]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.75;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };


  if (isLoading) {
    return <div className="h-48"></div>;
  }
  
  if (articles.length === 0) {
    return null;
  }

  let maskClass = '';
  if (hasOverflow) {
    if (!isAtStart && !isAtEnd) {
      maskClass = 'fade-mask-both';
    } else if (!isAtStart) {
      maskClass = 'fade-mask-left';
    } else {
      maskClass = 'fade-mask-right';
    }
  }

  // REMOVED: `mb-8 md:mb-12` is no longer on this section tag.
  return (
    <section className="w-full relative group">
      <div className="max-w-screen-2xl mx-auto">
        
        {hasOverflow && !isAtStart && (
          <button 
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-24 w-12 bg-black/30 hover:bg-black/60 text-white rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center"
            aria-label="Scroll left"
          >
            <ChevronLeft size={32} />
          </button>
        )}
        
        <div 
          ref={scrollContainerRef}
          className={`flex overflow-x-auto pb-4 gap-4 px-4 sm:px-6 lg:px-8 no-scrollbar ${maskClass}`}
        >
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {hasOverflow && !isAtEnd && (
          <button 
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-24 w-12 bg-black/30 hover:bg-black/60 text-white rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center"
            aria-label="Scroll right"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </section>
  );
};

export default CuratedShelf;