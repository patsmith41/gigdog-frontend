// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header'; // Your CURRENT Header.tsx

export const metadata: Metadata = {
  title: 'GigDog - Concert Discovery',
  description: 'Find your next live show!',
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-indigo-500 selection:text-white">
        <Header /> {/* Your current Header component */}
        <div className="flex-grow w-full">
          {children} {/* page.tsx will render here */}
        </div>
      </body>
    </html>
  );
}