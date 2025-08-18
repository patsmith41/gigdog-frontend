// src/components/layout/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Instagram } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // --- MODIFIED: Added 'Venues' link ---
  const navLinks = [
    { href: '/venues', label: 'Venues' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const renderLink = (link: { href: string; label: string }) => {
    const isActive = pathname.startsWith(link.href);
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={closeMobileMenu}
        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-neutral-800 text-white'
            : 'text-white hover:bg-neutral-800'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <header className="bg-neutral-900/80 dark:bg-black/80 backdrop-blur-sm text-neutral-100 sticky top-0 z-50 border-b border-neutral-800">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0">
            <Link href="/" onClick={closeMobileMenu} className="text-3xl font-extrabold text-white hover:text-neutral-300 transition-colors tracking-tight">
              GIG DOG
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-2">
              <Link
                href="/festivals/shaky-knees-2025"
                className="px-4 py-2 bg-white text-black text-base font-semibold rounded-md hover:bg-neutral-300 transition-colors"
              >
                Shaky Knees Guide
              </Link>
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive ? 'bg-neutral-800 text-white' : 'text-white hover:bg-neutral-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <a href="https://instagram.com/gigdog_atl/" target="_blank" rel="noopener noreferrer" aria-label="GigDog on Instagram" className="p-2 text-white hover:text-neutral-300">
              <Instagram size={24} />
            </a>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <a href="https://instagram.com/gigdog_atl/" target="_blank" rel="noopener noreferrer" aria-label="GigDog on Instagram" className="p-2 rounded-md text-white hover:text-neutral-300 hover:bg-neutral-800">
              <Instagram size={24} />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-white hover:text-neutral-300 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-neutral-800">
            <Link
              href="/festivals/shaky-knees-2025"
              onClick={closeMobileMenu}
              className="block w-full text-left px-3 py-2 mb-2 bg-white text-black text-base font-semibold rounded-md hover:bg-neutral-300 transition-colors"
            >
              Shaky Knees Guide
            </Link>
            {navLinks.map(renderLink)}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;