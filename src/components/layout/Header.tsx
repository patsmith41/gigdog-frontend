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
          <span className="text-sm text-red-500">Nav</span>
          <h1 className="text-xxl">Testing XXL</h1>

        </div>
        <div className="p-4 bg-brand-primary text-white my-4"> This should have a custom brand primary background. </div> <div className="p-4 bg-brand-secondary text-black my-4"> This should have a custom brand secondary background. </div>
      </nav>
    </header>
  );
};

export default Header;