// src/components/layout/Header.tsx
import React from 'react';
import Link from 'next/link';
import { Music2 } from 'lucide-react'; // Example icon

const Header = () => {
  return (
    <header className="bg-neutral-900 dark:bg-black text-neutral-100 sticky top-0 z-50 shadow-lg">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white hover:text-indigo-300 transition-colors">
              <Music2 size={28} className="text-indigo-400" />
              Gig Dog LIVE
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
            <span className="text-sm text-neutral-400">(Nav Links Placeholder)</span>
          </nav>
          <div className="flex items-center">
            {/* Placeholder for future theme toggle or login button */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;