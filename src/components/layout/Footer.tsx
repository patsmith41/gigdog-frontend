// src/components/layout/Footer.tsx
import Link from 'next/link';
import { Instagram } from 'lucide-react';

// A simple TikTok icon component
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.85-.38-6.75-1.77-1.26-.91-2.2-2.14-2.73-3.56s-.76-2.99-.76-4.5v-4.04c.57.02 1.14-.02 1.71-.02.02 4.73.01 9.46-.02 14.19.03 2.02 1.88 3.64 3.89 3.66 2.03.02 3.8-.87 4.54-2.82.09-.24.13-.5.17-.76.01-4.26.01-8.52.01-12.78-.01-.6-.11-1.19-.24-1.77-1.11-5.11-5.71-8.59-10.95-8.59-.01.02-.02.01-.02.01H.01V4.23c1.38.01 2.75-.04 4.13.02 1.13.05 2.25.32 3.3.76.6.26 1.18.59 1.72.98.09-2.2.03-4.4-.04-6.6z"/>
  </svg>
);


export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Navigation */}
          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">All Shows</Link></li>
              {/* --- FIX 1: Commented out unused links --- */}
              {/* <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li> */}
              {/* <li><Link href="/festivals/shaky-knees-2025" className="hover:text-white transition-colors">SHAKY KNEES</Link></li> */}
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 2: Social */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase">Follow Us</h3>
            <div className="flex mt-4 space-x-6">
                {/* --- FIX 2: Added correct URLs and removed Twitter --- */}
                <a href="https://www.instagram.com/gigdog_atl/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><span className="sr-only">Instagram</span><Instagram size={24} /></a>
                <a href="https://www.tiktok.com/@gigdog_atl" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><span className="sr-only">TikTok</span><TikTokIcon className="w-6 h-6" /></a>
            </div>
          </div>
          
          {/* Column 3: Legal & Disclaimer */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 tracking-wider uppercase">Disclaimer</h3>
            <p className="mt-4 text-xs leading-relaxed">
              Heads up! All prices shown are the 'starting at' cost and are not guaranteed to be available. They may not include service fees. Please see the official ticketing page for the most up-to-date pricing.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-xs">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>© {new Date().getFullYear()} GigDog. All Rights Reserved.</p>
            <div className="flex gap-4">
                <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}