// src/components/ui/ArticleCard.tsx
import React from 'react';
import Link from 'next/link';

interface ArticleCardProps {
  article: {
    badge: string;
    headline: string;
    subheadline: string;
    backgroundImageUrl: string;
    link: string;
  };
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    // CORRECTED: Added the `group` class here.
    <Link 
      href={article.link} 
      className="block w-64 md:w-72 flex-shrink-0 group transform transition-transform duration-300 ease-in-out hover:scale-110"
    >
      <div 
        // The `group-hover:shadow-xl` will now work correctly.
        className="relative h-40 rounded-lg overflow-hidden p-4 flex flex-col justify-end text-white shadow-lg bg-cover bg-center group-hover:shadow-xl"
        style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), transparent 50%), url(${article.backgroundImageUrl})` }}
      >
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">
          {article.badge}
        </div>
        <h3 className="text-lg font-bold leading-tight">{article.headline}</h3>
        <p className="text-sm font-light">{article.subheadline}</p>
      </div>
    </Link>
  );
};

export default ArticleCard;