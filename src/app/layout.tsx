// src/app/layout.tsx
import './globals.css'; // Your global styles
import type { Metadata } from 'next';
import Header from '@/components/layout/Header'; // Your existing Header component

// Your metadata object - Next.js uses this to populate the <head>
export const metadata: Metadata = {
  title: 'GigDog - Concert Discovery',
  description: 'Find your next live show!',
  // You can add more global meta tags here if needed
  // e.g., icons, open graph defaults, etc.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      {/* 
        NO text nodes, spaces, newlines, or comments should be directly here
        between <html> and <body>.
        Next.js automatically handles the <head> element and its contents
        based on the 'metadata' export and child page/layout metadata.
      */}
      <body className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-indigo-500 selection:text-white">
        <Header />
        
        {/* This div will contain the main page content rendered by {children} */}
        <div className="flex-grow w-full">
          {children}
        </div>
        
        {/* You could add a global Footer component here later if desired */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}