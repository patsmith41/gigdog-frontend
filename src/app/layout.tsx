// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: 'GigDog - Concert Discovery',
  description: 'Find your next live show!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>{/* NO SPACE OR NEWLINE AFTER THIS > */}
      {/* Next.js will inject <head> content here. Do not add <head> manually unless necessary for specific cases not covered by Metadata API. */}
      <body 
        className={`
          bg-background text-foreground font-sans leading-relaxed {/* <--- ADD leading-normal OR leading-relaxed */}
          flex flex-col min-h-screen 
          selection:bg-indigo-500 selection:text-white
        `}
      >{/* NO SPACE OR NEWLINE AFTER THIS > */}
        <Header />
        <main className="flex-grow w-full">{children}</main>
        <Footer /> 
      </body>{/* NO SPACE OR NEWLINE BEFORE THIS < */}
    </html>// NO SPACE OR NEWLINE AFTER THIS ;
  );
}