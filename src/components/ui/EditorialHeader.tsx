// src/components/ui/EditorialHeader.tsx
'use client';

import React from 'react';
import Link from 'next/link';

// --- Reusable Sub-Components for Clarity ---

const ArticleLinks = () => {
  // Data for the articles can be managed here or passed as props
  const articles = [
    {
      title: "This Week's Ultimate Guide",
      description: "Our weekly roundup of the best deals and can't-miss shows.",
      link: "/articles/this-week-in-atlanta"
    },
    {
      title: "A Deep Dive: The Story of The Earl",
      description: "An inside look at the history of the legendary Atlanta venue.",
      link: "/articles/story-of-the-earl"
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">This Week on GigDog</h2>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <Link key={index} href={article.link} className="block group">
            <h3 className="text-lg font-semibold text-neutral-100 group-hover:text-indigo-400 transition-colors">
              {article.title} →
            </h3>
            <p className="text-neutral-400 text-sm">{article.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

const EmailSignup = () => {
  return (
    <div className="bg-neutral-800/50 p-6 rounded-lg h-full">
      <h2 className="text-xl font-bold text-white mb-2">Get Weekly Show Alerts</h2>
      <p className="text-neutral-400 text-sm mb-4">
        Receive our top concert picks every Friday morning.
      </p>
      <form className="flex flex-col sm:flex-row items-center gap-2" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="email" 
          placeholder="your.email@example.com"
          className="w-full sm:flex-grow min-w-0 p-2 border border-neutral-600 rounded bg-neutral-700 text-sm text-neutral-100 placeholder-neutral-500"
          aria-label="Email Address"
        />
        <button type="submit" className="w-full sm:w-auto flex-shrink-0 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded text-sm font-semibold transition-colors duration-300">
          Sign Up
        </button>
      </form>
    </div>
  );
};


// --- The Main EditorialHeader Component ---

const EditorialHeader = () => {
  return (
    <section className="w-full py-8 md:py-12">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* The two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Article Links (takes up 2/3 of the space on desktop) */}
          <div className="lg:col-span-2">
            <ArticleLinks />
          </div>

          {/* Right Column: Email Signup (takes up 1/3 of the space on desktop) */}
          <div>
            <EmailSignup />
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default EditorialHeader;