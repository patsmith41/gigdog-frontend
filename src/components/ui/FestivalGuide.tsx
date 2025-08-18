// src/components/ui/FestivalGuide.tsx
'use client';

import Link from 'next/link';
import { Car, Music, Utensils, ShieldCheck, Map } from 'lucide-react';
import { trackClick } from '@/utils/analytics';
import type { LucideIcon } from 'lucide-react';

interface GuideLink {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

const guideLinks: GuideLink[] = [
    { href: '/festivals/shaky-knees-2025/guides/map', icon: Map, label: 'Festival Map', description: 'Find stages, restrooms & vendors.' },
    { href: '/festivals/shaky-knees-2025/guides/travel', icon: Car, label: 'Travel Guide', description: 'Parking, transit & lodging.' },
    // { href: '/festivals/shaky-knees-2025/guides/music', icon: Music, label: 'Music Guide', description: 'Features, picks & artist spotlights.' },
    { href: '/festivals/shaky-knees-2025/guides/food-guide', icon: Utensils, label: 'Food Guide', description: 'Best eats & festival dining.' },
    // { href: '/festivals/shaky-knees-2025/guides/survival-guide', icon: ShieldCheck, label: 'Survival Guide', description: 'Pro tips, what to bring, and more.' },
];

const FestivalGuide = () => {
    return (
        <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* --- THIS IS THE CHANGE --- */}
            {/* The grid now has 3 columns on large screens, not 5. */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* --- END OF CHANGE --- */}
                {guideLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-4 p-4 bg-neutral-800 rounded-xl hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-200"
                        onClick={() => trackClick({
                            linkType: 'get_directions',
                            targetUrl: link.href,
                            sourceComponent: `FestivalGuide-${link.label.replace(' ', '')}`,
                        })}
                    >
                        <div className="flex-shrink-0 bg-neutral-700 p-3 rounded-lg">
                            <link.icon size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">{link.label}</p>
                            <p className="text-sm text-neutral-400">{link.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default FestivalGuide;