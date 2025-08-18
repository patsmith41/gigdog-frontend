// src/components/ui/TableOfContents.tsx
'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface TocLink {
  href: string; // The URL hash, e.g., "#parking-tips"
  label: string; // The text to display, e.g., "Parking Information & Tips"
}

interface TableOfContentsProps {
  links: TocLink[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ links }) => {
  // Don't render anything if there are no links
  if (!links || links.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-12">
      <h3 className="text-xl font-bold text-white mb-4">On This Page</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="flex justify-between items-center p-3 bg-neutral-800 rounded-lg hover:bg-indigo-600 group transition-colors"
            >
              <span className="font-semibold text-neutral-200 group-hover:text-white">{link.label}</span>
              <ChevronRight size={20} className="text-neutral-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;