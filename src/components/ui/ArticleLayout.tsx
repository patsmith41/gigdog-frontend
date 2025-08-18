// src/components/ui/ArticleLayout.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TableOfContents, { TocLink } from './TableOfContents';

interface ArticleLayoutProps {
  meta: {
    title: string;
    subTitle?: string;
    heroImageUrl: string;
    author?: string;
    publishDate?: string;
  };
  children: React.ReactNode;
  backLink: {
    href: string;
    label: string;
  };
  tocLinks?: TocLink[]; 
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ meta, children, backLink, tocLinks }) => {
  return (
    <main className="bg-neutral-950 text-white">
      {/* Header Section with Hero Image (no changes) */}
      <header 
        className="relative h-96 md:h-[500px] w-full flex items-end p-4 md:p-8 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), transparent 50%), url(${meta.heroImageUrl})` }}
      >
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white">{meta.title}</h1>
          {meta.subTitle && (<p className="mt-2 text-lg md:text-2xl text-neutral-300">{meta.subTitle}</p>)}
          {/* ... other meta info */}
        </div>
      </header>

      {/* Article Body Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Render the Table of Contents here, if links are provided */}
        {tocLinks && <TableOfContents links={tocLinks} />}

        {/* --- THIS IS THE FIX --- */}
        {/* The children (your <ArticleSection> components) are now direct descendants */}
        {children}
        {/* --- END OF FIX --- */}

        {/* Back Link at the end */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
            <Link href={backLink.href} className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
                <ArrowLeft size={18} /> {backLink.label}
            </Link>
        </div>
      </div>
    </main>
  );
};

export default ArticleLayout;