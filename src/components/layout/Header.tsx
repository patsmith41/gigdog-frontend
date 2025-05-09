// src/components/layout/Header.tsx
import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-40">
      <nav className="max-w-full mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          GigDog {/* Replace with Logo later */}
        </Link>
        <div>
          {/* Navigation Links Placeholder */}
          <span className="text-sm text-gray-400">Nav</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;